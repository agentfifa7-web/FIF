'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import type { AcademyEnrollment } from '@/lib/academy'

export function diplomaVerifyUrl(no: string) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://fif.ci'
  return `${origin}/formation/diplome?n=${encodeURIComponent(no)}`
}

const longDate = (iso?: string) => (iso ? new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso)) : '')

/** Diplôme FIF Academy au format A4 paysage, avec QR code de vérification. */
export function Diploma({ e, birth }: { e: AcademyEnrollment; birth?: string }) {
  const [qr, setQr] = useState('')
  useEffect(() => {
    if (!e.diplomaNo) return
    QRCode.toDataURL(diplomaVerifyUrl(e.diplomaNo), { margin: 1, width: 260, color: { dark: '#041b12', light: '#ffffff' } }).then(setQr).catch(() => setQr(''))
  }, [e.diplomaNo])
  if (!e.diplomaNo) return null

  return (
    <div className="diploma-wrap">
      <article className="diploma">
        <div className="diploma-border">
          <header>
            <img src="/fif-logo.png" alt="" />
            <div>
              <span>Membre de la FIFA et de la CAF</span>
              <b>Fédération Ivoirienne de Football</b>
              <small>FIF Academy</small>
            </div>
          </header>
          <p className="diploma-kicker">Diplôme</p>
          <h2>{e.diplomaTitle}</h2>
          <p className="diploma-text">est décerné à</p>
          <p className="diploma-name">{e.holderName}</p>
          {birth && <p className="diploma-text">né(e) le {longDate(birth)}</p>}
          <p className="diploma-text">pour avoir suivi avec succès la formation <b>{e.title}</b> ({e.sessionLabel}) et satisfait à l’ensemble des évaluations.</p>
          <p className="diploma-acc">{e.accreditationLabel}</p>
          <footer>
            <div className="diploma-sign"><span>Le Directeur technique national</span><i /></div>
            <div className="diploma-meta">
              {qr && <img src={qr} alt="QR code de vérification du diplôme" />}
              <b>N° {e.diplomaNo}</b>
              <span>Délivré le {longDate(e.diplomaIssuedAt)}</span>
            </div>
            <div className="diploma-sign"><span>Le Président de la FIF</span><i /></div>
          </footer>
        </div>
        <div className="diploma-specimen" aria-hidden>Spécimen — prototype</div>
      </article>
    </div>
  )
}
