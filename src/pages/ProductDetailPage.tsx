import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { SmartImage } from '../components/SmartImage'
import { content } from '../content'
import {
  categories,
  getProductBySlug,
  getProductDescription,
  getProductName,
} from '../data/products'
import { useLanguage } from '../hooks/useLanguage'
import { localize } from '../types'

export default function ProductDetailPage() {
  const language = useLanguage()
  const copy = content[language]
  const { slug } = useParams()
  const product = getProductBySlug(slug)

  if (!product) return <Navigate to={`/${language}/not-found`} replace />

  const category = categories.find((item) => item.id === product.category)
  const BackArrow = language === 'ar' ? ArrowRight : ArrowLeft

  return (
    <>
      <Seo
        language={language}
        title={getProductName(product, language)}
        description={getProductDescription(product, language)}
        path={`/products/${product.slug}`}
      />
      <section className="product-detail-hero">
        <div className="container-wide product-detail-grid">
          <div className="product-detail-copy">
            <Link className="back-link" to={`/${language}/products`}>
              <BackArrow size={17} aria-hidden="true" />{copy.detail.back}
            </Link>
            <p className="product-category">{category ? localize(category.name, language) : ''}</p>
            <h1>{getProductName(product, language)}</h1>
            <p>{getProductDescription(product, language)}</p>
            <div className="product-detail-actions">
              <Link className="button button-primary" to={`/${language}#contact`}>
                {copy.detail.inquiry}<ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link className="button button-secondary" to={`/${language}#contact`}>
                {copy.detail.installation}
              </Link>
            </div>
          </div>
          <div className="product-detail-visual">
            <span className="product-detail-orbit" aria-hidden="true" />
            <SmartImage
              src={product.images[0]}
              alt={getProductName(product, language)}
              fallbackLabel={getProductName(product, language)}
            />
          </div>
        </div>
      </section>

      <section className="product-overview">
        <div className="container product-overview-layout">
          <div>
            <h2>{copy.detail.overview}</h2>
            <p>{getProductDescription(product, language)}</p>
          </div>
          <ul className="product-feature-list">
            {product.features.map((feature) => (
              <li key={feature.en}><Check size={17} aria-hidden="true" />{localize(feature, language)}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="specifications-section">
        <div className="container">
          <h2>{copy.detail.specifications}</h2>
          <dl>
            {product.specifications.map((specification) => (
              <div key={specification.label.en}>
                <dt>{localize(specification.label, language)}</dt>
                <dd>{localize(specification.value, language)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="product-context">
        <div className="container product-context-grid">
          <div>
            <h2>{copy.detail.environments}</h2>
            <ol>
              {product.idealEnvironments.map((environment, index) => (
                <li key={environment.en}><span>0{index + 1}</span>{localize(environment, language)}</li>
              ))}
            </ol>
          </div>
          <div>
            <h2>{copy.detail.benefits}</h2>
            <ul>
              {product.benefits.map((benefit) => (
                <li key={benefit.en}>{localize(benefit, language)}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="related-solution">
        <div className="container">
          <span>{copy.detail.related}</span>
          <h2>{category ? localize(category.name, language) : ''}</h2>
          <p>{category ? localize(category.description, language) : ''}</p>
          <Link className="text-link light" to={`/${language}/products/${category?.slug ?? ''}`}>
            {copy.productsPage.viewCategory}<ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
