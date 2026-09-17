import { useEffect, useRef, useState } from 'react'
import ChatPanel from './components/ChatPanel.jsx'
import CvContent from './components/CvContent.jsx'
import CustomScrollbar from './components/CustomScrollbar.jsx'
import FolderFrame from './components/FolderFrame.jsx'
import Grainient from './components/Grainient.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import { useFolderInset } from './hooks/useFolderInset.js'
import { INTRO_MS } from './lib/portfolio.js'

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
    <main className="h-screen supports-[height:100dvh]:h-dvh overflow-hidden bg-[#0b1c55] font-sans text-white antialiased">
      {/* Fondo Grainient azul profundo con ajustes de brillo/contraste predefinidos.
          El grano sale del shader y se pinta estático y nítido encima con .grain-overlay. */}
      <div
        aria-hidden="true"
        style={{
          filter: 'brightness(90%) contrast(111%)',
        }}
        className="fixed inset-0 z-0"
      >
        <Grainient
          color1="#5e90c6"
          color2="#2038c9"
          color3="#0b1c55"
          colorBalance={-0.15}
          timeSpeed={0.3}
          warpStrength={1}
          warpFrequency={2}
          warpSpeed={2}
          warpAmplitude={35}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={6}
          grainAmount={0}
          grainScale={4}
          grainAnimated={false}
          contrast={1.6}
          saturation={1.5}
          zoom={0.9}
          renderScale={0.15}
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
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
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
        </defs>
      </svg>
      <ChatPanel chatOpen={chatOpen} introDone={introDone} panelRef={chatPanelRef} />
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
