import assert from 'node:assert/strict'

// Comprueba los píxeles renderizados a DPR 3, además de las cajas del layout.
export async function checkPixel(page, url, { mobile = false } = {}) {
  await page.goto(url)
  await page.addStyleTag({ content: '.site-background,.pixel-gradient,footer{display:none}' })
  await page.locator('.pixel-content > div').evaluate(el => {
    el.style.padding = '0'
    el.innerHTML = '<div style="height:2400px;background:linear-gradient(90deg,#f00,#00f)"></div>'
  })
  await page.waitForTimeout(300) // Carga del mapa de desplazamiento y de la máscara SVG.
  assert.equal(await page.locator('.pixel-content').evaluate(el => getComputedStyle(el).filter === 'none'), mobile, 'Filtro incorrecto para el dispositivo')
  const samples = []
  for (const top of [0, 600]) {
    await page.locator('#portfolio-scroll').evaluate((el, top) => { el.scrollTop = top }, top)
    await page.waitForFunction(() => {
      const scroll = document.querySelector('#portfolio-scroll')
      return scroll.querySelector('.pixel-content > div').style.transform === `translateY(${-scroll.scrollTop}px)`
    })
    const png = (await page.screenshot()).toString('base64')
    const { rows, edges } = await page.evaluate(async png => {
      const image = new Image()
      image.src = `data:image/png;base64,${png}`
      await image.decode()
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0)
      const rows = [10, 200].map(y => Array.from({ length: 60 }, (_, x) =>
        [...context.getImageData((150 + x) * 3, y * 3, 1, 1).data]))
      const frame = document.querySelector('button[aria-expanded]').parentElement.getBoundingClientRect()
      const points = [[frame.left + 6, frame.bottom - 6], [innerWidth / 2, frame.bottom + 8], [150, frame.top + 16], [frame.left + 20, frame.top + 16]]
      const edges = points.map(([x, y]) => [...context.getImageData(Math.round(x * 3), Math.round(y * 3), 1, 1).data])
      return { rows, edges }
    }, png)
    const changes = rows.map(row => row.filter((color, i) => i && color.join() !== row[i - 1].join()).length)
    if (mobile) {
      assert.equal(changes[0], 0, 'Contenido visible por encima de la carpeta')
      for (const color of edges.slice(0, 3)) assert.deepEqual(color, [14, 10, 56, 255], 'Contenido fuera de la pestaña o de las esquinas')
      assert.notDeepEqual(edges[3], [14, 10, 56, 255], 'La pestaña se ha recortado como un rectángulo')
    } else {
      assert(changes[0] > 1 && changes[0] < 15, 'El exterior no forma bloques de píxeles')
    }
    assert(changes[1] > 30, 'El interior ha perdido nitidez')
    samples.push(rows.flat())
  }
  assert(samples[0].every((color, i) => color.every((value, c) => Math.abs(value - samples[1][i][c]) <= 2)), 'La máscara se desplaza con el contenido')
}
