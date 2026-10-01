'use client'

import { useState } from 'react'
import { CheckCircle2, Minus, Plus, Radio, Zap } from 'lucide-react'
import { formatMoney } from '@/lib/format'

interface LiveEvent { minute: number; label: string }

export function LivePreview({ isUpcoming }: { isUpcoming: boolean }) {
  const [events, setEvents] = useState<LiveEvent[]>([])
  const [started, setStarted] = useState(false)

  function addEvent(label: string) {
    setStarted(true)
    setEvents((prev) => [...prev, { minute: Math.min(90, (prev.at(-1)?.minute ?? 0) + Math.floor(Math.random() * 12) + 3), label }])
  }

  return (
    <div>
      {isUpcoming && !started && (
        <p className="lede">Le direct (score, événements, statistiques) sera disponible ici dès le coup d’envoi.</p>
      )}
      <div className="sim-panel">
        <p><Zap /> Aperçu du Match Center en direct (démonstration) — simulez des événements pour prévisualiser l’affichage du jour du match.</p>
        <div className="button-group">
          <button type="button" className="button-outline" onClick={() => addEvent('But — Côte d’Ivoire')}>But CI</button>
          <button type="button" className="button-outline" onClick={() => addEvent('But — adversaire')}>But adverse</button>
          <button type="button" className="button-outline" onClick={() => addEvent('Carton jaune')}>Carton jaune</button>
          <button type="button" className="button-outline" onClick={() => addEvent('Mi-temps')}>Mi-temps</button>
        </div>
      </div>
      {events.length > 0 && (
        <div className="timeline" style={{ marginTop: 16 }}>
          {events.map((e, i) => (
            <div key={i}>
              <b>{e.minute}&apos;</b>
              <div><strong>{e.label}</strong></div>
            </div>
          ))}
        </div>
      )}
      <p className="lede" style={{ alignItems: 'center', display: 'flex', fontSize: 12, gap: 6, marginTop: 10 }}><Radio size={13} /> Aucune donnée de match réelle n’est disponible avant le coup d’envoi.</p>
    </div>
  )
}
