'use client'

import { CheckCircle2, FileText } from 'lucide-react'
import { setAvailability, submitReport, useOfficialPortal } from '@/lib/officialPortal'

export function AvailabilityToggle() {
  const { available, ready } = useOfficialPortal()
  if (!ready) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span className={`status-pill ${available ? 'ok' : 'neutral'}`}>{available ? 'Disponible' : 'Indisponible'}</span>
      <button type="button" className="button-outline" onClick={() => setAvailability(!available)}>
        {available ? 'Me déclarer indisponible' : 'Me déclarer disponible'}
      </button>
    </div>
  )
}

interface PastMatch { id: string; label: string; date: string }

export function ReportsList({ matches }: { matches: PastMatch[] }) {
  const { reports, ready } = useOfficialPortal()
  if (!ready) return null
  return (
    <div className="dashboard-list">
      {matches.map((m) => {
        const done = reports.includes(m.id)
        return (
          <div key={m.id}>
            <div><b>{m.label}</b><small>{m.date}</small></div>
            {done ? (
              <span className="status-pill ok"><CheckCircle2 size={12} style={{ verticalAlign: 'middle' }} /> Rapport envoyé</span>
            ) : (
              <button type="button" className="status-pill pending" style={{ appearance: 'none', border: 0, cursor: 'pointer', font: 'inherit' }} onClick={() => submitReport(m.id)}>
                <FileText size={12} style={{ verticalAlign: 'middle' }} /> Rédiger le rapport
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
