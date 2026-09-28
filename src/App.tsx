import { lazy, Suspense, useEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { BrandIntro } from './components/BrandIntro'
import { LocalizedLayout } from './components/LocalizedLayout'
import { siteConfig } from './config/site'
import { categories } from './data/products'
import type { Language } from './types'

const HomePage = lazy(() => import('./pages/HomePage'))
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const ProductCategoryPage = lazy(() => import('./pages/ProductCategoryPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const stripRouteLanguage = (pathname: string) => pathname.replace(/^\/(?:ar|en)(?=\/|$)/, '')

function RootRedirect() {
  let language: Language = 'en'
  try {
    const saved = localStorage.getItem('bama-language')
    if (saved === 'ar' || saved === 'en') language = saved
    else if (navigator.language.toLowerCase().startsWith('ar')) language = 'ar'
  } catch {
    // English remains the safe default when browser storage is unavailable.
  }
  return <Navigate to={`/${language}`} replace />
}

function RouteEffects() {
  const location = useLocation()
  const routeLanguage = location.pathname.split('/')[1] === 'ar' ? 'ar' : 'en'
  const languageSwitchScroll = useRef<number | null>(null)
  const previousLocation = useRef<{
    pathname: string
    search: string
    hash: string
    language: Language
  } | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem('bama-language', routeLanguage)
    } catch {
      // Routing does not depend on storage.
    }
    document.documentElement.lang = routeLanguage
    document.documentElement.dir = routeLanguage === 'ar' ? 'rtl' : 'ltr'
  }, [routeLanguage])

  useEffect(() => {
    const captureLanguageSwitchScroll = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null
      const anchor = target?.closest<HTMLAnchorElement>('a[href]')
      if (!anchor || anchor.target) return

      const next = new URL(anchor.href, window.location.href)
      const currentLanguage = window.location.pathname.split('/')[1]
      const nextLanguage = next.pathname.split('/')[1]
      const isLanguageRoute = (value: string) => value === 'ar' || value === 'en'

      if (
        next.origin === window.location.origin &&
        isLanguageRoute(currentLanguage) &&
        isLanguageRoute(nextLanguage) &&
        currentLanguage !== nextLanguage &&
        stripRouteLanguage(window.location.pathname) === stripRouteLanguage(next.pathname) &&
        window.location.search === next.search &&
        window.location.hash === next.hash
      ) {
        languageSwitchScroll.current = window.scrollY
      }
    }

    document.addEventListener('click', captureLanguageSwitchScroll, true)
    return () => document.removeEventListener('click', captureLanguageSwitchScroll, true)
  }, [])

  useEffect(() => {
    const previous = previousLocation.current
    const languageOnlyChange = Boolean(
      previous &&
      previous.language !== routeLanguage &&
      stripRouteLanguage(previous.pathname) === stripRouteLanguage(location.pathname) &&
      previous.search === location.search &&
      previous.hash === location.hash,
    )

    previousLocation.current = {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      language: routeLanguage,
    }

    if (languageOnlyChange) {
      const restoreTop = languageSwitchScroll.current ?? window.scrollY
      languageSwitchScroll.current = null
      const restore = () => window.scrollTo({ top: restoreTop, behavior: 'instant' })
      restore()
      const frame = window.requestAnimationFrame(restore)
      const timer = window.setTimeout(restore, 80)
      return () => {
        window.cancelAnimationFrame(frame)
        window.clearTimeout(timer)
      }
    }

    const targetId = location.hash.replace('#', '')
    let attempts = 0
    let timer = 0

    const moveToRouteTarget = () => {
      if (!targetId) {
        window.scrollTo({ top: 0, behavior: 'instant' })
        return
      }

      const target = document.getElementById(targetId)
      if (target) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        target.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' })
        return
      }

      attempts += 1
      if (attempts < 12) timer = window.setTimeout(moveToRouteTarget, 100)
    }

    timer = window.setTimeout(moveToRouteTarget, 60)
    return () => window.clearTimeout(timer)
  }, [location.hash, location.pathname, location.search, location.key, routeLanguage])

  return <BrandIntro language={routeLanguage} />
}

function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-label="Loading">
      <img src={siteConfig.markWhite} alt="" />
      <span />
    </div>
  )
}

export default function App() {
  return (
    <>
      <RouteEffects />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/:lang" element={<LocalizedLayout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            {categories.map((category) => (
              <Route
                key={category.id}
                path={`products/${category.slug}`}
                element={<ProductCategoryPage categorySlug={category.slug} />}
              />
            ))}
            <Route path="products/:slug" element={<ProductDetailPage />} />
            <Route path="not-found" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/en/not-found" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}
