export const siteConfig = {
  brand: 'BAMA SMART SOLUTION',
  siteUrl: import.meta.env.VITE_SITE_URL ?? '',
  logo: '/images/bama-logo-transparent.png',
  mark: '/images/bama-mark-transparent.png',
  description: {
    en: 'Smart networking, access, security, home, sensors and connected-device technology for modern spaces in Saudi Arabia.',
    ar: 'تقنيات الشبكات والدخول والأمان والمنزل والحساسات والأجهزة المتصلة للمساحات الحديثة في المملكة العربية السعودية.',
  },
} as const
