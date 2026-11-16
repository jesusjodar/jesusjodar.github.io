import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './fonts.css'
import './tokens.css'
import './index.css'
import PortfolioSections from './components/PortfolioSections.jsx'
import NoiseBackground from './components/NoiseBackground.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import HeroMessage from './components/HeroMessage.jsx'
import PaperTransition from './components/PaperTransition.jsx'
import ScrollBackground from './components/ScrollBackground.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NoiseBackground />
    <PaperTransition />
    <ScrollBackground />
    <main className="content-scroll">
      <div className="fade-stage">
        <div className="fade-content">
          <HeroMessage />
          <section className="about-section" aria-label="Inteligencia artificial">
            <p className="about-text"><span className="text-highlight">ANALIZO</span>, <span className="text-highlight">INVESTIGO</span> Y <span className="text-highlight">DISEÑO</span> SOLUCIONES A MEDIDA PARA TU NEGOCIO. DESDE TU IDENTIDAD VISUAL HASTA LA EXPERIENCIA DE TUS CLIENTES, CADA DECISIÓN TIENE UN OBJETIVO: <span className="text-highlight">QUE TU MARCA DESTAQUE</span>.</p>
            <div className="artwork-pair" aria-hidden="true">
              <img src="/side-artwork.svg#upper-right-half" alt="" draggable="false" />
              <span className="artwork-edge-right"><img src="/side-artwork.svg" alt="" draggable="false" /></span>
            </div>
          </section>
          <section className="story-section" aria-label="Mi forma de trabajar">
            <p>NO SE TRATA SOLO DE <span className="text-highlight">LLAMAR LA ATENCIÓN</span>, SINO DE <span className="text-highlight">DARLE UN SENTIDO</span>: QUE LO QUE VEN EXPRESE <span className="text-highlight">QUIÉN ERES</span> Y LES DÉ <span className="text-highlight">UNA RAZÓN PARA RECORDARTE</span>.</p>
          </section>
        </div>
        <div className="fade-runway" aria-hidden="true" />
      </div>
      <div className="ai-runway" aria-hidden="true" />
    </main>
    <PortfolioSections />
    <SiteFooter />
  </StrictMode>,
)

// En Safari móvil, un pequeño desplazamiento deja el fondo bajo la barra superior.
if (CSS.supports('-webkit-touch-callout', 'none') && matchMedia('(max-width: 600px)').matches) {
  const revealBackground = () => {
    setTimeout(() => {
      if (window.scrollY === 0) window.scrollTo({ top: 80, behavior: 'instant' })
    }, 100)
  }
  if (document.readyState === 'complete') revealBackground()
  else window.addEventListener('load', revealBackground, { once: true })
}
