import { useEffect } from 'react'
import { siteConfig } from '../config/site'
import type { Language } from '../types'

type SeoProps = {
  language: Language
  title?: string
  description?: string
  path?: string
}

const setMeta = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value))
}

const setAlternate = (language: Language, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${language}"]`)
  if (!element) {
    element = document.createElement('link')
    element.rel = 'alternate'
    element.hreflang = language
    document.head.appendChild(element)
  }
  element.href = href
}

export function Seo({ language, title, description, path = '' }: SeoProps) {
  useEffect(() => {
    const pageTitle = title ? `${title} | ${siteConfig.brand}` : siteConfig.brand
    const pageDescription = description ?? siteConfig.description[language]
    document.title = pageTitle
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'

    setMeta('meta[name="description"]', { name: 'description', content: pageDescription })
    setMeta('meta[property="og:title"]', { property: 'og:title', content: pageTitle })
    setMeta('meta[property="og:description"]', { property: 'og:description', content: pageDescription })
    setMeta('meta[property="og:locale"]', {
      property: 'og:locale',
      content: language === 'ar' ? 'ar_SA' : 'en_SA',
    })

    if (siteConfig.siteUrl) {
      const canonicalUrl = `${siteConfig.siteUrl.replace(/\/$/, '')}/${language}${path}`
      let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.appendChild(canonical)
      }
      canonical.href = canonicalUrl
      setMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl })
      setAlternate('en', `${siteConfig.siteUrl.replace(/\/$/, '')}/en${path}`)
      setAlternate('ar', `${siteConfig.siteUrl.replace(/\/$/, '')}/ar${path}`)
    }
  }, [description, language, path, title])

  return null
}
