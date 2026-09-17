import Link from 'next/link'
import { notFound } from 'next/navigation'
import { articles, getArticle } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { NewsCard } from '@/components/site/cards'
import { DemoBadge } from '@/components/site/DemoBadge'
import { formatDate } from '@/lib/format'

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  return { title: article ? `${article.title} — FIF Digital` : 'Article' }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()
  const related = articles.filter((a) => a.category === article.category && a.id !== article.id).slice(0, 3)

  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'Actualités', href: '/actualites' }, { label: article.category, href: `/actualites?category=${article.category}` }, { label: article.title }]} />
      </div>
      <article className="article-layout">
        <p className="section-tag">{article.category}</p>
        <h1>{article.title}</h1>
        <div className="article-meta">
          <span>Par {article.author}</span>
          <span>{formatDate(article.date, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        <div className="article-image" style={{ backgroundImage: `url(${article.image})` }} />
        <div className="article-body">
          {article.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="chip-row" style={{ marginTop: 24 }}>
          {article.tags.map((t) => <span className="chip" key={t}>{t}</span>)}
        </div>
        <div className="share-row">
          <span>Partager :</span>
          <a href="#" aria-label="Partager sur Facebook">f</a>
          <a href="#" aria-label="Partager sur Twitter">x</a>
          <a href="#" aria-label="Partager sur LinkedIn">in</a>
        </div>
      </article>

      {related.length > 0 && (
        <section className="page-section tight">
          <p className="section-tag">Articles liés</p>
          <div className="news-grid" style={{ marginTop: 16 }}>
            {related.map((a) => <NewsCard key={a.id} article={a} />)}
          </div>
        </section>
      )}
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
