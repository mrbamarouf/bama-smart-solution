import { ArrowUpRight, Check, Radio } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { SmartImage } from '../components/SmartImage'
import { content } from '../content'
import {
  categories,
  getProductBySlug,
  getProductName,
  getProductShortDescription,
} from '../data/products'
import { useLanguage } from '../hooks/useLanguage'
import { localize } from '../types'

export default function ProductsPage() {
  const language = useLanguage()
  const copy = content[language]

  return (
    <>
      <Seo
        language={language}
        title={copy.productsPage.title}
        description={copy.productsPage.body}
        path="/products"
      />

      <section className="page-hero products-hero">
        <div className="page-hero-grid" aria-hidden="true" />
        <div className="container products-hero-layout">
          <div>
            <span className="page-index">01 — 06</span>
            <h1>{copy.productsPage.title}</h1>
            <p>{copy.productsPage.body}</p>
          </div>
          <nav className="category-index" aria-label={copy.productsPage.title}>
            {categories.map((category) => (
              <a href={`#${category.slug}`} key={category.id}>
                <span>0{category.order}</span>
                {localize(category.name, language)}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="category-catalogue">
        {categories.map((category, index) => {
          const product = getProductBySlug(category.heroProductSlug)
          const isFuture = category.status === 'futureCategory'

          return (
            <section
              className={`category-world category-world-${category.id} ${index % 2 ? 'is-reversed' : ''}`}
              id={category.slug}
              key={category.id}
              aria-labelledby={`${category.slug}-title`}
            >
              <div className="category-world-inner container-wide">
                <div className="category-world-visual">
                  <SmartImage
                    src={category.image}
                    alt={localize(category.name, language)}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    fallbackLabel={localize(category.name, language)}
                  />
                </div>

                <div className="category-world-copy">
                  <div className="category-world-meta">
                    <span className="category-serial">0{category.order}</span>
                    <span className="category-signal" aria-hidden="true"><i /><i /></span>
                  </div>
                  <span className={`availability ${isFuture ? '' : 'is-current'}`}>
                    {isFuture ? copy.productsPage.future : copy.productsPage.current}
                  </span>
                  <p className="category-kicker">
                    {isFuture ? copy.productsPage.categoryDirection : copy.productsPage.confirmedProduct}
                  </p>
                  <h2 id={`${category.slug}-title`}>{localize(category.name, language)}</h2>
                  <p className="category-description">{localize(category.description, language)}</p>
                  <p className="category-direction">{localize(category.direction, language)}</p>

                  {product && (
                    <div className="confirmed-product-line">
                      <Radio size={18} aria-hidden="true" />
                      <div>
                        <strong>{getProductName(product, language)}</strong>
                        <span>{getProductShortDescription(product, language)}</span>
                      </div>
                    </div>
                  )}

                  <ul className="category-products-list">
                    {category.futureProducts.map((item) => (
                      <li key={item.name.en}>
                        <Check size={15} aria-hidden="true" />
                        <span>{localize(item.name, language)}</span>
                        <small>{copy.productsPage.future}</small>
                      </li>
                    ))}
                  </ul>

                  <Link className="text-link category-link" to={`/${language}/products/${category.slug}`}>
                    {copy.productsPage.viewCategory}<ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}
