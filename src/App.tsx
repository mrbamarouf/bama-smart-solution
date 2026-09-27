import { lazy, Suspense, useEffect } from 'react'
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
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }

      attempts += 1
      if (attempts < 12) timer = window.setTimeout(moveToRouteTarget, 100)
    }

    timer = window.setTimeout(moveToRouteTarget, 60)
    return () => window.clearTimeout(timer)
  }, [location.hash, location.pathname])

  return <BrandIntro language={routeLanguage} />
}

function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-label="Loading">
      <img src={siteConfig.mark} alt="" />
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
