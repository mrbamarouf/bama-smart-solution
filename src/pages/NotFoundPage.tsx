import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { content } from '../content'
import { useLanguage } from '../hooks/useLanguage'

export default function NotFoundPage() {
  const language = useLanguage()
  const copy = content[language].notFound

  return (
    <section className="not-found">
      <Seo language={language} title="404" />
      <div className="not-found-signal" aria-hidden="true">404</div>
      <div className="container">
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>
        <Link className="button button-primary" to={`/${language}`}>
          {copy.action}<ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
