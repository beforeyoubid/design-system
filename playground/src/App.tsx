import * as React from 'react'
import { ValueControl, Swatch, typeHint } from './controls'
import { pairsFor, semanticPairs, type Pair } from './contrast'
import { storiesByComponent, StoryBoundary } from './stories'
import {
  describeValue,
  exportCss,
  importCss,
  manifest,
  prettyVar,
  titleCase,
  type ComponentToken,
  type Overrides,
} from './tokens'

type View = { kind: 'global' } | { kind: 'semantic'; name?: string } | { kind: 'component'; name: string }

const STORAGE = 'byb-levers:overrides'
const load = (): Overrides => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE) ?? '{}')
  } catch {
    return {}
  }
}

const componentNames = manifest.components.map((c) => c.component)
const tokenIndex = new Map(manifest.components.flatMap((c) => c.tokens.map((t) => [t.name, { ...t, component: c.component }] as const)))

// ---------------------------------------------------------------------------
export function App() {
  const [overrides, setOverrides] = React.useState<Overrides>(load)
  const [view, setView] = React.useState<View>(() => ({ kind: 'component', name: componentNames.includes('button') ? 'button' : componentNames[0] }))
  const [query, setQuery] = React.useState('')
  const [exportOpen, setExportOpen] = React.useState(false)
  const [tick, setTick] = React.useState(0)

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(overrides))
    } catch {
      /* Storage can be unavailable; the page still works for this visit. */
    }
    // Contrast reads computed styles, so recompute after the style tag updates.
    requestAnimationFrame(() => setTick((t) => t + 1))
  }, [overrides])

  const set = (name: string, value: string | null) =>
    setOverrides((o) => {
      const next = { ...o }
      if (value === null) delete next[name]
      else next[name] = value
      return next
    })

  const css = React.useMemo(() => exportCss(overrides), [overrides])
  const changed = Object.keys(overrides).length
  const changedIn = (component: string) => manifest.components.find((c) => c.component === component)!.tokens.filter((t) => t.name in overrides).length

  const q = query.trim().toLowerCase()
  const matches = (s: string) => !q || s.toLowerCase().includes(q)
  const visibleComponents = manifest.components.filter((c) => matches(c.component) || c.tokens.some((t) => matches(t.description) || matches(t.name)))

  return (
    <div className="pg">
      <style>{css}</style>

      <header className="pg-top">
        <div className="pg-brand">
          <span className="pg-brand-mark" aria-hidden="true" />
          <h1>BYB Design Levers</h1>
        </div>
        <label className="pg-search">
          <span className="pg-visually-hidden">Find a component or lever</span>
          <input id="pg-search" type="search" placeholder="Find a component or lever, e.g. radius" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <button type="button" className="pg-export-button" onClick={() => setExportOpen(true)}>
          <span className="pg-count" data-active={changed > 0}>{changed}</span>
          {changed === 1 ? 'change' : 'changes'} · Export
        </button>
      </header>

      <nav className="pg-nav" aria-label="What to change">
        <button type="button" className="pg-nav-item" aria-current={view.kind === 'global'} onClick={() => setView({ kind: 'global' })}>
          Global look
          <small>Corners, spacing and type sizes everywhere</small>
        </button>
        <button type="button" className="pg-nav-item" aria-current={view.kind === 'semantic'} onClick={() => setView({ kind: 'semantic' })}>
          Colour roles
          <small>Primary, accent, destructive… shared by many components</small>
        </button>
        <p className="pg-nav-heading">Components</p>
        <ul>
          {visibleComponents.map((c) => {
            const n = changedIn(c.component)
            return (
              <li key={c.component}>
                <button type="button" className="pg-nav-comp" aria-current={view.kind === 'component' && view.name === c.component} onClick={() => setView({ kind: 'component', name: c.component })}>
                  <span>{titleCase(c.component)}</span>
                  {n > 0 && <span className="pg-mini-count">{n}</span>}
                </button>
              </li>
            )
          })}
          {!visibleComponents.length && <li className="pg-empty">No component matches "{query}".</li>}
        </ul>
      </nav>

      <main className="pg-controls" aria-label="Levers">
        {view.kind === 'global' && <GlobalLook overrides={overrides} set={set} />}
        {view.kind === 'semantic' && <SemanticRoles overrides={overrides} set={set} onOpen={(name) => setView({ kind: 'component', name })} tick={tick} />}
        {view.kind === 'component' && (
          <ComponentLevers name={view.name} overrides={overrides} set={set} query={q} />
        )}
      </main>

      <section className="pg-preview" aria-label="Live preview">
        {view.kind === 'component' && <ContrastStrip pairs={pairsFor(view.name)} key={`${view.name}-${tick}`} />}
        <Canvas components={view.kind === 'component' ? [view.name] : view.kind === 'semantic' ? ['button', 'badge', 'dropdown-menu', 'alert', 'input', 'tabs'] : ['button', 'card', 'input', 'select', 'badge', 'tabs']} />
      </section>

      {exportOpen && <ExportPanel css={css} changed={changed} onClose={() => setExportOpen(false)} onImport={(o) => setOverrides(o)} onReset={() => setOverrides({})} />}
    </div>
  )
}

