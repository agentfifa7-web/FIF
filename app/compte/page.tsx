import { clubs, articles } from '@/lib/data/mock'
import { ticketEvents } from '@/lib/data/tickets'
import { TicketEventCard } from '@/components/site/TicketEventCard'
import { PageHero } from '@/components/site/PageHero'
import { NewsCard } from '@/components/site/cards'
import { AccountDashboard } from '@/components/site/AccountDashboard'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Mon compte — FIF Digital' }

export default function AccountPage() {
  const nextEvent = ticketEvents.find((e) => e.status === 'En vente') ?? ticketEvents[0]
  const clubOptions = [...clubs].sort((a, b) => a.name.localeCompare(b.name, 'fr')).map((c) => ({ id: c.id, name: c.name, slug: c.slug }))

  return (
    <main>
      <PageHero
        eyebrow="Espace personnel FIF ID"
        title="Mon compte"
        subtitle="L’espace personnel de chaque titulaire d’un FIF ID — supporters, joueurs, dirigeants, entraîneurs, arbitres, agents et journalistes : identifiant, club favori, commandes, billets et matchs à suivre."
        breadcrumb={[{ label: 'Mon compte' }]}
      />
      <section className="page-section tight">
        <AccountDashboard
          clubs={clubOptions}
          nextMatch={nextEvent ? <div className="card-grid cols-2"><TicketEventCard ev={nextEvent} /></div> : <p className="lede">Aucun match programmé.</p>}
          news={<div className="news-grid">{articles.slice(0, 3).map((a) => <NewsCard key={a.id} article={a} />)}</div>}
        />
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
