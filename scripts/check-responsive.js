import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { chromium, webkit } from 'playwright'

// Ejecutar después de build; usa los archivos de producción, sin servidor externo.
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4174', '--strictPort'], { stdio: 'ignore' })
const url = 'http://127.0.0.1:4174'
const sizes = [[320, 568], [360, 640], [375, 667], [390, 844], [430, 932], [568, 320], [640, 360], [768, 1024], [844, 390], [932, 430], [1024, 768], [1440, 900]]

async function checkOverflow(locator, label) {
  const { width, scroll } = await locator.evaluate(el => ({ width: el.clientWidth, scroll: el.scrollWidth }))
  assert(width > 0 && scroll <= width + 1, `${label}: desbordamiento horizontal (${scroll}/${width})`)
}

try {
  let ready = false
  for (let attempt = 0; attempt < 100 && !ready; attempt++) {
    try { ready = (await fetch(url)).ok } catch { /* Esperar al servidor. */ }
    if (!ready) await new Promise(resolve => setTimeout(resolve, 100))
  }
  assert(ready, 'No arrancó Vite preview')
  for (const [engine, type] of Object.entries({ chromium, webkit })) {
    const browser = await type.launch()
    try {
      for (const [width, height] of sizes) {
        const page = await browser.newPage({ viewport: { width, height }, isMobile: width < 1000, hasTouch: width < 1000, reducedMotion: 'reduce' })
        try {
          const errors = []
          page.on('pageerror', error => errors.push(error.message))
          await page.goto(url)
          await page.evaluate(() => document.fonts.ready)
          const scroll = page.locator('#portfolio-scroll')
          await checkOverflow(scroll, 'CV')
          assert.equal(await page.locator('.cv-scope section').count(), 14)
          for (const label of ['LinkedIn', 'X', 'Correo electrónico', 'WhatsApp']) {
            const box = await page.getByRole('link', { name: label, exact: true }).boundingBox()
            assert(box.x >= 0 && box.x + box.width <= width, `${label}: enlace recortado`)
          }
          await scroll.evaluate(el => {
            for (const section of el.querySelectorAll('section, article')) section.style.contentVisibility = 'visible'
            el.scrollTop = el.scrollHeight
          })
          const contact = await page.locator('.cv-scope li').last().boundingBox()
          assert(contact.y > 0 && contact.y + contact.height < height, 'Contacto inaccesible')
          await scroll.evaluate(el => { el.scrollTop = 0 })
          await page.getByRole('button', { name: 'Ver blog', exact: true }).click()
          await page.locator('.blog-scope article').waitFor()
          await checkOverflow(scroll, 'Blog')
          await page.getByRole('button', { name: 'Ver img', exact: true }).click()
          const strip = page.getByRole('region', { name: 'Galería de imágenes' })
          await strip.waitFor()
          await page.waitForTimeout(800) // Metadatos de vídeo, proporciones y scroll-snap.
          const gallery = page.locator('.gallery-panel')
          const caption = await page.locator('.gallery-caption').boundingBox()
          const media = await page.locator('.gallery-media.scale-100').boundingBox()
          assert(caption.y + caption.height <= media.y, 'Título superpuesto a la imagen')
          assert(media.x >= 0 && media.x + media.width <= width, 'Imagen fuera del viewport')
          await gallery.evaluate(el => { el.scrollTop = el.scrollHeight })
          const tags = await gallery.locator('span').last().boundingBox()
          assert(tags.y > 0 && tags.y + tags.height < height, 'Etiquetas inaccesibles')
          const next = gallery.locator('button[aria-label="Diapositiva siguiente"]:enabled')
          await next.click()
          await page.getByRole('button', { name: 'Colapsar marco', exact: false }).click()
          assert.equal(await gallery.isVisible(), false, 'Galería superpuesta al chat')
          const input = page.getByRole('textbox', { name: 'Escribe tu pregunta' })
          await input.fill('¿Cómo puedo contactar contigo?')
          await page.getByRole('button', { name: 'Enviar', exact: true }).click()
          await page.locator('.chat-markdown').waitFor()
          assert((await page.locator('.chat-markdown').innerText()).includes('@'), 'Falta respuesta de contacto')
          await checkOverflow(page.locator('div.fixed').filter({ has: input }), 'Chat')
          await page.setViewportSize({ width: height, height: width })
          assert.equal(await page.getByRole('button', { name: 'Expandir marco', exact: false }).count(), 1, 'El chat pierde el estado al girar')
          await input.fill('x'.repeat(300))
          await page.getByRole('button', { name: 'Enviar', exact: true }).click()
          await checkOverflow(page.locator('div.fixed').filter({ has: input }), 'Consulta larga')
          await page.getByRole('button', { name: 'Expandir marco', exact: false }).click()
          assert.equal(await gallery.isVisible(), true)
          assert.deepEqual(errors, [], 'Errores de ejecución')
          console.log(`✓ ${engine} ${width}×${height}: CV, blog, galería, chat y giro`)
        } finally {
          await page.close()
        }
      }
    } finally {
      await browser.close()
    }
  }
} finally {
  server.kill()
}
