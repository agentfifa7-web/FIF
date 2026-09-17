import { makeRng, slugify } from './rng'
import type {
  Academy,
  Agent,
  Article,
  City,
  Club,
  Coach,
  Competition,
  Match,
  MatchEvent,
  NationalTeam,
  Official,
  Player,
  Product,
  Referee,
  Region,
  Stadium,
  StandingRow,
  TicketEvent,
  TrainingCourse,
  Video,
} from './types'

export const IS_DEMO_DATA = true

const rng = makeRng(20260917)

// ---------------------------------------------------------------------------
// Geography
// ---------------------------------------------------------------------------
export const regions: Region[] = [
  { id: 'r-abidjan', name: 'District Autonome d’Abidjan' },
  { id: 'r-yamoussoukro', name: 'District Autonome de Yamoussoukro' },
  { id: 'r-gbeke', name: 'Gbêké' },
  { id: 'r-haut-sassandra', name: 'Haut-Sassandra' },
  { id: 'r-poro', name: 'Poro' },
  { id: 'r-tonkpi', name: 'Tonkpi' },
  { id: 'r-goh', name: 'Gôh' },
  { id: 'r-indenie-djuablin', name: 'Indénié-Djuablin' },
  { id: 'r-bounkani', name: 'Bounkani' },
  { id: 'r-bas-sassandra', name: 'Bas-Sassandra' },
]

export const cities: City[] = [
  { id: 'c-abidjan', name: 'Abidjan', regionId: 'r-abidjan' },
  { id: 'c-yamoussoukro', name: 'Yamoussoukro', regionId: 'r-yamoussoukro' },
  { id: 'c-bouake', name: 'Bouaké', regionId: 'r-gbeke' },
  { id: 'c-daloa', name: 'Daloa', regionId: 'r-haut-sassandra' },
  { id: 'c-korhogo', name: 'Korhogo', regionId: 'r-poro' },
  { id: 'c-man', name: 'Man', regionId: 'r-tonkpi' },
  { id: 'c-gagnoa', name: 'Gagnoa', regionId: 'r-goh' },
  { id: 'c-abengourou', name: 'Abengourou', regionId: 'r-indenie-djuablin' },
  { id: 'c-bondoukou', name: 'Bondoukou', regionId: 'r-bounkani' },
  { id: 'c-san-pedro', name: 'San-Pédro', regionId: 'r-bas-sassandra' },
]

function cityName(id: string) {
  return cities.find((c) => c.id === id)?.name ?? id
}

// ---------------------------------------------------------------------------
// Stadiums
// ---------------------------------------------------------------------------
const stadiumRoots = [
  'Stade Municipal', 'Stade Olympique', 'Arena de la Paix', 'Stade de la Renaissance',
  'Complexe Sportif', 'Stade des Lagunes', 'Stade du Cinquantenaire', 'Stade de l’Amitié',
  'Arena du Bandama', 'Stade de la Liberté', 'Stade des Éléphants', 'Stade Houphouët-Boigny',
]

export const stadiums: Stadium[] = cities.flatMap((city, ci) =>
  Array.from({ length: 4 }, (_, i) => {
    const name = `${rng.pick(stadiumRoots)} de ${city.name}${i > 0 ? ` ${i + 1}` : ''}`
    const id = `st-${ci}-${i}`
    return {
      id,
      slug: slugify(name) + `-${ci}${i}`,
      name,
      cityId: city.id,
      capacity: rng.int(3, 60) * 1000,
      surface: rng.pick(['Pelouse naturelle', 'Pelouse hybride', 'Synthétique'] as const),
      lighting: rng.bool(0.7),
      changingRooms: rng.int(2, 6),
      image: `https://picsum.photos/seed/${id}/900/560`,
    }
  }),
)

