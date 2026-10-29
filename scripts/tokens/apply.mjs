#!/usr/bin/env node
/**
 * Post-regenerate script. Run after `npx shadcn add <every ui component> --overwrite`:
 *
 *   node scripts/tokens/apply.mjs           rewrite src/components/ui/*.tsx in place
 *   node scripts/tokens/apply.mjs --check   fail if any ui file is out of step with the token files
 *
 * It
 *   1. rewrites the CLI's `import { cn } from "cn"` to our helper (`@/lib/utils`);
 *   2. applies the class edits each token file implies: every lever token replaces
 *      the class that sets the same property in the same state on its part, and the
 *      @add / @remove directives restore the design's classes that aren't levers.
 *
 * Running it twice changes nothing.
 */
import fs from 'node:fs'
import path from 'node:path'
import {
  addClass,
  applyToken,
  findSites,
  parseTokenFile,
  parseTokenName,
  removeClass,
  sameGroup,
  splitVariant,
  tokenFiles,
  uiDir,
} from './lib.mjs'

const check = process.argv.includes('--check')
const errors = []

const uiFiles = fs.readdirSync(uiDir).filter((f) => f.endsWith('.tsx')).sort()
const sources = new Map(uiFiles.map((f) => [f, fs.readFileSync(path.join(uiDir, f), 'utf8')]))
const original = new Map(sources)

