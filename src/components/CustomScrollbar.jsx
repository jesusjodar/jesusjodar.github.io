import { useCallback, useLayoutEffect, useRef, useState } from 'react'

// Scrollbar custom minimalista.
// Track con grosor de 7px; el thumb es un pill que durante el scroll (sin interactuar)
// tiene el mismo grosor que la barra, y al hacer hover o drag tiene un ligero zoom.
const PORTFOLIO_CONTAINER_CLASS =
  'content-scroll min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain'
const PAPER_CLASS =
  'pl-5 pt-[var(--content-top)] pb-[calc(var(--footer-h)+var(--frame-footer-gap)+var(--safe-bottom)+var(--frame-border)+2rem)] sm:pl-16 sm:pb-[calc(var(--footer-h)+var(--frame-footer-gap)+var(--safe-bottom)+var(--frame-border)+4rem)]'
const PORTFOLIO_TRACK_CLASS =
  'group scroll-track hidden pointer-fine:block relative mt-[calc(var(--frame-top)+var(--tab-height)+var(--scroll-pad))] mb-[calc(var(--footer-h)+var(--frame-footer-gap)+var(--safe-bottom)+var(--frame-border)+var(--scroll-pad))] z-40 w-[7px] shrink-0 cursor-pointer touch-none rounded-full bg-white/25 opacity-0 transition-opacity duration-200 select-none hover:opacity-100'

