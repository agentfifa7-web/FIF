import { competitions } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { CompetitionCard } from '@/components/site/cards'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Compétitions — FIF Digital' }

const groups = ['Seniors', 'Féminin', 'Jeunes', 'Futsal', 'Beach Soccer'] as const

export default function CompetitionsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Competition Center"
        title="Compétitions"
        subtitle="Ligue 1, Ligue 2, Coupe Nationale, championnats féminins et jeunes, futsal, beach soccer : tout le système compétitif fédéral."
        breadcrumb={[{ label: 'Compétitions' }]}
        meta={[
          { value: String(competitions.length), label: 'Compétitions actives' },
          { value: '2025-2026', label: 'Saison en cours' },
        ]}
      />
      {groups.map((group) => {
        const items = competitions.filter((c) => c.category === group)
        if (!items.length) return null
        return (
          <section className="page-section tight" key={group}>
            <p className="section-tag">{group}</p>
            <div className="card-grid" style={{ marginTop: 16 }}>
              {items.map((c) => <CompetitionCard key={c.id} competition={c} clubCount={c.clubIds.length} />)}
            </div>
          </section>
        )
      })}
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
