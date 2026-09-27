import type { PropsWithChildren } from 'react'
import { LanguageContext } from '../i18n-context'
import type { Language } from '../types'

export function LanguageProvider({ language, children }: PropsWithChildren<{ language: Language }>) {
  return <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>
}