// ---------------------------------------------------------------------------
// Names
// ---------------------------------------------------------------------------
const firstNamesM = [
  'Yao', 'Kouassi', 'Adama', 'Ibrahim', 'Franck', 'Serge', 'Wilfried', 'Emmanuel', 'Christian', 'Lassina',
  'Mamadou', 'Siaka', 'Souleymane', 'Aboubakar', 'Jean-Marc', 'Didier', 'Gervais', 'Cyrille', 'Bakary', 'Moussa',
  'Fousseni', 'Armand', 'Régis', 'Prosper', 'Ismaël', 'Ousmane', 'Konan', 'Brice', 'Landry', 'Eric',
]
const firstNamesF = [
  'Aminata', 'Fatoumata', 'Awa', 'Mariam', 'Ange', 'Christelle', 'Estelle', 'Sandrine', 'Clarisse', 'Nadège',
  'Josiane', 'Aya', 'Affoué', 'Akissi', 'Adjoua', 'Rokia', 'Nafissatou', 'Léa', 'Grace', 'Solange',
]
const lastNames = [
  'Kouassi', 'Koné', 'Traoré', 'Diabaté', 'Bamba', 'Ouattara', 'Yao', 'Kouadio', 'N’Guessan', 'Aka',
  'Diarrassouba', 'Coulibaly', 'Touré', 'Doumbia', 'Bakayoko', 'Zadi', 'Gnahoré', 'Kra', 'Assamoi', 'Brou',
  'Kablan', 'Angoua', 'Silué', 'Sangaré', 'Fofana', 'Djédjé', 'Yéo', 'Ballo', 'Soro', 'Tanoh',
]

function fullName(gender: 'M' | 'F' = 'M') {
  const first = rng.pick(gender === 'F' ? firstNamesF : firstNamesM)
  const last = rng.pick(lastNames)
  return `${first} ${last}`
}

// ---------------------------------------------------------------------------
// Clubs
// ---------------------------------------------------------------------------
const clubPrefixes = ['AS', 'FC', 'ASC', 'Racing Club', 'Étoile', 'Renaissance', 'Sporting', 'USC', 'Jeunesse', 'Avenir', 'Éclair', 'Union']
const clubSuffixes = ['Lagunes', 'Comoé', 'Bandama', 'Baoulé', 'Cavally', 'Denguélé', 'Marahoué', 'Agnéby', 'Nzi', 'Sassandra', 'Gôh', 'Zanzan']

function makeClubName(city: string, used: Set<string>) {
  let name = ''
  do {
    name = rng.bool(0.5)
      ? `${rng.pick(clubPrefixes)} ${city}`
      : `${rng.pick(clubPrefixes)} ${rng.pick(clubSuffixes)}`
  } while (used.has(name))
  used.add(name)
  return name
}

const usedClubNames = new Set<string>()
const clubColorPairs: [string, string][] = [
  ['#087443', '#ffffff'], ['#ff7a00', '#041b12'], ['#041b12', '#ff7a00'],
  ['#d42d28', '#ffffff'], ['#0b1110', '#f5f3ee'], ['#ffffff', '#087443'],
  ['#1b4fd6', '#ffffff'], ['#7a1fa8', '#f5f3ee'],
]

export const clubs: Club[] = Array.from({ length: 40 }, (_, i) => {
  const city = rng.pick(cities)
  const name = makeClubName(city.name, usedClubNames)
  const category = i < 24 ? 'Professionnel' : i < 30 ? 'Féminin' : i < 36 ? 'Jeunes' : 'Futsal'
  const clubStadiums = stadiums.filter((s) => s.cityId === city.id)
  const slug = slugify(name)
  return {
    id: `club-${i}`,
    slug,
    name,
    shortName: name.split(' ').slice(-1)[0],
    cityId: city.id,
    stadiumId: rng.pick(clubStadiums.length ? clubStadiums : stadiums).id,
    founded: rng.int(1948, 2015),
    president: fullName(),
    colors: rng.pick(clubColorPairs),
    crestInitials: name
      .split(' ')
      .map((w) => w[0])
      .slice(0, 3)
      .join('')
      .toUpperCase(),
    gender: category === 'Féminin' ? 'F' : 'M',
    category: category as Club['category'],
    competitionIds: [],
    website: `https://${slug}.fif.ci`,
    honours: rng.bool(0.4)
      ? [{ title: 'Champion national', count: rng.int(1, 5) }]
      : [],
  }
})

function clubBySlug(slug: string) {
  return clubs.find((c) => c.slug === slug)
}

// ---------------------------------------------------------------------------
// Coaches
// ---------------------------------------------------------------------------
export const coaches: Coach[] = clubs.map((club, i) => ({
  id: `coach-${i}`,
  slug: `coach-${slugify(club.name)}`,
  name: fullName(club.gender === 'F' ? 'F' : 'M'),
  clubId: club.id,
  nationalTeamId: null,
  license: rng.pick(['CAF Pro', 'CAF A', 'CAF B', 'CAF C'] as const),
  since: rng.int(2018, 2025),
}))

