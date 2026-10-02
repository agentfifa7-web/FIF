import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Globe, Info, MapPin, Shield, Trophy, User } from 'lucide-react'
import { clubs, getClub, getStadiumById, cityName, players, coaches, competitions, standingsFor, realLeagueMatchesForClub, realLigue1Standings, realLigue1UpcomingFixtures } from '@/lib/data/mock'
import { HeroCarousel } from '@/components/site/PageHero'
import { ClubCrest, PlayerCard } from '@/components/site/cards'
import { MatchdayList } from '@/components/site/MatchdayList'

const POSITION_GROUPS = [
  { position: 'Gardien', label: 'Gardiens' },
  { position: 'Défenseur', label: 'Défenseurs' },
  { position: 'Milieu', label: 'Milieux' },
  { position: 'Attaquant', label: 'Attaquants' },
] as const

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

  const stadium = club.stadiumId ? getStadiumById(club.stadiumId) : undefined
  const roster = players.filter((p) => p.clubId === club.id)
  const hasRealRoster = roster.some((p) => p.realRoster)
  const coach = coaches.find((c) => c.clubId === club.id)
  const clubCompetitions = club.competitionIds
    .map((id) => competitions.find((c) => c.id === id))
    .filter((c) => c !== undefined)
    .map((comp) => {
      const standings = comp.id === 'comp-l1'
        ? realLigue1Standings()
        : comp.id === 'comp-l2' && club.group ? standingsFor(comp.id, club.group) : standingsFor(comp.id)
      const idx = standings.findIndex((r) => r.clubId === club.id)
      const row = idx >= 0 ? standings[idx] : undefined
      // Une position n'a de sens que si des matchs ont réellement été joués :
      // sinon (classement fictif à zéro, ou club pas encore apparu au réel),
      // on affiche « Classement à venir » plutôt qu'un rang trompeur.
      const position = row && row.played > 0 ? idx + 1 : null
      const label = comp.id === 'comp-l2' && club.group ? `${comp.name} — Poule ${club.group}` : comp.name
      return { comp, label, position, row }
    })
  const realResults = realLeagueMatchesForClub(club.name)
  const realUpcoming = realLigue1UpcomingFixtures.filter((f) => f.homeClub === club.name || f.awayClub === club.name)
  const isRealLigue1Club = club.competitionIds.includes('comp-l1')

  return (
    <main>
      <section className="page-hero tone-forest">
        <HeroCarousel seed={club.name} />
        <div className="page-hero-content">
          <div className="breadcrumb"><Link href="/">Accueil</Link><span>›</span><Link href="/clubs">Clubs</Link><span>›</span><b>{club.name}</b></div>
          <div style={{ alignItems: 'center', display: 'flex', gap: 24, marginTop: 8 }}>
            <ClubCrest club={club} size={80} />
            <div>
              <p className="eyebrow"><span /> {[club.group ? `Ligue 2 · Poule ${club.group}` : 'Ligue 1', cityName(club.cityId)].filter(Boolean).join(' · ')}</p>
              <h1 style={{ fontSize: 'clamp(30px,4vw,48px)' }}>{club.name}</h1>
            </div>
          </div>
          <div className="page-hero-meta">
            {club.founded && <div><strong>{club.founded}</strong><span>Fondation</span></div>}
            <div><strong>{roster.length}</strong><span>Joueurs enregistrés</span></div>
            {club.honours.length > 0 && <div><strong>{club.honours.reduce((a, h) => a + h.count, 0)}</strong><span>Titres</span></div>}
          </div>
        </div>
      </section>

      <section className="page-section tight">
        <div className="chip-row">
          {stadium ? (
            <Link href={`/stades/${stadium.slug}`} className="chip"><MapPin size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{stadium.name}</Link>
          ) : null}
          {club.president && <span className="chip"><User size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />Président : {club.president}</span>}
          {coach && <span className="chip"><Shield size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />Entraîneur : {coach.name}</span>}
          {club.website && <a href={club.website} target="_blank" rel="noopener noreferrer" className="chip"><Globe size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{club.website.replace(/^https?:\/\//, '')}</a>}
          {!stadium && !club.president && !coach && <span className="chip">Stade, président et staff : informations officielles à venir</span>}
        </div>
      </section>

      {realResults.length > 0 && (
        <section className="page-section tight dark-section">
          <p className="section-tag" style={{ color: 'var(--orange)' }}>Résultats réels</p>
          <div style={{ marginTop: 16 }}><MatchdayList results={realResults} /></div>
          <p className="press-source-note" style={{ color: '#cfe0d6', marginTop: 20 }}><Info size={13} /> Résultat réel confirmé par la presse ivoirienne (Ligue 1 LONACI 2026-2027).</p>
        </section>
      )}

      {isRealLigue1Club && (
        <section className="page-section tight">
          <p className="section-tag">Prochains matchs réels (Ligue 1)</p>
          {realUpcoming.length > 0 ? (
            <div style={{ marginTop: 16 }}><MatchdayList fixtures={realUpcoming} /></div>
          ) : (
            <p className="lede" style={{ marginTop: 16 }}>Aucune prochaine journée officiellement programmée pour l’instant. Cette section s’alimentera automatiquement dès que le calendrier sera annoncé.</p>
          )}
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
                  <span>{position ? `${position}${position === 1 ? 'ère' : 'e'} place` : 'Classement à venir'}{position && row ? ` · ${row.points} pts · ${row.played} matchs joués` : ''}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {hasRealRoster ? (
        <section className="page-section tight">
          <p className="section-tag">Effectif officiel — {roster.length} joueurs</p>
          {POSITION_GROUPS.map(({ position, label }) => {
            const group = roster.filter((p) => p.position === position).sort((a, b) => (a.squadNumber ?? 99) - (b.squadNumber ?? 99))
            if (!group.length) return null
            return (
              <div key={position} style={{ marginTop: 20 }}>
                <b style={{ fontSize: 12, letterSpacing: '.06em', color: 'var(--muted)', textTransform: 'uppercase' }}>{label} ({group.length})</b>
                <div className="card-grid cols-4" style={{ marginTop: 10 }}>
                  {group.map((p) => <PlayerCard key={p.id} player={p} />)}
                </div>
              </div>
            )
          })}
        </section>
      ) : (
        <section className="page-section tight">
          <p className="section-tag">Effectif</p>
          <p className="lede" style={{ marginTop: 12 }}>L’effectif officiel de {club.name} n’a pas encore été transmis à la FIF. Il apparaîtra ici dès sa publication.</p>
        </section>
      )}

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

    </main>
  )
}
