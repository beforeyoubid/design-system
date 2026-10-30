#!/usr/bin/env node
/**
 * `pnpm console`: the Design Console at http://localhost:6010, kept in step
 * with the token files. A save to a token file (or globals.css) re-runs
 * tokens:apply and tokens:build, so a new component token reaches the ui
 * classes and the console's manifest; Vite then reloads the page. New stories
 * show up on their own.
 */
import { spawn, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const tokenDir = path.join(root, 'src', 'tokens', 'components')
const node = ['--experimental-strip-types', '--no-warnings']

function rebuild(reason) {
  if (reason) console.log(`\n↻ ${reason} changed: applying and rebuilding component tokens`)
  for (const script of ['apply.mjs', 'build.mjs']) {
    const run = spawnSync(process.execPath, [...node, path.join(root, 'scripts', 'tokens', script)], { cwd: root, stdio: 'inherit' })
    if (run.status !== 0) return console.error(`✖ ${script} failed; fix the token file and save again.`)
  }
}

rebuild()

let timer
const queue = (reason) => {
  clearTimeout(timer)
  timer = setTimeout(() => rebuild(reason), 150)
}
// index.css is written by the build itself, so a change to it isn't a reason to rebuild.
fs.watch(tokenDir, (_, file) => file && file.endsWith('.css') && file !== 'index.css' && queue(file))
fs.watch(path.join(root, 'globals.css'), () => queue('globals.css'))

const vite = spawn(path.join(root, 'node_modules', '.bin', 'vite'), ['--config', 'console/vite.config.ts'], { cwd: root, stdio: 'inherit' })
vite.on('exit', (code) => process.exit(code ?? 0))
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => vite.kill(signal))
