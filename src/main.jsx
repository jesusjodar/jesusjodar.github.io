import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './fonts.css'
import './index.css'
import SiteFooter from './components/SiteFooter.jsx'
import SocialMosaic from './components/SocialMosaic.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocialMosaic />
    <h1 className="construction-message">
      <img src="/construction.svg" alt="EN CONSTRUCCIÓN" draggable="false" />
    </h1>
    <img className="page-artwork" src="/side-artwork.svg" alt="" aria-hidden="true" draggable="false" />
    <SiteFooter />
  </StrictMode>,
)
