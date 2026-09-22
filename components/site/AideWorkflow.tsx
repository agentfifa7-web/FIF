'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { AIDE_STAGES, submitAide, advanceAide, useDossiers, type AideDossier } from '@/lib/workflows'
import { Stepper } from '@/components/site/widgets'
import { formatDate } from '@/lib/format'

interface Program { title: string }

function AideCard({ d }: { d: AideDossier }) {
  if (d.stage === 'Rejeté') {
    return (
      <div className="entity-card" style={{ flexDirection: 'column', alignItems: 'stretch', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><strong>{d.programme}</strong><span className="muted-sm" style={{ display: 'block' }}>{d.club} · créé le {formatDate(d.createdAt)}</span></div>
          <span className="status-pill error"><XCircle size={12} style={{ verticalAlign: 'middle' }} /> Rejeté</span>
        </div>
      </div>
    )
  }
  const idx = AIDE_STAGES.indexOf(d.stage as (typeof AIDE_STAGES)[number])
  return (
    <div className="entity-card" style={{ flexDirection: 'column', alignItems: 'stretch', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div><strong>{d.programme}</strong><span className="muted-sm" style={{ display: 'block' }}>{d.club} · créé le {formatDate(d.createdAt)}</span></div>
        {d.stage === 'En instruction' ? (
          <div className="button-group">
            <button type="button" className="button-outline" onClick={() => advanceAide(d.id, 'approve')}><CheckCircle2 size={14} /> Simuler l’approbation</button>
            <button type="button" className="button-outline" onClick={() => advanceAide(d.id, 'reject')}><XCircle size={14} /> Simuler le rejet</button>
          </div>
        ) : d.stage !== 'Payé' ? (
          <button type="button" className="button-outline" onClick={() => advanceAide(d.id)}>Faire avancer le dossier</button>
        ) : null}
      </div>
      <Stepper steps={[...AIDE_STAGES]} active={idx} />
    </div>
  )
}

export function AideWorkflow({ programs }: { programs: Program[] }) {
  const { aide, ready } = useDossiers()
  const [programme, setProgramme] = useState(programs[0]?.title ?? '')
  const [club, setClub] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!club.trim()) return
    submitAide(programme, club.trim())
    setClub('')
  }

  return (
    <>
      <form className="form-card" style={{ margin: '16px 0 0', maxWidth: 480 }} onSubmit={handleSubmit}>
        <div className="text-field">
          <label htmlFor="aid-programme">Programme</label>
          <select id="aid-programme" value={programme} onChange={(e) => setProgramme(e.target.value)}>
            {programs.map((p) => <option key={p.title} value={p.title}>{p.title}</option>)}
          </select>
        </div>
        <div className="text-field">
          <label htmlFor="aid-club">Club demandeur</label>
          <input id="aid-club" type="text" required placeholder="Nom du club" value={club} onChange={(e) => setClub(e.target.value)} />
        </div>
        <div className="form-actions">
          <button type="submit" className="button button-primary" style={{ justifyContent: 'center' }}>Déposer le dossier</button>
        </div>
        <p className="muted-sm" style={{ margin: '14px 0 0' }}>Démonstration locale : le dossier est suivi dans votre navigateur.</p>
      </form>

      {ready && aide.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 28 }}>
          {aide.map((d) => <AideCard d={d} key={d.id} />)}
        </div>
      )}
    </>
  )
}
