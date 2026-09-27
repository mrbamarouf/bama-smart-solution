import { ArrowUpRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { content } from '../content'
import { siteConfig } from '../config/site'
import type { Language } from '../types'

const observedSections = ['home', 'solutions', 'products', 'why', 'ecosystem', 'about', 'contact']

export function SiteHeader({ language }: { language: Language }) {
  const copy = content[language]
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState(location.pathname.includes('/products') ? 'products' : 'home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (location.pathname.includes('/products')) {
      return
    }

    const elements = observedSections
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element))
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActive(visible.target.id)
      },
      { rootMargin: '-24% 0px -60% 0px', threshold: [0.08, 0.25, 0.5] },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [location.pathname])

  const alternateLanguage = language === 'en' ? 'ar' : 'en'
  const currentActive = location.pathname.includes('/products') ? 'products' : active
  const alternatePath = useMemo(() => {
    const parts = location.pathname.split('/')
    parts[1] = alternateLanguage
    return `${parts.join('/')}${location.hash}`
  }, [alternateLanguage, location.hash, location.pathname])

  const navPath = (id: string) => {
    if (id === 'products') return `/${language}/products`
    if (id === 'home') return `/${language}`
    return `/${language}#${id}`
  }

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-inner">
        <Link className="brand-lockup" to={`/${language}`} aria-label={siteConfig.brand}>
          <img src={siteConfig.logo} alt="BAMA Smart Solution" />
        </Link>

        <nav className="desktop-nav" aria-label={language === 'ar' ? 'التنقل الرئيسي' : 'Primary navigation'}>
          {copy.nav.map(([id, label]) => (
            <Link key={id} to={navPath(id)} className={currentActive === id ? 'is-active' : ''}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="language-switch" to={alternatePath} aria-label={language === 'en' ? 'عرض الموقع بالعربية' : 'View site in English'}>
            <span className={language === 'ar' ? 'is-current' : ''}>AR</span>
            <i aria-hidden="true" />
            <span className={language === 'en' ? 'is-current' : ''}>EN</span>
          </Link>
          <Link className="button button-small button-primary" to={`/${language}#solutions`}>
            <span>{copy.explore}</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  )
}
