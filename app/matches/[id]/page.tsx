import { notFound } from 'next/navigation'
import { matches, getMatch, players, getClubById } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { MatchCenter } from '@/components/site/MatchCenter'
import { MatchSheetBanner } from '@/components/site/MatchSheetBanner'
import { DemoBadge } from '@/components/site/DemoBadge'

export function generateStaticParams() {
  return matches.map((m) => ({ id: m.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const match = getMatch(id)
  return { title: match ? `Match Center — FIF Digital` : 'Match' }
}

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const match = getMatch(id)
  if (!match) notFound()
  const homeRoster = players.filter((p) => p.clubId === match.homeClubId)
  const awayRoster = players.filter((p) => p.clubId === match.awayClubId)
  const homeClub = getClubById(match.homeClubId)
  const awayClub = getClubById(match.awayClubId)

  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'Calendrier', href: '/matches' }, { label: 'Match Center' }]} />
      </div>
      <MatchCenter match={match} homeRoster={homeRoster} awayRoster={awayRoster} />
      {match.status !== 'Terminé' && homeClub && awayClub && (
        <MatchSheetBanner matchId={match.id} homeName={homeClub.name} awayName={awayClub.name} />
      )}
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
