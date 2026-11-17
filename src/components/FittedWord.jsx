import { useLayoutEffect, useRef, useState } from 'react'
import { measurementFont } from '../lib/measurementFont.js'

export function FittedWord({ children, className }) {
  const text = useRef(null)
  const [viewBox, setViewBox] = useState('0 -80 1000 100')
  useLayoutEffect(() => {
    let active = true
    const measure = async () => {
      await document.fonts.ready
      if (!active || !text.current) return
      const style = getComputedStyle(text.current)
      const family = await measurementFont(style.fontVariationSettings)
      if (!active) return
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d', { willReadFrequently: true })
      const scale = 5
      const configure = () => {
        context.font = `${100 * scale}px "${family}"`
        context.fontKerning = style.fontKerning
        context.letterSpacing = style.letterSpacing === 'normal' ? '0px' : `${parseFloat(style.letterSpacing) * scale}px`
      }
      configure()
      const bounds = context.measureText(children)
      const x = Math.floor(-bounds.actualBoundingBoxLeft) - 1
      const y = Math.floor(-bounds.actualBoundingBoxAscent) - 1
      canvas.width = Math.ceil(bounds.actualBoundingBoxRight - x) + 1
      canvas.height = Math.ceil(bounds.actualBoundingBoxDescent - y) + 1
      configure()
      context.fillText(children, -x, -y)
      // Font metrics can include empty space around curved glyphs. Fit the ink,
      // so each stretched line reaches both margins without clipping its letters.
      const { data } = context.getImageData(0, 0, canvas.width, canvas.height)
      let left = canvas.width, right = -1, top = canvas.height, bottom = -1
      for (let row = 0; row < canvas.height; row++) {
        for (let column = 0; column < canvas.width; column++) {
          if (!data[(row * canvas.width + column) * 4 + 3]) continue
          left = Math.min(left, column)
          right = Math.max(right, column)
          top = Math.min(top, row)
          bottom = Math.max(bottom, row)
        }
      }
      if (right < left) return
      setViewBox(`${(x + left) / scale} ${(y + top) / scale} ${(right - left + 1) / scale} ${(bottom - top + 1) / scale}`)
    }
    measure()
    return () => { active = false }
  }, [children])
  return <svg className={className} viewBox={viewBox} preserveAspectRatio="none" aria-hidden="true">
    <text ref={text} x="0" y="0" fontSize="100">{children}</text>
  </svg>
}
