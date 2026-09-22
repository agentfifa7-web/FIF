'use client'

import { useState } from 'react'
import { cityName, mockFanLeaderboard } from '@/lib/data/mock'
import { useFanProfile } from '@/lib/fan'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

type Tab = 'xp' | 'precision'

export default function ClassementsPage() {
  const { profile, ready } = useFanProfile()
  const [tab, setTab] = useState<Tab>('xp')
  if (!ready) return null

  const correct = profile ? Object.values(profile.quizAnswered).filter(Boolean).length : 0
  const answered = profile ? Object.values(profile.quizAnswered).length : 0
  const myAccuracy = answered ? Math.round((correct / answered) * 100) : 0

  const rows = [
    ...mockFanLeaderboard.map((r) => ({ ...r, mine: false })),
    ...(profile ? [{ pseudo: profile.pseudo, cityId: profile.cityId, xp: profile.xp, accuracyPct: myAccuracy, mine: true }] : []),
  ].sort((a, b) => (tab === 'xp' ? b.xp - a.xp : b.accuracyPct - a.accuracyPct))

  return (
    <main>
      <PageHero
        eyebrow="📊 Fan Arena"
        title="Classements"
        subtitle="Classement communautaire par XP et par précision de pronostics. Consultez aussi les classements par ville, club, association ou entreprise depuis votre Fan ID."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Classements' }]}
      />

      <section className="page-section tight">
        <div className="tab-bar">
          <button type="button" className={tab === 'xp' ? 'tab active' : 'tab'} onClick={() => setTab('xp')}>Par XP</button>
          <button type="button" className={tab === 'precision' ? 'tab active' : 'tab'} onClick={() => setTab('precision')}>Précision des pronostics</button>
        </div>

        <div className="rank-podium-list" style={{ marginTop: 20 }}>
          {rows.slice(0, 20).map((r, i) => (
            <div className={`rank-podium-row${r.mine ? ' me' : ''}`} key={`${r.pseudo}-${i}`}>
              <span className={`rank-badge${i < 3 ? ` podium-${i + 1}` : ''}`}>{i + 1}</span>
              <div style={{ flex: 1 }}>
                <strong>{r.pseudo}{r.mine ? ' (vous)' : ''}</strong>
                <span className="muted-sm" style={{ display: 'block' }}>{cityName(r.cityId)}</span>
              </div>
              <span className="status-pill ok">{tab === 'xp' ? `${r.xp.toLocaleString('fr-FR')} XP` : `${r.accuracyPct}% de précision`}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
