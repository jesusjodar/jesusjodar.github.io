import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import opentype from 'opentype.js'
import { activityColor, activityLabel } from '../src/lib/activity.js'

const root = new URL('../', import.meta.url)
const require = createRequire(import.meta.url)
const profile = JSON.parse(await readFile(new URL('src/data/profile.json', root), 'utf8'))
const socialIcons = JSON.parse(await readFile(new URL('src/data/social-icons.json', root), 'utf8'))
const activity = JSON.parse(await readFile(new URL('src/data/github-activity.json', root), 'utf8'))
const artwork = await readFile(new URL('public/side-artwork.svg', root), 'utf8')
const background = await readFile(new URL('public/neon-noise.svg', root), 'utf8')
const fontBytes = await readFile(require.resolve('@fontsource/anton/files/anton-latin-400-normal.woff'))
const font = opentype.parse(fontBytes.buffer.slice(fontBytes.byteOffset, fontBytes.byteOffset + fontBytes.byteLength))
const portrait = await readFile(new URL(`public${profile.portrait}`, root))
const portraitUri = `data:image/webp;base64,${portrait.toString('base64')}`
const year = new Date().getFullYear().toString()
const escapeXml = (text) => text.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char])

// Los trazados conservan Anton sin cargar fuentes externas en el README.
function outline(text) {
  const path = font.getPath(text.toUpperCase(), 0, 0, 72, { letterSpacing: 0.01 })
  const box = path.getBoundingBox()
  return { path: path.toPathData(2), box, width: (box.x2 - box.x1) * 1.18, height: (box.y2 - box.y1) * 1.45 }
}

const name = outline(profile.name)
const date = outline(year)
const width = 1200
const height = 400
const padding = 10
const panelHeight = Math.ceil(Math.max(name.height, date.height) + padding * 2)
const panelTop = height - panelHeight
const photoSize = name.height
const pixelSize = photoSize / 2
const activityX = padding * 3 + photoSize + name.width
const activityWidth = width - padding * 2 - date.width - activityX
const activityColumns = Math.min(Math.floor(activity.days.length / 2), Math.floor(activityWidth / pixelSize))
const visibleDays = activity.days.slice(-activityColumns * 2)
const pixelWidth = activityWidth / activityColumns
assert(activityColumns > 0, 'No queda espacio para la actividad en el banner')

function drawText(text, x) {
  const y = height - padding - text.height
  return `<g transform="translate(${x} ${y}) scale(1.18 1.45)"><path transform="translate(${-text.box.x1} ${-text.box.y1})" d="${text.path}" fill="#fff" stroke="#fff" stroke-width="0.45" stroke-linejoin="round"/></g>`
}

const activityPixels = visibleDays.map((day, index) => {
  const x = activityX + (index % activityColumns) * pixelWidth
  const y = height - padding - photoSize + Math.floor(index / activityColumns) * pixelSize
  return `<rect x="${x}" y="${y}" width="${pixelWidth}" height="${pixelSize}" fill="${activityColor(day.level)}"><title>${escapeXml(activityLabel(day))}</title></rect>`
}).join('\n')

// Reutiliza el SVG original y su encuadre, sin duplicar colores ni filtros.
const backdrop = background.replace('<svg ', `<svg x="0" y="0" preserveAspectRatio="xMidYMid slice" `)
  .replace('width="1600" height="1200"', `width="${width}" height="${height}"`)
const artworkHeight = panelTop * 0.98
const artworkWidth = artworkHeight * 180.945 / 363.32
const sideArtwork = artwork.replace('<svg ', `<svg x="${width - artworkWidth}" y="${(panelTop - artworkHeight) / 2}" width="${artworkWidth}" height="${artworkHeight}" `)
const mosaicSize = Math.min(48, width * 0.04, (panelTop - 30) / 2)
const mosaic = (await Promise.all(socialIcons.map(async (icon, index) => {
  const x = 10 + index % 2 * (mosaicSize + 5)
  const y = 10 + Math.floor(index / 2) * (mosaicSize + 5)
  const iconSize = mosaicSize * 0.62
  const inset = (mosaicSize - iconSize) / 2
  const source = await readFile(new URL(`public${icon.icon}`, root), 'utf8')
  const nested = source.replace(/<svg\b[^>]*>/, (opening) => opening.replace(/\s(?:width|height)="[^"]*"/g, '').replace('<svg', `<svg x="${x + inset}" y="${y + inset}" width="${iconSize}" height="${iconSize}" preserveAspectRatio="xMidYMid meet"`))
  return `<g><title>${escapeXml(icon.name)}</title><rect x="${x}" y="${y}" width="${mosaicSize}" height="${mosaicSize}" fill="#000"/>${nested}</g>`
}))).join('\n')
// Anton en trazados para llenar la altura y conservar la fuente también en GitHub.
const statusPaths = ['EN', 'CONSTRUCCIÓN'].map(word => {
  const path = font.getPath(word, 0, 0, 100)
  return { d: path.toPathData(2), box: path.getBoundingBox() }
})
const statusWidth = Math.max(...statusPaths.map(item => item.box.x2 - item.box.x1))
const statusLineHeight = Math.max(...statusPaths.map(item => item.box.y2 - item.box.y1))
const statusHeight = statusLineHeight * 2 + 8
const statusContent = statusPaths.map((item, index) => `<path d="${item.d}" fill="#fff" transform="translate(${-item.box.x1} ${index * (statusLineHeight + 8) - item.box.y1})"/>`).join('')
const statusSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${statusWidth} ${statusHeight}" preserveAspectRatio="none">${statusContent}</svg>`
await writeFile(new URL('public/construction.svg', root), statusSvg + '\n')
const statusX = 20 + mosaicSize * 2 + 5
const statusBanner = statusSvg.replace('<svg ', `<svg x="${statusX}" y="10" width="${width - statusX - 10}" height="${panelTop - 20}" `)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">
<title id="title">${escapeXml(profile.name)} — ${year}</title>
<desc id="description">Fondo orgánico verde y amarillo, con retrato, nombre, actividad de GitHub del ${visibleDays[0].date} al ${activity.to} y año sobre una franja negra.</desc>
${backdrop.trim()}
${statusBanner}
${sideArtwork.trim()}
${mosaic}
<rect y="${panelTop}" width="${width}" height="${panelHeight}" fill="#000"/>
<image x="${padding}" y="${height - padding - photoSize}" width="${photoSize}" height="${photoSize}" href="${portraitUri}" preserveAspectRatio="xMidYMid slice"/>
${drawText(name, padding * 2 + photoSize)}
${activityPixels}
${drawText(date, width - padding - date.width)}
</svg>
`
assert(!/<(?:script|foreignObject)\b|(?:href|src)=["'](?!data:image\/webp;base64,)/i.test(svg), 'El banner debe ser autocontenido y sin código ejecutable')
await writeFile(new URL('public/profile.svg', root), svg)
console.log(`README: ${fileURLToPath(new URL('public/profile.svg', root))} (${width}×${height})`)
