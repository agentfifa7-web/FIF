import Link from 'next/link'
import { notFound } from 'next/navigation'
import { QrCode } from 'lucide-react'
import { players, getPlayer, getClubById, nationalTeams } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { StatCard } from '@/components/site/cards'
import { DemoBadge } from '@/components/site/DemoBadge'
import { age, formatDate } from '@/lib/format'

export function generateStaticParams() {
  return players.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const player = getPlayer(slug)
  return { title: player ? `${player.name} — FIF Digital` : 'Joueur' }
}

const statusTone: Record<string, string> = { Valide: 'ok', 'En attente': 'pending', Expirée: 'error' }

export default async function PlayerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const player = getPlayer(slug)
  if (!player) notFound()
  const club = getClubById(player.clubId)

  return (
    <main>
      <section className="page-hero tone-forest">
        <div className="breadcrumb"><Link href="/">Accueil</Link><span>›</span><Link href="/joueurs">Joueurs</Link><span>›</span><b>{player.name}</b></div>
        <div style={{ alignItems: 'center', display: 'flex', gap: 24, marginTop: 8 }}>
          <span className="avatar" style={{ background: club?.colors[0], fontSize: 22, height: 84, width: 84 }}>{player.name.split(' ').map((n) => n[0]).join('')}</span>
          <div>
            <p className="eyebrow"><span /> {player.position} · {club?.name}</p>
            <h1 style={{ fontSize: 'clamp(30px,4vw,48px)' }}>{player.name}</h1>
          </div>
        </div>
        <div className="page-hero-meta">
          <div><strong>{age(player.birthdate)}</strong><span>Âge</span></div>
          <div><strong>{player.stats.matches}</strong><span>Matchs joués</span></div>
          <div><strong>{player.stats.goals}</strong><span>Buts</span></div>
          <div><strong>{player.stats.assists}</strong><span>Passes décisives</span></div>
        </div>
      </section>

      <section className="page-section tight">
        <div className="card-grid cols-4">
          <StatCard label="Minutes jouées" value={player.stats.minutes} />
          <StatCard label="Cartons jaunes" value={player.stats.yellow} />
          <StatCard label="Cartons rouges" value={player.stats.red} />
          <StatCard label="Sélections nationales" value={player.nationalSelections.reduce((a, s) => a + s.caps, 0)} />
        </div>
      </section>

      <section className="page-section tight">
        <div className="dashboard-panel" style={{ maxWidth: 520 }}>
          <h3>Identité fédérale — FIF ID</h3>
          <div className="dashboard-list">
            <div><small>FIF ID</small><b>{player.fifId}</b></div>
            <div><small>Statut licence</small><span className={`status-pill ${statusTone[player.licenseStatus]}`}>{player.licenseStatus}</span></div>
            <div><small>Date de naissance</small><b>{formatDate(player.birthdate)}</b></div>
            <div><small>Nationalité sportive</small><b>{player.nationality}</b></div>
          </div>
          <Link href={`/verifier/${player.fifId}`} className="button-outline" style={{ marginTop: 16 }}><QrCode size={14} /> Vérifier ce FIF ID</Link>
        </div>
      </section>

      {player.nationalSelections.length > 0 && (
        <section className="page-section tight">
          <p className="section-tag">Sélections nationales</p>
          <div className="table-wrap" style={{ marginTop: 16 }}>
            <table className="data-table">
              <thead><tr><th className="align-left">ÉQUIPE</th><th>SÉLECTIONS</th><th>BUTS</th></tr></thead>
              <tbody>
                {player.nationalSelections.map((s, i) => {
                  const team = nationalTeams.find((t) => t.id === s.teamId)
                  return (
                    <tr key={i}>
                      <td className="align-left">{team ? <Link href={`/equipes-nationales/${team.slug}`}>{team.name}</Link> : s.teamId}</td>
                      <td>{s.caps}</td>
                      <td>{s.goals}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="page-section tight">
        <p className="section-tag">Historique des clubs</p>
        <div className="card-grid cols-2" style={{ marginTop: 16 }}>
          {player.history.map((h, i) => {
            const c = getClubById(h.clubId)
            return c ? (
              <Link key={i} href={`/clubs/${c.slug}`} className="entity-card">
                <div><strong>{c.name}</strong><span>{h.from} — {h.to ?? 'aujourd’hui'}</span></div>
              </Link>
            ) : null
          })}
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
