'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Printer, Ticket as TicketIcon } from 'lucide-react'
import { useTickets } from '@/lib/tickets'
import { DigitalTicket } from './DigitalTicket'
import { formatMoney } from '@/lib/format'

export function MyTickets() {
  const { tickets, orders, ready } = useTickets()
  const [printRef, setPrintRef] = useState<string | null>(null)
  if (!ready) return null

  if (!orders.length) {
    return (
      <div className="dashboard-panel" style={{ margin: 0, maxWidth: 560, textAlign: 'center' }}>
        <TicketIcon size={28} color="var(--muted)" />
        <p className="lede">Vous n’avez pas encore de billet.</p>
        <Link href="/billetterie" className="button button-primary">Voir les matchs en vente</Link>
      </div>
    )
  }

  function print(ref: string | null) {
    setPrintRef(ref)
    window.setTimeout(() => window.print(), 50)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {orders.map((o) => {
        const list = tickets.filter((t) => t.orderRef === o.ref)
        return (
          <div key={o.ref} className={printRef === null || printRef === o.ref ? 'order-block print-area' : 'order-block'}>
            <div className="order-head">
              <div>
                <strong>{list[0]?.eventLabel}</strong>
                <span>Commande {o.ref} · {list.length} billet{list.length > 1 ? 's' : ''} · {formatMoney(o.total)} · {o.payment}</span>
              </div>
              <button type="button" className="button-outline" onClick={() => print(o.ref)}><Printer size={15} /> Imprimer</button>
            </div>
            <div className="e-ticket-list">{list.map((t) => <DigitalTicket key={t.id} ticket={t} />)}</div>
          </div>
        )
      })}
    </div>
  )
}
