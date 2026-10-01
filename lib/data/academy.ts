// ---------------------------------------------------------------------------
// FIF Academy — catalogue des formations diplômantes pour tous les métiers
// du football.
//
// Cadre de validation (honnête) :
//  • CAF   — licences d'entraîneur de la Convention CAF des entraîneurs,
//            délivrées par la FIF via sa Direction technique nationale (D, C,
//            B, A). La licence CAF Pro est organisée directement par la CAF.
//  • FIF   — certificats et licences fédérales délivrés par la FIF.
//  • Université — diplômes universitaires en partenariat avec une université
//            ivoirienne : convention à conclure (aucun partenariat existant
//            n'est revendiqué).
//  • FIFA  — préparation à un examen ou un programme organisé par la FIFA
//            (ex. examen d'agent de football) : la FIF prépare, la FIFA délivre.
// Tarifs et calendrier : indicatifs, à valider par la FIF.
// ---------------------------------------------------------------------------

export type AcademyTrackId = 'entraineurs' | 'educateurs' | 'arbitres' | 'dirigeants' | 'performance' | 'sante' | 'organisation'
export type QuizBankId = 'coaching' | 'youth' | 'refereeing' | 'management' | 'scouting' | 'health' | 'agents' | 'operations' | 'integrity'

export interface AcademyTrack { id: AcademyTrackId; label: string; description: string }

export interface Accreditation {
  kind: 'CAF' | 'FIF' | 'Université' | 'FIFA'
  label: string
  status: 'Délivrée par la FIF' | 'Organisée par la CAF' | 'Partenariat universitaire à conclure' | 'Préparation à un examen FIFA'
}

export interface AcademyModule { title: string; hours: number; lessons: string[] }
export interface AcademySession { id: string; city: string; start: string; end: string; seats: number; mode: 'Présentiel' | 'Hybride' | 'En ligne' }

export interface AcademyProgram {
  slug: string
  title: string
  short: string
  track: AcademyTrackId
  level: 'Initiation' | 'Intermédiaire' | 'Avancé' | 'Expert' | 'Tous niveaux'
  accreditation: Accreditation
  diplomaTitle: string
  format: 'Présentiel' | 'Hybride' | 'En ligne'
  duration: string
  hours: number
  price: number
  installments: boolean
  audience: string
  prerequisites: string[]
  objectives: string[]
  modules: AcademyModule[]
  evaluation: string[]
  careers: string[]
  sessions: AcademySession[]
  /** Validation pratique par un instructeur (terrain, match, stage). */
  practical: boolean
  examBank: QuizBankId
  /** Pas d'achat en ligne : dossier de candidature transmis. */
  applyOnly?: boolean
  highlight?: boolean
}

export const ACADEMY_TRACKS: AcademyTrack[] = [
  { id: 'entraineurs', label: 'Entraîneurs', description: 'Licences CAF D à A, licences fédérales, entraîneurs des gardiens et du futsal.' },
  { id: 'educateurs', label: 'Éducateurs', description: 'Football de base, écoles de football, football féminin.' },
  { id: 'arbitres', label: 'Arbitres', description: 'De l’arbitre stagiaire à l’élite, assistants, futsal, instructeurs.' },
  { id: 'dirigeants', label: 'Dirigeants & management', description: 'Gouvernance de club, licence club, management du sport.' },
  { id: 'performance', label: 'Performance & recrutement', description: 'Recruteurs, analystes vidéo et data, préparateurs physiques.' },
  { id: 'sante', label: 'Santé & médical', description: 'Premiers secours, médecine du football, nutrition.' },
  { id: 'organisation', label: 'Match, sécurité & métiers du club', description: 'Commissaires, sécurité des stades, agents, communication, marketing, intégrité.' },
]

const CAF = (label: string): Accreditation => ({ kind: 'CAF', label, status: 'Délivrée par la FIF' })
const FIF = (label: string): Accreditation => ({ kind: 'FIF', label, status: 'Délivrée par la FIF' })
const UNI = (label: string): Accreditation => ({ kind: 'Université', label, status: 'Partenariat universitaire à conclure' })

/** Sessions prévisionnelles. */
function sessions(slug: string, list: [string, string, string, number, AcademySession['mode']?][]): AcademySession[] {
  return list.map(([city, start, end, seats, mode], i) => ({ id: `${slug}-s${i + 1}`, city, start, end, seats, mode: mode ?? 'Présentiel' }))
}

