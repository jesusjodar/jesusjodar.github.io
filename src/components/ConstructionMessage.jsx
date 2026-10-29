import { useLayoutEffect, useRef, useState } from 'react'

function FittedWord({ children, className }) {
  const text = useRef(null)
  const [viewBox, setViewBox] = useState('0 -80 1000 100')
  useLayoutEffect(() => {
    let active = true
    const measure = () => {
      if (!active || !text.current) return
      const { x, width } = text.current.getBBox()
      const style = getComputedStyle(text.current)
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      context.font = `677 100px ${style.fontFamily}`
      context.fontStretch = 'condensed'
      const metrics = context.measureText(children)
      // getBBox incluye ascendentes y descendentes vacíos; usamos la tinta real.
      const top = metrics.actualBoundingBoxAscent
      const bottom = metrics.actualBoundingBoxDescent
      setViewBox(`${x} ${-top} ${width} ${top + bottom}`)
    }
    measure()
    document.fonts.ready.then(measure)
    return () => { active = false }
  }, [children])
  return <svg className={className} viewBox={viewBox} preserveAspectRatio="none" aria-hidden="true">
    <text ref={text} x="0" y="0" fontSize="100">{children}</text>
  </svg>
}

export default function ConstructionMessage() {
  return <h1 className="construction-message" aria-label="EN CONSTRUCCION">
    <FittedWord className="construction-en">EN</FittedWord>
    <FittedWord>CONSTRUCCION</FittedWord>
  </h1>
}
