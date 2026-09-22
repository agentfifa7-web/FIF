'use client'

import { Percent } from 'lucide-react'
import { partnerOffers, fanLevels } from '@/lib/data/mock'
import { useFanProfile, fanLevelProgress } from '@/lib/fan'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'
import { formatDate } from '@/lib/format'

const CATEGORIES = ['Restauration', 'Transport', 'Télécoms', 'Banque', 'Loisirs', 'Hôtellerie'] as const

export default function PartenairesPage() {
  const { profile, ready } = useFanProfile()
  if (!ready) return null
  const myLevelOrder = profile ? fanLevelProgress(profile.xp).level.order : 0

  return (
    <main>
      <PageHero
        eyebrow="🎁 Fan Life"
        title="FIF Fan Pass — Avantages partenaires"
        subtitle="Des avantages chez des partenaires selon votre niveau de supporter. Les avantages réels dépendent des partenariats et disponibilités de la FIF."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Partenaires' }]}
      />

      {CATEGORIES.map((cat) => {
        const items = partnerOffers.filter((o) => o.category === cat)
        if (!items.length) return null
        return (
          <section className="page-section tight" key={cat}>
            <p className="section-tag">{cat}</p>
            <div className="card-grid cols-2" style={{ marginTop: 16 }}>
              {items.map((o) => {
                const level = fanLevels.find((l) => l.order === o.minLevelOrder)
                const eligible = profile ? myLevelOrder >= o.minLevelOrder : false
                return (
                  <div className="entity-card" key={o.id}>
                    <Percent size={18} color="var(--orange)" />
                    <div>
                      <strong>{o.title}</strong>
                      <span>{o.partner} · {o.discount} · dès {level?.icon} {level?.name} · expire le {formatDate(o.expiresAt)}</span>
                    </div>
                    <span className={`status-pill ${eligible ? 'ok' : 'neutral'}`}>{eligible ? 'Débloqué' : 'À débloquer'}</span>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
