import { notFound } from 'next/navigation'
import { matches, getMatch, players } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { MatchCenter } from '@/components/site/MatchCenter'
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

  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'Calendrier', href: '/matches' }, { label: 'Match Center' }]} />
      </div>
      <MatchCenter match={match} homeRoster={homeRoster} awayRoster={awayRoster} />
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
