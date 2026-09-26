import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Info } from 'lucide-react'
import { competitions, getCompetition, standingsFor, topScorersFor, topAssistsFor, refereesFor, matches, players, getClubById, realLigue1Matches, realLigue1Standings, realLigue1TopScorers } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { CompetitionTabs } from '@/components/site/CompetitionTabs'
import { DemoBadge } from '@/components/site/DemoBadge'
import { RankingTable } from '@/components/site/widgets'
import { formatDateLong } from '@/lib/format'

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
  const officiatingReferees = refereesFor(competition.id)
  const compPlayers = competition.clubIds.flatMap((id) => players.filter((p) => p.clubId === id))
  const realMatches = competition.id === 'comp-l1' ? realLigue1Matches : []
  const realStandings = competition.id === 'comp-l1' ? realLigue1Standings() : []
  const realScorers = competition.id === 'comp-l1' ? realLigue1TopScorers() : []

  return (
    <main>
      <PageHero
        eyebrow={competition.practice ? `${competition.category} · Football ${competition.practice.toLowerCase()}` : competition.category}
        title={competition.name}
        subtitle={`Saison ${competition.season} · ${competition.format} · ${competition.clubIds.length} équipes engagées.`}
        breadcrumb={[{ label: 'Compétitions', href: '/competitions' }, { label: competition.name }]}
        meta={[
          { value: String(competition.clubIds.length), label: 'Équipes' },
          { value: String(compMatches.length), label: 'Matchs cette saison' },
        ]}
      />

      {realMatches.length > 0 && (
        <section className="page-section tight dark-section">
          <p className="section-tag" style={{ color: 'var(--orange)' }}>Résultats réels — Journée {realMatches[realMatches.length - 1].matchday}</p>
          <div className="card-grid cols-2" style={{ marginTop: 16 }}>
            {realMatches.map((m) => (
              <Link key={m.slug} href={`/competitions/ligue-1/matchs/${m.slug}`} className="next-card" style={{ background: '#fff', display: 'block' }}>
                <div className="next-card-top"><span>J{m.matchday}</span><span>{formatDateLong(m.date).toUpperCase()}</span></div>
                <div className="teams">
                  <div className="team"><strong>{m.homeClub}</strong></div>
                  <div className="versus"><small>TERMINÉ</small><b style={{ fontSize: 22 }}>{m.homeScore} - {m.awayScore}</b></div>
                  <div className="team"><strong>{m.awayClub}</strong></div>
                </div>
                {m.events.length > 0 && (
                  <p className="lede" style={{ fontSize: 12, marginTop: 8, textAlign: 'center' }}>
                    {m.events.map((e) => `⚽ ${e.player ?? '?'} (${e.minute}')`).join(' · ')}
                  </p>
                )}
                <p className="text-link" style={{ justifyContent: 'center', marginTop: 8 }}>Détails du match</p>
              </Link>
            ))}
          </div>
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
          </div>
          <p className="press-source-note" style={{ color: '#cfe0d6', marginTop: 20 }}><Info size={13} /> Résultats réels de la Ligue 1 LONACI, confirmés par la presse ivoirienne et ajoutés au fil des journées. Le reste de cette page (calendrier complet, classement général, statistiques) reste une saison de démonstration générée.</p>
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
        />
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
