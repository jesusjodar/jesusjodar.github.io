import icons from '../data/social-icons.json'

export default function SocialMosaic() {
  return (
    <div className="square-mosaic" role="list" aria-label="Plataformas">
      {icons.map(icon => (
        <span key={icon.name} role="listitem">
          <a href={icon.href} target="_blank" rel="noopener noreferrer" aria-label={icon.name} title={icon.name}>
            <img src={icon.icon} alt="" draggable="false" />
          </a>
        </span>
      ))}
    </div>
  )
}
