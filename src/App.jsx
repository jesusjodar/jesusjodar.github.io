import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import CvContent from './components/CvContent.jsx'
import CustomScrollbar from './components/CustomScrollbar.jsx'
import FolderFrame from './components/FolderFrame.jsx'
import Grainient from './components/Grainient.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import { useFolderInset } from './hooks/useFolderInset.js'
import { INTRO_MS } from './lib/portfolio.js'

// El panel de chat está oculto hasta que se colapsa la carpeta: chunk
// aparte + prefetch en tiempo libre.
const ChatPanel = lazy(() => import('./components/ChatPanel.jsx'))

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

  useEffect(() => {
    if (introDone) return
    const id = window.setTimeout(() => setIntroDone(true), INTRO_MS)
    return () => window.clearTimeout(id)
  }, [introDone])

  // Precarga del chunk del chat en tiempo libre: invisible al usuario,
  // listo para cuando colapse la carpeta.
  useEffect(() => {
    const prefetch = () => import('./components/ChatPanel.jsx')
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
    maskImgRef,
    blurRef,
    pixelFadeRef,
    chatOpen,
    atMinHeight,
    insetAnimating,
    handleChevClick,
  } = useFolderInset({ introDone, scrollContainerRef })

  return (
    <main className="h-screen supports-[height:100dvh]:h-dvh overflow-hidden bg-[#0e0a38] font-sans text-white antialiased">
      {/* Fondo Grainient azul violáceo/magenta con ajustes de brillo/contraste predefinidos.
          El grano sale del shader y se pinta estático y nítido encima con .grain-overlay. */}
      <div
        aria-hidden="true"
        style={{
          filter: 'brightness(90%) contrast(111%)',
        }}
        className="fixed inset-0 z-0"
      >
        <Grainient
          color1="#9f45e3"
          color2="#3123b8"
          color3="#0e0a38"
          colorBalance={-0.15}
          timeSpeed={0.3}
          warpStrength={1}
          warpFrequency={2}
          warpSpeed={2}
          warpAmplitude={45}
          blendSoftness={0.35}
          rotationAmount={500}
          noiseScale={3}
          grainAmount={0.12}
          grainScale={4}
          grainAnimated={false}
          contrast={1.45}
          saturation={1.5}
          zoom={0.9}
          renderScale={0.75}
          frameSkip={2}
        />
        <div aria-hidden="true" className="grain-overlay" />
      </div>
      <svg
        className="pointer-events-none fixed inset-0 -z-10 h-0 w-0"
        aria-hidden="true"
      >
        <defs>
          <filter
            id="pixelate"
            x="-8%"
            y="-8%"
            width="116%"
            height="116%"
            colorInterpolationFilters="sRGB"
          >
            {/* Mosaico SIN blur: muestrea el original nítido y lo expande a
                bloques duros contiguos de 12px (radio 6 = sin separación). */}
            <feFlood x="6" y="6" width="1" height="1" />
            <feComposite width="12" height="12" />
            <feTile result="mosaic" />
            <feComposite in="SourceGraphic" in2="mosaic" operator="in" />
            <feMorphology operator="dilate" radius="6" result="pix" />
            {/* Reducción de opacidad tras pixelar: el mosaico al 50% deja
                entrever el original nítido al combinarse; al colapsar se
                desvanece a 0 para no manchar el panel de chat. */}
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
                progresivamente hasta 28px, y al expandir vuelve a 0px (nítido). */}
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

          {/* Borde ondulado para la foto de perfil.
              clipPathUnits="objectBoundingBox": coords 0-1 relativas al elemento,
              escala sola a cualquier tamaño. 2 ondas por lado usando cúbicas de
              Bézier como aproximación de sinusoide, amplitud 12 %. */}
          <clipPath id="wave-stamp" clipPathUnits="objectBoundingBox">
            <path d="
              M 0,0
              C 0.1667,0.12 0.3333,0.12 0.5,0
              C 0.6667,0.12 0.8333,0.12 1,0
              C 0.88,0.1667 0.88,0.3333 1,0.5
              C 0.88,0.6667 0.88,0.8333 1,1
              C 0.8333,0.88 0.6667,0.88 0.5,1
              C 0.3333,0.88 0.1667,0.88 0,1
              C 0.12,0.8333 0.12,0.6667 0,0.5
              C 0.12,0.3333 0.12,0.1667 0,0
              Z
            " />
          </clipPath>
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
        style={{ top: 0 }}
        className="intro-content pixel-content fixed inset-y-0 left-[calc(var(--frame-margin)+var(--frame-border))] right-[calc(var(--frame-margin)+var(--frame-border))] z-10 flex items-stretch gap-5 pr-3 sm:gap-8 sm:pr-10"
      >
        <CustomScrollbar
          scrollContainerRef={scrollContainerRef}
          atMinHeight={atMinHeight}
          insetAnimating={insetAnimating}
        >
          <CvContent />
        </CustomScrollbar>
      </div>
      <SiteFooter />
    </main>
  )
}

export default App