// ---------------------------------------------------------------------------
function Row({ id, label, hint, type, name, defaultValue, overrides, set, max }: {
  id: string
  label: string
  hint?: string
  type: ComponentToken['type']
  name: string
  defaultValue: string
  overrides: Overrides
  set: (name: string, v: string | null) => void
  max?: number
}) {
  const changed = name in overrides
  const value = overrides[name] ?? defaultValue
  return (
    <div className="pg-row" data-changed={changed}>
      <div className="pg-row-text">
        <label htmlFor={id}>{label}</label>
        <p className="pg-row-meta">
          {hint ?? typeHint[type]} · Rey's default: {describeValue(type, defaultValue)}
        </p>
      </div>
      <div className="pg-row-control">
        <ValueControl type={type} id={id} value={value} onChange={(v) => set(name, v === defaultValue ? null : v)} max={max} />
        <button type="button" className="pg-reset" disabled={!changed} onClick={() => set(name, null)} aria-label={`Reset ${label}`}>
          Reset
        </button>
      </div>
      <code className="pg-row-name" title="The name to use in code">{name}</code>
    </div>
  )
}

// ---------------------------------------------------------------------------
function GlobalLook({ overrides, set }: { overrides: Overrides; set: (n: string, v: string | null) => void }) {
  const px = (v: string) => (v.endsWith('rem') ? `${parseFloat(v) * 16}px` : v)
  return (
    <>
      <Intro title="Global look" text="These change every component at once. A component lever, where one is set, wins over these." />
      <h3 className="pg-group">Corner radius scale</h3>
      {manifest.brand.radius
        .filter((r) => r.name !== '--radius-full')
        .map((r) => (
          <Row key={r.name} id={`g${r.name}`} label={`Radius ${r.name.replace('--radius-', '')}`} hint="Used wherever a component asks for this step" type="length" name={r.name} defaultValue={px(r.value)} overrides={overrides} set={(n, v) => set(n, v && v.replace(/^calc\(var\(--spacing\) \* ([\d.]+)\)$/, (_, k) => `${+k * 4}px`))} max={40} />
        ))}
      <h3 className="pg-group">Type sizes</h3>
      {manifest.brand.text.map((t) => (
        <Row key={t.name} id={`g${t.name}`} label={prettyVar(t.name).replace('Text ', '')} hint="Font size" type="length" name={t.name} defaultValue={t.value} overrides={overrides} set={(n, v) => set(n, v && v.replace(/^calc\(var\(--spacing\) \* ([\d.]+)\)$/, (_, k) => `${+k * 4}px`))} max={80} />
      ))}
    </>
  )
}

