'use client'

import { useMemo, useState } from 'react'
import type { Player } from '@/lib/data/types'
import { PlayerCard } from './cards'
import { EmptyState, FilterSelect } from './widgets'

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
    }).slice(0, 60)
  }, [players, q, position, gender])

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
      <div className="card-grid cols-4">
        {filtered.map((p) => <PlayerCard key={p.id} player={p} />)}
      </div>
      {players.length > 60 && filtered.length === 60 && (
        <p className="lede" style={{ marginTop: 20 }}>Affichage des 60 premiers résultats sur {players.length} joueurs enregistrés — affinez votre recherche pour aller plus loin.</p>
      )}
    </div>
  )
}
