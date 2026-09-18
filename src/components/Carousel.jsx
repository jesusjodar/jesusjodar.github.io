// Medios de la carpeta `galeria/` (raíz del proyecto): se importan como
// URLs con import.meta.glob para que Vite los copie al bundle con hash,
// sin mover nada a `public/`.
// Los archivos que comparten el mismo prefijo numérico (ej: 1-1, 1-2, 1-3)
// se agrupan en el mismo recuadro del carrusel con puntos y flechas de navegación
// debajo para deslizar entre diapositivas en bucle.
// El carrusel es un bucle infinito continuo con scroll-snap al centro.
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getProjectMeta } from '../lib/galleryData.js'

const RAW_MEDIA = Object.entries(
  import.meta.glob('../../galeria/*.{webp,mp4}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
).map(([path, url]) => {
  const file = path.split('/').pop()
  const match = file.match(/^(\d+)(?:-(\d+))?/)
  const group = match ? parseInt(match[1], 10) : 0
  const sub = match && match[2] ? parseInt(match[2], 10) : 1
  return {
    file,
    url,
    group,
    sub,
    video: file.endsWith('.mp4'),
  }
})

// Agrupamos por número inicial manteniendo el orden numérico
const groupMap = new Map()
for (const item of RAW_MEDIA) {
  if (!groupMap.has(item.group)) {
    groupMap.set(item.group, [])
  }
  groupMap.get(item.group).push(item)
}

const GROUPS = Array.from(groupMap.entries())
  .sort(([a], [b]) => a - b)
  .map(([groupNum, slides]) => {
    slides.sort((a, b) => a.sub - b.sub)
    return {
      id: groupNum,
      slides,
    }
  })

// Generamos 3 copias para el bucle infinito (Buffer Izquierdo, Centro, Buffer Derecho)
const COPIES = 3
const LOOP_ITEMS = Array.from({ length: COPIES }, (_, copyIdx) =>
  GROUPS.map((group) => ({
    ...group,
    copyIndex: copyIdx,
    uniqueKey: `${copyIdx}-${group.id}`,
  })),
).flat()

// Proporciones conocidas para evitar saltos de layout iniciales
const KNOWN_RATIOS = {
  4: '9 / 16',
  14: '4 / 5',
}

// Margen base de elementos con medios cargados alrededor del foco para virtualización anticipada
const BASE_VIRTUAL_BUFFER = 8

// Chevrons de navegación sin redondeo con trazo de 4px idéntico al outline
function ChevronLeft() {
  return (
    <svg
      width="10"
      height="14"
      viewBox="0 0 14 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className="block"
      style={{ vectorEffect: 'non-scaling-stroke' }}
      aria-hidden="true"
    >
      <path d="M 9.5 3.5 L 4.5 8 L 9.5 12.5" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg
      width="10"
      height="14"
      viewBox="0 0 14 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className="block"
      style={{ vectorEffect: 'non-scaling-stroke' }}
      aria-hidden="true"
    >
      <path d="M 4.5 3.5 L 9.5 8 L 4.5 12.5" />
    </svg>
  )
}

function SlideVideo({ src, active, onLoadedMetadata }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (active) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [active])

  return (
    <video
      ref={videoRef}
      src={src}
      aria-hidden="true"
      tabIndex={-1}
      className="block h-full w-full object-contain"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      onLoadedMetadata={onLoadedMetadata}
    />
  )
}

