#!/usr/bin/env node
/**
 * Folds the playground build (playground/dist) into one self-contained HTML
 * page, playground/dist/levers.html, for publishing as a Claude artifact:
 * the CSS and JS are inlined; fonts come from Google Fonts. Every non-ASCII
 * character in the JS is written as a \uXXXX escape, so the script parses
 * whatever charset the page is served with, and no literal U+FFFD reaches the
 * publisher (which rejects it as a sign of a lost character).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'playground', 'dist')
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const read = (href) => fs.readFileSync(path.join(dist, href.replace(/^\.\//, '')), 'utf8')
const css = [...html.matchAll(/<link rel="stylesheet"[^>]*href="(\.\/assets\/[^"]+\.css)"[^>]*>/g)].map((m) => read(m[1])).join('\n')
const js = [...html.matchAll(/<script type="module"[^>]*src="(\.\/assets\/[^"]+\.js)"[^>]*><\/script>/g)].map((m) => read(m[1])).join('\n')
// Escapes are valid in strings, templates, regexes (a surrogate pair reads as
// one code point under /u) and identifiers.
const ascii = (code) => code.replace(/[^\x00-\x7f]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`)
const fonts = html.match(/<link rel="stylesheet" href="https:\/\/fonts[^>]+>/)?.[0] ?? ''
const page = `<title>BYB Design Console</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fonts}
<style>${css}</style>
<div id="root"></div>
<script type="module">${ascii(js.replace(/<\/script/gi, '<\\/script'))}</script>
`
fs.writeFileSync(path.join(dist, 'levers.html'), page)
console.log(`Wrote playground/dist/levers.html (${(page.length / 1024 / 1024).toFixed(2)} MB)`)
