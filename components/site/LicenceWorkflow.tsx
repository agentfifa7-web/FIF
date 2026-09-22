'use client'

import { useState } from 'react'
import { IdCard } from 'lucide-react'
import { LICENCE_STAGES, submitLicence, advanceLicence, useDossiers } from '@/lib/workflows'
import { Stepper } from '@/components/site/widgets'
import { formatDate } from '@/lib/format'

const ACTEURS = ['Joueur / Joueuse', 'Entraîneur', 'Arbitre', 'Dirigeant', 'Agent', 'Club']

function fifIdFor(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return `CI-LIC-${String(h % 100000000).padStart(8, '0')}`
}

export function LicenceWorkflow() {
  const { licence, ready } = useDossiers()
  const [acteur, setActeur] = useState(ACTEURS[0])
  const [nom, setNom] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nom.trim()) return
    submitLicence(acteur, nom.trim())
    setNom('')
  }

  return (
    <>
      <form className="form-card" style={{ margin: '16px 0 0', maxWidth: 480 }} onSubmit={handleSubmit}>
        <div className="text-field">
          <label htmlFor="lic-acteur">Type de demandeur</label>
          <select id="lic-acteur" value={acteur} onChange={(e) => setActeur(e.target.value)}>
            {ACTEURS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="text-field">
          <label htmlFor="lic-nom">Nom complet / raison sociale</label>
          <input id="lic-nom" type="text" required placeholder="Votre nom" value={nom} onChange={(e) => setNom(e.target.value)} />
        </div>
        <div className="form-actions">
          <button type="submit" className="button button-primary" style={{ justifyContent: 'center' }}>Créer le dossier de licence</button>
        </div>
        <p className="muted-sm" style={{ margin: '14px 0 0' }}>Démonstration locale : le dossier est suivi dans votre navigateur, sans paiement réel.</p>
      </form>

      {ready && licence.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 28 }}>
          {licence.map((d) => (
            <div className="entity-card" style={{ flexDirection: 'column', alignItems: 'stretch', padding: 24 }} key={d.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <div><strong>{d.nom}</strong><span className="muted-sm" style={{ display: 'block' }}>{d.acteur} · créé le {formatDate(d.createdAt)}</span></div>
                {d.stage !== 'Renouvellement' && (
                  <button type="button" className="button-outline" onClick={() => advanceLicence(d.id)}>Faire avancer le dossier</button>
                )}
              </div>
              <Stepper steps={[...LICENCE_STAGES]} active={LICENCE_STAGES.indexOf(d.stage)} />
              {(d.stage === 'Émission' || d.stage === 'Renouvellement') && (
                <div className="fan-id-card" style={{ marginTop: 20, maxWidth: 380 }}>
                  <div className="fan-id-card-top"><span>Licence fédérale FIF</span><IdCard size={20} /></div>
                  <div className="fan-id-card-body">
                    <div><strong>{d.nom}</strong><span>{d.acteur}</span><span className="fan-id-level">{fifIdFor(d.id)}</span></div>
                  </div>
                  <div className="fan-id-card-foot"><span>Émise le {formatDate(d.updatedAt)}</span><span className="status-pill ok">Valide</span></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
