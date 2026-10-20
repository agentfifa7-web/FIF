'use client'

import { useState } from 'react'
import { cityName, mockFanLeaderboard } from '@/lib/data/mock'
import { useFanProfile } from '@/lib/fan'
import { PageHero } from '@/components/site/PageHero'

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
        eyebrow="Fan Arena"
        title="Classements"
        subtitle="Classement par XP et par précision des pronostics."
        noPhotos
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Classements' }]}
      />

      <section className="page-section tight">
        <div className="tab-bar">
          <button type="button" className={tab === 'xp' ? 'tab active' : 'tab'} onClick={() => setTab('xp')}>Par XP</button>
          <button type="button" className={tab === 'precision' ? 'tab active' : 'tab'} onClick={() => setTab('precision')}>Précision des pronostics</button>
        </div>

        {rows.length === 0 && (
          <div className="empty-state" style={{ marginTop: 20 }}>
            <strong>Aucun classement à afficher</strong>
            <p>Le classement communautaire sera publié lorsque les comptes supporters seront raccordés aux serveurs de la FIF. Connectez-vous pour voir votre propre score.</p>
          </div>
        )}
        {rows.length > 0 && !mockFanLeaderboard.length && <p className="muted-sm" style={{ marginTop: 16 }}>Seul votre score, enregistré dans ce navigateur, est affiché pour l’instant.</p>}
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

    </main>
  )
}
