import { useEffect, useState } from 'react'
import { FittedWord } from './FittedWord.jsx'
import { portfolioSections } from '../data/portfolio-sections.js'

const eyes = ['EYE_0000_4.png', 'EYE_0001_3.png', 'EYE_0002_2.png', 'EYE_0003_1.png']

function AnimatedEyes() {
  const [frame, setFrame] = useState(0)
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let timer
    const update = () => {
      clearInterval(timer)
      if (!motion.matches) timer = setInterval(() => setFrame(current => (current + 1) % eyes.length * eyes.length), 300)
    }
    update()
    motion.addEventListener('change', update)
    return () => { clearInterval(timer); motion.removeEventListener('change', update) }
  }, [])
  return <div className="visual-eyes" aria-hidden="true">{eyes.map((eye, index) => <img key={eye} src={`/images/eyes/${eyes[(index + Math.floor((frame + index) / eyes.length)) % eyes.length]}`} alt="" />)}</div>
}

export default function PortfolioSections() {
  return portfolioSections.map(section => (
    <section key={section.id} id={section.id} className={`ai-section${section.axis === 'horizontal' ? ' section-horizontal' : ''}`} data-axis={section.axis || 'vertical'} data-portfolio-section aria-label={section.title.join(' ')} aria-hidden="true">
      <div className="section-content">
        <h2>{section.title.map(word => <FittedWord key={word}>{word}</FittedWord>)}</h2>
        {section.id === 'visual-identity' ? <div className="visual-copy"><AnimatedEyes /><p className="ai-description">{section.description.map((part, index) => typeof part === 'string'
          ? part : <span key={index} className="text-highlight">{part.highlight}</span>)}</p></div> : <p className="ai-description">{section.description.map((part, index) => typeof part === 'string' ? part : <span key={index} className="text-highlight">{part.highlight}</span>)}</p>}
      </div>
    </section>
  ))
}
