import { Award, Shield, Users } from 'lucide-react'
import { players } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { LicenceWorkflow } from '@/components/site/LicenceWorkflow'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Licences — FIF Digital' }

const audiences = [
  { icon: Users, label: 'Joueurs & joueuses', desc: 'Licence sportive obligatoire pour évoluer en compétition officielle.' },
  { icon: Shield, label: 'Dirigeants & clubs', desc: 'Affiliation et habilitation des dirigeants et structures.' },
  { icon: Award, label: 'Entraîneurs & agents', desc: 'Licences techniques CAF et licences d’agent sportif.' },
]

export default function LicencesPage() {
  const valid = players.filter((p) => p.licenseStatus === 'Valide').length
  const pending = players.filter((p) => p.licenseStatus === 'En attente').length
  const expired = players.filter((p) => p.licenseStatus === 'Expirée').length

  return (
    <main>
      <PageHero
        eyebrow="FIF Licensing"
        title="Licences"
        subtitle="La licence fédérale ouvre l’accès aux compétitions officielles pour les joueurs, entraîneurs, arbitres, dirigeants, agents et clubs."
        breadcrumb={[{ label: 'Licences' }]}
        meta={[
          { value: String(valid), label: 'Licences valides (joueurs)' },
          { value: String(pending), label: 'En attente' },
          { value: String(expired), label: 'Expirées' },
        ]}
      />

      <section className="page-section tight">
        <p className="section-tag">Qui peut demander une licence ?</p>
        <div className="info-tiles" style={{ marginTop: 16 }}>
          {audiences.map((a) => (
            <div className="info-tile" key={a.label}><a.icon /><strong>{a.label}</strong><p>{a.desc}</p></div>
          ))}
        </div>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Déposer une demande et suivre mon dossier</p>
        <LicenceWorkflow />
      </section>

      <section className="page-section tight dark-section">
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Documents requis</p>
        <div className="card-grid cols-4" style={{ marginTop: 16 }}>
          {['Certificat médical', 'Pièce d’identité', 'Photo d’identité', 'Justificatif de club'].map((d) => (
            <div className="entity-card" key={d}><div><strong>{d}</strong><span>Formats acceptés : PDF, JPEG, PNG.</span></div></div>
          ))}
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
