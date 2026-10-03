import Link from 'next/link'
import { Lightbulb, Users } from 'lucide-react'
import { stadiums, cityName } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { loadCms } from '@/lib/cms/server'

export const metadata = { title: 'Stadium Hub — FIF Digital' }

export default async function StadiumsPage() {
  await loadCms()
  return (
    <main>
      <PageHero
        eyebrow="Stadium Hub"
        title="Stades"
        subtitle="Les grands stades du football ivoirien. Les fiches sont complétées au fur et à mesure des informations officielles."
        breadcrumb={[{ label: 'Stades' }]}
        meta={[{ value: String(stadiums.length), label: 'Stades référencés' }]}
      />
      <section className="page-section tight">
        <div className="card-grid">
          {stadiums.slice(0, 24).map((s) => (
            <Link key={s.id} href={`/stades/${s.slug}`} className="entity-card">
              <div>
                <strong>{s.name}</strong>
                <span>{cityName(s.cityId)}{s.capacity ? <> · <Users size={11} style={{ verticalAlign: 'middle' }} /> {s.capacity.toLocaleString('fr-FR')} places</> : ''}{s.lighting && <> <Lightbulb size={11} style={{ verticalAlign: 'middle' }} /> éclairé</>}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
