import { notFound } from 'next/navigation'
import { elephantsFixtures, getElephantsFixture, elephantsCallUp, elephantsFlag } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'
import { MatchSheetForm } from '@/components/site/MatchSheetForm'
import { formatDate } from '@/lib/format'

export function generateStaticParams() {
  return elephantsFixtures.map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const fixture = getElephantsFixture(slug)
  return { title: fixture ? `Feuille de match — FIF Digital Admin` : 'Feuille de match' }
}

export default async function ElephantsMatchSheetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const fixture = getElephantsFixture(slug)
  if (!fixture) notFound()

  const elephantsRef = { id: 'elephants', name: 'Côte d’Ivoire' }
  const opponentRef = { id: 'opponent', name: fixture.opponent }
  const elephantsPlayers = elephantsCallUp.map((p) => ({ id: p.slug, name: p.name }))

  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Feuilles de match', href: '/admin/feuille-de-match' }, { label: `Côte d’Ivoire vs ${fixture.opponent}` }]} />
      </div>
      <section className="page-section tight">
        <MatchSheetForm
          matchId={fixture.slug}
          matchLabel={`${fixture.competition} · ${formatDate(fixture.date)} · ${elephantsFlag} Côte d’Ivoire vs ${fixture.opponentFlag} ${fixture.opponent}`}
          homeClub={fixture.home ? elephantsRef : opponentRef}
          awayClub={fixture.home ? opponentRef : elephantsRef}
          homePlayers={fixture.home ? elephantsPlayers : []}
          awayPlayers={fixture.home ? [] : elephantsPlayers}
          note="Effectif adverse non suivi dans cette base : seuls les buteurs et cartons des Éléphants peuvent être saisis."
        />
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
