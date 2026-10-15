import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { chromium, webkit } from 'playwright'
import { checkPixel } from './check-pixel.js'

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
  const html = await (await fetch(url)).text()
  assert(html.includes('name="twitter:card" content="summary_large_image"'), 'Falta la tarjeta social en el HTML inicial')
  assert(html.includes('rel="canonical" href="https://jesusjodar.github.io/"'), 'Falta la URL canónica')
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
  assert.equal(schema.mainEntity.name, 'Jesús Jódar')
  for (const path of ['/og-image.jpg', '/favicon.svg', '/icon-32.png', '/apple-touch-icon.png', '/robots.txt', '/sitemap.xml', '/site.webmanifest']) {
    assert.equal((await fetch(url + path)).status, 200, `Recurso SEO no disponible: ${path}`)
  }
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
          assert.equal(await page.locator('.scroll-track').isVisible(), width >= 1000, 'Scrollbar visible en pantalla táctil')
          assert.equal(await page.locator('.cv-scope section').first().evaluate(el => getComputedStyle(el).contentVisibility), 'visible', 'El texto se sigue renderizando en diferido')
          await checkOverflow(scroll, 'CV')
          const photo = await page.getByRole('img', { name: 'Foto de perfil de Jesús Jódar' }).boundingBox()
          const name = await page.locator('.nameblock h1').boundingBox()
          assert(Math.abs(photo.height - name.height) <= 1, 'Foto y nombre tienen distinta altura')
          assert(Math.abs(photo.y - name.y) <= 1, 'Foto y nombre no están alineados')
          assert(Math.abs(photo.width - photo.height) <= 1, 'La foto deja de ser cuadrada')
          assert.equal(await page.locator('.cv-scope section').count(), 14)
          for (const label of ['LinkedIn', 'X', 'Correo electrónico', 'WhatsApp']) {
            const box = await page.getByRole('link', { name: label, exact: true }).boundingBox()
            assert(box.x >= 0 && box.x + box.width <= width, `${label}: enlace recortado`)
          }
          await scroll.evaluate(el => {
            el.scrollTop = el.scrollHeight
          })
          await page.waitForFunction(() => {
            const scroll = document.querySelector('#portfolio-scroll')
            return scroll.querySelector('.pixel-content > div').style.transform === `translateY(${-scroll.scrollTop}px)`
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
          if (width === 390) {
            await input.focus()
            assert.equal(await input.evaluate(el => getComputedStyle(el).outlineStyle), 'none', 'Outline recto dentro del campo de chat')
            await page.evaluate(() => {
              Object.defineProperty(visualViewport, 'height', { get: () => 300, configurable: true })
              visualViewport.dispatchEvent(new Event('resize'))
            })
            const inputBox = await input.boundingBox()
            assert(inputBox.y >= 0 && inputBox.y + inputBox.height <= 300, 'Teclado simulado tapa el campo')
            await page.evaluate(() => {
              delete visualViewport.height
              visualViewport.dispatchEvent(new Event('resize'))
            })
          }
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
          await page.setViewportSize({ width, height })
          if (width >= 640 && width < 1000) {
            await page.addStyleTag({ content: ':root { --side: 59px; --safe-bottom: 21px; }' })
          }
          const footer = await page.locator('footer').evaluate(el => [...el.children]
            .filter(child => getComputedStyle(child).display !== 'none')
            .map(child => child.getBoundingClientRect().toJSON()))
          for (let i = 1; i < footer.length; i++) assert(footer[i - 1].right <= footer[i].left, 'Elementos del pie superpuestos')
          if (width === 390) {
            await page.locator('.viewport-shell').evaluate(el => { el.style.height = '600px' })
            const footerBox = await page.locator('footer').boundingBox()
            assert(footerBox.y + footerBox.height <= 600, 'Pie fuera del viewport dinámico')
          }
          assert.deepEqual(errors, [], 'Errores de ejecución')
          console.log(`✓ ${engine} ${width}×${height}: CV, blog, galería, chat y giro`)
        } finally {
          await page.close()
        }
      }
      const pixelPage = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, reducedMotion: 'reduce' })
      try {
        await checkPixel(pixelPage, url)
        console.log(`✓ ${engine}: exterior pixelado, interior nítido y máscara fija a DPR 3`)
      } finally {
        await pixelPage.close()
      }
    } finally {
      await browser.close()
    }
  }
} finally {
  server.kill()
}
