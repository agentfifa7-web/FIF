import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Info } from 'lucide-react'
import { competitions, getCompetition, standingsFor, topScorersFor, topAssistsFor, refereesFor, matches, players, getClubById, realLigue1TopAssists, scorersFromMatches } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { CompetitionTabs } from '@/components/site/CompetitionTabs'
import { RankingTable } from '@/components/site/widgets'
import { MatchdayList } from '@/components/site/MatchdayList'
import { loadCms } from '@/lib/cms/server'

export async function generateStaticParams() {
  await loadCms()
  return competitions.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  await loadCms()
  const { slug } = await params
  const c = getCompetition(slug)
  return { title: c ? `${c.name} — FIF Digital` : 'Compétition' }
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

  return (
    <main>
      <PageHero
        eyebrow={competition.practice ? `${competition.category} · Football ${competition.practice.toLowerCase()}` : competition.category}
        title={competition.name}
        subtitle={`Saison ${competition.season} · ${competition.format} · ${competition.clubIds.length ? `${competition.clubIds.length} équipes engagées.` : 'Clubs engagés et calendrier à publier par la FIF.'}`}
        breadcrumb={[{ label: 'Compétitions', href: '/competitions' }, { label: competition.name }]}
        meta={[
          { value: String(competition.clubIds.length), label: 'Équipes' },
          { value: String(compMatches.length), label: 'Matchs officiels' },
        ]}
      />

      {realMatches.length > 0 && (
        <section className="page-section tight dark-section">
          <p className="section-tag" style={{ color: 'var(--orange)' }}>Résultats réels</p>
          <div style={{ marginTop: 16 }}><MatchdayList matches={realMatches} mode="results" /></div>
          <div className="card-grid cols-2" style={{ marginTop: 24, alignItems: 'start' }}>
            {realStandingBlocks.map((b) => (
              <div key={b.label}>
                <b style={{ fontSize: 12, letterSpacing: '.06em', color: '#8fa79a', textTransform: 'uppercase' }}>{b.label}</b>
                <div style={{ marginTop: 10 }}><RankingTable rows={b.rows} /></div>
              </div>
            ))}
            {realScorers.length > 0 && (
              <div>
                <b style={{ fontSize: 12, letterSpacing: '.06em', color: '#8fa79a', textTransform: 'uppercase' }}>Meilleurs buteurs réels</b>
                <div className="table-wrap" style={{ marginTop: 10 }}>
                  <table className="data-table">
                    <thead><tr><th>POS</th><th className="align-left">JOUEUR</th><th className="align-left">CLUB</th><th>BUTS</th></tr></thead>
                    <tbody>
                      {realScorers.map((s, i) => (
                        <tr key={`${s.player}-${s.club}`}>
                          <td>{i + 1}</td>
                          <td className="align-left">{s.slug ? <Link href={`/joueurs/${s.slug}`} style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>{s.player}</Link> : s.player}</td>
                          <td className="align-left">{s.club}</td>
                          <td>{s.goals}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div>
              <b style={{ fontSize: 12, letterSpacing: '.06em', color: '#8fa79a', textTransform: 'uppercase' }}>Meilleurs passeurs réels</b>
              <div className="table-wrap" style={{ marginTop: 10 }}>
                <table className="data-table">
                  <thead><tr><th>POS</th><th className="align-left">JOUEUR</th><th className="align-left">CLUB</th><th>PASSES D.</th></tr></thead>
                  <tbody>
                    {realAssisters.map((s, i) => (
                      <tr key={`${s.player}-${s.club}`}>
                        <td>{i + 1}</td>
                        <td className="align-left">{s.player}</td>
                        <td className="align-left">{s.club}</td>
                        <td>{s.assists}</td>
                      </tr>
                    ))}
                    {!realAssisters.length && <tr><td colSpan={4} style={{ color: '#8fa79a' }}>Aucune passe décisive confirmée pour l’instant.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <p className="press-source-note" style={{ color: '#cfe0d6', marginTop: 20 }}><Info size={13} /> Résultats réels de la compétition ({competition.name}), confirmés par la presse ivoirienne ou publiés par feuille de match, ajoutés au fil des journées.</p>
        </section>
      )}

      {(isRealLigue1 || upcomingFixtures.length > 0) && (
        <section className="page-section tight">
          <p className="section-tag">Prochains matchs</p>
          {byPoule ? (
            <div className="card-grid cols-2" style={{ marginTop: 16, alignItems: 'start' }}>
              {byPoule.map((p) => (
                <div key={p.group}>
                  <b style={{ fontSize: 12, letterSpacing: '.06em', color: 'var(--muted)', textTransform: 'uppercase' }}>Poule {p.group}</b>
                  <div style={{ marginTop: 10 }}><MatchdayList matches={p.matches} mode="fixtures" /></div>
                </div>
              ))}
            </div>
          ) : upcomingFixtures.length > 0 ? (
            <div style={{ marginTop: 16 }}><MatchdayList matches={upcomingFixtures} mode="fixtures" /></div>
          ) : (
            <p className="lede" style={{ marginTop: 16 }}>Aucune prochaine journée officiellement programmée pour l’instant. Cette section s’alimentera automatiquement dès que le calendrier sera annoncé.</p>
          )}
        </section>
      )}

      <section className="page-section tight">
        <CompetitionTabs
          competition={competition}
          standings={standings}
          poules={poules}
          scorers={scorers}
          assisters={assisters}
          officiatingReferees={officiatingReferees}
          compPlayers={compPlayers}
          allMatches={compMatches}
          hideGeneratedTabs={competition.id === 'comp-l1'}
          realOverview={{ matchesPlayed: realMatches.length, topScorerGoals: realScorers[0]?.goals ?? 0 }}
        />
      </section>
    </main>
  )
}