const P: (Omit<AcademyProgram, 'sessions'> & { sessions: [string, string, string, number, AcademySession['mode']?][] })[] = [
  // ---------------------------------------------------------------- Entraîneurs
  {
    slug: 'licence-caf-d', title: 'Licence CAF D', short: 'Le premier diplôme d’entraîneur : encadrer les jeunes et le football de base.',
    track: 'entraineurs', level: 'Initiation', accreditation: CAF('Licence CAF D — Convention CAF des entraîneurs'), diplomaTitle: 'Licence CAF D d’entraîneur de football',
    format: 'Présentiel', duration: '10 jours + 1 an de pratique encadrée', hours: 60, price: 150000, installments: false, highlight: true,
    audience: 'Anciens joueurs, éducateurs de club, enseignants d’EPS, passionnés souhaitant entraîner.',
    prerequisites: ['18 ans minimum', 'Être licencié ou rattaché à un club, une école de football ou une ligue', 'Certificat médical d’aptitude'],
    objectives: ['Organiser et animer une séance adaptée à l’âge', 'Enseigner les gestes techniques de base', 'Encadrer un match de jeunes en sécurité', 'Adopter une posture éducative'],
    modules: [
      { title: 'Le rôle de l’entraîneur éducateur', hours: 8, lessons: ['Valeurs et responsabilités', 'Communication avec les joueurs et les parents', 'Protection des mineurs'] },
      { title: 'Planifier une séance', hours: 14, lessons: ['Structure d’une séance (échauffement, corps, retour au calme)', 'Jeux réduits et situations', 'Gestion du matériel et de l’espace'] },
      { title: 'Technique individuelle', hours: 14, lessons: ['Conduite, passe, contrôle', 'Tir et jeu de tête', 'Démonstration et correction'] },
      { title: 'Jeu et match', hours: 12, lessons: ['Principes de jeu simples', 'Coaching en match de jeunes', 'Lois du jeu essentielles'] },
      { title: 'Santé et sécurité', hours: 12, lessons: ['Échauffement et prévention', 'Premiers secours de base', 'Hydratation et chaleur'] },
    ],
    evaluation: ['Animation d’une séance devant l’instructeur', 'Questionnaire écrit', 'Rapport de pratique après un an'],
    careers: ['Entraîneur d’école de football', 'Adjoint en catégories jeunes', 'Accès à la Licence CAF C'],
    sessions: [['Abidjan', '2026-11-09', '2026-11-18', 30], ['Bouaké', '2027-01-18', '2027-01-27', 30], ['San-Pédro', '2027-03-08', '2027-03-17', 25]],
    practical: true, examBank: 'coaching',
  },
  {
    slug: 'licence-caf-c', title: 'Licence CAF C', short: 'Entraîner des équipes de jeunes et amateurs avec un projet de jeu.',
    track: 'entraineurs', level: 'Intermédiaire', accreditation: CAF('Licence CAF C — Convention CAF des entraîneurs'), diplomaTitle: 'Licence CAF C d’entraîneur de football',
    format: 'Hybride', duration: '2 mois + 2 ans de pratique', hours: 120, price: 400000, installments: true,
    audience: 'Titulaires de la Licence CAF D entraînant en club.',
    prerequisites: ['Licence CAF D', '1 an de pratique d’entraîneur après la Licence D', 'Lettre de recommandation du club'],
    objectives: ['Construire une progression sur un cycle', 'Développer les principes collectifs', 'Analyser un match simple', 'Gérer un groupe et un staff réduit'],
    modules: [
      { title: 'Méthodologie de l’entraînement', hours: 24, lessons: ['Objectifs et contenus par âge', 'Planification hebdomadaire', 'Évaluation des joueurs'] },
      { title: 'Principes tactiques collectifs', hours: 30, lessons: ['Organisation défensive', 'Construction et progression', 'Transitions'] },
      { title: 'Préparation physique intégrée', hours: 18, lessons: ['Qualités physiques du footballeur', 'Charge d’entraînement', 'Récupération'] },
      { title: 'Leadership et gestion de groupe', hours: 18, lessons: ['Communication', 'Motivation', 'Gestion des conflits'] },
      { title: 'Analyse de match', hours: 30, lessons: ['Observer son équipe', 'Observer l’adversaire', 'Débriefing vidéo'] },
    ],
    evaluation: ['Séance pratique évaluée', 'Dossier de planification', 'Examen écrit', 'Visite de l’instructeur en club'],
    careers: ['Entraîneur principal en jeunes ou amateurs', 'Adjoint en Ligue 2', 'Accès à la Licence CAF B'],
    sessions: [['Abidjan', '2027-01-11', '2027-03-12', 28, 'Hybride'], ['Yamoussoukro', '2027-04-05', '2027-06-04', 25, 'Hybride']],
    practical: true, examBank: 'coaching',
  },
  {
    slug: 'licence-caf-b', title: 'Licence CAF B', short: 'Diriger une équipe senior de compétition : Ligue 2, féminines, réserves.',
    track: 'entraineurs', level: 'Avancé', accreditation: CAF('Licence CAF B — Convention CAF des entraîneurs'), diplomaTitle: 'Licence CAF B d’entraîneur de football',
    format: 'Hybride', duration: '4 mois + 1 an de pratique', hours: 200, price: 750000, installments: true,
    audience: 'Titulaires de la Licence CAF C avec expérience en compétition.',
    prerequisites: ['Licence CAF C', '2 ans de pratique après la Licence C', 'Être en poste dans un club'],
    objectives: ['Élaborer un projet de jeu complet', 'Piloter une saison', 'Manager un staff', 'Préparer et analyser des matchs de compétition'],
    modules: [
      { title: 'Projet de jeu et animation', hours: 50, lessons: ['Systèmes et animations', 'Phases arrêtées', 'Adaptation à l’adversaire'] },
      { title: 'Planification de saison', hours: 30, lessons: ['Périodisation', 'Gestion de l’effectif', 'Calendrier et charge'] },
      { title: 'Management du staff', hours: 30, lessons: ['Rôles du staff', 'Réunions et outils', 'Relations avec la direction'] },
      { title: 'Analyse vidéo et données', hours: 40, lessons: ['Indicateurs de performance', 'Montage vidéo', 'Rapport d’analyse'] },
      { title: 'Stage en club', hours: 50, lessons: ['Observation d’un club de Ligue 1', 'Projet personnel', 'Soutenance'] },
    ],
    evaluation: ['Soutenance du projet de jeu', 'Séance évaluée', 'Examen écrit', 'Rapport de stage'],
    careers: ['Entraîneur principal Ligue 2 / féminines', 'Adjoint en Ligue 1', 'Accès à la Licence CAF A'],
    sessions: [['Abidjan', '2027-02-01', '2027-05-28', 25, 'Hybride']],
    practical: true, examBank: 'coaching',
  },
  {
    slug: 'licence-caf-a', title: 'Licence CAF A', short: 'Le haut niveau : entraîner en Ligue 1 et dans les compétitions CAF.',
    track: 'entraineurs', level: 'Expert', accreditation: CAF('Licence CAF A — Convention CAF des entraîneurs'), diplomaTitle: 'Licence CAF A d’entraîneur de football',
    format: 'Hybride', duration: '6 mois + 3 ans de pratique', hours: 300, price: 1500000, installments: true, highlight: true,
    audience: 'Entraîneurs titulaires de la Licence CAF B exerçant en compétition.',
    prerequisites: ['Licence CAF B', '1 an de pratique après la Licence B', 'Sélection sur dossier et entretien'],
    objectives: ['Diriger une équipe de Ligue 1 et en compétition CAF', 'Maîtriser la performance de haut niveau', 'Gérer la pression médiatique', 'Conduire un projet sportif de club'],
    modules: [
      { title: 'Tactique de haut niveau', hours: 70, lessons: ['Analyse des tendances du jeu', 'Plans de match', 'Gestion en cours de match'] },
      { title: 'Performance et science du sport', hours: 60, lessons: ['GPS et charge', 'Prévention des blessures', 'Nutrition et récupération'] },
      { title: 'Leadership et communication', hours: 40, lessons: ['Médias', 'Gestion des stars', 'Culture d’équipe'] },
      { title: 'Management de projet sportif', hours: 40, lessons: ['Recrutement', 'Formation et post-formation', 'Budget sportif'] },
      { title: 'Stage international et mémoire', hours: 90, lessons: ['Stage en club professionnel', 'Mémoire', 'Soutenance devant jury'] },
    ],
    evaluation: ['Mémoire et soutenance', 'Évaluation pratique', 'Examen écrit', 'Jury FIF / instructeurs CAF'],
    careers: ['Entraîneur principal en Ligue 1', 'Sélections nationales de jeunes', 'Accès à la Licence CAF Pro (organisée par la CAF)'],
    sessions: [['Abidjan', '2027-01-11', '2027-06-25', 25, 'Hybride']],
    practical: true, examBank: 'coaching',
  },
  {
    slug: 'licence-caf-pro', title: 'Licence CAF Pro', short: 'La licence suprême, organisée directement par la CAF : la FIF accompagne les candidatures.',
    track: 'entraineurs', level: 'Expert', accreditation: { kind: 'CAF', label: 'Licence CAF Pro', status: 'Organisée par la CAF' }, diplomaTitle: 'Licence CAF Pro',
    format: 'Hybride', duration: 'Programme CAF (plusieurs regroupements)', hours: 0, price: 0, installments: false, applyOnly: true,
    audience: 'Titulaires de la Licence CAF A avec 3 ans de pratique au niveau A.',
    prerequisites: ['Licence CAF A', '3 ans de pratique comme titulaire de la Licence A', 'Proposition de la FIF à la CAF'],
    objectives: ['Entraîner au plus haut niveau africain', 'Diriger une sélection nationale', 'Répondre aux exigences CAF des compétitions interclubs'],
    modules: [{ title: 'Programme fixé par la CAF', hours: 0, lessons: ['Regroupements CAF', 'Stages et projets', 'Évaluations CAF'] }],
    evaluation: ['Évaluations organisées par la CAF'],
    careers: ['Entraîneur en Ligue des champions et Coupe de la Confédération CAF', 'Sélectionneur national'],
    sessions: [], practical: true, examBank: 'coaching',
  },
  {
    slug: 'licence-b-federale', title: 'Licence B fédérale', short: 'La licence de la FIF pour les entraîneurs des championnats nationaux.',
    track: 'entraineurs', level: 'Intermédiaire', accreditation: FIF('Licence fédérale FIF (DTN)'), diplomaTitle: 'Licence B fédérale d’entraîneur',
    format: 'Présentiel', duration: '6 semaines', hours: 150, price: 300000, installments: true,
    audience: 'Entraîneurs des divisions régionales et nationales, anciens joueurs.',
    prerequisites: ['Licence C fédérale ou Licence CAF D', 'Expérience d’entraîneur en club'],
    objectives: ['Entraîner en championnat national', 'Structurer l’entraînement hebdomadaire', 'Manager un groupe senior'],
    modules: [
      { title: 'Entraînement et planification', hours: 40, lessons: ['Microcycle', 'Exercices et situations', 'Évaluation'] },
      { title: 'Tactique', hours: 40, lessons: ['Systèmes de jeu', 'Animation offensive', 'Bloc défensif'] },
      { title: 'Préparation athlétique', hours: 30, lessons: ['Endurance et vitesse', 'Renforcement', 'Prévention'] },
      { title: 'Stage pratique', hours: 40, lessons: ['Séances encadrées', 'Coaching en match', 'Bilan'] },
    ],
    evaluation: ['Séance pratique', 'Examen écrit', 'Rapport de stage'],
    careers: ['Entraîneur en D1/D2 régionales et nationales', 'Adjoint en Ligue 2'],
    sessions: [['Abidjan', '2026-11-16', '2026-12-24', 30], ['Daloa', '2027-02-15', '2027-03-26', 30]],
    practical: true, examBank: 'coaching',
  },
  {
    slug: 'entraineur-gardiens', title: 'Entraîneur des gardiens de but', short: 'Former et préparer les gardiens, des jeunes aux seniors.',
    track: 'entraineurs', level: 'Intermédiaire', accreditation: FIF('Certificat FIF d’entraîneur des gardiens'), diplomaTitle: 'Certificat d’entraîneur des gardiens de but',
    format: 'Présentiel', duration: '3 semaines', hours: 90, price: 250000, installments: true,
    audience: 'Anciens gardiens, entraîneurs titulaires d’une licence D ou C.',
    prerequisites: ['Licence CAF D ou expérience de gardien en compétition'],
    objectives: ['Enseigner les techniques spécifiques du gardien', 'Planifier l’entraînement spécifique', 'Préparer mentalement le gardien'],
    modules: [
      { title: 'Technique du gardien', hours: 30, lessons: ['Prise de balle et plongeons', 'Sorties aériennes', 'Jeu au pied'] },
      { title: 'Tactique du gardien', hours: 20, lessons: ['Placement', 'Organisation de la défense', 'Penalties et coups de pied arrêtés'] },
      { title: 'Préparation spécifique', hours: 20, lessons: ['Explosivité', 'Prévention des blessures', 'Mental'] },
      { title: 'Pratique encadrée', hours: 20, lessons: ['Séances évaluées', 'Analyse vidéo', 'Bilan'] },
    ],
    evaluation: ['Séance spécifique évaluée', 'Examen écrit'], careers: ['Entraîneur des gardiens en club ou en sélection'],
    sessions: [['Abidjan', '2027-02-08', '2027-02-26', 20]], practical: true, examBank: 'coaching',
  },
  {
    slug: 'entraineur-futsal', title: 'Entraîneur futsal', short: 'Les spécificités tactiques et techniques du futsal.',
    track: 'entraineurs', level: 'Initiation', accreditation: FIF('Certificat FIF d’entraîneur futsal'), diplomaTitle: 'Certificat d’entraîneur de futsal',
    format: 'Hybride', duration: '2 semaines', hours: 50, price: 200000, installments: false,
    audience: 'Entraîneurs et éducateurs souhaitant encadrer une équipe de futsal.',
    prerequisites: ['18 ans minimum'],
    objectives: ['Comprendre les règles et le jeu du futsal', 'Mettre en place des systèmes (3-1, 4-0)', 'Gérer les rotations et le temps mort'],
    modules: [
      { title: 'Lois du jeu futsal', hours: 8, lessons: ['Fautes cumulées', 'Rentrées et corners', 'Gardien volant'] },
      { title: 'Tactique futsal', hours: 22, lessons: ['Systèmes 3-1 et 4-0', 'Pressing', 'Supériorité numérique'] },
      { title: 'Technique et séance', hours: 20, lessons: ['Contrôle de la semelle', 'Exercices spécifiques', 'Séance évaluée'] },
    ],
    evaluation: ['Séance évaluée', 'Questionnaire'], careers: ['Entraîneur de club de futsal', 'Encadrement des sélections futsal'],
    sessions: [['Abidjan', '2026-12-07', '2026-12-18', 24, 'Hybride']], practical: true, examBank: 'coaching',
  },
  // ---------------------------------------------------------------- Éducateurs
  {
    slug: 'educateur-football-de-base', title: 'Éducateur football de base (5-12 ans)', short: 'Encadrer une école de football : jouer, apprendre, s’épanouir.',
    track: 'educateurs', level: 'Initiation', accreditation: FIF('Certificat FIF d’éducateur'), diplomaTitle: 'Certificat d’éducateur football de base',
    format: 'Hybride', duration: '2 semaines', hours: 40, price: 75000, installments: false, highlight: true,
    audience: 'Bénévoles, parents, enseignants, jeunes encadrants d’écoles de football.',
    prerequisites: ['17 ans minimum', 'Casier judiciaire vierge (protection des mineurs)'],
    objectives: ['Animer des jeux adaptés aux 5-12 ans', 'Organiser un plateau ou un festival de football', 'Garantir la sécurité et le bien-être des enfants'],
    modules: [
      { title: 'L’enfant et le football', hours: 10, lessons: ['Développement de l’enfant', 'Apprendre en jouant', 'Bienveillance et encouragement'] },
      { title: 'Jeux et ateliers', hours: 16, lessons: ['Jeux de conduite et de passe', 'Petits matchs', 'Plateaux et festivals'] },
      { title: 'Protection et santé', hours: 14, lessons: ['Protection des mineurs', 'Premiers secours enfant', 'Chaleur et hydratation'] },
    ],
    evaluation: ['Animation d’un atelier', 'Questionnaire'], careers: ['Éducateur d’école de football', 'Accès à la Licence CAF D'],
    sessions: [['Abidjan', '2026-11-02', '2026-11-13', 40, 'Hybride'], ['Korhogo', '2027-01-11', '2027-01-22', 35, 'Hybride'], ['Man', '2027-02-22', '2027-03-05', 35, 'Hybride']],
    practical: true, examBank: 'youth',
  },
  {
    slug: 'educatrice-football-feminin', title: 'Encadrement du football féminin', short: 'Développer et fidéliser la pratique des filles et des femmes.',
    track: 'educateurs', level: 'Initiation', accreditation: FIF('Certificat FIF football féminin'), diplomaTitle: 'Certificat d’encadrement du football féminin',
    format: 'Hybride', duration: '1 semaine', hours: 30, price: 75000, installments: false,
    audience: 'Éducatrices et éducateurs, dirigeantes et dirigeants de sections féminines.',
    prerequisites: ['18 ans minimum'],
    objectives: ['Créer et animer une section féminine', 'Adapter l’entraînement', 'Lever les freins à la pratique'],
    modules: [
      { title: 'Développer la pratique', hours: 10, lessons: ['Recrutement des joueuses', 'Partenariats écoles', 'Fidélisation'] },
      { title: 'Entraînement adapté', hours: 12, lessons: ['Spécificités physiologiques', 'Prévention des blessures (genou)', 'Séances types'] },
      { title: 'Environnement sûr', hours: 8, lessons: ['Protection', 'Équité', 'Leadership féminin'] },
    ],
    evaluation: ['Projet de section féminine', 'Questionnaire'], careers: ['Responsable de section féminine', 'Éducatrice'],
    sessions: [['Abidjan', '2027-03-08', '2027-03-12', 30, 'Hybride']], practical: false, examBank: 'youth',
  },
  // ---------------------------------------------------------------- Arbitres
  {
    slug: 'arbitre-stagiaire', title: 'Arbitre stagiaire (district et ligue)', short: 'Devenir arbitre : maîtriser les Lois du jeu et diriger ses premiers matchs.',
    track: 'arbitres', level: 'Initiation', accreditation: FIF('Certificat FIF d’arbitre — direction de l’arbitrage'), diplomaTitle: 'Certificat d’arbitre de football (niveau district/ligue)',
    format: 'Hybride', duration: '4 semaines + matchs d’application', hours: 60, price: 50000, installments: false, highlight: true,
    audience: 'Toute personne de 16 à 35 ans en bonne condition physique.',
    prerequisites: ['16 ans minimum', 'Certificat médical', 'Test physique d’entrée'],
    objectives: ['Connaître les 17 Lois du jeu', 'Se placer et se déplacer', 'Gérer les situations disciplinaires', 'Rédiger un rapport de match'],
    modules: [
      { title: 'Les Lois du jeu', hours: 24, lessons: ['Terrain, ballon, joueurs, équipements', 'Fautes et incorrections', 'Hors-jeu', 'Coups francs, penalty, rentrée de touche'] },
      { title: 'Technique d’arbitrage', hours: 16, lessons: ['Placement et diagonale', 'Signaux et coup de sifflet', 'Coopération avec les assistants'] },
      { title: 'Préparation physique', hours: 10, lessons: ['Tests physiques', 'Programme d’entraînement', 'Récupération'] },
      { title: 'Gestion du match', hours: 10, lessons: ['Communication et autorité', 'Gestion des conflits', 'Rapport disciplinaire'] },
    ],
    evaluation: ['Examen écrit sur les Lois du jeu', 'Test physique', 'Matchs observés'],
    careers: ['Arbitre de district et de ligue', 'Évolution vers les catégories nationales'],
    sessions: [['Abidjan', '2026-11-07', '2026-12-05', 50, 'Hybride'], ['Bouaké', '2027-01-09', '2027-02-06', 40, 'Hybride'], ['Gagnoa', '2027-03-06', '2027-04-03', 40, 'Hybride']],
    practical: true, examBank: 'refereeing',
  },
  {
    slug: 'arbitre-assistant', title: 'Arbitre assistant', short: 'La spécialité de l’assistant : hors-jeu, signalisation, coopération.',
    track: 'arbitres', level: 'Intermédiaire', accreditation: FIF('Certificat FIF d’arbitre assistant'), diplomaTitle: 'Certificat d’arbitre assistant',
    format: 'Présentiel', duration: '2 semaines', hours: 40, price: 50000, installments: false,
    audience: 'Arbitres en activité souhaitant se spécialiser.',
    prerequisites: ['Certificat d’arbitre', '1 saison d’arbitrage'],
    objectives: ['Juger le hors-jeu avec précision', 'Maîtriser la signalisation au drapeau', 'Assister l’arbitre dans la gestion disciplinaire'],
    modules: [
      { title: 'Hors-jeu', hours: 16, lessons: ['Position et infraction', 'Interférence', 'Exercices vidéo'] },
      { title: 'Signalisation', hours: 12, lessons: ['Drapeau et oreillettes', 'Touches, corners, buts', 'Remplacements'] },
      { title: 'Déplacements spécifiques', hours: 12, lessons: ['Pas chassés', 'Sprint', 'Tests physiques assistants'] },
    ],
    evaluation: ['Test vidéo hors-jeu', 'Test physique', 'Matchs observés'], careers: ['Arbitre assistant de ligue et national'],
    sessions: [['Abidjan', '2027-02-01', '2027-02-12', 30]], practical: true, examBank: 'refereeing',
  },
  {
    slug: 'arbitre-elite', title: 'Arbitre élite — préparation au haut niveau', short: 'Préparer les arbitres nationaux aux standards internationaux.',
    track: 'arbitres', level: 'Expert', accreditation: FIF('Programme élite FIF (standards FIFA/CAF)'), diplomaTitle: 'Attestation du programme Arbitre élite',
    format: 'Hybride', duration: '1 saison (regroupements mensuels)', hours: 120, price: 150000, installments: true,
    audience: 'Arbitres de Ligue 1 et candidats aux listes internationales.',
    prerequisites: ['Arbitre de Ligue 1 ou Ligue 2', 'Proposition de la direction de l’arbitrage'],
    objectives: ['Atteindre les standards physiques FIFA', 'Maîtriser la lecture du jeu de haut niveau', 'Se préparer à l’arbitrage vidéo (VAR)', 'Gérer la pression médiatique'],
    modules: [
      { title: 'Condition physique de haut niveau', hours: 30, lessons: ['Tests FIFA', 'Programmes individualisés', 'Suivi GPS'] },
      { title: 'Analyse vidéo des décisions', hours: 40, lessons: ['Fautes et sanctions disciplinaires', 'Main', 'Hors-jeu complexe'] },
      { title: 'Sensibilisation VAR', hours: 20, lessons: ['Protocole VAR', 'Communication arbitre-VAR', 'Révision à l’écran'] },
      { title: 'Psychologie et communication', hours: 30, lessons: ['Gestion du stress', 'Langage corporel', 'Anglais de l’arbitrage'] },
    ],
    evaluation: ['Tests physiques', 'Observations en match', 'Examen vidéo'], careers: ['Listes d’arbitres internationaux (sur décision FIFA)', 'Compétitions CAF'],
    sessions: [['Abidjan', '2026-11-14', '2027-06-12', 20, 'Hybride']], practical: true, examBank: 'refereeing',
  },
  {
    slug: 'arbitre-futsal-beach', title: 'Arbitre futsal et beach soccer', short: 'Les Lois du jeu et la gestion des matchs de futsal et de beach soccer.',
    track: 'arbitres', level: 'Initiation', accreditation: FIF('Certificat FIF d’arbitre futsal / beach soccer'), diplomaTitle: 'Certificat d’arbitre futsal et beach soccer',
    format: 'Hybride', duration: '2 semaines', hours: 36, price: 50000, installments: false,
    audience: 'Arbitres et nouveaux candidats.', prerequisites: ['16 ans minimum', 'Certificat médical'],
    objectives: ['Appliquer les Lois du futsal et du beach soccer', 'Travailler en binôme d’arbitres', 'Gérer le chronométrage'],
    modules: [
      { title: 'Lois du futsal', hours: 14, lessons: ['Fautes cumulées', 'Règle des 4 secondes', 'Remplacements volants'] },
      { title: 'Lois du beach soccer', hours: 10, lessons: ['Terrain et durée', 'Coups francs', 'Tirs au but'] },
      { title: 'Pratique', hours: 12, lessons: ['Binôme d’arbitres', 'Chronométreur', 'Matchs observés'] },
    ],
    evaluation: ['Examen écrit', 'Matchs observés'], careers: ['Arbitre de futsal et de beach soccer'],
    sessions: [['Abidjan', '2027-01-25', '2027-02-05', 25, 'Hybride']], practical: true, examBank: 'refereeing',
  },
  {
    slug: 'instructeur-observateur-arbitres', title: 'Instructeur et observateur d’arbitres', short: 'Former, observer et évaluer les arbitres.',
    track: 'arbitres', level: 'Expert', accreditation: FIF('Certificat FIF d’instructeur d’arbitrage'), diplomaTitle: 'Certificat d’instructeur et observateur d’arbitres',
    format: 'Présentiel', duration: '3 semaines', hours: 70, price: 200000, installments: true,
    audience: 'Anciens arbitres nationaux et internationaux.', prerequisites: ['Ancien arbitre national ou international', 'Désignation par la direction de l’arbitrage'],
    objectives: ['Observer et noter un arbitre', 'Animer une formation', 'Accompagner la progression des arbitres'],
    modules: [
      { title: 'Observation', hours: 24, lessons: ['Grille d’évaluation', 'Rapport d’observation', 'Entretien post-match'] },
      { title: 'Pédagogie pour adultes', hours: 24, lessons: ['Préparer un cours', 'Analyse vidéo pédagogique', 'Évaluer les connaissances'] },
      { title: 'Accompagnement', hours: 22, lessons: ['Mentorat', 'Plans de progression', 'Détection des talents'] },
    ],
    evaluation: ['Observation réelle', 'Cours animé', 'Examen'], careers: ['Observateur FIF', 'Instructeur de ligue'],
    sessions: [['Abidjan', '2027-03-01', '2027-03-19', 20]], practical: true, examBank: 'refereeing',
  },
  // ---------------------------------------------------------------- Dirigeants
  {
    slug: 'gouvernance-gestion-club', title: 'Gouvernance et gestion de club', short: 'Diriger un club : statuts, finances, projet, conformité.',
    track: 'dirigeants', level: 'Tous niveaux', accreditation: FIF('Certificat FIF de dirigeant de club'), diplomaTitle: 'Certificat de dirigeant de club de football',
    format: 'Hybride', duration: '4 semaines (week-ends)', hours: 60, price: 250000, installments: true, highlight: true,
    audience: 'Présidents, secrétaires généraux, trésoriers et administrateurs de clubs.',
    prerequisites: ['Exercer une fonction dans un club affilié ou en projet'],
    objectives: ['Mettre en conformité statuts et instances', 'Établir un budget et un plan de financement', 'Construire un projet de club', 'Gérer les licences et les transferts'],
    modules: [
      { title: 'Cadre juridique et institutionnel', hours: 12, lessons: ['Statuts FIF et règlements', 'Assemblée générale et bureau', 'Responsabilités du dirigeant'] },
      { title: 'Finances du club', hours: 16, lessons: ['Budget et trésorerie', 'Sponsoring et partenariats', 'Transparence et audit'] },
      { title: 'Projet de club', hours: 14, lessons: ['Vision et objectifs', 'Formation des jeunes', 'Infrastructures'] },
      { title: 'Administration sportive', hours: 10, lessons: ['Licences et qualifications', 'Transferts et contrats', 'Discipline et recours'] },
      { title: 'Communication et supporters', hours: 8, lessons: ['Image du club', 'Réseaux sociaux', 'Relations avec les supporters'] },
    ],
    evaluation: ['Projet de club présenté au jury', 'Questionnaire'], careers: ['Président, secrétaire général, manager de club'],
    sessions: [['Abidjan', '2026-11-14', '2026-12-06', 40, 'Hybride'], ['Yamoussoukro', '2027-02-06', '2027-02-28', 35, 'Hybride']],
    practical: false, examBank: 'management',
  },
  {
    slug: 'licence-club-conformite', title: 'Licence club et conformité', short: 'Préparer son club aux critères de licence (sportifs, infrastructures, finances).',
    track: 'dirigeants', level: 'Intermédiaire', accreditation: FIF('Certificat FIF — licence club'), diplomaTitle: 'Certificat de responsable licence club',
    format: 'En ligne', duration: '3 semaines', hours: 30, price: 150000, installments: false,
    audience: 'Responsables administratifs et managers de clubs de Ligue 1 et Ligue 2.',
    prerequisites: ['Fonction administrative en club'],
    objectives: ['Connaître les critères de licence club', 'Constituer le dossier', 'Suivre la conformité toute la saison'],
    modules: [
      { title: 'Critères sportifs et infrastructures', hours: 10, lessons: ['Équipes de jeunes', 'Stade et sécurité', 'Staff qualifié'] },
      { title: 'Critères administratifs et financiers', hours: 12, lessons: ['États financiers', 'Absence d’arriérés', 'Personnel administratif'] },
      { title: 'Dossier et calendrier', hours: 8, lessons: ['Pièces à fournir', 'Échéances', 'Recours'] },
    ],
    evaluation: ['Dossier fictif complet', 'Questionnaire'], careers: ['Responsable licence club / conformité'],
    sessions: [['En ligne', '2027-01-11', '2027-01-29', 100, 'En ligne']], practical: false, examBank: 'management',
  },
  {
    slug: 'du-management-sport-football', title: 'Diplôme universitaire — Management du football', short: 'Un DU pour professionnaliser les cadres du football ivoirien.',
    track: 'dirigeants', level: 'Avancé', accreditation: UNI('Diplôme universitaire (DU) FIF × université ivoirienne'), diplomaTitle: 'Diplôme universitaire en management du football',
    format: 'Hybride', duration: '9 mois', hours: 220, price: 1200000, installments: true, highlight: true,
    audience: 'Cadres de clubs, de ligues et de la FIF ; diplômés souhaitant travailler dans le football.',
    prerequisites: ['Baccalauréat + 2 ou expérience professionnelle équivalente validée', 'Entretien de motivation'],
    objectives: ['Piloter une organisation sportive', 'Maîtriser le marketing et les droits', 'Gérer un événement', 'Comprendre le droit du sport'],
    modules: [
      { title: 'Stratégie des organisations sportives', hours: 40, lessons: ['Gouvernance', 'Planification stratégique', 'Études de cas africaines'] },
      { title: 'Marketing, sponsoring et médias', hours: 40, lessons: ['Marque et fans', 'Droits TV et digital', 'Activation des partenaires'] },
      { title: 'Finance et économie du football', hours: 40, lessons: ['Modèles économiques', 'Transferts', 'Contrôle de gestion'] },
      { title: 'Droit du sport', hours: 30, lessons: ['Contrats', 'Règlements FIFA', 'Litiges et TAS'] },
      { title: 'Événementiel et billetterie', hours: 30, lessons: ['Organisation de match', 'Sécurité', 'Billetterie'] },
      { title: 'Mémoire professionnel', hours: 40, lessons: ['Stage', 'Mémoire', 'Soutenance'] },
    ],
    evaluation: ['Contrôle continu', 'Mémoire et soutenance devant jury université / FIF'], careers: ['Manager de club', 'Cadre de ligue ou de fédération', 'Marketing sportif'],
    sessions: [['Abidjan', '2027-01-15', '2027-10-15', 35, 'Hybride']], practical: false, examBank: 'management',
  },
  // ---------------------------------------------------------------- Performance
  {
    slug: 'recruteur-detection-talents', title: 'Recruteur — détection des talents', short: 'Observer, évaluer et recommander des joueurs.',
    track: 'performance', level: 'Intermédiaire', accreditation: FIF('Certificat FIF de recruteur'), diplomaTitle: 'Certificat de recruteur — détection des talents',
    format: 'Hybride', duration: '4 semaines', hours: 60, price: 200000, installments: true,
    audience: 'Recruteurs de clubs et d’académies, entraîneurs, anciens joueurs.',
    prerequisites: ['Expérience dans le football (joueur, entraîneur, dirigeant)'],
    objectives: ['Évaluer un joueur selon une grille', 'Rédiger un rapport de scouting', 'Organiser une cellule de recrutement', 'Respecter l’éthique et la protection des mineurs'],
    modules: [
      { title: 'Profil et potentiel', hours: 16, lessons: ['Critères techniques, tactiques, physiques, mentaux', 'Âge relatif et maturation', 'Potentiel vs niveau actuel'] },
      { title: 'Observation et rapports', hours: 20, lessons: ['Grille d’observation', 'Rapport écrit', 'Vidéo et données'] },
      { title: 'Cellule de recrutement', hours: 12, lessons: ['Réseau et zones', 'Base de données', 'Décision collective'] },
      { title: 'Cadre réglementaire et éthique', hours: 12, lessons: ['Transferts de mineurs (FIFA)', 'Indemnités de formation', 'Éthique'] },
    ],
    evaluation: ['Trois rapports d’observation réels', 'Questionnaire'], careers: ['Recruteur de club ou d’académie', 'Responsable de cellule recrutement'],
    sessions: [['Abidjan', '2027-01-18', '2027-02-12', 30, 'Hybride']], practical: true, examBank: 'scouting',
  },
  {
    slug: 'analyste-video-data', title: 'Analyste vidéo et data', short: 'Transformer la vidéo et les données en avantage sportif.',
    track: 'performance', level: 'Intermédiaire', accreditation: FIF('Certificat FIF d’analyste de la performance'), diplomaTitle: 'Certificat d’analyste vidéo et data',
    format: 'Hybride', duration: '5 semaines', hours: 70, price: 250000, installments: true,
    audience: 'Adjoints, jeunes diplômés, analystes en club.', prerequisites: ['Maîtrise de l’informatique', 'Connaissance du jeu'],
    objectives: ['Filmer et découper un match', 'Produire des indicateurs', 'Présenter une analyse au staff'],
    modules: [
      { title: 'Captation et découpage', hours: 20, lessons: ['Filmer un match', 'Logiciels de codage', 'Clips et montage'] },
      { title: 'Données et indicateurs', hours: 25, lessons: ['Statistiques de base', 'xG et indicateurs avancés', 'Tableaux de bord'] },
      { title: 'Restitution', hours: 25, lessons: ['Rapport d’adversaire', 'Débriefing joueurs', 'Projet final'] },
    ],
    evaluation: ['Analyse complète d’un match réel'], careers: ['Analyste vidéo de club ou de sélection'],
    sessions: [['Abidjan', '2027-02-15', '2027-03-19', 20, 'Hybride']], practical: false, examBank: 'scouting',
  },
  {
    slug: 'preparateur-physique-football', title: 'Préparateur physique du footballeur', short: 'Planifier la performance athlétique et prévenir les blessures.',
    track: 'performance', level: 'Avancé', accreditation: UNI('Diplôme universitaire (DU) FIF × université ivoirienne'), diplomaTitle: 'Diplôme universitaire de préparateur physique en football',
    format: 'Hybride', duration: '6 mois', hours: 160, price: 900000, installments: true,
    audience: 'Diplômés STAPS / INJS, entraîneurs, éducateurs sportifs.',
    prerequisites: ['Diplôme en sciences du sport ou Licence CAF C', 'Entretien'],
    objectives: ['Évaluer les qualités physiques', 'Programmer la saison', 'Réathlétiser après blessure', 'Utiliser le GPS et la charge'],
    modules: [
      { title: 'Physiologie du football', hours: 30, lessons: ['Filières énergétiques', 'Profil du match', 'Fatigue'] },
      { title: 'Tests et évaluations', hours: 30, lessons: ['Tests terrain', 'Interprétation', 'Profils individuels'] },
      { title: 'Programmation', hours: 40, lessons: ['Périodisation', 'Force et vitesse', 'Endurance intermittente'] },
      { title: 'Prévention et réathlétisation', hours: 30, lessons: ['Ischio-jambiers et genou', 'Retour au jeu', 'Coordination médicale'] },
      { title: 'Stage', hours: 30, lessons: ['Stage en club', 'Rapport', 'Soutenance'] },
    ],
    evaluation: ['Contrôle continu', 'Rapport de stage et soutenance'], careers: ['Préparateur physique de club ou de sélection'],
    sessions: [['Abidjan', '2027-01-11', '2027-07-09', 25, 'Hybride']], practical: true, examBank: 'health',
  },
  // ---------------------------------------------------------------- Santé
  {
    slug: 'premiers-secours-terrain', title: 'Premiers secours sur le terrain', short: 'Réagir vite : arrêt cardiaque, commotion, blessures.',
    track: 'sante', level: 'Tous niveaux', accreditation: FIF('Attestation FIF de premiers secours'), diplomaTitle: 'Attestation de premiers secours en football',
    format: 'Présentiel', duration: '2 jours', hours: 14, price: 35000, installments: false, highlight: true,
    audience: 'Entraîneurs, éducateurs, dirigeants, arbitres, bénévoles.', prerequisites: ['Aucun'],
    objectives: ['Pratiquer la réanimation et utiliser un défibrillateur', 'Reconnaître une commotion cérébrale', 'Prendre en charge une blessure en attendant les secours'],
    modules: [
      { title: 'Urgences vitales', hours: 6, lessons: ['Alerter les secours', 'Massage cardiaque', 'Défibrillateur automatisé'] },
      { title: 'Commotion cérébrale', hours: 4, lessons: ['Signes d’alerte', '« En cas de doute, on sort le joueur »', 'Retour progressif au jeu'] },
      { title: 'Blessures courantes', hours: 4, lessons: ['Entorse et contusion', 'Saignements', 'Coup de chaleur'] },
    ],
    evaluation: ['Mises en situation pratiques'], careers: ['Obligatoire pour encadrer en club (recommandé)'],
    sessions: [['Abidjan', '2026-11-21', '2026-11-22', 30], ['Bouaké', '2026-12-12', '2026-12-13', 30], ['San-Pédro', '2027-01-23', '2027-01-24', 30]],
    practical: true, examBank: 'health',
  },
  {
    slug: 'du-medecine-football', title: 'Diplôme universitaire — Médecine du football', short: 'Pour les médecins et kinésithérapeutes des clubs et sélections.',
    track: 'sante', level: 'Expert', accreditation: UNI('Diplôme universitaire (DU) FIF × faculté de médecine'), diplomaTitle: 'Diplôme universitaire de médecine du football',
    format: 'Hybride', duration: '8 mois', hours: 180, price: 1500000, installments: true,
    audience: 'Médecins, kinésithérapeutes, internes en médecine du sport.', prerequisites: ['Diplôme de médecin ou de kinésithérapeute'],
    objectives: ['Assurer le suivi médical d’une équipe', 'Organiser la couverture médicale d’un match', 'Appliquer les règles antidopage', 'Conduire le retour au jeu'],
    modules: [
      { title: 'Traumatologie du football', hours: 40, lessons: ['Lésions musculaires', 'Genou et cheville', 'Imagerie'] },
      { title: 'Cardiologie et dépistage', hours: 30, lessons: ['Examen de pré-participation', 'Mort subite du sportif', 'ECG'] },
      { title: 'Organisation médicale du match', hours: 30, lessons: ['Plan d’urgence', 'Équipements', 'Évacuation'] },
      { title: 'Antidopage et éthique', hours: 20, lessons: ['Liste des interdictions', 'Contrôles', 'AUT'] },
      { title: 'Réathlétisation', hours: 30, lessons: ['Protocoles', 'Critères de retour', 'Travail avec le préparateur'] },
      { title: 'Mémoire', hours: 30, lessons: ['Stage', 'Mémoire', 'Soutenance'] },
    ],
    evaluation: ['Examens', 'Mémoire et soutenance'], careers: ['Médecin ou kiné de club et de sélection'],
    sessions: [['Abidjan', '2027-01-15', '2027-09-10', 25, 'Hybride']], practical: true, examBank: 'health',
  },
  {
    slug: 'nutrition-footballeur', title: 'Nutrition du footballeur', short: 'Alimentation, hydratation et récupération adaptées au climat ivoirien.',
    track: 'sante', level: 'Initiation', accreditation: FIF('Certificat FIF de nutrition sportive'), diplomaTitle: 'Certificat de nutrition du footballeur',
    format: 'En ligne', duration: '3 semaines', hours: 20, price: 100000, installments: false,
    audience: 'Staffs, joueurs, éducateurs, familles de jeunes joueurs.', prerequisites: ['Aucun'],
    objectives: ['Composer les repas autour de l’entraînement et du match', 'Gérer l’hydratation par forte chaleur', 'Sensibiliser aux compléments et au dopage'],
    modules: [
      { title: 'Bases de la nutrition', hours: 6, lessons: ['Glucides, protéines, lipides', 'Produits locaux', 'Assiette type'] },
      { title: 'Avant, pendant, après', hours: 8, lessons: ['Repas d’avant-match', 'Hydratation', 'Récupération'] },
      { title: 'Cas particuliers', hours: 6, lessons: ['Jeunes joueurs', 'Ramadan', 'Compléments et risques'] },
    ],
    evaluation: ['Questionnaire', 'Plan alimentaire d’une semaine'], careers: ['Référent nutrition en club'],
    sessions: [['En ligne', '2026-11-16', '2026-12-04', 200, 'En ligne']], practical: false, examBank: 'health',
  },
  // ---------------------------------------------------------------- Organisation
  {
    slug: 'commissaire-de-match', title: 'Commissaire de match', short: 'Représenter l’organisateur et garantir le bon déroulement des matchs.',
    track: 'organisation', level: 'Intermédiaire', accreditation: FIF('Certificat FIF de commissaire de match'), diplomaTitle: 'Certificat de commissaire de match',
    format: 'Présentiel', duration: '1 semaine', hours: 30, price: 150000, installments: false,
    audience: 'Anciens dirigeants, anciens arbitres, cadres de ligues.', prerequisites: ['30 ans minimum', 'Expérience dans le football'],
    objectives: ['Conduire la réunion d’avant-match', 'Contrôler stade, licences et feuilles de match', 'Rédiger le rapport officiel'],
    modules: [
      { title: 'Règlements des compétitions', hours: 10, lessons: ['Qualification des joueurs', 'Réserves et réclamations', 'Sanctions'] },
      { title: 'Le jour du match', hours: 12, lessons: ['Réunion d’organisation', 'Contrôles', 'Incidents'] },
      { title: 'Rapport officiel', hours: 8, lessons: ['Rédaction', 'Feuille de match numérique', 'Transmission'] },
    ],
    evaluation: ['Mise en situation sur un match', 'Questionnaire'], careers: ['Commissaire de match FIF', 'Coordinateur de match'],
    sessions: [['Abidjan', '2026-12-07', '2026-12-11', 25]], practical: true, examBank: 'operations',
  },
  {
    slug: 'securite-stades', title: 'Responsable sécurité des stades', short: 'Accueil, flux, sûreté et évacuation des spectateurs.',
    track: 'organisation', level: 'Intermédiaire', accreditation: FIF('Certificat FIF sûreté et sécurité des stades'), diplomaTitle: 'Certificat de responsable sécurité de stade',
    format: 'Présentiel', duration: '1 semaine', hours: 35, price: 120000, installments: false,
    audience: 'Responsables sécurité de clubs, stadiers, gestionnaires de stades.', prerequisites: ['Fonction en lien avec l’organisation des matchs'],
    objectives: ['Élaborer un plan de sécurité', 'Gérer les flux et le contrôle d’accès', 'Coordonner avec les forces de l’ordre et les secours'],
    modules: [
      { title: 'Évaluation des risques', hours: 10, lessons: ['Classement des matchs', 'Capacité et zones', 'Supporters à risque'] },
      { title: 'Accès et flux', hours: 12, lessons: ['Billetterie et contrôle QR', 'Palpations', 'Circulation'] },
      { title: 'Crise et évacuation', hours: 13, lessons: ['Plan d’évacuation', 'Poste de commandement', 'Communication de crise'] },
    ],
    evaluation: ['Exercice de simulation', 'Questionnaire'], careers: ['Responsable sécurité de club ou de stade'],
    sessions: [['Abidjan', '2027-01-25', '2027-01-29', 30]], practical: true, examBank: 'operations',
  },
  {
    slug: 'preparation-examen-agent-fifa', title: 'Préparation à l’examen d’agent FIFA', short: 'Réussir l’examen FIFA d’agent de football.',
    track: 'organisation', level: 'Avancé', accreditation: { kind: 'FIFA', label: 'Préparation à l’examen FIFA d’agent de football (licence délivrée par la FIFA)', status: 'Préparation à un examen FIFA' },
    diplomaTitle: 'Attestation de préparation à l’examen d’agent FIFA',
    format: 'En ligne', duration: '8 semaines', hours: 48, price: 350000, installments: true,
    audience: 'Futurs agents de football, juristes, intermédiaires.', prerequisites: ['Majeur', 'Remplir les conditions d’éligibilité de la FIFA'],
    objectives: ['Maîtriser le Règlement FIFA sur les agents de football', 'Connaître le statut et le transfert des joueurs', 'S’entraîner sur des examens blancs'],
    modules: [
      { title: 'Règlement FIFA sur les agents', hours: 14, lessons: ['Licence et obligations', 'Rémunération', 'Conflits d’intérêts'] },
      { title: 'Statut et transfert des joueurs', hours: 14, lessons: ['Contrats', 'Indemnités de formation et contribution de solidarité', 'Protection des mineurs'] },
      { title: 'Statuts, éthique, discipline', hours: 8, lessons: ['Statuts FIFA', 'Code d’éthique', 'Code disciplinaire'] },
      { title: 'Examens blancs', hours: 12, lessons: ['QCM chronométrés', 'Corrections', 'Stratégie d’examen'] },
    ],
    evaluation: ['Examens blancs (l’examen officiel est organisé par la FIFA)'], careers: ['Agent de football licencié FIFA (après réussite de l’examen FIFA)'],
    sessions: [['En ligne', '2027-01-05', '2027-02-27', 150, 'En ligne']], practical: false, examBank: 'agents',
  },
  {
    slug: 'communication-medias-club', title: 'Communication et médias de club', short: 'Attaché de presse, réseaux sociaux, relations médias.',
    track: 'organisation', level: 'Initiation', accreditation: FIF('Certificat FIF de communication sportive'), diplomaTitle: 'Certificat de chargé de communication de club',
    format: 'Hybride', duration: '3 semaines', hours: 40, price: 150000, installments: false,
    audience: 'Chargés de communication, journalistes, community managers de clubs.', prerequisites: ['Aucun'],
    objectives: ['Organiser une conférence de presse', 'Produire du contenu pour les réseaux', 'Gérer une communication de crise'],
    modules: [
      { title: 'Relations presse', hours: 12, lessons: ['Communiqué', 'Conférence de presse', 'Zone mixte'] },
      { title: 'Contenus digitaux', hours: 16, lessons: ['Ligne éditoriale', 'Photo et vidéo mobile', 'Statistiques d’audience'] },
      { title: 'Crise et e-réputation', hours: 12, lessons: ['Anticiper', 'Réagir', 'Modération'] },
    ],
    evaluation: ['Plan de communication d’un club', 'Questionnaire'], careers: ['Attaché de presse, responsable communication'],
    sessions: [['Abidjan', '2027-02-08', '2027-02-26', 30, 'Hybride']], practical: false, examBank: 'operations',
  },
  {
    slug: 'marketing-billetterie-fans', title: 'Marketing, billetterie et expérience fans', short: 'Remplir les stades et développer les revenus du club.',
    track: 'organisation', level: 'Intermédiaire', accreditation: FIF('Certificat FIF de marketing sportif'), diplomaTitle: 'Certificat de marketing sportif et billetterie',
    format: 'Hybride', duration: '3 semaines', hours: 40, price: 200000, installments: true,
    audience: 'Responsables commerciaux, marketing et billetterie de clubs et ligues.', prerequisites: ['Aucun'],
    objectives: ['Construire une offre billetterie', 'Fidéliser les supporters', 'Vendre des partenariats'],
    modules: [
      { title: 'Billetterie', hours: 14, lessons: ['Tarification', 'Billet électronique et contrôle', 'Abonnements'] },
      { title: 'Expérience supporters', hours: 12, lessons: ['Jour de match', 'Programmes de fidélité', 'Familles et femmes au stade'] },
      { title: 'Partenariats', hours: 14, lessons: ['Offre de sponsoring', 'Activation', 'Mesure du retour'] },
    ],
    evaluation: ['Plan marketing d’un club', 'Questionnaire'], careers: ['Responsable marketing, billetterie ou partenariats'],
    sessions: [['Abidjan', '2027-03-01', '2027-03-19', 30, 'Hybride']], practical: false, examBank: 'operations',
  },
  {
    slug: 'integrite-protection-mineurs', title: 'Intégrité et protection des mineurs', short: 'Prévenir les abus, le trucage de matchs et protéger les enfants.',
    track: 'organisation', level: 'Tous niveaux', accreditation: FIF('Attestation FIF — intégrité et protection (s’appuie sur la boîte à outils FIFA Guardians)'), diplomaTitle: 'Attestation intégrité et protection des mineurs',
    format: 'En ligne', duration: '1 semaine', hours: 10, price: 25000, installments: false,
    audience: 'Tous les acteurs : entraîneurs, éducateurs, dirigeants, arbitres, agents.', prerequisites: ['Aucun'],
    objectives: ['Reconnaître les signes d’abus', 'Savoir signaler', 'Identifier les approches de manipulation des matchs'],
    modules: [
      { title: 'Protection des enfants', hours: 4, lessons: ['Formes d’abus', 'Comportements à risque', 'Signalement'] },
      { title: 'Intégrité des compétitions', hours: 4, lessons: ['Trucage et paris', 'Approches suspectes', 'Obligation de signalement'] },
      { title: 'Cadre et sanctions', hours: 2, lessons: ['Code d’éthique', 'Sanctions disciplinaires', 'Ressources'] },
    ],
    evaluation: ['Questionnaire'], careers: ['Prérequis recommandé pour tout encadrement de mineurs'],
    sessions: [['En ligne', '2026-11-02', '2026-11-08', 500, 'En ligne']], practical: false, examBank: 'integrity',
  },
]

