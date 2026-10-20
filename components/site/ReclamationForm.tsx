'use client'

import { useState } from 'react'
import { DemoNotice } from './DemoNotice'

/** Formulaire de réclamation : génère un numéro de dossier conservé dans ce
 *  navigateur (service en démonstration, rien n'est transmis). */
export function ReclamationForm({ contactEmail }: { contactEmail?: string }) {
  const [ref, setRef] = useState<string | null>(null)
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const n = `REC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`
    try { localStorage.setItem('fif:reclamation:last', JSON.stringify({ ref: n, at: new Date().toISOString() })) } catch {}
    setRef(n)
    e.currentTarget.reset()
  }
  return (
    <>
      <DemoNotice>
        Votre réclamation reçoit un numéro de suivi, conservé uniquement dans ce navigateur : elle n’est pas transmise à la FIF.
        {contactEmail ? <> Pour une réclamation officielle, écrivez à <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</> : ' Pour une réclamation officielle, adressez-vous au secrétariat de la FIF.'}
      </DemoNotice>
      {ref && <div className="svc-confirm" role="status" style={{ marginBottom: 16 }}><strong>Dossier enregistré</strong>Numéro de suivi : <code>{ref}</code></div>}
      <form className="form-card" onSubmit={submit}>
        <div className="text-field"><label htmlFor="rec-type">Type de démarche</label><select id="rec-type"><option>Réclamation sur un match</option><option>Appel d’une décision</option><option>Licence ou transfert</option><option>Autre</option></select></div>
        <div className="text-field"><label htmlFor="rec-object">Objet</label><input id="rec-object" required /></div>
        <div className="text-field"><label htmlFor="rec-context">Match, décision ou dossier concerné</label><input id="rec-context" /></div>
        <div className="text-field"><label htmlFor="rec-details">Exposé des faits</label><textarea id="rec-details" rows={5} required /></div>
        <div className="form-actions"><button type="submit" className="button button-primary">Déposer la réclamation</button></div>
      </form>
    </>
  )
}