export default function CustomScrollbar({
  scrollContainerRef,
  filteredContentRef,
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
  const paperRef = useRef(null)
  const spacerRef = useRef(null)
  const [hasScroll, setHasScroll] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const isDraggingRef = useRef(false)
  const idleTimeoutRef = useRef(null)
  const rafId = useRef(null)
  const metricsRef = useRef({ maxScroll: 0, trackH: 0, thumbH: 44 })

  // El scroll solo mueve capas; las medidas se actualizan al cambiar el tamaño.
  const updateThumb = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const top = container.scrollTop
    if (paperRef.current) paperRef.current.style.transform = `translateY(${-top}px)`
    const { maxScroll, trackH, thumbH } = metricsRef.current
    if (!trackH) return
    const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, top / maxScroll)) : 0
    thumbRef.current.style.transform = `translateY(${ratio * (trackH - thumbH)}px)`
    trackRef.current.setAttribute('aria-valuenow', String(Math.round(ratio * 100)))
  }, [scrollContainerRef])

  const measure = useCallback(() => {
    const container = scrollContainerRef.current
    const paper = paperRef.current
    const track = trackRef.current
    if (!container || !paper || !track) return
    const maxScroll = Math.max(0, paper.offsetHeight - container.clientHeight)
    const trackH = track.clientHeight
    const thumbH = maxScroll > 0 ? Math.min(44, trackH) : trackH
    metricsRef.current = { maxScroll, trackH, thumbH }
    spacerRef.current.style.height = `${maxScroll}px`
    thumbRef.current.style.height = `${thumbH}px`
    setHasScroll(maxScroll > 0)
    updateThumb()
  }, [scrollContainerRef, updateThumb])

  // Mostrar el scrollbar durante el scroll y ocultarlo tras reposo si no se interactúa
  const showScrollbar = useCallback(() => {
    const track = trackRef.current
    if (!track || !metricsRef.current.trackH) return
    track.classList.remove('opacity-0')
    track.classList.add('opacity-100')

    clearTimeout(idleTimeoutRef.current)
    idleTimeoutRef.current = setTimeout(() => {
      if (!isDraggingRef.current && trackRef.current) {
        trackRef.current.classList.remove('opacity-100')
        trackRef.current.classList.add('opacity-0')
      }
    }, 1200)
  }, [])

  const handleScroll = useCallback(() => {
    if (rafId.current) return
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null
      updateThumb()
    })
    showScrollbar()
  }, [updateThumb, showScrollbar])

  // Sincronizar en scroll, resize y cambios de tamaño del contenedor
  useLayoutEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    measure()
    container.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', measure)

    const ro = new ResizeObserver(measure)
    ro.observe(container)
    if (paperRef.current) ro.observe(paperRef.current)

    return () => {
      container.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', measure)
      ro.disconnect()
      clearTimeout(idleTimeoutRef.current)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [scrollContainerRef, handleScroll, measure])

  // Lógica de arrastre directo (drag) con ligera ampliación
  const onPointerDown = useCallback(
    (e) => {
      const container = scrollContainerRef.current
      const track = trackRef.current
      const thumb = thumbRef.current
      if (!container || !track || !thumb) return

      e.preventDefault()
      e.stopPropagation()

      isDraggingRef.current = true
      setIsDragging(true)
      showScrollbar()

      const startY = e.clientY
      const startScroll = container.scrollTop
      const scrollHeight = container.scrollHeight
      const clientHeight = container.clientHeight
      const maxScroll = Math.max(0, scrollHeight - clientHeight)
      const trackH = track.clientHeight
      const thumbH = 44

      if (maxScroll <= 0) return

      const pxPerScroll = (trackH - thumbH) / maxScroll

      const onPointerMove = (moveEv) => {
        if (!isDraggingRef.current) return
        const deltaY = moveEv.clientY - startY
        container.scrollTop = startScroll + deltaY / pxPerScroll
      }

      const onPointerUp = () => {
        isDraggingRef.current = false
        setIsDragging(false)
        showScrollbar()
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerup', onPointerUp)
      }

      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
    },
    [scrollContainerRef, showScrollbar],
  )

  // Clic directo en el track para saltar a la posición correspondiente
  const onTrackClick = useCallback(
    (e) => {
      if (e.target !== trackRef.current) return
      const container = scrollContainerRef.current
      const track = trackRef.current
      if (!container || !track) return

      const rect = track.getBoundingClientRect()
      const scrollHeight = container.scrollHeight
      const clientHeight = container.clientHeight
      const maxScroll = Math.max(0, scrollHeight - clientHeight)
      const trackH = track.clientHeight
      const thumbH = 44

      if (maxScroll <= 0) return

      const ratio = Math.min(
        1,
        Math.max(0, (e.clientY - rect.top - thumbH / 2) / (trackH - thumbH)),
      )
      container.scrollTo({ top: ratio * maxScroll, behavior: 'smooth' })
    },
    [scrollContainerRef],
  )

  // Navegación por teclado en el track accesible
  const onKeyDown = useCallback(
    (e) => {
      const container = scrollContainerRef.current
      if (!container) return
      const maxScroll = container.scrollHeight - container.clientHeight
      if (maxScroll <= 0) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        container.scrollTop += 40
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        container.scrollTop -= 40
      } else if (e.key === 'PageDown') {
        e.preventDefault()
        container.scrollTop += container.clientHeight * 0.8
      } else if (e.key === 'PageUp') {
        e.preventDefault()
        container.scrollTop -= container.clientHeight * 0.8
      } else if (e.key === 'Home') {
        e.preventDefault()
        container.scrollTop = 0
      } else if (e.key === 'End') {
        e.preventDefault()
        container.scrollTop = maxScroll
      }
    },
    [scrollContainerRef],
  )

  return (
    <>
      <div
        ref={scrollContainerRef}
        id={id}
        style={atMinHeight ? { overflowY: 'hidden' } : undefined}
        className={containerClassName}
      >
        {/* Safari omite filtros sobre capas de scroll nativas. Esta superficie
            permanece fija y su contenido sigue el desplazamiento nativo. */}
        <div ref={filteredContentRef} className="pixel-content sticky top-0 h-full overflow-hidden">
          <div ref={paperRef} className={PAPER_CLASS}>{children}</div>
        </div>
        <div ref={spacerRef} aria-hidden="true" />
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
        onClick={onTrackClick}
        onKeyDown={onKeyDown}
        aria-hidden={atMinHeight || trackHidden || !hasScroll ? true : undefined}
        style={
          atMinHeight || insetAnimating || trackHidden || !hasScroll
            ? { opacity: 0, pointerEvents: 'none' }
            : undefined
        }
        className={trackClassName}
      >
        {/* Contenedor del thumb con área de interacción táctil/ratón extendida */}
        <div
          ref={thumbRef}
          onPointerDown={onPointerDown}
          className="group/thumb absolute left-1/2 top-0 flex w-5 -translate-x-1/2 cursor-grab items-center justify-center select-none active:cursor-grabbing"
          style={{ height: '44px' }}
        >
          {/* Pill simple: grosor igual a la barra (7px), ligero zoom en hover o drag */}
          <div
            className={`h-full w-[7px] rounded-full bg-white transition-transform duration-150 ease-out ${
              isDragging ? 'scale-125' : 'group-hover/thumb:scale-125'
            }`}
          />
        </div>
      </div>
    </>
  )
}