// ---------------------------------------------------------------------------
// Referees / Officials / Agents
// ---------------------------------------------------------------------------
export const referees: Referee[] = Array.from({ length: 42 }, (_, i) => {
  const gender = rng.bool(0.85) ? 'M' : 'F'
  const name = fullName(gender)
  return {
    id: `ref-${i}`,
    slug: `${slugify(name)}-${i}`,
    name,
    category: rng.pick(['FIFA', 'Fédérale 1', 'Fédérale 2', 'Régionale'] as const),
    regionId: rng.pick(regions).id,
    gender,
    status: rng.bool(0.92) ? 'Actif' : rng.bool() ? 'Suspendu' : 'Retraité',
    matchesOfficiated: rng.int(4, 210),
  }
})

export const officials: Official[] = Array.from({ length: 30 }, (_, i) => {
  const role = rng.pick(['Président de club', 'Secrétaire général', 'Délégué de match', 'Commissaire au match'] as const)
  const club = role === 'Délégué de match' || role === 'Commissaire au match' ? null : rng.pick(clubs)
  const name = fullName()
  return {
    id: `off-${i}`,
    slug: `${slugify(name)}-${i}`,
    name,
    role,
    clubId: club?.id ?? null,
  }
})

// ---------------------------------------------------------------------------
// Players
// ---------------------------------------------------------------------------
const positions = ['Gardien', 'Défenseur', 'Milieu', 'Attaquant'] as const

export const players: Player[] = clubs.flatMap((club, ci) =>
  Array.from({ length: club.category === 'Futsal' ? 10 : 20 }, (_, pi) => {
    const gender = club.gender
    const name = fullName(gender === 'F' ? 'F' : 'M')
    const id = `player-${ci}-${pi}`
    const birthYear = rng.int(1994, 2009)
    const goals = rng.int(0, 18)
    return {
      id,
      slug: `${slugify(name)}-${ci}${pi}`,
      name,
      photoSeed: id,
      position: rng.pick(positions),
      clubId: club.id,
      gender,
      birthdate: `${birthYear}-${String(rng.int(1, 12)).padStart(2, '0')}-${String(rng.int(1, 28)).padStart(2, '0')}`,
      nationality: 'Côte d’Ivoire',
      fifId: `FIF-${(10000 + ci * 20 + pi).toString().padStart(6, '0')}`,
      licenseStatus: rng.bool(0.85) ? 'Valide' : rng.bool() ? 'En attente' : 'Expirée',
      stats: {
        matches: rng.int(2, 30),
        minutes: rng.int(200, 2700),
        goals,
        assists: rng.int(0, 12),
        yellow: rng.int(0, 8),
        red: rng.bool(0.1) ? 1 : 0,
      },
      history: [{ clubId: club.id, from: rng.int(2019, 2024), to: null }],
      nationalSelections: [],
    }
  }),
)

function playersOf(clubId: string) {
  return players.filter((p) => p.clubId === clubId)
}

// ---------------------------------------------------------------------------
// National teams
// ---------------------------------------------------------------------------
export const nationalTeams: NationalTeam[] = [
  { id: 'nt-elephants', slug: 'elephants', name: 'Éléphants', gender: 'M', category: 'A', coachId: null, ranking: 39, honours: [{ title: 'Coupe d’Afrique des Nations', year: 2024 }, { title: 'Coupe d’Afrique des Nations', year: 1992 }] },
  { id: 'nt-elephantes', slug: 'elephantes', name: 'Éléphantes', gender: 'F', category: 'A', coachId: null, ranking: 78, honours: [] },
  { id: 'nt-u23', slug: 'u23', name: 'Éléphants U23', gender: 'M', category: 'U23', coachId: null, honours: [] },
  { id: 'nt-u20', slug: 'u20', name: 'Éléphants U20', gender: 'M', category: 'U20', coachId: null, honours: [{ title: 'Coupe UFOA U20', year: 2023 }] },
  { id: 'nt-u17', slug: 'u17', name: 'Éléphants U17', gender: 'M', category: 'U17', coachId: null, honours: [] },
  { id: 'nt-futsal', slug: 'futsal', name: 'Éléphants Futsal', gender: 'M', category: 'Futsal', coachId: null, honours: [] },
  { id: 'nt-beach', slug: 'beach-soccer', name: 'Éléphants Beach Soccer', gender: 'M', category: 'Beach Soccer', coachId: null, honours: [{ title: 'Coupe d’Afrique Beach Soccer', year: 2022 }] },
]

for (const team of nationalTeams) {
  const c = coaches[rng.int(0, coaches.length - 1)]
  team.coachId = c.id
}

