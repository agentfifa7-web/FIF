import { matches } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { MatchExplorer } from '@/components/site/MatchExplorer'
import { loadCms } from '@/lib/cms/server'

export const metadata = { title: 'Calendrier des matchs — FIF Digital' }

export default async function MatchesPage() {
  await loadCms()
  return (
    <main>
      <PageHero
        eyebrow="Match Center"
        title="Calendrier des matchs"
        subtitle="Les prochains matchs officiels du football ivoirien. Seules les affiches confirmées par la FIF sont publiées ; dates, heures et stades s’affichent dès leur annonce."
        breadcrumb={[{ label: 'Calendrier' }]}
        meta={[{ value: String(matches.filter((m) => m.status !== 'Terminé').length), label: 'Matchs officiels à venir' }]}
      />
      <section className="page-section tight">
        <MatchExplorer matches={matches} mode="calendrier" />
      </section>
    </main>
  )
}
