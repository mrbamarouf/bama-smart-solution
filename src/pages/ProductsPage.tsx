import { ArrowUpRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { SmartImage } from '../components/SmartImage'
import { content } from '../content'
import {
  categories,
  getProductName,
  getProductShortDescription,
  products,
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
        title={language === 'ar' ? 'المنتجات' : 'Products'}
        description={copy.productsPage.body}
        path="/products"
      />
      <section className="page-hero products-hero">
        <div className="page-hero-grid" aria-hidden="true" />
        <div className="container">
          <span className="page-index">01 — 02</span>
          <h1>{copy.productsPage.title}</h1>
          <p>{copy.productsPage.body}</p>
        </div>
      </section>

      <section className="products-catalogue">
        <div className="container-wide">
          {products.map((product, index) => {
            const category = categories.find((item) => item.id === product.category)
            return (
              <article className={`catalogue-product ${index % 2 ? 'is-reversed' : ''}`} key={product.id}>
                <div className="catalogue-visual">
                  <SmartImage
                    src={product.images[0]}
                    alt={getProductName(product, language)}
                    fallbackLabel={getProductName(product, language)}
                  />
                  <span className="catalogue-number">0{index + 1}</span>
                </div>
                <div className="catalogue-copy">
                  <span className="availability is-current">{copy.productsPage.current}</span>
                  <p className="product-category">{category ? localize(category.name, language) : ''}</p>
                  <h2>{getProductName(product, language)}</h2>
                  <p className="product-lead">{getProductShortDescription(product, language)}</p>
                  <ul>
                    {product.features.slice(0, 5).map((feature) => (
                      <li key={feature.en}><Check size={16} aria-hidden="true" />{localize(feature, language)}</li>
                    ))}
                  </ul>
                  <Link className="button button-dark" to={`/${language}/products/${product.slug}`}>
                    {copy.featured.discover}<ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="catalogue-future">
        <div className="container">
          <p>{copy.future.label}</p>
          <div>
            {categories.filter((category) => category.availability === 'ecosystem').map((category) => (
              <span key={category.id}>{localize(category.name, language)}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
