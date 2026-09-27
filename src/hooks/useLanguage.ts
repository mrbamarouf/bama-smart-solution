import { useContext } from 'react'
import { LanguageContext } from '../i18n-context'

export const useLanguage = () => useContext(LanguageContext)
