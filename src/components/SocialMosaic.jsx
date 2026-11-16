import icons from '../data/social-icons.json'

export default function SocialMosaic() {
  return (
    <div className="square-mosaic" role="list" aria-label="Plataformas">
      {icons.map(icon => (
        <span key={icon.name} role="listitem" style={{ '--social-icon': `url("${icon.icon}")` }}>
          <a href={icon.href} target="_blank" rel="noopener noreferrer" aria-label={icon.name} title={icon.name}>
          </a>
        </span>
      ))}
    </div>
  )
}
