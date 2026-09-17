import { ArrowRight, Newspaper } from 'lucide-react'
import type { PressItem } from '@/lib/news/rss'
import { EmptyState } from './widgets'

function timeAgo(pubDate: string | null) {
  if (!pubDate) return ''
  const d = new Date(pubDate)
  if (Number.isNaN(+d)) return ''
  const diffH = Math.max(0, Math.round((Date.now() - +d) / 3600000))
  if (diffH < 1) return 'à l’instant'
  if (diffH < 24) return `il y a ${diffH} h`
  const days = Math.round(diffH / 24)
  return `il y a ${days} j`
}

export function PressReview({ items, ok }: { items: PressItem[]; ok: boolean }) {
  if (!ok || !items.length) {
    return (
      <EmptyState
        title="Revue de presse momentanément indisponible"
        hint="Les flux des médias sportifs ivoiriens n’ont pas pu être récupérés à l’instant — réessayez dans quelques minutes."
      />
    )
  }

  return (
    <div className="card-grid press-news-grid">
      {items.map((item, i) => (
        <article className="news-card press-card" key={i}>
          <a href={item.link} target="_blank" rel="noopener noreferrer" className={`news-image press-card-image ${i % 2 === 0 ? 'tone-a' : 'tone-b'}`}>
            <Newspaper />
            <span>{item.source}</span>
          </a>
          <div className="news-body">
            <small>{item.pubDate ? timeAgo(item.pubDate).toUpperCase() : 'PRESSE'}</small>
            <h3><a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a></h3>
            <a href={item.link} target="_blank" rel="noopener noreferrer" aria-label={`Lire sur ${item.source} : ${item.title}`}><ArrowRight /></a>
          </div>
        </article>
      ))}
    </div>
  )
}
