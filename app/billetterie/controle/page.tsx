import { Breadcrumb } from '@/components/site/PageHero'
import { TicketControl } from '@/components/site/TicketControl'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Contrôle des billets — FIF Tickets' }

export default function TicketControlPage() {
  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'Billetterie', href: '/billetterie' }, { label: 'Contrôle d’accès' }]} />
      </div>
      <section className="page-section tight"><TicketControl /></section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
