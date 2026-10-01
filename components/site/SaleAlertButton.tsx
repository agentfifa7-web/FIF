'use client'

import { BellRing, Check } from 'lucide-react'
import { toggleSaleAlert, useTickets } from '@/lib/tickets'

export function SaleAlertButton({ slug }: { slug: string }) {
  const { alerts, ready } = useTickets()
  if (!ready) return null
  const on = alerts.includes(slug)
  return (
    <button type="button" className={on ? 'button-outline' : 'button button-primary'} onClick={() => toggleSaleAlert(slug)}>
      {on ? <><Check size={15} /> Alerte activée — vous serez prévenu(e)</> : <><BellRing size={15} /> M’alerter à l’ouverture de la vente</>}
    </button>
  )
}
