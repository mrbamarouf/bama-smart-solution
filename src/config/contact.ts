export const contactConfig = {
  whatsapp: '',
  phone: '',
  email: '',
} as const

export const hasConfiguredContact = Object.values(contactConfig).some(Boolean)
