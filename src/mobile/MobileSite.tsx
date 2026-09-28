import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Wifi,
  LockKeyhole,
  Monitor,
  House,
  Shield,
  LayoutGrid,
  ScanFace,
  Fingerprint,
  KeyRound,
  Hash,
  Network,
  Gauge,
  EthernetPort,
  Radio,
  Users,
  Mail,
  Phone,
  MessageCircle,
  Building2,
  Wrench,
  Package,
  Layers,
  Check,
  type LucideIcon,
} from "lucide-react";
import { DesignerCredit } from "../components/DesignerCredit";
import { content } from "../content";
import { contactConfig } from "../config/contact";
import {
  categories,
  products,
  getProductName,
  getProductDescription,
  type Product,
} from "../data/products";
import { Seo } from "../components/Seo";
import { MobileBrand } from "./MobileBrand";
import type { Language } from "../types";
import "./mobile.css";

type Props = { language: Language };
const icons: LucideIcon[] = [
  Wifi,
  LockKeyhole,
  Monitor,
  House,
  Shield,
  LayoutGrid,
];
const imagePath = (source: string) =>
  source
    .replace("/images/", "/images/mobile/")
    .replace(/\.(png|jpg)$/, ".webp");
const tr = (language: Language, ar: string, en: string) =>
  language === "ar" ? ar : en;

function DirectionArrow({ language }: Props) {
  const Icon = language === "ar" ? ArrowLeft : ArrowRight;
  return <Icon size={20} aria-hidden="true" />;
}

function Action({
  language,
  to,
  children,
  secondary = false,
}: Props & { to: string; children: React.ReactNode; secondary?: boolean }) {
  return (
    <Link
      className={`m-action${secondary ? " m-action-secondary" : ""}`}
      to={to}
    >
      <span>{children}</span>
      <DirectionArrow language={language} />
    </Link>
  );
}

function Channels({
  language,
  compact = false,
}: Props & { compact?: boolean }) {
  const [pending, setPending] = useState(false);
  const channels = [
    {
      label: tr(language, "واتساب", "WhatsApp"),
      value: contactConfig.whatsapp,
      prefix: "https://wa.me/",
      Icon: MessageCircle,
    },
    {
      label: tr(language, "اتصال", "Phone"),
      value: contactConfig.phone,
      prefix: "tel:",
      Icon: Phone,
    },
    {
      label: tr(language, "بريد إلكتروني", "Email"),
      value: contactConfig.email,
      prefix: "mailto:",
      Icon: Mail,
    },
  ];
  return (
    <div className={`m-channels${compact ? " m-channels-compact" : ""}`}>
      <div className="m-channel-row" dir="ltr">
        {channels.map(({ label, value, prefix, Icon }, i) => (
          <div key={label} className={`m-channel m-channel-${i}`}>
            {value ? (
              <a href={`${prefix}${value}`} aria-label={label}>
                <Icon size={25} aria-hidden="true" />
              </a>
            ) : (
              <button
                type="button"
                aria-label={label}
                onClick={() => setPending(true)}
              >
                <Icon size={25} aria-hidden="true" />
              </button>
            )}
            {!compact && (
              <span dir={language === "ar" ? "rtl" : "ltr"}>{label}</span>
            )}
          </div>
        ))}
      </div>
      {pending && (
        <p className="m-notice" role="status">
          {content[language].contact.detailsPending}
        </p>
      )}
    </div>
  );
}

