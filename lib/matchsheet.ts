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

import { cmsRuntime } from '@/lib/cms/runtime'

// Les feuilles de match sont enregistrées sur le serveur par l'administration
// (voir app/admin/actions.ts) et transmises à toutes les pages avec les autres
// données du back-office.
export const MATCHSHEET_EVENT = 'fif-matchsheet-updated'

export function getMatchSheets(): Record<string, MatchSheetOverride> {
  return cmsRuntime.sheets
}

export function getMatchSheet(matchId: string): MatchSheetOverride | null {
  return cmsRuntime.sheets[matchId] ?? null
}
