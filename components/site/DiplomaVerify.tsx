'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { findDiploma, type AcademyEnrollment } from '@/lib/academy'

export function DiplomaVerify() {
  const [no, setNo] = useState('')
  const [found, setFound] = useState<AcademyEnrollment | null | undefined>(undefined)
  useEffect(() => {
    const n = new URLSearchParams(window.location.search).get('n')
    if (n) { setNo(n); setFound(findDiploma(n)) }
  }, [])
  return (
    <div style={{ maxWidth: 560 }}>
      <form className="search-field" onSubmit={(e) => { e.preventDefault(); setFound(findDiploma(no)) }}>
        <input value={no} onChange={(e) => setNo(e.target.value.toUpperCase())} placeholder="N° de diplôme, ex. FIF-ACA-2026-LCD-12345" aria-label="Numéro de diplôme" />
        <button type="submit" className="button-outline" style={{ padding: '8px 14px' }}>Vérifier</button>
      </form>
      {found === null && <div className="verify-result" style={{ borderColor: '#f3b3ae', marginTop: 20 }}><XCircle color="#c62828" size={40} /><h1>Diplôme introuvable</h1><p className="lede">Aucun diplôme FIF Academy ne correspond à ce numéro.</p></div>}
      {found && (
        <div className="verify-result" style={{ borderColor: '#8fd6ab', marginTop: 20 }}>
          <CheckCircle2 color="var(--green)" size={40} />
          <h1>Diplôme authentique</h1>
          <div className="dashboard-list" style={{ marginTop: 16, maxWidth: 440, width: '100%' }}>
            <div><small>Titulaire</small><b>{found.holderName}</b></div>
            <div><small>Diplôme</small><b>{found.diplomaTitle}</b></div>
            <div><small>Accréditation</small><b>{found.accreditationLabel}</b></div>
            <div><small>Délivré le</small><b>{new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(found.diplomaIssuedAt!))}</b></div>
          </div>
        </div>
      )}
      <p className="lede" style={{ fontSize: 12, marginTop: 16 }}>Prototype : la vérification fonctionne sur l’appareil où le diplôme a été obtenu. En production, elle interroge le registre central des diplômes de la FIF.</p>
    </div>
  )
}
