import { clubs, stadiums, cities, regions, competitions } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { ClubExplorer } from '@/components/site/ClubExplorer'
import { IvoryCoastMap, type MapZone } from '@/components/site/IvoryCoastMap'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Carte du football ivoirien — FIF Digital' }

const CITY_COORDS: Record<string, { x: number; y: number }> = {
  'c-abidjan': { x: 339, y: 414 },
  'c-yamoussoukro': { x: 246, y: 302 },
  'c-bouake': { x: 265, y: 236 },
  'c-daloa': { x: 160, y: 298 },
  'c-korhogo': { x: 220, y: 101 },
  'c-man': { x: 78, y: 257 },
  'c-gagnoa': { x: 197, y: 354 },
  'c-abengourou': { x: 379, y: 308 },
  'c-bondoukou': { x: 430, y: 209 },
  'c-san-pedro': { x: 148, y: 458 },
}

function buildZones(): MapZone[] {
  return cities.map((city) => {
    const coords = CITY_COORDS[city.id] ?? { x: 230, y: 250 }
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
