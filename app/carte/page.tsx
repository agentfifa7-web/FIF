import { clubs, stadiums, regions } from '@/lib/data/mock'
import { buildFootballMapZones } from '@/lib/data/ci-geo'
import { PageHero } from '@/components/site/PageHero'
import { ClubExplorer } from '@/components/site/ClubExplorer'
import { IvoryCoastMap } from '@/components/site/IvoryCoastMap'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Carte du football ivoirien — FIF Digital' }

export default function MapPage() {
  const zones = buildFootballMapZones()

  return (
    <main>
      <PageHero
        eyebrow="Carte interactive"
        title="Carte du football ivoirien"
        subtitle="Clubs, stades, districts et compétitions positionnés sur le territoire national. Cliquez sur un pôle pour découvrir ce qui s’y joue."
        breadcrumb={[{ label: 'Carte' }]}
        meta={[
          { value: String(clubs.length), label: 'Clubs' },
          { value: String(stadiums.length), label: 'Stades' },
          { value: String(regions.length), label: 'Districts' },
        ]}
      />

      <section className="page-section tight">
        <IvoryCoastMap zones={zones} />
      </section>

      <section className="page-section tight">
        <p className="section-tag">Explorateur de clubs</p>
        <ClubExplorer clubs={clubs} />
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
