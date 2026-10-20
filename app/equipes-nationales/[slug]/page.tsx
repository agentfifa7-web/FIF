import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarDays, MapPin, Trophy } from 'lucide-react'
import {
  getTeam, nationalTeams, nationalSquads, getPlayerById, getCoachById, nextFixtureFor, lastResultsFor, getStadiumById, getClubById,
  elephantsCoach, elephantsCallUp, elephantsCallUpDate, elephantsFixtures, elephantsFlag, elephantsNextWindow, nationalTeamNextWindow,
} from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { SubNav } from '@/components/site/SubNav'
import { ClubCrest } from '@/components/site/cards'
import { PlayerPhoto } from '@/components/site/PlayerPhoto'
import { formatDate, formatDateLong, formatTime, age } from '@/lib/format'
import { loadCms } from '@/lib/cms/server'

const callUpPositionOrder = ['Gardien', 'Défenseur', 'Milieu', 'Attaquant'] as const

export async function generateStaticParams() {
  await loadCms()
  return nationalTeams.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  await loadCms()
  const { slug } = await params
  const team = getTeam(slug)
  return { title: team ? `${team.name} — FIF Digital` : 'Équipe nationale' }
}

const positionOrder = ['Gardien', 'Défenseur', 'Milieu', 'Attaquant'] as const

