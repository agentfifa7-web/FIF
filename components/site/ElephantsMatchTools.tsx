'use client'

import { useState } from 'react'
import { CheckCircle2, Minus, Plus, Radio, Zap } from 'lucide-react'
import { formatMoney } from '@/lib/format'

interface TicketCategory { name: string; price: number; available: number }

export function TicketPurchase({ categories, matchLabel }: { categories: TicketCategory[]; matchLabel: string }) {
  const [categoryIndex, setCategoryIndex] = useState(0)
  const [qty, setQty] = useState(1)
  const [confirmed, setConfirmed] = useState<{ ref: string; total: number; category: string; qty: number } | null>(null)
  const category = categories[categoryIndex]

  if (confirmed) {
    return (
      <div className="dashboard-panel" style={{ alignItems: 'center', borderColor: 'var(--green)', display: 'flex', gap: 14, margin: '16px 0 0' }}>
        <CheckCircle2 size={22} color="var(--green)" style={{ flexShrink: 0 }} />
        <div>
          <strong>Réservation confirmée (démonstration)</strong>
          <p className="lede" style={{ margin: '4px 0 0' }}>{confirmed.qty} billet(s) {confirmed.category} — {matchLabel}</p>
          <p className="lede" style={{ margin: '4px 0 0' }}>Référence : <b>{confirmed.ref}</b> · Total : <b>{formatMoney(confirmed.total)}</b></p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {categories.map((c, i) => (
          <button
            key={c.name}
            type="button"
            className={`status-pill ${i === categoryIndex ? 'ok' : 'neutral'}`}
            style={{ appearance: 'none', border: 0, cursor: 'pointer', font: 'inherit', padding: '9px 16px' }}
            onClick={() => setCategoryIndex(i)}
          >
            {c.name} — {formatMoney(c.price)}
          </button>
        ))}
      </div>
      <div style={{ alignItems: 'center', display: 'flex', gap: 16, marginTop: 16 }}>
        <span style={{ color: 'var(--muted)', fontSize: 12 }}>Quantité</span>
        <button type="button" className="button-outline" style={{ padding: '6px 10px' }} onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus size={14} /></button>
        <b>{qty}</b>
        <button type="button" className="button-outline" style={{ padding: '6px 10px' }} onClick={() => setQty((q) => Math.min(6, q + 1))}><Plus size={14} /></button>
        <span style={{ color: 'var(--muted)', fontSize: 12 }}>{category.available.toLocaleString('fr-FR')} places disponibles</span>
      </div>
      <button
        type="button"
        className="button button-primary"
        style={{ marginTop: 18 }}
        onClick={() => setConfirmed({ ref: `FIF-${Date.now().toString(36).toUpperCase()}`, total: category.price * qty, category: category.name, qty })}
      >
        Réserver {qty} billet{qty > 1 ? 's' : ''} — {formatMoney(category.price * qty)}
      </button>
      <p className="lede" style={{ fontSize: 12, marginTop: 10 }}>Démonstration locale : aucun paiement réel n’est effectué.</p>
    </div>
  )
}

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
