import type { Language, LocalizedText } from '../types'

export type ProductStatus = 'available' | 'comingSoon' | 'futureCategory'

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

export type CategoryItem = {
  name: LocalizedText
  status: Extract<ProductStatus, 'comingSoon'>
}

export type ProductCategory = {
  id: string
  slug: string
  order: number
  name: LocalizedText
  description: LocalizedText
  direction: LocalizedText
  image: string
  status: Extract<ProductStatus, 'available' | 'futureCategory'>
  heroProductSlug?: string
  futureProducts: CategoryItem[]
}

const comingSoon = (en: string, ar: string): CategoryItem => ({
  name: { en, ar },
  status: 'comingSoon',
})

export const categories: ProductCategory[] = [
  {
    id: 'networking',
    slug: 'networking',
    order: 1,
    name: { en: 'Smart Networking', ar: 'الشبكات الذكية' },
    description: {
      en: 'High-speed wireless infrastructure designed for connected homes, workplaces and device-dense environments.',
      ar: 'بنية اتصال لاسلكية عالية السرعة للمنازل وأماكن العمل والبيئات التي تضم عدداً كبيراً من الأجهزة.',
    },
    direction: {
      en: 'Wi-Fi 7 is the confirmed starting point for a wider networking ecosystem.',
      ar: 'يمثل Wi-Fi 7 نقطة البداية المؤكدة لمنظومة شبكات أوسع.',
    },
    image: '/images/wifi-7-access-point.png',
    status: 'available',
    heroProductSlug: 'wifi-7-be5010',
    futureProducts: [
      comingSoon('Mesh Wi-Fi', 'Mesh Wi-Fi'),
      comingSoon('Network Switches', 'محولات الشبكة'),
      comingSoon('Smart Routers', 'أجهزة التوجيه الذكية'),
      comingSoon('Additional Access Points', 'نقاط وصول إضافية'),
    ],
  },
  {
    id: 'smart-access',
    slug: 'smart-access',
    order: 2,
    name: { en: 'Smart Access', ar: 'الدخول الذكي' },
    description: {
      en: 'Modern entrance technology that brings multiple secure access methods into one considered experience.',
      ar: 'تقنيات دخول حديثة تجمع طرق وصول آمنة ومتعددة ضمن تجربة واحدة مدروسة.',
    },
    direction: {
      en: 'The confirmed 3D smart lock introduces an expandable access-control category.',
      ar: 'يقدم القفل الذكي المؤكد بتقنية 3D فئة دخول قابلة للتوسع.',
    },
    image: '/images/smart-lock-3d.png',
    status: 'available',
    heroProductSlug: 'smart-lock-3d',
    futureProducts: [
      comingSoon('Fingerprint Smart Locks', 'أقفال ذكية بالبصمة'),
      comingSoon('Smart Door Handles', 'مقابض أبواب ذكية'),
      comingSoon('Keyless Entry', 'دخول بدون مفتاح'),
      comingSoon('Access Control', 'أنظمة التحكم بالدخول'),
    ],
  },
  {
    id: 'smart-security',
    slug: 'smart-security',
    order: 3,
    name: { en: 'Smart Security', ar: 'الأمان الذكي' },
    description: {
      en: 'A future visual and monitoring layer for connected protection across modern spaces.',
      ar: 'طبقة مستقبلية للمراقبة والحماية المتصلة في المساحات الحديثة.',
    },
    direction: {
      en: 'A category direction for cameras, doorbells and coordinated monitoring—not a current stock claim.',
      ar: 'توجه مستقبلي للكاميرات وأجراس الأبواب والمراقبة المتكاملة، وليس إعلاناً عن توفر مخزون حالياً.',
    },
    image: '/images/category-security.jpg',
    status: 'futureCategory',
    futureProducts: [
      comingSoon('Smart Cameras', 'كاميرات ذكية'),
      comingSoon('Video Doorbells', 'أجراس أبواب بالفيديو'),
      comingSoon('Indoor Cameras', 'كاميرات داخلية'),
      comingSoon('Outdoor Cameras', 'كاميرات خارجية'),
      comingSoon('Smart Monitoring', 'مراقبة ذكية'),
    ],
  },
  {
    id: 'smart-home',
    slug: 'smart-home',
    order: 4,
    name: { en: 'Smart Home', ar: 'المنزل الذكي' },
    description: {
      en: 'A future home-control category for lighting, power, comfort and everyday automation.',
      ar: 'فئة مستقبلية للتحكم بالإضاءة والطاقة والراحة والأتمتة اليومية في المنزل.',
    },
    direction: {
      en: 'A flexible foundation for the connected routines of a modern home.',
      ar: 'أساس مرن للأنظمة والمهام المتصلة في المنزل الحديث.',
    },
    image: '/images/category-smart-home.jpg',
    status: 'futureCategory',
    futureProducts: [
      comingSoon('Smart Switches', 'مفاتيح ذكية'),
      comingSoon('Smart Lighting', 'إضاءة ذكية'),
      comingSoon('Smart Plugs', 'مقابس ذكية'),
      comingSoon('Smart Curtains', 'ستائر ذكية'),
      comingSoon('Smart Thermostats', 'منظمات حرارة ذكية'),
      comingSoon('Smart Controllers', 'وحدات تحكم ذكية'),
    ],
  },
  {
    id: 'smart-sensors',
    slug: 'smart-sensors',
    order: 5,
    name: { en: 'Smart Sensors', ar: 'الحساسات الذكية' },
    description: {
      en: 'A future sensing layer designed to help spaces respond to movement, access and environmental change.',
      ar: 'طبقة استشعار مستقبلية تساعد المساحات على الاستجابة للحركة والدخول والتغيرات البيئية.',
    },
    direction: {
      en: 'Compact sensing devices form the intelligence behind responsive environments.',
      ar: 'تشكل أجهزة الاستشعار المدمجة أساس الذكاء في البيئات المتجاوبة.',
    },
    image: '/images/category-sensors.jpg',
    status: 'futureCategory',
    futureProducts: [
      comingSoon('Motion Sensors', 'حساسات الحركة'),
      comingSoon('Door / Window Sensors', 'حساسات الأبواب / النوافذ'),
      comingSoon('Smoke Sensors', 'حساسات الدخان'),
      comingSoon('Water Leak Sensors', 'حساسات تسرب المياه'),
      comingSoon('Temperature Sensors', 'حساسات الحرارة'),
    ],
  },
  {
    id: 'connected-devices',
    slug: 'connected-devices',
    order: 6,
    name: { en: 'Connected Devices', ar: 'الأجهزة المتصلة' },
    description: {
      en: 'A flexible future category for additional IoT and connected technology as the BAMA ecosystem grows.',
      ar: 'فئة مستقبلية مرنة لتقنيات إنترنت الأشياء والأجهزة المتصلة مع توسع منظومة BAMA.',
    },
    direction: {
      en: 'Open by design, this category gives future devices a clear place in the ecosystem.',
      ar: 'صُممت هذه الفئة بمرونة لتمنح الأجهزة المستقبلية مكاناً واضحاً ضمن المنظومة.',
    },
    image: '/images/category-connected-devices.jpg',
    status: 'futureCategory',
    futureProducts: [
      comingSoon('IoT Hubs', 'مراكز إنترنت الأشياء'),
      comingSoon('Connected Controllers', 'وحدات تحكم متصلة'),
      comingSoon('Future Smart Devices', 'أجهزة ذكية مستقبلية'),
    ],
  },
]

