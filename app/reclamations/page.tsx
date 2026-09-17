'use client'

import { PageHero } from '@/components/site/PageHero'
import { Stepper } from '@/components/site/widgets'
import { DemoBadge } from '@/components/site/DemoBadge'

export default function ComplaintsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Réclamations & Appels"
        title="Réclamations"
        subtitle="Déposez une réclamation ou un appel et suivez son instruction en toute transparence."
        breadcrumb={[{ label: 'Réclamations' }]}
      />
      <section className="page-section tight">
        <div className="card-grid cols-2">
          <form className="form-card" style={{ marginTop: 0, marginLeft: 0 }} onSubmit={(e) => e.preventDefault()}>
            <div className="text-field"><label htmlFor="object">Objet de la réclamation</label><input id="object" required /></div>
            <div className="text-field"><label htmlFor="context">Contexte (match, licence, décision…)</label><input id="context" /></div>
            <div className="text-field"><label htmlFor="details">Détails</label><textarea id="details" rows={4} required /></div>
            <div className="form-actions"><button type="submit" className="button button-primary" style={{ justifyContent: 'center' }}>Déposer le dossier</button></div>
          </form>
          <div>
            <p className="section-tag">Suivi du dossier</p>
            <div style={{ marginTop: 16 }}>
              <Stepper steps={['Formulaire', 'Numéro attribué', 'Documents', 'Instruction', 'Notification']} active={1} />
            </div>
            <p className="lede">Un numéro de dossier est généré à la soumission et son statut reste consultable à tout moment depuis votre espace Mon FIF.</p>
          </div>
        </div>
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
