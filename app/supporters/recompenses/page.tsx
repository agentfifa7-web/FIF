'use client'

import { Gift } from 'lucide-react'
import { rewards, fanLevels } from '@/lib/data/mock'
import { useFanProfile } from '@/lib/fan'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

const CATEGORIES = ['Digital', 'Expériences', 'Produits', 'Billetterie'] as const

export default function RecompensesPage() {
  const { profile, ready } = useFanProfile()
  if (!ready) return null

  return (
    <main>
      <PageHero
        eyebrow="🎁 Fan Life"
        title="Récompenses"
        subtitle="Échangez votre XP contre des contenus digitaux, des expériences, des produits ou des avantages billetterie."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Récompenses' }]}
        meta={profile ? [{ value: profile.xp.toLocaleString('fr-FR'), label: 'Votre XP disponible' }] : undefined}
      />

      {CATEGORIES.map((cat) => (
        <section className="page-section tight" key={cat}>
          <p className="section-tag">{cat}</p>
          <div className="card-grid cols-2" style={{ marginTop: 16 }}>
            {rewards.filter((r) => r.category === cat).map((r) => {
              const level = fanLevels.find((l) => l.order === r.minLevelOrder)
              const affordable = profile ? profile.xp >= r.xpCost : false
              return (
                <div className="entity-card" key={r.id}>
                  <Gift size={18} color="var(--orange)" />
                  <div>
                    <strong>{r.title}</strong>
                    <span>{r.description} · dès {level?.icon} {level?.name}</span>
                  </div>
                  <span className={`status-pill ${affordable ? 'ok' : 'neutral'}`}>{r.xpCost.toLocaleString('fr-FR')} XP</span>
                </div>
              )
            })}
          </div>
        </section>
      ))}

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
