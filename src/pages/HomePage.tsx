import {
  ArrowDown,
  ArrowUpRight,
  Building2,
  Check,
  House,
  Hotel,
  RadioTower,
  ScanFace,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Wifi,
  Workflow,
  Wrench,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { SmartImage } from '../components/SmartImage'
import { hasConfiguredContact } from '../config/contact'
import { content } from '../content'
import {
  categories,
  getProductName,
  getProductShortDescription,
  products,
} from '../data/products'
import { useLanguage } from '../hooks/useLanguage'
import { localize } from '../types'

const solutionIcons = [Wifi, ScanFace, ShieldCheck, House]
const principleIcons = [Sparkles, Workflow, Wrench, RadioTower]
const useCaseIcons = [House, Building2, ShoppingBag, Hotel]
const useCasePositions = ['0%', '33.333%', '66.666%', '100%']

export default function HomePage() {
  const language = useLanguage()
  const copy = content[language]
  const [activeUseCase, setActiveUseCase] = useState(0)
  const [activeEcosystem, setActiveEcosystem] = useState<number | null>(null)
  const [selectedInquiry, setSelectedInquiry] = useState(0)

  return (
    <>
      <Seo language={language} />

      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero-backdrop" aria-hidden="true" />
        <div className="hero-vignette" aria-hidden="true" />
        <div className="hero-signal hero-signal-one" aria-hidden="true" />
        <div className="hero-signal hero-signal-two" aria-hidden="true" />
        <div className="hero-content container">
          <motion.div
            className="hero-copy"
            initial={{ y: 28 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="hero-signal-label"><i />{copy.hero.signal}</p>
            <h1 id="hero-title">
              {copy.hero.title.map((line, index) => (
                <span key={line} className={index === 2 ? 'hero-title-accent' : ''}>{line}</span>
              ))}
            </h1>
            <p className="hero-body">{copy.hero.body}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#solutions">
                <span>{copy.explore}</span>
                <ArrowDown size={18} aria-hidden="true" />
              </a>
              <Link className="button button-secondary" to={`/${language}/products`}>
                <span>{copy.hero.secondary}</span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="hero-index" aria-hidden="true">
          <span>01</span><i /><span>05</span>
        </div>
      </section>

      <section className="solutions-section" id="solutions" aria-labelledby="solutions-title">
        <div className="container section-heading section-heading-split">
          <h2 id="solutions-title">{copy.solutions.title}</h2>
          <p>{copy.solutions.intro}</p>
        </div>

        <div className="solution-worlds container-wide">
          {copy.solutions.items.map((item, index) => {
            const Icon = solutionIcons[index]
            const current = index < 2
            return (
              <article className={`solution-world ${index % 2 ? 'is-reversed' : ''}`} key={item.title}>
                <div className="solution-copy">
                  <div className="solution-number">{item.number}</div>
                  <Icon size={30} strokeWidth={1.4} aria-hidden="true" />
                  <span className={`availability ${current ? 'is-current' : ''}`}>
                    {current ? copy.solutions.current : copy.solutions.future}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  <ul>
                    {item.points.map((point) => <li key={point}><Check size={16} aria-hidden="true" />{point}</li>)}
                  </ul>
                </div>
                <div className={`solution-visual solution-visual-${index + 1}`}>
                  {current ? (
                    <SmartImage
                      src={products[index].images[0]}
                      alt={getProductName(products[index], language)}
                      loading="lazy"
                      fallbackLabel={item.title}
                    />
                  ) : (
                    <div className="solution-ambient" aria-hidden="true" />
                  )}
                  <span className="solution-axis" aria-hidden="true" />
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="featured-section" id="products" aria-labelledby="featured-title">
        <div className="container section-heading section-heading-split">
          <h2 id="featured-title">{copy.featured.title}</h2>
          <p>{copy.featured.intro}</p>
        </div>

        <div className="featured-products container-wide">
          {products.filter((product) => product.featured).map((product, index) => {
            const category = categories.find((item) => item.id === product.category)
            return (
              <article className={`product-showcase ${index % 2 ? 'is-reversed' : ''}`} key={product.id}>
                <div className="product-showcase-copy">
                  <div className="product-showcase-meta">
                    <span className="product-count">0{index + 1}</span>
                    <span className="availability is-current">{copy.productsPage.current}</span>
                  </div>
                  <p className="product-category">
                    {copy.featured.category} · {category ? localize(category.name, language) : ''}
                  </p>
                  <h3>{getProductName(product, language)}</h3>
                  <p className="product-lead">{getProductShortDescription(product, language)}</p>
                  <ul className="feature-ribbon">
                    {product.features.slice(0, 5).map((feature) => (
                      <li key={feature.en}>{localize(feature, language)}</li>
                    ))}
                  </ul>
                  <Link className="text-link" to={`/${language}/products/${product.slug}`}>
                    {copy.featured.discover}<ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                </div>
                <div className="product-showcase-visual">
                  <span className="product-orbit" aria-hidden="true" />
                  <SmartImage
                    src={product.images[0]}
                    alt={getProductName(product, language)}
                    loading="lazy"
                    fallbackLabel={getProductName(product, language)}
                  />
                </div>
              </article>
            )
          })}
        </div>

        <div className="featured-footer container">
          <Link className="button button-primary" to={`/${language}/products`}>
            {copy.featured.allProducts}<ArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <div className="featured-ecosystem-preview">
            <span>{copy.featured.ecosystemLabel}</span>
            <nav aria-label={copy.featured.ecosystemLabel}>
              {categories.map((category) => (
                <Link to={`/${language}/products/${category.slug}`} key={category.id}>
                  {localize(category.name, language)}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <section className="ecosystem-section" id="ecosystem" aria-labelledby="ecosystem-title">
        <div className="ecosystem-copy container">
          <h2 id="ecosystem-title">{copy.ecosystem.title}</h2>
          <p>{copy.ecosystem.body}</p>
        </div>
        <div className="ecosystem-stage container-wide">
          <div className="ecosystem-image" aria-hidden="true" />
          <svg className="ecosystem-paths" viewBox="0 0 1200 620" preserveAspectRatio="none" aria-hidden="true">
            <path d="M115 430 C280 360 300 150 495 170 S720 450 1090 240" />
            <path d="M255 535 C390 410 545 470 620 320 S850 110 1015 145" />
            <path d="M495 170 C590 245 590 260 620 320" />
          </svg>
          {copy.ecosystem.labels.map((label, index) => {
            const points = [
              [8, 69], [38, 26], [58, 51], [85, 22], [22, 86], [91, 39],
            ][index]
            return (
              <button
                type="button"
                className={`ecosystem-node ${activeEcosystem === index ? 'is-active' : ''}`}
                style={{ insetInlineStart: `${points[0]}%`, top: `${points[1]}%` }}
                key={label}
                aria-label={label}
                aria-pressed={activeEcosystem === index}
                onClick={() => setActiveEcosystem(activeEcosystem === index ? null : index)}
              >
                <i aria-hidden="true" /><span>{label}</span>
              </button>
            )
          })}
          <p className="ecosystem-hint">{copy.ecosystem.hint}</p>
        </div>
      </section>

      <section className="why-section" id="why" aria-labelledby="why-title">
        <div className="container">
          <div className="why-heading">
            <h2 id="why-title">{copy.why.title}</h2>
            <div className="why-mark" aria-hidden="true"><span /><span /><span /></div>
          </div>
          <div className="principles">
            {copy.why.items.map(([title, body], index) => {
              const Icon = principleIcons[index]
              return (
                <article key={title}>
                  <div className="principle-icon"><Icon size={24} strokeWidth={1.5} aria-hidden="true" /></div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="use-cases-section" aria-labelledby="use-cases-title">
        <div className="container-wide use-cases-layout">
          <div className="use-cases-copy">
            <h2 id="use-cases-title">{copy.useCases.title}</h2>
            <p>{copy.useCases.body}</p>
            <div className="use-case-tabs" role="tablist" aria-label={copy.useCases.title}>
              {copy.useCases.items.map(([title], index) => {
                const Icon = useCaseIcons[index]
                return (
                  <button
                    key={title}
                    type="button"
                    role="tab"
                    aria-selected={activeUseCase === index}
                    className={activeUseCase === index ? 'is-active' : ''}
                    onClick={() => setActiveUseCase(index)}
                  >
                    <Icon size={19} strokeWidth={1.5} aria-hidden="true" />
                    <span>{title}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <div
            className="use-case-scene"
            role="tabpanel"
            style={{ backgroundPosition: `${useCasePositions[activeUseCase]} center` }}
          >
            <div className="use-case-caption">
              <span>0{activeUseCase + 1}</span>
              <h3>{copy.useCases.items[activeUseCase][0]}</h3>
              <p>{copy.useCases.items[activeUseCase][1]}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section" id="about" aria-labelledby="about-title">
        <div className="container about-layout">
          <h2 id="about-title">{copy.about.title}</h2>
          <div>
            <p>{copy.about.body1}</p>
            <p>{copy.about.body2}</p>
          </div>
        </div>
      </section>

      <section className="future-section" aria-labelledby="future-title">
        <div className="future-grid" aria-hidden="true" />
        <div className="container future-layout">
          <div>
            <h2 id="future-title">
              {copy.future.title.map((line) => <span key={line}>{line}</span>)}
            </h2>
            <p>{copy.future.body}</p>
          </div>
          <div className="future-capabilities">
            <p>{copy.future.label}</p>
            <ol>
              {copy.future.items.map((item, index) => (
                <li key={item}><span>0{index + 1}</span>{item}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <div className="container contact-layout">
          <div className="contact-copy">
            <h2 id="contact-title">{copy.contact.title}</h2>
            <p>{copy.contact.body}</p>
          </div>
          <div className="contact-selector">
            {copy.contact.options.map((option, index) => (
              <button
                key={option}
                type="button"
                className={selectedInquiry === index ? 'is-active' : ''}
                onClick={() => setSelectedInquiry(index)}
              >
                <span>0{index + 1}</span>{option}<ArrowUpRight size={18} aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="contact-status" aria-live="polite">
            <span>{copy.contact.selected}</span>
            <strong>{copy.contact.options[selectedInquiry]}</strong>
            {!hasConfiguredContact && <p>{copy.contact.detailsPending}</p>}
          </div>
        </div>
      </section>
    </>
  )
}
