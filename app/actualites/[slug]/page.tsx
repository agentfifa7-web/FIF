import Link from 'next/link'
import { notFound } from 'next/navigation'
import { articles, getArticle } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { NewsCard } from '@/components/site/cards'
import { NewsThumb } from '@/components/site/NewsThumb'
import { ShareButtons } from '@/components/site/ShareButtons'
import { formatDate } from '@/lib/format'
import { loadCms } from '@/lib/cms/server'

export async function generateStaticParams() {
  await loadCms()
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  await loadCms()
  const { slug } = await params
  const article = getArticle(slug)
  return { title: article ? `${article.title} — FIF Digital` : 'Article' }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  await loadCms()
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()
  const related = articles.filter((a) => a.category === article.category && a.id !== article.id).slice(0, 3)

  return (
    <main>
      <article className="article-layout">
        <Breadcrumb items={[{ label: 'Actualités', href: '/actualites' }, { label: article.category }]} />
        <p className="h-kicker" style={{ marginTop: 24 }}>{article.category}</p>
        <h1>{article.title}</h1>
        <p className="article-lead">{article.excerpt}</p>
        <div className="article-meta">
          <span>Par {article.author}</span>
          <time dateTime={article.date}>{formatDate(article.date, { day: 'numeric', month: 'long', year: 'numeric' })}</time>
        </div>
        <div className="article-image"><NewsThumb article={article} /></div>
        <div className="article-body">
          {article.body.map((p, i) => (p.startsWith('Source') ? <p key={i} className="article-source">{p}</p> : <p key={i}>{p}</p>))}
        </div>
        <div className="chip-row" style={{ marginTop: 24 }}>
          {article.tags.map((t) => <span className="chip" key={t}>{t}</span>)}
        </div>
        <ShareButtons title={article.title} />
      </article>

      {related.length > 0 && (
        <section className="page-section section-alt">
          <h2>À lire aussi</h2>
          <div className="news-grid" style={{ marginTop: 16 }}>
            {related.map((a) => <NewsCard key={a.id} article={a} />)}
          </div>
        </section>
      )}
    </main>
  )
}
