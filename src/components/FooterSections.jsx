import { useEffect, useRef } from 'react'
import { ShaderMount } from '@paper-design/shaders'
import { fragment } from '../graphics/noiseShader.js'
import { portfolioSections } from '../data/portfolio-sections.js'

const sections = [{ id: 'intro', title: ['ANALYSIS', 'DESIGN & RESEARCH'] }, ...portfolioSections]
const barFragment = fragment
  .replace('* 4.2;', '* 1.0;')
  .replace('uniform float uProgress;', 'uniform float uActive; uniform float uHovered; uniform vec4 uStarts; uniform vec4 uEnds;')
  .replace('void main() {', `void main() {
    float uProgress = -1.;
    for (int i = 0; i < 4; i++) {
      if (vUv.x >= uStarts[i] && vUv.x <= uEnds[i]) uProgress = float(i);
    }
    if (uProgress < 0.) { fragColor = vec4(0., 0., 0., 1.); return; }
    float selected = abs(uProgress - uActive) < .5 ? 1.0 : 0.0;
    float hovered = abs(uProgress - uHovered) < .5 ? 1.0 : 0.0;
    float emphasis = max(selected, hovered);
    float brightness = mix(.65, 1.45, emphasis);`)
  .replace('color * (1.0 - uDim)', 'mix(vec3(dot(color, vec3(.2126, .7152, .0722))), color, emphasis) * brightness')

export default function FooterSections() {
  const host = useRef(null)
  useEffect(() => {
    const element = host.current
    const background = document.querySelector('.background-noise')
    let mount
    try {
      mount = new ShaderMount(element, barFragment, { uStarts: [0, .25, .5, .75], uEnds: [.2, .45, .7, .95], uSize: [160, 80], uActive: 0, uHovered: -1 }, { alpha: false, antialias: false }, 0, 0, 1, 20000)
    } catch (error) { console.warn('Indicadores gráficos no disponibles.', error) }
    let currentActive = -1
    const change = event => {
      const active = Math.round(event.detail.progress)
      if (active === currentActive) return
      currentActive = active
      mount?.setUniforms({ uActive: active })
      bars.forEach((bar, index) => {
        bar.dataset.active = String(index === active)
        if (index === active) bar.setAttribute('aria-current', 'location')
        else bar.removeAttribute('aria-current')
      })
    }
    const bars = [...element.parentElement.querySelectorAll('.footer-section-bar')]
    const measure = () => {
      const width = element.parentElement.clientWidth
      if (!width) return
      mount?.setUniforms({
        uStarts: bars.map(bar => bar.offsetLeft / width),
        uEnds: bars.map(bar => (bar.offsetLeft + bar.offsetWidth) / width),
      })
    }
    const observer = new ResizeObserver(measure)
    bars.forEach(bar => observer.observe(bar))
    observer.observe(element.parentElement)
    const enter = event => mount?.setUniforms({ uHovered: bars.indexOf(event.currentTarget) })
    const leave = () => mount?.setUniforms({ uHovered: -1 })
    bars.forEach(bar => { bar.addEventListener('pointerenter', enter); bar.addEventListener('pointerleave', leave); bar.addEventListener('focus', enter); bar.addEventListener('blur', leave) })
    change({ detail: { progress: 0 } })
    background?.addEventListener('background-progress', change)
    return () => { observer.disconnect(); bars.forEach(bar => { bar.removeEventListener('pointerenter', enter); bar.removeEventListener('pointerleave', leave); bar.removeEventListener('focus', enter); bar.removeEventListener('blur', leave) }); background?.removeEventListener('background-progress', change); mount?.dispose() }
  }, [])
  return <div className="footer-sections" aria-label="Secciones de la web">
    <div ref={host} className="footer-sections-noise" aria-hidden="true" />
    {sections.map((section, index) => <button type="button" className="footer-section-bar" key={section.id} aria-label={section.title.join(' ')} onClick={() => window.dispatchEvent(new CustomEvent('portfolio-navigate', { detail: { index } }))}>
      <span className="footer-section-label">{section.title.join(' ')}</span>
    </button>)}
  </div>
}
