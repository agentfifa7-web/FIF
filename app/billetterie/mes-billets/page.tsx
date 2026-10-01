import { Breadcrumb } from '@/components/site/PageHero'
import { MyTickets } from '@/components/site/MyTickets'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Mes billets — FIF Tickets' }

export default function MyTicketsPage() {
  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'Billetterie', href: '/billetterie' }, { label: 'Mes billets' }]} />
        <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', letterSpacing: '-.03em', margin: '14px 0 0' }}>Mes billets</h1>
      </div>
      <section className="page-section tight"><MyTickets /></section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
