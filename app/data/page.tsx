import Link from 'next/link'
import { clubs, players, matches, competitions, topScorersFor } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { StatCard } from '@/components/site/cards'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'FIF Data Center' }

export default function DataCenterPage() {
  const totalGoals = matches.reduce((sum, m) => sum + (m.homeScore ?? 0) + (m.awayScore ?? 0), 0)
  const totalCards = matches.reduce((sum, m) => sum + m.events.filter((e) => e.type === 'yellow' || e.type === 'red').length, 0)
  const ligue1Scorers = topScorersFor('comp-l1').slice(0, 5)

  return (
    <main>
      <PageHero
        eyebrow="FIF Data Center"
        title="Data"
        subtitle="Le centre de données du football ivoirien : clubs, joueurs, compétitions, buts, cartons, performances."
        breadcrumb={[{ label: 'Data' }]}
      />

      <section className="page-section tight">
        <div className="card-grid cols-4">
          <StatCard label="Clubs affiliés" value={clubs.length} />
          <StatCard label="Joueurs licenciés" value={players.length} />
          <StatCard label="Compétitions" value={competitions.length} />
          <StatCard label="Matchs (saison)" value={matches.length} />
          <StatCard label="Buts marqués" value={totalGoals} />
          <StatCard label="Cartons distribués" value={totalCards} />
          <StatCard label="Moyenne de buts / match" value={(totalGoals / Math.max(1, matches.filter((m) => m.status === 'Terminé').length)).toFixed(2)} />
          <StatCard label="Arbitres actifs" value={players.filter((p) => p.licenseStatus === 'Valide').length} hint="Licences joueurs valides" />
        </div>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Top buteurs — Ligue 1</p>
        <div className="table-wrap" style={{ marginTop: 16 }}>
          <table className="data-table">
            <thead><tr><th>POS</th><th className="align-left">JOUEUR</th><th>BUTS</th></tr></thead>
            <tbody>
              {ligue1Scorers.map((s, i) => (
                <tr key={s.player.id}><td>{i + 1}</td><td className="align-left"><Link href={`/joueurs/${s.player.slug}`}>{s.player.name}</Link></td><td><b>{s.goals}</b></td></tr>
              ))}
              {!ligue1Scorers.length && <tr><td colSpan={3}>Aucune donnée disponible.</td></tr>}
            </tbody>
          </table>
        </div>
        <Link href="/competitions/ligue-1" className="text-link" style={{ marginTop: 16, display: 'inline-flex' }}>Voir la Ligue 1 en détail →</Link>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