// ---------------------------------------------------------------------------
function SemanticRoles({ overrides, set, onOpen, tick }: { overrides: Overrides; set: (n: string, v: string | null) => void; onOpen: (c: string) => void; tick: number }) {
  const pairs = React.useMemo(() => semanticPairs(), [tick])
  return (
    <>
      <Intro title="Colour roles" text="A role is a colour many components share. Change one here and every component that follows it changes too. Component levers set to a specific colour don't follow." />
      {manifest.semantic.map((s) => {
        const pair = pairs.find((p) => p.fg === s.name)
        return (
          <div key={s.name} className="pg-role">
            <Row id={`s${s.name}`} label={prettyVar(s.name)} hint="Colour role" type="color" name={s.name} defaultValue={s.value} overrides={overrides} set={set} />
            <div className="pg-role-meta">
              {pair && <Verdict ratio={pair.ratio} label={`on ${prettyVar(pair.bg)}`} />}
              {s.usedBy.length > 0 && (
                <p>
                  Used by{' '}
                  {s.usedBy.filter((c) => componentNames.includes(c)).map((c) => (
                    <button key={c} type="button" className="pg-link" onClick={() => onOpen(c)}>
                      {titleCase(c)}
                    </button>
                  ))}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </>
  )
}

// ---------------------------------------------------------------------------
const partLabel = (component: string, part: string) => (part === component ? titleCase(component) : titleCase(part.replace(component + '-', '')))

function ComponentLevers({ name, overrides, set, query }: { name: string; overrides: Overrides; set: (n: string, v: string | null) => void; query: string }) {
  const comp = manifest.components.find((c) => c.component === name)!
  const tokens = comp.tokens.filter((t) => !query || t.description.toLowerCase().includes(query) || t.name.includes(query) || name.includes(query))
  const parts = [...new Set(tokens.map((t) => t.part))]
  return (
    <>
      <Intro title={titleCase(name)} text={`${comp.tokens.length} levers.`} />
      {parts.map((part) => {
        const inPart = tokens.filter((t) => t.part === part)
        const groups = [...new Set(inPart.map((t) => t.variant ?? ''))]
        return (
          <section key={part} className="pg-part">
            <h3 className="pg-group">{partLabel(name, part)}</h3>
            {groups.map((g) => (
              <div key={g} className="pg-variant">
                {g && <h4>{titleCase(g)} {inPart.find((t) => t.variant === g && ['height', 'padding-x', 'radius', 'size', 'gap'].includes(t.property)) && !inPart.find((t) => t.variant === g && t.property === 'fill') ? 'size' : 'style'}</h4>}
                {inPart
                  .filter((t) => (t.variant ?? '') === g)
                  .map((t) => (
                    <Row key={t.name} id={t.name} label={t.description.replace(/\.$/, '')} type={t.type} name={t.name} defaultValue={t.default} overrides={overrides} set={set} />
                  ))}
              </div>
            ))}
          </section>
        )
      })}
    </>
  )
}

// ---------------------------------------------------------------------------
function Verdict({ ratio, label }: { ratio: number; label: string }) {
  const pass = ratio >= 4.5
  return (
    <span className="pg-verdict" data-pass={pass} title="WCAG AA needs 4.5:1 for body-size text">
      {pass ? 'Passes AA' : 'Fails AA'} · {ratio.toFixed(2)}:1 {label}
    </span>
  )
}

/** A failing pair already listed in contrast-exceptions.json (the checker's record of it). */
const knownPair = (p: Pair) => manifest.contrastExceptions.find((e) => e.foreground === p.fg.private && e.fill === p.bg.private)

function ContrastStrip({ pairs }: { pairs: Pair[] }) {
  if (!pairs.length) return null
  const failing = pairs.filter((p) => p.ratio < 4.5)
  return (
    <details className="pg-contrast" open={failing.length > 0}>
      <summary>
        Text contrast: {failing.length ? `${failing.length} of ${pairs.length} pairs fail WCAG AA` : `all ${pairs.length} pairs pass WCAG AA`}
      </summary>
      <ul>
        {pairs.map((p) => (
          <li key={p.fg.name}>
            <span className="pg-pair" style={{ color: p.fgCss, background: p.bgCss }}>Aa</span>
            <span className="pg-pair-text">
              {p.fg.description.replace(/\.$/, '')}
              {p.ratio < 4.5 && knownPair(p) && (
                <span className="pg-pair-note" data-status={knownPair(p)!.status}>
                  <strong>{knownPair(p)!.status === 'undecided' ? 'Yours to decide. ' : 'Accepted. '}</strong>
                  {knownPair(p)!.note}
                </span>
              )}
            </span>
            <Verdict ratio={p.ratio} label="" />
          </li>
        ))}
      </ul>
    </details>
  )
}

// ---------------------------------------------------------------------------
function Canvas({ components }: { components: string[] }) {
  const sets = components.map((c) => ({ c, stories: storiesByComponent.get(c) ?? [] }))
  return (
    <div className="pg-canvas">
      {sets.map(({ c, stories }) => (
        <div key={c} className="pg-canvas-group">
          {components.length > 1 && <h3 className="pg-canvas-title">{titleCase(c)}</h3>}
          {!stories.length && <p className="pg-empty">No examples for {titleCase(c)} yet.</p>}
          {stories.slice(0, components.length > 1 ? 2 : 40).map(({ id, name, Story }) => (
            <figure key={id} className="pg-story">
              <figcaption>{name}</figcaption>
              <div className="pg-story-stage">
                <StoryBoundary>
                  <Story />
                </StoryBoundary>
              </div>
            </figure>
          ))}
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
function ExportPanel({ css, changed, onClose, onImport, onReset }: { css: string; changed: number; onClose: () => void; onImport: (o: Overrides) => void; onReset: () => void }) {
  const [copied, setCopied] = React.useState(false)
  const [pasting, setPasting] = React.useState(false)
  const [paste, setPaste] = React.useState('')
  const [confirmReset, setConfirmReset] = React.useState(false)
  const pre = React.useRef<HTMLPreElement>(null)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(css)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      const sel = window.getSelection()
      const range = document.createRange()
      if (pre.current && sel) {
        range.selectNodeContents(pre.current)
        sel.removeAllRanges()
        sel.addRange(range)
      }
    }
  }
  const unknown = Object.keys(importCss(paste)).filter((n) => !tokenIndex.has(n) && !manifest.semantic.some((s) => s.name === n) && !/^--(radius|text)-/.test(n))
  return (
    <div className="pg-sheet-backdrop" onClick={onClose}>
      <aside className="pg-sheet" role="dialog" aria-modal="true" aria-label="Export your changes" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>Your changes</h2>
          <button type="button" className="pg-close" onClick={onClose} aria-label="Close">×</button>
        </header>
        <p>
          {changed ? `${changed} ${changed === 1 ? 'value' : 'values'} changed from Rey's defaults.` : 'Nothing changed yet.'} Copy this and send it to Dean; an app pastes it after importing the design system.
        </p>
        <pre ref={pre} className="pg-css">{css}</pre>
        <div className="pg-sheet-actions">
          <button type="button" className="pg-primary" onClick={copy}>{copied ? 'Copied' : 'Copy CSS'}</button>
          <button type="button" onClick={() => setPasting((p) => !p)}>Load changes…</button>
          {!confirmReset ? (
            <button type="button" disabled={!changed} onClick={() => setConfirmReset(true)}>Reset everything</button>
          ) : (
            <span className="pg-confirm">
              Reset all {changed}?{' '}
              <button type="button" className="pg-danger" onClick={() => { onReset(); setConfirmReset(false) }}>Reset</button>
              <button type="button" onClick={() => setConfirmReset(false)}>Keep</button>
            </span>
          )}
        </div>
        {pasting && (
          <div className="pg-import">
            <label htmlFor="pg-import">Paste a block you exported before. It replaces the current changes.</label>
            <textarea id="pg-import" rows={6} value={paste} onChange={(e) => setPaste(e.target.value)} placeholder=":root { --button-radius: 8px; }" />
            {unknown.length > 0 && <p className="pg-warn">Not levers in this version, so they'll be kept but have no effect: {unknown.join(', ')}</p>}
            <button type="button" className="pg-primary" disabled={!paste.trim()} onClick={() => { onImport(importCss(paste)); setPasting(false); setPaste('') }}>
              Load these changes
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}

function Intro({ title, text }: { title: string; text: string }) {
  return (
    <div className="pg-intro">
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  )
}

export { Swatch }
