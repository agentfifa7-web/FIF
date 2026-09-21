import { notFound } from 'next/navigation'
import { matches, players, competitions, getClubById, standingsFor } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'
import { MatchSheetForm } from '@/components/site/MatchSheetForm'
import { formatDate } from '@/lib/format'

export function generateStaticParams() {
  return matches.filter((m) => m.status !== 'Terminé').map((m) => ({ id: m.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const match = matches.find((m) => m.id === id)
  return { title: match ? `Feuille de match — FIF Digital Admin` : 'Feuille de match' }
}

export default async function MatchSheetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const match = matches.find((m) => m.id === id)
  if (!match) notFound()
  const home = getClubById(match.homeClubId)
  const away = getClubById(match.awayClubId)
  if (!home || !away) notFound()
  const comp = competitions.find((c) => c.id === match.competitionId)

  const homePlayers = players.filter((p) => p.clubId === home.id).map((p) => ({ id: p.id, name: p.name }))
  const awayPlayers = players.filter((p) => p.clubId === away.id).map((p) => ({ id: p.id, name: p.name }))
  const standings = standingsFor(match.competitionId)
  const homeStanding = standings.find((s) => s.clubId === home.id) ?? { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 }
  const awayStanding = standings.find((s) => s.clubId === away.id) ?? { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 }

  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Feuilles de match', href: '/admin/feuille-de-match' }, { label: `${home.name} vs ${away.name}` }]} />
      </div>
      <section className="page-section tight">
        <MatchSheetForm
          matchId={match.id}
          matchLabel={`${comp?.name ?? ''} · ${formatDate(match.date)} · ${home.name} vs ${away.name}`}
          homeClub={{ id: home.id, name: home.name }}
          awayClub={{ id: away.id, name: away.name }}
          homePlayers={homePlayers}
          awayPlayers={awayPlayers}
          homeStanding={homeStanding}
          awayStanding={awayStanding}
        />
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
