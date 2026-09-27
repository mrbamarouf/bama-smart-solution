import { Link } from 'react-router-dom'
import { content } from '../content'
import { siteConfig } from '../config/site'
import type { Language } from '../types'

export function SiteFooter({ language }: { language: Language }) {
  const copy = content[language]

  const pathFor = (id: string) => {
    if (id === 'products') return `/${language}/products`
    if (id === 'home') return `/${language}`
    return `/${language}#${id}`
  }

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={siteConfig.markWhite} alt="BAMA Smart Solution" />
            <span><strong>BAMA</strong> SMART SOLUTION</span>
          </div>
          <p>{copy.footer.statement}</p>
        </div>
        <nav aria-label={language === 'ar' ? 'روابط التذييل' : 'Footer links'}>
          {copy.nav.slice(1).map(([id, label]) => (
            <Link key={id} to={pathFor(id)}>{label}</Link>
          ))}
        </nav>
      </div>
      <div className="footer-base">
        <span>{copy.footer.country}</span>
        <span>{copy.footer.copyright}</span>
      </div>
    </footer>
  )
}
