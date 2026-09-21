import { notFound } from 'next/navigation'
import { CalendarDays, DoorOpen, Lightbulb, MapPin, Sprout, Users, Video } from 'lucide-react'
import { stadiums, getStadium, cityName, getCity, getRegion, clubs, matches } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { MatchCard } from '@/components/site/cards'
import { DemoBadge } from '@/components/site/DemoBadge'

export function generateStaticParams() {
  return stadiums.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = getStadium(slug)
  return { title: s ? `${s.name} — FIF Digital` : 'Stade' }
}

export default async function StadiumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const stadium = getStadium(slug)
  if (!stadium) notFound()
  const city = getCity(stadium.cityId)
  const region = city ? getRegion(city.regionId) : undefined
  const residentClubs = clubs.filter((c) => c.stadiumId === stadium.id)
  const upcoming = matches.filter((m) => m.stadiumId === stadium.id && m.status === 'À venir').slice(0, 4)

  return (
    <main>
      <PageHero
        eyebrow={cityName(stadium.cityId)}
        title={stadium.name}
        subtitle={`Surface : ${stadium.surface} · Éclairage : ${stadium.lighting ? 'oui' : 'non'} · ${stadium.changingRooms} vestiaires.`}
        breadcrumb={[{ label: 'Stades', href: '/stades' }, { label: stadium.name }]}
        meta={[{ value: stadium.capacity.toLocaleString('fr-FR'), label: 'Places' }]}
      />

      <section className="page-section tight">
        <p className="section-tag">Fiche d’infrastructure</p>
        <div className="info-tiles">
          <div className="info-tile">
            <MapPin />
            <strong>Localisation</strong>
            <p>{cityName(stadium.cityId)}{region ? `, région ${region.name}` : ''}, Côte d’Ivoire</p>
          </div>
          <div className="info-tile">
            <Users />
            <strong>Capacité d’accueil</strong>
            <p>{stadium.capacity.toLocaleString('fr-FR')} places assises</p>
          </div>
          <div className="info-tile">
            <CalendarDays />
            <strong>Année de création</strong>
            <p>Construit en {stadium.built}</p>
          </div>
          <div className="info-tile">
            <Sprout />
            <strong>Type de pelouse</strong>
            <p>{stadium.surface}</p>
          </div>
          <div className="info-tile">
            <Lightbulb />
            <strong>Éclairage</strong>
            <p>{stadium.lighting ? 'Éclairage homologué pour les matchs en nocturne' : 'Pas d’éclairage homologué'}</p>
          </div>
          <div className="info-tile">
            <DoorOpen />
            <strong>Vestiaires</strong>
            <p>{stadium.changingRooms} vestiaires équipés</p>
          </div>
        </div>
        {stadium.video360Url ? (
          <div className="sim-panel" style={{ marginLeft: 0, marginRight: 0 }}>
            <p><Video size={15} /> Visite virtuelle 360° disponible (démonstration — {stadium.video360Url})</p>
          </div>
        ) : (
          <p className="lede" style={{ marginTop: 20 }}>Aucune vidéo 360° disponible pour ce stade pour l’instant.</p>
        )}
      </section>

      {residentClubs.length > 0 && (
        <section className="page-section tight">
          <p className="section-tag">Club(s) résident(s)</p>
          <div className="card-grid cols-2" style={{ marginTop: 16 }}>
            {residentClubs.map((c) => <a key={c.id} href={`/clubs/${c.slug}`} className="entity-card"><div><strong>{c.name}</strong></div></a>)}
          </div>
        </section>
      )}
      <section className="page-section tight">
        <p className="section-tag">Prochains matchs</p>
        <div className="card-grid cols-4" style={{ marginTop: 16 }}>
          {upcoming.length ? upcoming.map((m) => <MatchCard key={m.id} match={m} />) : <p className="lede">Aucun match programmé dans ce stade pour l’instant.</p>}
        </div>
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
