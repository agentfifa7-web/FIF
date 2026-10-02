import { matches } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { MatchExplorer } from '@/components/site/MatchExplorer'

export const metadata = { title: 'Résultats — FIF Digital' }

export default function ResultsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Match Center"
        title="Résultats"
        subtitle="Les résultats officiels de la saison 2026-2027, confirmés par la presse ivoirienne ou par la feuille de match publiée."
        breadcrumb={[{ label: 'Résultats' }]}
      />
      <section className="page-section tight">
        <MatchExplorer matches={matches} mode="resultats" />
      </section>
    </main>
  )
}
