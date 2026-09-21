import { clubs, stadiums, cities, regions, competitions } from '@/lib/data/mock'
import { CI_CITY_COORDS } from '@/lib/data/ci-geo'
import { PageHero } from '@/components/site/PageHero'
import { ClubExplorer } from '@/components/site/ClubExplorer'
import { IvoryCoastMap, type MapZone } from '@/components/site/IvoryCoastMap'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Carte du football ivoirien — FIF Digital' }

function buildZones(): MapZone[] {
  return cities.map((city) => {
    const coords = CI_CITY_COORDS[city.id] ?? { x: 230, y: 250 }
    const region = regions.find((r) => r.id === city.regionId)
    const cityClubs = clubs.filter((c) => c.cityId === city.id)
    const cityStadiums = stadiums.filter((s) => s.cityId === city.id)
    const competitionIds = new Set(cityClubs.flatMap((c) => c.competitionIds))
    const competitionNames = competitions.filter((c) => competitionIds.has(c.id)).map((c) => c.name)
    return {
      cityId: city.id,
      cityName: city.name,
      regionName: region?.name ?? city.name,
      x: coords.x,
      y: coords.y,
      clubs: cityClubs,
      stadiums: cityStadiums,
      competitionNames,
      proCount: cityClubs.filter((c) => c.category === 'Professionnel').length,
    }
  })
}

export default function MapPage() {
  const zones = buildZones()

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
