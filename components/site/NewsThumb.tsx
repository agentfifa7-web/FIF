import { BookOpen, Flag, GraduationCap, HeartHandshake, Landmark, Shield, Sun, Trophy, Users, Waves } from 'lucide-react'
import type { Article } from '@/lib/data/types'

// Visuel d'actualité. Une image réelle publiée avec l'article (administration)
// est affichée telle quelle ; sinon un visuel éditorial aux couleurs de la FIF
// (terrain stylisé, rubrique, bandeau tricolore) — jamais de photo étirée ni
// d'image tierce non autorisée.
const CATEGORY_ICON: Record<string, typeof Trophy> = {
  'Ligue 1': Trophy,
  Compétitions: Trophy,
  Éléphants: Shield,
  Clubs: Shield,
  Amateur: Shield,
  Féminin: Users,
  Éléphantes: Users,
  Jeunes: GraduationCap,
  Arbitrage: Flag,
  Formation: BookOpen,
  Fédération: Landmark,
  'Engagement sociétal': HeartHandshake,
  Futsal: Waves,
  'Beach Soccer': Sun,
}

// Trois tonalités de marque, réparties par rubrique (cohérentes d'une page à l'autre).
const TONE: Record<string, string> = { Éléphants: 'tone-orange', Éléphantes: 'tone-orange', 'Ligue 1': 'tone-green', Compétitions: 'tone-deep' }

export function NewsThumb({ article }: { article: Article }) {
  if (article.image && !article.image.includes('picsum.photos')) {
    return <div className="news-thumb" role="img" aria-label={article.title} style={{ backgroundImage: `url(${article.image})`, backgroundPosition: 'center', backgroundSize: 'cover' }} />
  }
  const Icon = CATEGORY_ICON[article.category] ?? Trophy
  const tone = TONE[article.category] ?? 'tone-deep'
  return (
    <div className={`news-thumb nt-visual ${tone}`} role="img" aria-label={article.title}>
      <svg className="nt-pitch" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect x="6" y="6" width="148" height="88" rx="2" />
        <line x1="80" y1="6" x2="80" y2="94" />
        <circle cx="80" cy="50" r="15" />
        <rect x="6" y="30" width="20" height="40" />
        <rect x="134" y="30" width="20" height="40" />
      </svg>
      <span className="nt-label"><Icon aria-hidden /> {article.category}</span>
      <img className="nt-logo" src="/fif-logo.png" alt="" width={44} height={44} loading="lazy" />
      <span className="nt-flag" aria-hidden><i /><i /><i /></span>
    </div>
  )
}
