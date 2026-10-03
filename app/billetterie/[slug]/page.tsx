import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarDays, Clock, DoorOpen, Info, MapPin, ShieldCheck } from 'lucide-react'
import { ticketEvents, getTicketEvent } from '@/lib/data/tickets'
import { Breadcrumb } from '@/components/site/PageHero'
import { SideBadge, eventDateLabel } from '@/components/site/TicketEventCard'
import { TicketCheckout } from '@/components/site/TicketCheckout'
import { SaleAlertButton } from '@/components/site/SaleAlertButton'
import { Countdown } from '@/components/site/Countdown'
import { DemoBadge } from '@/components/site/DemoBadge'
import { loadCms } from '@/lib/cms/server'

export async function generateStaticParams() {
  await loadCms()
  return ticketEvents.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  await loadCms()
  const { slug } = await params
  const ev = getTicketEvent(slug)
  return { title: ev ? `Billets ${ev.home.name} – ${ev.away.name} — FIF Tickets` : 'FIF Tickets' }
}

export default async function TicketEventPage({ params }: { params: Promise<{ slug: string }> }) {
  await loadCms()
  const { slug } = await params
  const ev = getTicketEvent(slug)
  if (!ev) notFound()

  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'Billetterie', href: '/billetterie' }, { label: `${ev.home.name} – ${ev.away.name}` }]} />
      </div>

      <section className="page-section tight">
        <div className="ev-header">
          <span className="ev-competition">{ev.competition}</span>
          <div className="ev-hero-teams">
            <SideBadge side={ev.home} size={72} />
            <b className="ev-vs">VS</b>
            <SideBadge side={ev.away} size={72} />
          </div>
          <div className="ev-header-meta">
            <span><CalendarDays size={14} /> {eventDateLabel(ev)}</span>
            {ev.gatesOpen && <span><DoorOpen size={14} /> Ouverture des portes {ev.gatesOpen}</span>}
            <span><MapPin size={14} /> {ev.stadium.name}{ev.stadium.city ? `, ${ev.stadium.city}` : ''}{ev.stadium.capacity ? ` · ${ev.stadium.capacity.toLocaleString('fr-FR')} places` : ''}</span>
          </div>
          {ev.date && ev.time && ev.status === 'En vente' && <Countdown iso={`${ev.date}T${ev.time}:00Z`} />}
          {ev.matchHref && <Link href={ev.matchHref} className="text-link">Voir la page du match →</Link>}
        </div>
      </section>

      <section className="page-section tight">
        {ev.status === 'En vente' ? (
          <TicketCheckout event={ev} />
        ) : (
          <div className="dashboard-panel" style={{ margin: 0, maxWidth: 680 }}>
            <h3><Clock size={17} style={{ verticalAlign: 'middle', marginRight: 6, color: 'var(--orange)' }} />{ev.status}</h3>
            <p className="lede" style={{ fontSize: 15 }}>{ev.note}</p>
            <SaleAlertButton slug={ev.slug} />
          </div>
        )}
      </section>

      {(ev.note || ev.source) && ev.status === 'En vente' && (
        <section className="page-section tight">
          <p className="press-source-note"><Info size={13} /> {ev.note} {ev.source && <a href={ev.source.url} target="_blank" rel="noopener noreferrer">{ev.source.label}</a>}</p>
        </section>
      )}

      <section className="page-section tight dark-section">
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Le jour du match</p>
        <div className="info-tiles" style={{ marginTop: 16 }}>
          <div className="info-tile"><DoorOpen /><strong>Arrivez tôt</strong><p>{ev.gatesOpen ? `Portes ouvertes dès ${ev.gatesOpen}.` : 'Horaires d’ouverture communiqués avant le match.'} Rejoignez la porte indiquée sur votre billet.</p></div>
          <div className="info-tile"><ShieldCheck /><strong>Contrôle à l’entrée</strong><p>QR code du billet + pièce d’identité ou carte FIF ID. Un billet = une entrée.</p></div>
          <div className="info-tile"><Info /><strong>Interdits au stade</strong><p>Objets dangereux, fumigènes, bouteilles en verre, banderoles à caractère politique ou injurieux.</p></div>
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
