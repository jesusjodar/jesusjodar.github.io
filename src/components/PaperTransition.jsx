import { useEffect, useRef } from 'react'
import { ShaderMount } from '@paper-design/shaders'
import { fragment, transitionUniforms } from '../graphics/paperTransitionShader.js'

export default function PaperTransition() {
  const host = useRef(null)
  useEffect(() => {
    const element = host.current
    const background = document.querySelector('.background-noise')
    let mount
    let latest = { progress: 0, dim: 0, coverage: 0 }
    try {
      mount = new ShaderMount(element, fragment, {
        ...transitionUniforms,
      }, { alpha: true, premultipliedAlpha: true, antialias: false }, 0, 0, 1, element.clientWidth <= 600 ? 400000 : 1000000)
    } catch (error) { console.warn('Transición Paper no disponible.', error) }
    const change = event => {
      latest = event.detail
      const { progress, dim, coverage = 0, transition = 0, direction = [-1, 0], ripple = 0 } = latest
      element.style.visibility = coverage > 0 ? 'visible' : 'hidden'
      mount?.setUniforms({ uRipple: ripple, uProgress: progress, uDim: dim, uCoverage: coverage, uTransition: transition, uDirection: direction })
      mount?.setFrame(transition * 12000)
    }
    const resize = () => {
      const rect = element.getBoundingClientRect(), bg = background.getBoundingClientRect()
      if (!rect.width || !rect.height || !bg.height) return
      mount?.setUniforms({ uSize: [bg.width, bg.height], uBackgroundUV: [(rect.left - bg.left) / bg.width, 1 - (rect.bottom - bg.top) / bg.height, rect.width / bg.width, rect.height / bg.height] })
      change({ detail: latest })
    }
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    observer.observe(background)
    background.addEventListener('background-progress', change)
    window.addEventListener('scroll', resize, { passive: true })
    resize()
    return () => {
      observer.disconnect()
      background.removeEventListener('background-progress', change)
      window.removeEventListener('scroll', resize)
      mount?.dispose()
    }
  }, [])
  return <div ref={host} className="paper-transition" aria-hidden="true" />
}
