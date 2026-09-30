// ---------------------------------------------------------------------------
// Mémoire du football ivoirien — hommage aux personnes qui ont contribué à
// son évolution (dirigeants, joueurs, entraîneurs, arbitres, supporters,
// médias…), qu'elles soient en activité, retirées ou disparues.
// Uniquement des faits recoupés dans la presse et les encyclopédies ; aucune
// date ni photo n'est inventée (photoUrl renseigné seulement quand une
// photo est fournie).
// ---------------------------------------------------------------------------

export type MemoryCategoryId =
  | 'presidents-republique'
  | 'ministres'
  | 'presidents-fif'
  | 'comites'
  | 'presidents-clubs'
  | 'joueurs'
  | 'entraineurs'
  | 'arbitres'
  | 'supporters'
  | 'medias'

export interface MemoryCategory {
  id: MemoryCategoryId
  label: string
  description: string
}

export interface MemoryPerson {
  slug: string
  name: string
  category: MemoryCategoryId
  /** Rôle principal, affiché sous le nom. */
  title: string
  born?: string
  died?: string
  deceased?: boolean
  /** Pour accorder « Née » / « Disparue ». */
  feminine?: boolean
  photoUrl?: string
  summary: string
  roles: { period: string; label: string }[]
  highlights: string[]
  /** Lien vers une page existante de la plateforme (fiche joueur, présidence…). */
  related?: { label: string; href: string }
}

export const memoryCategories: MemoryCategory[] = [
  { id: 'presidents-republique', label: 'Présidents de la République', description: 'Les chefs de l’État sous lesquels le football ivoirien a grandi, gagné et accueilli l’Afrique.' },
  { id: 'ministres', label: 'Ministres des Sports', description: 'Les ministres qui ont accompagné les Éléphants, les infrastructures et les grandes compétitions.' },
  { id: 'presidents-fif', label: 'Présidents de la FIF', description: 'Les treize présidents qui ont dirigé la Fédération Ivoirienne de Football depuis 1960.' },
  { id: 'comites', label: 'Comités & instances', description: 'Les comités qui ont porté des moments clés : normalisation de la FIF, organisation de la CAN.' },
  { id: 'presidents-clubs', label: 'Présidents de clubs', description: 'Les bâtisseurs de clubs qui ont structuré le football ivoirien.' },
  { id: 'joueurs', label: 'Joueurs', description: 'Les légendes qui ont porté le maillot orange et fait vibrer la Côte d’Ivoire.' },
  { id: 'entraineurs', label: 'Entraîneurs & formateurs', description: 'Les techniciens des grands sacres et les formateurs de générations de talents.' },
  { id: 'arbitres', label: 'Arbitres', description: 'Les arbitres ivoiriens qui ont représenté le pays sur la scène internationale.' },
  { id: 'supporters', label: 'Supporters', description: 'Celles et ceux qui font vivre les tribunes et portent les Éléphants.' },
  { id: 'medias', label: 'Médias & journalistes', description: 'Les voix et les plumes qui ont raconté le football ivoirien.' },
]

const FIF_PRESIDENTS_EARLY: { name: string; period: string }[] = [
  { name: 'Coffi Gadeau', period: '1960 — 1963' },
  { name: 'Mathieu Ekra', period: '1963 — 1965' },
  { name: 'Ibrahima Coulibaly', period: '1965 — 1972' },
  { name: 'Hubert Varlet', period: '1972 — 1973' },
  { name: 'Camille Oguie', period: '1973 — 1974' },
  { name: 'François Amani-Golly', period: '1974 — 1980' },
  { name: 'Jean Brizroua-Bi', period: '1980 — 1988' },
  { name: 'Emmanuel Ezan', period: '1988 — 1990' },
  { name: 'René Diby', period: '1990' },
]

