import { notFound } from 'next/navigation'
import { Info } from 'lucide-react'
import { competitions, getCompetition, standingsFor, topScorersFor, topAssistsFor, refereesFor, matches, players, getClubById, realLigue1Matches, realLigue1Standings, realLigue1TopScorers, realLigue1TopAssists, realLigue1UpcomingFixtures } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { CompetitionTabs } from '@/components/site/CompetitionTabs'
import { RankingTable } from '@/components/site/widgets'
import { MatchdayList } from '@/components/site/MatchdayList'

export function generateStaticParams() {
  return competitions.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = getCompetition(slug)
  return { title: c ? `${c.name} — FIF Digital` : 'Compétition' }
}

export default async function CompetitionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const competition = getCompetition(slug)
  if (!competition) notFound()

  const standings = standingsFor(competition.id)
  const poules = competition.id === 'comp-l2'
    ? (['A', 'B'] as const).map((g) => ({
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
  const compPlayers = isRealLigue1
    ? competition.clubIds.flatMap((id) => players.filter((p) => p.clubId === id && p.realRoster))
    : competition.clubIds.flatMap((id) => players.filter((p) => p.clubId === id))
  const realMatches = isRealLigue1 ? realLigue1Matches : []
  const realStandings = isRealLigue1 ? realLigue1Standings() : []
  const realScorers = isRealLigue1 ? realLigue1TopScorers() : []
  const realAssisters = isRealLigue1 ? realLigue1TopAssists() : []
  const upcomingFixtures = isRealLigue1 ? realLigue1UpcomingFixtures : []

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
          <div style={{ marginTop: 16 }}><MatchdayList results={realMatches} /></div>
          <div className="card-grid cols-2" style={{ marginTop: 24, alignItems: 'start' }}>
            {realStandings.length > 0 && (
              <div>
                <b style={{ fontSize: 12, letterSpacing: '.06em', color: '#8fa79a', textTransform: 'uppercase' }}>Classement réel (clubs ayant déjà joué)</b>
                <div style={{ marginTop: 10 }}><RankingTable rows={realStandings} /></div>
              </div>
            )}
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
                          <td className="align-left">{s.player}</td>
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
          <p className="press-source-note" style={{ color: '#cfe0d6', marginTop: 20 }}><Info size={13} /> Résultats réels de la Ligue 1 LONACI, confirmés par la presse ivoirienne et ajoutés au fil des journées.</p>
        </section>
      )}

      {isRealLigue1 && (
        <section className="page-section tight">
          <p className="section-tag">Prochains matchs réels</p>
          {upcomingFixtures.length > 0 ? (
            <div style={{ marginTop: 16 }}><MatchdayList fixtures={upcomingFixtures} /></div>
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
          realOverview={competition.id === 'comp-l1' ? { matchesPlayed: realMatches.length, topScorerGoals: realScorers[0]?.goals ?? 0 } : undefined}
        />
      </section>
    </main>
  )
}
