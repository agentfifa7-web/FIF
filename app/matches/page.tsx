import { matches } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { MatchExplorer } from '@/components/site/MatchExplorer'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Calendrier des matchs — FIF Digital' }

export default function MatchesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Match Center"
        title="Calendrier des matchs"
        subtitle="Tous les matchs à venir du football ivoirien : Ligue 1, Ligue 2, Coupe Nationale, championnats féminins et jeunes, futsal, beach soccer."
        breadcrumb={[{ label: 'Calendrier' }]}
        meta={[{ value: String(matches.length), label: 'Matchs programmés cette saison' }]}
      />
      <section className="page-section tight">
        <MatchExplorer matches={matches} mode="calendrier" />
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
