import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import CvContent from './components/CvContent.jsx'
import CustomScrollbar from './components/CustomScrollbar.jsx'
import FolderFrame from './components/FolderFrame.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import { useFolderInset } from './hooks/useFolderInset.js'
import { INTRO_MS } from './lib/portfolio.js'

// El panel de chat está oculto hasta que se colapsa la carpeta: chunk
// aparte + prefetch en tiempo libre.
const ChatPanel = lazy(() => import('./components/ChatPanel.jsx'))
// La galería vive en una capa fija a sangre completa (fuera del scroll y
// del filtro de pixelado) para poder desbordar horizontalmente sin recortes.
const Carousel = lazy(() => import('./components/Carousel.jsx'))

// Orquestador del layout: posee intro + contenedor de scroll y compone
// los independientes ChatPanel (preguntas), FolderFrame (outline),
// CvContent (CV, pixelado) + CustomScrollbar, y SiteFooter (onda). La geometría
// animada vive en useFolderInset; cada componente posee su propio efecto.
function App() {
  const scrollContainerRef = useRef(null)
  const [introDone, setIntroDone] = useState(
    () =>
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ??
      false,
  )
  // Pestaña CV/Blog (vive en CvContent, pero App la necesita para mostrar
  // el fondo de ondas del blog tras el contenido).
  const [tab, setTab] = useState('cv')
  const [mobileLayout, setMobileLayout] = useState(() =>
    window.matchMedia('(max-width: 639px), (hover: none) and (pointer: coarse)').matches,
  )

  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px), (hover: none) and (pointer: coarse)')
    const update = () => setMobileLayout(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (introDone) return
    const id = window.setTimeout(() => setIntroDone(true), INTRO_MS)
    return () => window.clearTimeout(id)
  }, [introDone])

  useEffect(() => {
    if (!CSS.supports('-webkit-touch-callout', 'none')) return
    // shortcut: Safari iOS recorta fondos fijos bajo su UI; retirar cuando WebKit los extienda.
    const extendBackground = () => {
      if (window.scrollY !== 100) window.scrollTo(0, 100)
    }
    extendBackground()
    window.addEventListener('resize', extendBackground)
    window.addEventListener('scroll', extendBackground, { passive: true })
    return () => {
      window.removeEventListener('resize', extendBackground)
      window.removeEventListener('scroll', extendBackground)
    }
  }, [])

  // Precarga de los chunks del chat y la galería en tiempo libre:
  // invisible al usuario, listos para cuando colapse la carpeta o se
  // abra la pestaña IMG.
  useEffect(() => {
    const prefetch = () => {
      import('./components/ChatPanel.jsx')
      import('./components/Carousel.jsx')
    }
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(prefetch, { timeout: 3000 })
      return () => window.cancelIdleCallback?.(id)
    }
    const id = window.setTimeout(prefetch, 1500)
    return () => window.clearTimeout(id)
  }, [])

  const {
    frameRef,
    frameLeftRef,
    frameRightRef,
    frameChevRef,
    chevBtnRef,
    topHintRef,
    chatPanelRef,
    contentWrapRef,
    filteredContentRef,
    pixelFilterRef,
    maskImgRef,
    blurRef,
    pixelFadeRef,
    gradientRef,
    galleryRef,
    chatOpen,
    atMinHeight,
    insetAnimating,
    handleChevClick,
  } = useFolderInset({ introDone, scrollContainerRef, mobileLayout, tab })

  return (
    <>
      <div
        aria-hidden="true"
        className="site-background pointer-events-none absolute inset-x-0 top-0 z-0 h-screen supports-[height:100lvh]:h-lvh"
      >
        <div aria-hidden="true" className="grain-overlay" />
      </div>
      <main data-mobile={mobileLayout} className="viewport-shell fixed inset-x-0 top-0 z-10 h-screen supports-[height:100dvh]:h-dvh overflow-hidden font-sans text-white antialiased">
      {/* Ondas pixeladas negras que nacen del borde inferior: capa trasera
          bajo el contenido (no tapa lo que desborda); useFolderInset la
          recorta del interior del marco con la misma clipshape. */}
      <div
        aria-hidden="true"
        ref={gradientRef}
        className="pixel-gradient pointer-events-none fixed inset-0 z-[5]"
      />
      <svg
        className="pointer-events-none fixed inset-0 -z-10 h-0 w-0"
        aria-hidden="true"
      >
        <defs>
          {!mobileLayout && (
          <filter
            ref={pixelFilterRef}
            id="pixelate"
            filterUnits="userSpaceOnUse"
            x="-8%"
            y="-8%"
            width="116%"
            height="116%"
            colorInterpolationFilters="sRGB"
          >
            {/* El mapa RG dirige cada bloque de 12px a su centro sin dilatar
                toda la pantalla. La textura a 16× evita bandas en pantallas Retina. */}
            <feImage href="/pixel-offsets.png" x="0" y="0" width="12" height="12" preserveAspectRatio="none" result="offset-tile" />
            <feTile in="offset-tile" result="offset-map" />
            <feDisplacementMap in="SourceGraphic" in2="offset-map" scale="12" xChannelSelector="R" yChannelSelector="G" result="pix" />
            {/* Exterior al 50 % sobre el fondo; se desvanece al abrir el chat. */}
            <feComponentTransfer in="pix" result="pixFade">
              <feFuncA ref={pixelFadeRef} type="linear" slope="0.5" />
            </feComponentTransfer>
            {/* Máscara del interior del marco, invertida (la escribe
                useFolderInset): el mosaico se ve FUERA del marco y dentro
                pasa el contenido nítido (o desenfocado al colapsar). Así el
                contenido puede desbordar y el efecto queda confinado al exterior. */}
            <feImage
              ref={maskImgRef}
              x="0"
              y="0"
              width="1"
              height="1"
              preserveAspectRatio="none"
              result="mask"
            />
            <feComposite in="pixFade" in2="mask" operator="out" result="pixOut" />
            {/* Blur dinámico del interior del marco: al colapsar se desenfoca
                progresivamente hasta 22px, y al expandir vuelve a 0px (nítido). */}
            <feGaussianBlur
              ref={blurRef}
              in="SourceGraphic"
              stdDeviation="0"
              result="srcBlur"
            />
            <feComposite
              in="srcBlur"
              in2="mask"
              operator="in"
              result="srcIn"
            />
            <feComposite in="pixOut" in2="srcIn" operator="over" />
          </filter>
          )}
        </defs>
      </svg>
      <Suspense fallback={null}>
        <ChatPanel chatOpen={chatOpen} introDone={introDone} panelRef={chatPanelRef} />
      </Suspense>
      <FolderFrame
        frameRef={frameRef}
        frameLeftRef={frameLeftRef}
        frameRightRef={frameRightRef}
        frameChevRef={frameChevRef}
        chevBtnRef={chevBtnRef}
        topHintRef={topHintRef}
        atMinHeight={atMinHeight}
        chatOpen={chatOpen}
        onChevClick={handleChevClick}
      />
      <div
        ref={contentWrapRef}
        inert={chatOpen}
        style={{ top: 0 }}
        className="intro-content fixed inset-y-0 left-[calc(var(--side)+var(--frame-border))] right-[calc(var(--side)+var(--frame-border))] z-10 flex items-stretch gap-5 pr-3 sm:gap-8 sm:pr-10"
      >
        <CustomScrollbar
          scrollContainerRef={scrollContainerRef}
          filteredContentRef={filteredContentRef}
          atMinHeight={atMinHeight}
          insetAnimating={insetAnimating}
          trackHidden={tab === 'img'}
        >
          <CvContent tab={tab} onTabChange={setTab} />
        </CustomScrollbar>
      </div>
      {/* Galería a sangre completa, con scroll vertical en pantallas bajas. */}
      {tab === 'img' && (
        <div
          ref={galleryRef}
          className="gallery-panel fixed inset-x-0 z-20 overflow-y-auto overscroll-contain"
          style={{ visibility: chatOpen ? 'hidden' : undefined }}
          inert={chatOpen}
        >
          <Suspense fallback={null}>
            <Carousel active={!chatOpen} mobile={mobileLayout} />
          </Suspense>
        </div>
      )}
      <SiteFooter mobile={mobileLayout} />
    </main>
    </>
  )
}

export default App
