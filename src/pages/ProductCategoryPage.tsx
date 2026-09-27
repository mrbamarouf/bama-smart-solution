import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { SmartImage } from '../components/SmartImage'
import { content } from '../content'
import {
  getCategoryBySlug,
  getProductName,
  getProductShortDescription,
  getProductsByCategory,
} from '../data/products'
import { useLanguage } from '../hooks/useLanguage'
import { localize } from '../types'

export default function ProductCategoryPage({ categorySlug: categorySlugProp }: { categorySlug?: string }) {
  const language = useLanguage()
  const copy = content[language]
  const { categorySlug } = useParams()
  const resolvedSlug = categorySlugProp ?? categorySlug
  const category = getCategoryBySlug(resolvedSlug)

  if (!category) return <Navigate to={`/${language}/not-found`} replace />

  const categoryProducts = getProductsByCategory(category.id)
  const BackArrow = language === 'ar' ? ArrowRight : ArrowLeft
  const isFuture = category.status === 'futureCategory'

  return (
    <>
      <Seo
        language={language}
        title={localize(category.name, language)}
        description={localize(category.description, language)}
        path={`/products/${category.slug}`}
      />

      <section className={`category-detail-hero category-detail-${category.id}`}>
        <div className="container-wide category-detail-layout">
          <div className="category-detail-copy">
            <Link className="back-link" to={`/${language}/products`}>
              <BackArrow size={17} aria-hidden="true" />{copy.categoryPage.back}
            </Link>
            <span className={`availability ${isFuture ? '' : 'is-current'}`}>
              {isFuture ? copy.categoryPage.future : copy.categoryPage.available}
            </span>
            <p className="category-kicker">
              0{category.order} · {isFuture ? copy.categoryPage.direction : copy.categoryPage.confirmed}
            </p>
            <h1>{localize(category.name, language)}</h1>
            <p className="category-detail-lead">{localize(category.description, language)}</p>
            <p className="category-detail-direction">{localize(category.direction, language)}</p>
          </div>
          <div className="category-detail-visual">
            <SmartImage
              src={category.image}
              alt={localize(category.name, language)}
              fallbackLabel={localize(category.name, language)}
            />
            <span className="category-detail-orbit" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="category-scope">
        <div className="container category-scope-layout">
          <div className="category-scope-heading">
            <span>0{category.order}</span>
            <h2>{copy.categoryPage.examples}</h2>
          </div>
          <ul>
            {category.futureProducts.map((item) => (
              <li key={item.name.en}>
                <Check size={17} aria-hidden="true" />
                <strong>{localize(item.name, language)}</strong>
                <span>{copy.categoryPage.future}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {categoryProducts.map((product) => (
        <section className="category-confirmed-product" key={product.id}>
          <div className="container category-confirmed-layout">
            <div>
              <span>{copy.categoryPage.confirmed}</span>
              <h2>{getProductName(product, language)}</h2>
              <p>{getProductShortDescription(product, language)}</p>
              <Link className="button button-primary" to={`/${language}/products/${product.slug}`}>
                {copy.categoryPage.viewProduct}<ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <SmartImage
              src={product.images[0]}
              alt={getProductName(product, language)}
              fallbackLabel={getProductName(product, language)}
            />
          </div>
        </section>
      ))}
    </>
  )
}
