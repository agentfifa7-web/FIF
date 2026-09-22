'use client'

import { Award } from 'lucide-react'
import { enroll, advanceProgress, getEnrollment, useEnrollments } from '@/lib/formation'

export function FormationEnrollment({ slug, title, duration, seats }: { slug: string; title: string; duration: string; seats: number }) {
  const { ready } = useEnrollments()
  const enrollment = ready ? getEnrollment(slug) : null

  if (!ready) return null

  if (!enrollment) {
    return (
      <div className="dashboard-panel">
        <h3>Inscription</h3>
        <p className="lede">Durée : {duration}. Places limitées à {seats} participants.</p>
        <button type="button" className="button button-primary" style={{ justifyContent: 'center', marginTop: 16, width: '100%' }} onClick={() => enroll(slug, title)}>S’inscrire</button>
        <p className="form-foot">Démonstration locale : confirmation immédiate + suivi de progression (0 → 100 %).</p>
      </div>
    )
  }

  return (
    <div className="dashboard-panel">
      <h3>Ma progression</h3>
      <div className="gauge-track" style={{ marginTop: 12 }}><div className="gauge-fill" style={{ width: `${enrollment.progressPct}%` }} /></div>
      <p className="lede" style={{ marginTop: 10 }}>{enrollment.progressPct}% complété</p>
      {enrollment.progressPct < 100 ? (
        <button type="button" className="button-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => advanceProgress(slug)}>Terminer le module suivant</button>
      ) : (
        <div className="fan-id-card" style={{ marginTop: 4 }}>
          <div className="fan-id-card-top"><span>Certificat FIF Academy</span><Award size={20} /></div>
          <div className="fan-id-card-body"><div><strong>{title}</strong><span>Formation complétée</span></div></div>
          <div className="fan-id-card-foot"><span>Délivré le {new Date(enrollment.updatedAt).toLocaleDateString('fr-FR')}</span><span className="status-pill ok">Validé</span></div>
        </div>
      )}
    </div>
  )
}