function slugify(value: string) {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’']/g, '-').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const people: Omit<MemoryPerson, 'slug'>[] = [
  // --- Présidents de la République ---------------------------------------
  {
    name: 'Félix Houphouët-Boigny', category: 'presidents-republique', title: 'Premier président de la République (1960 — 1993)',
    born: '1905', died: '1993', deceased: true,
    summary: 'Père de l’indépendance, il a présidé la Côte d’Ivoire pendant les trois premières décennies du football fédéral ivoirien, de la création de la FIF en 1960 jusqu’au premier titre continental des Éléphants.',
    roles: [{ period: '1960 — 1993', label: 'Président de la République de Côte d’Ivoire' }],
    highlights: [
      'La Côte d’Ivoire accueille la Coupe d’Afrique des Nations 1984.',
      'Premier sacre continental des Éléphants, CAN 1992 au Sénégal (finale face au Ghana, 0-0, 11 tirs au but à 10).',
      'Le stade Félix-Houphouët-Boigny d’Abidjan, antre historique des Éléphants, porte son nom.',
    ],
  },
  {
    name: 'Henri Konan Bédié', category: 'presidents-republique', title: 'Président de la République (1993 — 1999)',
    born: '1934', died: '2023', deceased: true,
    summary: 'Deuxième président de la République, il a succédé à Félix Houphouët-Boigny au lendemain du premier titre africain des Éléphants.',
    roles: [{ period: '1993 — 1999', label: 'Président de la République de Côte d’Ivoire' }],
    highlights: ['Les Éléphants, champions d’Afrique en titre, terminent troisièmes de la CAN 1994 en Tunisie.'],
  },
  {
    name: 'Laurent Gbagbo', category: 'presidents-republique', title: 'Président de la République (2000 — 2011)',
    born: '1945',
    summary: 'Sous sa présidence, la génération Drogba offre à la Côte d’Ivoire ses premières participations à la Coupe du monde, dans un pays alors divisé par la crise.',
    roles: [{ period: '2000 — 2011', label: 'Président de la République de Côte d’Ivoire' }],
    highlights: [
      'Première qualification de l’histoire pour la Coupe du monde, le 8 octobre 2005 (Mondial 2006 en Allemagne).',
      'Appel à la paix des Éléphants au soir de la qualification, en octobre 2005.',
      'Nouvelle qualification pour la Coupe du monde 2010 en Afrique du Sud.',
    ],
  },
  {
    name: 'Alassane Ouattara', category: 'presidents-republique', title: 'Président de la République depuis 2011',
    born: '1942',
    summary: 'Président de la République depuis 2011, il a porté l’organisation de la CAN 2023 et un vaste programme de stades, et a vu les Éléphants remporter deux titres continentaux.',
    roles: [{ period: 'Depuis 2011', label: 'Président de la République de Côte d’Ivoire' }],
    highlights: [
      'Deuxième étoile des Éléphants à la CAN 2015 en Guinée équatoriale.',
      'Organisation de la CAN 2023 en Côte d’Ivoire (janvier-février 2024), remportée par les Éléphants.',
      'Construction et rénovation de stades pour la CAN 2023 : stade olympique Alassane-Ouattara d’Ebimpé, stades de Bouaké, Korhogo, San-Pédro et Yamoussoukro (Charles-Konan-Banny).',
      'Qualification des Éléphants pour la Coupe du monde 2026.',
    ],
  },

  // --- Ministres des Sports ----------------------------------------------
  {
    name: 'Alain Lobognon', category: 'ministres', title: 'Ministre des Sports (2011 — 2015)',
    summary: 'Ministre de la Promotion de la Jeunesse, des Sports et Loisirs au sortir de la crise post-électorale, il était en fonction lors du sacre de la CAN 2015.',
    roles: [{ period: 'Juin 2011 — mai 2015', label: 'Ministre de la Promotion de la Jeunesse, des Sports et Loisirs' }],
    highlights: ['Ministre lors de la victoire des Éléphants à la CAN 2015.', 'Lancement d’une commission nationale de réforme du sport.'],
  },
  {
    name: 'François Albert Amichia', category: 'ministres', title: 'Ministre des Sports (2015 — 2018), président du COCAN 2023',
    summary: 'Ministre des Sports et Loisirs puis président du Comité d’organisation de la CAN 2023 (COCAN), il a conduit la préparation de la plus grande compétition jamais organisée en Côte d’Ivoire.',
    roles: [
      { period: '2015 — 2018', label: 'Ministre des Sports et Loisirs' },
      { period: 'Depuis juin 2021', label: 'Président du COCAN 2023 (succède à Kessé Feh Lambert)' },
    ],
    highlights: [
      'Première médaille d’or olympique de la Côte d’Ivoire remportée sous son mandat de ministre (Rio 2016).',
      'Organisation de la CAN 2023, remportée par les Éléphants à domicile.',
    ],
  },
  {
    name: 'Paulin Claude Danho', category: 'ministres', title: 'Ministre des Sports (2018 — 2023)',
    summary: 'Nommé en juillet 2018, il a piloté pendant cinq ans la politique sportive nationale, en pleine préparation de la CAN 2023.',
    roles: [
      { period: 'Juillet 2018 — octobre 2023', label: 'Ministre des Sports' },
      { period: '—', label: 'Président de l’Union des villes et communes de Côte d’Ivoire (UVICOCI)' },
    ],
    highlights: ['Ministre pendant la phase de préparation et de construction des infrastructures de la CAN 2023.'],
  },
  {
    name: 'Adjé Silas Metch', category: 'ministres', title: 'Ministre des Sports depuis 2023',
    summary: 'Ministre des Sports depuis le 17 octobre 2023, reconduit en janvier 2026 dans le gouvernement Mambé II ; il était en fonction lors du troisième sacre continental des Éléphants.',
    roles: [{ period: 'Depuis octobre 2023', label: 'Ministre des Sports (reconduit en janvier 2026)' }],
    highlights: ['Ministre lors de la victoire des Éléphants à la CAN 2023 (février 2024).', 'Ministre lors de la qualification pour la Coupe du monde 2026.'],
  },

  // --- Présidents de la FIF ----------------------------------------------
  ...FIF_PRESIDENTS_EARLY.map((p): Omit<MemoryPerson, 'slug'> => ({
    name: p.name, category: 'presidents-fif', title: `Président de la FIF (${p.period})`,
    summary: `${p.name} a présidé la Fédération Ivoirienne de Football (${p.period}), contribuant à structurer le football ivoirien dans ses premières décennies.`,
    roles: [{ period: p.period, label: 'Président de la Fédération Ivoirienne de Football' }],
    highlights: [],
  })),
  {
    name: 'Ousseynou Dieng', category: 'presidents-fif', title: 'Président de la FIF (1990 — 2002)',
    deceased: true,
    summary: 'Recordman de longévité à la tête de la FIF (douze ans), il est le président du premier titre continental des Éléphants. Administrateur des services financiers, il a aussi dirigé la Loterie nationale (LONACI). Il est décédé à Paris.',
    roles: [
      { period: '1990 — 2002', label: 'Président de la Fédération Ivoirienne de Football' },
      { period: '—', label: 'Directeur général de la LONACI' },
    ],
    highlights: ['Champion d’Afrique 1992 au Sénégal sous sa présidence.', 'Plus longue présidence continue de l’histoire de la FIF.'],
  },
  {
    name: 'Jacques Anouma', category: 'presidents-fif', title: 'Président de la FIF (2002 — 2011)',
    summary: 'Ancien président de la Ligue nationale, il a dirigé la FIF pendant l’âge d’or de la génération Drogba et siégé au Comité exécutif de la FIFA.',
    roles: [
      { period: '2002 — 2011', label: 'Président de la Fédération Ivoirienne de Football' },
      { period: '2007 — 2011', label: 'Membre du Comité exécutif de la FIFA' },
    ],
    highlights: ['Premières qualifications pour la Coupe du monde : 2006 et 2010.'],
  },
  {
    name: 'Augustin Sidy Diallo', category: 'presidents-fif', title: 'Président de la FIF (2011 — 2020)',
    summary: 'Président de la FIF pendant près d’une décennie, il a vu les Éléphants décrocher leur deuxième étoile. Son fils Abdoulaye Diallo siège au Comité exécutif élu en 2026.',
    roles: [{ period: '2011 — 2020', label: 'Président de la Fédération Ivoirienne de Football' }],
    highlights: ['Champion d’Afrique 2015 sous sa présidence.', 'Qualification pour la Coupe du monde 2014 au Brésil.'],
  },
  {
    name: 'Yacine Idriss Diallo', category: 'presidents-fif', title: 'Président de la FIF depuis 2022',
    born: '1960', photoUrl: '/federation/president/yacine-idriss-diallo-portrait.jpg',
    summary: 'Ancien vice-président de l’ASEC Mimosas et cofondateur de l’AFAD, élu en avril 2022 puis réélu en septembre 2026, il est le président du troisième titre continental.',
    roles: [
      { period: 'Depuis avril 2022', label: 'Président de la Fédération Ivoirienne de Football (réélu en 2026)' },
      { period: '1984 — 2002', label: 'Vice-président de l’ASEC Mimosas' },
    ],
    highlights: ['Champion d’Afrique 2023 (février 2024) à domicile.', 'Qualification pour la Coupe du monde 2026.'],
    related: { label: 'Voir la page du Président de la FIF', href: '/federation/president' },
  },

  // --- Comités ------------------------------------------------------------
  {
    name: 'Mariam Dao Gabala', category: 'comites', title: 'Présidente du Comité de normalisation de la FIF (2021 — 2022)',
    born: '1960', feminine: true,
    summary: 'Sénatrice et militante des droits des femmes, elle a été nommée par la FIFA à la tête du Comité de normalisation chargé de gérer la FIF, de réviser ses textes et d’organiser l’élection de 2022, après le blocage du processus électoral.',
    roles: [
      { period: 'Janvier 2021 — 2022', label: 'Présidente du Comité de normalisation de la FIF (avec le Pr Martin Bléou et Me Simon Abé)' },
      { period: 'Depuis 2019', label: 'Sénatrice' },
    ],
    highlights: ['Comité créé par la FIFA le 24 décembre 2020 ; mandat prorogé jusqu’au 31 mars 2022.', 'Organisation de l’élection d’avril 2022 à la présidence de la FIF.'],
  },

  // --- Présidents de clubs ------------------------------------------------
  {
    name: 'Roger Ouégnin', category: 'presidents-clubs', title: 'Président de l’ASEC Mimosas depuis 1989',
    summary: 'Élu le 19 novembre 1989, il a hissé l’ASEC Mimosas au sommet de l’Afrique et bâti, à Sol Béni, l’un des centres de formation les plus réputés du continent.',
    roles: [{ period: 'Depuis 1989', label: 'Président du Conseil d’administration de l’ASEC Mimosas' }],
    highlights: [
      'Ligue des champions de la CAF remportée par l’ASEC en 1998.',
      'Création de l’Académie MimoSifcom avec Jean-Marc Guillou, d’où sont sortis de nombreux internationaux.',
      'Développement du complexe de Sol Béni.',
    ],
    related: { label: 'Voir la fiche du club ASEC Mimosas', href: '/clubs/asec-mimosas' },
  },
  {
    name: 'Léon Blé', category: 'presidents-clubs', title: 'Cofondateur et premier président de l’Africa Sports',
    summary: 'Parmi les jeunes de Treichville qui ont fondé l’Africa Sports le 27 avril 1947, il en fut le premier président.',
    roles: [{ period: '1947', label: 'Cofondateur et premier président de l’Africa Sports' }],
    highlights: ['Fondation de l’Africa Sports, l’un des clubs historiques du football ivoirien.'],
  },

  // --- Joueurs ------------------------------------------------------------
  {
    name: 'Laurent Pokou', category: 'joueurs', title: 'Attaquant légendaire, « l’Homme d’Asmara »',
    born: '1947', died: '2016', deceased: true,
    summary: 'Buteur de légende de l’ASEC Mimosas et du Stade rennais, il a longtemps détenu le record de buts en Coupe d’Afrique des Nations.',
    roles: [{ period: 'Années 1960 — 1970', label: 'Attaquant de l’ASEC Mimosas, du Stade rennais et des Éléphants' }],
    highlights: ['14 buts en CAN, record longtemps détenu.', 'Surnommé « l’Homme d’Asmara ».'],
  },
  {
    name: 'Alain Gouaméné', category: 'joueurs', title: 'Gardien des champions d’Afrique 1992',
    summary: 'Gardien des Éléphants lors du premier sacre continental, conquis aux tirs au but face au Ghana.',
    roles: [{ period: '1992', label: 'Gardien de but des Éléphants, champion d’Afrique' }],
    highlights: ['Champion d’Afrique 1992 au Sénégal.'],
  },
  {
    name: 'Abdoulaye Traoré « Ben Badi »', category: 'joueurs', title: 'Attaquant, légende de l’ASEC Mimosas',
    summary: 'Figure emblématique de l’ASEC Mimosas, il faisait partie de la génération championne d’Afrique en 1992.',
    roles: [{ period: 'Années 1980 — 1990', label: 'Attaquant de l’ASEC Mimosas et des Éléphants' }],
    highlights: ['Champion d’Afrique 1992 au Sénégal.'],
  },
  {
    name: 'Didier Drogba', category: 'joueurs', title: 'Meilleur buteur de l’histoire des Éléphants',
    born: '1978',
    summary: 'Capitaine emblématique, meilleur buteur de l’histoire des Éléphants et double Ballon d’or africain, il a porté la Côte d’Ivoire à sa première Coupe du monde et lancé un appel à la paix resté historique.',
    roles: [
      { period: '2002 — 2014', label: 'International ivoirien (105 sélections, 65 buts)' },
      { period: '2004 — 2012 / 2014 — 2015', label: 'Attaquant de Chelsea (Angleterre)' },
    ],
    highlights: [
      'Meilleur buteur de l’histoire des Éléphants : 65 buts.',
      'Ballon d’or africain 2006 et 2009.',
      'Au soir de la qualification pour le Mondial 2006 (8 octobre 2005), appel à la paix lancé avec ses coéquipiers aux belligérants de la crise ivoirienne.',
    ],
  },
  {
    name: 'Yaya Touré', category: 'joueurs', title: 'Quadruple Ballon d’or africain, capitaine champion d’Afrique 2015',
    born: '1983',
    summary: 'Formé à l’Académie MimoSifcom de l’ASEC, il a remporté quatre Ballons d’or africains consécutifs et soulevé la CAN 2015 comme capitaine.',
    roles: [{ period: '2004 — 2015', label: 'Milieu de terrain des Éléphants' }],
    highlights: ['Ballon d’or africain 2011, 2012, 2013 et 2014.', 'Capitaine des Éléphants champions d’Afrique 2015.'],
  },
  {
    name: 'Kolo Touré', category: 'joueurs', title: 'Défenseur, champion d’Afrique 2015',
    born: '1981',
    summary: 'Issu de l’Académie MimoSifcom, défenseur central d’Arsenal puis de Manchester City, pilier des Éléphants pendant plus d’une décennie.',
    roles: [{ period: '2000 — 2015', label: 'Défenseur des Éléphants' }],
    highlights: ['Champion d’Afrique 2015.', 'Champion d’Angleterre invaincu avec Arsenal (2003-2004).'],
  },
  {
    name: 'Boubacar Barry « Copa »', category: 'joueurs', title: 'Gardien, héros de la finale de la CAN 2015',
    born: '1979',
    summary: 'Gardien de but, il a arrêté un tir au but puis inscrit le tir décisif lors de la finale de la CAN 2015 face au Ghana.',
    roles: [{ period: '2000 — 2015', label: 'Gardien de but des Éléphants' }],
    highlights: ['Champion d’Afrique 2015 : finale 0-0 face au Ghana, victoire 9 tirs au but à 8, dont le dernier tiré par lui-même.'],
  },
  {
    name: 'Sébastien Haller', category: 'joueurs', title: 'Buteur de la finale de la CAN 2023',
    born: '1994',
    summary: 'Revenu au plus haut niveau après un cancer en 2022, il a inscrit le but de la victoire en finale de la CAN 2023 face au Nigeria, à Ebimpé.',
    roles: [{ period: 'Depuis 2020', label: 'Attaquant des Éléphants' }],
    highlights: ['But de la victoire en finale de la CAN 2023 face au Nigeria (2-1), le 11 février 2024.'],
  },
  {
    name: 'Franck Kessié', category: 'joueurs', title: 'Milieu, champion d’Afrique 2023, plus de 100 sélections',
    born: '1996',
    summary: 'Buteur de l’égalisation en finale de la CAN 2023, il a dépassé la barre des cent sélections avec les Éléphants et reste un cadre de l’équipe d’Hervé Renard.',
    roles: [{ period: 'Depuis 2016', label: 'Milieu de terrain des Éléphants' }],
    highlights: ['Champion d’Afrique 2023.', 'Plus de cent sélections en équipe nationale.'],
    related: { label: 'Voir sa fiche Éléphants', href: '/equipes-nationales/elephants/franck-kessie' },
  },

  // --- Entraîneurs & formateurs -------------------------------------------
  {
    name: 'Yéo Martial', category: 'entraineurs', title: 'Sélectionneur champion d’Afrique 1992',
    born: '1944',
    summary: 'Né à Abidjan, il a offert à la Côte d’Ivoire sa première étoile en 1992. Il a ensuite dirigé l’Africa Sports et la sélection du Niger, avant de revenir comme directeur technique national en 2004. Il a fondé sa propre académie de football à Abidjan en 2001.',
    roles: [
      { period: '1992', label: 'Sélectionneur des Éléphants, champion d’Afrique' },
      { period: '2001', label: 'Fondateur d’une académie de football à Abidjan' },
      { period: '2004', label: 'Directeur technique national' },
    ],
    highlights: ['Champion d’Afrique 1992 au Sénégal (finale face au Ghana).'],
  },
  {
    name: 'Jean-Marc Guillou', category: 'entraineurs', title: 'Formateur, cofondateur de l’Académie MimoSifcom',
    born: '1945',
    summary: 'Ancien international français, il a fondé avec Roger Ouégnin l’Académie MimoSifcom de l’ASEC Mimosas, à Sol Béni, qui a formé une génération entière d’internationaux ivoiriens.',
    roles: [{ period: 'Années 1990 — 2000', label: 'Directeur de l’Académie MimoSifcom (ASEC Mimosas)' }],
    highlights: ['Formation de futurs Éléphants, parmi lesquels Kolo et Yaya Touré.'],
  },
  {
    name: 'Henri Michel', category: 'entraineurs', title: 'Sélectionneur de la première Coupe du monde',
    born: '1947', died: '2018', deceased: true,
    summary: 'Ancien international et sélectionneur de la France, il a conduit les Éléphants à leur toute première Coupe du monde.',
    roles: [{ period: '2004 — 2006', label: 'Sélectionneur des Éléphants' }],
    highlights: ['Qualification et participation à la Coupe du monde 2006 en Allemagne.', 'Finaliste de la CAN 2006.'],
  },
  {
    name: 'Hervé Renard', category: 'entraineurs', title: 'Sélectionneur champion d’Afrique 2015, de retour en 2026',
    born: '1968',
    summary: 'Il a offert aux Éléphants leur deuxième étoile en 2015, avant de revenir à la tête de la sélection en 2026.',
    roles: [
      { period: '2014 — 2015', label: 'Sélectionneur des Éléphants' },
      { period: 'Depuis 2026', label: 'Sélectionneur des Éléphants' },
    ],
    highlights: ['Champion d’Afrique 2015 en Guinée équatoriale.'],
    related: { label: 'Voir les Éléphants', href: '/equipes-nationales/elephants' },
  },
  {
    name: 'Emerse Faé', category: 'entraineurs', title: 'Sélectionneur champion d’Afrique 2023',
    born: '1984',
    summary: 'Adjoint devenu sélectionneur en pleine CAN 2023, il a mené les Éléphants, un temps au bord de l’élimination, jusqu’au titre à domicile.',
    roles: [{ period: '2024', label: 'Sélectionneur des Éléphants' }],
    highlights: ['Champion d’Afrique 2023 (finale face au Nigeria, 2-1, le 11 février 2024).'],
  },

  // --- Arbitres -----------------------------------------------------------
  {
    name: 'Noumandiez Doué', category: 'arbitres', title: 'Ancien arbitre international',
    summary: 'Ancien arbitre international ivoirien, il est entré au Comité exécutif de la FIF en 2026.',
    roles: [
      { period: '—', label: 'Arbitre international FIFA' },
      { period: 'Depuis 2026', label: 'Membre du Comité exécutif de la FIF' },
    ],
    highlights: ['Représentant de l’arbitrage ivoirien sur la scène internationale.'],
    related: { label: 'Voir sa fiche au Comité exécutif', href: '/federation/comite/noumandiez-doue' },
  },

  // --- Supporters ---------------------------------------------------------
  {
    name: 'Tany Gobou', category: 'supporters', title: 'Président de l’Amicale des supporters de Côte d’Ivoire',
    summary: 'Ancien président des supporters du Stade d’Abidjan, élu le 12 février 2023 à la tête de l’Amicale des supporters de Côte d’Ivoire (ASCI). Il milite pour le retour du public dans les stades.',
    roles: [
      { period: 'Depuis février 2023', label: 'Président de l’Amicale des supporters de Côte d’Ivoire (ASCI)' },
      { period: '—', label: 'Président des supporters du Stade d’Abidjan' },
    ],
    highlights: ['Engagé contre la désaffection des stades lors des matchs du championnat.'],
  },

  // --- Médias -------------------------------------------------------------
  {
    name: 'Aimé Brière', category: 'medias', title: 'Journaliste et consultant sportif',
    died: '2025', deceased: true,
    summary: 'Voix emblématique du journalisme sportif ivoirien, reconnu pour sa rigueur et la pertinence de ses analyses, il a marqué des années de télévision et de radio. Il est décédé le 24 juillet 2025.',
    roles: [{ period: '—', label: 'Journaliste et consultant sportif (télévision et radio)' }],
    highlights: ['Contribution majeure à l’évolution du journalisme sportif en Côte d’Ivoire.'],
  },
]