export default async function NationalTeamPage({ params }: { params: Promise<{ slug: string }> }) {
  await loadCms()
  const { slug } = await params
  const team = getTeam(slug)
  if (!team) notFound()
  const isElephants = team.slug === 'elephants'
  const squad = nationalSquads[team.id] ?? []
  const coach = team.coachId ? getCoachById(team.coachId) : null
  const fixture = nextFixtureFor(team.id)
  const fixtureStadium = fixture?.stadiumId ? getStadiumById(fixture.stadiumId) : null
  const lastResult = lastResultsFor(team.id)[0]

  const squadByPosition = positionOrder.map((pos) => ({
    position: pos,
    entries: squad
      .map((s) => ({ ...s, player: getPlayerById(s.playerId) }))
      .filter((s) => s.player && s.player.position === pos),
  }))

  const callUpByPosition = callUpPositionOrder.map((pos) => ({
    position: pos,
    entries: elephantsCallUp.filter((p) => p.position === pos),
  }))

  const windowNext = isElephants
    ? (elephantsNextWindow ? { opponent: elephantsNextWindow.opponent, competition: elephantsNextWindow.competition, period: elephantsNextWindow.period } : null)
    : nationalTeamNextWindow[team.id] ? { opponent: nationalTeamNextWindow[team.id].split(' — ')[0], competition: nationalTeamNextWindow[team.id].split(' — ')[1]?.split(' (')[0] ?? '', period: nationalTeamNextWindow[team.id].match(/\(([^)]+)\)/)?.[1] ?? '' } : null
  const hasMatches = isElephants || fixture || lastResult || windowNext
  const hasSquad = isElephants || squad.length > 0
  const sections = [
    hasMatches ? { id: 'matchs', label: 'Matchs' } : null,
    { id: 'effectif', label: 'Effectif' },
    team.honours.length ? { id: 'palmares', label: 'Palmarès' } : null,
  ].filter(Boolean) as { id: string; label: string }[]

  return (
    <main>
      <PageHero
        eyebrow={team.category === 'A' ? (team.gender === 'F' ? 'Équipe A féminine' : 'Équipe A masculine') : `Sélection ${team.category}`}
        title={team.name}
        subtitle={`Sélectionneur : ${isElephants ? elephantsCoach : (coach?.name ?? 'à confirmer')}${team.ranking ? ` · ${team.ranking}ᵉ au classement FIFA` : ''}`}
        breadcrumb={[{ label: 'Équipes nationales', href: '/equipes-nationales' }, { label: team.name }]}
        meta={[
          ...(team.ranking ? [{ value: `${team.ranking}ᵉ`, label: 'Classement FIFA' }] : []),
          { value: String(isElephants ? elephantsCallUp.length : squad.length || '—'), label: 'Joueurs convoqués' },
          { value: String(team.honours.length), label: 'Titres majeurs' },
        ]}
      />
      <SubNav items={sections} />

      {hasMatches && (
        <section className="page-section" id="matchs">
          <h2>Matchs</h2>
          {windowNext && !fixture && (
            <div className="fx-next">
              <span className="h-kicker">Prochain rendez-vous</span>
              <strong>Côte d’Ivoire – {windowNext.opponent}</strong>
              <span>{windowNext.competition}{windowNext.period ? ` · ${windowNext.period}` : ''}</span>
              <small>Date, heure et stade publiés dès leur annonce officielle.</small>
            </div>
          )}
          {isElephants ? (
            <>
              <h3 className="fx-group-title">Fenêtre internationale septembre-octobre 2026</h3>
              <div className="fx-grid">
                {elephantsFixtures.map((f) => (
                  <Link href={`/equipes-nationales/elephants/matchs/${f.slug}`} className="fx-card" key={f.slug}>
                    <span className="fx-comp">{f.competition}</span>
                    <div className="fx-teams">
                      <span className="fx-side"><span className="fx-flag">{elephantsFlag}</span>Côte d’Ivoire</span>
                      <b className="fx-score">{f.result ? `${f.result.civScore} – ${f.result.opponentScore}` : 'VS'}</b>
                      <span className="fx-side"><span className="fx-flag">{f.opponentFlag}</span>{f.opponent}</span>
                    </div>
                    <span className="fx-meta"><CalendarDays size={15} aria-hidden /> {formatDate(f.date)}{f.result ? ' · Terminé' : ` · ${f.time}`}</span>
                    <span className="fx-meta"><MapPin size={15} aria-hidden /> {f.venue}</span>
                    <span className="text-link">{f.result ? 'Résumé et feuille de match' : 'Billets et informations'}</span>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="fx-grid">
              {lastResult?.result && (
                <div className="fx-card">
                  <span className="fx-comp">Dernier résultat · {lastResult.competition}</span>
                  <div className="fx-teams">
                    <span className="fx-side"><span className="fx-flag">🇨🇮</span>Côte d’Ivoire</span>
                    <b className="fx-score">{lastResult.result.civ} – {lastResult.result.opp}</b>
                    <span className="fx-side"><span className="fx-flag fx-flag-text">{lastResult.opponent.slice(0, 3).toUpperCase()}</span>{lastResult.opponent}</span>
                  </div>
                  {lastResult.result.confirmed === false && <span className="badge badge-orange">Score à confirmer</span>}
                  <span className="fx-meta"><CalendarDays size={15} aria-hidden /> {formatDate(lastResult.date)} · {lastResult.home ? 'Domicile' : 'Extérieur'}</span>
                  <span className="fx-meta"><MapPin size={15} aria-hidden /> {lastResult.venue ?? getStadiumById(lastResult.stadiumId ?? '')?.name}</span>
                  {lastResult.result.scorers && <p className="fx-scorers">Buts : {lastResult.result.scorers}</p>}
                </div>
              )}
              {fixture && (
                <div className="fx-card">
                  <span className="fx-comp">Prochain match · {fixture.competition}</span>
                  <div className="fx-teams">
                    <span className="fx-side"><span className="fx-flag">🇨🇮</span>Côte d’Ivoire</span>
                    <b className="fx-score">VS</b>
                    <span className="fx-side"><span className="fx-flag fx-flag-text">{fixture.opponent.slice(0, 3).toUpperCase()}</span>{fixture.opponent}</span>
                  </div>
                  <span className="fx-meta"><CalendarDays size={15} aria-hidden /> {formatDate(fixture.date)} · {fixture.timeConfirmed === false ? 'heure à confirmer' : formatTime(fixture.date)}</span>
                  <span className="fx-meta"><MapPin size={15} aria-hidden /> {fixtureStadium?.name ?? fixture.venue} · {fixture.home ? 'Domicile' : 'Extérieur'}</span>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      <section className={hasMatches ? 'page-section section-alt' : 'page-section'} id="effectif">
        <h2>Effectif</h2>
        {isElephants ? (
          <>
            <p className="lede">Liste communiquée par Hervé Renard le {formatDateLong(elephantsCallUpDate)}.</p>
            {callUpByPosition.map((group) => (
              <div key={group.position} className="sq-group">
                <h3>{group.position}s <span>{group.entries.length}</span></h3>
                <div className="card-grid cols-4">
                  {group.entries.map((p, i) => (
                    <Link key={i} href={`/equipes-nationales/elephants/${p.slug}`} className="entity-card player-card">
                      <span className="avatar-wrap"><PlayerPhoto name={p.name} photoUrl={p.photoUrl} size={52} background="var(--forest)" /></span>
                      <div>
                        <strong>{p.name}</strong>
                        <span>{p.flag} {p.club}</span>
                        {p.note && <span style={{ color: 'var(--fif-orange-text)' }}>{p.note}</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : !hasSquad ? (
          <div className="empty-state" style={{ marginTop: 16 }}>
            <strong>Liste des joueurs convoqués à venir</strong>
            <span>Elle apparaîtra ici dès sa publication officielle par la FIF — aucun joueur fictif n’est affiché.</span>
          </div>
        ) : (
          squadByPosition.map((group) => (
            <div key={group.position} className="sq-group">
              <h3>{group.position}s <span>{group.entries.length}</span></h3>
              <div className="card-grid cols-4">
                {group.entries.map(({ player, caps, goals }) => {
                  if (!player) return null
                  const club = getClubById(player.clubId)
                  return (
                    <Link key={player.id} href={`/joueurs/${player.slug}`} className="entity-card player-card">
                      <span className="avatar-wrap">
                        <span className="avatar" style={{ background: club?.colors[0] }}>{player.name.split(' ').map((n) => n[0]).join('')}</span>
                        {club && <span className="avatar-crest-badge avatar-crest-badge-sm"><ClubCrest club={club} size={16} /></span>}
                      </span>
                      <div>
                        <strong>{player.name}</strong>
                        <span>{player.birthdate ? `${age(player.birthdate)} ans · ` : ''}{caps} sél. · {goals} buts</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </section>

      {team.honours.length > 0 && (
        <section className="page-section" id="palmares">
          <h2>Palmarès</h2>
          <ul className="honours">
            {team.honours.map((h, i) => (
              <li key={i}><Trophy aria-hidden /><div><strong>{h.title}</strong><span>{h.year}</span></div></li>
            ))}
          </ul>
          <Link className="text-link" href="/palmares">Palmarès complet du football ivoirien</Link>
        </section>
      )}
    </main>
  )
}
