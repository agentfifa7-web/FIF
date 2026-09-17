import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Globe, MapPin, Shield, Trophy, User } from 'lucide-react'
import { clubs, getClub, getStadiumById, cityName, players, matchesOf, getCoachById, coaches } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { ClubCrest, MatchCard, PlayerCard } from '@/components/site/cards'
import { DemoBadge } from '@/components/site/DemoBadge'

export function generateStaticParams() {
  return clubs.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const club = getClub(slug)
  return { title: club ? `${club.name} — FIF Digital` : 'Club' }
}

export default async function ClubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const club = getClub(slug)
  if (!club) notFound()

  const stadium = getStadiumById(club.stadiumId)
  const roster = players.filter((p) => p.clubId === club.id)
  const coach = coaches.find((c) => c.clubId === club.id)
  const clubMatches = matchesOf(club.id)
  const upcoming = clubMatches.filter((m) => m.status === 'À venir').slice(0, 4)
  const results = clubMatches.filter((m) => m.status === 'Terminé').slice(-4).reverse()

  return (
    <main>
      <section className="page-hero tone-forest">
        <div className="breadcrumb"><Link href="/">Accueil</Link><span>›</span><Link href="/clubs">Clubs</Link><span>›</span><b>{club.name}</b></div>
        <div style={{ alignItems: 'center', display: 'flex', gap: 24, marginTop: 8 }}>
          <ClubCrest club={club} size={80} />
          <div>
            <p className="eyebrow"><span /> {club.category} · {cityName(club.cityId)}</p>
            <h1 style={{ fontSize: 'clamp(30px,4vw,48px)' }}>{club.name}</h1>
          </div>
        </div>
        <div className="page-hero-meta">
          <div><strong>{club.founded}</strong><span>Fondation</span></div>
          <div><strong>{roster.length}</strong><span>Licenciés</span></div>
          <div><strong>{club.honours.reduce((a, h) => a + h.count, 0)}</strong><span>Titres</span></div>
        </div>
      </section>

      <section className="page-section tight">
        <div className="chip-row">
          <span className="chip"><MapPin size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{stadium?.name}</span>
          <span className="chip"><User size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />Président : {club.president}</span>
          {coach && <span className="chip"><Shield size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />Entraîneur : {coach.name}</span>}
          <span className="chip"><Globe size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{club.website}</span>
        </div>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Effectif — {roster.length} joueurs</p>
        <div className="card-grid cols-4" style={{ marginTop: 16 }}>
          {roster.slice(0, 12).map((p) => <PlayerCard key={p.id} player={p} />)}
        </div>
        {roster.length > 12 && <p className="lede" style={{ marginTop: 16 }}>+ {roster.length - 12} autres joueurs enregistrés.</p>}
      </section>

      <section className="page-section tight">
        <div className="page-section-head"><h2 style={{ fontSize: 24 }}>Prochains matchs</h2></div>
        <div className="card-grid cols-4">
          {upcoming.length ? upcoming.map((m) => <MatchCard key={m.id} match={m} />) : <p className="lede">Aucun match programmé pour le moment.</p>}
        </div>
      </section>

      <section className="page-section tight">
        <div className="page-section-head"><h2 style={{ fontSize: 24 }}>Derniers résultats</h2></div>
        <div className="card-grid cols-4">
          {results.length ? results.map((m) => <MatchCard key={m.id} match={m} />) : <p className="lede">Aucun résultat disponible.</p>}
        </div>
      </section>

      {club.honours.length > 0 && (
        <section className="page-section tight dark-section">
          <p className="section-tag" style={{ color: 'var(--orange)' }}>Palmarès</p>
          <div className="card-grid cols-2" style={{ marginTop: 16 }}>
            {club.honours.map((h, i) => (
              <div className="info-tile" key={i}><Trophy /><strong>{h.title}</strong><p>{h.count} fois</p></div>
            ))}
          </div>
        </section>
      )}

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
