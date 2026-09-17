'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Agent, Coach, Official, Referee } from '@/lib/data/types'
import { getClubById } from '@/lib/data/mock'
import { Tabs, EmptyState } from './widgets'

const ROLES = ['Entraîneurs', 'Arbitres', 'Dirigeants', 'Agents'] as const

export function OfficialsDirectory({
  coaches,
  referees,
  officials,
  agents,
  initialRole,
}: {
  coaches: Coach[]
  referees: Referee[]
  officials: Official[]
  agents: Agent[]
  initialRole?: string
}) {
  const initial = initialRole === 'arbitres' ? 'Arbitres' : initialRole === 'dirigeants' ? 'Dirigeants' : initialRole === 'agents' ? 'Agents' : 'Entraîneurs'
  const [role, setRole] = useState<(typeof ROLES)[number]>(initial as (typeof ROLES)[number])

  const list = useMemo(() => {
    if (role === 'Entraîneurs') return coaches
    if (role === 'Arbitres') return referees
    if (role === 'Dirigeants') return officials
    return agents
  }, [role, coaches, referees, officials, agents])

  return (
    <div>
      <Tabs tabs={[...ROLES]} active={role} onChange={(t) => setRole(t as (typeof ROLES)[number])} />
      {!list.length && <EmptyState title="Aucune fiche disponible" />}
      <div className="card-grid">
        {role === 'Entraîneurs' && coaches.map((c) => {
          const club = c.clubId ? getClubById(c.clubId) : null
          return (
            <div className="entity-card" key={c.id}>
              <div><strong>{c.name}</strong><span>{club?.name ?? 'Sélection nationale'} · Licence {c.license} · depuis {c.since}</span></div>
            </div>
          )
        })}
        {role === 'Arbitres' && referees.map((r) => (
          <div className="entity-card" key={r.id}>
            <div><strong>{r.name}</strong><span>{r.category} · {r.matchesOfficiated} matchs arbitrés</span></div>
            <span className={`status-pill ${r.status === 'Actif' ? 'ok' : r.status === 'Suspendu' ? 'error' : 'neutral'}`}>{r.status}</span>
          </div>
        ))}
        {role === 'Dirigeants' && officials.map((o) => {
          const club = o.clubId ? getClubById(o.clubId) : null
          return (
            <div className="entity-card" key={o.id}>
              <div><strong>{o.name}</strong><span>{o.role}{club ? ` · ${club.name}` : ''}</span></div>
            </div>
          )
        })}
        {role === 'Agents' && agents.map((a) => (
          <div className="entity-card" key={a.id}>
            <div><strong>{a.name}</strong><span>{a.fifId} · {a.playerIds.length} joueur(s) représenté(s)</span></div>
            <span className={`status-pill ${a.status === 'Actif' ? 'ok' : 'error'}`}>{a.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
