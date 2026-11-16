import { FittedWord } from './FittedWord.jsx'
import { portfolioSections } from '../data/portfolio-sections.js'

export default function PortfolioSections() {
  return portfolioSections.map(section => (
    <section key={section.id} id={section.id} className={`ai-section${section.axis === 'horizontal' ? ' section-horizontal' : ''}`} data-axis={section.axis || 'vertical'} data-portfolio-section aria-label={section.title.join(' ')} aria-hidden="true">
      <div className="section-content">
        <h2>{section.title.map(word => <FittedWord key={word}>{word}</FittedWord>)}</h2>
        <p className="ai-description">{section.description.map((part, index) => typeof part === 'string'
          ? part : <span key={index} className="text-highlight">{part.highlight}</span>)}</p>
      </div>
    </section>
  ))
}
