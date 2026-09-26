import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Globe, Info, MapPin, Shield, Trophy, User } from 'lucide-react'
import { clubs, getClub, getStadiumById, cityName, players, matchesOf, getCoachById, coaches, competitions, standingsFor, realLeagueMatchesForClub } from '@/lib/data/mock'
import { HeroCarousel } from '@/components/site/PageHero'
import { ClubCrest, MatchCard, PlayerCard } from '@/components/site/cards'
import { DemoBadge } from '@/components/site/DemoBadge'
import { formatDateLong } from '@/lib/format'

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
  const clubCompetitions = club.competitionIds
    .map((id) => competitions.find((c) => c.id === id))
    .filter((c) => c !== undefined)
    .map((comp) => {
      const standings = comp.id === 'comp-l2' && club.group ? standingsFor(comp.id, club.group) : standingsFor(comp.id)
      const position = standings.findIndex((r) => r.clubId === club.id) + 1
      const row = standings.find((r) => r.clubId === club.id)
      const label = comp.id === 'comp-l2' && club.group ? `${comp.name} — Poule ${club.group}` : comp.name
      return { comp, label, position: position || null, row }
    })
  const realResults = realLeagueMatchesForClub(club.name)

  return (
    <main>
      <section className="page-hero tone-forest">
        <HeroCarousel seed={club.name} />
        <div className="page-hero-content">
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
        </div>
      </section>

      <section className="page-section tight">
        <div className="chip-row">
          {stadium ? (
            <Link href={`/stades/${stadium.slug}`} className="chip"><MapPin size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{stadium.name}</Link>
          ) : null}
          <span className="chip"><User size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />Président : {club.president}</span>
          {coach && <span className="chip"><Shield size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />Entraîneur : {coach.name}</span>}
          <a href={`https://${club.website}`} target="_blank" rel="noopener noreferrer" className="chip"><Globe size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{club.website}</a>
        </div>
      </section>

      {realResults.length > 0 && (
        <section className="page-section tight dark-section">
          <p className="section-tag" style={{ color: 'var(--orange)' }}>Résultats réels</p>
          <div className="card-grid cols-2" style={{ marginTop: 16 }}>
            {realResults.map((m) => {
              const opponent = m.homeClub === club.name ? m.awayClub : m.homeClub
              const isHome = m.homeClub === club.name
              return (
                <div key={m.slug} className="info-tile">
                  <strong>J{m.matchday} · {isHome ? 'Domicile' : 'Extérieur'} vs {opponent}</strong>
                  <p>{m.homeClub} {m.homeScore} - {m.awayScore} {m.awayClub} · {formatDateLong(m.date)}</p>
                </div>
              )
            })}
          </div>
          <p className="press-source-note" style={{ color: '#cfe0d6', marginTop: 20 }}><Info size={13} /> Résultat réel confirmé par la presse ivoirienne (Ligue 1 LONACI 2026-2027).</p>
        </section>
      )}

      {clubCompetitions.length > 0 && (
        <section className="page-section tight">
          <p className="section-tag">Compétitions engagées & classement</p>
          <div className="card-grid cols-2" style={{ marginTop: 16 }}>
            {clubCompetitions.map(({ comp, label, position, row }) => (
              <Link href={`/competitions/${comp.slug}`} className="entity-card" key={comp.id}>
                <div>
                  <strong>{label}</strong>
                  <span>{position ? `${position}${position === 1 ? 'ère' : 'e'} place` : 'Classement à venir'}{row ? ` · ${row.points} pts · ${row.played} matchs joués` : ''}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

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
