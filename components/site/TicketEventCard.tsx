import Link from 'next/link'
import { CalendarDays, MapPin } from 'lucide-react'
import type { TicketEvent, TicketSide } from '@/lib/data/tickets'
import { formatMoney } from '@/lib/format'

export function SideBadge({ side, size = 56 }: { side: TicketSide; size?: number }) {
  return (
    <div className="ev-side">
      <span className="ev-crest" style={{ height: size, width: size }}>
        {side.flag && !side.crestUrl ? <span style={{ fontSize: size * 0.6 }}>{side.flag}</span>
          : side.crestUrl ? <img src={side.crestUrl} alt="" /> : <b>{side.shortName.slice(0, 3).toUpperCase()}</b>}
      </span>
      <strong>{side.name}</strong>
    </div>
  )
}

export function eventDateLabel(ev: TicketEvent) {
  if (!ev.date) return 'Date à confirmer'
  const d = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${ev.date}T12:00:00`))
  return `${d}${ev.time ? ` · ${ev.time}` : ''}`
}

export function TicketEventCard({ ev }: { ev: TicketEvent }) {
  const min = ev.tiers.length ? Math.min(...ev.tiers.map((t) => t.price)) : null
  return (
    <Link href={`/billetterie/${ev.slug}`} className="ev-card">
      <div className="ev-card-top">
        <span className="ev-competition">{ev.competition}</span>
        <span className={`status-pill ${ev.status === 'En vente' ? 'ok' : ev.status === 'Complet' ? 'error' : 'pending'}`}>{ev.status}</span>
      </div>
      <div className="ev-card-teams">
        <SideBadge side={ev.home} size={44} />
        <b className="ev-vs">VS</b>
        <SideBadge side={ev.away} size={44} />
      </div>
      <p className="ev-meta"><CalendarDays size={13} /> {eventDateLabel(ev)}</p>
      <p className="ev-meta"><MapPin size={13} /> {ev.stadium.name}{ev.stadium.city ? `, ${ev.stadium.city}` : ''}</p>
      <div className="ev-card-foot">
        <span>{min !== null ? <>Dès <b>{formatMoney(min)}</b></> : 'Tarifs à venir'}</span>
        <span className="button button-primary">{ev.status === 'En vente' ? 'Acheter' : ev.status === 'Terminé' ? 'Voir le match' : 'Être alerté'}</span>
      </div>
    </Link>
  )
}
