'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Agent, Coach, Official, Referee } from '@/lib/data/types'
import { getClubById } from '@/lib/data/mock'
import { Tabs, EmptyState } from './widgets'
import { PersonPortrait } from './PersonPortrait'

const ROLES = ['Entraîneurs', 'Arbitres', 'Dirigeants', 'Agents'] as const
const ROLE_PATH: Record<(typeof ROLES)[number], string> = {
  Entraîneurs: 'entraineurs',
  Arbitres: 'arbitres',
  Dirigeants: 'dirigeants',
  Agents: 'agents',
}

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
            <Link href={`/officiels/${ROLE_PATH[role]}/${c.slug}`} className="entity-card" key={c.id}>
              <PersonPortrait seed={c.name} size={44} />
              <div><strong>{c.name}</strong><span>{club?.name ?? 'Sélection nationale'} · Licence {c.license} · depuis {c.since}</span></div>
            </Link>
          )
        })}
        {role === 'Arbitres' && referees.map((r) => (
          <Link href={`/officiels/${ROLE_PATH[role]}/${r.slug}`} className="entity-card" key={r.id}>
            <PersonPortrait seed={r.name} size={44} />
            <div><strong>{r.name}</strong><span>{r.category} · {r.matchesOfficiated} matchs arbitrés</span></div>
            <span className={`status-pill ${r.status === 'Actif' ? 'ok' : r.status === 'Suspendu' ? 'error' : 'neutral'}`}>{r.status}</span>
          </Link>
        ))}
        {role === 'Dirigeants' && officials.map((o) => {
          const club = o.clubId ? getClubById(o.clubId) : null
          return (
            <Link href={`/officiels/${ROLE_PATH[role]}/${o.slug}`} className="entity-card" key={o.id}>
              <PersonPortrait seed={o.name} size={44} />
              <div><strong>{o.name}</strong><span>{o.role}{club ? ` · ${club.name}` : ''}</span></div>
            </Link>
          )
        })}
        {role === 'Agents' && agents.map((a) => (
          <Link href={`/officiels/${ROLE_PATH[role]}/${a.slug}`} className="entity-card" key={a.id}>
            <PersonPortrait seed={a.name} size={44} />
            <div><strong>{a.name}</strong><span>{a.fifId} · {a.playerIds.length} joueur(s) représenté(s)</span></div>
            <span className={`status-pill ${a.status === 'Actif' ? 'ok' : 'error'}`}>{a.status}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
