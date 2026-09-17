import { ExternalLink, Newspaper } from 'lucide-react'
import type { PressItem } from '@/lib/news/rss'

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
      <div className="empty-state">
        <strong>Revue de presse momentanément indisponible</strong>
        <span>Les flux des médias sportifs ivoiriens n’ont pas pu être récupérés à l’instant — réessayez dans quelques minutes.</span>
      </div>
    )
  }

  return (
    <div className="press-list">
      {items.map((item, i) => (
        <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="press-item">
          <Newspaper size={16} />
          <div>
            <strong>{item.title}</strong>
            <span>{item.source}{item.pubDate ? ` · ${timeAgo(item.pubDate)}` : ''}</span>
          </div>
          <ExternalLink size={14} className="press-item-ext" />
        </a>
      ))}
    </div>
  )
}
