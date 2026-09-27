export const siteConfig = {
  brand: 'BAMA SMART SOLUTION',
  siteUrl: import.meta.env.VITE_SITE_URL ?? '',
  logo: '/images/bama-logo-transparent.png',
  description: {
    en: 'Intelligent networking, smart access and connected technology for modern spaces in Saudi Arabia.',
    ar: 'حلول الشبكات الذكية وأنظمة الدخول والتقنيات المتصلة للمساحات الحديثة في المملكة العربية السعودية.',
  },
} as const
