import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './fonts.css'
import './tokens.css'
import './index.css'
import ConstructionMessage from './components/ConstructionMessage.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import SocialMosaic from './components/SocialMosaic.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocialMosaic />
    <ConstructionMessage />
    <img className="page-artwork" src="/side-artwork.svg" alt="" aria-hidden="true" draggable="false" />
    <SiteFooter />
  </StrictMode>,
)
