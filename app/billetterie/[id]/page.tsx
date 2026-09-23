import { notFound } from 'next/navigation'
import { MapPin, ShieldCheck, Smartphone, Users } from 'lucide-react'
import { ticketEvents, getMatch, getClubById, getStadiumById, competitions } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { ClubCrest } from '@/components/site/cards'
import { DemoBadge } from '@/components/site/DemoBadge'
import { TicketBooking } from '@/components/site/TicketBooking'
import { formatDate, formatDateLong, formatTime } from '@/lib/format'

export function generateStaticParams() {
  return ticketEvents.map((ev) => ({ id: ev.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = ticketEvents.find((ev) => ev.id === id)
  const match = event ? getMatch(event.matchId) : null
  if (!match) return { title: 'Billetterie' }
  const home = getClubById(match.homeClubId)
  const away = getClubById(match.awayClubId)
  return { title: `${home?.name} vs ${away?.name} — Billetterie — FIF Digital` }
}

export default async function TicketEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = ticketEvents.find((ev) => ev.id === id)
  if (!event) notFound()
  const match = getMatch(event.matchId)
  if (!match) notFound()
  const home = getClubById(match.homeClubId)
  const away = getClubById(match.awayClubId)
  const stadium = getStadiumById(match.stadiumId)
  const competition = competitions.find((c) => c.id === match.competitionId)
  if (!home || !away) notFound()
  const matchLabel = `${home.name} vs ${away.name}`

  return (
    <main>
      <PageHero
        eyebrow={`Grand public · ${competition?.name ?? 'Championnat'}`}
        title={matchLabel}
        subtitle={`${formatDateLong(match.date)} · ${formatTime(match.date)} · ${stadium?.name ?? ''}`}
        breadcrumb={[{ label: 'Billetterie', href: '/billetterie' }, { label: matchLabel }]}
        meta={[
          { value: formatDate(match.date), label: 'Date' },
          { value: formatTime(match.date), label: 'Coup d’envoi' },
          { value: String(event.categories.reduce((a, c) => a + c.available, 0)), label: 'Places disponibles' },
        ]}
      />

      <section className="page-section tight">
        <div className="next-card" style={{ maxWidth: 560 }}>
          <div className="next-card-top"><span>{(competition?.name ?? 'Championnat').toUpperCase()}</span><span>{formatDateLong(match.date).toUpperCase()}</span></div>
          <div className="teams">
            <div className="team"><ClubCrest club={home} size={52} /><strong>{home.shortName}</strong></div>
            <div className="versus"><small>{formatTime(match.date)}</small><b>VS</b><span><MapPin size={11} style={{ verticalAlign: 'middle' }} /> {stadium?.name}</span></div>
            <div className="team"><ClubCrest club={away} size={52} /><strong>{away.shortName}</strong></div>
          </div>
        </div>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Réserver vos billets</p>
        <div className="dashboard-panel" style={{ marginTop: 16, maxWidth: 640 }}>
          <TicketBooking categories={event.categories} matchLabel={matchLabel} stadiumName={stadium?.name} />
        </div>
      </section>

      <section className="page-section tight dark-section">
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Informations pratiques</p>
        <div className="info-tiles" style={{ marginTop: 16 }}>
          <div className="info-tile"><Users /><strong>Places côte à côte</strong><p>Les billets d’une même commande sont attribués ensemble : même tribune, même bloc, rangs consécutifs.</p></div>
          <div className="info-tile"><ShieldCheck /><strong>Paiement sécurisé</strong><p>Mobile Money (Orange, MTN, Moov), carte bancaire — passerelles mockées dans ce prototype.</p></div>
          <div className="info-tile"><Smartphone /><strong>Billet numérique</strong><p>QR code anti-fraude, accessible depuis votre espace Mon FIF dès la confirmation.</p></div>
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