function MobileHeader({ language }: Props) {
  const location = useLocation();
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(window.scrollY > 24);
  const [expanded, setExpanded] = useState(false);
  const c = content[language];
  const switchTo = (lang: Language) =>
    location.pathname.replace(/^\/(en|ar)/, `/${lang}`) +
    location.search +
    location.hash;
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const menu = dialog.current;
    menu?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      menu?.close();
    };
  }, [open]);
  const close = () => {
    setOpen(false);
    setExpanded(false);
    opener.current?.focus();
  };
  const languageLinks = (
    <div className="m-language" dir="ltr">
      {(["en", "ar"] as const).map((lang) => (
        <Link
          key={lang}
          to={switchTo(lang)}
          lang={lang}
          aria-current={lang === language ? "true" : undefined}
          aria-label={
            lang === "en" ? "View site in English" : "عرض الموقع بالعربية"
          }
          onClick={close}
        >
          {lang.toUpperCase()}
        </Link>
      ))}
    </div>
  );
  return (
    <>
      <header
        className={`m-header${scrolled ? " m-header-scrolled" : ""}`}
        dir="ltr"
      >
        <Link to={`/${language}`} aria-label="BAMA Smart Solution">
          <MobileBrand />
        </Link>
        <div className="m-header-controls">
          {languageLinks}
          <button
            className="m-icon-button"
            ref={opener}
            type="button"
            aria-label={tr(language, "فتح القائمة", "Open menu")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <Menu aria-hidden="true" />
          </button>
        </div>
      </header>
      <dialog
        id="mobile-menu"
        ref={dialog}
        className="m-menu"
        aria-label={tr(language, "القائمة الرئيسية", "Main menu")}
        onCancel={close}
        onClose={() => {
          setOpen(false);
          opener.current?.focus({ preventScroll: true });
        }}
      >
        <div className="m-menu-top" dir="ltr">
          <Link
            to={`/${language}`}
            onClick={close}
            aria-label="BAMA Smart Solution"
          >
            <MobileBrand horizontal />
          </Link>
          <button
            type="button"
            className="m-icon-button"
            aria-label={tr(language, "إغلاق القائمة", "Close menu")}
            onClick={close}
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <nav aria-label={tr(language, "التنقل الرئيسي", "Main navigation")}>
          {c.nav.map(([id, label]) =>
            id === "products" ? (
              <div key={id}>
                <button
                  className="m-menu-link"
                  type="button"
                  aria-expanded={expanded}
                  aria-controls="mobile-menu-products"
                  onClick={() => setExpanded(!expanded)}
                >
                  <span>{label}</span>
                  <ChevronDown
                    size={19}
                    className={expanded ? "m-rotated" : ""}
                  />
                </button>
                {expanded && (
                  <div id="mobile-menu-products" className="m-menu-products">
                    <Link to={`/${language}/products`} onClick={close}>
                      {c.detail.back}
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/${language}/products/${category.slug}`}
                        onClick={close}
                      >
                        {category.name[language]}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={id}
                className="m-menu-link"
                to={`/${language}${id === "home" ? "" : `#${id}`}`}
                onClick={close}
              >
                {label}
              </Link>
            ),
          )}
        </nav>
        <div className="m-menu-bottom">
          {languageLinks}
          <Link
            className="m-action"
            to={`/${language}#solutions`}
            onClick={close}
          >
            <span>{c.explore}</span>
            <DirectionArrow language={language} />
          </Link>
          <Channels language={language} compact />
        </div>
      </dialog>
    </>
  );
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="m-section-heading">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

function Ecosystem({ language }: Props) {
  const labels =
    language === "ar"
      ? [
          "الشبكات",
          "الدخول",
          "الأمان",
          "المنزل الذكي",
          "الحساسات",
          "الأجهزة المتصلة",
        ]
      : [
          "Networking",
          "Access",
          "Security",
          "Smart home",
          "Sensors",
          "Devices",
        ];
  return (
    <section
      className="m-section m-ecosystem"
      id="ecosystem"
      aria-labelledby="m-ecosystem-title"
    >
      <div className="m-section-heading">
        <h2 id="m-ecosystem-title">
          {tr(language, "المنظومة الذكية", "The smart ecosystem")}
        </h2>
        <p>
          {tr(
            language,
            "كل شيء متصل.. في نظام واحد",
            "Everything connected. In one system.",
          )}
        </p>
      </div>
      <div className="m-ecosystem-visual">
        <img
          src="/images/mobile/architecture.webp"
          alt={tr(
            language,
            "منزل حديث متصل بتقنيات BAMA",
            "A modern home connected by BAMA technology",
          )}
          width="860"
          height="1290"
          loading="lazy"
        />
        <svg
          className="m-connections"
          viewBox="0 0 360 470"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M50 170 L105 230 L240 65 M105 230 L240 125 M105 230 L240 185 M105 230 L240 245 M105 230 L240 305 M105 230 L240 365" />
        </svg>
        <div className="m-ecosystem-points">
          {categories.map((category, i) => {
            const Icon = icons[i];
            return (
              <Link
                key={category.id}
                to={`/${language}/products/${category.slug}`}
              >
                <span className="m-point-icon">
                  <Icon size={21} aria-hidden="true" />
                </span>
                <span>{labels[i]}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <Link className="m-statement" to={`/${language}/products`}>
        <span>
          {tr(
            language,
            "اليوم اتصال ودخول ذكي.",
            "Today, connectivity and access.",
          )}
          <br />
          {tr(
            language,
            "غداً منظومة متكاملة.",
            "Tomorrow, one complete ecosystem.",
          )}
        </span>
        <DirectionArrow language={language} />
      </Link>
    </section>
  );
}

function UseCases({ language }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <section className="m-section m-use-cases" id="use-cases">
      <SectionHeading
        title={tr(language, "مصممة لمساحتك", "Designed for your space")}
        subtitle={tr(
          language,
          "حلول تناسب مختلف البيئات",
          "Solutions for different environments",
        )}
      />
      <div className="m-space-list">
        {content[language].useCases.items.map(([name, description], index) => (
          <div className="m-space" key={name}>
            <button
              type="button"
              aria-expanded={selected === index}
              aria-controls={`m-space-${index}`}
              onClick={() => setSelected(selected === index ? null : index)}
            >
              <img
                src={`/images/mobile/space-${index}.webp`}
                width="500"
                height="666"
                loading="lazy"
                alt=""
              />
              <span>{name}</span>
              <DirectionArrow language={language} />
            </button>
            {selected === index && (
              <div className="m-space-description" id={`m-space-${index}`}>
                <p>{description}</p>
                <Link to={`/${language}?space=${index}&inquiry=2#contact`}>
                  {tr(language, "ناقش مساحتك معنا", "Discuss your space")}
                  <DirectionArrow language={language} />
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact({ language }: Props) {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const preset = query.get("inquiry");
  const [selected, setSelected] = useState<number | null>(null);
  const active =
    selected ??
    (preset !== null && /^[0-3]$/.test(preset) ? Number(preset) : null);
  const selectedProduct = products.find(
    (product) => product.slug === query.get("product"),
  );
  const c = content[language];
  const contactIcons = [Package, Wrench, Building2, Users];
  return (
    <section className="m-section m-contact" id="contact">
      <SectionHeading
        title={tr(language, "تواصل معنا", "Contact us")}
        subtitle={tr(language, "نحن هنا لمساعدتك", "We’re here to help")}
      />
      <div className="m-inquiries">
        {c.contact.options.map((option, i) => {
          const Icon = contactIcons[i];
          return (
            <button
              type="button"
              aria-pressed={active === i}
              key={option}
              onClick={() => setSelected(i)}
            >
              <span className="m-inquiry-icon">
                <Icon size={19} aria-hidden="true" />
              </span>
              <span>{option}</span>
              {active === i && <Check size={18} aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      {active !== null && (
        <div className="m-notice" role="status">
          <strong>
            {c.contact.selected}: {c.contact.options[active]}
          </strong>
          {selectedProduct && (
            <p>
              <bdi>{getProductName(selectedProduct, language)}</bdi>
            </p>
          )}
          <p>{c.contact.detailsPending}</p>
        </div>
      )}
      <p className="m-direct-label">
        {tr(language, "أو تواصل مباشرة", "Or get in touch directly")}
      </p>
      <Channels language={language} />
      <div className="m-statement">
        <span>
          {tr(language, "خل مساحتك أذكى،", "Make your space smarter.")}
          <br />
          {tr(language, "ونحققها معاً.", "Let’s make it happen.")}
        </span>
        <DirectionArrow language={language} />
      </div>
    </section>
  );
}

function ProductTeaser({ product, language }: Props & { product: Product }) {
  return (
    <Link
      className="m-product-teaser"
      to={`/${language}/products/${product.slug}`}
    >
      <img
        src={imagePath(product.images[0])}
        width="320"
        height="230"
        loading="lazy"
        alt=""
      />
      <div>
        <span className="m-available">
          {content[language].productsPage.current}
        </span>
        <h3>
          <bdi>{getProductName(product, language)}</bdi>
        </h3>
        <span className="m-text-link">
          {content[language].categoryPage.viewProduct}
          <DirectionArrow language={language} />
        </span>
      </div>
    </Link>
  );
}

function Home({ language }: Props) {
  const c = content[language];
  const location = useLocation();
  return (
    <>
      <Seo language={language} />
      <section className="m-hero" id="home" aria-labelledby="m-hero-title">
        <img
          className="m-hero-image"
          src="/images/mobile/architecture.webp"
          width="860"
          height="1290"
          fetchPriority="high"
          alt=""
        />
        <div className="m-hero-content">
          <h1 id="m-hero-title">
            {c.hero.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p>
            {tr(
              language,
              "تجمع BAMA Smart Solution حلول الشبكات الذكية وأنظمة الدخول والتقنيات المتصلة في تجربة واحدة للمساحات الحديثة.",
              "BAMA Smart Solution brings smart networking, access systems and connected technology together in one experience for modern spaces.",
            )}
          </p>
          <div className="m-hero-actions">
            <Action language={language} to={`/${language}#solutions`}>
              {c.explore}
            </Action>
            <Action language={language} secondary to={`/${language}/products`}>
              {c.hero.secondary}
            </Action>
          </div>
        </div>
        <div className="m-hero-progress" aria-hidden="true" dir="ltr">
          <span>01</span>
          <i />
          <i />
          <i />
          <i />
        </div>
      </section>
      <section className="m-section m-solutions" id="solutions">
        <SectionHeading
          title={c.solutions.title}
          subtitle={c.solutions.intro}
        />
        {products.map((product) => (
          <ProductTeaser
            key={product.id}
            product={product}
            language={language}
          />
        ))}
        <Action language={language} secondary to={`/${language}/products`}>
          {c.featured.allProducts}
        </Action>
      </section>
      <Ecosystem language={language} />
      <UseCases language={language} />
      <section className="m-section m-why" id="why">
        <SectionHeading title={c.nav[3][1]} />
        {c.why.items.map(([title, body], i) => {
          const Icon = [Shield, Network, Wrench, Layers][i];
          return (
            <div className="m-principle" key={title}>
              <Icon size={24} aria-hidden="true" />
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </div>
          );
        })}
      </section>
      <section className="m-section m-about" id="about">
        <SectionHeading title={c.about.title} />
        <p>{c.about.body1}</p>
        <p>{c.about.body2}</p>
      </section>
      <Contact key={location.search} language={language} />
    </>
  );
}

function Products({ language, slug }: Props & { slug?: string }) {
  const category = categories.find((item) => item.slug === slug);
  const c = content[language];
  return (
    <div className="m-products-page">
      <Seo
        language={language}
        title={category?.name[language] ?? c.productsPage.title}
        path={`/products${category ? `/${category.slug}` : ""}`}
      />
      <div className="m-section-heading">
        <h1>{c.productsPage.title}</h1>
        <p>
          {tr(
            language,
            "تقنيات مختارة للحياة الذكية",
            "Selected technology for smarter living",
          )}
        </p>
      </div>
      <nav
        className="m-categories"
        aria-label={tr(language, "فئات المنتجات", "Product categories")}
      >
        <Link
          aria-current={!category ? "page" : undefined}
          to={`/${language}/products`}
        >
          <span className="m-category-icon">
            <LayoutGrid size={24} aria-hidden="true" />
          </span>
          <span>{c.detail.back}</span>
        </Link>
        {categories.map((item, index) => {
          const Icon = icons[index];
          return (
            <Link
              key={item.id}
              aria-current={item.id === category?.id ? "page" : undefined}
              to={`/${language}/products/${item.slug}#category-content`}
            >
              <span className="m-category-icon">
                <Icon size={24} aria-hidden="true" />
              </span>
              <span>{item.name[language]}</span>
            </Link>
          );
        })}
      </nav>
      {category && (
        <section id="category-content" className="m-category-content">
          <h2>{category.name[language]}</h2>
          <p>{category.description[language]}</p>
          {products
            .filter((product) => product.category === category.id)
            .map((product) => (
              <ProductTeaser
                key={product.id}
                language={language}
                product={product}
              />
            ))}
          {!category.heroProductSlug && (
            <>
              <img
                className="m-category-visual"
                src={imagePath(category.image)}
                width="780"
                height="520"
                alt={category.name[language]}
              />
              <span className="m-future">{c.categoryPage.future}</span>
            </>
          )}
          <h3>{c.categoryPage.examples}</h3>
          <p>{category.direction[language]}</p>
          <ul className="m-future-list">
            {category.futureProducts.map((item) => (
              <li key={item.name.en}>
                <bdi>{item.name[language]}</bdi>
                <span>{tr(language, "قريباً", "Coming soon")}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      <Link className="m-ecosystem-preview" to={`/${language}#ecosystem`}>
        <img
          src="/images/mobile/architecture.webp"
          width="860"
          height="1290"
          loading="lazy"
          alt=""
        />
        <span>
          {tr(language, "منظومة أوسع.", "A wider ecosystem.")}
          <br />
          {tr(language, "مستقبل أذكى.", "A smarter future.")}
          <DirectionArrow language={language} />
        </span>
      </Link>
    </div>
  );
}

function ProductDetail({ language, product }: Props & { product: Product }) {
  const category = categories.find((item) => item.id === product.category)!;
  const isLock = product.id === "smart-lock-3d";
  const featureIcons = isLock
    ? [ScanFace, Fingerprint, Hash, KeyRound, LockKeyhole]
    : [Wifi, Gauge, EthernetPort, Radio, Users, Network];
  return (
    <article className={`m-detail${isLock ? " m-detail-lock" : ""}`}>
      <Seo
        language={language}
        title={getProductName(product, language)}
        description={getProductDescription(product, language)}
        path={`/products/${product.slug}`}
      />
      <nav
        className="m-breadcrumb"
        aria-label={tr(language, "مسار الصفحة", "Breadcrumb")}
      >
        <Link to={`/${language}/products`}>
          {tr(language, "المنتجات", "Products")}
        </Link>
        <ChevronRight size={15} aria-hidden="true" />
        <Link to={`/${language}/products/${category.slug}`}>
          {category.name[language]}
        </Link>
        <Link
          className="m-detail-back"
          to={`/${language}/products/${category.slug}`}
          aria-label={content[language].detail.back}
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </Link>
      </nav>
      <div className="m-product-visual">
        {isLock && (
          <img
            className="m-lock-background"
            src="/images/mobile/hero-ecosystem.webp"
            width="900"
            height="360"
            alt=""
          />
        )}
        <img
          className="m-product-render"
          src={imagePath(product.images[0])}
          width={isLock ? 640 : 780}
          height={isLock ? 960 : 520}
          fetchPriority="high"
          alt={getProductName(product, language)}
        />
        {!isLock && <div className="m-product-signal" aria-hidden="true" />}
      </div>
      <div className="m-detail-copy">
        <h1>
          <bdi>{getProductName(product, language)}</bdi>
        </h1>
        <span className="m-available">
          {content[language].productsPage.current}
        </span>
        <p>{getProductDescription(product, language)}</p>
        <ul className="m-features">
          {product.features.map((feature, i) => {
            const Icon = featureIcons[i];
            return (
              <li key={feature.en}>
                <Icon size={21} aria-hidden="true" />
                <bdi
                  dir={
                    /[\u0600-\u06ff]/.test(feature[language]) ? "rtl" : "ltr"
                  }
                >
                  {feature[language]}
                </bdi>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="m-product-cta">
        <Action
          language={language}
          to={`/${language}?inquiry=0&product=${product.slug}#contact`}
        >
          {tr(language, "استفسر عن المنتج", "Enquire about this product")}
        </Action>
      </div>
    </article>
  );
}

function NotFound({ language }: Props) {
  const c = content[language].notFound;
  return (
    <section className="m-section m-not-found">
      <Seo language={language} title={c.title} />
      <span>404</span>
      <h1>{c.title}</h1>
      <p>{c.body}</p>
      <Action language={language} to={`/${language}`}>
        {c.action}
      </Action>
    </section>
  );
}

export default function MobileSite({ language }: Props) {
  const location = useLocation();
  const path = location.pathname
    .replace(/^\/(en|ar)\/?/, "")
    .replace(/\/$/, "");
  const slug = path.startsWith("products/")
    ? path.slice("products/".length)
    : undefined;
  const product = products.find((item) => item.slug === slug);
  const category = categories.find((item) => item.slug === slug);
  return (
    <div className="mobile-site" dir={language === "ar" ? "rtl" : "ltr"}>
      {!product && <MobileHeader key={language} language={language} />}
      <main id="mobile-main">
        {path === "" ? (
          <Home key={language} language={language} />
        ) : product ? (
          <ProductDetail
            key={product.id}
            language={language}
            product={product}
          />
        ) : path === "products" || category ? (
          <Products language={language} slug={slug} />
        ) : (
          <NotFound language={language} />
        )}
      </main>
      <footer className="m-footer">
        <Link to={`/${language}`} aria-label="BAMA Smart Solution">
          <MobileBrand />
        </Link>
        <p>{content[language].footer.statement}</p>
        <small dir="ltr">{content[language].footer.copyright}</small>
        <DesignerCredit language={language} />
      </footer>
    </div>
  );
}
