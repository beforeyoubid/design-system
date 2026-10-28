#!/usr/bin/env node
/**
 * Folds the playground build (playground/dist) into one self-contained HTML
 * page, playground/dist/levers.html, for publishing as a Claude artifact:
 * the CSS and JS are inlined; fonts come from Google Fonts.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'playground', 'dist')
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const read = (href) => fs.readFileSync(path.join(dist, href.replace(/^\.\//, '')), 'utf8')
const css = [...html.matchAll(/<link rel="stylesheet"[^>]*href="(\.\/assets\/[^"]+\.css)"[^>]*>/g)].map((m) => read(m[1])).join('\n')
const js = [...html.matchAll(/<script type="module"[^>]*src="(\.\/assets\/[^"]+\.js)"[^>]*><\/script>/g)].map((m) => read(m[1])).join('\n')
const fonts = html.match(/<link rel="stylesheet" href="https:\/\/fonts[^>]+>/)?.[0] ?? ''
const page = `<title>BYB Design Levers</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fonts}
<style>${css}</style>
<div id="root"></div>
<script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>
`
fs.writeFileSync(path.join(dist, 'levers.html'), page)
console.log(`Wrote playground/dist/levers.html (${(page.length / 1024 / 1024).toFixed(2)} MB)`)
