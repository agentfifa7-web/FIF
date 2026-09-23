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
          { value: competitions[0]?.season ?? '', label: 'Saison en cours' },
        ]}
      />
      <section className="page-section tight">
        <p className="section-tag">Seniors — Football professionnel</p>
        <p className="lede">Les compétitions locales de haut niveau, sous licence professionnelle FIF.</p>
        <div className="card-grid" style={{ marginTop: 16 }}>
          {competitions.filter((c) => c.category === 'Seniors' && c.practice === 'Professionnel').map((c) => (
            <CompetitionCard key={c.id} competition={c} clubCount={c.clubIds.length} />
          ))}
        </div>
      </section>

      <section className="page-section tight dark-section">
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Seniors — Football amateur</p>
        <p className="lede" style={{ color: '#a9b7af' }}>Championnats régionaux, coupes de districts et ligues amateurs organisés sous la gestion de la FIF.</p>
        <div className="card-grid" style={{ marginTop: 16 }}>
          {competitions.filter((c) => c.category === 'Seniors' && c.practice === 'Amateur').map((c) => (
            <CompetitionCard key={c.id} competition={c} clubCount={c.clubIds.length} />
          ))}
        </div>
      </section>

      {groups.filter((g) => g !== 'Seniors').map((group) => {
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
