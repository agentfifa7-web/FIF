import { notFound } from 'next/navigation'
import { matches, getMatch, getClubById } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { MatchCenter } from '@/components/site/MatchCenter'
import { MatchSheetBanner } from '@/components/site/MatchSheetBanner'
import { loadCms } from '@/lib/cms/server'

export async function generateStaticParams() {
  await loadCms()
  return matches.map((m) => ({ id: m.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  await loadCms()
  const { id } = await params
  const match = getMatch(id)
  const h = match && getClubById(match.homeClubId)?.name
  const a = match && getClubById(match.awayClubId)?.name
  return match ? { title: `${h} – ${a} — Match Center FIF`, description: `Fiche du match ${h} – ${a} : score, faits de match et informations officielles.` } : { title: 'Match — FIF' }
}

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  await loadCms()
  const { id } = await params
  const match = getMatch(id)
  if (!match) notFound()
  const homeClub = getClubById(match.homeClubId)
  const awayClub = getClubById(match.awayClubId)

  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'Calendrier', href: '/matches' }, { label: 'Match Center' }]} />
      </div>
      <h1 className="sr-only">{homeClub?.name} – {awayClub?.name}</h1>
      <MatchCenter match={match} />
      {homeClub && awayClub && (
        <MatchSheetBanner matchId={match.id} homeName={homeClub.name} awayName={awayClub.name} />
      )}
    </main>
  )
}
