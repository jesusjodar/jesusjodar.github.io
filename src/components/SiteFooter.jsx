import { FittedWord } from './FittedWord.jsx'
import profile from '../data/profile.json'
import FooterSections from './FooterSections.jsx'
import GitHubActivity from './GitHubActivity.jsx'

export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <div className="footer-photo"><img src={profile.portrait} alt={`Foto de ${profile.name}`} width="320" height="320" decoding="async" /></div>
        <p className="footer-text"><span className="footer-desktop-text">{profile.name}</span><FittedWord className="footer-mobile-text">{profile.name.toUpperCase()}</FittedWord></p>
        <FooterSections />
        <GitHubActivity />
      </div>
      <p className="footer-text footer-year"><span className="footer-desktop-text">{year}</span><FittedWord className="footer-mobile-text">{String(year)}</FittedWord></p>
    </footer>
  )
}
