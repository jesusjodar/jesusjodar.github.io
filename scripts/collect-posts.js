#!/usr/bin/env node
/**
 * Recolecta posts/*.md a src/lib/posts.json para la pestaña del blog.
 *
 * Formato de cada .md: primera línea = título (se admite '# Título'),
 * resto de líneas = cuerpo en markdown. Fechas de la metadata del
 * archivo: creación (birthtime, con fallback a mtime) y modificación
 * (mtime, por si se edita un post). Orden: modificación descendente.
 *
 * Se ejecuta solo en predev/prebuild: el bundle importa el JSON ya
 * generado, sin leer el sistema de ficheros en runtime.
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const dir = path.join(root, 'posts')
const out = path.join(root, 'src', 'lib', 'posts.json')

const files = existsSync(dir)
  ? readdirSync(dir)
      .filter((f) => f.toLowerCase().endsWith('.md'))
      .sort()
  : []

const posts = []
for (const file of files) {
  const abs = path.join(dir, file)
  const st = statSync(abs)
  const lines = readFileSync(abs, 'utf8').split(/\r?\n/)
  const title = (lines[0] ?? '').replace(/^#{1,6}\s*/, '').trim()
  const body = lines.slice(1).join('\n').trim()
  if (!title) continue
  const created = st.birthtimeMs > 0 ? st.birthtimeMs : st.mtimeMs
  posts.push({
    slug: path.basename(file, '.md'),
    title,
    body,
    created: new Date(created).toISOString(),
    updated: new Date(st.mtimeMs).toISOString(),
  })
}
posts.sort((a, b) => (a.updated < b.updated ? 1 : -1))

mkdirSync(path.dirname(out), { recursive: true })
writeFileSync(out, JSON.stringify(posts, null, 2) + '\n')
console.log(`posts: ${posts.length} -> src/lib/posts.json`)