// 1. cn import
for (const [f, src] of sources) {
  sources.set(f, src.replace(/import \{ cn \} from ["']cn["']/g, 'import { cn } from "@/lib/utils"'))
}

// 2. class edits, collected per ui file as edits to string literals
for (const { component, file } of tokenFiles()) {
  const { rules } = parseTokenFile(file)
  for (const rule of rules) {
    // The part normally lives in ui/<component>.tsx; otherwise look everywhere.
    const candidates = [`${component}.tsx`, ...uiFiles.filter((f) => f !== `${component}.tsx`)]
    const uiFile = candidates.find((f) => sources.has(f) && findSites(sources.get(f), f).slots.has(rule.slot))
    const ownedOnly = rule.tokens.every((t) => t.ours) && !rule.add.length && !rule.remove.length
    if (!uiFile) {
      if (!ownedOnly) errors.push(`${component}.css: no ui file renders data-slot="${rule.slot}"`)
      continue
    }
    // Re-read sites after each rule so positions stay valid.
    const literalFor = (src, site, variant) => {
      const { slots, cvas } = findSites(src, uiFile)
      const slot = slots.get(rule.slot)
      const cva = slot.cva ? cvas.get(slot.cva) : null
      if (variant) {
        if (variant.unresolved) return { error: `"${variant.unresolved}" is not a cva key or @alias on data-slot="${rule.slot}"` }
        const l = cva?.keys.get(`${variant.group}.${variant.key}`)
        return l ? { lit: l } : { error: `${slot.cva ?? 'no cva'} has no ${variant.group}.${variant.key}` }
      }
      // A part styled by a cva helper keeps its own classes in the cva base.
      if (cva?.base) return { lit: cva.base }
      if (slot.base.length) return { lit: slot.base[0] }
      return { error: `data-slot="${rule.slot}" has no class string to edit` }
    }
    const edit = (label, variant, fn) => {
      const src = sources.get(uiFile)
      const { lit, error } = literalFor(src, null, variant)
      if (error) return errors.push(`${component}.css: ${label}: ${error}`)
      if (lit.start < 0) return errors.push(`${component}.css: ${label}: the class string is a constant, not a literal; inline it`)
      const next = fn(lit.text)
      if (next !== lit.text) sources.set(uiFile, src.slice(0, lit.start) + next + src.slice(lit.end))
    }
    // @remove on the base reaches every class string of the part: stock often
    // splits one element's classes over several literals in its cn() call.
    const editEveryBase = (label, fn) => {
      const count = findSites(sources.get(uiFile), uiFile).slots.get(rule.slot).allLits.length
      if (!count) return edit(label, null, fn)
      for (let i = 0; i < count; i++) {
        const src = sources.get(uiFile)
        const lit = findSites(src, uiFile).slots.get(rule.slot).allLits[i]
        if (!lit || lit.start < 0) continue
        const next = fn(lit.text)
        if (next !== lit.text) sources.set(uiFile, src.slice(0, lit.start) + next + src.slice(lit.end))
      }
    }
    // Every plain string in the part's cn() call applies, and a later one wins in cn.
    // Once a lever class is in place, drop the classes in the part's other strings that
    // set the same property under the same condition, or they'd override the lever.
    const dropConflicts = (keep) => (s) => {
      const list = s.split(/\s+/).filter(Boolean)
      const kept = list.filter((c) => {
        if (keep.includes(c)) return true
        const [pc, bc] = splitVariant(c)
        return !keep.some((k) => {
          const [pk, bk] = splitVariant(k)
          return pk === pc && sameGroup(bc, bk)
        })
      })
      return kept.length === list.length ? s : kept.join(' ')
    }
    const leverClassesIn = (variant, name) => {
      const { lit } = literalFor(sources.get(uiFile), null, variant)
      return lit ? lit.text.split(/\s+/).filter((c) => c.includes(`(${name})`)) : []
    }
    const keysFor = () => {
      const { slots, cvas } = findSites(sources.get(uiFile), uiFile)
      const c = slots.get(rule.slot)?.cva
      return c ? [...(cvas.get(c)?.keys.keys() ?? [])] : []
    }
    const siteVariant = (site) => {
      if (site === 'base') return null
      if (rule.aliases[site]) return rule.aliases[site]
      const [group, ...key] = site.split('.')
      return key.length ? { group, key: key.join('.') } : { unresolved: site }
    }

    for (const d of rule.remove) {
      const remove = (s) => d.classes.reduce(removeClass, s)
      if (d.site === 'base') editEveryBase(`@remove ${d.site}`, remove)
      else edit(`@remove ${d.site}`, siteVariant(d.site), remove)
    }
    for (const t of rule.tokens) {
      // Ours, or read by a class this rule @adds (e.g. on a child): nothing to apply.
      if (t.ours || rule.add.some((d) => d.classes.some((c) => c.includes(`(${t.name})`)))) continue
      let parsed
      try {
        parsed = parseTokenName(t, rule, keysFor())
      } catch (e) {
        errors.push(`${component}.css:${t.line}: ${e.message}`)
        continue
      }
      edit(t.name, parsed.variant, (s) => applyToken(s, { name: t.name, part: rule.slot, hints: rule.add.flatMap((d) => d.classes), ...parsed }))
      if (!parsed.variant) {
        const keep = leverClassesIn(null, t.name)
        if (keep.length) editEveryBase(`${t.name} (other strings)`, dropConflicts(keep))
      }
    }
    for (const d of rule.add) {
      edit(`@add ${d.site}`, siteVariant(d.site), (s) => d.classes.reduce(addClass, s))
      if (d.site === 'base') editEveryBase(`@add ${d.site} (other strings)`, dropConflicts(d.classes))
    }
  }
}

if (errors.length) {
  console.error(errors.map((e) => `✖ ${e}`).join('\n'))
  process.exit(1)
}

const changed = [...sources].filter(([f, src]) => src !== original.get(f)).map(([f]) => f)
if (check) {
  if (changed.length) {
    console.error(`✖ ui files out of step with the token files (run node scripts/tokens/apply.mjs):\n  ${changed.join('\n  ')}`)
    process.exit(1)
  }
  console.log('✅ ui files match the token files.')
} else {
  for (const f of changed) fs.writeFileSync(path.join(uiDir, f), sources.get(f))
  console.log(changed.length ? `Updated ${changed.length} ui files: ${changed.join(', ')}` : 'ui files already match the token files.')
}
