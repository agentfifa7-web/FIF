import { ArrowRightLeft } from 'lucide-react'
import { clubs, players } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { Stepper } from '@/components/site/widgets'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Transfer Center — FIF Digital' }

const sample = [0, 1, 2, 3, 4].map((i) => {
  const player = players[i * 37]
  const from = clubs.find((c) => c.id === player.clubId)
  const to = clubs[(clubs.findIndex((c) => c.id === player.clubId) + 5) % clubs.length]
  return { player, from, to, status: ['Validé', 'En contrôle', 'Soumis', 'Validé', 'En contrôle'][i] }
})

export default function TransfersPage() {
  return (
    <main>
      <PageHero
        eyebrow="FIF Transfer Center"
        title="Transferts"
        subtitle="Un circuit entièrement traçable pour les transferts de joueurs entre clubs affiliés."
        breadcrumb={[{ label: 'Transferts' }]}
      />

      <section className="page-section tight">
        <Stepper steps={['Demande', 'Contrat', 'Documents', 'Validation club vendeur', 'Validation club acheteur', 'Validation FIF', 'Statut mis à jour']} active={4} />
      </section>

      <section className="page-section tight">
        <p className="section-tag">Transferts récents (démonstration)</p>
        <div className="table-wrap" style={{ marginTop: 16 }}>
          <table className="data-table">
            <thead><tr><th className="align-left">JOUEUR</th><th className="align-left">CLUB VENDEUR</th><th className="align-left">CLUB ACHETEUR</th><th>STATUT</th></tr></thead>
            <tbody>
              {sample.map((s, i) => (
                <tr key={i}>
                  <td className="align-left">{s.player.name}</td>
                  <td className="align-left">{s.from?.name}</td>
                  <td className="align-left"><ArrowRightLeft size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{s.to?.name}</td>
                  <td><span className={`status-pill ${s.status === 'Validé' ? 'ok' : 'pending'}`}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
