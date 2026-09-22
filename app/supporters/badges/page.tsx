'use client'

import { useFanProfile, badgeCatalogWithStatus } from '@/lib/fan'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

const CATEGORIES = ['Supporter', 'Historique', 'Social', 'Saison'] as const

export default function BadgesPage() {
  const { profile, ready } = useFanProfile()
  if (!ready) return null
  const catalog = badgeCatalogWithStatus(profile)
  const earnedCount = catalog.filter((b) => b.earned).length

  return (
    <main>
      <PageHero
        eyebrow="🏅 Fan Pass"
        title="Mes badges"
        subtitle="Des dizaines de badges à débloquer en participant à la vie du football ivoirien : matchs suivis, quiz, Fan Zone, Football Tour…"
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Badges' }]}
        meta={[{ value: `${earnedCount}/${catalog.length}`, label: 'Badges obtenus' }]}
      />

      {CATEGORIES.map((cat) => {
        const items = catalog.filter((b) => b.category === cat)
        return (
          <section className="page-section tight" key={cat}>
            <p className="section-tag">Badges {cat.toLowerCase()}</p>
            <div className="badge-grid" style={{ marginTop: 16 }}>
              {items.map((b) => (
                <div className={`badge-tile${b.earned ? '' : ' locked'}`} key={b.id} title={b.description}>
                  <span className="badge-icon">{b.icon}</span>
                  <strong>{b.name}</strong>
                  <span>{b.earned ? 'Obtenu' : b.description}</span>
                </div>
              ))}
            </div>
          </section>
        )
      })}

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
