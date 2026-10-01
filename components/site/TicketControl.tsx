'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { findTicket, markUsed, type Ticket } from '@/lib/tickets'

// Écran du contrôleur à l'entrée du stade : le scan du QR code ouvre cette
// page ; le billet est validé une seule fois.
export function TicketControl() {
  const [id, setId] = useState('')
  const [ticket, setTicket] = useState<Ticket | null | undefined>(undefined)

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('t')
    if (t) { setId(t); setTicket(findTicket(t)) }
  }, [])

  function check(e: React.FormEvent) {
    e.preventDefault()
    setTicket(findTicket(id))
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <form className="search-field" onSubmit={check}>
        <input value={id} onChange={(e) => setId(e.target.value.toUpperCase())} placeholder="N° de billet, ex. TKT-ABCDE-12345" aria-label="Numéro de billet" />
        <button type="submit" className="button-outline" style={{ padding: '8px 14px' }}>Contrôler</button>
      </form>
      {ticket === null && (
        <div className="verify-result" style={{ borderColor: '#f3b3ae', marginTop: 20 }}>
          <XCircle color="#c62828" size={40} /><h1>Billet inconnu</h1><p className="lede">Accès refusé : ce billet n’existe pas.</p>
        </div>
      )}
      {ticket && (
        <div className="verify-result" style={{ borderColor: ticket.status === 'Valide' ? '#8fd6ab' : '#f6c48f', marginTop: 20 }}>
          {ticket.status === 'Valide' ? <CheckCircle2 color="var(--green)" size={40} /> : <AlertTriangle color="#b45300" size={40} />}
          <h1>{ticket.status === 'Valide' ? 'Billet valide' : 'Billet déjà utilisé'}</h1>
          <div className="dashboard-list" style={{ marginTop: 16, maxWidth: 420, width: '100%' }}>
            <div><small>Match</small><b>{ticket.eventLabel}</b></div>
            <div><small>Titulaire</small><b>{ticket.holder}</b></div>
            <div><small>Catégorie</small><b>{ticket.tierName}</b></div>
            <div><small>Place</small><b>{ticket.gate} · bloc {ticket.block} · rang {ticket.row} · siège {ticket.seat}</b></div>
          </div>
          {ticket.status === 'Valide' && (
            <button type="button" className="button button-primary" style={{ marginTop: 18 }} onClick={() => { markUsed(ticket.id); setTicket({ ...ticket, status: 'Utilisé' }) }}>
              Valider l’entrée
            </button>
          )}
        </div>
      )}
      <p className="lede" style={{ fontSize: 12, marginTop: 16 }}>Prototype : le contrôle fonctionne sur l’appareil où les billets ont été achetés. En production, il interroge le serveur de billetterie en temps réel.</p>
    </div>
  )
}
