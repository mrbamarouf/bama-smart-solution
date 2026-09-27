export type Language = 'en' | 'ar'

export type LocalizedText = {
  en: string
  ar: string
}

export const isLanguage = (value: string | undefined): value is Language =>
  value === 'en' || value === 'ar'

export const localize = (value: LocalizedText, language: Language) => value[language]