// squads: pick 23 fictional players per team from the general pool (flag as selection, not affecting player.clubId)
export const nationalSquads: Record<string, { playerId: string; caps: number; goals: number }[]> = {}
for (const team of nationalTeams) {
  const pool = players.filter((p) => (team.gender === 'F' ? p.gender === 'F' : p.gender === 'M'))
  const squad = rng.pickN(pool, 23)
  nationalSquads[team.id] = squad.map((p) => ({ playerId: p.id, caps: rng.int(1, 62), goals: rng.int(0, 20) }))
  for (const s of nationalSquads[team.id]) {
    const player = players.find((p) => p.id === s.playerId)
    player?.nationalSelections.push({ teamId: team.id, caps: s.caps, goals: s.goals })
  }
}

// ---------------------------------------------------------------------------
// Competitions
// ---------------------------------------------------------------------------
const proClubs = clubs.filter((c) => c.category === 'Professionnel')
const femClubs = clubs.filter((c) => c.category === 'Féminin')
const youthClubs = clubs.filter((c) => c.category === 'Jeunes')
const futsalClubs = clubs.filter((c) => c.category === 'Futsal')

export const competitions: Competition[] = [
  { id: 'comp-l1', slug: 'ligue-1', name: 'Ligue 1', category: 'Seniors', gender: 'M', season: '2025-2026', clubIds: proClubs.slice(0, 14).map((c) => c.id), format: 'Championnat, matchs aller-retour', logoInitials: 'L1' },
  { id: 'comp-l2', slug: 'ligue-2', name: 'Ligue 2', category: 'Seniors', gender: 'M', season: '2025-2026', clubIds: proClubs.slice(14, 24).map((c) => c.id), format: 'Championnat, matchs aller-retour', logoInitials: 'L2' },
  { id: 'comp-coupe', slug: 'coupe-nationale', name: 'Coupe Nationale FIF', category: 'Seniors', gender: 'M', season: '2025-2026', clubIds: proClubs.map((c) => c.id), format: 'Élimination directe', logoInitials: 'CN' },
  { id: 'comp-super', slug: 'super-coupe', name: 'Super Coupe de Côte d’Ivoire', category: 'Seniors', gender: 'M', season: '2025-2026', clubIds: proClubs.slice(0, 2).map((c) => c.id), format: 'Match unique', logoInitials: 'SC' },
  { id: 'comp-fem', slug: 'championnat-feminin', name: 'Championnat National Féminin', category: 'Féminin', gender: 'F', season: '2025-2026', clubIds: femClubs.map((c) => c.id), format: 'Championnat', logoInitials: 'CF' },
  { id: 'comp-coupe-fem', slug: 'coupe-feminine', name: 'Coupe Nationale Féminine', category: 'Féminin', gender: 'F', season: '2025-2026', clubIds: femClubs.map((c) => c.id), format: 'Élimination directe', logoInitials: 'CF' },
  { id: 'comp-u20', slug: 'championnat-u20', name: 'Championnat National U20', category: 'Jeunes', gender: 'M', season: '2025-2026', clubIds: youthClubs.map((c) => c.id), format: 'Championnat', logoInitials: 'U20' },
  { id: 'comp-u17', slug: 'championnat-u17', name: 'Championnat National U17', category: 'Jeunes', gender: 'M', season: '2025-2026', clubIds: youthClubs.map((c) => c.id), format: 'Championnat', logoInitials: 'U17' },
  { id: 'comp-futsal', slug: 'futsal-elite', name: 'Futsal Élite', category: 'Futsal', gender: 'M', season: '2025-2026', clubIds: futsalClubs.map((c) => c.id), format: 'Championnat', logoInitials: 'FE' },
  { id: 'comp-beach', slug: 'beach-soccer-national', name: 'Beach Soccer National', category: 'Beach Soccer', gender: 'M', season: '2025-2026', clubIds: rng.pickN(proClubs, 8).map((c) => c.id), format: 'Tournoi', logoInitials: 'BS' },
]

for (const club of clubs) {
  club.competitionIds = competitions.filter((c) => c.clubIds.includes(club.id)).map((c) => c.id)
}

function competitionBySlug(slug: string) {
  return competitions.find((c) => c.slug === slug)
}

// ---------------------------------------------------------------------------
// Matches (past = results, future = calendar) + standings
// ---------------------------------------------------------------------------
const TODAY = new Date('2026-09-17T12:00:00Z')

function addDays(base: Date, days: number) {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d
}

