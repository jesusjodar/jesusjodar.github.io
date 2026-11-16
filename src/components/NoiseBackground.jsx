import { useEffect, useRef } from 'react'
import { ShaderMount } from '@paper-design/shaders'
import { fragment } from '../graphics/noiseShader.js'

export default function NoiseBackground() {
  const host = useRef(null)
  useEffect(() => {
    const element = host.current
    let mount
    try {
      mount = new ShaderMount(element, fragment, { uSize: [1, 1], uProgress: 0, uDim: 0 }, { alpha: false, antialias: false }, 0, 0, 1, element.clientWidth <= 600 ? 400000 : 1000000)
    } catch (error) { console.warn('Fondo gráfico no disponible; se conserva el fondo estático.', error) }
    const resize = () => mount?.setUniforms({ uSize: [element.clientWidth, element.clientHeight] })
    const change = event => {
      const { progress, dim, ripple = 0, transition = 0 } = event.detail
      // Keep the outgoing hue underneath Paper's incoming ripple until it covers
      // the view. Swapping the base at full coverage makes the reveal seamless.
      if (ripple && transition < .5) return
      mount?.setUniforms({ uProgress: progress, uDim: dim })
    }
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    element.addEventListener('background-progress', change)
    resize()
    return () => { observer.disconnect(); element.removeEventListener('background-progress', change); mount?.dispose() }
  }, [])
  return <div ref={host} className="background-noise" aria-hidden="true" />
}
