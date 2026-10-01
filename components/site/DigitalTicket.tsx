'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { CalendarDays, Clock, DoorOpen, MapPin } from 'lucide-react'
import type { Ticket } from '@/lib/tickets'
import { formatMoney } from '@/lib/format'

export function ticketControlUrl(id: string) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://fif.ci'
  return `${origin}/billetterie/controle?t=${encodeURIComponent(id)}`
}

const longDate = (d?: string) => (d ? new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${d}T12:00:00`)) : 'Date à confirmer')

/** Billet électronique : à présenter sur téléphone ou imprimé (format A4/ticket). */
export function DigitalTicket({ ticket }: { ticket: Ticket }) {
  const [qr, setQr] = useState('')
  useEffect(() => {
    QRCode.toDataURL(ticketControlUrl(ticket.id), { margin: 1, width: 360, errorCorrectionLevel: 'Q', color: { dark: '#041b12', light: '#ffffff' } }).then(setQr).catch(() => setQr(''))
  }, [ticket.id])

  return (
    <article className={`e-ticket tier-${ticket.tierId}${ticket.status !== 'Valide' ? ' is-used' : ''}`}>
      <header className="e-ticket-head">
        <img src="/fif-logo.png" alt="" />
        <div>
          <span>FIF Tickets · Billet officiel</span>
          <strong>{ticket.eventLabel}</strong>
          <small>{ticket.competition}</small>
        </div>
        <b className="e-ticket-tier">{ticket.tierName}</b>
      </header>
      <div className="e-ticket-body">
        <div className="e-ticket-info">
          <p><CalendarDays size={14} /> {longDate(ticket.date)}</p>
          <p><Clock size={14} /> Coup d’envoi {ticket.time ?? 'à confirmer'}{ticket.gatesOpen ? ` · ouverture des portes ${ticket.gatesOpen}` : ''}</p>
          <p><MapPin size={14} /> {ticket.stadium}</p>
          <div className="e-ticket-seat">
            <div><span>Porte</span><b>{ticket.gate.replace(/^Porte(s)? /, '')}</b></div>
            <div><span>Bloc</span><b>{ticket.block}</b></div>
            <div><span>Rang</span><b>{ticket.row}</b></div>
            <div><span>Siège</span><b>{ticket.seat}</b></div>
          </div>
          <div className="e-ticket-holder"><span>Titulaire</span><b>{ticket.holder}</b></div>
        </div>
        <div className="e-ticket-qr">
          {qr ? <img src={qr} alt={`QR code du billet ${ticket.id}`} /> : <span />}
          <code>{ticket.id}</code>
        </div>
      </div>
      <footer className="e-ticket-foot">
        <span><DoorOpen size={13} /> {ticket.gate}</span>
        <span>{formatMoney(ticket.price)} · commande {ticket.orderRef}</span>
        <span className={`status-pill ${ticket.status === 'Valide' ? 'ok' : 'neutral'}`}>{ticket.status}</span>
      </footer>
      <p className="e-ticket-legal">Billet nominatif et personnel, valable pour une seule entrée. Pièce d’identité ou carte FIF ID exigée au contrôle. Toute revente non autorisée est interdite.</p>
    </article>
  )
}