function roundRobinPairs(ids: string[]) {
  const pairs: [string, string][] = []
  for (let i = 0; i < ids.length; i++) {
    for (let j = 0; j < ids.length; j++) {
      if (i !== j) pairs.push([ids[i], ids[j]])
    }
  }
  return pairs
}

export const matches: Match[] = []
let matchCounter = 0

for (const comp of competitions) {
  if (comp.clubIds.length < 2) continue
  const pairs = comp.format === 'Élimination directe' || comp.format === 'Match unique' || comp.format === 'Tournoi'
    ? rng.shuffle(roundRobinPairs(comp.clubIds)).slice(0, Math.max(4, Math.floor(comp.clubIds.length / 2)))
    : roundRobinPairs(comp.clubIds).slice(0, comp.clubIds.length * 3)

  pairs.forEach(([home, away], idx) => {
    const dayOffset = -60 + idx * 3 + rng.int(-1, 1)
    const date = addDays(TODAY, dayOffset)
    const isPast = date.getTime() < TODAY.getTime() - 1000 * 60 * 60 * 2
    const homeClub = clubs.find((c) => c.id === home)!
    const stadiumId = homeClub.stadiumId
    const matchId = `match-${matchCounter++}`
    const homeScore = isPast ? rng.int(0, 4) : null
    const awayScore = isPast ? rng.int(0, 4) : null
    const events: MatchEvent[] = []
    if (isPast && homeScore !== null && awayScore !== null) {
      events.push({ minute: 0, type: 'kickoff', team: 'home' })
      const scorers = [
        ...Array.from({ length: homeScore }, () => ({ team: 'home' as const })),
        ...Array.from({ length: awayScore }, () => ({ team: 'away' as const })),
      ]
      for (const s of rng.shuffle(scorers)) {
        const teamPlayers = playersOf(s.team === 'home' ? home : away)
        const scorer = teamPlayers.length ? rng.pick(teamPlayers) : undefined
        events.push({ minute: rng.int(1, 90), type: 'goal', team: s.team, playerId: scorer?.id })
      }
      for (let c = 0; c < rng.int(0, 4); c++) {
        const team = rng.bool() ? 'home' : 'away'
        const teamPlayers = playersOf(team === 'home' ? home : away)
        events.push({ minute: rng.int(1, 90), type: 'yellow', team, playerId: teamPlayers.length ? rng.pick(teamPlayers).id : undefined })
      }
      events.push({ minute: 45, type: 'ht', team: 'home' })
      events.push({ minute: 90, type: 'ft', team: 'home' })
      events.sort((a, b) => a.minute - b.minute)
    }
    matches.push({
      id: matchId,
      competitionId: comp.id,
      matchday: Math.floor(idx / Math.max(1, Math.floor(comp.clubIds.length / 2))) + 1,
      homeClubId: home,
      awayClubId: away,
      stadiumId,
      date: date.toISOString(),
      status: isPast ? 'Terminé' : dayOffset === 0 ? 'Live' : 'À venir',
      minute: dayOffset === 0 ? rng.int(1, 90) : undefined,
      homeScore,
      awayScore,
      events,
      refereeId: rng.pick(referees).id,
      attendance: isPast ? rng.int(800, 42000) : undefined,
    })
  })
}

export function standingsFor(competitionId: string): StandingRow[] {
  const comp = competitions.find((c) => c.id === competitionId)
  if (!comp) return []
  const rows = new Map<string, StandingRow>()
  for (const clubId of comp.clubIds) {
    rows.set(clubId, { clubId, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 })
  }
  for (const m of matches) {
    if (m.competitionId !== competitionId || m.status !== 'Terminé' || m.homeScore === null || m.awayScore === null) continue
    const home = rows.get(m.homeClubId)
    const away = rows.get(m.awayClubId)
    if (!home || !away) continue
    home.played++; away.played++
    home.goalsFor += m.homeScore; home.goalsAgainst += m.awayScore
    away.goalsFor += m.awayScore; away.goalsAgainst += m.homeScore
    if (m.homeScore > m.awayScore) { home.won++; home.points += 3; away.lost++ }
    else if (m.homeScore < m.awayScore) { away.won++; away.points += 3; home.lost++ }
    else { home.drawn++; away.drawn++; home.points++; away.points++ }
  }
  return [...rows.values()].sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst))
}

