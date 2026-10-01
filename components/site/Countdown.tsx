'use client'

import { useEffect, useState } from 'react'

/** Compte à rebours jusqu'au coup d'envoi (heure d'Abidjan = UTC). */
export function Countdown({ iso }: { iso: string }) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => { setNow(Date.now()); const t = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(t) }, [])
  if (now === null) return null
  const diff = Math.max(0, +new Date(iso) - now)
  if (!diff) return <div className="ev-countdown"><b>Coup d’envoi !</b></div>
  const d = Math.floor(diff / 86400000), h = Math.floor(diff / 3600000) % 24, m = Math.floor(diff / 60000) % 60, s = Math.floor(diff / 1000) % 60
  return (
    <div className="ev-countdown" aria-label="Temps restant avant le coup d’envoi">
      {[[d, 'jours'], [h, 'heures'], [m, 'min'], [s, 'sec']].map(([v, l]) => <div key={l}><b>{String(v).padStart(2, '0')}</b><span>{l}</span></div>)}
    </div>
  )
}
