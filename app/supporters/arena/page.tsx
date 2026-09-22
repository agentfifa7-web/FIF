import Link from 'next/link'
import { Brain, Gamepad2, ImageIcon, ListChecks, Music, Puzzle, Swords, Target, Trophy } from 'lucide-react'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'FIF Game Arena — FIF Digital' }

const GAMES = [
  { icon: Trophy, title: 'Quiz Éléphants', desc: 'Questions sur les Éléphants, les clubs, les stades et les compétitions.', href: '/supporters/arena/quiz', live: true },
  { icon: Target, title: 'Pronostics', desc: 'Prédisez le score des prochains matchs. Aucune mise, aucun gain réel.', href: '/supporters/arena/pronostics', live: true },
  { icon: Brain, title: 'Expert Foot', desc: 'Niveau difficile, 5 paliers de Débutant à Légende.', href: '/supporters/arena/quiz', live: true },
  { icon: Puzzle, title: 'Devine le joueur', desc: 'Une silhouette apparaît, découvrez le joueur indice après indice.', href: '#', live: false },
  { icon: Music, title: 'Reconnais le chant', desc: 'Identifiez équipe, groupe, match et époque à l’écoute d’un chant.', href: '#', live: false },
  { icon: ImageIcon, title: 'Photo mystère', desc: 'Une photo historique se révèle progressivement.', href: '#', live: false },
  { icon: ListChecks, title: 'Mémoire du foot', desc: 'Jeu memory : joueurs, logos, stades, maillots, trophées.', href: '#', live: false },
  { icon: Gamepad2, title: 'Tire au but / Arrête le penalty', desc: 'Mini-jeux d’angle, de puissance et d’effet. Aucun argent en jeu.', href: '#', live: false },
  { icon: Swords, title: 'Compose ton XI / Coach FIF', desc: 'Construisez votre équipe historique ou votre tactique du prochain match.', href: '#', live: false },
]

export default function ArenaPage() {
  return (
    <main>
      <PageHero
        eyebrow="🎮 Fan Arena"
        title="FIF Game Arena"
        subtitle="Jeux, quiz et défis gamifiés — uniquement XP, badges et classements. Aucune mécanique de jeu ne nécessite ni ne rapporte d’argent réel."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Fan Arena' }]}
      />

      <section className="page-section tight">
        <div className="card-grid cols-2">
          {GAMES.map((g) => (
            <Link href={g.href} key={g.title} className="entity-card" style={{ pointerEvents: g.live ? 'auto' : 'none', opacity: g.live ? 1 : 0.6 }}>
              <g.icon size={20} color="var(--orange)" />
              <div><strong>{g.title}</strong><span>{g.desc}</span></div>
              <span className={`status-pill ${g.live ? 'ok' : 'neutral'}`}>{g.live ? 'Jouer' : 'Bientôt'}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
