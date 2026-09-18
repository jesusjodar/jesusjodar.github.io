import { useEffect, useRef, useState } from 'react'

// Scrollbar custom con estiramiento por velocidad. Componente independiente
// y reutilizable: renderiza el contenedor con scroll + el track, posee sus
// refs de track/thumb y solo recibe la ref del contenedor (la necesita
// también quien coordine desde fuera, p.ej. useFolderInset), los umbrales
// de visibilidad y el contenido como children. Las clases del contenedor y
// del track se pueden sobrescribir; por defecto, las del portfolio (el
// padre lleva items-stretch, así el track se estira entre el margen
// superior y el footer sin height fija).
const PORTFOLIO_CONTAINER_CLASS =
  'content-scroll min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain pl-5 pt-[calc(var(--frame-margin)+var(--tab-height)+var(--frame-border)+1.5rem)] pb-[calc(var(--footer-h)+var(--frame-footer-gap)+var(--frame-border)+2rem)] sm:pl-16 sm:pt-[calc(var(--frame-margin)+var(--tab-height)+var(--frame-border)+3.5rem)] sm:pb-[calc(var(--footer-h)+var(--frame-footer-gap)+var(--frame-border)+4rem)]'
const PORTFOLIO_TRACK_CLASS =
  'group scroll-track relative mt-[calc(var(--frame-margin)+var(--tab-height)+var(--scroll-pad))] mb-[calc(var(--footer-h)+var(--frame-footer-gap)+var(--frame-border)+var(--scroll-pad))] z-40 w-[7px] shrink-0 cursor-pointer touch-none rounded-full bg-white/25 opacity-0 transition-opacity duration-200 select-none hover:opacity-100'

