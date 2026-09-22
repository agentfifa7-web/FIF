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
  built: number
  video360Url: string
}

export interface HonourRecord {
  competition: string
  year: number
  result: 'Champion' | 'Finaliste' | 'Demi-finaliste' | 'Qualifié' | 'Podium (3e)'
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
  achievements: HonourRecord[]
}

export interface Coach {
  id: string
  slug: string
  name: string
  clubId: string | null
  nationalTeamId: string | null
  license: 'CAF Pro' | 'CAF A' | 'CAF B' | 'CAF C'
  since: number
  fifId: string
  birthdate: string
  bio: string
  history: { clubId: string; from: number; to: number | null }[]
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
  fifId: string
  birthdate: string
  bio: string
  trainings: { title: string; date: string }[]
}

export interface Official {
  id: string
  slug: string
  name: string
  role: 'Président de club' | 'Secrétaire général' | 'Délégué de match' | 'Commissaire au match'
  clubId: string | null
  fifId: string
  birthdate: string
  bio: string
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
  birthdate: string
  bio: string
}

export interface PlayerAttributes {
  technical: Record<string, number>
  mental: Record<string, number>
  physical: Record<string, number>
}

export interface PositionFamiliarity {
  position: string
  familiarity: number
}

export interface ScoutReport {
  pros: string[]
  cons: string[]
  summary: string
}

export interface SeasonStat {
  season: string
  competition: string
  matches: number
  goals: number
  assists: number
  avgRating: number
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
  marketValue: number
  monthlySalary: number
  contractUntil: string
  preferredPositions: PositionFamiliarity[]
  currentAbilityStars: number
  potentialAbilityStars: number
  personality: string
  statusFlags: string[]
  attributes: PlayerAttributes
  traits: string[]
  scoutReport: ScoutReport
  seasonStats: SeasonStat[]
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
  achievements: HonourRecord[]
}

export interface PresidentPromise {
  id: string
  title: string
  description: string
  commissionId: string
  progress: number
  status: 'Réalisée' | 'En cours' | 'Planifiée'
}

export interface Commission {
  id: string
  slug: string
  name: string
  mission: string
}

export interface ExecutiveMember {
  id: string
  slug: string
  name: string
  role: string
  commissionIds: string[]
  since: number
  bio: string
}

export interface OfficialDocument {
  id: string
  slug: string
  title: string
  organization: 'FIF' | 'CAF' | 'FIFA'
  category: string
  date: string
  summary: string
}

export interface TransparencyRecord {
  id: string
  slug: string
  title: string
  category: 'Rapport' | 'Budget' | 'Décision' | 'Appel d’offres' | 'Statistique institutionnelle'
  date: string
  summary: string
  amount?: string
}

export interface Competition {
  id: string
  slug: string
  name: string
  category: 'Seniors' | 'Féminin' | 'Jeunes' | 'Futsal' | 'Beach Soccer'
  practice: 'Professionnel' | 'Amateur' | null
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
  delegateId: string | null
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

// ---------------------------------------------------------------------------
// FIF Fan Universe — programme fan / gamification (données de catalogue ;
// l'état propre à chaque supporter — XP, badges obtenus, réponses — vit côté
// client dans le navigateur, voir lib/fan.ts)
// ---------------------------------------------------------------------------
export interface FanLevel {
  id: string
  order: number
  name: string
  icon: string
  minXp: number
  perks: string[]
}

export interface XpAction {
  id: string
  label: string
  xp: number
}

export interface FanBadge {
  id: string
  slug: string
  category: 'Supporter' | 'Historique' | 'Social' | 'Saison'
  name: string
  icon: string
  description: string
  xpReward: number
}

export interface QuizQuestion {
  id: string
  category: 'Éléphants' | 'Expert Foot' | 'Clubs' | 'Stades'
  difficulty: 'Débutant' | 'Amateur' | 'Passionné' | 'Expert' | 'Légende'
  question: string
  choices: string[]
  answerIndex: number
  explanation: string
}

export interface FanClubAssociation {
  id: string
  slug: string
  name: string
  cityId: string
  founded: number
  members: number
  description: string
}

export interface PartnerOffer {
  id: string
  slug: string
  partner: string
  category: 'Restauration' | 'Transport' | 'Télécoms' | 'Banque' | 'Loisirs' | 'Hôtellerie'
  title: string
  discount: string
  minLevelOrder: number
  expiresAt: string
}

export interface ChantEntry {
  id: string
  slug: string
  title: string
  category: 'Éléphants' | 'Club' | 'Historique' | 'Régional'
  origin: string
  occasion: string
  lyricsAvailable: boolean
}

export interface DigitalCard {
  id: string
  slug: string
  collection: 'Éléphants' | 'Légendes' | 'Stades' | 'Trophées' | 'Compétitions'
  name: string
  rarity: 'Commune' | 'Rare' | 'Légendaire'
  unlockedBy: string
  description: string
}

export interface RewardEntry {
  id: string
  slug: string
  category: 'Digital' | 'Expériences' | 'Produits' | 'Billetterie'
  title: string
  description: string
  xpCost: number
  minLevelOrder: number
}

export interface FanZonePost {
  id: string
  authorName: string
  authorCityId: string
  type: 'Photo' | 'Vidéo' | 'Chant' | 'Message' | 'Tifo'
  caption: string
  date: string
  likes: number
}
