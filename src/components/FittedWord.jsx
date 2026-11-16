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
      const context = document.createElement('canvas').getContext('2d')
      context.font = `100px "${family}"`
      context.fontKerning = style.fontKerning
      context.letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing
      const bounds = context.measureText(children)
      const x = -bounds.actualBoundingBoxLeft
      const y = -bounds.actualBoundingBoxAscent
      const width = bounds.actualBoundingBoxLeft + bounds.actualBoundingBoxRight
      const height = bounds.actualBoundingBoxAscent + bounds.actualBoundingBoxDescent
      setViewBox(`${x} ${y} ${width} ${height}`)
    }
    measure()
    return () => { active = false }
  }, [children])
  return <svg className={className} viewBox={viewBox} preserveAspectRatio="none" aria-hidden="true">
    <text ref={text} x="0" y="0" fontSize="100">{children}</text>
  </svg>
}
