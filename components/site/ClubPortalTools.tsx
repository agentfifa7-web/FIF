'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Circle, UserPlus } from 'lucide-react'
import { TEAM_CATEGORIES, addRosterPlayer, toggleTeamCategory, useClubPortal } from '@/lib/clubPortal'
import { formatDate } from '@/lib/format'

export function ClubPortalTeams() {
  const { teams, ready } = useClubPortal()
  if (!ready) return null
  return (
    <div className="checkin-list">
      {TEAM_CATEGORIES.map((cat) => {
        const active = teams.includes(cat)
        return (
          <button type="button" key={cat} className={`checkin-row${active ? ' done' : ''}`} style={{ appearance: 'none', cursor: 'pointer', font: 'inherit', textAlign: 'left', width: '100%' }} onClick={() => toggleTeamCategory(cat)}>
            {active ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            <div><strong>{cat}</strong><span>{active ? 'Équipe active cette saison' : 'Cliquez pour activer cette catégorie'}</span></div>
          </button>
        )
      })}
    </div>
  )
}

export function ClubPortalRoster() {
  const { roster, ready } = useClubPortal()
  const [name, setName] = useState('')
  const [position, setPosition] = useState('Milieu')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    addRosterPlayer(name.trim(), position)
    setName('')
  }

  return (
    <>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <input type="text" required placeholder="Nom du joueur" value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1, minWidth: 160, border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', font: 'inherit' }} />
        <select value={position} onChange={(e) => setPosition(e.target.value)} style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', font: 'inherit' }}>
          {['Gardien', 'Défenseur', 'Milieu', 'Attaquant'].map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <button type="submit" className="button-outline"><UserPlus size={14} /> Ajouter au dossier</button>
      </form>
      {ready && roster.length > 0 && (
        <div className="dashboard-list">
          {roster.map((r) => (
            <div key={r.id}>
              <div><b>{r.name}</b><small>{r.position} · ajouté le {formatDate(r.addedAt)}</small></div>
              <span className="status-pill pending">Dossier à instruire</span>
            </div>
          ))}
        </div>
      )}
      <div className="button-group" style={{ marginTop: 16 }}>
        <Link href="/licences" className="button-outline">Demander une licence</Link>
        <Link href="/transferts" className="button-outline">Demander un transfert</Link>
      </div>
    </>
  )
}
