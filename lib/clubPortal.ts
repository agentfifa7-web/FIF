import { useEffect, useState } from 'react'

// État local du Portail Clubs (démonstration) : joueurs ajoutés manuellement
// par le club et activation des catégories d'équipes. Même schéma que les
// autres modules localStorage de la plateforme.

export interface RosterAddition {
  id: string
  name: string
  position: string
  addedAt: string
}

const ROSTER_KEY = 'fif-club-roster-additions-v1'
const TEAMS_KEY = 'fif-club-teams-v1'
export const CLUB_PORTAL_EVENT = 'fif-club-portal-updated'

export const TEAM_CATEGORIES = ['Senior', 'Réserve', 'U20', 'U18', 'U17', 'U15', 'Féminine', 'Futsal'] as const

function loadRoster(): RosterAddition[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(window.localStorage.getItem(ROSTER_KEY) ?? '[]') } catch { return [] }
}

function loadTeams(): string[] {
  if (typeof window === 'undefined') return ['Senior']
  try { return JSON.parse(window.localStorage.getItem(TEAMS_KEY) ?? '["Senior"]') } catch { return ['Senior'] }
}

export function addRosterPlayer(name: string, position: string): RosterAddition {
  const list = loadRoster()
  const entry: RosterAddition = { id: `add-${Date.now()}`, name, position, addedAt: new Date().toISOString() }
  const next = [entry, ...list]
  window.localStorage.setItem(ROSTER_KEY, JSON.stringify(next))
  window.dispatchEvent(new CustomEvent(CLUB_PORTAL_EVENT))
  return entry
}

export function toggleTeamCategory(category: string) {
  const teams = loadTeams()
  const next = teams.includes(category) ? teams.filter((t) => t !== category) : [...teams, category]
  window.localStorage.setItem(TEAMS_KEY, JSON.stringify(next))
  window.dispatchEvent(new CustomEvent(CLUB_PORTAL_EVENT))
}

export function useClubPortal() {
  const [roster, setRoster] = useState<RosterAddition[]>([])
  const [teams, setTeams] = useState<string[]>(['Senior'])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const sync = () => { setRoster(loadRoster()); setTeams(loadTeams()); setReady(true) }
    sync()
    window.addEventListener(CLUB_PORTAL_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(CLUB_PORTAL_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return { roster, teams, ready }
}
