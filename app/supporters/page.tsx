import Link from 'next/link'
import { ArrowRight, Gamepad2, IdCard, MessageCircle, Users } from 'lucide-react'
import { nextElephantsFixture, quizQuestions, fanZonePosts } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { FanHomeDashboard } from '@/components/site/FanHomeDashboard'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'FIF Fan Universe — FIF Digital' }

const PILLARS = [
  {
    icon: IdCard,
    title: 'Fan Pass',
    description: 'Identité, avantages et expériences.',
    links: [
      { label: 'Mon Fan ID', href: '/supporters/fan-id' },
      { label: 'Mes niveaux & XP', href: '/supporters/niveaux' },
      { label: 'Mes badges', href: '/supporters/badges' },
      { label: 'Passeport FIF & Football Tour', href: '/supporters/passeport' },
    ],
  },
  {
    icon: Gamepad2,
    title: 'Fan Arena',
    description: 'Jeux, quiz, pronostics, défis et classements.',
    links: [
      { label: 'FIF Game Arena', href: '/supporters/arena' },
      { label: 'Quiz Éléphants', href: '/supporters/arena/quiz' },
      { label: 'Pronostics', href: '/supporters/arena/pronostics' },
      { label: 'Classements', href: '/supporters/classements' },
    ],
  },
  {
    icon: MessageCircle,
    title: 'Fan Zone',
    description: 'Photos, vidéos, chants, créations et communauté.',
    links: [
      { label: 'Fil Fan Zone', href: '/supporters/fan-zone' },
      { label: 'Chants des supporters', href: '/supporters/chants' },
      { label: 'Tifo Studio', href: '/supporters/tifo-studio' },
      { label: 'Fan Studio (avatar & bannière)', href: '/supporters/fan-studio' },
    ],
  },
  {
    icon: Users,
    title: 'Fan Life',
    description: 'Matchday, associations, partenaires, récompenses.',
    links: [
      { label: 'Club des Supporters', href: '/supporters/club-des-supporters' },
      { label: 'Mode Matchday', href: '/supporters/matchday' },
      { label: 'Fan Clubs & associations', href: '/supporters/associations' },
      { label: 'Avantages partenaires', href: '/supporters/partenaires' },
      { label: 'Récompenses', href: '/supporters/recompenses' },
      { label: 'Charte du supporter', href: '/supporters/charte' },
      { label: 'Modération & signalement', href: '/supporters/moderation' },
    ],
  },
]

export default function SupportersPage() {
  const fixture = nextElephantsFixture()
  const dailyQuestion = quizQuestions[5]
  const recentPosts = fanZonePosts.slice(0, 3).map((p) => ({ authorName: p.authorName, type: p.type, caption: p.caption }))

  return (
    <main>
      <PageHero
        eyebrow="🇨🇮 FIF Fan Universe"
        title="Vivez le football ivoirien autrement."
        subtitle="Un supporter ne vient plus seulement lire une actualité : il joue, vote, crée, collectionne, découvre et construit son identité de fan — sans jamais miser ou gagner d’argent réel."
        breadcrumb={[{ label: 'Supporters' }]}
      />

      {fixture && (
        <FanHomeDashboard
          nextFixture={{ opponent: fixture.opponent, competition: fixture.competition, date: fixture.date, stadiumName: fixture.venue, home: fixture.home }}
          dailyQuestion={dailyQuestion}
          recentPosts={recentPosts}
        />
      )}

      <section className="page-section tight">
        <div className="page-section-head">
          <div><p className="section-tag">Les quatre piliers</p><h2 style={{ fontSize: 24 }}>🇨🇮 FIF FAN UNIVERSE</h2></div>
        </div>
        <div className="fan-pillars" style={{ marginTop: 16 }}>
          {PILLARS.map((pillar) => (
            <div className="fan-pillar" key={pillar.title}>
              <pillar.icon size={22} />
              <strong>{pillar.title}</strong>
              <p>{pillar.description}</p>
              <div className="fan-pillar-links">
                {pillar.links.map((l) => (
                  <Link href={l.href} key={l.href}>{l.label} <ArrowRight size={11} style={{ verticalAlign: 'middle' }} /></Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
