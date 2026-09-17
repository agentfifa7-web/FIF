import { Trophy } from 'lucide-react'
import { nationalTeams, clubs } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Palmarès — FIF Digital' }

export default function PalmaresPage() {
  const clubHonours = clubs.filter((c) => c.honours.length > 0)

  return (
    <main>
      <PageHero
        eyebrow="Archives du football ivoirien"
        title="Palmarès"
        subtitle="Les titres majeurs des équipes nationales et des clubs affiliés à la FIF."
        breadcrumb={[{ label: 'Palmarès' }]}
      />

      <section className="page-section tight dark-section">
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Équipes nationales</p>
        <div className="card-grid cols-2" style={{ marginTop: 16 }}>
          {nationalTeams.filter((t) => t.honours.length).flatMap((t) => t.honours.map((h, i) => (
            <div className="info-tile" key={`${t.id}-${i}`}><Trophy /><strong>{t.name} — {h.title}</strong><p>{h.year}</p></div>
          )))}
        </div>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Clubs</p>
        <div className="card-grid" style={{ marginTop: 16 }}>
          {clubHonours.map((c) => (
            <div className="entity-card" key={c.id}>
              <div><strong>{c.name}</strong><span>{c.honours.map((h) => `${h.title} ×${h.count}`).join(' · ')}</span></div>
            </div>
          ))}
          {!clubHonours.length && <p className="lede">Aucun palmarès enregistré pour l’instant.</p>}
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