export function topScorersFor(competitionId: string) {
  const compMatches = matches.filter((m) => m.competitionId === competitionId)
  const tally = new Map<string, number>()
  for (const m of compMatches) {
    for (const e of m.events) {
      if (e.type === 'goal' && e.playerId) tally.set(e.playerId, (tally.get(e.playerId) ?? 0) + 1)
    }
  }
  return [...tally.entries()]
    .map(([playerId, goals]) => ({ player: players.find((p) => p.id === playerId)!, goals }))
    .filter((r) => r.player)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 10)
}

// ---------------------------------------------------------------------------
// International fixtures (national teams) — upcoming only, no fabricated
// results for real opponent federations.
// ---------------------------------------------------------------------------
export interface InternationalFixture {
  id: string
  teamId: string
  opponent: string
  competition: string
  date: string
  stadiumId: string
  home: boolean
}

const opponents = ['Gabon', 'Zambie', 'Sierra Leone', 'Gambie', 'Guinée équatoriale', 'Mozambique']
export const internationalFixtures: InternationalFixture[] = nationalTeams.map((team, i) => ({
  id: `fixture-${team.id}`,
  teamId: team.id,
  opponent: opponents[i % opponents.length],
  competition: team.category === 'A' ? 'Qualifications CAN 2027' : 'Tournoi amical UFOA',
  date: addDays(TODAY, 3 + i * 11).toISOString(),
  stadiumId: rng.pick(stadiums).id,
  home: rng.bool(0.6),
}))

export function nextFixtureFor(teamId: string) {
  return internationalFixtures
    .filter((f) => f.teamId === teamId)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))[0]
}

// ---------------------------------------------------------------------------
// News, Videos
// ---------------------------------------------------------------------------
const newsCategories = ['Éléphants', 'Éléphantes', 'Ligue 1', 'Féminin', 'Amateur', 'Clubs', 'Jeunes', 'Compétitions', 'Arbitrage', 'Formation', 'Fédération', 'Engagement sociétal', 'Futsal', 'Beach Soccer']
const newsTitles = [
  'préparent leur prochaine échéance internationale',
  'annoncent leur liste pour la fenêtre à venir',
  'décrochent une victoire précieuse',
  'lancent un nouveau programme de développement',
  'accueillent une délégation pour une visite officielle',
  'dévoilent le calendrier de la saison',
  'renforcent leur encadrement technique',
  'inaugurent de nouvelles infrastructures',
  'présentent le bilan de la saison',
  'annoncent une nouvelle session de formation',
]
const newsSubjects = ['Les Éléphants', 'Les Éléphantes', 'La Ligue 1', 'La FIF', 'Le football féminin', 'Les clubs amateurs', 'La sélection U20', 'Le corps arbitral', 'La FIF Academy', 'Le futsal ivoirien']

export const articles: Article[] = Array.from({ length: 64 }, (_, i) => {
  const category = newsCategories[i % newsCategories.length]
  const subject = rng.pick(newsSubjects)
  const title = `${subject} ${rng.pick(newsTitles)}`
  const date = addDays(TODAY, -rng.int(0, 120))
  return {
    id: `article-${i}`,
    slug: `${slugify(title)}-${i}`,
    title,
    category,
    excerpt: `${subject} font l’actualité : retour sur les temps forts et ce qu’il faut retenir pour les prochaines semaines.`,
    body: [
      `${subject} continuent de faire parler d’eux cette semaine. La Fédération Ivoirienne de Football suit de près ce dossier et communiquera les prochaines étapes en temps voulu.`,
      `Sur le terrain comme en dehors, l’objectif reste le même : structurer et faire grandir le football ivoirien à tous les niveaux, des catégories jeunes jusqu’à l’équipe fanion.`,
      `D’autres annonces sont attendues dans les prochains jours. Retrouvez toute l’actualité fédérale sur FIF Digital.`,
    ],
    author: fullName(),
    date: date.toISOString(),
    image: `https://picsum.photos/seed/article-${i}/1200/800`,
    tags: [category, 'FIF', subject.replace('Les ', '').replace('La ', '')],
    featured: i === 0,
  }
})

const videoCategories = ['Live', 'Matchs', 'Résumés', 'Inside', 'Interviews', 'Conférences', 'Documentaires', 'Archives', 'Jeunes', 'Féminin', 'Futsal']
export const videos: Video[] = Array.from({ length: 48 }, (_, i) => {
  const category = videoCategories[i % videoCategories.length]
  return {
    id: `video-${i}`,
    slug: `video-${i}`,
    title: `${category} — épisode ${Math.floor(i / videoCategories.length) + 1}`,
    category,
    duration: `${rng.int(1, 24)}:${String(rng.int(0, 59)).padStart(2, '0')}`,
    date: addDays(TODAY, -rng.int(0, 90)).toISOString(),
    image: `https://picsum.photos/seed/video-${i}/900/560`,
  }
})

