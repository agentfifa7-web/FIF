import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Info } from 'lucide-react'
import { competitions, getCompetition, standingsFor, topScorersFor, topAssistsFor, refereesFor, matches, players, getClubById, realLigue1TopAssists, scorersFromMatches } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { CompetitionTabs } from '@/components/site/CompetitionTabs'
import { RankingTable } from '@/components/site/widgets'
import { MatchdayList } from '@/components/site/MatchdayList'
import { MatchdayPicker } from '@/components/site/MatchdayPicker'
import { SubNav } from '@/components/site/SubNav'
import { loadCms } from '@/lib/cms/server'

export async function generateStaticParams() {
  await loadCms()
  return competitions.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  await loadCms()
  const { slug } = await params
  const c = getCompetition(slug)
  return { title: c ? `${c.name} — FIF` : 'Compétition' }
}

export default async function CompetitionPage({ params }: { params: Promise<{ slug: string }> }) {
  await loadCms()
  const { slug } = await params
  const competition = getCompetition(slug)
  if (!competition) notFound()

  const standings = standingsFor(competition.id)
  const pouleKeys = competition.id === 'comp-l2' ? (['A', 'B'] as const) : competition.id === 'comp-d3' ? (['A', 'B', 'C', 'D'] as const) : null
  const poules = pouleKeys
    ? pouleKeys.map((g) => ({
      label: `Poule ${g}`,
      standings: standingsFor(competition.id, g),
      clubIds: competition.clubIds.filter((id) => getClubById(id)?.group === g),
    }))
    : undefined
  const compMatches = matches.filter((m) => m.competitionId === competition.id)
  const scorers = topScorersFor(competition.id)
  const assisters = topAssistsFor(competition.id)
  const officiatingReferees = competition.id === 'comp-l1' ? [] : refereesFor(competition.id)
  const isRealLigue1 = competition.id === 'comp-l1'
  const compPlayers = competition.clubIds.flatMap((id) => players.filter((p) => p.clubId === id))
  // Résultats, classement et buteurs calculés à partir des matchs officiels
  // (résultats confirmés et feuilles de match publiées), pour toutes les compétitions.
  const realMatches = compMatches.filter((m) => m.status === 'Terminé')
  const realStandingBlocks = poules
    ? poules.map((p) => ({ label: `Classement réel — ${p.label}`, rows: p.standings.filter((r) => r.played > 0) })).filter((b) => b.rows.length)
    : [{ label: 'Classement réel (clubs ayant déjà joué)', rows: standings.filter((r) => r.played > 0) }].filter((b) => b.rows.length)
  const realScorers = scorersFromMatches(competition.id)
  const realAssisters = realLigue1TopAssists(competition.id)
  const upcomingFixtures = compMatches.filter((m) => m.status !== 'Terminé')
  const byPoule = pouleKeys
    ? pouleKeys.map((g) => ({ group: g, matches: upcomingFixtures.filter((m) => getClubById(m.homeClubId)?.group === g) })).filter((p) => p.matches.length)
    : null

  const leader = (poules ? null : standings.filter((r) => r.played > 0)[0]) ?? null
  const leaderClub = leader ? getClubById(leader.clubId) : null
  const nextFixtures = upcomingFixtures.filter((m) => m.status !== 'Reporté').slice(0, 6)
  const sections = [
    realStandingBlocks.length ? { id: 'classement', label: 'Classement' } : null,
    realMatches.length ? { id: 'resultats', label: 'Résultats' } : null,
    upcomingFixtures.length || isRealLigue1 ? { id: 'calendrier', label: 'Calendrier' } : null,
    realScorers.length ? { id: 'statistiques', label: 'Statistiques' } : null,
    { id: 'infos', label: 'Clubs et infos' },
  ].filter(Boolean) as { id: string; label: string }[]

  return (
    <main>
      <PageHero
        eyebrow={competition.practice ? `${competition.category} · Football ${competition.practice.toLowerCase()}` : competition.category}
        title={competition.name}
        subtitle={`Saison ${competition.season} · ${competition.format}.${competition.clubIds.length ? '' : ' Clubs engagés et calendrier à publier par la FIF.'}`}
        breadcrumb={[{ label: 'Compétitions', href: '/competitions' }, { label: competition.name }]}
        meta={[
          { value: String(competition.clubIds.length || '—'), label: 'Équipes engagées' },
          { value: String(realMatches.length), label: 'Matchs joués' },
          ...(leaderClub ? [{ value: leaderClub.name, label: 'Leader' }] : []),
        ]}
      />
      <SubNav items={sections} />

      <section className="page-section">
        <div className="cp-layout">
          <div className="cp-main">
            {realStandingBlocks.length > 0 && (
              <div className="cp-block" id="classement">
                <div className="cp-block-head"><h2>Classement</h2><span>Calculé à partir des résultats officiels publiés</span></div>
                <div className={realStandingBlocks.length > 1 ? 'cp-poules' : undefined}>
                  {realStandingBlocks.map((b) => (
                    <div key={b.label}>
                      {realStandingBlocks.length > 1 && <h3>{b.label.replace('Classement réel — ', '')}</h3>}
                      <RankingTable rows={b.rows} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {realMatches.length > 0 && (
              <div className="cp-block" id="resultats">
                <div className="cp-block-head"><h2>Résultats</h2><span>« à conf. » : score relayé par une seule source</span></div>
                <MatchdayPicker matches={realMatches} mode="results" />
              </div>
            )}

            {(isRealLigue1 || upcomingFixtures.length > 0) && (
              <div className="cp-block" id="calendrier">
                <div className="cp-block-head"><h2>Calendrier</h2><Link className="text-link" href="/matches">Tous les matchs</Link></div>
                {byPoule ? (
                  <div className="cp-poules">
                    {byPoule.map((p) => (
                      <div key={p.group}><h3>Poule {p.group}</h3><MatchdayList matches={p.matches} mode="fixtures" /></div>
                    ))}
                  </div>
                ) : upcomingFixtures.length > 0 ? (
                  <MatchdayList matches={upcomingFixtures} mode="fixtures" />
                ) : (
                  <div className="empty-state"><strong>Prochaine journée à venir</strong><span>Le programme s’affichera dès son annonce officielle.</span></div>
                )}
              </div>
            )}

            {realScorers.length > 0 && (
              <div className="cp-block" id="statistiques">
                <div className="cp-block-head"><h2>Statistiques</h2><span>Buts et passes décisives confirmés</span></div>
                <div className="card-grid cols-2" style={{ alignItems: 'start' }}>
                  <div className="table-wrap">
                    <table className="data-table">
                      <caption className="sr-only">Meilleurs buteurs</caption>
                      <thead><tr><th>#</th><th className="align-left">Buteur</th><th className="align-left">Club</th><th>Buts</th></tr></thead>
                      <tbody>
                        {realScorers.slice(0, 15).map((s, i) => (
                          <tr key={`${s.player}-${s.club}`}>
                            <td>{i + 1}</td>
                            <td className="align-left">{s.slug ? <Link href={`/joueurs/${s.slug}`}>{s.player}</Link> : s.player}</td>
                            <td className="align-left">{s.club}</td>
                            <td><b>{s.goals}</b></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="table-wrap">
                    <table className="data-table">
                      <caption className="sr-only">Meilleurs passeurs</caption>
                      <thead><tr><th>#</th><th className="align-left">Passeur</th><th className="align-left">Club</th><th>Passes</th></tr></thead>
                      <tbody>
                        {realAssisters.map((s, i) => (
                          <tr key={`${s.player}-${s.club}`}><td>{i + 1}</td><td className="align-left">{s.player}</td><td className="align-left">{s.club}</td><td><b>{s.assists}</b></td></tr>
                        ))}
                        {!realAssisters.length && <tr><td colSpan={4} className="align-left muted">Aucune passe décisive confirmée pour l’instant.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {realMatches.length === 0 && !upcomingFixtures.length && !isRealLigue1 && (
              <div className="empty-state">
                <strong>Saison {competition.season} en préparation</strong>
                <span>La liste des clubs engagés, le calendrier et les résultats seront publiés ici dès leur annonce officielle par la FIF.</span>
              </div>
            )}

            <div className="cp-block" id="infos">
              <div className="cp-block-head"><h2>Clubs et informations</h2></div>
              <CompetitionTabs
                competition={competition}
                standings={standings}
                poules={poules}
                scorers={scorers}
                assisters={assisters}
                officiatingReferees={officiatingReferees}
                compPlayers={compPlayers}
                allMatches={compMatches}
                hideGeneratedTabs
                realOverview={{ matchesPlayed: realMatches.length, topScorerGoals: realScorers[0]?.goals ?? 0 }}
              />
            </div>
          </div>

          <aside className="cp-aside" aria-label="En bref">
            {nextFixtures.length > 0 && (
              <div className="cp-card">
                <h3>Prochains matchs</h3>
                <ul className="cp-mini">
                  {nextFixtures.map((m) => (
                    <li key={m.id}>
                      <span>J{m.matchday}</span>
                      <Link href={m.detailHref ?? `/matches/${m.id}`}>{getClubById(m.homeClubId)?.name} – {getClubById(m.awayClubId)?.name}<small>{m.dateConfirmed === false ? 'Date à confirmer' : new Date(m.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })}</small></Link>
                      <span />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {realScorers.length > 0 && (
              <div className="cp-card">
                <h3>Meilleurs buteurs</h3>
                <ul className="cp-mini">
                  {realScorers.slice(0, 5).map((s, i) => (
                    <li key={`${s.player}-${s.club}`}><span>{i + 1}</span><span>{s.slug ? <Link href={`/joueurs/${s.slug}`}>{s.player}</Link> : s.player}<small>{s.club}</small></span><b>{s.goals}</b></li>
                  ))}
                </ul>
              </div>
            )}
            <div className="cp-card">
              <h3>En bref</h3>
              <dl className="cp-facts">
                <div><dt>Saison</dt><dd>{competition.season}</dd></div>
                <div><dt>Format</dt><dd>{competition.format}</dd></div>
                <div><dt>Équipes</dt><dd>{competition.clubIds.length ? `${competition.clubIds.length} clubs` : 'À publier'}</dd></div>
              </dl>
              <p className="cp-note"><Info size={14} aria-hidden /> Résultats confirmés par la presse ivoirienne ou publiés par feuille de match officielle.</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
