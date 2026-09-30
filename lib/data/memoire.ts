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
  /** Date et lieu de naissance / de décès détaillés, quand ils sont connus. */
  birth?: string
  death?: string
  /** Pour accorder « Née » / « Disparue ». */
  feminine?: boolean
  /** Photo locale (dossier public) … */
  photoUrl?: string
  /** … ou nom exact d'un fichier Wikimedia Commons (licence libre). */
  commonsFile?: string
  summary: string
  roles: { period: string; label: string }[]
  highlights: string[]
  /** Lien vers une page existante de la plateforme (fiche joueur, présidence…). */
  related?: { label: string; href: string }
  sources?: { label: string; url: string }[]
}

/** URL d'affichage de la photo (fichier local ou Commons redimensionné). */
export function memoryPhotoSrc(p: MemoryPerson) {
  if (p.photoUrl) return p.photoUrl
  if (p.commonsFile) return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(p.commonsFile)}?width=480`
  return undefined
}

/** Page Commons du fichier, pour le crédit photo. */
export function memoryPhotoSource(p: MemoryPerson) {
  return p.commonsFile ? `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(p.commonsFile.replace(/ /g, '_'))}` : undefined
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

const FIF_PRESIDENTS_EARLY: { name: string; period: string; extra?: Partial<Omit<MemoryPerson, 'slug' | 'name' | 'category'>> }[] = [
  {
    name: 'Coffi Gadeau', period: '1960 — 1963',
    extra: {
      died: '2000', deceased: true, title: 'Premier président de la FIF (1960 — 1963)',
      summary: 'Germain Coffi Gadeau, compagnon de lutte de Félix Houphouët-Boigny, a été le tout premier président de la Fédération Ivoirienne de Football, créée à l’aube de l’indépendance. Il a œuvré à positionner la Côte d’Ivoire sur la scène continentale, puis a mené le Stade d’Abidjan au titre de champion d’Afrique des clubs en 1966. Ancien ministre, il est décédé en 2000 alors qu’il était Grand chancelier de l’Ordre national.',
      roles: [
        { period: '1960 — 1963', label: 'Premier président de la Fédération Ivoirienne de Football' },
        { period: '1966', label: 'Président du Stade d’Abidjan, champion d’Afrique des clubs' },
        { period: '—', label: 'Ministre, puis Grand chancelier de l’Ordre national' },
      ],
      highlights: [
        'Fondateur de l’ère fédérale : premier président de la FIF, créée en 1960.',
        'Coupe d’Afrique des clubs champions 1966 remportée par le Stade d’Abidjan sous sa présidence, premier titre continental d’un club ivoirien.',
        'La FIF lui a rendu hommage pour sa contribution au développement du football ivoirien.',
      ],
      sources: [
        { label: 'La FIF d’hier à aujourd’hui (Connection ivoirienne)', url: 'https://connectionivoirienne.net/2022/04/15/la-federation-ivoirienne-de-football-fif-dhier-a-aujourdhui-de-coffi-gadeau-a-augustin-sidy-diallo/' },
        { label: 'Hommage de la FIF à Germain Coffi Gadeau (AIP)', url: 'https://www.aip.ci/ote-divoire-aip-la-fif-rend-hommage-a-tiebissou-et-a-feu-germain-coffi-gadeau-pour-leur-contribution-dans-le-developpement-du-football/' },
      ],
    },
  },
  {
    name: 'Mathieu Ekra', period: '1963 — 1965',
    extra: {
      summary: 'Autre compagnon de Félix Houphouët-Boigny, ancien ministre et futur Grand médiateur de la République, Mathieu Ekra a succédé à Coffi Gadeau à la tête de la FIF pendant deux ans.',
      roles: [
        { period: '1963 — 1965', label: 'Président de la Fédération Ivoirienne de Football' },
        { period: '—', label: 'Ministre, puis Grand médiateur de la République' },
      ],
      sources: [{ label: 'La FIF d’hier à aujourd’hui (Connection ivoirienne)', url: 'https://connectionivoirienne.net/2022/04/15/la-federation-ivoirienne-de-football-fif-dhier-a-aujourdhui-de-coffi-gadeau-a-augustin-sidy-diallo/' }],
    },
  },
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
    birth: '18 octobre 1905, Yamoussoukro', death: '7 décembre 1993, Yamoussoukro',
    commonsFile: 'Félix Houphouët-Boigny 1962-07-16.jpg',
    summary: 'Père de l’indépendance, il a présidé la Côte d’Ivoire pendant les trois premières décennies du football fédéral ivoirien : de la création de la FIF en 1960, confiée à ses compagnons Coffi Gadeau puis Mathieu Ekra, jusqu’au premier titre continental des Éléphants en 1992.',
    roles: [{ period: '1960 — 1993', label: 'Président de la République de Côte d’Ivoire' }],
    highlights: [
      'Création de la Fédération Ivoirienne de Football en 1960, à l’indépendance.',
      'La Côte d’Ivoire accueille pour la première fois la Coupe d’Afrique des Nations, en 1984.',
      'Premier sacre continental des Éléphants, CAN 1992 au Sénégal (finale face au Ghana, 0-0, 11 tirs au but à 10).',
      'Le stade Félix-Houphouët-Boigny d’Abidjan, antre historique des Éléphants, porte son nom.',
    ],
  },
  {
    name: 'Henri Konan Bédié', category: 'presidents-republique', title: 'Président de la République (1993 — 1999)',
    born: '1934', died: '2023', deceased: true,
    birth: '5 mai 1934, Dadiékro', death: '1er août 2023, Abidjan',
    commonsFile: 'Henri Konan Bédié, président du PDCI, 24 avril 2017.jpg',
    summary: 'Président de l’Assemblée nationale puis deuxième président de la République, il a succédé à Félix Houphouët-Boigny en décembre 1993, au lendemain du premier titre africain des Éléphants, et a dirigé le pays jusqu’en décembre 1999.',
    roles: [
      { period: '1980 — 1993', label: 'Président de l’Assemblée nationale' },
      { period: 'Décembre 1993 — décembre 1999', label: 'Président de la République de Côte d’Ivoire' },
    ],
    highlights: [
      'Les Éléphants, champions d’Afrique en titre, terminent troisièmes de la CAN 1994 en Tunisie.',
      'Période de la Ligue des champions de la CAF remportée par l’ASEC Mimosas (1998).',
    ],
  },
  {
    name: 'Laurent Gbagbo', category: 'presidents-republique', title: 'Président de la République (2000 — 2011)',
    born: '1945', birth: '31 mai 1945, Gagnoa',
    summary: 'Sous sa présidence, la génération Drogba offre à la Côte d’Ivoire ses premières participations à la Coupe du monde, dans un pays alors divisé par la crise. La qualification de 2005 et l’appel à la paix des joueurs restent un moment d’unité nationale.',
    roles: [{ period: 'Octobre 2000 — avril 2011', label: 'Président de la République de Côte d’Ivoire' }],
    highlights: [
      'Première qualification de l’histoire pour la Coupe du monde, le 8 octobre 2005 (Mondial 2006 en Allemagne).',
      'Appel à la paix des Éléphants au soir de la qualification, en octobre 2005.',
      'Finale de la CAN 2006 en Égypte.',
      'Nouvelle qualification pour la Coupe du monde 2010 en Afrique du Sud.',
    ],
  },
  {
    name: 'Alassane Ouattara', category: 'presidents-republique', title: 'Président de la République depuis 2011',
    born: '1942', birth: '1er janvier 1942, Dimbokro',
    commonsFile: 'Alassane Ouattara.jpg',
    summary: 'Ancien Premier ministre (1990 — 1993), président de la République depuis 2011, il a porté l’organisation de la CAN 2023 et un vaste programme de stades. Sous ses mandats, les Éléphants ont remporté deux titres continentaux et atteint pour la première fois le deuxième tour d’une Coupe du monde.',
    roles: [
      { period: '1990 — 1993', label: 'Premier ministre' },
      { period: 'Depuis 2011', label: 'Président de la République de Côte d’Ivoire' },
    ],
    highlights: [
      'Deuxième étoile des Éléphants à la CAN 2015 en Guinée équatoriale.',
      'Inauguration du stade olympique Alassane-Ouattara d’Ebimpé (60 000 places) en octobre 2020.',
      'Organisation de la CAN 2023 en Côte d’Ivoire (janvier-février 2024), remportée par les Éléphants.',
      'Construction et rénovation de stades pour la CAN 2023 : Ebimpé, Bouaké, Korhogo, San-Pédro et Yamoussoukro (Charles-Konan-Banny).',
      'Coupe du monde 2026 : les Éléphants atteignent les 16es de finale, une première historique.',
    ],
  },

  // --- Ministres des Sports ----------------------------------------------
  {
    name: 'Alain Lobognon', category: 'ministres', title: 'Ministre des Sports (2011 — 2015)',
    commonsFile: 'Alain Lobognon Michel.jpg',
    summary: 'Ministre de la Promotion de la Jeunesse, des Sports et Loisirs au sortir de la crise post-électorale, il était en fonction lors du sacre des Éléphants à la CAN 2015. Il a ensuite été élu député.',
    roles: [
      { period: 'Juin 2011 — mai 2015', label: 'Ministre de la Promotion de la Jeunesse, des Sports et Loisirs' },
      { period: '—', label: 'Député à l’Assemblée nationale' },
    ],
    highlights: ['Ministre lors de la victoire des Éléphants à la CAN 2015.', 'Lancement d’une commission nationale de réforme du sport.'],
  },
  {
    name: 'François Albert Amichia', category: 'ministres', title: 'Ministre des Sports (2015 — 2018), président du COCAN 2023',
    commonsFile: 'François Amichia.jpg',
    summary: 'Maire de Treichville, ministre des Sports et Loisirs puis président du Comité d’organisation de la CAN 2023 (COCAN), il a conduit la préparation de la plus grande compétition jamais organisée en Côte d’Ivoire.',
    roles: [
      { period: '—', label: 'Maire de Treichville' },
      { period: '2015 — 2018', label: 'Ministre des Sports et Loisirs' },
      { period: 'Depuis juin 2021', label: 'Président du COCAN 2023 (succède à Kessé Feh Lambert)' },
    ],
    highlights: [
      'Première médaille d’or olympique de la Côte d’Ivoire remportée sous son mandat de ministre (Cheick Sallah Cissé, taekwondo, Rio 2016).',
      'Organisation de la CAN 2023, remportée par les Éléphants à domicile, saluée pour la qualité de ses stades.',
    ],
    sources: [{ label: 'COCAN 2023 — François Amichia (Linfodrome)', url: 'https://www.linfodrome.com/sport/67952-football-presidence-du-cocan-2023-francois-amichia-remplace-kesse-feh-lambert' }],
  },
  {
    name: 'Paulin Claude Danho', category: 'ministres', title: 'Ministre des Sports (2018 — 2023)',
    commonsFile: 'Danho Paulin Claude (2).jpg',
    summary: 'Maire d’Attécoubé, nommé ministre des Sports en juillet 2018, il a piloté pendant cinq ans la politique sportive nationale, en pleine préparation de la CAN 2023.',
    roles: [
      { period: '—', label: 'Maire de la commune d’Attécoubé' },
      { period: 'Juillet 2018 — octobre 2023', label: 'Ministre des Sports' },
      { period: '—', label: 'Président de l’Union des villes et communes de Côte d’Ivoire (UVICOCI)' },
    ],
    highlights: ['Ministre pendant la phase de préparation et de construction des infrastructures de la CAN 2023.', 'Inauguration du stade olympique d’Ebimpé (octobre 2020) sous son ministère.'],
  },
  {
    name: 'Adjé Silas Metch', category: 'ministres', title: 'Ministre des Sports depuis 2023',
    summary: 'Ministre des Sports depuis le 17 octobre 2023, reconduit en janvier 2026 dans le gouvernement Mambé II ; il était en fonction lors du troisième sacre continental des Éléphants et de leur parcours historique à la Coupe du monde 2026.',
    roles: [{ period: 'Depuis octobre 2023', label: 'Ministre des Sports (reconduit en janvier 2026)' }],
    highlights: [
      'Ministre lors de la victoire des Éléphants à la CAN 2023 (février 2024).',
      'Ministre lors de la Coupe du monde 2026 : premier passage des Éléphants au deuxième tour.',
    ],
  },

  // --- Présidents de la FIF ----------------------------------------------
  ...FIF_PRESIDENTS_EARLY.map((p): Omit<MemoryPerson, 'slug'> => ({
    name: p.name, category: 'presidents-fif', title: `Président de la FIF (${p.period})`,
    summary: `${p.name} a présidé la Fédération Ivoirienne de Football (${p.period}), contribuant à structurer le football ivoirien dans ses premières décennies.`,
    roles: [{ period: p.period, label: 'Président de la Fédération Ivoirienne de Football' }],
    highlights: [],
    ...p.extra,
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
    name: 'Jacques Anouma', category: 'presidents-fif', title: 'Président de la FIF (2002 — 2011), président d’honneur',
    born: '1951', birth: '11 décembre 1951, Alépé',
    summary: 'Directeur administratif et financier d’Air France en Côte d’Ivoire, il a dirigé la FIF pendant l’âge d’or de la génération Drogba, siégé au Comité exécutif de la FIFA et brigué à deux reprises la présidence de la CAF. Il est président d’honneur de la FIF depuis 2011.',
    roles: [
      { period: '—', label: 'Directeur administratif et financier d’Air France en Côte d’Ivoire' },
      { period: '2002 — 2011', label: 'Président de la Fédération Ivoirienne de Football' },
      { period: '2007 — 2011', label: 'Membre du Comité exécutif de la FIFA' },
      { period: 'Depuis 2011', label: 'Président d’honneur de la FIF' },
      { period: '2013 / 2021', label: 'Candidat à la présidence de la CAF' },
    ],
    highlights: [
      'Premières qualifications de l’histoire pour la Coupe du monde : 2006 et 2010.',
      'Création d’un centre technique national, réhabilitation de plusieurs stades et hausse des subventions aux clubs.',
      'Candidature à la présidence de la CAF en 2013, déclarée irrecevable (recours rejeté par le TAS).',
      'Candidat en 2021, il se retire en mars au profit de Patrice Motsepe, dans le cadre d’un accord de consensus.',
    ],
    sources: [
      { label: 'Jacques Anouma (Wikipédia)', url: 'https://en.wikipedia.org/wiki/Jacques_Anouma' },
      { label: 'Retrait de la candidature CAF 2021 (Burkina24)', url: 'https://burkina24.com/?p=242748' },
    ],
  },
  {
    name: 'Augustin Sidy Diallo', category: 'presidents-fif', title: 'Président de la FIF (2011 — 2020)',
    born: '1959', died: '2020', deceased: true,
    birth: '18 juin 1959, Adjamé (Abidjan)', death: '21 novembre 2020, Abidjan',
    summary: 'Fils d’Abdoulaye Diallo, membre fondateur du Stella Club d’Adjamé, il a fait ses premières armes de dirigeant au Stella avant de devenir vice-président de la FIF (1991 — 1994), l’époque du premier sacre continental. Élu président en septembre 2011, réélu en 2016, il a vu les Éléphants décrocher leur deuxième étoile. Il est décédé en fonctions en novembre 2020, des suites du Covid-19.',
    roles: [
      { period: 'Années 1980', label: 'Dirigeant du Stella Club d’Adjamé' },
      { period: '1991 — 1994', label: 'Vice-président de la FIF' },
      { period: 'Septembre 2011 — novembre 2020', label: 'Président de la Fédération Ivoirienne de Football (réélu en 2016)' },
    ],
    highlights: [
      'Champion d’Afrique 2015 sous sa présidence.',
      'Qualification pour la Coupe du monde 2014 au Brésil.',
      'Vice-président de la FIF lors du premier titre continental, en 1992.',
    ],
    sources: [
      { label: 'Décès d’Augustin Sidy Diallo (Fraternité Matin)', url: 'https://www.fratmat.info/article/209522/sports/abidjan-deces-du-president-de-la-fif-augustin-sidy-diallo' },
      { label: 'Décès de Sidy Diallo (Burkina24)', url: 'https://burkina24.com/?p=234630' },
    ],
  },
  {
    name: 'Yacine Idriss Diallo', category: 'presidents-fif', title: 'Président de la FIF depuis 2022',
    born: '1960', photoUrl: '/federation/president/yacine-idriss-diallo-portrait.jpg',
    summary: 'Ancien vice-président de l’ASEC Mimosas et cofondateur de l’AFAD, élu en avril 2022 puis réélu en septembre 2026, il est le président du troisième titre continental et du premier passage des Éléphants au deuxième tour d’une Coupe du monde.',
    roles: [
      { period: '1984 — 2002', label: 'Vice-président de l’ASEC Mimosas' },
      { period: 'Depuis avril 2022', label: 'Président de la Fédération Ivoirienne de Football (réélu en 2026)' },
    ],
    highlights: [
      'Champion d’Afrique 2023 (février 2024) à domicile.',
      'Coupe du monde 2026 : 16es de finale, une première pour la Côte d’Ivoire.',
      'Nomination d’Hervé Renard comme sélectionneur en 2026.',
    ],
    related: { label: 'Voir la page du Président de la FIF', href: '/federation/president' },
  },

  // --- Comités ------------------------------------------------------------
  {
    name: 'Mariam Dao Gabala', category: 'comites', title: 'Présidente du Comité de normalisation de la FIF (2021 — 2022)',
    born: '1960', feminine: true,
    summary: 'Sénatrice et militante des droits des femmes, elle a été nommée par la FIFA à la tête du Comité de normalisation chargé de gérer les affaires courantes de la FIF, de réviser ses textes et d’organiser l’élection de 2022, après le blocage du processus électoral de 2020.',
    roles: [
      { period: 'Janvier 2021 — 2022', label: 'Présidente du Comité de normalisation de la FIF (avec le Pr Martin Bléou et Me Simon Abé)' },
      { period: 'Depuis 2019', label: 'Sénatrice' },
    ],
    highlights: [
      'Comité créé par la FIFA le 24 décembre 2020, installé le 14 janvier 2021 ; mandat prorogé jusqu’au 31 mars 2022.',
      'Révision des statuts et du code électoral de la FIF.',
      'Organisation de l’élection d’avril 2022 à la présidence de la FIF.',
    ],
    sources: [{ label: 'Nomination (Africa Top Sports)', url: 'https://www.africatopsports.com/2021/01/14/mariam-dao-gabala-nommee-a-la-tete-du-comite-de-normalisation/' }],
  },

  // --- Présidents de clubs ------------------------------------------------
  {
    name: 'Roger Ouégnin', category: 'presidents-clubs', title: 'Président de l’ASEC Mimosas depuis 1989',
    summary: 'Élu le 19 novembre 1989, il a hissé l’ASEC Mimosas au sommet de l’Afrique et bâti, à Sol Béni, l’un des centres de formation les plus réputés du continent, d’où est sortie une grande partie de la génération dorée des Éléphants.',
    roles: [{ period: 'Depuis 1989', label: 'Président du Conseil d’administration de l’ASEC Mimosas' }],
    highlights: [
      'Série historique de 108 matchs de championnat sans défaite de l’ASEC au début des années 1990.',
      'Ligue des champions de la CAF 1998 et Supercoupe d’Afrique 1999 remportées par l’ASEC.',
      'Création de l’Académie MimoSifcom avec Jean-Marc Guillou (1994), d’où sont sortis Kolo et Yaya Touré, Boubacar Barry, Emmanuel Eboué ou Gervinho.',
      'Développement du complexe de Sol Béni.',
    ],
    related: { label: 'Voir la fiche du club ASEC Mimosas', href: '/clubs/asec-mimosas' },
    sources: [{ label: 'ASEC Mimosas — le club', url: 'https://www.asec.ci/club/about-asec-mimosas' }],
  },

  // --- Joueurs ------------------------------------------------------------
  {
    name: 'Laurent Pokou', category: 'joueurs', title: 'Attaquant légendaire, « l’Homme d’Asmara »',
    born: '1947', died: '2016', deceased: true,
    birth: '10 août 1947, Abidjan', death: '13 novembre 2016, Abidjan',
    commonsFile: 'Laurent Pokou2.jpg',
    summary: 'Laurent N’Dri Pokou, buteur de légende de l’ASEC et du Stade rennais, a été deux fois meilleur buteur de la Coupe d’Afrique des Nations et a longtemps détenu le record de buts de la compétition (14). Ses cinq buts face à l’Éthiopie lui ont valu son surnom d’« Homme d’Asmara ».',
    roles: [
      { period: '1966 — 1973', label: 'ASEC Abidjan' },
      { period: '1974 — 1977', label: 'Stade rennais (France)' },
      { period: '1977 — 1978', label: 'AS Nancy-Lorraine (France)' },
      { period: '1978 — 1979', label: 'Stade rennais (France)' },
      { period: '1979 — 1982', label: 'ASEC Abidjan' },
      { period: '1982 — 1983', label: 'RS Anyama' },
    ],
    highlights: [
      'Meilleur buteur de la CAN 1968 en Éthiopie (6 buts) et de la CAN 1970 au Soudan (8 buts).',
      'Cinq buts en un seul match face à l’Éthiopie (victoire 6-1), exploit à l’origine du surnom « l’Homme d’Asmara ».',
      '14 buts en CAN, record de la compétition pendant près de quarante ans.',
    ],
    sources: [
      { label: 'Laurent Pokou (Wikipédia)', url: 'https://en.wikipedia.org/wiki/Laurent_Pokou' },
      { label: 'Buts internationaux (RSSSF)', url: 'https://rsssf.org/miscellaneous/pokou-intlg.html' },
    ],
  },
  {
    name: 'Alain Gouaméné', category: 'joueurs', title: 'Gardien des champions d’Afrique 1992, recordman de CAN',
    born: '1966', birth: '15 juin 1966, Gagnoa',
    summary: 'Pierre Alain Gouaméné a gardé les buts des Éléphants lors de sept Coupes d’Afrique des Nations, un record. En finale de la CAN 1992, il arrête le tir au but décisif face au Ghana et offre à la Côte d’Ivoire sa première étoile ; il est élu meilleur gardien du tournoi.',
    roles: [
      { period: '1986 — 1991', label: 'ASEC Mimosas' },
      { period: '1991 — 1992', label: 'Raja de Casablanca (Maroc)' },
      { period: '1992 — 1994', label: 'ASEC Mimosas' },
      { period: '1994 — 1995', label: 'AS Trouville-Deauville (France)' },
      { period: '1995 — 2000', label: 'Toulouse FC (France)' },
      { period: '1988 — 2000', label: 'Gardien des Éléphants (7 CAN)' },
    ],
    highlights: [
      'Champion d’Afrique 1992 : arrêt du dernier tir au but en finale face au Ghana.',
      'Meilleur gardien de la CAN 1992.',
      'Record de participations (7 : 1988 à 2000) et de matchs (24) en CAN pour un gardien ivoirien.',
      'Devenu entraîneur, il a dirigé des sélections de jeunes ivoiriennes.',
    ],
    sources: [
      { label: 'Alain Gouaméné (Wikipédia)', url: 'https://en.wikipedia.org/wiki/Alain_Gouam%C3%A9n%C3%A9' },
      { label: 'Gouaméné offre le premier titre continental (Abidjan.net)', url: 'https://news.abidjan.net/articles/444375/gouamene-alain-offre-le-premier-titre-continental-a-la-cote-divoire' },
    ],
  },
  {
    name: 'Didier Drogba', category: 'joueurs', title: 'Meilleur buteur de l’histoire des Éléphants',
    born: '1978', birth: '11 mars 1978, Abidjan',
    commonsFile: 'Didier Drogba (2019) (cropped).jpg',
    summary: 'Capitaine emblématique, meilleur buteur de l’histoire des Éléphants et double Ballon d’or africain, il a porté la Côte d’Ivoire à sa première Coupe du monde et lancé, avec ses coéquipiers, un appel à la paix resté historique. Légende de Chelsea, il a offert au club sa première Ligue des champions en 2012.',
    roles: [
      { period: '1998 — 2002', label: 'Le Mans (France)' },
      { period: '2002 — 2003', label: 'En Avant Guingamp (France)' },
      { period: '2003 — 2004', label: 'Olympique de Marseille (France)' },
      { period: '2004 — 2012', label: 'Chelsea (Angleterre)' },
      { period: '2012 — 2014', label: 'Shanghai Shenhua (Chine) puis Galatasaray (Turquie)' },
      { period: '2014 — 2015', label: 'Chelsea (Angleterre)' },
      { period: '2015 — 2018', label: 'Impact de Montréal (Canada) puis Phoenix Rising (États-Unis)' },
      { period: '2002 — 2014', label: 'International ivoirien (105 sélections, 65 buts)' },
    ],
    highlights: [
      'Meilleur buteur de l’histoire des Éléphants : 65 buts en 105 sélections.',
      'Ballon d’or africain 2006 et 2009.',
      'Au soir de la qualification pour le Mondial 2006 (8 octobre 2005), appel à la paix lancé avec ses coéquipiers aux belligérants de la crise ivoirienne.',
      'Trois Coupes du monde (2006, 2010, 2014) et deux finales de CAN (2006, 2012).',
      'Ligue des champions 2012 avec Chelsea : but égalisateur en finale face au Bayern Munich puis tir au but de la victoire.',
      'Quatre titres de champion d’Angleterre avec Chelsea.',
    ],
    sources: [{ label: 'Didier Drogba (Wikipédia)', url: 'https://en.wikipedia.org/wiki/Didier_Drogba' }],
  },
  {
    name: 'Yaya Touré', category: 'joueurs', title: 'Quadruple Ballon d’or africain, capitaine champion d’Afrique 2015',
    born: '1983', birth: '13 mai 1983, Bouaké',
    commonsFile: 'Yaya Touré (cropped).jpg',
    summary: 'Formé à l’Académie MimoSifcom de l’ASEC, milieu complet passé par le FC Barcelone et Manchester City, il a remporté quatre Ballons d’or africains consécutifs et soulevé la CAN 2015 comme capitaine des Éléphants.',
    roles: [
      { period: '2001 — 2003', label: 'KSK Beveren (Belgique)' },
      { period: '2003 — 2006', label: 'Metalurh Donetsk (Ukraine), Olympiakos (Grèce)' },
      { period: '2006 — 2007', label: 'AS Monaco (France)' },
      { period: '2007 — 2010', label: 'FC Barcelone (Espagne)' },
      { period: '2010 — 2018', label: 'Manchester City (Angleterre)' },
      { period: '2004 — 2015', label: 'Milieu de terrain des Éléphants (plus de 100 sélections)' },
    ],
    highlights: [
      'Ballon d’or africain 2011, 2012, 2013 et 2014.',
      'Capitaine des Éléphants champions d’Afrique 2015.',
      'Ligue des champions 2009 avec le FC Barcelone.',
      'Buteur en finale de la Coupe d’Angleterre 2011 ; champion d’Angleterre 2012 et 2014 avec Manchester City.',
    ],
  },
  {
    name: 'Kolo Touré', category: 'joueurs', title: 'Défenseur, champion d’Afrique 2015',
    born: '1981', birth: '19 mars 1981, Bouaké',
    commonsFile: 'Kolo Touré-2013.jpg',
    summary: 'Issu de l’Académie MimoSifcom, défenseur central d’Arsenal, de Manchester City et de Liverpool, il a été un pilier des Éléphants pendant quinze ans, jusqu’au titre continental de 2015.',
    roles: [
      { period: '1999 — 2002', label: 'ASEC Mimosas' },
      { period: '2002 — 2009', label: 'Arsenal (Angleterre)' },
      { period: '2009 — 2013', label: 'Manchester City (Angleterre)' },
      { period: '2013 — 2016', label: 'Liverpool (Angleterre)' },
      { period: '2016 — 2017', label: 'Celtic Glasgow (Écosse)' },
      { period: '2000 — 2015', label: 'Défenseur des Éléphants (plus de 100 sélections)' },
    ],
    highlights: [
      'Champion d’Afrique 2015.',
      'Champion d’Angleterre invaincu avec Arsenal (2003-2004), puis de nouveau avec Manchester City (2012).',
      'Trois Coupes du monde avec les Éléphants (2006, 2010, 2014).',
    ],
  },
  {
    name: 'Boubacar Barry « Copa »', category: 'joueurs', title: 'Gardien, héros de la finale de la CAN 2015',
    born: '1979', birth: '30 décembre 1979, Abidjan',
    commonsFile: 'Boubacar Barry 2007.jpg',
    summary: 'Formé à l’ASEC, longtemps gardien de Lokeren en Belgique, il a arrêté un tir au but puis inscrit le tir décisif lors de la finale de la CAN 2015 face au Ghana, offrant la deuxième étoile aux Éléphants.',
    roles: [
      { period: '—', label: 'ASEC Mimosas' },
      { period: '—', label: 'Stade rennais (France), KSK Beveren (Belgique)' },
      { period: '2007 — 2017', label: 'KSC Lokeren (Belgique)' },
      { period: '2000 — 2015', label: 'Gardien de but des Éléphants' },
    ],
    highlights: [
      'Champion d’Afrique 2015 : finale 0-0 face au Ghana, victoire 9 tirs au but à 8, avec un arrêt et le dernier tir marqué par lui-même.',
      'Trois Coupes du monde avec les Éléphants (2006, 2010, 2014).',
    ],
  },
  {
    name: 'Sébastien Haller', category: 'joueurs', title: 'Buteur de la finale de la CAN 2023',
    born: '1994', birth: '22 juin 1994, Ris-Orangis (France)',
    commonsFile: 'Sébastien Haller 2.jpg',
    summary: 'Revenu au plus haut niveau après un cancer diagnostiqué en juillet 2022, il a marqué le but de la qualification en demi-finale puis celui de la victoire en finale de la CAN 2023, à Ebimpé.',
    roles: [
      { period: '2012 — 2017', label: 'AJ Auxerre (France), FC Utrecht (Pays-Bas)' },
      { period: '2017 — 2019', label: 'Eintracht Francfort (Allemagne)' },
      { period: '2019 — 2021', label: 'West Ham (Angleterre)' },
      { period: '2021 — 2022', label: 'Ajax Amsterdam (Pays-Bas)' },
      { period: 'Depuis 2022', label: 'Borussia Dortmund (Allemagne), puis prêts' },
      { period: 'Depuis 2020', label: 'Attaquant des Éléphants' },
    ],
    highlights: [
      'But de la victoire en demi-finale de la CAN 2023 face à la RD Congo (1-0).',
      'But de la victoire en finale de la CAN 2023 face au Nigeria (2-1), le 11 février 2024.',
      'Retour sur les terrains après un cancer, symbole de résilience.',
    ],
  },
  {
    name: 'Franck Kessié', category: 'joueurs', title: 'Milieu, champion d’Afrique 2023, plus de 100 sélections',
    born: '1996', birth: '19 décembre 1996, Ouragahio',
    photoUrl: '/players/elephants/franck-kessie.png',
    summary: 'Formé au Stella Club d’Adjamé, champion d’Italie avec l’AC Milan et d’Espagne avec le FC Barcelone, il a égalisé de la tête en finale de la CAN 2023 et dépassé la barre des cent sélections avec les Éléphants.',
    roles: [
      { period: '2014 — 2015', label: 'Stella Club d’Adjamé' },
      { period: '2015 — 2017', label: 'Atalanta Bergame (Italie)' },
      { period: '2017 — 2022', label: 'AC Milan (Italie)' },
      { period: '2022 — 2023', label: 'FC Barcelone (Espagne)' },
      { period: 'Depuis 2023', label: 'Al-Ahli (Arabie saoudite)' },
      { period: 'Depuis 2016', label: 'Milieu de terrain des Éléphants' },
    ],
    highlights: [
      'Champion d’Afrique 2023 : but égalisateur en finale face au Nigeria.',
      'Champion d’Italie 2022 avec l’AC Milan, champion d’Espagne 2023 avec le FC Barcelone.',
      'Plus de cent sélections en équipe nationale.',
    ],
    related: { label: 'Voir sa fiche Éléphants', href: '/equipes-nationales/elephants/franck-kessie' },
  },

  // --- Entraîneurs & formateurs -------------------------------------------
  {
    name: 'Yéo Martial', category: 'entraineurs', title: 'Sélectionneur champion d’Afrique 1992',
    born: '1944', birth: '2 janvier 1944, Abidjan',
    summary: 'Premier sélectionneur ivoirien à offrir une étoile à la Côte d’Ivoire, en 1992 au Sénégal. Il a ensuite dirigé l’Africa Sports et la sélection du Niger, fondé sa propre académie de football à Abidjan en 2001, puis est revenu comme directeur technique national en 2004.',
    roles: [
      { period: '1992', label: 'Sélectionneur des Éléphants, champion d’Afrique' },
      { period: '—', label: 'Entraîneur de l’Africa Sports, sélectionneur du Niger' },
      { period: '2001', label: 'Fondateur d’une académie de football à Abidjan' },
      { period: '2004', label: 'Directeur technique national' },
    ],
    highlights: ['Champion d’Afrique 1992 au Sénégal : finale face au Ghana le 26 janvier 1992 à Dakar (0-0, 11 tirs au but à 10).'],
    sources: [{ label: 'Yéo Martial (Wikipédia)', url: 'https://en.wikipedia.org/wiki/Yeo_Martial' }],
  },
  {
    name: 'Jean-Marc Guillou', category: 'entraineurs', title: 'Formateur, cofondateur de l’Académie MimoSifcom',
    born: '1945',
    commonsFile: '1978 FIFA World Cup - Italy v France - Jean-Marc Guillou.jpg',
    summary: 'Ancien international français, mondialiste en 1978, il a fondé avec Roger Ouégnin l’Académie MimoSifcom de l’ASEC Mimosas à Sol Béni. Elle a formé une génération entière d’internationaux ivoiriens, dont plusieurs ont ensuite éclos en Europe au KSK Beveren.',
    roles: [
      { period: '1978', label: 'International français, Coupe du monde en Argentine' },
      { period: 'Années 1990 — 2000', label: 'Directeur de l’Académie MimoSifcom (ASEC Mimosas)' },
      { period: 'Années 2000', label: 'Dirigeant du KSK Beveren (Belgique), vitrine des jeunes ivoiriens' },
    ],
    highlights: [
      'Formation de futurs Éléphants, parmi lesquels Kolo et Yaya Touré, Boubacar Barry, Emmanuel Eboué ou Gervinho.',
      'Une méthode de formation centrée sur la technique, jouée pieds nus sur terrain en terre dans les premières années.',
    ],
  },
  {
    name: 'Henri Michel', category: 'entraineurs', title: 'Sélectionneur de la première Coupe du monde',
    born: '1947', died: '2018', deceased: true,
    birth: '29 octobre 1947, Aix-en-Provence (France)', death: '24 avril 2018',
    commonsFile: 'Henri Michel.jpg',
    summary: 'Ancien capitaine et sélectionneur de l’équipe de France, champion olympique en 1984, il a conduit les Éléphants à leur toute première Coupe du monde, en Allemagne en 2006.',
    roles: [
      { period: '1984 — 1988', label: 'Sélectionneur de la France (champion olympique 1984, 3e du Mondial 1986)' },
      { period: '2004 — 2006', label: 'Sélectionneur des Éléphants' },
    ],
    highlights: [
      'Qualification et participation à la Coupe du monde 2006 en Allemagne, la première de l’histoire des Éléphants.',
      'Finaliste de la CAN 2006 en Égypte.',
      'A dirigé quatre sélections différentes en Coupe du monde : France, Cameroun, Maroc et Côte d’Ivoire.',
    ],
  },
  {
    name: 'Hervé Renard', category: 'entraineurs', title: 'Sélectionneur champion d’Afrique 2015, de retour en 2026',
    born: '1968', birth: '30 septembre 1968, Aix-les-Bains (France)',
    commonsFile: 'Hervé Renard.jpg',
    summary: 'Premier entraîneur à remporter la CAN avec deux pays différents (Zambie 2012, Côte d’Ivoire 2015), il a offert aux Éléphants leur deuxième étoile avant de revenir à la tête de la sélection en 2026, onze ans plus tard, pour succéder à Emerse Faé.',
    roles: [
      { period: '2014 — 2015', label: 'Sélectionneur des Éléphants' },
      { period: '2016 — 2019', label: 'Sélectionneur du Maroc (Coupe du monde 2018)' },
      { period: '2019 — 2023', label: 'Sélectionneur de l’Arabie saoudite (Coupe du monde 2022)' },
      { period: 'Depuis 2026', label: 'Sélectionneur des Éléphants' },
    ],
    highlights: [
      'Champion d’Afrique 2015 en Guinée équatoriale.',
      'Double vainqueur de la CAN avec deux sélections différentes : Zambie (2012) et Côte d’Ivoire (2015).',
    ],
    related: { label: 'Voir les Éléphants', href: '/equipes-nationales/elephants' },
  },
  {
    name: 'Emerse Faé', category: 'entraineurs', title: 'Sélectionneur champion d’Afrique 2023',
    born: '1984', birth: '24 janvier 1984, Nantes (France)',
    commonsFile: 'Emerse Faé.jpg',
    summary: 'Ancien milieu international (Coupe du monde 2006), adjoint devenu sélectionneur en pleine CAN 2023, il a mené les Éléphants, un temps au bord de l’élimination, jusqu’au titre à domicile. Il a ensuite conduit la sélection au deuxième tour de la Coupe du monde 2026, une première historique.',
    roles: [
      { period: '2001 — 2012', label: 'Joueur : FC Nantes, Reading, OGC Nice ; international ivoirien' },
      { period: 'Janvier 2024 — juillet 2026', label: 'Sélectionneur des Éléphants' },
    ],
    highlights: [
      'Champion d’Afrique 2023 (finale face au Nigeria, 2-1, le 11 février 2024).',
      'Coupe du monde 2026 : premier passage des Éléphants au deuxième tour (élimination 2-1 face à la Norvège en 16es de finale).',
      'Bilan : 36 matchs, 23 victoires, 6 nuls, 7 défaites.',
    ],
    sources: [{ label: 'Fin de mission d’Emerse Faé (Fraternité Matin)', url: 'https://www.fratmat.info/article/2643620/sports/elephants-la-fif-met-fin-a-laventure-demerse-fae-a-la-tete-de-la-selection-nationale' }],
  },

  // --- Arbitres -----------------------------------------------------------
  {
    name: 'Noumandiez Doué', category: 'arbitres', title: 'Premier arbitre ivoirien en Coupe du monde',
    summary: 'Désiré Noumandiez Doué, pharmacien de profession, arbitre en championnat national depuis 1999 et international depuis 2004, a été élu meilleur arbitre africain en 2011 et est devenu le premier Ivoirien à arbitrer en phase finale de Coupe du monde, au Brésil en 2014. Il a ensuite présidé la Commission des arbitres de la CAF, avant d’entrer au Comité exécutif de la FIF en 2026.',
    roles: [
      { period: 'Depuis 1999', label: 'Arbitre de championnat national' },
      { period: '2004 — années 2010', label: 'Arbitre international FIFA' },
      { period: 'Août 2022 — juillet 2025', label: 'Président de la Commission des arbitres de la CAF' },
      { period: 'Depuis 2026', label: 'Membre du Comité exécutif de la FIF' },
    ],
    highlights: [
      'Meilleur arbitre africain 2011.',
      'CAN 2012, Championnat d’Afrique des nations (CHAN) et Coupe du monde des clubs.',
      'Premier arbitre ivoirien en phase finale de Coupe du monde (Brésil 2014), avec son assistant compatriote Songuifolo Yéo.',
    ],
    related: { label: 'Voir sa fiche au Comité exécutif', href: '/federation/comite/noumandiez-doue' },
    sources: [
      { label: 'Meilleur arbitre africain 2011 (Abidjan.net)', url: 'https://news.abidjan.net/articles/421126/interview-doue-noumandiez-meilleur-arbitre-africain-2011-je-nai-plus-droit-a-lerreur' },
      { label: 'Commission des arbitres de la CAF (ACP)', url: 'https://acp.cd/sports/caf-livoirien-doue-noumandiez-nomme-president-de-la-commission-des-arbitres/' },
    ],
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
    sources: [{ label: 'Élection à la tête de l’ASCI (L’Avenir)', url: 'https://www.lavenir.ci/sport/4570-amicale-des-supporteurs-de-cote-divoire-tany-gobou-elu-president' }],
  },

  // --- Médias -------------------------------------------------------------
  {
    name: 'Aimé Brière', category: 'medias', title: 'Journaliste et consultant sportif de la RTI',
    died: '2025', deceased: true, death: '24 juillet 2025, Strasbourg (France)',
    summary: 'Figure emblématique de la Radiodiffusion Télévision Ivoirienne (RTI), reconnu pour la clarté de ses analyses et la profondeur de ses commentaires, il a marqué plusieurs générations d’amateurs de football. Il est décédé à Strasbourg, où il était soigné depuis plusieurs mois, après une longue maladie.',
    roles: [{ period: '—', label: 'Journaliste et consultant sportif (télévision et radio, RTI)' }],
    highlights: [
      'Contribution majeure à l’évolution du journalisme sportif en Côte d’Ivoire.',
      'Hommages unanimes du monde des médias, du sport et de la culture à l’annonce de son décès.',
    ],
    sources: [{ label: 'Décès d’Aimé Brière (Presse Côte d’Ivoire)', url: 'https://www.pressecotedivoire.fr/22982-deces-daime-briere-le-journalisme-sportif-ivoirien-perd-une-de-ses-voix-les-plus-emblematiques' }],
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