// ---------------------------------------------------------------------------
// Academies, Training, Products, Tickets
// ---------------------------------------------------------------------------
export const academies: Academy[] = Array.from({ length: 18 }, (_, i) => {
  const city = rng.pick(cities)
  const name = `Académie ${rng.pick(['Espoir', 'Avenir', 'Étoile', 'Talents', 'Nouvelle Génération', 'Excellence'])} de ${city.name}`
  return {
    id: `academy-${i}`,
    slug: `${slugify(name)}-${i}`,
    name,
    cityId: city.id,
    founded: rng.int(2005, 2022),
    status: rng.bool(0.75) ? 'Agréée FIF' : 'En cours d’agrément',
    categories: rng.pickN(['U10', 'U12', 'U14', 'U15', 'U17'], rng.int(2, 4)),
  }
})

export const trainingCourses: TrainingCourse[] = [
  { id: 'tc-1', slug: 'licence-caf-c', title: 'Licence Entraîneur CAF C', audience: 'Entraîneurs', level: 'Initiation', duration: '2 semaines', location: 'Abidjan — Centre Technique FIF', dates: '12 — 24 oct. 2026', price: '75 000 FCFA', seats: 30, modules: ['Fondamentaux techniques', 'Pédagogie', 'Physiologie de base', 'Évaluation pratique'] },
  { id: 'tc-2', slug: 'licence-caf-b', title: 'Licence Entraîneur CAF B', audience: 'Entraîneurs', level: 'Intermédiaire', duration: '3 semaines', location: 'Yamoussoukro — INJS', dates: '5 — 23 nov. 2026', price: '150 000 FCFA', seats: 24, modules: ['Tactique avancée', 'Préparation physique', 'Analyse vidéo', 'Stage pratique'] },
  { id: 'tc-3', slug: 'arbitrage-regional', title: 'Formation Arbitre Régional', audience: 'Arbitres', level: 'Régional', duration: '1 semaine', location: 'Bouaké — Ligue Régionale', dates: '20 — 26 oct. 2026', price: '35 000 FCFA', seats: 40, modules: ['Lois du jeu', 'Gestion de match', 'VAR — sensibilisation', 'Examen pratique'] },
  { id: 'tc-4', slug: 'direction-club', title: 'Formation Dirigeants de Club', audience: 'Dirigeants', level: 'Tous niveaux', duration: '4 jours', location: 'Abidjan — Siège FIF', dates: '3 — 6 nov. 2026', price: '50 000 FCFA', seats: 35, modules: ['Gouvernance associative', 'Gestion financière', 'Projet Club FIF', 'Communication'] },
  { id: 'tc-5', slug: 'medecine-sportive', title: 'Initiation Médecine du Sport', audience: 'Médecins / Santé', level: 'Initiation', duration: '1 semaine', location: 'Abidjan — CHU', dates: '9 — 14 nov. 2026', price: '60 000 FCFA', seats: 20, modules: ['Premiers secours', 'Prévention des blessures', 'Commotion cérébrale', 'Nutrition sportive'] },
  { id: 'tc-6', slug: 'educateur-jeunes', title: 'Éducateur Football Jeunes', audience: 'Éducateurs', level: 'Initiation', duration: '2 semaines', location: 'Daloa — Centre régional', dates: '16 — 28 nov. 2026', price: '45 000 FCFA', seats: 28, modules: ['Psychologie de l’enfant', 'Motricité', 'Jeux réduits', 'Sécurité et bien-être'] },
]

const productCategories = ['Maillots', 'Tenues', 'Enfants', 'Femmes', 'Accessoires', 'Ballons', 'Écharpes', 'Casquettes']
export const products: Product[] = Array.from({ length: 24 }, (_, i) => {
  const category = productCategories[i % productCategories.length]
  return {
    id: `product-${i}`,
    name: `${category.slice(0, -1) || category} Éléphants ${rng.bool() ? 'Domicile' : 'Extérieur'}`,
    category,
    price: rng.int(6, 65) * 1000,
    colors: rng.pickN(['Orange', 'Vert', 'Blanc', 'Anthracite'], rng.int(1, 3)),
    sizes: rng.pickN(['XS', 'S', 'M', 'L', 'XL', 'XXL'], rng.int(3, 6)),
    image: `https://picsum.photos/seed/product-${i}/700/700`,
    customizable: category === 'Maillots',
  }
})

