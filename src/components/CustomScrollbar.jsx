import { useCallback, useEffect, useRef, useState } from 'react'

// Scrollbar custom minimalista.
// Track con grosor de 7px; el thumb es un pill que durante el scroll (sin interactuar)
// tiene el mismo grosor que la barra, y al hacer hover o drag tiene un ligero zoom.
const PORTFOLIO_CONTAINER_CLASS =
  'content-scroll min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain pl-5 pt-[calc(var(--frame-margin)+var(--tab-height)+var(--frame-border)+1.5rem)] pb-[calc(var(--footer-h)+var(--frame-footer-gap)+var(--frame-border)+2rem)] sm:pl-16 sm:pt-[calc(var(--frame-margin)+var(--tab-height)+var(--frame-border)+3.5rem)] sm:pb-[calc(var(--footer-h)+var(--frame-footer-gap)+var(--frame-border)+4rem)]'
const PORTFOLIO_TRACK_CLASS =
  'group scroll-track relative mt-[calc(var(--frame-margin)+var(--tab-height)+var(--scroll-pad))] mb-[calc(var(--footer-h)+var(--frame-footer-gap)+var(--frame-border)+var(--scroll-pad))] z-40 w-[7px] shrink-0 cursor-pointer touch-none rounded-full bg-white/25 opacity-0 transition-opacity duration-200 select-none hover:opacity-100'

export default function CustomScrollbar({
  scrollContainerRef,
  _contentRef = null,
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
  const [hasScroll, setHasScroll] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const isDraggingRef = useRef(false)
  const idleTimeoutRef = useRef(null)
  const rafId = useRef(null)

  // Actualizar posición del thumb según el scroll del contenedor
  const updateThumb = useCallback(() => {
    const container = scrollContainerRef.current
    const track = trackRef.current
    const thumb = thumbRef.current
    if (!container || !track || !thumb) return

    const scrollHeight = container.scrollHeight
    const clientHeight = container.clientHeight
    const maxScroll = Math.max(0, scrollHeight - clientHeight)
    const trackH = track.clientHeight
    const thumbH = maxScroll <= 0 ? trackH : 44

    const scrollable = maxScroll > 0
    setHasScroll(scrollable)

    if (maxScroll <= 0) {
      thumb.style.transform = 'translateY(0px)'
      thumb.style.height = `${trackH}px`
      return
    }

    const ratio = Math.min(1, Math.max(0, container.scrollTop / maxScroll))
    const y = ratio * (trackH - thumbH)
    thumb.style.height = `${thumbH}px`
    thumb.style.transform = `translateY(${y}px)`
    track.setAttribute('aria-valuenow', String(Math.round(ratio * 100)))
  }, [scrollContainerRef])

  // Mostrar el scrollbar durante el scroll y ocultarlo tras reposo si no se interactúa
  const showScrollbar = useCallback(() => {
    const track = trackRef.current
    if (!track) return
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
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    updateThumb()
    container.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateThumb)

    const ro = new ResizeObserver(updateThumb)
    ro.observe(container)

    return () => {
      container.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateThumb)
      ro.disconnect()
      clearTimeout(idleTimeoutRef.current)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [scrollContainerRef, handleScroll, updateThumb])

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
