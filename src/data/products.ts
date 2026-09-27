import type { Language, LocalizedText } from '../types'

export type ProductStatus = 'available' | 'future'

export type ProductSpecification = {
  label: LocalizedText
  value: LocalizedText
}

export type Product = {
  id: string
  slug: string
  category: string
  nameEn: string
  nameAr: string
  shortDescriptionEn: string
  shortDescriptionAr: string
  descriptionEn: string
  descriptionAr: string
  images: string[]
  features: LocalizedText[]
  specifications: ProductSpecification[]
  idealEnvironments: LocalizedText[]
  benefits: LocalizedText[]
  status: ProductStatus
  featured: boolean
  order: number
}

export type ProductCategory = {
  id: string
  name: LocalizedText
  description: LocalizedText
  availability: 'current' | 'ecosystem'
}

export const categories: ProductCategory[] = [
  {
    id: 'networking',
    name: { en: 'Advanced Networking', ar: 'الشبكات المتقدمة' },
    description: {
      en: 'High-speed wireless infrastructure for connected homes and businesses.',
      ar: 'بنية لاسلكية عالية السرعة للمنازل والأعمال المتصلة.',
    },
    availability: 'current',
  },
  {
    id: 'smart-access',
    name: { en: 'Smart Access', ar: 'الدخول الذكي' },
    description: {
      en: 'Flexible, keyless access for modern entrances.',
      ar: 'خيارات دخول مرنة وبدون مفاتيح للمداخل الحديثة.',
    },
    availability: 'current',
  },
  {
    id: 'smart-security',
    name: { en: 'Smart Security', ar: 'الأمان الذكي' },
    description: {
      en: 'A future ecosystem layer for connected monitoring and protection.',
      ar: 'طبقة مستقبلية ضمن المنظومة للمراقبة والحماية المتصلة.',
    },
    availability: 'ecosystem',
  },
  {
    id: 'smart-living',
    name: { en: 'Smart Living', ar: 'الحياة الذكية' },
    description: {
      en: 'Future automation, sensors and intelligent devices working together.',
      ar: 'أتمتة ومستشعرات وأجهزة ذكية مستقبلية تعمل معاً.',
    },
    availability: 'ecosystem',
  },
  {
    id: 'connected-devices',
    name: { en: 'Connected Devices', ar: 'الأجهزة المتصلة' },
    description: {
      en: 'An expandable foundation for the next generation of smart-space products.',
      ar: 'أساس قابل للتوسع للجيل القادم من منتجات المساحات الذكية.',
    },
    availability: 'ecosystem',
  },
]

