'use client'

import type { TicketTier, TicketTierId } from '@/lib/data/tickets'
import { formatMoney } from '@/lib/format'

export const TIER_COLORS: Record<TicketTierId, string> = {
  vip: '#c9a54b',
  centrale: '#087443',
  laterale: '#ff7a00',
  virage: '#3b6fd8',
}

/** Plan schématique du stade : cliquer une tribune sélectionne la catégorie. */
export function StadiumMap({ tiers, selected, onSelect }: { tiers: TicketTier[]; selected?: TicketTierId; onSelect: (id: TicketTierId) => void }) {
  const tier = (id: TicketTierId) => tiers.find((t) => t.id === id)
  const zone = (id: TicketTierId, d: string, label: string, lx: number, ly: number) => {
    const t = tier(id)
    if (!t) return null
    const active = selected === id
    return (
      <g className={`stadium-zone${active ? ' is-active' : ''}`} onClick={() => onSelect(id)} role="button" tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(id) }} aria-label={`${t.name} — ${formatMoney(t.price)}`}>
        <path d={d} fill={TIER_COLORS[id]} opacity={selected && !active ? 0.35 : 0.92} />
        <text x={lx} y={ly} textAnchor="middle">{label}</text>
        <text x={lx} y={ly + 13} textAnchor="middle" className="stadium-price">{formatMoney(t.price)}</text>
      </g>
    )
  }

  return (
    <svg className="stadium-map" viewBox="0 0 420 280" role="group" aria-label="Plan du stade">
      <rect x="4" y="4" width="412" height="272" rx="120" fill="#e9ede9" />
      {zone('laterale', 'M90 14 H330 Q350 14 356 40 L340 66 H80 L64 40 Q70 14 90 14 Z', 'Tribune latérale', 210, 40)}
      {zone('virage', 'M58 52 L76 76 V204 L58 228 Q14 200 14 140 Q14 80 58 52 Z', 'Virage', 42, 136)}
      {zone('virage', 'M362 52 L344 76 V204 L362 228 Q406 200 406 140 Q406 80 362 52 Z', 'Virage', 378, 136)}
      {zone('centrale', 'M80 214 H160 V266 H90 Q70 266 64 240 Z M260 214 H340 L356 240 Q350 266 330 266 H260 Z', 'Centrale', 210, 252)}
      {zone('vip', 'M166 214 H254 V266 H166 Z', 'VIP', 210, 234)}
      <rect x="86" y="74" width="248" height="134" rx="4" fill="#2f8f4e" />
      <rect x="92" y="80" width="236" height="122" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" />
      <line x1="210" y1="80" x2="210" y2="202" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" />
      <circle cx="210" cy="141" r="18" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" />
      <rect x="92" y="112" width="30" height="58" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" />
      <rect x="298" y="112" width="30" height="58" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" />
      <text x="210" y="145" textAnchor="middle" className="stadium-pitch-label">PELOUSE</text>
    </svg>
  )
}