export const memoryPeople: MemoryPerson[] = people.map((p) => ({ ...p, slug: slugify(p.name) }))

export function getMemoryPerson(slug: string) {
  return memoryPeople.find((p) => p.slug === slug)
}

export function memoryPeopleIn(category: MemoryCategoryId) {
  return memoryPeople.filter((p) => p.category === category)
}

export function memoryCategory(id: MemoryCategoryId) {
  return memoryCategories.find((c) => c.id === id)
}

export const memorySources = [
  { label: 'Présidents de la FIF depuis 1960 (Abidjan.net)', url: 'https://news.abidjan.net/articles/677569/douze-presidents-ont-dirige-la-fif-de-1960-a-ce-jour' },
  { label: 'Présidents de la FIF (Yeclo)', url: 'https://www.yeclo.com/presidents-de-la-fif-la-liste-des-dirigeants-depuis-1960' },
  { label: 'Comité de normalisation — Mariam Dao Gabala (Africa Top Sports)', url: 'https://www.africatopsports.com/2021/01/14/mariam-dao-gabala-nommee-a-la-tete-du-comite-de-normalisation/' },
  { label: 'COCAN 2023 — François Amichia (Linfodrome)', url: 'https://www.linfodrome.com/sport/67952-football-presidence-du-cocan-2023-francois-amichia-remplace-kesse-feh-lambert' },
  { label: 'Roger Ouégnin — ASEC Mimosas', url: 'https://www.asec.ci/club/about-asec-mimosas' },
  { label: 'Yéo Martial (Wikipédia)', url: 'https://en.wikipedia.org/wiki/Yeo_Martial' },
  { label: 'Didier Drogba (Wikipédia)', url: 'https://en.wikipedia.org/wiki/Didier_Drogba' },
  { label: 'Tany Gobou — ASCI (L’Avenir)', url: 'https://www.lavenir.ci/sport/4570-amicale-des-supporteurs-de-cote-divoire-tany-gobou-elu-president' },
  { label: 'Aimé Brière (Presse Côte d’Ivoire)', url: 'https://www.pressecotedivoire.fr/22982-deces-daime-briere-le-journalisme-sportif-ivoirien-perd-une-de-ses-voix-les-plus-emblematiques' },
]
