import { Navigate, Outlet, useParams } from 'react-router-dom'
import { isLanguage } from '../types'
import { LanguageProvider } from './LanguageProvider'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function LocalizedLayout() {
  const { lang } = useParams()

  if (!isLanguage(lang)) return <Navigate to="/en" replace />

  return (
    <LanguageProvider language={lang}>
      <SiteHeader language={lang} />
      <main>
        <Outlet />
      </main>
      <SiteFooter language={lang} />
    </LanguageProvider>
  )
}
