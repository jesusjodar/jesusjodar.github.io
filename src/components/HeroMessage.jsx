import SocialMosaic from './SocialMosaic.jsx'
import { FittedWord } from './FittedWord.jsx'

export default function HeroMessage() {
  return <h1 className="hero-message" aria-label="Analysis design & research">
    <SocialMosaic />
    <FittedWord>ANALYSIS</FittedWord>
    <FittedWord>DESIGN &amp;</FittedWord>
    <FittedWord>RESEARCH</FittedWord>
  </h1>
}
