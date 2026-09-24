import { notFound } from 'next/navigation'
import { competitions, getCompetition, standingsFor, topScorersFor, topAssistsFor, refereesFor, matches, players, getClubById } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { CompetitionTabs } from '@/components/site/CompetitionTabs'
import { DemoBadge } from '@/components/site/DemoBadge'

export function generateStaticParams() {
  return competitions.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = getCompetition(slug)
  return { title: c ? `${c.name} — FIF Digital` : 'Compétition' }
}

export default async function CompetitionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const competition = getCompetition(slug)
  if (!competition) notFound()

  const standings = standingsFor(competition.id)
  const poules = competition.id === 'comp-l2'
    ? (['A', 'B'] as const).map((g) => ({
      label: `Poule ${g}`,
      standings: standingsFor(competition.id, g),
      clubIds: competition.clubIds.filter((id) => getClubById(id)?.group === g),
    }))
    : undefined
  const compMatches = matches.filter((m) => m.competitionId === competition.id)
  const scorers = topScorersFor(competition.id)
  const assisters = topAssistsFor(competition.id)
  const officiatingReferees = refereesFor(competition.id)
  const compPlayers = competition.clubIds.flatMap((id) => players.filter((p) => p.clubId === id))

  return (
    <main>
      <PageHero
        eyebrow={competition.practice ? `${competition.category} · Football ${competition.practice.toLowerCase()}` : competition.category}
        title={competition.name}
        subtitle={`Saison ${competition.season} · ${competition.format} · ${competition.clubIds.length} équipes engagées.`}
        breadcrumb={[{ label: 'Compétitions', href: '/competitions' }, { label: competition.name }]}
        meta={[
          { value: String(competition.clubIds.length), label: 'Équipes' },
          { value: String(compMatches.length), label: 'Matchs cette saison' },
        ]}
      />
      <section className="page-section tight">
        <CompetitionTabs
          competition={competition}
          standings={standings}
          poules={poules}
          scorers={scorers}
          assisters={assisters}
          officiatingReferees={officiatingReferees}
          compPlayers={compPlayers}
          allMatches={compMatches}
        />
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
