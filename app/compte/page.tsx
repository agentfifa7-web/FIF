import { articles } from '@/lib/data/mock'
import { ticketEvents } from '@/lib/data/tickets'
import { TicketEventCard } from '@/components/site/TicketEventCard'
import { PageHero } from '@/components/site/PageHero'
import { NewsCard } from '@/components/site/cards'
import { AccountDashboard } from '@/components/site/AccountDashboard'
import { DemoBadge } from '@/components/site/DemoBadge'
import { loadCms } from '@/lib/cms/server'

export const metadata = { title: 'Mon compte — FIF Digital' }

export default async function AccountPage() {
  await loadCms()
  const nextEvent = ticketEvents.find((e) => e.status === 'En vente') ?? ticketEvents[0]

  return (
    <main>
      <PageHero
        eyebrow="Espace personnel FIF ID"
        title="Mon compte"
        subtitle="L’espace personnel de chaque titulaire d’un FIF ID — supporters, joueurs, dirigeants, entraîneurs, arbitres, agents et journalistes : identifiant, équipes supportées et espace supporter, commandes, billets, formations et matchs à suivre."
        breadcrumb={[{ label: 'Mon compte' }]}
      />
      <section className="page-section tight">
        <AccountDashboard
          nextMatch={nextEvent ? <div className="card-grid cols-2"><TicketEventCard ev={nextEvent} /></div> : <p className="lede">Aucun match programmé.</p>}
          news={<div className="news-grid">{articles.slice(0, 3).map((a) => <NewsCard key={a.id} article={a} />)}</div>}
        />
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