export default function CustomScrollbar({
  scrollContainerRef,
  contentRef = null,
  atMinHeight,
  insetAnimating,
  trackHidden = false,
  children,
  id = 'portfolio-scroll',
  containerClassName = PORTFOLIO_CONTAINER_CLASS,
  trackClassName = PORTFOLIO_TRACK_CLASS,
}) {
  const trackRef = useRef(null)
  const thumbRef = useRef(null)
  const thumbInnerRef = useRef(null)
  const thumbSvgRef = useRef(null)
  const thumbShapeRef = useRef(null)
  const [hasScroll, setHasScroll] = useState(true)
  const hasScrollRef = useRef(true)
  const atMinRef = useRef(atMinHeight)
  const insetAnimatingRef = useRef(insetAnimating)

  useEffect(() => {
    atMinRef.current = atMinHeight
  }, [atMinHeight])

  useEffect(() => {
    insetAnimatingRef.current = insetAnimating
  }, [insetAnimating])

  useEffect(() => {
    const track = trackRef.current
    const thumb = thumbRef.current
    const inner = thumbInnerRef.current
    const container = scrollContainerRef.current
    if (!track || !thumb || !inner || !container) return

    // Métricas cacheadas: scrollHeight/clientHeight solo cambian al
    // redimensionar o crecer el contenido; leerlas cada frame durante el
    // scroll intercalado con escrituras de estilo provoca layout thrash.
    // `wake` (scroll/resize/visibilidad) invalida la caché.
    let metricsCache = null
    const metrics = () => {
      if (metricsCache) return metricsCache
      const scrollHeight = container.scrollHeight
      const viewport = container.clientHeight
      const trackH = track.clientHeight
      const maxScroll = Math.max(0, scrollHeight - viewport)
      const thumbH = maxScroll <= 0 ? trackH : 44
      metricsCache = { trackH, maxScroll, thumbH }
      return metricsCache
    }

    let prevY = container.scrollTop
    let prevT = performance.now()
    let shownY = prevY
    let stretch = 0
    let dir = 0
    let fastMode = false
    let raf = 0
    let idleFrames = 0
    let running = true
    let lastH = -1
    let lastYpx = -1

    const tick = () => {
      if (!running) return
      if (document.hidden || atMinRef.current) {
        // Sin reprogramar: parado total hasta que wake() (scroll, resize,
        // visibilidad o atMinHeight) lo reanude. Antes giraba en vacío.
        running = false
        return
      }
      const now = performance.now()
      const y0 = container.scrollTop
      const dt = Math.max(1, now - prevT)
      const v = (y0 - prevY) / dt
      prevY = y0
      prevT = now
      const target = Math.abs(v) > 0.02 ? Math.min(3, Math.abs(v) * 0.6) : 0
      stretch += (target - stretch) * (target > stretch ? 0.5 : 0.28)
      if (Math.abs(target - stretch) < 0.002) stretch = target
      const dirTarget = Math.max(-1, Math.min(1, v * 2))
      dir += (dirTarget - dir) * (Math.abs(dirTarget) > Math.abs(dir) ? 0.5 : 0.2)
      if (Math.abs(dirTarget - dir) < 0.001) dir = dirTarget
      const { trackH, maxScroll, thumbH } = metrics()
      const scrollable = maxScroll > 0
      if (scrollable !== hasScrollRef.current) {
        hasScrollRef.current = scrollable
        setHasScroll(scrollable)
      }
      // En scroll de velocidad alta se desactivan del todo los efectos
      // (pixelado, fade y opacidad: filter none) y se restauran al aflojar.
      // Entra tarde (>1.8) y sale pronto (<1.2), sin aguantar; con filtro
      // completo durante la animación del marco.
      const wrap = contentRef?.current
      if (wrap && maxScroll > 0) {
        if (!fastMode && !insetAnimatingRef.current && stretch > 1.8) {
          fastMode = true
          wrap.style.filter = 'none'
        } else if (
          fastMode &&
          (insetAnimatingRef.current || stretch < 1.2)
        ) {
          fastMode = false
          wrap.style.filter = ''
        }
      }
      const H = maxScroll <= 0 ? trackH : thumbH * (1 + stretch)
      const ratio =
        maxScroll <= 0 ? 0 : Math.min(1, Math.max(0, y0 / maxScroll))
      const center = ratio * (trackH - thumbH) + thumbH / 2
      const extra = H - thumbH
      const baseTop = center - thumbH / 2
      const anchored = baseTop - extra / 2 - dir * extra / 2
      const y = Math.min(Math.max(0, anchored), Math.max(0, trackH - H))
      // Evita escrituras DOM si nada cambió (antes: cada frame)
      if (Math.abs(H - lastH) > 0.1 || Math.abs(y - lastYpx) > 0.1) {
        thumb.style.height = `${H}px`
        thumb.style.transform = `translateY(${y}px)`
        track.setAttribute('aria-valuenow', String(Math.round(ratio * 100)))
        lastH = H
        lastYpx = y
        const svg = thumbSvgRef.current
        const shape = thumbShapeRef.current
        if (svg && shape) {
          const w = 14
          const cx = w / 2
          const baseR = w / 2
          const taper =
            Math.min(0.9, stretch * 0.55) * Math.min(1, Math.abs(dir) + 0.15)
          let rt = baseR
          let rb = baseR
          if (dir >= 0) rt = baseR * (1 - taper)
          else rb = baseR * (1 - taper)
          rt = Math.max(0.5, rt)
          rb = Math.max(0.5, rb)
          const dc = Math.max(1, H - rt - rb)
          const ny = Math.max(-0.9, Math.min(0.9, -(rb - rt) / dc))
          const nx = Math.sqrt(Math.max(0, 1 - ny * ny))
          const f = (n) => n.toFixed(2)
          const t1lx = cx - rt * nx
          const t1ly = rt + rt * ny
          const t1rx = cx + rt * nx
          const t1ry = rt + rt * ny
          const t2rx = cx + rb * nx
          const t2ry = H - rb + rb * ny
          const t2lx = cx - rb * nx
          const t2ly = H - rb + rb * ny
          const topLarge = ny > 0.001 ? 1 : 0
          const botLarge = ny < -0.001 ? 1 : 0
          shape.setAttribute(
            'd',
            `M ${f(t1lx)} ${f(t1ly)} ` +
              `A ${f(rt)} ${f(rt)} 0 ${topLarge} 1 ${f(t1rx)} ${f(t1ry)} ` +
              `L ${f(t2rx)} ${f(t2ry)} ` +
              `A ${f(rb)} ${f(rb)} 0 ${botLarge} 1 ${f(t2lx)} ${f(t2ly)} Z`,
          )
          svg.setAttribute('viewBox', `0 0 ${w} ${Math.max(1, H).toFixed(1)}`)
        }
        idleFrames = 0
      } else if (Math.abs(v) < 0.001 && stretch < 0.01 && Math.abs(dir) < 0.01) {
        idleFrames += 1
        // Tras ~2s quieto, pausa el rAF hasta el próximo scroll/resize
        if (idleFrames > 120) {
          running = false
          return
        }
      } else {
        idleFrames = 0
      }
      if (y0 !== shownY) {
        shownY = y0
        show()
      }
      raf = requestAnimationFrame(tick)
    }

    const wake = () => {
      metricsCache = null
      if (!running) {
        running = true
        prevT = performance.now()
        idleFrames = 0
        raf = requestAnimationFrame(tick)
      }
      show()
    }

    const jumpTo = (clientY) => {
      const { trackH, maxScroll, thumbH } = metrics()
      if (maxScroll <= 0) return
      const rect = track.getBoundingClientRect()
      const ratio = Math.min(
        1,
        Math.max(0, (clientY - rect.top - thumbH / 2) / (trackH - thumbH)),
      )
      container.scrollTo({ top: ratio * maxScroll })
    }

    let dragging = false
    let startY = 0
    let startScroll = 0
    let idle
    let pulse
    const show = () => {
      inner.classList.add('opacity-100')
      track.classList.remove('opacity-0')
      clearTimeout(idle)
      idle = setTimeout(() => {
        if (!dragging) {
          inner.classList.remove('opacity-100')
          track.classList.add('opacity-0')
        }
      }, 1500)
    }
    const zoom = () => inner.classList.add('scale-[0.85]')
    const unzoom = () => inner.classList.remove('scale-[0.85]')

    const onPointerMove = (e) => {
      if (!dragging) return
      const { trackH, maxScroll, thumbH } = metrics()
      if (maxScroll <= 0 || trackH <= thumbH) return
      const pxPerScroll = (trackH - thumbH) / maxScroll
      container.scrollTo({ top: startScroll + (e.clientY - startY) / pxPerScroll })
    }
    const stopDrag = () => {
      if (!dragging) return
      dragging = false
      unzoom()
      show()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', stopDrag)
    }
    const onThumbDown = (e) => {
      dragging = true
      startY = e.clientY
      startScroll = container.scrollTop
      e.preventDefault()
      zoom()
      show()
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', stopDrag)
    }
    const onTrackDown = (e) => {
      if (e.target !== track) return
      jumpTo(e.clientY)
      zoom()
      show()
      clearTimeout(pulse)
      pulse = setTimeout(unzoom, 250)
    }
    const onTrackKey = (e) => {
      const { maxScroll } = metrics()
      if (maxScroll <= 0) return
      const step = container.clientHeight * 0.8
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        container.scrollTo({ top: container.scrollTop + 40 })
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        container.scrollTo({ top: container.scrollTop - 40 })
      } else if (e.key === 'PageDown') {
        e.preventDefault()
        container.scrollTo({ top: container.scrollTop + step })
      } else if (e.key === 'PageUp') {
        e.preventDefault()
        container.scrollTo({ top: container.scrollTop - step })
      } else if (e.key === 'Home') {
        e.preventDefault()
        container.scrollTo({ top: 0 })
      } else if (e.key === 'End') {
        e.preventDefault()
        container.scrollTo({ top: maxScroll })
      }
    }

    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', wake)
    container.addEventListener('scroll', wake, { passive: true })
    const ro = new ResizeObserver(wake)
    ro.observe(container)
    thumb.addEventListener('pointerdown', onThumbDown)
    track.addEventListener('pointerdown', onTrackDown)
    track.addEventListener('keydown', onTrackKey)
    document.addEventListener('visibilitychange', wake)
    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', wake)
      container.removeEventListener('scroll', wake)
      ro.disconnect()
      thumb.removeEventListener('pointerdown', onThumbDown)
      track.removeEventListener('pointerdown', onTrackDown)
      track.removeEventListener('keydown', onTrackKey)
      document.removeEventListener('visibilitychange', wake)
      clearTimeout(idle)
      clearTimeout(pulse)
      if (dragging) stopDrag()
    }
  }, [scrollContainerRef, contentRef, atMinHeight])

  return (
    <>
      <div
        ref={scrollContainerRef}
        id={id}
        style={atMinHeight ? { overflowY: 'hidden' } : undefined}
        className={containerClassName}
      >
        {children}
      </div>
      <div
        ref={trackRef}
        role="scrollbar"
        aria-controls={id}
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      tabIndex={0}
      aria-hidden={atMinHeight || trackHidden || !hasScroll ? true : undefined}
      style={
        atMinHeight || insetAnimating || trackHidden || !hasScroll
          ? { opacity: 0, pointerEvents: 'none' }
          : undefined
      }
      className={trackClassName}
    >
      <div
        ref={thumbRef}
        className="absolute left-1/2 top-0 w-3.5 -translate-x-1/2"
      >
        <div
          ref={thumbInnerRef}
          className="h-full w-full cursor-grab opacity-0 transition-[opacity,scale] duration-200 group-hover:opacity-100 active:cursor-grabbing"
        >
          <svg
            ref={thumbSvgRef}
            className="block h-full w-full"
            aria-hidden="true"
          >
            <path ref={thumbShapeRef} fill="white" d="" />
          </svg>
        </div>
      </div>
      </div>
    </>
  )
}
