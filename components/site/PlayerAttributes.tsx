import { Star } from 'lucide-react'
import type { PositionFamiliarity } from '@/lib/data/types'
import { attributeColor, attributeTint } from '@/lib/attributes'

export function StarRating({ count, label }: { count: number; label: string }) {
  return (
    <div style={{ alignItems: 'center', display: 'flex', gap: 10 }}>
      <span style={{ color: 'var(--muted)', fontSize: 11, letterSpacing: '.05em', textTransform: 'uppercase', width: 108 }}>{label}</span>
      <div style={{ display: 'flex', gap: 2 }}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} size={16} fill={i < count ? 'var(--orange)' : 'none'} color={i < count ? 'var(--orange)' : 'var(--line)'} />
        ))}
      </div>
    </div>
  )
}

export function PositionChips({ positions }: { positions: PositionFamiliarity[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {positions.map((p, i) => (
        <span
          key={i}
          style={{
            background: attributeTint(p.familiarity),
            borderRadius: 8,
            color: attributeColor(p.familiarity),
            fontSize: 11,
            fontWeight: 800,
            padding: '6px 11px',
          }}
        >
          {p.position} · {p.familiarity}/20
        </span>
      ))}
    </div>
  )
}

function AttrRow({ name, value, isKey }: { name: string; value: number; isKey: boolean }) {
  return (
    <div className={`attr-row${isKey ? ' key' : ''}`}>
      <span>{name}</span>
      <b style={{ color: attributeColor(value) }}>{value}</b>
    </div>
  )
}

export function AttributePanel({ title, attrs, keyAttrs }: { title: string; attrs: Record<string, number>; keyAttrs: string[] }) {
  return (
    <div className="attr-panel">
      <h4>{title}</h4>
      {Object.entries(attrs).map(([name, value]) => (
        <AttrRow key={name} name={name} value={value} isKey={keyAttrs.includes(name)} />
      ))}
    </div>
  )
}
