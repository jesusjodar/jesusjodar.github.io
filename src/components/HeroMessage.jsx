import SocialMosaic from './SocialMosaic.jsx'
import { FittedWord } from './FittedWord.jsx'

export default function HeroMessage() {
  return <h1 className="hero-message" aria-label="Analisis design & research">
    <SocialMosaic />
    <FittedWord>ANALISIS</FittedWord>
    <FittedWord>DESIGN &amp;</FittedWord>
    <FittedWord>RESEARCH</FittedWord>
  </h1>
}
