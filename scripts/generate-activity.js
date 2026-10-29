import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const { github } = JSON.parse(await readFile(new URL('src/data/profile.json', root), 'utf8'))
assert(/^[a-z\d-]+$/i.test(github), 'Usuario de GitHub no válido')
const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date())
const get = (type) => parts.find(part => part.type === type).value
const to = `${get('year')}-${get('month')}-${get('day')}`
const end = new Date(`${to}T12:00:00Z`)
const dates = Array.from({ length: 365 }, (_, i) => new Date(end.getTime() - (364 - i) * 86400000).toISOString().slice(0, 10))
const target = new URL('src/data/github-activity.json', root)
const years = [...new Set(dates.map(date => date.slice(0, 4)))]

try {
  const pages = await Promise.all(years.map(async year => {
    const url = `https://github.com/users/${github}/contributions?from=${year}-01-01&to=${year}-12-31`
    const response = await fetch(url, { signal: AbortSignal.timeout(15000), headers: { 'Accept-Language': 'en-US', 'User-Agent': 'portfolio-activity-generator' } })
    assert(response.ok, `GitHub respondió ${response.status}`)
    return response.text()
  }))
  const cells = new Map()
  for (const html of pages) {
    const tooltips = new Map([...html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)].map(([, attributes, text]) => [attributes.match(/\bfor="([^"]+)"/)?.[1], text]))
    for (const [, attributes] of html.matchAll(/<(?:td|div)\b([^>]*\bdata-date="[^"]+"[^>]*)>/g)) {
      const attr = (name) => attributes.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1]
      const date = attr('data-date')
      const label = tooltips.get(attr('id')) ?? ''
      const count = /^No contributions\b/.test(label) ? 0 : Number(label.match(/^([\d,]+) contributions?\b/)?.[1]?.replaceAll(',', ''))
      const level = Number(attr('data-level'))
      if (Number.isInteger(count) && count >= 0 && Number.isInteger(level) && level >= 0 && level <= 4) cells.set(date, { date, count, level })
    }
  }
  assert(dates.every(date => cells.has(date)), 'GitHub no devolvió el historial completo; no se inventan días sin actividad')
  const activity = { user: github, from: dates[0], to, days: dates.map(date => cells.get(date)) }
  await writeFile(target, JSON.stringify(activity, null, 2) + '\n')
  console.log(`GitHub: ${activity.from} → ${to}, ${activity.days.reduce((sum, day) => sum + day.count, 0)} contribuciones`)
} catch (error) {
  // Conserva el último resultado real si la red falla, mostrando siempre su periodo.
  let cached
  try { cached = JSON.parse(await readFile(target, 'utf8')) } catch { /* No hay datos anteriores. */ }
  if (cached?.user !== github || cached?.days?.length !== 365) throw error
  console.warn(`No se pudo actualizar GitHub: ${error.message}. Se conserva el periodo ${cached.from} → ${cached.to}.`)
}
