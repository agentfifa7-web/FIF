import Link from 'next/link'
import { academies, cityName } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Academy Directory — FIF Digital' }

export default function AcademiesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Academy Directory"
        title="Académies"
        subtitle="Centres de formation agréés ou en cours d’agrément par la FIF, partout en Côte d’Ivoire."
        breadcrumb={[{ label: 'Académies' }]}
        meta={[{ value: String(academies.length), label: 'Académies référencées' }]}
      />
      <section className="page-section tight">
        <div className="card-grid">
          {academies.map((a) => (
            <Link key={a.id} href={`/academies/${a.slug}`} className="entity-card">
              <div><strong>{a.name}</strong><span>{cityName(a.cityId)} · {a.status} · depuis {a.founded}</span></div>
            </Link>
          ))}
        </div>
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