export const products: Product[] = [
  {
    id: 'wifi-7-be5010',
    slug: 'wifi-7-be5010',
    category: 'networking',
    nameEn: 'Wi-Fi 7 BE5010',
    nameAr: 'Wi-Fi 7 BE5010',
    shortDescriptionEn: 'Advanced connectivity for modern homes and workplaces, designed for high-speed performance and environments with multiple connected devices.',
    shortDescriptionAr: 'حل اتصال متقدم للمنازل والمكاتب الحديثة، مصمم لتوفير أداء عالي السرعة ودعم البيئات التي تضم عدداً كبيراً من الأجهزة المتصلة.',
    descriptionEn: 'Advanced connectivity for modern homes and workplaces, designed for high-speed performance and environments with multiple connected devices.',
    descriptionAr: 'حل اتصال متقدم للمنازل والمكاتب الحديثة، مصمم لتوفير أداء عالي السرعة ودعم البيئات التي تضم عدداً كبيراً من الأجهزة المتصلة.',
    images: ['/images/wifi-7-access-point.png'],
    features: [
      { en: 'Wi-Fi 7', ar: 'Wi-Fi 7' },
      { en: 'Up to 5.1Gbps', ar: 'سرعة تصل إلى 5.1Gbps' },
      { en: '2.5G PoE', ar: '2.5G PoE' },
      { en: '160MHz', ar: '160MHz' },
      { en: 'High connected-device capacity', ar: 'سعة عالية للأجهزة المتصلة' },
      { en: 'Fast Roaming', ar: 'Fast Roaming' },
    ],
    specifications: [
      { label: { en: 'Wireless generation', ar: 'الجيل اللاسلكي' }, value: { en: 'Wi-Fi 7', ar: 'Wi-Fi 7' } },
      { label: { en: 'Maximum speed', ar: 'السرعة القصوى' }, value: { en: 'Up to 5.1Gbps', ar: 'حتى 5.1Gbps' } },
      { label: { en: 'Network interface', ar: 'واجهة الشبكة' }, value: { en: '2.5G PoE', ar: '2.5G PoE' } },
      { label: { en: 'Channel width', ar: 'عرض القناة' }, value: { en: '160MHz', ar: '160MHz' } },
    ],
    idealEnvironments: [
      { en: 'Connected homes', ar: 'المنازل المتصلة' },
      { en: 'Modern workplaces', ar: 'أماكن العمل الحديثة' },
      { en: 'Multi-device environments', ar: 'البيئات متعددة الأجهزة' },
    ],
    benefits: [
      { en: 'High-speed wireless performance for demanding connected spaces.', ar: 'أداء لاسلكي عالي السرعة للمساحات المتصلة ذات الاستخدام المكثف.' },
      { en: 'A 2.5G PoE foundation for a cleaner installation.', ar: 'بنية 2.5G PoE لتركيب أكثر ترتيباً.' },
      { en: 'Fast Roaming designed for movement across the environment.', ar: 'Fast Roaming مصمم للحركة بسلاسة داخل المساحة.' },
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
    nameAr: 'قفل ذكي بتقنية التعرف ثلاثي الأبعاد على الوجه',
    shortDescriptionEn: 'A modern entry experience combining face recognition, fingerprint, password and keyless entry in one system.',
    shortDescriptionAr: 'تجربة دخول حديثة تجمع بين التعرف على الوجه والبصمة والرمز السري والدخول بدون مفتاح ضمن نظام واحد.',
    descriptionEn: 'A modern entry experience combining face recognition, fingerprint, password and keyless entry in one system.',
    descriptionAr: 'تجربة دخول حديثة تجمع بين التعرف على الوجه والبصمة والرمز السري والدخول بدون مفتاح ضمن نظام واحد.',
    images: ['/images/smart-lock-3d.png'],
    features: [
      { en: '3D Face Recognition', ar: '3D Face Recognition' },
      { en: 'Fingerprint Access', ar: 'Fingerprint Access' },
      { en: 'Password Access', ar: 'Password Access' },
      { en: 'Keyless Entry', ar: 'Keyless Entry' },
      { en: 'Smart Access', ar: 'Smart Access' },
    ],
    specifications: [
      { label: { en: 'Primary access', ar: 'طريقة الدخول الرئيسية' }, value: { en: '3D Face Recognition', ar: '3D Face Recognition' } },
      { label: { en: 'Additional access', ar: 'طرق الدخول الإضافية' }, value: { en: 'Fingerprint and password', ar: 'Fingerprint + Password' } },
      { label: { en: 'Entry type', ar: 'نوع الدخول' }, value: { en: 'Keyless', ar: 'Keyless' } },
    ],
    idealEnvironments: [
      { en: 'Modern residences', ar: 'المنازل الحديثة' },
      { en: 'Private workplaces', ar: 'أماكن العمل الخاصة' },
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

export const getCategoryBySlug = (slug: string | undefined) =>
  categories.find((category) => category.slug === slug)

export const getProductsByCategory = (categoryId: string) =>
  products.filter((product) => product.category === categoryId)
