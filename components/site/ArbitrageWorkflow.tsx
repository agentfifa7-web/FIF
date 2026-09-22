'use client'

import { useState } from 'react'
import { EXAMEN_STAGES, submitExamen, advanceExamen, useDossiers } from '@/lib/workflows'
import { Stepper } from '@/components/site/widgets'
import { formatDate } from '@/lib/format'

const CATEGORIES = ['Arbitre régional', 'Arbitre Fédérale 2', 'Arbitre Fédérale 1', 'Assistant vidéo (VAR)']

export function ArbitrageWorkflow() {
  const { examen, ready } = useDossiers()
  const [candidat, setCandidat] = useState('')
  const [categorie, setCategorie] = useState(CATEGORIES[0])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!candidat.trim()) return
    submitExamen(candidat.trim(), categorie)
    setCandidat('')
  }

  return (
    <>
      <form className="form-card" style={{ margin: '16px 0 0', maxWidth: 480 }} onSubmit={handleSubmit}>
        <div className="text-field">
          <label htmlFor="exa-candidat">Nom du candidat</label>
          <input id="exa-candidat" type="text" required placeholder="Votre nom" value={candidat} onChange={(e) => setCandidat(e.target.value)} />
        </div>
        <div className="text-field">
          <label htmlFor="exa-categorie">Catégorie visée</label>
          <select id="exa-categorie" value={categorie} onChange={(e) => setCategorie(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="button button-primary" style={{ justifyContent: 'center' }}>S’inscrire au parcours arbitre</button>
        </div>
        <p className="muted-sm" style={{ margin: '14px 0 0' }}>Démonstration locale : le parcours est suivi dans votre navigateur.</p>
      </form>

      {ready && examen.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 28 }}>
          {examen.map((d) => (
            <div className="entity-card" style={{ flexDirection: 'column', alignItems: 'stretch', padding: 24 }} key={d.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <div><strong>{d.candidat}</strong><span className="muted-sm" style={{ display: 'block' }}>{d.categorie} · inscrit le {formatDate(d.createdAt)}</span></div>
                {d.stage !== 'Résultat' && (
                  <button type="button" className="button-outline" onClick={() => advanceExamen(d.id)}>Faire avancer le parcours</button>
                )}
              </div>
              <Stepper steps={[...EXAMEN_STAGES]} active={EXAMEN_STAGES.indexOf(d.stage)} />
              {d.stage === 'Résultat' && (
                <p className="pronostic-submitted" style={{ justifyContent: 'flex-start', marginTop: 16 }}>Parcours complété — résultat notifié le {formatDate(d.updatedAt)}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
