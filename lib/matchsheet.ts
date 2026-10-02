export interface MatchSheetGoal {
  minute: number
  team: 'home' | 'away'
  playerId: string
  playerName: string
}

export interface MatchSheetCard {
  minute: number
  team: 'home' | 'away'
  playerId: string
  playerName: string
  type: 'yellow' | 'red'
}

/** Joueur inscrit sur la feuille de match (effectif enregistré ou ajouté à la main). */
export interface MatchSheetPlayer {
  id: string
  name: string
  number?: number
  position?: string
  starter: boolean
  captain?: boolean
}

export interface MatchSheetSubstitution {
  minute: number
  team: 'home' | 'away'
  outId: string
  outName: string
  inId: string
  inName: string
}

export interface MatchSheetOverride {
  matchId: string
  homeScore: number
  awayScore: number
  attendance: number | null
  /** Listes des joueurs des deux équipes (titulaires et remplaçants). */
  lineups?: { home: MatchSheetPlayer[]; away: MatchSheetPlayer[] }
  substitutions?: MatchSheetSubstitution[]
  goals: MatchSheetGoal[]
  cards: MatchSheetCard[]
  submittedBy: string
  submittedAt: string
}

const STORAGE_KEY = 'fif-matchsheets-v1'
export const MATCHSHEET_EVENT = 'fif-matchsheet-updated'

export function getMatchSheets(): Record<string, MatchSheetOverride> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function getMatchSheet(matchId: string): MatchSheetOverride | null {
  return getMatchSheets()[matchId] ?? null
}

export function saveMatchSheet(sheet: MatchSheetOverride) {
  if (typeof window === 'undefined') return
  const all = getMatchSheets()
  all[sheet.matchId] = sheet
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  window.dispatchEvent(new CustomEvent(MATCHSHEET_EVENT, { detail: sheet }))
}
