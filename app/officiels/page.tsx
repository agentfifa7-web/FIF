import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { coaches, referees, officials, agents } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { OfficialsDirectory } from '@/components/site/OfficialsDirectory'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Portail Officiels — FIF Digital' }

export default async function OfficialsPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role } = await searchParams
  return (
    <main>
      <PageHero
        eyebrow="Portail Officiels"
        title="Entraîneurs, arbitres, dirigeants & agents"
        subtitle="L’annuaire des acteurs officiels du football ivoirien : licences, statuts et affectations."
        breadcrumb={[{ label: 'Officiels' }]}
        meta={[
          { value: String(coaches.length), label: 'Entraîneurs' },
          { value: String(referees.length), label: 'Arbitres' },
          { value: String(agents.length), label: 'Agents' },
        ]}
      />
      <section className="page-section tight">
        <Link href="/portail/officiels" className="president-preview">
          <div><strong>Mon espace officiel</strong><span>Désignations, disponibilité et rapports de match — dashboard personnalisé</span></div>
          <ArrowRight />
        </Link>
      </section>

      <section className="page-section tight">
        <OfficialsDirectory coaches={coaches} referees={referees} officials={officials} agents={agents} initialRole={role} />
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
