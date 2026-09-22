'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Users } from 'lucide-react'
import { cityName, fanClubs } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

function CreateAssociationForm() {
  const [sent, setSent] = useState(false)
  if (sent) {
    return (
      <div className="form-card" style={{ margin: 0, maxWidth: 'none', textAlign: 'center' }}>
        <CheckCircle2 size={28} color="var(--green)" />
        <h1 style={{ fontSize: 18, marginTop: 12 }}>Demande envoyée</h1>
        <p className="muted-sm">Votre demande de création d’association a été transmise à la FIF pour validation (démonstration — aucun envoi réel).</p>
      </div>
    )
  }
  return (
    <form className="form-card" style={{ margin: 0, maxWidth: 'none' }} onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
      <h1 style={{ fontSize: 20 }}>Créer une association de supporters</h1>
      <p className="muted-sm">Demande → Documents → Charte → Validation FIF → Profil public.</p>
      <div className="text-field"><label htmlFor="assoc-name">Nom de l’association</label><input id="assoc-name" type="text" required /></div>
      <div className="text-field"><label htmlFor="assoc-city">Ville</label><input id="assoc-city" type="text" required placeholder="Abidjan, Bouaké…" /></div>
      <div className="text-field"><label htmlFor="assoc-desc">Présentation</label><textarea id="assoc-desc" rows={3} required /></div>
      <div className="text-field" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <input id="assoc-charte" type="checkbox" required style={{ width: 16, height: 16 }} />
        <label htmlFor="assoc-charte" style={{ margin: 0 }}>J’accepte la <Link href="/supporters/charte">Charte du supporter ivoirien</Link></label>
      </div>
      <div className="form-actions">
        <button type="submit" className="button button-primary" style={{ justifyContent: 'center' }}>Envoyer la demande</button>
      </div>
    </form>
  )
}

export default function AssociationsPage() {
  return (
    <main>
      <PageHero
        eyebrow="👥 Fan Life"
        title="Fan Clubs & associations de supporters"
        subtitle="Annuaire des associations reconnues et processus de création encadré par la FIF."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Associations' }]}
        meta={[{ value: String(fanClubs.length), label: 'Associations référencées' }]}
      />

      <section className="page-section tight">
        <p className="section-tag">Annuaire</p>
        <div className="card-grid" style={{ marginTop: 16 }}>
          {fanClubs.map((f) => (
            <div className="entity-card" key={f.id}>
              <Users size={18} color="var(--orange)" />
              <div>
                <strong>{f.name}</strong>
                <span>{cityName(f.cityId)} · depuis {f.founded} · {f.members.toLocaleString('fr-FR')} membres</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section tight">
        <CreateAssociationForm />
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
