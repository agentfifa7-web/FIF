import { clubs, academies, stadiums } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { ClubExplorer } from '@/components/site/ClubExplorer'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Carte du football ivoirien — FIF Digital' }

export default function MapPage() {
  return (
    <main>
      <PageHero
        eyebrow="Carte interactive"
        title="Carte du football ivoirien"
        subtitle="Clubs, académies, stades, ligues et districts sur tout le territoire national."
        breadcrumb={[{ label: 'Carte' }]}
        meta={[
          { value: String(clubs.length), label: 'Clubs' },
          { value: String(academies.length), label: 'Académies' },
          { value: String(stadiums.length), label: 'Stades' },
        ]}
      />
      <section className="page-section tight">
        <ClubExplorer clubs={clubs} />
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