const CarouselItem = memo(function CarouselItem({
  group,
  index,
  isFocused,
  isVirtual,
  activeIndex,
  onSelectSlide,
  onPrevSlide,
  onNextSlide,
  onFocusItem,
  itemRef,
}) {
  const defaultRatio = KNOWN_RATIOS[group.id] || '1 / 1'
  const [aspectRatio, setAspectRatio] = useState(defaultRatio)

  const hasMultiple = group.slides.length > 1

  return (
    <div
      ref={itemRef}
      onClick={() => {
        if (!isFocused) onFocusItem(index)
      }}
      className="flex shrink-0 snap-center flex-col items-center select-none"

    >
      <div
        aria-label={`Grupo ${group.id}: diapositiva ${activeIndex + 1} de ${group.slides.length}`}
        className={`relative h-60 overflow-hidden border-4 transition-all duration-300 ease-out sm:h-80 ${
          isFocused
            ? 'scale-100 border-white bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.22)]'
            : 'scale-90 cursor-pointer border-white/30 bg-white/5 hover:border-white/60'
        }`}
        style={{ aspectRatio: isVirtual ? defaultRatio : aspectRatio }}
      >
        {!isVirtual ? (
          <div
            className="flex h-full w-full transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
          {group.slides.map((slide, i) => (
            <div
              key={slide.file}
              className="flex h-full w-full shrink-0 items-center justify-center overflow-hidden"
              aria-hidden={i !== activeIndex}
            >
              {slide.video ? (
                <SlideVideo
                  src={slide.url}
                  active={isFocused && i === activeIndex}
                  onLoadedMetadata={(e) => {
                    if (
                      i === 0 &&
                      e.currentTarget.videoWidth &&
                      e.currentTarget.videoHeight
                    ) {
                      setAspectRatio(
                        `${e.currentTarget.videoWidth} / ${e.currentTarget.videoHeight}`,
                      )
                    }
                  }}
                />
              ) : (
                <img
                  src={slide.url}
                  alt=""
                  loading="eager"
                  decoding="async"
                  draggable={false}
                  className="pointer-events-none block h-full w-full select-none object-contain"
                  onLoad={(e) => {
                    if (
                      i === 0 &&
                      e.currentTarget.naturalWidth &&
                      e.currentTarget.naturalHeight
                    ) {
                      setAspectRatio(
                        `${e.currentTarget.naturalWidth} / ${e.currentTarget.naturalHeight}`,
                      )
                    }
                  }}
                />
              )}
            </div>
          ))}
          </div>
        ) : (
          <div className="h-full w-full bg-white/[0.02]" />
        )}
      </div>

      {/* Controles bajo el elemento del carousel (flechas + puntos en bucle) */}
      <div
        className={`mt-2.5 flex h-5 items-center justify-center gap-2 transition-opacity duration-200 ${
          isFocused ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {!isVirtual && hasMultiple && (
          <>
            <button
              type="button"
              aria-label="Diapositiva anterior"
              disabled={!isFocused}
              tabIndex={isFocused ? 0 : -1}
              onClick={(e) => {
                e.stopPropagation()
                onPrevSlide(group.id, group.slides.length)
              }}
              className="flex h-5 w-5 cursor-pointer items-center justify-center p-0 text-white transition-opacity duration-150 hover:text-white focus:outline-none"
            >
              <ChevronLeft />
            </button>

            <div className="flex items-center justify-center gap-1.5">
              {group.slides.map((slide, i) => {
                const isActive = i === activeIndex
                return (
                  <button
                    key={slide.file}
                    type="button"
                    aria-label={`Ir a la diapositiva ${i + 1} de ${group.slides.length}`}
                    aria-current={isActive ? 'true' : undefined}
                    tabIndex={isFocused ? 0 : -1}
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectSlide(group.id, i)
                    }}
                    className="group flex h-4 w-4 cursor-pointer items-center justify-center p-0 focus:outline-none"
                  >
                    <span
                      className={`h-2 w-2 rounded-full transition-all duration-200 ${
                        isActive
                          ? 'scale-110 bg-white'
                          : 'bg-white/30 group-hover:bg-white/60'
                      }`}
                    />
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              aria-label="Diapositiva siguiente"
              disabled={!isFocused}
              tabIndex={isFocused ? 0 : -1}
              onClick={(e) => {
                e.stopPropagation()
                onNextSlide(group.id, group.slides.length)
              }}
              className="flex h-5 w-5 cursor-pointer items-center justify-center p-0 text-white transition-opacity duration-150 hover:text-white focus:outline-none"
            >
              <ChevronRight />
            </button>
          </>
        )}
      </div>
    </div>
  )
})

export default function Carousel({ onFocusChange }) {
  const stripRef = useRef(null)
  const [bufferSize, setBufferSize] = useState(() => {
    if (typeof window !== 'undefined') {
      return Math.max(BASE_VIRTUAL_BUFFER, Math.ceil(window.innerWidth / 280) + 4)
    }
    return BASE_VIRTUAL_BUFFER
  })

  // Ajustar buffer reactivamente según el ancho del viewport para pantallas anchas/ultrawide
  useEffect(() => {
    const updateBuffer = () => {
      const width = stripRef.current?.clientWidth || window.innerWidth
      const needed = Math.max(BASE_VIRTUAL_BUFFER, Math.ceil(width / 280) + 4)
      setBufferSize((prev) => (prev !== needed ? needed : prev))
    }
    updateBuffer()
    window.addEventListener('resize', updateBuffer)
    return () => window.removeEventListener('resize', updateBuffer)
  }, [])
  const itemRefs = useRef([])
  const [focusedIndex, setFocusedIndex] = useState(GROUPS.length)
  const focusedIndexRef = useRef(GROUPS.length)
  const rafId = useRef(null)
  const scrollTimeoutRef = useRef(null)
  const isResettingRef = useRef(false)

  // Estado compartido del índice de diapositiva por cada grupo
  const [slideMap, setSlideMap] = useState({})

  const handleSelectSlide = useCallback((groupId, idx) => {
    setSlideMap((prev) => ({ ...prev, [groupId]: idx }))
  }, [])

  const handlePrevSlide = useCallback((groupId, total) => {
    setSlideMap((prev) => {
      const cur = prev[groupId] || 0
      return { ...prev, [groupId]: cur > 0 ? cur - 1 : total - 1 }
    })
  }, [])

  const handleNextSlide = useCallback((groupId, total) => {
    setSlideMap((prev) => {
      const cur = prev[groupId] || 0
      return { ...prev, [groupId]: (cur + 1) % total }
    })
  }, [])

  // Posicionar inicialmente en el elemento 0 del conjunto central (loop infinito)
  useLayoutEffect(() => {
    const container = stripRef.current
    const initialIndex = GROUPS.length
    const itemEl = itemRefs.current[initialIndex]
    if (!container || !itemEl) return
    const targetScrollLeft =
      itemEl.offsetLeft - (container.clientWidth - itemEl.offsetWidth) / 2
    container.scrollLeft = targetScrollLeft
    focusedIndexRef.current = initialIndex
    setFocusedIndex(initialIndex)
  }, [])

  // Notificar al padre el cambio de elemento o diapositiva en foco para sincronizar título y subtítulo
  useEffect(() => {
    const activeItem = LOOP_ITEMS[focusedIndex] || GROUPS[0]
    if (!activeItem) return
    const curSlideIdx = slideMap[activeItem.id] || 0
    const curSlide = activeItem.slides[curSlideIdx] || activeItem.slides[0]
    const slideKey = curSlide ? curSlide.file.replace(/\.[^/.]+$/, "") : String(activeItem.id)
    onFocusChange?.(slideKey)
  }, [focusedIndex, onFocusChange, slideMap])

  // Desplazar suavemente un elemento al centro
  const scrollToItem = useCallback((index) => {
    const container = stripRef.current
    const itemEl = itemRefs.current[index]
    if (!container || !itemEl) return
    const targetScrollLeft =
      itemEl.offsetLeft - (container.clientWidth - itemEl.offsetWidth) / 2
    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth',
    })
  }, [])

  // Recolocación silenciosa e imperceptible en el conjunto central
  const reCenter = useCallback(() => {
    if (isResettingRef.current) return
    const container = stripRef.current
    if (!container) return
    const curIdx = focusedIndexRef.current
    const N = GROUPS.length

    if (curIdx < N || curIdx >= 2 * N) {
      isResettingRef.current = true
      const norm = ((curIdx % N) + N) % N
      const targetIdx = N + norm
      const curEl = itemRefs.current[curIdx]
      const targetEl = itemRefs.current[targetIdx]

      if (curEl && targetEl) {
        const diff = targetEl.offsetLeft - curEl.offsetLeft
        container.style.scrollSnapType = 'none'
        container.scrollLeft += diff
        void container.offsetWidth // Forzar reflow inmediato
        container.style.scrollSnapType = 'x mandatory'
        focusedIndexRef.current = targetIdx
        setFocusedIndex(targetIdx)
      }
      isResettingRef.current = false
    }
  }, [])

  // Calcular cuál elemento está más cerca del centro del viewport
  const updateFocus = useCallback(() => {
    if (isResettingRef.current) return
    const container = stripRef.current
    if (!container) return
    const containerCenter = container.scrollLeft + container.clientWidth / 2
    let closestIndex = 0
    let minDistance = Infinity

    for (let i = 0; i < itemRefs.current.length; i++) {
      const itemEl = itemRefs.current[i]
      if (!itemEl) continue
      const itemCenter = itemEl.offsetLeft + itemEl.offsetWidth / 2
      const dist = Math.abs(itemCenter - containerCenter)
      if (dist < minDistance) {
        minDistance = dist
        closestIndex = i
      }
    }

    if (closestIndex !== focusedIndexRef.current) {
      focusedIndexRef.current = closestIndex
      setFocusedIndex(closestIndex)
    }
  }, [])

  const handleScroll = useCallback(() => {
    if (rafId.current) return
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null
      updateFocus()
    })

    // Debounce para re-centrar cuando el desplazamiento se detiene
    clearTimeout(scrollTimeoutRef.current)
    scrollTimeoutRef.current = setTimeout(reCenter, 140)
  }, [updateFocus, reCenter])

  // Navegación con teclado (Flecha izquierda / derecha)
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        const next = Math.max(0, focusedIndexRef.current - 1)
        scrollToItem(next)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        const next = Math.min(LOOP_ITEMS.length - 1, focusedIndexRef.current + 1)
        scrollToItem(next)
      }
    },
    [scrollToItem],
  )

  // Escuchar scrollend nativo para recolocar de inmediato al terminar el snap
  useEffect(() => {
    const el = stripRef.current
    if (!el) return
    const onScrollEnd = () => reCenter()
    el.addEventListener('scrollend', onScrollEnd)
    return () => el.removeEventListener('scrollend', onScrollEnd)
  }, [reCenter])

  // La rueda vertical se traduce a desplazamiento horizontal con snap
  useEffect(() => {
    const el = stripRef.current
    if (!el) return
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      if (el.scrollWidth <= el.clientWidth) return
      e.preventDefault()
      el.scrollLeft += e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const activeItem = LOOP_ITEMS[focusedIndex] || GROUPS[0]
  const activeSlideIdx = (activeItem && slideMap[activeItem.id]) || 0
  const activeSlide = (activeItem && activeItem.slides[activeSlideIdx]) || activeItem?.slides[0]
  const activeSlideKey = activeSlide ? activeSlide.file.replace(/\.[^/.]+$/, '') : String(activeItem?.id || '1')
  const activeMeta = getProjectMeta(activeSlideKey)

  return (
    <div className="relative flex w-full flex-col select-none">
      <div
        ref={stripRef}
        role="region"
        aria-label="Galería de imágenes"
        tabIndex={0}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        className="no-scrollbar pointer-events-auto w-full overflow-x-auto snap-x snap-mandatory focus:outline-none [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      >
        <div className="gallery-scope mx-auto flex w-max max-w-none items-center gap-3 pb-4 sm:gap-6">
          {LOOP_ITEMS.map((item, index) => {
            const isVirtual = Math.abs(index - focusedIndex) > bufferSize
            return (
              <CarouselItem
                key={item.uniqueKey}
                group={item}
                index={index}
                isFocused={index === focusedIndex}
                isVirtual={isVirtual}
              activeIndex={slideMap[item.id] || 0}
              onSelectSlide={handleSelectSlide}
              onPrevSlide={handlePrevSlide}
              onNextSlide={handleNextSlide}
              onFocusItem={scrollToItem}
              itemRef={(el) => {
                itemRefs.current[index] = el
              }}
            />
            )
          })}
        </div>
      </div>

      {/* Chips centrados en la zona inferior bajo los puntos de diapositiva (negro sólido, texto blanco, sin outline ni sombra) */}
      {activeMeta.tags && activeMeta.tags.length > 0 && (
        <div className="pointer-events-auto mt-2 flex flex-wrap items-center justify-center gap-1.5 px-4">
          {activeMeta.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-black px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-wide text-white select-none"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
