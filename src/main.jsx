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
          <section className="about-section" aria-label="About me">
            <p className="about-text">I’M A <span className="text-highlight">CURIOUS, CREATIVE PERSON</span> EXPLORING TECHNOLOGY, DESIGN AND INNOVATION. I COMBINE <span className="text-highlight">PROGRAMMING, 3D DESIGN AND ARTIFICIAL INTELLIGENCE</span> TO UNDERSTAND HOW THINGS WORK AND TURN IDEAS INTO REAL PROJECTS.</p>
            <div className="artwork-pair" aria-hidden="true">
              <img src="/side-artwork.svg#upper-right-half" alt="" draggable="false" />
              <span className="artwork-edge-right"><img src="/side-artwork.svg" alt="" draggable="false" /></span>
            </div>
          </section>
          <section className="story-section" aria-label="How I work">
            <p>I LEARN BY <span className="text-highlight">EXPERIMENTING, RESEARCHING AND BUILDING</span>. I ENJOY SOLVING PROBLEMS, QUESTIONING FAMILIAR APPROACHES AND PAYING ATTENTION TO THE DETAILS THAT TURN AN IDEA INTO <span className="text-highlight">SOMETHING WORTH MAKING</span>.</p>
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