export const academyPrograms: AcademyProgram[] = P.map((p) => ({ ...p, sessions: sessions(p.slug, p.sessions) }))

export function getProgram(slug: string) { return academyPrograms.find((p) => p.slug === slug) }
export function programsOfTrack(id: AcademyTrackId) { return academyPrograms.filter((p) => p.track === id) }

// ---------------------------------------------------------------------------
// Banque d'examens finaux (QCM). Seuil de réussite : 5 bonnes réponses sur 6.
// ---------------------------------------------------------------------------
export interface QuizQuestion { q: string; choices: string[]; answer: number }
export const EXAM_PASS = 5

export const quizBanks: Record<QuizBankId, QuizQuestion[]> = {
  coaching: [
    { q: 'Quelle est la structure classique d’une séance ?', choices: ['Match uniquement', 'Échauffement, corps de séance, retour au calme', 'Course longue puis tirs', 'Théorie puis match'], answer: 1 },
    { q: 'Pour des enfants de 8 ans, on privilégie :', choices: ['Les longues files d’attente', 'Les jeux réduits avec beaucoup de touches de balle', 'La préparation physique sans ballon', 'Le 11 contre 11'], answer: 1 },
    { q: 'Une « transition » désigne :', choices: ['Le changement de statut à la perte ou à la récupération du ballon', 'La mi-temps', 'Un remplacement', 'Le retour au vestiaire'], answer: 0 },
    { q: 'La charge d’entraînement doit être :', choices: ['Toujours maximale', 'Planifiée et ajustée selon la fatigue et le calendrier', 'Identique chaque jour', 'Décidée par les joueurs'], answer: 1 },
    { q: 'Un bon feedback à un joueur est :', choices: ['Général et tardif', 'Précis, immédiat et constructif', 'Toujours négatif', 'Donné uniquement en public'], answer: 1 },
    { q: 'Face à une suspicion de commotion cérébrale, l’entraîneur :', choices: ['Laisse jouer si le joueur le souhaite', 'Sort le joueur et le fait examiner', 'Attend la mi-temps', 'Donne de l’eau et continue'], answer: 1 },
  ],
  youth: [
    { q: 'L’objectif principal du football de base est :', choices: ['Gagner tous les matchs', 'Le plaisir, l’apprentissage et la participation de tous', 'Sélectionner les meilleurs', 'La préparation physique'], answer: 1 },
    { q: 'Le format de jeu adapté aux 6-8 ans est :', choices: ['11 contre 11', 'Petits effectifs (3 contre 3 à 5 contre 5)', '9 contre 9', 'Pas de match'], answer: 1 },
    { q: 'Par forte chaleur, l’éducateur :', choices: ['Supprime les pauses', 'Organise des pauses d’hydratation régulières', 'Interdit l’eau', 'Allonge la séance'], answer: 1 },
    { q: 'Si un enfant se confie sur des maltraitances :', choices: ['On n’en parle à personne', 'On écoute, on rassure et on signale selon la procédure', 'On confronte l’auteur présumé', 'On attend d’avoir des preuves'], answer: 1 },
    { q: 'Un éducateur doit éviter :', choices: ['D’encourager l’effort', 'De se retrouver seul et isolé avec un enfant', 'De féliciter', 'De varier les jeux'], answer: 1 },
    { q: 'Le temps de jeu en match de jeunes doit être :', choices: ['Réservé aux meilleurs', 'Équitablement réparti', 'Décidé par les parents', 'Inexistant pour les débutants'], answer: 1 },
  ],
  refereeing: [
    { q: 'Combien de joueurs minimum par équipe pour commencer un match à 11 ?', choices: ['5', '7', '9', '11'], answer: 1 },
    { q: 'Un joueur peut-il être hors-jeu directement sur une rentrée de touche ?', choices: ['Oui', 'Non', 'Seulement en seconde période', 'Seulement dans la surface'], answer: 1 },
    { q: 'Sur un penalty, le gardien doit au moment du tir :', choices: ['Être hors de sa ligne', 'Avoir au moins une partie d’un pied sur la ligne de but ou au niveau de celle-ci', 'Être à genoux', 'Être sur le point de penalty'], answer: 1 },
    { q: 'Une main délibérée d’un joueur qui empêche un but évident est sanctionnée par :', choices: ['Un avertissement', 'Une exclusion (carton rouge)', 'Rien', 'Une rentrée de touche'], answer: 1 },
    { q: 'La durée réglementaire d’un match senior est de :', choices: ['2 × 40 minutes', '2 × 45 minutes', '2 × 50 minutes', '90 minutes sans pause'], answer: 1 },
    { q: 'Un but peut-il être marqué directement sur coup franc indirect ?', choices: ['Oui', 'Non, le ballon doit toucher un autre joueur', 'Oui si le tir est puissant', 'Seulement par le capitaine'], answer: 1 },
  ],
  management: [
    { q: 'L’organe souverain d’un club associatif est :', choices: ['Le président seul', 'L’assemblée générale', 'L’entraîneur', 'Le sponsor principal'], answer: 1 },
    { q: 'Un budget de club doit :', choices: ['Être équilibré et suivi tout au long de la saison', 'Être établi après la saison', 'Ignorer les salaires', 'Être secret pour les membres'], answer: 0 },
    { q: 'Les licences des joueurs sont délivrées :', choices: ['Par le club seul', 'Par la fédération / la ligue selon les règlements', 'Par le joueur', 'Par l’entraîneur'], answer: 1 },
    { q: 'Un projet de club comprend notamment :', choices: ['Une vision, des objectifs sportifs, la formation et les infrastructures', 'Uniquement le recrutement', 'Uniquement la communication', 'Rien d’écrit'], answer: 0 },
    { q: 'La transparence financière passe par :', choices: ['Des comptes tenus et présentés en assemblée générale', 'Des paiements en liquide sans trace', 'L’absence de trésorier', 'La confidentialité totale'], answer: 0 },
    { q: 'Un sponsor attend surtout :', choices: ['Une visibilité et un retour mesurable', 'Rien', 'De choisir l’équipe', 'Des billets gratuits uniquement'], answer: 0 },
  ],
  scouting: [
    { q: 'L’« âge relatif » désigne :', choices: ['L’avantage des joueurs nés en début d’année dans une catégorie', 'L’âge moyen d’une équipe', 'L’âge de la retraite', 'L’âge du recruteur'], answer: 0 },
    { q: 'Un rapport de scouting doit être :', choices: ['Basé sur des faits observés et une grille', 'Basé sur des rumeurs', 'Oral uniquement', 'Écrit avant le match'], answer: 0 },
    { q: 'Les transferts internationaux de mineurs sont :', choices: ['Libres', 'Interdits sauf exceptions prévues par la FIFA', 'Autorisés dès 12 ans', 'Gérés par les parents seuls'], answer: 1 },
    { q: 'Observer un joueur une seule fois suffit-il ?', choices: ['Oui', 'Non, il faut plusieurs observations dans des contextes variés', 'Oui s’il marque', 'Oui en vidéo'], answer: 1 },
    { q: 'Le potentiel d’un jeune s’évalue :', choices: ['Sur sa taille uniquement', 'Sur les dimensions technique, tactique, physique et mentale, et sa marge de progression', 'Sur ses statistiques de buts', 'Sur sa réputation'], answer: 1 },
    { q: 'L’« xG » (expected goals) mesure :', choices: ['La qualité des occasions de but', 'Le nombre de passes', 'La vitesse', 'Le temps de jeu'], answer: 0 },
  ],
  health: [
    { q: 'Face à un arrêt cardiaque, la première action est :', choices: ['Donner à boire', 'Alerter les secours et commencer le massage cardiaque', 'Attendre', 'Allonger le joueur sur le côté et partir'], answer: 1 },
    { q: 'Un défibrillateur automatisé peut être utilisé :', choices: ['Uniquement par un médecin', 'Par toute personne, en suivant les instructions vocales', 'Jamais au stade', 'Seulement après 20 minutes'], answer: 1 },
    { q: 'En cas de doute sur une commotion :', choices: ['Le joueur continue', 'Le joueur sort et ne reprend pas le jour même', 'On attend 5 minutes', 'On donne un antidouleur'], answer: 1 },
    { q: 'Le premier réflexe sur une entorse de cheville est :', choices: ['Courir pour tester', 'Repos, glace, compression, surélévation', 'Masser fort', 'Chauffer'], answer: 1 },
    { q: 'Avant un match, le repas est pris environ :', choices: ['30 minutes avant', '3 heures avant', '8 heures avant', 'Pendant l’échauffement'], answer: 1 },
    { q: 'Les signes d’un coup de chaleur incluent :', choices: ['Confusion, peau chaude, malaise', 'Faim', 'Bonne humeur', 'Frissons dus au froid'], answer: 0 },
  ],
  agents: [
    { q: 'Qui délivre la licence d’agent de football ?', choices: ['Le club', 'La FIFA, après réussite de l’examen', 'Le joueur', 'L’agent lui-même'], answer: 1 },
    { q: 'L’indemnité de formation vise à :', choices: ['Récompenser les clubs ayant formé le joueur', 'Payer l’agent', 'Payer les arbitres', 'Financer les stades'], answer: 0 },
    { q: 'Le mécanisme de solidarité redistribue :', choices: ['Une part du transfert aux clubs formateurs', 'Les salaires', 'Les primes de match', 'Les droits TV'], answer: 0 },
    { q: 'Les transferts internationaux de mineurs :', choices: ['Sont interdits sauf exceptions encadrées', 'Sont libres', 'Ne concernent que les gardiens', 'Sont gérés par l’agent seul'], answer: 0 },
    { q: 'Un agent peut-il représenter les deux parties d’une transaction sans restriction ?', choices: ['Oui, toujours', 'Non, la représentation multiple est strictement encadrée', 'Oui si le joueur est mineur', 'Oui pour les transferts nationaux'], answer: 1 },
    { q: 'Le Code d’éthique de la FIFA s’applique :', choices: ['Aux agents licenciés', 'Uniquement aux arbitres', 'À personne', 'Uniquement aux présidents'], answer: 0 },
  ],
  operations: [
    { q: 'La réunion d’organisation d’avant-match réunit :', choices: ['Officiels, équipes, sécurité et secours', 'Seulement les supporters', 'Seulement les joueurs', 'Personne'], answer: 0 },
    { q: 'Un plan d’évacuation doit :', choices: ['Être connu du personnel et testé', 'Rester secret', 'Être improvisé', 'Concerner uniquement la tribune VIP'], answer: 0 },
    { q: 'Le contrôle d’accès par QR code permet :', choices: ['De valider chaque billet une seule fois', 'D’entrer plusieurs fois', 'D’éviter la billetterie', 'De supprimer les stadiers'], answer: 0 },
    { q: 'Un commissaire de match rédige :', choices: ['Le rapport officiel du match', 'Le communiqué du club', 'Les contrats des joueurs', 'Les billets'], answer: 0 },
    { q: 'En communication de crise, il faut :', choices: ['Réagir vite, avec des faits vérifiés', 'Ne jamais répondre', 'Accuser l’adversaire', 'Supprimer tous les commentaires'], answer: 0 },
    { q: 'La capacité d’accueil d’un stade :', choices: ['Ne doit jamais être dépassée', 'Peut être dépassée pour les grands matchs', 'N’existe pas', 'Dépend de la météo'], answer: 0 },
  ],
  integrity: [
    { q: 'Si quelqu’un vous propose de l’argent pour influencer un match :', choices: ['Vous acceptez discrètement', 'Vous refusez et le signalez', 'Vous en parlez aux joueurs', 'Vous ignorez'], answer: 1 },
    { q: 'La protection des enfants est la responsabilité :', choices: ['De tous les adultes du football', 'Uniquement des parents', 'Uniquement de la police', 'De personne'], answer: 0 },
    { q: 'Partager des informations internes sur une équipe à des parieurs est :', choices: ['Autorisé', 'Une violation des règles d’intégrité', 'Recommandé', 'Sans conséquence'], answer: 1 },
    { q: 'Un comportement inapproprié d’un adulte envers un mineur doit être :', choices: ['Signalé selon la procédure', 'Caché pour protéger le club', 'Réglé en interne sans trace', 'Ignoré'], answer: 0 },
    { q: 'Les officiels et joueurs peuvent-ils parier sur leurs propres compétitions ?', choices: ['Oui', 'Non', 'Seulement en ligne', 'Seulement à l’étranger'], answer: 1 },
    { q: 'Un signalement de bonne foi :', choices: ['Doit être protégé', 'Est sanctionné', 'Est inutile', 'Doit être public'], answer: 0 },
  ],
}
