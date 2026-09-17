export type Gender = 'M' | 'F' | 'Mixte'

export interface Region {
  id: string
  name: string
}

export interface City {
  id: string
  name: string
  regionId: string
}

export interface Stadium {
  id: string
  slug: string
  name: string
  cityId: string
  capacity: number
  surface: 'Pelouse naturelle' | 'Pelouse hybride' | 'Synthétique'
  lighting: boolean
  changingRooms: number
  image: string
}

export interface Club {
  id: string
  slug: string
  name: string
  shortName: string
  cityId: string
  stadiumId: string
  founded: number
  president: string
  colors: [string, string]
  crestInitials: string
  gender: Gender
  category: 'Professionnel' | 'Amateur' | 'Jeunes' | 'Féminin' | 'Futsal'
  competitionIds: string[]
  website: string
  honours: { title: string; count: number }[]
}

export interface Coach {
  id: string
  slug: string
  name: string
  clubId: string | null
  nationalTeamId: string | null
  license: 'CAF Pro' | 'CAF A' | 'CAF B' | 'CAF C'
  since: number
}

export interface Referee {
  id: string
  slug: string
  name: string
  category: 'FIFA' | 'Fédérale 1' | 'Fédérale 2' | 'Régionale'
  regionId: string
  gender: Gender
  status: 'Actif' | 'Suspendu' | 'Retraité'
  matchesOfficiated: number
}

export interface Official {
  id: string
  slug: string
  name: string
  role: 'Président de club' | 'Secrétaire général' | 'Délégué de match' | 'Commissaire au match'
  clubId: string | null
}

export interface Agent {
  id: string
  slug: string
  name: string
  fifId: string
  license: string
  status: 'Actif' | 'Suspendu'
  validUntil: string
  playerIds: string[]
}

export interface Player {
  id: string
  slug: string
  name: string
  photoSeed: string
  position: 'Gardien' | 'Défenseur' | 'Milieu' | 'Attaquant'
  clubId: string
  gender: Gender
  birthdate: string
  nationality: string
  fifId: string
  licenseStatus: 'Valide' | 'En attente' | 'Expirée'
  stats: { matches: number; minutes: number; goals: number; assists: number; yellow: number; red: number }
  history: { clubId: string; from: number; to: number | null }[]
  nationalSelections: { teamId: string; caps: number; goals: number }[]
}

export interface Academy {
  id: string
  slug: string
  name: string
  cityId: string
  founded: number
  status: 'Agréée FIF' | 'En cours d’agrément'
  categories: string[]
}

export interface NationalTeam {
  id: string
  slug: string
  name: string
  gender: Gender
  category: string
  coachId: string | null
  ranking?: number
  honours: { title: string; year: number }[]
}

export interface Competition {
  id: string
  slug: string
  name: string
  category: 'Seniors' | 'Féminin' | 'Jeunes' | 'Futsal' | 'Beach Soccer'
  gender: Gender
  season: string
  clubIds: string[]
  format: string
  logoInitials: string
}

export interface StandingRow {
  clubId: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  points: number
}

export type MatchEventType = 'goal' | 'yellow' | 'red' | 'sub' | 'var' | 'ht' | 'ft' | 'kickoff'

export interface MatchEvent {
  minute: number
  type: MatchEventType
  team: 'home' | 'away'
  playerId?: string
  detail?: string
}

export interface Match {
  id: string
  competitionId: string
  matchday: number
  homeClubId: string
  awayClubId: string
  stadiumId: string
  date: string
  status: 'À venir' | 'Live' | 'Terminé' | 'Reporté'
  minute?: number
  homeScore: number | null
  awayScore: number | null
  events: MatchEvent[]
  refereeId: string
  attendance?: number
}

export interface Article {
  id: string
  slug: string
  title: string
  category: string
  excerpt: string
  body: string[]
  author: string
  date: string
  image: string
  tags: string[]
  featured?: boolean
}

export interface Video {
  id: string
  slug: string
  title: string
  category: string
  duration: string
  date: string
  image: string
}

export interface TicketEvent {
  id: string
  matchId: string
  categories: { name: string; price: number; available: number }[]
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  colors: string[]
  sizes: string[]
  image: string
  customizable: boolean
}

export interface TrainingCourse {
  id: string
  slug: string
  title: string
  audience: string
  level: string
  duration: string
  location: string
  dates: string
  price: string
  seats: number
  modules: string[]
}
