'use client'

import { Music } from 'lucide-react'
import { chants } from '@/lib/data/mock'
import { useFanProfile, viewChant } from '@/lib/fan'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

const CATEGORIES = ['Éléphants', 'Historique', 'Régional', 'Club'] as const

export default function ChantsPage() {
  const { profile, ready } = useFanProfile()
  if (!ready) return null

  return (
    <main>
      <PageHero
        eyebrow="🎤 Fan Zone"
        title="Chants des supporters"
        subtitle="Chants des Éléphants, des clubs, historiques et régionaux — origine, occasion et disponibilité des paroles."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Chants' }]}
      />

      {CATEGORIES.map((cat) => {
        const items = chants.filter((c) => c.category === cat)
        if (!items.length) return null
        return (
          <section className="page-section tight" key={cat}>
            <p className="section-tag">{cat}</p>
            <div className="card-grid cols-2" style={{ marginTop: 16 }}>
              {items.map((c) => {
                const learned = profile?.chantsViewed.includes(c.id)
                return (
                  <button
                    type="button"
                    key={c.id}
                    className="entity-card"
                    style={{ appearance: 'none', cursor: 'pointer', font: 'inherit', textAlign: 'left', width: '100%' }}
                    onClick={() => viewChant(c.id)}
                  >
                    <Music size={18} color="var(--orange)" />
                    <div>
                      <strong>{c.title}</strong>
                      <span>{c.origin} · {c.occasion}{c.lyricsAvailable ? ' · Paroles disponibles' : ''}</span>
                    </div>
                    {profile && <span className={`status-pill ${learned ? 'ok' : 'neutral'}`}>{learned ? 'Appris' : '+10 XP'}</span>}
                  </button>
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
