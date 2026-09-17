import Link from 'next/link'
import { CalendarDays, MapPin, QrCode, ShieldCheck } from 'lucide-react'
import { ticketEvents, getMatch, getClubById, getStadiumById } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'
import { formatDate, formatMoney } from '@/lib/format'

export const metadata = { title: 'FIF Tickets — Billetterie' }

export default function TicketsPage() {
  return (
    <main>
      <PageHero
        eyebrow="FIF Tickets"
        title="Billetterie"
        subtitle="Réservez vos places pour les matchs des Éléphants, de la Ligue 1 et des grandes compétitions nationales."
        breadcrumb={[{ label: 'Billetterie' }]}
        meta={[{ value: String(ticketEvents.length), label: 'Événements ouverts à la vente' }]}
      />

      <section className="page-section tight">
        <div className="card-grid">
          {ticketEvents.map((ev) => {
            const match = getMatch(ev.matchId)
            if (!match) return null
            const home = getClubById(match.homeClubId)
            const away = getClubById(match.awayClubId)
            const stadium = getStadiumById(match.stadiumId)
            const minPrice = Math.min(...ev.categories.map((c) => c.price))
            return (
              <div className="ticket-card" key={ev.id}>
                <div>
                  <small>{formatDate(match.date, { weekday: 'long', day: 'numeric', month: 'long' })}</small>
                  <strong>{home?.name} vs {away?.name}</strong>
                  <p><MapPin size={13} /> {stadium?.name}</p>
                </div>
                <div className="ticket-card-foot">
                  <span>Dès {formatMoney(minPrice)}</span>
                  <Link href={`/matches/${match.id}`} className="button-outline">Voir le match</Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="page-section tight dark-section">
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Comment ça marche</p>
        <div className="info-tiles" style={{ marginTop: 16 }}>
          <div className="info-tile"><CalendarDays /><strong>Choisissez votre match</strong><p>Sélectionnez l’événement, le stade et la catégorie de place.</p></div>
          <div className="info-tile"><ShieldCheck /><strong>Paiement sécurisé</strong><p>Mobile Money (Orange, MTN, Moov), carte bancaire — passerelles mockées dans ce prototype.</p></div>
          <div className="info-tile"><QrCode /><strong>Billet numérique</strong><p>QR code anti-fraude, accessible depuis votre espace Mon FIF.</p></div>
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
