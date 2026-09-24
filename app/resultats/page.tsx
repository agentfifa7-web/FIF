import { matches } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { MatchExplorer } from '@/components/site/MatchExplorer'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Résultats — FIF Digital' }

export default function ResultsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Match Center"
        title="Résultats"
        subtitle="Tous les résultats de la saison, compétition par compétition — mis à jour automatiquement dès le coup d’envoi réel de chaque match."
        breadcrumb={[{ label: 'Résultats' }]}
      />
      <section className="page-section tight">
        <MatchExplorer matches={matches} mode="resultats" />
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
