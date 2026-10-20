'use client'

import { Gift } from 'lucide-react'
import { rewards, fanLevels } from '@/lib/data/mock'
import { useFanProfile } from '@/lib/fan'
import { PageHero } from '@/components/site/PageHero'
import { DemoNotice } from '@/components/site/DemoNotice'

const CATEGORIES = ['Digital', 'Expériences', 'Produits', 'Billetterie'] as const

export default function RecompensesPage() {
  const { profile } = useFanProfile()

  return (
    <main>
      <PageHero
        eyebrow="Fan Life"
        title="Récompenses"
        subtitle="Les récompenses envisagées pour les supporters les plus actifs : contenus numériques, expériences, produits et avantages billetterie."
        noPhotos
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Récompenses' }]}
        meta={profile ? [{ value: profile.xp.toLocaleString('fr-FR'), label: 'Votre XP disponible' }] : undefined}
      />

      <section className="page-section tight"><DemoNotice title="Exemples envisagés">Ces récompenses illustrent le futur programme. Elles ne peuvent pas encore être échangées : aucune récompense n’est délivrée tant que la FIF n’a pas lancé officiellement le programme.</DemoNotice></section>

      {CATEGORIES.map((cat) => (
        <section className="page-section tight" key={cat}>
          <p className="section-tag">{cat}</p>
          <div className="card-grid cols-2" style={{ marginTop: 16 }}>
            {rewards.filter((r) => r.category === cat).map((r) => {
              const level = fanLevels.find((l) => l.order === r.minLevelOrder)
                            return (
                <div className="entity-card" key={r.id}>
                  <Gift size={18} color="var(--fif-orange-text)" />
                  <div>
                    <strong>{r.title}</strong>
                    <span>{r.description} · dès {level?.icon} {level?.name}</span>
                  </div>
                  <span className="status-pill neutral">{r.xpCost.toLocaleString('fr-FR')} XP</span>
                </div>
              )
            })}
          </div>
        </section>
      ))}

    </main>
  )
}
