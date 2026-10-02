import { notFound } from 'next/navigation'
import { matches, players, competitions, getClubById, standingsFor } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { MatchSheetForm } from '@/components/site/MatchSheetForm'
import { matchWhen } from '@/lib/format'

export function generateStaticParams() {
  return matches.map((m) => ({ id: m.id }))
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

  const roster = (clubId: string) => players
    .filter((p) => p.clubId === clubId)
    .sort((a, b) => (a.squadNumber ?? 99) - (b.squadNumber ?? 99))
    .map((p) => ({ id: p.id, name: p.name, number: p.squadNumber, position: p.positionDetail ?? p.position }))
  const homePlayers = roster(home.id)
  const awayPlayers = roster(away.id)
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
          matchLabel={`${comp?.name ?? ''} · Journée ${match.matchday} · ${matchWhen(match)} · ${home.name} vs ${away.name}`}
          homeClub={{ id: home.id, name: home.name }}
          awayClub={{ id: away.id, name: away.name }}
          homePlayers={homePlayers}
          awayPlayers={awayPlayers}
          homeStanding={match.status === 'Terminé' ? undefined : homeStanding}
          awayStanding={match.status === 'Terminé' ? undefined : awayStanding}
        />
      </section>
    </main>
  )
}
