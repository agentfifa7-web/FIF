import { matches } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { MatchExplorer } from '@/components/site/MatchExplorer'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Résultats — FIF Digital' }

export default function ResultsPage() {
  const results = matches.filter((m) => m.status === 'Terminé').sort((a, b) => +new Date(b.date) - +new Date(a.date))
  return (
    <main>
      <PageHero
        eyebrow="Match Center"
        title="Résultats"
        subtitle="Tous les résultats de la saison, compétition par compétition."
        breadcrumb={[{ label: 'Résultats' }]}
        meta={[{ value: String(results.length), label: 'Matchs joués' }]}
      />
      <section className="page-section tight">
        <MatchExplorer matches={results} mode="resultats" />
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
