'use client'

import { fanLevels, xpActions } from '@/lib/data/mock'
import { useFanProfile, fanLevelProgress } from '@/lib/fan'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

export default function NiveauxPage() {
  const { profile, ready } = useFanProfile()
  if (!ready) return null
  const currentOrder = profile ? fanLevelProgress(profile.xp).level.order : 0

  return (
    <main>
      <PageHero
        eyebrow="🏆 Fan Pass"
        title="Niveaux & points XP"
        subtitle="Gagnez de l’XP en participant positivement à la vie du football ivoirien. Aucun argent réel n’est jamais gagné ou misé."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Niveaux' }]}
        meta={profile ? [{ value: String(profile.xp), label: 'Votre XP' }, { value: fanLevelProgress(profile.xp).level.name, label: 'Votre niveau' }] : undefined}
      />

      <section className="page-section tight">
        <p className="section-tag">Échelle de progression</p>
        <div className="level-ladder" style={{ marginTop: 16 }}>
          {fanLevels.map((l) => (
            <div className={`level-row${l.order === currentOrder ? ' current' : ''}`} key={l.id}>
              <span className="level-icon">{l.icon}</span>
              <div>
                <strong>Niveau {l.order} — {l.name}</strong>
                <span>Dès {l.minXp.toLocaleString('fr-FR')} XP · {l.perks.join(' · ')}</span>
              </div>
              {l.order === currentOrder && <span className="status-pill ok">Votre niveau</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="page-section tight dark-section">
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Comment gagner de l’XP</p>
        <div className="card-grid cols-2" style={{ marginTop: 16 }}>
          {xpActions.map((a) => (
            <div className="entity-card" key={a.id}>
              <div><strong>{a.label}</strong></div>
              <span className="status-pill ok">+{a.xp} XP</span>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
