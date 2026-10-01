import Link from 'next/link'
import { CalendarDays, CreditCard, Info, MapPin, QrCode, ShieldCheck, Ticket, Users } from 'lucide-react'
import { ticketEvents } from '@/lib/data/tickets'
import { PageHero } from '@/components/site/PageHero'
import { TicketEventCard, SideBadge, eventDateLabel } from '@/components/site/TicketEventCard'
import { Countdown } from '@/components/site/Countdown'
import { DemoBadge } from '@/components/site/DemoBadge'
import { formatMoney } from '@/lib/format'

export const metadata = { title: 'FIF Tickets — Billetterie officielle' }

const FAQ = [
  ['Comment recevoir mon billet ?', 'Dès le paiement confirmé, vos billets électroniques s’affichent avec leur QR code. Ils sont conservés dans « Mes billets » et peuvent être imprimés ou enregistrés en PDF.'],
  ['Faut-il un compte ?', 'Oui : les billets sont nominatifs et rattachés à votre FIF ID, créé en une minute avec votre numéro de téléphone.'],
  ['Quels moyens de paiement ?', 'Orange Money, MTN Mobile Money, Moov Money, Wave et carte bancaire. Le paiement avec la carte FIF ID arrivera avec le partenaire bancaire de la FIF.'],
  ['Combien de billets puis-je acheter ?', 'Jusqu’à 6 billets par commande, attribués côte à côte. Chaque billet porte le nom de son titulaire.'],
  ['Que faut-il présenter à l’entrée ?', 'Le QR code du billet (sur téléphone ou papier) et une pièce d’identité ou la carte FIF ID. Chaque billet n’est valable que pour une seule entrée.'],
  ['Puis-je être remboursé ?', 'Les conditions d’échange et de remboursement (annulation ou report du match) sont celles des conditions générales de vente publiées par l’organisateur.'],
]

export default function TicketsPage() {
  const featured = ticketEvents.find((e) => e.status === 'En vente')
  const others = ticketEvents.filter((e) => e !== featured)
  const groups = Array.from(new Set(others.map((e) => e.competition)))

  return (
    <main>
      <PageHero
        eyebrow="FIF Tickets"
        title="Billetterie officielle"
        subtitle="Achetez vos billets pour les Éléphants et le championnat : paiement Mobile Money ou carte, billet électronique avec QR code, à présenter sur téléphone ou imprimé."
        breadcrumb={[{ label: 'Billetterie' }]}
        meta={[
          { value: String(ticketEvents.filter((e) => e.status === 'En vente').length), label: 'Match en vente' },
          { value: String(ticketEvents.filter((e) => e.status === 'Bientôt en vente').length), label: 'Bientôt en vente' },
          { value: 'QR', label: 'Billet électronique sécurisé' },
        ]}
      />

      {featured && (
        <section className="page-section tight">
          <div className="ev-hero">
            <div className="ev-hero-main">
              <span className="ev-competition">{featured.competition}</span>
              <div className="ev-hero-teams">
                <SideBadge side={featured.home} size={84} />
                <b className="ev-vs">VS</b>
                <SideBadge side={featured.away} size={84} />
              </div>
              <p className="ev-meta"><CalendarDays size={15} /> {eventDateLabel(featured)}{featured.gatesOpen ? ` · ouverture des portes ${featured.gatesOpen}` : ''}</p>
              <p className="ev-meta"><MapPin size={15} /> {featured.stadium.name}, {featured.stadium.city}</p>
              {featured.date && featured.time && <Countdown iso={`${featured.date}T${featured.time}:00Z`} />}
            </div>
            <div className="ev-hero-side">
              <p className="section-tag" style={{ color: 'var(--orange)' }}>Tarifs officiels</p>
              <ul className="ev-prices">
                {[...featured.tiers].sort((a, b) => b.price - a.price).map((t) => <li key={t.id}><span>{t.name}</span><b>{formatMoney(t.price)}</b></li>)}
              </ul>
              <Link href={`/billetterie/${featured.slug}`} className="button button-primary" style={{ justifyContent: 'center', width: '100%' }}><Ticket size={16} /> Acheter mes billets</Link>
              {featured.source && <p className="ev-source"><Info size={12} /> <a href={featured.source.url} target="_blank" rel="noopener noreferrer">{featured.source.label}</a></p>}
            </div>
          </div>
        </section>
      )}

      {groups.map((g) => (
        <section className="page-section tight" key={g}>
          <p className="section-tag">{g}</p>
          <div className="card-grid" style={{ marginTop: 16 }}>
            {others.filter((e) => e.competition === g).map((ev) => <TicketEventCard key={ev.slug} ev={ev} />)}
          </div>
        </section>
      ))}

      <section className="page-section tight">
        <div className="ev-mytickets">
          <Ticket size={22} />
          <div><strong>Vous avez déjà des billets ?</strong><span>Retrouvez-les, présentez le QR code ou imprimez-les à tout moment.</span></div>
          <Link href="/billetterie/mes-billets" className="button-outline">Mes billets</Link>
        </div>
      </section>

      <section className="page-section tight dark-section">
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Comment ça marche</p>
        <div className="info-tiles" style={{ marginTop: 16 }}>
          <div className="info-tile"><MapPin /><strong>1. Choisissez vos places</strong><p>Sur le plan du stade, sélectionnez la tribune et le nombre de billets.</p></div>
          <div className="info-tile"><Users /><strong>2. Nommez les titulaires</strong><p>Billets nominatifs, connectés à votre FIF ID, places côte à côte.</p></div>
          <div className="info-tile"><CreditCard /><strong>3. Payez en toute sécurité</strong><p>Orange Money, MTN, Moov, Wave ou carte bancaire.</p></div>
          <div className="info-tile"><QrCode /><strong>4. Entrez au stade</strong><p>QR code sur téléphone ou billet imprimé, contrôlé à l’entrée.</p></div>
        </div>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Questions fréquentes</p>
        <div className="faq-list">
          {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </div>
        <p className="press-source-note" style={{ marginTop: 18 }}><ShieldCheck size={13} /> Billetterie officielle de la Fédération Ivoirienne de Football. N’achetez vos billets que sur les canaux officiels.</p>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
