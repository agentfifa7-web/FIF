import { ArrowRight, Newspaper } from 'lucide-react'
import type { PressItem } from '@/lib/news/rss'
import { EmptyState } from './widgets'

// Même logique de vignette générée que NewsThumb.tsx : les flux de presse
// réels (Google Actualités) ne fournissent qu'un titre/lien/source, jamais
// de vignette, donc chaque carte reçoit un dégradé + icône déterministe par
// titre plutôt qu'une simple alternance de deux teintes.
const TONES = ['#087443', '#c85a00', '#0b1110', '#1c4587', '#7a4706', '#6d2d6d', '#0a5c33', '#a4501f']

function hashString(value: string) {
  let h = 0
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}

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
      {items.map((item, i) => {
        const seed = hashString(item.title)
        const tone = TONES[seed % TONES.length]
        const tone2 = TONES[(seed >> 4) % TONES.length]
        const diagonal = seed % 2 === 1
        return (
        <article className="news-card press-card" key={i}>
          <a href={item.link} target="_blank" rel="noopener noreferrer" className="news-image press-card-image" style={{ background: tone }}>
            <svg className="press-card-bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {diagonal ? <polygon points="100,0 100,100 0,100" fill={tone2} opacity="0.55" /> : <polygon points="0,0 100,0 100,100" fill={tone2} opacity="0.55" />}
            </svg>
            <Newspaper />
            <span>{item.source}</span>
          </a>
          <div className="news-body">
            <small>{item.pubDate ? timeAgo(item.pubDate).toUpperCase() : 'PRESSE'}</small>
            <h3><a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a></h3>
            <a href={item.link} target="_blank" rel="noopener noreferrer" aria-label={`Lire sur ${item.source} : ${item.title}`}><ArrowRight /></a>
          </div>
        </article>
        )
      })}
    </div>
  )
}