export const ticketEvents: TicketEvent[] = matches
  .filter((m) => m.status === 'À venir')
  .slice(0, 12)
  .map((m) => ({
    id: `ticket-${m.id}`,
    matchId: m.id,
    categories: [
      { name: 'Populaire', price: 2000, available: rng.int(500, 4000) },
      { name: 'Tribune', price: 5000, available: rng.int(200, 2000) },
      { name: 'VIP', price: 15000, available: rng.int(20, 300) },
    ],
  }))

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------
export function getClub(slug: string) { return clubs.find((c) => c.slug === slug) }
export function getPlayer(slug: string) { return players.find((p) => p.slug === slug) }
export function getCompetition(slug: string) { return competitions.find((c) => c.slug === slug) }
export function getTeam(slug: string) { return nationalTeams.find((t) => t.slug === slug) }
export function getArticle(slug: string) { return articles.find((a) => a.slug === slug) }
export function getStadium(slug: string) { return stadiums.find((s) => s.slug === slug) }
export function getVideo(slug: string) { return videos.find((v) => v.slug === slug) }
export function getAcademy(slug: string) { return academies.find((a) => a.slug === slug) }
export function getMatch(id: string) { return matches.find((m) => m.id === id) }
export function getCity(id: string) { return cities.find((c) => c.id === id) }
export function getStadiumById(id: string) { return stadiums.find((s) => s.id === id) }
export function getClubById(id: string) { return clubs.find((c) => c.id === id) }
export function getPlayerById(id: string) { return players.find((p) => p.id === id) }
export function getRefereeById(id: string) { return referees.find((r) => r.id === id) }
export function getCoachById(id: string) { return coaches.find((c) => c.id === id) }
export function matchesOf(clubId: string) { return matches.filter((m) => m.homeClubId === clubId || m.awayClubId === clubId).sort((a, b) => +new Date(a.date) - +new Date(b.date)) }
export { cityName }

export function upcomingMatches(limit = 6) {
  return matches
    .filter((m) => m.status === 'À venir')
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .slice(0, limit)
}

export function recentResults(limit = 6) {
  return matches
    .filter((m) => m.status === 'Terminé')
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, limit)
}

export function liveMatches() {
  return matches.filter((m) => m.status === 'Live')
}

// Global smart search across entities -------------------------------------
export interface SearchResult {
  type: 'joueur' | 'club' | 'match' | 'compétition' | 'article' | 'vidéo' | 'arbitre' | 'stade' | 'formation'
  title: string
  subtitle: string
  href: string
}

export function globalSearch(query: string): SearchResult[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const results: SearchResult[] = []
  for (const p of players) {
    if (p.name.toLowerCase().includes(q)) {
      const club = getClubById(p.clubId)
      results.push({ type: 'joueur', title: p.name, subtitle: `${p.position} · ${club?.name ?? ''}`, href: `/joueurs/${p.slug}` })
    }
  }
  for (const c of clubs) {
    if (c.name.toLowerCase().includes(q)) {
      results.push({ type: 'club', title: c.name, subtitle: cityName(c.cityId), href: `/clubs/${c.slug}` })
    }
  }
  for (const c of competitions) {
    if (c.name.toLowerCase().includes(q)) {
      results.push({ type: 'compétition', title: c.name, subtitle: c.category, href: `/competitions/${c.slug}` })
    }
  }
  for (const a of articles) {
    if (a.title.toLowerCase().includes(q)) {
      results.push({ type: 'article', title: a.title, subtitle: a.category, href: `/actualites/${a.slug}` })
    }
  }
  for (const r of referees) {
    if (r.name.toLowerCase().includes(q)) {
      results.push({ type: 'arbitre', title: r.name, subtitle: r.category, href: `/officiels?role=arbitres` })
    }
  }
  for (const s of stadiums) {
    if (s.name.toLowerCase().includes(q)) {
      results.push({ type: 'stade', title: s.name, subtitle: cityName(s.cityId), href: `/stades/${s.slug}` })
    }
  }
  for (const tc of trainingCourses) {
    if (tc.title.toLowerCase().includes(q)) {
      results.push({ type: 'formation', title: tc.title, subtitle: tc.audience, href: `/formation/${tc.slug}` })
    }
  }
  return results.slice(0, 30)
}
