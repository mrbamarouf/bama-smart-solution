import { createContext } from 'react'
import type { Language } from './types'

export const LanguageContext = createContext<Language>('en')
