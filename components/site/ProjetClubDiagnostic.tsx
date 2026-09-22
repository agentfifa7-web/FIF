'use client'

import { CheckCircle2, Circle } from 'lucide-react'
import { PROJET_MODULES, toggleItem, moduleProgress, overallProgress, useProjetClub } from '@/lib/projetClub'

export function ProjetClubScore() {
  const { checked, ready } = useProjetClub()
  if (!ready) return null
  const score = overallProgress(checked)
  return (
    <div className="fan-id-card" style={{ maxWidth: 380 }}>
      <div className="fan-id-card-top"><span>Indicateur de structuration</span></div>
      <div className="fan-id-card-body" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <strong style={{ fontSize: 32 }}>{score}%</strong>
        <span>du plan d’action complété</span>
      </div>
      <div style={{ padding: '0 0 18px' }}>
        <div className="gauge-track"><div className="gauge-fill" style={{ width: `${score}%` }} /></div>
      </div>
    </div>
  )
}

export function ProjetClubModules() {
  const { checked, ready } = useProjetClub()
  if (!ready) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {PROJET_MODULES.map((mod) => {
        const pct = moduleProgress(checked, mod)
        return (
          <div className="entity-card" style={{ flexDirection: 'column', alignItems: 'stretch', padding: 22 }} key={mod.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <strong>{mod.label}</strong>
              <span className="status-pill ok">{pct}%</span>
            </div>
            <div className="gauge-track" style={{ marginBottom: 14 }}><div className="gauge-fill" style={{ width: `${pct}%` }} /></div>
            <div className="checkin-list">
              {mod.items.map((item) => {
                const id = `${mod.key}::${item}`
                const done = Boolean(checked[id])
                return (
                  <button type="button" key={id} className={`checkin-row${done ? ' done' : ''}`} style={{ appearance: 'none', cursor: 'pointer', font: 'inherit', textAlign: 'left', width: '100%' }} onClick={() => toggleItem(mod.key, item)}>
                    {done ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    <div><span>{item}</span></div>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
