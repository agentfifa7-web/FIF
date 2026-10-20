'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Users } from 'lucide-react'
import { cityName, fanClubs } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { DemoNotice } from '@/components/site/DemoNotice'
import { ServiceSteps } from '@/components/site/ServiceSteps'

function CreateAssociationForm() {
  const [sent, setSent] = useState(false)
  if (sent) {
    return (
      <div className="svc-confirm" role="status">
        <CheckCircle2 aria-hidden />
        <strong>Demande enregistrée dans ce navigateur</strong>
        <p>Cette démonstration ne transmet rien à la FIF. Pour faire reconnaître votre association, contactez le secrétariat de la FIF.</p>
      </div>
    )
  }
  return (
    <form className="svc-form" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
      <DemoNotice />
      <div className="text-field"><label htmlFor="assoc-name">Nom de l’association</label><input id="assoc-name" type="text" required /></div>
      <div className="text-field"><label htmlFor="assoc-city">Ville</label><input id="assoc-city" type="text" required placeholder="Abidjan, Bouaké…" /></div>
      <div className="text-field"><label htmlFor="assoc-desc">Présentation</label><textarea id="assoc-desc" rows={3} required /></div>
      <div className="check-field">
        <input id="assoc-charte" type="checkbox" required />
        <label htmlFor="assoc-charte">J’accepte la <Link href="/supporters/charte">Charte du supporter ivoirien</Link></label>
      </div>
      <button type="submit" className="button button-primary">Envoyer la demande</button>
    </form>
  )
}

export default function AssociationsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Communauté"
        title="Associations de supporters"
        subtitle="Les associations de supporters reconnues par la FIF et la démarche pour faire reconnaître la vôtre."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Associations' }]}
        noPhotos
      />

      <section className="page-section">
        <div className="svc-layout">
          <div>
            <div className="svc-block">
              <h2>Associations reconnues</h2>
              {fanClubs.length ? (
                <div className="card-grid">
                  {fanClubs.map((f) => (
                    <div className="entity-card" key={f.id}>
                      <Users size={18} aria-hidden />
                      <div><strong>{f.name}</strong><span>{cityName(f.cityId)}</span></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Users aria-hidden />
                  <strong>Aucune association publiée pour l’instant</strong>
                  <p>L’annuaire affichera uniquement les associations officiellement reconnues par la FIF, dès leur publication.</p>
                </div>
              )}
            </div>
            <div className="svc-block">
              <h2>Faire reconnaître votre association</h2>
              <CreateAssociationForm />
            </div>
          </div>
          <aside className="svc-action" aria-label="Étapes">
            <h2>Les étapes</h2>
            <ServiceSteps steps={[
              { title: 'Demande', text: 'Présentez l’association, ses responsables et sa ville.' },
              { title: 'Documents', text: 'Statuts et récépissé de déclaration de l’association.' },
              { title: 'Charte', text: 'Engagement à respecter la Charte du supporter.' },
              { title: 'Validation FIF', text: 'Après validation, l’association apparaît dans l’annuaire.' },
            ]} />
          </aside>
        </div>
      </section>
    </main>
  )
}
