'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Player } from '@/lib/data/types'
import { clubs, competitions, getClubById } from '@/lib/data/mock'
import { PlayerCard } from './cards'
import { EmptyState, FilterSelect } from './widgets'

const LEAGUE_PRIORITY = ['comp-l1', 'comp-l2', 'comp-fem', 'comp-u20', 'comp-futsal', 'comp-beach']
const LEAGUE_LABEL_OVERRIDE: Record<string, string> = {
  'comp-u20': 'Football des jeunes — U20 / U17',
}

function primaryLeagueId(club: { competitionIds: string[] }) {
  for (const id of LEAGUE_PRIORITY) {
    if (club.competitionIds.includes(id)) return id
  }
  return 'autre'
}

export function PlayerExplorer({ players }: { players: Player[] }) {
  const [q, setQ] = useState('')
  const [position, setPosition] = useState('Tous')
  const [gender, setGender] = useState('Tous')

  const filtered = useMemo(() => {
    return players.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false
      if (position !== 'Tous' && p.position !== position) return false
      if (gender !== 'Tous' && p.gender !== gender) return false
      return true
    })
  }, [players, q, position, gender])

  const searching = q.trim().length > 0
  const flatResults = filtered.slice(0, 60)

  const grouped = useMemo(() => {
    if (searching) return []
    const byClub = new Map<string, Player[]>()
    for (const p of filtered) {
      byClub.set(p.clubId, [...(byClub.get(p.clubId) ?? []), p])
    }
    const byLeague = new Map<string, { club: (typeof clubs)[number]; players: Player[] }[]>()
    for (const club of clubs) {
      const roster = byClub.get(club.id)
      if (!roster || !roster.length) continue
      const league = primaryLeagueId(club)
      byLeague.set(league, [...(byLeague.get(league) ?? []), { club, players: roster }])
    }
    return [...LEAGUE_PRIORITY, 'autre']
      .filter((id) => byLeague.has(id))
      .map((id) => ({
        id,
        label: LEAGUE_LABEL_OVERRIDE[id] ?? competitions.find((c) => c.id === id)?.name ?? 'Autres clubs',
        clubGroups: byLeague.get(id)!,
      }))
  }, [filtered, searching])

  return (
    <div>
      <div className="filter-bar">
        <label className="filter-select" style={{ minWidth: 220 }}>
          <span>Nom du joueur</span>
          <input className="text-field-input" style={{ background: '#fff', border: '1px solid var(--line)', padding: '10px 12px' }} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher…" />
        </label>
        <FilterSelect label="Poste" value={position} options={['Tous', 'Gardien', 'Défenseur', 'Milieu', 'Attaquant']} onChange={setPosition} />
        <FilterSelect label="Genre" value={gender} options={['Tous', 'M', 'F']} onChange={setGender} />
      </div>
      {!filtered.length && <EmptyState title="Aucun joueur trouvé" hint="Essayez un autre nom ou filtre." />}

      {searching ? (
        <>
          <div className="card-grid cols-4">
            {flatResults.map((p) => <PlayerCard key={p.id} player={p} />)}
          </div>
          {filtered.length > 60 && (
            <p className="lede" style={{ marginTop: 20 }}>Affichage des 60 premiers résultats sur {filtered.length} — affinez votre recherche pour aller plus loin.</p>
          )}
        </>
      ) : (
        grouped.map((league) => (
          <div key={league.id} style={{ marginBottom: 40 }}>
            <p className="section-tag">{league.label}</p>
            {league.clubGroups.map(({ club, players: roster }) => (
              <div key={club.id} style={{ marginBottom: 24, marginTop: 16 }}>
                <div style={{ alignItems: 'center', display: 'flex', gap: 10, marginBottom: 12 }}>
                  <b style={{ fontSize: 13, letterSpacing: '.02em' }}>{club.name}</b>
                  <span style={{ color: 'var(--muted)', fontSize: 11 }}>{roster.length} joueur{roster.length > 1 ? 's' : ''}</span>
                </div>
                <div className="card-grid cols-4">
                  {roster.slice(0, 4).map((p) => <PlayerCard key={p.id} player={p} />)}
                </div>
                {roster.length > 4 && (
                  <Link href={`/clubs/${club.slug}`} className="text-link" style={{ display: 'inline-flex', marginTop: 12 }}>
                    Voir les {roster.length} joueurs de {club.shortName} →
                  </Link>
                )}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  )
}
