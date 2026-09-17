import { Gavel, Lock } from 'lucide-react'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Disciplinary Center — FIF Digital' }

const cases = [
  { ref: 'DISC-2026-014', subject: 'Club — Incident de sécurité', status: 'En instruction' },
  { ref: 'DISC-2026-013', subject: 'Joueur — Carton rouge contestable', status: 'Décision rendue' },
  { ref: 'DISC-2026-012', subject: 'Officiel — Rapport de match', status: 'Appel en cours' },
]

export default function DisciplinePage() {
  return (
    <main>
      <PageHero
        eyebrow="Disciplinary Center"
        title="Discipline"
        subtitle="Dossiers, sanctions, décisions des commissions et procédures d’appel."
        breadcrumb={[{ label: 'Discipline' }]}
      />
      <section className="page-section tight">
        <div className="sim-panel" style={{ margin: 0 }}>
          <p><Lock size={15} /> Les dossiers disciplinaires sensibles sont soumis à des niveaux de permission stricts — seules les décisions publiques figurent ici.</p>
        </div>
      </section>
      <section className="page-section tight">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th className="align-left">RÉFÉRENCE</th><th className="align-left">OBJET</th><th>STATUT</th></tr></thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.ref}><td className="align-left">{c.ref}</td><td className="align-left"><Gavel size={12} style={{ verticalAlign: 'middle', marginRight: 6 }} />{c.subject}</td><td><span className="status-pill neutral">{c.status}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
