'use client'

import { useState } from 'react'
import { CheckCircle2, Minus, Plus, Users } from 'lucide-react'
import { formatMoney } from '@/lib/format'

interface TicketCategory { name: string; price: number; available: number }

interface SeatAssignment { category: string; stand: string; block: string; row: number; seat: number }

const MAX_PER_ORDER = 5

function bandTone(index: number, count: number) {
  const pct = index / Math.max(1, count - 1)
  if (pct <= 0.25) return { bg: '#eef4ee', fg: 'var(--forest)' }
  if (pct <= 0.5) return { bg: '#dcece1', fg: 'var(--forest)' }
  if (pct <= 0.75) return { bg: '#ffe6cc', fg: '#7a3d00' }
  return { bg: '#0b2318', fg: '#f5f3ee' }
}

export function TicketBooking({ categories, matchLabel, stadiumName }: { categories: TicketCategory[]; matchLabel: string; stadiumName?: string }) {
  const [categoryIndex, setCategoryIndex] = useState(0)
  const [qty, setQty] = useState(1)
  const [confirmed, setConfirmed] = useState<{ ref: string; total: number; category: string; qty: number; seats: SeatAssignment[] } | null>(null)
  const category = categories[categoryIndex]

  function reserve() {
    const stand = category.name
    const block = `B${1 + Math.floor(Date.now() % 12)}`
    const row = 5 + Math.floor((Date.now() / 1000) % 30)
    const seats: SeatAssignment[] = Array.from({ length: qty }, (_, i) => ({
      category: category.name,
      stand,
      block,
      row,
      seat: 10 + i,
    }))
    setConfirmed({
      ref: `FIF-${Date.now().toString(36).toUpperCase()}`,
      total: category.price * qty,
      category: category.name,
      qty,
      seats,
    })
  }

  if (confirmed) {
    return (
      <div className="dashboard-panel" style={{ borderColor: 'var(--green)', margin: 0 }}>
        <div style={{ alignItems: 'center', display: 'flex', gap: 14 }}>
          <CheckCircle2 size={22} color="var(--green)" style={{ flexShrink: 0 }} />
          <div>
            <strong>Réservation confirmée (démonstration)</strong>
            <p className="lede" style={{ margin: '4px 0 0' }}>{confirmed.qty} billet{confirmed.qty > 1 ? 's' : ''} {confirmed.category} — {matchLabel}</p>
            <p className="lede" style={{ margin: '4px 0 0' }}>Référence : <b>{confirmed.ref}</b> · Total : <b>{formatMoney(confirmed.total)}</b></p>
          </div>
        </div>
        <p className="section-tag" style={{ marginTop: 20 }}>Vos places — attribuées côte à côte</p>
        <div className="table-wrap" style={{ marginTop: 12 }}>
          <table className="data-table">
            <thead><tr><th className="align-left">TRIBUNE</th><th>BLOC</th><th>RANG</th><th>PLACE</th></tr></thead>
            <tbody>
              {confirmed.seats.map((s, i) => (
                <tr key={i}>
                  <td className="align-left">{s.stand}</td>
                  <td>{s.block}</td>
                  <td>{s.row}</td>
                  <td>{s.seat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="lede" style={{ fontSize: 12, marginTop: 14 }}>Démonstration locale : aucun paiement réel n’est effectué. Votre billet numérique (QR code) serait accessible depuis Mon FIF.</p>
      </div>
    )
  }

  return (
    <div>
      <p className="section-tag" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={13} /> Tarif grand public</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
        {categories.map((c, i) => {
          const tone = bandTone(i, categories.length)
          const selected = i === categoryIndex
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => setCategoryIndex(i)}
              style={{
                alignItems: 'center',
                appearance: 'none',
                background: tone.bg,
                border: selected ? '2px solid var(--orange)' : '2px solid transparent',
                borderRadius: 10,
                color: tone.fg,
                cursor: 'pointer',
                display: 'flex',
                font: 'inherit',
                justifyContent: 'space-between',
                padding: '12px 16px',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <span>
                <strong style={{ display: 'block', fontSize: 14 }}>{c.name}</strong>
                <span style={{ fontSize: 11, opacity: 0.8 }}>{c.available.toLocaleString('fr-FR')} places disponibles{stadiumName ? ` · ${stadiumName}` : ''}</span>
              </span>
              <b style={{ fontSize: 15, whiteSpace: 'nowrap' }}>{formatMoney(c.price)}</b>
            </button>
          )
        })}
      </div>

      <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 20 }}>
        <span style={{ color: 'var(--muted)', fontSize: 12 }}>Quantité</span>
        <button type="button" className="button-outline" style={{ padding: '6px 10px' }} onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus size={14} /></button>
        <b>{qty}</b>
        <button type="button" className="button-outline" style={{ padding: '6px 10px' }} onClick={() => setQty((q) => Math.min(MAX_PER_ORDER, q + 1))}><Plus size={14} /></button>
        <span style={{ color: 'var(--muted)', fontSize: 12 }}>{MAX_PER_ORDER} billets maximum par commande</span>
      </div>

      <button type="button" className="button button-primary" style={{ marginTop: 18 }} onClick={reserve}>
        Réserver {qty} billet{qty > 1 ? 's' : ''} — {formatMoney(category.price * qty)}
      </button>
      <p className="lede" style={{ fontSize: 12, marginTop: 10 }}>Démonstration locale : aucun paiement réel n’est effectué. Les places d’une même commande sont attribuées côte à côte.</p>
    </div>
  )
}
