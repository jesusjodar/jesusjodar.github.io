import { useEffect, useMemo, useRef } from 'react'
import { WAVE_STAR_D } from '../lib/portfolio.js'

// Footer: firma en SVG (fill), divisores espaciales + onda animada con estrella.
// Autocontenido (mide su propio contenedor y respeta prefers-reduced-motion).
export default function SiteFooter() {
  const waveRef = useRef(null)
  const wavePathRef = useRef(null)
  const waveStarRef = useRef(null)
  const nameSvgRef = useRef(null)
  const nameTextRef = useRef(null)

  const year = useMemo(() => new Date().getFullYear(), [])

  // La firma es <text> SVG con fill: se mide su ancho real (tras cargar
  // Anton) y se fija al svg para que encaje exacto sin recortes.
  useEffect(() => {
    const svg = nameSvgRef.current
    const text = nameTextRef.current
    if (!svg || !text) return
    let off = false
    const fit = () => {
      try {
        const w = text.getComputedTextLength()
        if (w > 0) svg.style.width = `${Math.ceil(w)}px`
      } catch {
        /* fuente aún no lista: reintenta con fonts.ready */
      }
    }
    fit()
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!off) fit()
      })
    }
    return () => {
      off = true
    }
  }, [])

  useEffect(() => {
    const el = waveRef.current
    const path = wavePathRef.current
    const star = waveStarRef.current
    if (!el || !path) return

    const reduceMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches

    let w = 0
    let h = 16
    let span = 0
    let n = 1
    const pad = 2
    const measure = () => {
      w = el.clientWidth
      h = el.clientHeight || 16
      span = w - pad * 2
      n = Math.max(1, Math.round(span / 56))
    }
    measure()

    const ampAt = (x) => h / 2 - 8.5 + ((x - pad) / span) * 4
    const yAt = (x, phase) =>
      h / 2 + ampAt(x) * Math.sin(((x - pad) / span) * n * Math.PI * 2 + phase)
    const tAt = (x) => 1 + ((x - pad) / span) * 6
    const ends = () => ({ x0: pad + 2.5, x1: w - pad - 4 })

    const placeStar = (phase) => {
      if (!star) return
      const { x0, x1 } = ends()
      if (x1 <= x0 || span <= 0) return
      const y = yAt(x1, phase)
      const rot = (phase * 14) % 360
      star.setAttribute(
        'transform',
        `translate(${x1.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})`,
      )
    }

    // Muestreo reutilizado entre frames: la onda se reconstruye a 60fps y
    // realojar el array cada frame genera basura constante para el GC.
    const xs = []

    const buildD = (phase) => {
      if (span <= 0) return ''
      const { x0, x1 } = ends()
      if (x1 <= x0) return ''
      xs.length = 0
      for (let x = x0; x < x1; x += 4) xs.push(x)
      xs.push(x1)
      let d = ''
      xs.forEach((x, i) => {
        const y = (yAt(x, phase) - tAt(x) / 2).toFixed(1)
        d += `${i === 0 ? 'M' : ' L'} ${x.toFixed(1)} ${y}`
      })
      const xR = xs[xs.length - 1]
      const tR = tAt(xR)
      d += ` A ${(tR / 2).toFixed(1)} ${(tR / 2).toFixed(1)} 0 0 1 ${xR.toFixed(1)} ${(yAt(xR, phase) + tR / 2).toFixed(1)}`
      for (let i = xs.length - 1; i >= 0; i -= 1) {
        const x = xs[i]
        const y = (yAt(x, phase) + tAt(x) / 2).toFixed(1)
        d += ` L ${x.toFixed(1)} ${y}`
      }
      const xL = xs[0]
      const tL = tAt(xL)
      d += ` A ${(tL / 2).toFixed(1)} ${(tL / 2).toFixed(1)} 0 0 1 ${xL.toFixed(1)} ${(yAt(xL, phase) - tL / 2).toFixed(1)}`
      return `${d} Z`
    }

    if (reduceMotion) {
      path.setAttribute('d', buildD(0))
      placeStar(0)
      const ro = new ResizeObserver(() => {
        measure()
        path.setAttribute('d', buildD(0))
        placeStar(0)
      })
      ro.observe(el)
      return () => ro.disconnect()
    }

    // Fotogramas precalculados de un periodo completo (2π): por frame solo
    // se hace setAttribute desde el array, sin construir strings ni basura
    // para el GC. Al depender solo de la geometría, se re-hornea al cambiar
    // el tamaño; la estrella sigue viva (un setAttribute barato).
    const FRAMES = 144
    const TWO_PI = Math.PI * 2
    let baked = []
    const bake = () => {
      measure()
      baked = []
      for (let k = 0; k < FRAMES; k++) {
        baked.push(buildD((k / FRAMES) * TWO_PI))
      }
    }
    bake()

    let raf = 0
    let visible = true
    const onVis = () => {
      visible = !document.hidden
      if (visible) raf = requestAnimationFrame(render)
      else cancelAnimationFrame(raf)
    }
    const t0 = performance.now()
    // Onda lenta: basta con 30fps (la fase sigue el tiempo real, sin deriva).
    let skip = false
    const render = (t) => {
      if (!visible) return
      skip = !skip
      if (!skip) {
        // Onda horneada (cuantizada) + estrella continua: el giro rápido de
        // la estrella (×14) necesita fase continua para no ir a saltos.
        const phase = ((t - t0) / 1000) * 2.2
        const idx = Math.floor((phase / TWO_PI) * FRAMES) % FRAMES
        path.setAttribute('d', baked[idx])
        placeStar(phase)
      }
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    const ro = new ResizeObserver(bake)
    ro.observe(el)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <footer className="fixed left-[var(--side)] right-[var(--side)] bottom-[calc(var(--frame-footer-gap)/2)] z-[60] flex h-[var(--footer-h)] min-w-0 items-center justify-between gap-3 px-2 sm:gap-4 sm:px-3">
      <svg
        ref={nameSvgRef}
        className="h-[1.25em] w-[12em] shrink-0 overflow-visible text-base intro-footer-text sm:text-lg"
        role="img"
        aria-label={`© ${year} Jesús Jódar`}
      >
        <text
          ref={nameTextRef}
          x="0"
          y="1em"
          fill="#fff"
          aria-hidden="true"
          className="font-display tracking-wide"
        >
          © {year} Jesús Jódar
        </text>
      </svg>
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-5 sm:flex sm:gap-6 lg:gap-8"
      >
        {/* 1. Planeta con anillos - Balanceo suave sin vuelta completa */}
        <svg
          className="block h-8 w-8 sm:h-9.5 sm:w-9.5 shrink-0 overflow-visible text-white animate-planet-sway drop-shadow-[0_0_1px_rgba(255,255,255,0.3)]"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <defs>
            <mask id="footer-planet-mask">
              <rect width="24" height="24" fill="white" />
              <path
                d="M 2.6 12 A 10.4 3.8 0 0 0 21.4 12"
                fill="none"
                stroke="black"
                strokeWidth="5.5"
                strokeLinecap="round"
              />
            </mask>
          </defs>
          <g transform="rotate(-26 12 12)">
            {/* Anillo trasero redondeado y grueso */}
            <path
              d="M 2.6 12 A 10.4 3.8 0 0 1 6.8 9.3"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M 17.2 9.3 A 10.4 3.8 0 0 1 21.4 12"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Esfera del planeta gruesa con corte redondeado para el anillo frontal */}
            <circle
              cx="12"
              cy="12"
              r="6.1"
              fill="white"
              mask="url(#footer-planet-mask)"
            />
            {/* Anillo frontal redondeado y grueso */}
            <path
              d="M 2.6 12 A 10.4 3.8 0 0 0 21.4 12"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
        </svg>

        {/* 2. Asteroide - Cabeceo orgánico suave sin vuelta completa */}
        <svg
          className="block h-6 w-6 sm:h-7 sm:w-7 shrink-0 overflow-visible text-white animate-asteroid-sway"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fill="white"
            stroke="white"
            strokeWidth="1.6"
            strokeLinejoin="round"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 12 3 C 16 3 19.5 4.8 21 8.2 C 22.2 11.5 21.8 15.2 19.5 18.2 C 17.2 21 13.8 21.8 10.8 21.2 C 7 20.5 3.5 17.8 2.5 14 C 1.6 10.2 3.5 6.2 7 3.8 C 8.5 3.2 10.2 3 12 3 Z M 8.2 7.8 A 2 2 0 1 0 8.2 11.8 A 2 2 0 1 0 8.2 7.8 Z M 15.5 11 A 2.6 2.6 0 1 0 15.5 16.2 A 2.6 2.6 0 1 0 15.5 11 Z M 9.8 15.8 A 1.4 1.4 0 1 0 9.8 18.6 A 1.4 1.4 0 1 0 9.8 15.8 Z"
          />
        </svg>

        {/* 3. Cohete - Balanceo suave sobre su trayectoria de vuelo */}
        <svg
          className="block h-6 w-6 sm:h-7 sm:w-7 shrink-0 overflow-visible text-white animate-rocket-sway"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <g transform="rotate(45 12 12)">
            {/* Llama de propulsión redondeada */}
            <path
              d="M 10 18.2 C 10 21.2 12 23 12 23 C 12 23 14 21.2 14 18.2 Z"
              fill="white"
            />
            {/* Fuselaje redondeado con ventanilla circular y alerones suaves */}
            <path
              fill="white"
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M 12 2.5 C 14.2 2.5 16.2 6.5 16.2 12.5 L 19.2 15 C 20.4 16 19.8 18 18.2 18 L 15.8 18 L 15 17.2 L 9 17.2 L 8.2 18 L 5.8 18 C 4.2 18 3.6 16 4.8 15 L 7.8 12.5 C 7.8 6.5 9.8 2.5 12 2.5 Z M 12 8 A 2.2 2.2 0 1 0 12 12.4 A 2.2 2.2 0 1 0 12 8 Z"
            />
          </g>
        </svg>

        {/* 4. Estrella - Oscilación cósmica suave sin vuelta completa */}
        <svg
          className="block h-6 w-6 sm:h-7 sm:w-7 shrink-0 overflow-visible text-white animate-star-sway"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fill="white"
            stroke="white"
            strokeWidth="2.2"
            strokeLinejoin="round"
            strokeLinecap="round"
            d="M 12 3.2 C 12.8 7.6 16.4 11.2 20.8 12 C 16.4 12.8 12.8 16.4 12 20.8 C 11.2 16.4 7.6 12.8 3.2 12 C 7.6 11.2 11.2 7.6 12 3.2 Z"
          />
        </svg>
      </div>
      <div
        aria-hidden="true"
        className="flex h-6 w-24 min-w-0 flex-none justify-end sm:w-40 lg:w-1/4"
      >
        <div ref={waveRef} className="h-full w-full">
          <svg
            className="block h-full w-full overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="wave-tail-fade"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0" stopColor="white" stopOpacity="0" />
                <stop offset="0.55" stopColor="white" stopOpacity="0.55" />
                <stop offset="1" stopColor="white" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <path
              ref={wavePathRef}
              fill="url(#wave-tail-fade)"
              stroke="url(#wave-tail-fade)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="intro-wave-fill"
            />
            <g ref={waveStarRef} className="intro-wave-fill">
              <path
                d={WAVE_STAR_D}
                fill="white"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="wave-star-pop"
              />
            </g>
          </svg>
        </div>
      </div>
    </footer>
  )
}
