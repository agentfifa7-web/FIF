import { makeRng, slugify } from './rng'
import type {
  Academy,
  Agent,
  Article,
  City,
  Club,
  Coach,
  Commission,
  Competition,
  ExecutiveMember,
  HonourRecord,
  Match,
  MatchEvent,
  NationalTeam,
  Official,
  OfficialDocument,
  Player,
  PresidentPromise,
  Product,
  Referee,
  Region,
  Stadium,
  StandingRow,
  TicketEvent,
  TrainingCourse,
  TransparencyRecord,
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
      built: rng.int(1965, 2023),
      video360Url: rng.bool(0.45) ? `demo-360-${id}` : '',
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

function makeAchievements(competitionLabel: string, championCount: number, yearFrom = 1992, yearTo = 2026): HonourRecord[] {
  const used = new Set<number>()
  function pickYear() {
    let y: number
    do { y = rng.int(yearFrom, yearTo) } while (used.has(y))
    used.add(y)
    return y
  }
  const records: HonourRecord[] = []
  for (let i = 0; i < championCount; i++) records.push({ competition: competitionLabel, year: pickYear(), result: 'Champion' })
  const extra = rng.int(0, 3)
  for (let i = 0; i < extra; i++) {
    const result = rng.pick(['Finaliste', 'Demi-finaliste', 'Podium (3e)', 'Qualifié'] as const)
    records.push({ competition: competitionLabel, year: pickYear(), result })
  }
  return records.sort((a, b) => b.year - a.year)
}

export const clubs: Club[] = Array.from({ length: 40 }, (_, i) => {
  const city = rng.pick(cities)
  const name = makeClubName(city.name, usedClubNames)
  const category = i < 24 ? 'Professionnel' : i < 30 ? 'Féminin' : i < 36 ? 'Jeunes' : 'Futsal'
  const clubStadiums = stadiums.filter((s) => s.cityId === city.id)
  const slug = slugify(name)
  const championCount = rng.bool(0.4) ? rng.int(1, 5) : 0
  const label = category === 'Féminin' ? 'Championnat National Féminin' : category === 'Futsal' ? 'Futsal Élite' : 'Championnat National'
  return {
    id: `club-${i}`,
    slug,
    name,
    shortName: name.split(' ').length > 1 ? `${name.split(' ')[0]} ${name.split(' ').slice(-1)[0]}` : name,
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
    honours: championCount > 0 ? [{ title: 'Champion national', count: championCount }] : [],
    achievements: makeAchievements(label, championCount),
  }
})

function clubBySlug(slug: string) {
  return clubs.find((c) => c.slug === slug)
}

function randomBirthdate(minAge: number, maxAge: number) {
  const age = rng.int(minAge, maxAge)
  const year = 2026 - age
  return `${year}-${String(rng.int(1, 12)).padStart(2, '0')}-${String(rng.int(1, 28)).padStart(2, '0')}`
}

// ---------------------------------------------------------------------------
// Coaches
// ---------------------------------------------------------------------------
export const coaches: Coach[] = clubs.map((club, i) => {
  const name = fullName(club.gender === 'F' ? 'F' : 'M')
  const license = rng.pick(['CAF Pro', 'CAF A', 'CAF B', 'CAF C'] as const)
  return {
    id: `coach-${i}`,
    slug: `coach-${slugify(club.name)}`,
    name,
    clubId: club.id,
    nationalTeamId: null,
    license,
    since: rng.int(2018, 2025),
    fifId: `FIF-CO-${(2000 + i).toString().padStart(5, '0')}`,
    birthdate: randomBirthdate(32, 62),
    bio: `Titulaire de la licence ${license}, ${name} dirige l’équipe première de ${club.name} depuis ${rng.int(2018, 2025)}, après plusieurs saisons comme adjoint dans le football régional.`,
  }
})

// ---------------------------------------------------------------------------
// Referees / Officials / Agents
// ---------------------------------------------------------------------------
export const referees: Referee[] = Array.from({ length: 42 }, (_, i) => {
  const gender = rng.bool(0.85) ? 'M' : 'F'
  const name = fullName(gender)
  const category = rng.pick(['FIFA', 'Fédérale 1', 'Fédérale 2', 'Régionale'] as const)
  return {
    id: `ref-${i}`,
    slug: `${slugify(name)}-${i}`,
    name,
    category,
    regionId: rng.pick(regions).id,
    gender,
    status: rng.bool(0.92) ? 'Actif' : rng.bool() ? 'Suspendu' : 'Retraité',
    matchesOfficiated: rng.int(4, 210),
    fifId: `FIF-AR-${(3000 + i).toString().padStart(5, '0')}`,
    birthdate: randomBirthdate(24, 55),
    bio: `Arbitre de catégorie ${category}, ${name} officie sur les rencontres du football ivoirien depuis ${rng.int(2010, 2022)} et a dirigé ${rng.int(4, 210)} matchs à ce jour.`,
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
    fifId: `FIF-OF-${(5000 + i).toString().padStart(5, '0')}`,
    birthdate: randomBirthdate(30, 65),
    bio: `${name} exerce la fonction de ${role.toLowerCase()}${club ? ` au sein de ${club.name}` : ' pour le compte de la Fédération'}, au service de l’organisation du football ivoirien.`,
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
// Agents
// ---------------------------------------------------------------------------
export const agents: Agent[] = Array.from({ length: 20 }, (_, i) => {
  const name = fullName()
  const represented = rng.pickN(players, rng.int(1, 5))
  return {
    id: `agent-${i}`,
    slug: `${slugify(name)}-${i}`,
    name,
    fifId: `FIF-AG-${(4000 + i).toString().padStart(5, '0')}`,
    license: `LIC-${rng.int(1000, 9999)}`,
    status: rng.bool(0.9) ? 'Actif' : 'Suspendu',
    validUntil: `${rng.int(2026, 2028)}-${String(rng.int(1, 12)).padStart(2, '0')}-01`,
    playerIds: represented.map((p) => p.id),
    birthdate: randomBirthdate(30, 60),
    bio: `${name} est agent sportif licencié FIF, représentant ${represented.length} joueur${represented.length > 1 ? 's' : ''} évoluant dans le football ivoirien.`,
  }
})

// ---------------------------------------------------------------------------
// National teams
// ---------------------------------------------------------------------------
function teamAchievements(competitionLabel: string, honours: { title: string; year: number }[]): HonourRecord[] {
  const champions: HonourRecord[] = honours.map((h) => ({ competition: h.title, year: h.year, result: 'Champion' }))
  const usedYears = new Set(champions.map((c) => c.year))
  const extra = rng.int(1, 3)
  const records = [...champions]
  for (let i = 0; i < extra; i++) {
    let year: number
    do { year = rng.int(1998, 2026) } while (usedYears.has(year))
    usedYears.add(year)
    records.push({ competition: competitionLabel, year, result: rng.pick(['Demi-finaliste', 'Qualifié', 'Podium (3e)'] as const) })
  }
  return records.sort((a, b) => b.year - a.year)
}

export const nationalTeams: NationalTeam[] = [
  { id: 'nt-elephants', slug: 'elephants', name: 'Éléphants', gender: 'M', category: 'A', coachId: null, ranking: 39, honours: [{ title: 'Coupe d’Afrique des Nations', year: 2024 }, { title: 'Coupe d’Afrique des Nations', year: 1992 }], achievements: [] },
  { id: 'nt-elephantes', slug: 'elephantes', name: 'Éléphantes', gender: 'F', category: 'A', coachId: null, ranking: 78, honours: [], achievements: [] },
  { id: 'nt-u23', slug: 'u23', name: 'Éléphants U23', gender: 'M', category: 'U23', coachId: null, honours: [], achievements: [] },
  { id: 'nt-u20', slug: 'u20', name: 'Éléphants U20', gender: 'M', category: 'U20', coachId: null, honours: [{ title: 'Coupe UFOA U20', year: 2023 }], achievements: [] },
  { id: 'nt-u17', slug: 'u17', name: 'Éléphants U17', gender: 'M', category: 'U17', coachId: null, honours: [], achievements: [] },
  { id: 'nt-futsal', slug: 'futsal', name: 'Éléphants Futsal', gender: 'M', category: 'Futsal', coachId: null, honours: [], achievements: [] },
  { id: 'nt-beach', slug: 'beach-soccer', name: 'Éléphants Beach Soccer', gender: 'M', category: 'Beach Soccer', coachId: null, honours: [{ title: 'Coupe d’Afrique Beach Soccer', year: 2022 }], achievements: [] },
]

for (const team of nationalTeams) {
  team.achievements = teamAchievements('Coupe d’Afrique des Nations', team.honours)
}

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
// Fédération — gouvernance (démonstration : ne représente aucune personne
// réelle ni aucune information officielle de la FIF)
// ---------------------------------------------------------------------------
export const commissions: Commission[] = [
  { id: 'com-competitions', slug: 'competitions', name: 'Commission des Compétitions', mission: 'Organise et supervise les championnats et coupes nationales, toutes catégories.' },
  { id: 'com-arbitrage', slug: 'arbitrage', name: 'Commission Centrale d’Arbitrage', mission: 'Forme, évalue et désigne les arbitres du football ivoirien.' },
  { id: 'com-discipline', slug: 'discipline', name: 'Commission de Discipline', mission: 'Instruit les dossiers disciplinaires et rend les décisions de sanction.' },
  { id: 'com-feminin', slug: 'football-feminin', name: 'Commission du Football Féminin', mission: 'Développe et structure la pratique féminine à tous les niveaux.' },
  { id: 'com-medicale', slug: 'medicale', name: 'Commission Médicale', mission: 'Encadre la santé, la prévention et le suivi médical des acteurs du football.' },
  { id: 'com-marketing', slug: 'marketing-communication', name: 'Commission Marketing & Communication', mission: 'Valorise l’image de la FIF et développe ses partenariats.' },
  { id: 'com-ethique', slug: 'ethique', name: 'Commission d’Éthique', mission: 'Veille au respect des principes d’intégrité et de bonne gouvernance.' },
  { id: 'com-statuts', slug: 'statuts-reglements', name: 'Commission des Statuts et Règlements', mission: 'Rédige et actualise les textes fédéraux.' },
  { id: 'com-formation', slug: 'formation', name: 'Commission de la Formation', mission: 'Pilote la FIF Academy et les parcours de certification des encadrants.' },
  { id: 'com-jeunes', slug: 'football-jeunes', name: 'Commission du Football des Jeunes', mission: 'Coordonne les filières de détection et les compétitions de jeunes.' },
]

const execRoles = ['1er Vice-Président', '2e Vice-Président', 'Secrétaire Général', 'Trésorier Général', 'Membre chargé des Ligues', 'Membre chargé du Football Amateur', 'Membre chargé du Football Féminin', 'Membre chargé de la Formation', 'Membre chargé du Marketing', 'Membre chargé des Relations Internationales', 'Membre chargé du Numérique']
export const executiveCommittee: ExecutiveMember[] = execRoles.map((role, i) => {
  const name = fullName(rng.bool(0.25) ? 'F' : 'M')
  const memberCommissions = rng.pickN(commissions, rng.int(1, 2))
  return {
    id: `exec-${i}`,
    slug: `${slugify(name)}-${i}`,
    name,
    role,
    commissionIds: memberCommissions.map((c) => c.id),
    since: rng.int(2017, 2024),
    bio: `${name} siège au Comité Exécutif de la FIF en tant que ${role.toLowerCase()} depuis ${rng.int(2017, 2024)}, et supervise ${memberCommissions.map((c) => c.name).join(' et ')}.`,
  }
})

export const presidentProfile = {
  name: 'Amara N’Dri Koffi',
  role: 'Président de la Fédération Ivoirienne de Football',
  since: 2021,
  photoSeed: 'president-fif-demo',
  cv: [
    { year: '2021 — aujourd’hui', label: 'Président de la FIF' },
    { year: '2013 — 2021', label: 'Vice-président de la FIF, chargé des compétitions' },
    { year: '2005 — 2013', label: 'Président de club, Ligue 1 ivoirienne' },
    { year: '1998 — 2005', label: 'Dirigeant sportif et arbitre fédéral' },
  ],
  word: 'Le football ivoirien porte l’ambition de tout un pays. Notre mandat est de bâtir des fondations solides : des clubs mieux structurés, des compétitions plus professionnelles à tous les niveaux, un football féminin en plein essor, et une gouvernance exemplaire, transparente et redevable devant chaque licencié, chaque supporter et chaque partenaire du football ivoirien.',
}

export const presidentPromises: PresidentPromise[] = [
  { id: 'prom-1', title: 'Professionnaliser la Ligue 1', description: 'Cahier des charges renforcé, encadrement financier et infrastructures homologuées pour tous les clubs de Ligue 1.', commissionId: 'com-competitions', progress: 72, status: 'En cours' },
  { id: 'prom-2', title: 'Doubler le nombre de licenciées féminines', description: 'Programme national de développement du football féminin dans les 14 districts.', commissionId: 'com-feminin', progress: 54, status: 'En cours' },
  { id: 'prom-3', title: 'Digitaliser les licences fédérales', description: 'Délivrance et renouvellement des licences entièrement dématérialisés via FIF ID.', commissionId: 'com-statuts', progress: 100, status: 'Réalisée' },
  { id: 'prom-4', title: 'Créer un centre technique national', description: 'Centre de formation et de préparation pour les sélections nationales, toutes catégories.', commissionId: 'com-formation', progress: 38, status: 'En cours' },
  { id: 'prom-5', title: 'Généraliser la VAR en Ligue 1', description: 'Déploiement de l’assistance vidéo à l’arbitrage sur l’ensemble des rencontres de Ligue 1.', commissionId: 'com-arbitrage', progress: 20, status: 'En cours' },
  { id: 'prom-6', title: 'Réduire les délais de traitement disciplinaire', description: 'Instruction des dossiers de discipline sous 15 jours ouvrés.', commissionId: 'com-discipline', progress: 100, status: 'Réalisée' },
  { id: 'prom-7', title: 'Publier un rapport financier annuel public', description: 'Rapport d’activité et exécution budgétaire publiés chaque année dans la Transparence FIF.', commissionId: 'com-statuts', progress: 100, status: 'Réalisée' },
  { id: 'prom-8', title: 'Structurer 100 nouveaux clubs amateurs', description: 'Accompagnement à l’affiliation de clubs amateurs dans les districts sous-représentés.', commissionId: 'com-jeunes', progress: 61, status: 'En cours' },
  { id: 'prom-9', title: 'Lancer une académie de formation d’arbitres régionale', description: 'Centre régional de formation continue pour les arbitres fédérale 2 et régionaux.', commissionId: 'com-arbitrage', progress: 0, status: 'Planifiée' },
  { id: 'prom-10', title: 'Créer un fonds de solidarité pour les anciens internationaux', description: 'Accompagnement social et professionnel des anciens Éléphants et Éléphantes.', commissionId: 'com-marketing', progress: 15, status: 'Planifiée' },
]

const docTitlesByOrg: Record<'FIF' | 'CAF' | 'FIFA', { title: string; category: string }[]> = {
  FIF: [
    { title: 'Statuts de la Fédération Ivoirienne de Football', category: 'Statuts' },
    { title: 'Règlement des Compétitions Nationales', category: 'Règlements' },
    { title: 'Règlement Disciplinaire', category: 'Règlements' },
    { title: 'Charte d’Éthique et de Bonne Gouvernance', category: 'Statuts' },
    { title: 'Procès-verbal de l’Assemblée Générale 2026', category: 'Procès-verbaux' },
    { title: 'Circulaire — Saison sportive 2025-2026', category: 'Circulaires' },
    { title: 'Rapport d’activité annuel', category: 'Rapports' },
    { title: 'Guide du dirigeant de club', category: 'Guides' },
  ],
  CAF: [
    { title: 'Statuts de la Confédération Africaine de Football', category: 'Statuts' },
    { title: 'Règlement de la Coupe d’Afrique des Nations', category: 'Règlements' },
    { title: 'Règlement des Interclubs CAF', category: 'Règlements' },
    { title: 'Code Disciplinaire CAF', category: 'Règlements' },
  ],
  FIFA: [
    { title: 'Statuts de la FIFA', category: 'Statuts' },
    { title: 'Lois du Jeu (IFAB)', category: 'Règlements' },
    { title: 'Règlement du Statut et du Transfert des Joueurs (RSTJ)', category: 'Règlements' },
    { title: 'Code de Discipline FIFA', category: 'Règlements' },
  ],
}
export const officialDocuments: OfficialDocument[] = (Object.keys(docTitlesByOrg) as Array<'FIF' | 'CAF' | 'FIFA'>).flatMap((org) =>
  docTitlesByOrg[org].map((doc, i) => ({
    id: `doc-${org}-${i}`,
    slug: `${slugify(doc.title)}-${org.toLowerCase()}`,
    title: doc.title,
    organization: org,
    category: doc.category,
    date: addDays(new Date('2026-06-01T00:00:00Z'), -rng.int(0, 700)).toISOString(),
    summary: `Texte de référence (${org}) encadrant ${doc.category.toLowerCase()} applicable au football ivoirien et à ses acteurs.`,
  })),
)

const transparencyItems: { title: string; category: TransparencyRecord['category']; summary: string; amount?: string }[] = [
  { title: 'Budget prévisionnel 2026', category: 'Budget', summary: 'Budget annuel voté en Assemblée Générale, détaillant les recettes fédérales et les postes de dépense.', amount: '4,2 Md FCFA' },
  { title: 'Exécution budgétaire — 1er semestre 2026', category: 'Budget', summary: 'Suivi semestriel de l’exécution du budget fédéral par grand poste.', amount: '1,9 Md FCFA' },
  { title: 'Rapport d’activité 2025', category: 'Rapport', summary: 'Bilan des actions menées par la Fédération sur l’exercice écoulé.' },
  { title: 'Rapport de gouvernance 2025', category: 'Rapport', summary: 'État des lieux de la gouvernance fédérale et des réformes engagées.' },
  { title: 'Décision — Homologation Ligue 1 2025-2026', category: 'Décision', summary: 'Décision du Comité Exécutif portant homologation du format de la Ligue 1.' },
  { title: 'Décision — Commission de Discipline, dossier n°14', category: 'Décision', summary: 'Décision disciplinaire rendue publique conformément au règlement.' },
  { title: 'Appel d’offres — Équipement des centres techniques régionaux', category: 'Appel d’offres', summary: 'Consultation ouverte pour la fourniture d’équipements sportifs aux centres régionaux.' },
  { title: 'Appel d’offres — Diffusion audiovisuelle Ligue 1', category: 'Appel d’offres', summary: 'Consultation pour les droits de diffusion des championnats nationaux.' },
  { title: 'Statistiques institutionnelles — Licences 2025-2026', category: 'Statistique institutionnelle', summary: 'Nombre de licences délivrées par catégorie et par district.' },
  { title: 'Statistiques institutionnelles — Clubs affiliés', category: 'Statistique institutionnelle', summary: 'Répartition des clubs affiliés par ligue et par région.' },
]
export const transparencyRecords: TransparencyRecord[] = transparencyItems.map((t, i) => ({
  id: `tr-${i}`,
  slug: `${slugify(t.title)}-${i}`,
  title: t.title,
  category: t.category,
  date: addDays(new Date('2026-07-01T00:00:00Z'), -rng.int(0, 500)).toISOString(),
  summary: t.summary,
  amount: t.amount,
}))

export function getCommission(slug: string) { return commissions.find((c) => c.slug === slug) }
export function getExecutiveMember(slug: string) { return executiveCommittee.find((m) => m.slug === slug) }
export function getDocument(slug: string) { return officialDocuments.find((d) => d.slug === slug) }
export function getTransparencyRecord(slug: string) { return transparencyRecords.find((t) => t.slug === slug) }

// ---------------------------------------------------------------------------
// Competitions
// ---------------------------------------------------------------------------
const proClubs = clubs.filter((c) => c.category === 'Professionnel')
const femClubs = clubs.filter((c) => c.category === 'Féminin')
const youthClubs = clubs.filter((c) => c.category === 'Jeunes')
const futsalClubs = clubs.filter((c) => c.category === 'Futsal')

export const competitions: Competition[] = [
  { id: 'comp-l1', slug: 'ligue-1', name: 'Ligue 1', category: 'Seniors', practice: 'Professionnel', gender: 'M', season: '2025-2026', clubIds: proClubs.slice(0, 14).map((c) => c.id), format: 'Championnat, matchs aller-retour', logoInitials: 'L1' },
  { id: 'comp-l2', slug: 'ligue-2', name: 'Ligue 2', category: 'Seniors', practice: 'Professionnel', gender: 'M', season: '2025-2026', clubIds: proClubs.slice(14, 24).map((c) => c.id), format: 'Championnat, matchs aller-retour', logoInitials: 'L2' },
  { id: 'comp-coupe', slug: 'coupe-nationale', name: 'Coupe Nationale FIF', category: 'Seniors', practice: 'Professionnel', gender: 'M', season: '2025-2026', clubIds: proClubs.map((c) => c.id), format: 'Élimination directe', logoInitials: 'CN' },
  { id: 'comp-super', slug: 'super-coupe', name: 'Super Coupe de Côte d’Ivoire', category: 'Seniors', practice: 'Professionnel', gender: 'M', season: '2025-2026', clubIds: proClubs.slice(0, 2).map((c) => c.id), format: 'Match unique', logoInitials: 'SC' },
  { id: 'comp-d3', slug: 'championnat-national-amateur', name: 'Championnat National Amateur (D3)', category: 'Seniors', practice: 'Amateur', gender: 'M', season: '2025-2026', clubIds: youthClubs.map((c) => c.id), format: 'Championnat, matchs aller-retour', logoInitials: 'D3' },
  { id: 'comp-regional', slug: 'championnat-regional-d1', name: 'Championnat Régional D1', category: 'Seniors', practice: 'Amateur', gender: 'M', season: '2025-2026', clubIds: rng.shuffle(youthClubs).map((c) => c.id), format: 'Championnat, matchs aller-retour', logoInitials: 'R1' },
  { id: 'comp-coupe-districts', slug: 'coupe-des-districts', name: 'Coupe des Districts FIF', category: 'Seniors', practice: 'Amateur', gender: 'M', season: '2025-2026', clubIds: youthClubs.map((c) => c.id), format: 'Élimination directe', logoInitials: 'CD' },
  { id: 'comp-fem', slug: 'championnat-feminin', name: 'Championnat National Féminin', category: 'Féminin', practice: null, gender: 'F', season: '2025-2026', clubIds: femClubs.map((c) => c.id), format: 'Championnat', logoInitials: 'CF' },
  { id: 'comp-coupe-fem', slug: 'coupe-feminine', name: 'Coupe Nationale Féminine', category: 'Féminin', practice: null, gender: 'F', season: '2025-2026', clubIds: femClubs.map((c) => c.id), format: 'Élimination directe', logoInitials: 'CF' },
  { id: 'comp-u20', slug: 'championnat-u20', name: 'Championnat National U20', category: 'Jeunes', practice: null, gender: 'M', season: '2025-2026', clubIds: youthClubs.map((c) => c.id), format: 'Championnat', logoInitials: 'U20' },
  { id: 'comp-u17', slug: 'championnat-u17', name: 'Championnat National U17', category: 'Jeunes', practice: null, gender: 'M', season: '2025-2026', clubIds: youthClubs.map((c) => c.id), format: 'Championnat', logoInitials: 'U17' },
  { id: 'comp-futsal', slug: 'futsal-elite', name: 'Futsal Élite', category: 'Futsal', practice: null, gender: 'M', season: '2025-2026', clubIds: futsalClubs.map((c) => c.id), format: 'Championnat', logoInitials: 'FE' },
  { id: 'comp-beach', slug: 'beach-soccer-national', name: 'Beach Soccer National', category: 'Beach Soccer', practice: null, gender: 'M', season: '2025-2026', clubIds: rng.pickN(proClubs, 8).map((c) => c.id), format: 'Tournoi', logoInitials: 'BS' },
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
const productNamer: Record<string, () => string> = {
  Maillots: () => `Maillot Éléphants ${rng.bool() ? 'Domicile' : 'Extérieur'}`,
  Tenues: () => `Tenue d’entraînement Éléphants`,
  Enfants: () => `Maillot Enfant Éléphants ${rng.bool() ? 'Domicile' : 'Extérieur'}`,
  Femmes: () => `Maillot Femme Éléphantes`,
  Accessoires: () => `Bracelet FIF Côte d’Ivoire`,
  Ballons: () => `Ballon Officiel FIF`,
  Écharpes: () => `Écharpe Éléphants`,
  Casquettes: () => `Casquette FIF Côte d’Ivoire`,
}
export const products: Product[] = Array.from({ length: 24 }, (_, i) => {
  const category = productCategories[i % productCategories.length]
  return {
    id: `product-${i}`,
    name: productNamer[category](),
    category,
    price: rng.int(6, 65) * 1000,
    colors: rng.pickN(['Orange', 'Vert', 'Blanc'], rng.int(1, 3)),
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
export function getRegion(id: string) { return regions.find((r) => r.id === id) }
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

// FIF ID verification --------------------------------------------------
export interface VerifiedIdentity {
  fifId: string
  type: 'PLAYER' | 'AGENT' | 'CLUB' | 'REFEREE' | 'COACH'
  name: string
  status: string
  validUntil: string
  profileHref: string
}

export function verifyIdentity(rawId: string): VerifiedIdentity | null {
  const id = rawId.trim().toUpperCase()
  if (!id) return null

  const player = players.find((p) => p.fifId.toUpperCase() === id)
  if (player) {
    return { fifId: player.fifId, type: 'PLAYER', name: player.name, status: player.licenseStatus === 'Valide' ? 'Actif' : player.licenseStatus, validUntil: '2027-06-30', profileHref: `/joueurs/${player.slug}` }
  }

  const agent = agents.find((a) => a.fifId.toUpperCase() === id)
  if (agent) {
    return { fifId: agent.fifId, type: 'AGENT', name: agent.name, status: agent.status, validUntil: agent.validUntil, profileHref: '/officiels?role=agents' }
  }

  const clubMatch = id.match(/^FIF-CLUB-(\d+)$/)
  if (clubMatch) {
    const club = clubs[Number(clubMatch[1])]
    if (club) return { fifId: id, type: 'CLUB', name: club.name, status: 'Actif', validUntil: '2027-06-30', profileHref: `/clubs/${club.slug}` }
  }

  const refMatch = id.match(/^FIF-REF-(\d+)$/)
  if (refMatch) {
    const referee = referees[Number(refMatch[1])]
    if (referee) return { fifId: id, type: 'REFEREE', name: referee.name, status: referee.status, validUntil: '2027-06-30', profileHref: '/officiels?role=arbitres' }
  }

  return null
}