export const products: Product[] = [
  {
    id: 'wifi-7-be5010',
    slug: 'wifi-7-be5010',
    category: 'networking',
    nameEn: 'Wi-Fi 7 BE5010',
    nameAr: 'واي فاي 7 BE5010',
    shortDescriptionEn: 'High-capacity Wi-Fi 7 networking for connected environments.',
    shortDescriptionAr: 'شبكة واي فاي 7 عالية السعة للمساحات المتصلة.',
    descriptionEn: 'A high-speed wireless access point selected for spaces where stable coverage, device capacity and fast roaming matter.',
    descriptionAr: 'نقطة وصول لاسلكية عالية السرعة للمساحات التي تتطلب تغطية مستقرة وسعة أجهزة عالية وتنقلاً سريعاً.',
    images: ['/images/wifi-7-access-point.png'],
    features: [
      { en: 'Up to 5.1Gbps', ar: 'سرعة تصل إلى 5.1 جيجابت/ثانية' },
      { en: '2.5G PoE', ar: 'دعم 2.5G PoE' },
      { en: '160MHz', ar: 'نطاق 160 ميجاهرتز' },
      { en: 'High device capacity', ar: 'سعة عالية للأجهزة' },
      { en: 'Fast roaming', ar: 'تنقل سريع بين نقاط الاتصال' },
      { en: 'Designed for connected environments', ar: 'مصمم للبيئات المتصلة' },
    ],
    specifications: [
      { label: { en: 'Wireless generation', ar: 'الجيل اللاسلكي' }, value: { en: 'Wi-Fi 7', ar: 'واي فاي 7' } },
      { label: { en: 'Maximum speed', ar: 'السرعة القصوى' }, value: { en: 'Up to 5.1Gbps', ar: 'حتى 5.1 جيجابت/ثانية' } },
      { label: { en: 'Network interface', ar: 'واجهة الشبكة' }, value: { en: '2.5G PoE', ar: '2.5G PoE' } },
      { label: { en: 'Channel width', ar: 'عرض القناة' }, value: { en: '160MHz', ar: '160 ميجاهرتز' } },
    ],
    idealEnvironments: [
      { en: 'Connected homes', ar: 'المنازل المتصلة' },
      { en: 'Modern offices', ar: 'المكاتب الحديثة' },
      { en: 'Multi-device spaces', ar: 'المساحات متعددة الأجهزة' },
    ],
    benefits: [
      { en: 'Faster wireless capacity for demanding connected spaces.', ar: 'سعة لاسلكية أسرع للمساحات المتصلة ذات الاستخدام المكثف.' },
      { en: 'A wired 2.5G PoE foundation for cleaner installation.', ar: 'بنية 2.5G PoE لتركيب أكثر ترتيباً.' },
      { en: 'Fast roaming designed for movement across the environment.', ar: 'تنقل سريع مصمم للحركة داخل المساحة.' },
    ],
    status: 'available',
    featured: true,
    order: 1,
  },
  {
    id: 'smart-lock-3d',
    slug: 'smart-lock-3d',
    category: 'smart-access',
    nameEn: '3D Face Recognition Smart Lock',
    nameAr: 'قفل ذكي بتعرّف ثلاثي الأبعاد على الوجه',
    shortDescriptionEn: 'Multiple secure access methods in one considered entrance system.',
    shortDescriptionAr: 'خيارات دخول متعددة وآمنة ضمن نظام واحد متكامل.',
    descriptionEn: 'A premium smart lock that brings facial recognition, fingerprint and password access into one keyless entry experience.',
    descriptionAr: 'قفل ذكي متقدم يجمع التعرّف على الوجه وبصمة الإصبع والرمز السري ضمن تجربة دخول بدون مفتاح.',
    images: ['/images/smart-lock-3d.png'],
    features: [
      { en: '3D face recognition', ar: 'تعرّف ثلاثي الأبعاد على الوجه' },
      { en: 'Fingerprint access', ar: 'دخول ببصمة الإصبع' },
      { en: 'Password access', ar: 'دخول بالرمز السري' },
      { en: 'Keyless entry', ar: 'دخول بدون مفتاح' },
      { en: 'Connected smart access', ar: 'دخول ذكي ومتصل' },
    ],
    specifications: [
      { label: { en: 'Primary access', ar: 'طريقة الدخول الرئيسية' }, value: { en: '3D face recognition', ar: 'التعرّف ثلاثي الأبعاد على الوجه' } },
      { label: { en: 'Additional access', ar: 'طرق الدخول الإضافية' }, value: { en: 'Fingerprint and password', ar: 'بصمة الإصبع والرمز السري' } },
      { label: { en: 'Entry type', ar: 'نوع الدخول' }, value: { en: 'Keyless', ar: 'بدون مفتاح' } },
    ],
    idealEnvironments: [
      { en: 'Modern residences', ar: 'المنازل الحديثة' },
      { en: 'Private offices', ar: 'المكاتب الخاصة' },
      { en: 'Managed entrances', ar: 'المداخل المنظمة' },
    ],
    benefits: [
      { en: 'Choose the access method that fits the moment.', ar: 'اختر طريقة الدخول الأنسب لكل استخدام.' },
      { en: 'Reduce dependence on physical keys.', ar: 'قلّل الاعتماد على المفاتيح التقليدية.' },
      { en: 'Bring the entrance into the wider connected environment.', ar: 'ادمج المدخل ضمن بيئة متصلة أوسع.' },
    ],
    status: 'available',
    featured: true,
    order: 2,
  },
]

export const getProductName = (product: Product, language: Language) =>
  language === 'ar' ? product.nameAr : product.nameEn

export const getProductShortDescription = (product: Product, language: Language) =>
  language === 'ar' ? product.shortDescriptionAr : product.shortDescriptionEn

export const getProductDescription = (product: Product, language: Language) =>
  language === 'ar' ? product.descriptionAr : product.descriptionEn

export const getProductBySlug = (slug: string | undefined) =>
  products.find((product) => product.slug === slug)
