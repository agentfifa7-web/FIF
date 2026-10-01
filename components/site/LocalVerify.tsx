'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { accountStatus, cardExpiry, findAccountByFifId, identityProgress, type FifAccount } from '@/lib/account'

const fmt = (iso?: string | null) => (iso ? new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso)) : '—')

// Vérification d'un FIF ID créé sur la plateforme (prototype : comptes
// conservés dans le navigateur). N'affiche que les informations publiques.
export function LocalVerify({ id }: { id: string }) {
  const [state, setState] = useState<{ ready: boolean; account: FifAccount | null }>({ ready: false, account: null })
  useEffect(() => { setState({ ready: true, account: findAccountByFifId(id) }) }, [id])
  if (!state.ready) return null
  const a = state.account

  if (!a) {
    return (
      <div className="verify-result" style={{ borderColor: '#f3b3ae' }}>
        <XCircle color="#c62828" size={40} />
        <h1>Identifiant introuvable</h1>
        <p className="lede">Aucune identité fédérale ne correspond à « {id} ». Vérifiez l’identifiant saisi.</p>
        <div className="button-group" style={{ marginTop: 24 }}><Link href="/verifier" className="button-outline">Nouvelle vérification</Link></div>
      </div>
    )
  }

  const status = accountStatus(a)
  const complete = identityProgress(a).complete
  const valid = complete && status.tone === 'ok'
  return (
    <div className="verify-result" style={{ borderColor: valid ? '#8fd6ab' : '#f6c48f' }}>
      {valid ? <CheckCircle2 color="var(--green)" size={40} /> : <AlertTriangle color="#b45300" size={40} />}
      <h1>{valid ? 'Carte FIF ID valide' : 'FIF ID existant — non encore validé'}</h1>
      {a.identity?.photo && <img src={a.identity.photo} alt="" style={{ borderRadius: 10, height: 120, marginTop: 12, objectFit: 'cover', width: 96 }} />}
      <div className="dashboard-list" style={{ marginTop: 20, maxWidth: 420, width: '100%' }}>
        <div><small>Titulaire</small><b>{a.fullName}</b></div>
        <div><small>Profil</small><b>{a.role}</b></div>
        {a.matricule && <div><small>Matricule</small><b>{a.matricule}</b></div>}
        <div><small>Statut</small><span className={`status-pill ${valid ? 'ok' : 'pending'}`}>{!complete ? 'Identité incomplète' : status.label}</span></div>
        <div><small>Valide jusqu’au</small><b>{fmt(cardExpiry(a))}</b></div>
      </div>
      <div className="button-group" style={{ marginTop: 24 }}><Link href="/verifier" className="button-outline">Nouvelle vérification</Link></div>
    </div>
  )
}
