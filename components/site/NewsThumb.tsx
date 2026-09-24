import { BookOpen, Flag, GraduationCap, HeartHandshake, Landmark, Shield, Sun, Trophy, Users, Waves } from 'lucide-react'
import type { Article } from '@/lib/data/types'

// Écussons/portraits utilisent déjà ce motif (voir cards.tsx / PersonPortrait.tsx) :
// visuel généré, déterministe par identifiant, garanti de s'afficher sans
// dépendre d'un service d'images externe.
const TONES = ['#087443', '#c85a00', '#0b1110', '#1c4587', '#7a4706', '#6d2d6d', '#0a5c33', '#a4501f']

function hashString(value: string) {
  let h = 0
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}

const CATEGORY_ICON: Record<string, typeof Trophy> = {
  'Ligue 1': Trophy,
  Clubs: Shield,
  Amateur: Shield,
  Féminin: Users,
  Éléphantes: Users,
  Jeunes: GraduationCap,
  Compétitions: Trophy,
  Arbitrage: Flag,
  Formation: BookOpen,
  Fédération: Landmark,
  'Engagement sociétal': HeartHandshake,
  Futsal: Waves,
  'Beach Soccer': Sun,
}

// Photos réelles Éléphants (fournies par la FIF) déjà utilisées pour les
// carrousels de hero — voir PageHero.tsx. Réservées à la catégorie
// « Éléphants » (équipe masculine) pour rester fidèles au sujet.
const ELEPHANTS_PHOTOS = Array.from({ length: 15 }, (_, i) => `/hero-photos/elephants-${String(i + 1).padStart(2, '0')}.jpg`)

/** Image d'illustration d'actualité, toujours locale (pas de service d'images
 *  externe) : photo réelle pour la catégorie Éléphants, sinon une vignette
 *  générée (dégradé + motif + icône) déterministe par article. */
export function NewsThumb({ article }: { article: Article }) {
  const seed = hashString(article.id)

  if (article.category === 'Éléphants') {
    const photo = ELEPHANTS_PHOTOS[seed % ELEPHANTS_PHOTOS.length]
    return (
      <div
        className="news-thumb"
        role="img"
        aria-label={article.title}
        style={{ backgroundImage: `linear-gradient(0deg, rgba(4,17,10,.55), rgba(4,17,10,0) 55%), url(${photo})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
      />
    )
  }

  const tone = TONES[seed % TONES.length]
  const tone2 = TONES[(seed >> 4) % TONES.length]
  const diagonal = seed % 2 === 1
  const Icon = CATEGORY_ICON[article.category] ?? Trophy

  return (
    <div className="news-thumb news-thumb-generated" style={{ background: tone }} role="img" aria-label={article.title}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {diagonal ? <polygon points="100,0 100,100 0,100" fill={tone2} opacity="0.55" /> : <polygon points="0,0 100,0 100,100" fill={tone2} opacity="0.55" />}
      </svg>
      <Icon className="news-thumb-icon" aria-hidden="true" />
    </div>
  )
}
