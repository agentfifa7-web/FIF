// Description des modules du back-office : champs des formulaires, colonnes des
// listes et conversion formulaire ⇄ fiche. Partagé par l'interface (navigateur)
// et par les actions d'enregistrement (serveur).
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  buildPlayerRecord, newsCategories, productCategories, videoCategories, cityName,
} from '@/lib/data/mock'
import { slugify } from '@/lib/data/rng'
import { matchWhen } from '@/lib/format'
import type { CmsRecord, CollectionKey } from './types'
import { newRecordId } from './apply'

export type FieldType =
  | 'text' | 'textarea' | 'paragraphs' | 'tags' | 'number' | 'date' | 'time' | 'select'
  | 'multiselect' | 'boolean' | 'image' | 'color' | 'url' | 'rows'

export interface FieldOption { value: string; label: string }
export type RefKey = 'clubs' | 'competitions' | 'stadiums' | 'cities' | 'regions'
export type Refs = Record<RefKey, FieldOption[]>

export interface Field {
  name: string
  label: string
  type: FieldType
  required?: boolean
  hint?: string
  placeholder?: string
  options?: (string | FieldOption)[]
  ref?: RefKey
  /** Ajoute un choix vide (« — ») en tête de liste. */
  optional?: boolean
  wide?: boolean
  min?: number
  max?: number
  /** Sous-champs d'une liste de lignes (type 'rows'). */
  fields?: Field[]
  /** Valeur d'une nouvelle ligne (type 'rows'). */
  newRow?: () => Record<string, unknown>
}

export type FormValues = Record<string, any>

export interface CollectionSchema {
  key: CollectionKey
  label: string
  singular: string
  description: string
  group: 'Contenus' | 'Compétitions' | 'Personnes' | 'Commerce' | 'Administration'
  fields: Field[]
  columns: { label: string; value: (r: any, refs: Refs) => string }[]
  title: (r: any) => string
  search: (r: any) => string
  defaults: () => FormValues
  fromForm: (v: FormValues, existing: any | undefined) => CmsRecord
  toForm?: (r: any) => FormValues
  publicHref?: (r: any) => string | undefined
  links?: (r: any) => { label: string; href: string }[]
}

// --- Conversion des valeurs ---------------------------------------------------
const str = (v: unknown) => (v === undefined || v === null ? '' : String(v)).trim()
const opt = (v: unknown) => str(v) || undefined
const num = (v: unknown) => { const s = str(v).replace(',', '.'); if (!s) return undefined; const n = Number(s); return Number.isFinite(n) ? n : undefined }
const list = (v: unknown) => (Array.isArray(v) ? v.map(str) : str(v).split(',')).map((x) => x.trim()).filter(Boolean)
const paras = (v: unknown) => str(v).split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean)
const today = () => new Date().toISOString().slice(0, 10)
const isoDate = (d: unknown, fallback = today()) => `${str(d) || fallback}T12:00:00.000Z`
const label = (refs: Refs, key: RefKey, id: unknown) => refs[key].find((o) => o.value === id)?.label ?? ''
const slugWithId = (text: string, id: string) => `${slugify(text) || 'element'}-${id.slice(-4)}`

/** Valeurs de formulaire par défaut d'une fiche existante. */
export function recordToForm(schema: CollectionSchema, r: any): FormValues {
  if (schema.toForm) return schema.toForm(r)
  const v: FormValues = {}
  for (const f of schema.fields) {
    const value = r?.[f.name]
    if (f.type === 'paragraphs') v[f.name] = Array.isArray(value) ? value.join('\n\n') : str(value)
    else if (f.type === 'tags') v[f.name] = Array.isArray(value) ? value.join(', ') : str(value)
    else if (f.type === 'boolean') v[f.name] = Boolean(value)
    else if (f.type === 'multiselect' || f.type === 'rows') v[f.name] = Array.isArray(value) ? value : []
    else if (f.type === 'date') v[f.name] = value ? String(value).slice(0, 10) : ''
    else v[f.name] = value ?? ''
  }
  return v
}

/** Champs obligatoires manquants. */
export function missingFields(schema: CollectionSchema, v: FormValues) {
  return schema.fields.filter((f) => f.required && (f.type === 'multiselect' ? !(v[f.name]?.length) : !str(v[f.name]))).map((f) => f.label)
}

const POSITIONS = ['Gardien', 'Défenseur', 'Milieu', 'Attaquant']
const MATCH_STATUSES = ['À venir', 'Terminé', 'Reporté']
const GENDERS: FieldOption[] = [{ value: 'M', label: 'Masculin' }, { value: 'F', label: 'Féminin' }]
const TIER_IDS: FieldOption[] = [
  { value: 'vip', label: 'VIP / Tribune présidentielle' }, { value: 'centrale', label: 'Tribune centrale' },
  { value: 'laterale', label: 'Tribune latérale' }, { value: 'virage', label: 'Virage / Pourtour' },
]

// --- Modules -----------------------------------------------------------------
const articles: CollectionSchema = {
  key: 'articles', label: 'Actualités', singular: 'actualité', group: 'Contenus',
  description: 'Articles publiés dans la rubrique Actualités et sur la page d’accueil.',
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true, wide: true },
    { name: 'category', label: 'Rubrique', type: 'select', options: newsCategories, required: true },
    { name: 'date', label: 'Date de publication', type: 'date', required: true },
    { name: 'excerpt', label: 'Chapeau (résumé)', type: 'textarea', wide: true, hint: 'Deux ou trois lignes affichées dans les listes.' },
    { name: 'body', label: 'Texte de l’article', type: 'paragraphs', required: true, wide: true, hint: 'Séparez les paragraphes par une ligne vide.' },
    { name: 'image', label: 'Image', type: 'image', wide: true },
    { name: 'author', label: 'Auteur', type: 'text' },
    { name: 'tags', label: 'Mots-clés', type: 'tags', hint: 'Séparés par des virgules.' },
    { name: 'featured', label: 'Mettre à la une', type: 'boolean' },
  ],
  columns: [
    { label: 'Rubrique', value: (r) => r.category },
    { label: 'Date', value: (r) => (r.date ? new Date(r.date).toLocaleDateString('fr-FR') : '') },
  ],
  title: (r) => r.title, search: (r) => `${r.title} ${r.category} ${r.author}`,
  defaults: () => ({ category: 'Fédération', date: today(), author: 'Rédaction FIF Digital', featured: false, tags: '' }),
  fromForm: (v, e) => {
    const id = e?.id ?? newRecordId('article')
    const body = paras(v.body)
    return {
      ...e, id, slug: e?.slug ?? slugWithId(str(v.title), id), title: str(v.title), category: str(v.category),
      excerpt: str(v.excerpt) || (body[0] ?? '').slice(0, 220), body, author: str(v.author) || 'Rédaction FIF Digital',
      date: isoDate(v.date), image: str(v.image) || '/fif-logo.png', tags: list(v.tags), featured: Boolean(v.featured),
    }
  },
  publicHref: (r) => `/actualites/${r.slug}`,
}

const videos: CollectionSchema = {
  key: 'videos', label: 'Vidéos', singular: 'vidéo', group: 'Contenus',
  description: 'Vidéos de FIF TV (résumés, interviews, conférences…).',
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true, wide: true },
    { name: 'category', label: 'Catégorie', type: 'select', options: videoCategories, required: true },
    { name: 'date', label: 'Date', type: 'date', required: true },
    { name: 'url', label: 'Lien de la vidéo', type: 'url', wide: true, required: true, placeholder: 'https://www.youtube.com/watch?v=…', hint: 'YouTube, Facebook ou lien direct vers un fichier vidéo.' },
    { name: 'duration', label: 'Durée', type: 'text', placeholder: '12:30' },
    { name: 'image', label: 'Vignette', type: 'image', wide: true, hint: 'Facultatif pour YouTube : la vignette est récupérée automatiquement.' },
    { name: 'description', label: 'Description', type: 'textarea', wide: true },
  ],
  columns: [
    { label: 'Catégorie', value: (r) => r.category },
    { label: 'Date', value: (r) => (r.date ? new Date(r.date).toLocaleDateString('fr-FR') : '') },
  ],
  title: (r) => r.title, search: (r) => `${r.title} ${r.category}`,
  defaults: () => ({ category: 'Résumés', date: today() }),
  fromForm: (v, e) => {
    const id = e?.id ?? newRecordId('video')
    const url = str(v.url)
    const yt = youtubeId(url)
    return {
      ...e, id, slug: e?.slug ?? slugWithId(str(v.title), id), title: str(v.title), category: str(v.category),
      date: isoDate(v.date), url, duration: str(v.duration), description: str(v.description),
      image: str(v.image) || (yt ? `https://img.youtube.com/vi/${yt}/hqdefault.jpg` : '/fif-logo.png'),
    }
  },
  publicHref: (r) => `/fif-tv/${r.slug}`,
}

export function youtubeId(url: string) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/)
  return m?.[1]
}

const competitions: CollectionSchema = {
  key: 'competitions', label: 'Compétitions', singular: 'compétition', group: 'Compétitions',
  description: 'Championnats et coupes : format, saison et clubs engagés.',
  fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true, wide: true },
    { name: 'category', label: 'Catégorie', type: 'select', options: ['Seniors', 'Féminin', 'Jeunes', 'Futsal', 'Beach Soccer'], required: true },
    { name: 'practice', label: 'Pratique', type: 'select', options: ['Professionnel', 'Amateur'], optional: true },
    { name: 'gender', label: 'Genre', type: 'select', options: GENDERS, required: true },
    { name: 'season', label: 'Saison', type: 'text', required: true, placeholder: '2026-2027' },
    { name: 'format', label: 'Format', type: 'text', wide: true, placeholder: 'Championnat, matchs aller-retour' },
    { name: 'logoInitials', label: 'Sigle', type: 'text', placeholder: 'L1' },
    { name: 'clubIds', label: 'Clubs engagés', type: 'multiselect', ref: 'clubs', wide: true },
  ],
  columns: [
    { label: 'Catégorie', value: (r) => r.category },
    { label: 'Saison', value: (r) => r.season },
    { label: 'Clubs', value: (r) => String(r.clubIds?.length ?? 0) },
  ],
  title: (r) => r.name, search: (r) => `${r.name} ${r.category}`,
  defaults: () => ({ category: 'Seniors', gender: 'M', season: '2026-2027', practice: 'Professionnel', clubIds: [] }),
  fromForm: (v, e) => {
    const name = str(v.name)
    const id = e?.id ?? `comp-${slugify(name)}-${Date.now().toString(36).slice(-3)}`
    return {
      ...e, id, slug: e?.slug ?? slugify(name), name, category: str(v.category), practice: opt(v.practice) ?? null,
      gender: str(v.gender) || 'M', season: str(v.season), format: str(v.format) || 'Championnat',
      logoInitials: str(v.logoInitials) || name.split(/\s+/).map((w) => w[0]).join('').slice(0, 3).toUpperCase(),
      clubIds: Array.isArray(v.clubIds) ? v.clubIds : [],
    }
  },
  publicHref: (r) => `/competitions/${r.slug}`,
}

const matches: CollectionSchema = {
  key: 'matches', label: 'Matchs', singular: 'match', group: 'Compétitions',
  description: 'Calendrier et résultats. La feuille de match se remplit depuis chaque match.',
  fields: [
    { name: 'competitionId', label: 'Compétition', type: 'select', ref: 'competitions', required: true },
    { name: 'matchday', label: 'Journée', type: 'number', min: 1, required: true },
    { name: 'homeClubId', label: 'Équipe à domicile', type: 'select', ref: 'clubs', required: true },
    { name: 'awayClubId', label: 'Équipe à l’extérieur', type: 'select', ref: 'clubs', required: true },
    { name: 'day', label: 'Date', type: 'date', hint: 'Laisser vide si la date n’est pas encore officielle.' },
    { name: 'kickoff', label: 'Heure du coup d’envoi', type: 'time' },
    { name: 'stadiumId', label: 'Stade', type: 'select', ref: 'stadiums', optional: true },
    { name: 'venue', label: 'Autre lieu', type: 'text', hint: 'Si le stade n’est pas dans la liste.' },
    { name: 'status', label: 'Statut', type: 'select', options: MATCH_STATUSES, required: true },
    { name: 'homeScore', label: 'Score domicile', type: 'number', min: 0 },
    { name: 'awayScore', label: 'Score extérieur', type: 'number', min: 0 },
    { name: 'refereeName', label: 'Arbitre central', type: 'text' },
    { name: 'attendance', label: 'Affluence', type: 'number', min: 0 },
    { name: 'source', label: 'Source / remarque', type: 'textarea', wide: true },
  ],
  columns: [
    { label: 'Compétition', value: (r, refs) => `${label(refs, 'competitions', r.competitionId)} · J${r.matchday}` },
    { label: 'Date', value: (r) => matchWhen(r) },
    { label: 'Résultat', value: (r) => (r.status === 'Terminé' ? `${r.homeScore ?? 0} - ${r.awayScore ?? 0}` : r.status) },
  ],
  title: (r) => r.__title ?? r.id, search: (r) => `${r.__title ?? ''} ${r.status}`,
  defaults: () => ({ matchday: 1, status: 'À venir' }),
  toForm: (r) => ({
    competitionId: r.competitionId, matchday: r.matchday, homeClubId: r.homeClubId, awayClubId: r.awayClubId,
    day: r.dateConfirmed === false ? '' : String(r.date ?? '').slice(0, 10),
    kickoff: r.dateConfirmed === false || r.timeConfirmed === false ? '' : String(r.date ?? '').slice(11, 16),
    stadiumId: r.stadiumId ?? '', venue: r.venue ?? '', status: r.status, homeScore: r.homeScore ?? '', awayScore: r.awayScore ?? '',
    refereeName: r.refereeName ?? '', attendance: r.attendance ?? '', source: r.source ?? '',
  }),
  fromForm: (v, e) => {
    const id = e?.id ?? newRecordId('match')
    const day = str(v.day)
    const kickoff = str(v.kickoff)
    const done = str(v.status) === 'Terminé'
    return {
      ...e, id, competitionId: str(v.competitionId), matchday: num(v.matchday) ?? 1,
      homeClubId: str(v.homeClubId), awayClubId: str(v.awayClubId),
      date: day ? `${day}T${kickoff || '12:00'}:00.000Z` : (e?.date ?? `${today()}T23:59:00.000Z`),
      dateConfirmed: Boolean(day), timeConfirmed: Boolean(day && kickoff),
      stadiumId: opt(v.stadiumId) ?? null, venue: opt(v.venue), status: str(v.status) || 'À venir',
      homeScore: done ? num(v.homeScore) ?? 0 : num(v.homeScore) ?? null,
      awayScore: done ? num(v.awayScore) ?? 0 : num(v.awayScore) ?? null,
      events: e?.events ?? [], refereeId: e?.refereeId ?? null, refereeName: opt(v.refereeName),
      delegateId: e?.delegateId ?? null, attendance: num(v.attendance), source: opt(v.source),
    }
  },
  publicHref: (r) => `/matches/${r.id}`,
  links: (r) => [{ label: 'Feuille de match', href: `/admin/feuille-de-match/${r.id}` }],
}

const players: CollectionSchema = {
  key: 'players', label: 'Joueurs', singular: 'joueur', group: 'Personnes',
  description: 'Effectifs des clubs : identité, poste, numéro, licence.',
  fields: [
    { name: 'name', label: 'Nom complet', type: 'text', required: true, wide: true },
    { name: 'clubId', label: 'Club', type: 'select', ref: 'clubs', required: true },
    { name: 'position', label: 'Poste', type: 'select', options: POSITIONS, required: true },
    { name: 'positionDetail', label: 'Poste précis', type: 'text', placeholder: 'Latéral gauche' },
    { name: 'squadNumber', label: 'Numéro de maillot', type: 'number', min: 1, max: 99 },
    { name: 'birthdate', label: 'Date de naissance', type: 'date' },
    { name: 'nationality', label: 'Nationalité', type: 'text', placeholder: 'Côte d’Ivoire' },
    { name: 'height', label: 'Taille (cm)', type: 'number', min: 140, max: 215 },
    { name: 'weight', label: 'Poids (kg)', type: 'number', min: 40, max: 130 },
    { name: 'preferredFoot', label: 'Pied fort', type: 'select', options: ['Droit', 'Gauche', 'Ambidextre'], optional: true },
    { name: 'licenseStatus', label: 'Licence', type: 'select', options: ['Valide', 'En attente', 'Expirée'], required: true },
  ],
  columns: [
    { label: 'Club', value: (r, refs) => label(refs, 'clubs', r.clubId) },
    { label: 'Poste', value: (r) => `${r.squadNumber ? `N°${r.squadNumber} · ` : ''}${r.positionDetail || r.position}` },
    { label: 'Licence', value: (r) => r.licenseStatus },
  ],
  title: (r) => r.name, search: (r) => `${r.name} ${r.position} ${r.fifId}`,
  defaults: () => ({ position: 'Milieu', licenseStatus: 'Valide', nationality: 'Côte d’Ivoire' }),
  fromForm: (v, e) => {
    const fields = {
      name: str(v.name), clubId: str(v.clubId), position: str(v.position) as any, positionDetail: opt(v.positionDetail),
      squadNumber: num(v.squadNumber), birthdate: str(v.birthdate), nationality: str(v.nationality),
      height: num(v.height), weight: num(v.weight), preferredFoot: opt(v.preferredFoot) as any, licenseStatus: (str(v.licenseStatus) || 'Valide') as any,
    }
    if (!e) return buildPlayerRecord({ id: newRecordId('player'), ...fields }) as unknown as CmsRecord
    const history = Array.isArray(e.history) ? [...e.history] : []
    if (e.clubId !== fields.clubId) {
      const last = history[history.length - 1]
      if (last && last.to === null) last.to = new Date().getFullYear()
      history.push({ clubId: fields.clubId, from: new Date().getFullYear(), to: null })
    }
    // Une fiche créée automatiquement devient une fiche gérée par l'administration.
    return { ...e, ...fields, autoProfile: false, height: fields.height ?? e.height, weight: fields.weight ?? e.weight, preferredFoot: fields.preferredFoot ?? e.preferredFoot, history }
  },
  publicHref: (r) => `/joueurs/${r.slug}`,
}

const clubs: CollectionSchema = {
  key: 'clubs', label: 'Clubs', singular: 'club', group: 'Compétitions',
  description: 'Clubs affiliés : identité, stade, dirigeants, écusson. Les compétitions se gèrent dans le module Compétitions.',
  fields: [
    { name: 'name', label: 'Nom du club', type: 'text', required: true, wide: true },
    { name: 'shortName', label: 'Nom court', type: 'text' },
    { name: 'category', label: 'Catégorie', type: 'select', options: ['Professionnel', 'Amateur', 'Féminin', 'Jeunes', 'Futsal'], required: true },
    { name: 'group', label: 'Poule (Ligue 2 : A/B · D3 : A à D)', type: 'select', options: ['A', 'B', 'C', 'D'], optional: true },
    { name: 'cityId', label: 'Ville', type: 'select', ref: 'cities', optional: true },
    { name: 'stadiumId', label: 'Stade', type: 'select', ref: 'stadiums', optional: true },
    { name: 'founded', label: 'Année de fondation', type: 'number', min: 1900, max: 2100 },
    { name: 'president', label: 'Président', type: 'text' },
    { name: 'website', label: 'Site internet', type: 'url' },
    { name: 'crestUrl', label: 'Écusson', type: 'image' },
    { name: 'color1', label: 'Couleur principale', type: 'color' },
    { name: 'color2', label: 'Couleur secondaire', type: 'color' },
  ],
  columns: [
    { label: 'Catégorie', value: (r) => `${r.category}${r.group ? ` · Poule ${r.group}` : ''}` },
    { label: 'Ville', value: (r) => cityName(r.cityId ?? '') },
  ],
  title: (r) => r.name, search: (r) => `${r.name} ${r.shortName} ${r.president ?? ''}`,
  defaults: () => ({ category: 'Professionnel', color1: '#087443', color2: '#ffffff' }),
  toForm: (r) => ({ ...recordToForm({ ...clubs, toForm: undefined }, r), color1: r.colors?.[0] ?? '#087443', color2: r.colors?.[1] ?? '#ffffff' }),
  fromForm: (v, e) => {
    const name = str(v.name)
    const id = e?.id ?? `club-${slugify(name)}-${Date.now().toString(36).slice(-3)}`
    return {
      ...e, id, slug: e?.slug ?? slugify(name), name,
      shortName: str(v.shortName) || (name.split(' ').length > 1 ? `${name.split(' ')[0]} ${name.split(' ').slice(-1)[0]}` : name),
      category: str(v.category), group: (opt(v.group) ?? null) as any, cityId: str(v.cityId), stadiumId: opt(v.stadiumId) ?? null,
      founded: num(v.founded), president: opt(v.president), website: opt(v.website), crestUrl: opt(v.crestUrl),
      colors: [str(v.color1) || '#087443', str(v.color2) || '#ffffff'],
      crestInitials: name.split(' ').map((w) => w[0]).slice(0, 3).join('').toUpperCase(),
      gender: str(v.category) === 'Féminin' ? 'F' : 'M',
      competitionIds: e?.competitionIds ?? [], honours: e?.honours ?? [], achievements: e?.achievements ?? [],
    }
  },
  publicHref: (r) => `/clubs/${r.slug}`,
}

const licences: CollectionSchema = {
  key: 'licences', label: 'Licences', singular: 'licence', group: 'Administration',
  description: 'Registre des licences délivrées (joueurs, entraîneurs, arbitres, agents…). Vérifiables sur la page « Vérifier ».',
  fields: [
    { name: 'holderName', label: 'Titulaire', type: 'text', required: true, wide: true },
    { name: 'type', label: 'Type de licence', type: 'select', options: ['Joueur', 'Entraîneur', 'Arbitre', 'Agent', 'Dirigeant', 'Médecin / Kiné', 'Autre'], required: true },
    { name: 'number', label: 'Numéro de licence', type: 'text', hint: 'Laisser vide pour le générer automatiquement.' },
    { name: 'clubId', label: 'Club', type: 'select', ref: 'clubs', optional: true },
    { name: 'season', label: 'Saison', type: 'text', required: true },
    { name: 'issuedAt', label: 'Délivrée le', type: 'date' },
    { name: 'expiresAt', label: 'Expire le', type: 'date' },
    { name: 'status', label: 'Statut', type: 'select', options: ['Valide', 'En attente', 'Suspendue', 'Expirée', 'Refusée'], required: true },
    { name: 'phone', label: 'Téléphone du titulaire', type: 'text' },
    { name: 'notes', label: 'Notes internes', type: 'textarea', wide: true },
  ],
  columns: [
    { label: 'N°', value: (r) => r.number },
    { label: 'Type', value: (r, refs) => `${r.type}${r.clubId ? ` · ${label(refs, 'clubs', r.clubId)}` : ''}` },
    { label: 'Statut', value: (r) => r.status },
  ],
  title: (r) => r.holderName, search: (r) => `${r.holderName} ${r.number} ${r.type} ${r.phone}`,
  defaults: () => ({ type: 'Joueur', season: '2026-2027', status: 'Valide', issuedAt: today() }),
  fromForm: (v, e) => ({
    ...e, id: e?.id ?? newRecordId('lic'),
    number: str(v.number) || e?.number || `LIC-${str(v.season).slice(0, 4) || new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`,
    holderName: str(v.holderName), type: str(v.type), clubId: str(v.clubId), season: str(v.season),
    issuedAt: str(v.issuedAt), expiresAt: str(v.expiresAt), status: str(v.status), phone: str(v.phone), notes: str(v.notes),
  }),
}

const referees: CollectionSchema = {
  key: 'referees', label: 'Arbitres', singular: 'arbitre', group: 'Personnes',
  description: 'Corps arbitral : catégorie, région, statut.',
  fields: [
    { name: 'name', label: 'Nom complet', type: 'text', required: true, wide: true },
    { name: 'category', label: 'Catégorie', type: 'select', options: ['FIFA', 'Fédérale 1', 'Fédérale 2', 'Régionale'], required: true },
    { name: 'regionId', label: 'Région / district', type: 'select', ref: 'regions', optional: true },
    { name: 'gender', label: 'Genre', type: 'select', options: GENDERS, required: true },
    { name: 'status', label: 'Statut', type: 'select', options: ['Actif', 'Suspendu', 'Retraité'], required: true },
    { name: 'matchesOfficiated', label: 'Matchs arbitrés', type: 'number', min: 0 },
    { name: 'birthdate', label: 'Date de naissance', type: 'date' },
    { name: 'bio', label: 'Présentation', type: 'textarea', wide: true },
  ],
  columns: [
    { label: 'Catégorie', value: (r) => r.category },
    { label: 'Statut', value: (r) => r.status },
  ],
  title: (r) => r.name, search: (r) => `${r.name} ${r.category} ${r.fifId}`,
  defaults: () => ({ category: 'Fédérale 1', gender: 'M', status: 'Actif', matchesOfficiated: 0 }),
  fromForm: (v, e) => {
    const id = e?.id ?? newRecordId('ref')
    return {
      ...e, id, slug: e?.slug ?? slugWithId(str(v.name), id), name: str(v.name), category: str(v.category), regionId: str(v.regionId),
      gender: str(v.gender) || 'M', status: str(v.status), matchesOfficiated: num(v.matchesOfficiated) ?? 0,
      fifId: e?.fifId ?? `FIF-AR-${id.slice(-5).toUpperCase()}`, birthdate: str(v.birthdate),
      bio: str(v.bio) || `Arbitre de catégorie ${str(v.category)}.`, trainings: e?.trainings ?? [],
    }
  },
  publicHref: (r) => `/officiels/arbitres/${r.slug}`,
}

const coaches: CollectionSchema = {
  key: 'coaches', label: 'Entraîneurs', singular: 'entraîneur', group: 'Personnes',
  description: 'Entraîneurs principaux des clubs et sélections.',
  fields: [
    { name: 'name', label: 'Nom complet', type: 'text', required: true, wide: true },
    { name: 'clubId', label: 'Club', type: 'select', ref: 'clubs', optional: true },
    { name: 'license', label: 'Diplôme', type: 'select', options: ['CAF Pro', 'CAF A', 'CAF B', 'CAF C'], required: true },
    { name: 'since', label: 'En poste depuis (année)', type: 'number', min: 1980, max: 2100 },
    { name: 'birthdate', label: 'Date de naissance', type: 'date' },
    { name: 'bio', label: 'Présentation', type: 'textarea', wide: true },
  ],
  columns: [
    { label: 'Club', value: (r, refs) => label(refs, 'clubs', r.clubId) || 'Sans club' },
    { label: 'Diplôme', value: (r) => r.license },
  ],
  title: (r) => r.name, search: (r) => `${r.name} ${r.license}`,
  defaults: () => ({ license: 'CAF A', since: new Date().getFullYear() }),
  fromForm: (v, e) => {
    const id = e?.id ?? newRecordId('coach')
    const clubId = opt(v.clubId) ?? null
    const since = num(v.since) ?? new Date().getFullYear()
    return {
      ...e, id, slug: e?.slug ?? slugWithId(str(v.name), id), name: str(v.name), clubId, nationalTeamId: e?.nationalTeamId ?? null,
      license: str(v.license), since, fifId: e?.fifId ?? `FIF-CO-${id.slice(-5).toUpperCase()}`, birthdate: str(v.birthdate),
      bio: str(v.bio) || `Entraîneur diplômé ${str(v.license)}.`, history: e?.history ?? (clubId ? [{ clubId, from: since, to: null }] : []),
    }
  },
  publicHref: (r) => `/officiels/entraineurs/${r.slug}`,
}

const agents: CollectionSchema = {
  key: 'agents', label: 'Agents', singular: 'agent', group: 'Personnes',
  description: 'Agents de joueurs licenciés.',
  fields: [
    { name: 'name', label: 'Nom complet', type: 'text', required: true, wide: true },
    { name: 'license', label: 'Matricule', type: 'text', required: true, placeholder: '202307-3048', hint: 'Format : AAAAMM-NNNN (année, mois de la licence, numéro d’agent).' },
    { name: 'status', label: 'Statut', type: 'select', options: ['Actif', 'Suspendu'], required: true },
    { name: 'validUntil', label: 'Licence valable jusqu’au', type: 'date' },
    { name: 'birthdate', label: 'Date de naissance', type: 'date' },
    { name: 'bio', label: 'Présentation', type: 'textarea', wide: true },
  ],
  columns: [{ label: 'Matricule', value: (r) => r.license }, { label: 'Statut', value: (r) => r.status }],
  title: (r) => r.name, search: (r) => `${r.name} ${r.license}`,
  defaults: () => ({ status: 'Actif' }),
  fromForm: (v, e) => {
    const id = e?.id ?? newRecordId('agent')
    return {
      ...e, id, slug: e?.slug ?? slugWithId(str(v.name), id), name: str(v.name), license: str(v.license), status: str(v.status),
      validUntil: str(v.validUntil), birthdate: str(v.birthdate), fifId: e?.fifId ?? `FIF-AG-${id.slice(-5).toUpperCase()}`,
      playerIds: e?.playerIds ?? [], bio: str(v.bio) || 'Agent sportif licencié FIF.',
    }
  },
  publicHref: (r) => `/officiels/agents/${r.slug}`,
}

const officials: CollectionSchema = {
  key: 'officials', label: 'Dirigeants & officiels', singular: 'dirigeant', group: 'Personnes',
  description: 'Présidents et secrétaires de clubs, délégués et commissaires de match.',
  fields: [
    { name: 'name', label: 'Nom complet', type: 'text', required: true, wide: true },
    { name: 'role', label: 'Fonction', type: 'select', options: ['Président de club', 'Secrétaire général', 'Délégué de match', 'Commissaire au match'], required: true },
    { name: 'clubId', label: 'Club', type: 'select', ref: 'clubs', optional: true },
    { name: 'birthdate', label: 'Date de naissance', type: 'date' },
    { name: 'bio', label: 'Présentation', type: 'textarea', wide: true },
  ],
  columns: [{ label: 'Fonction', value: (r) => r.role }, { label: 'Club', value: (r, refs) => label(refs, 'clubs', r.clubId) }],
  title: (r) => r.name, search: (r) => `${r.name} ${r.role}`,
  defaults: () => ({ role: 'Président de club' }),
  fromForm: (v, e) => {
    const id = e?.id ?? newRecordId('off')
    return {
      ...e, id, slug: e?.slug ?? slugWithId(str(v.name), id), name: str(v.name), role: str(v.role), clubId: opt(v.clubId) ?? null,
      fifId: e?.fifId ?? `FIF-OF-${id.slice(-5).toUpperCase()}`, birthdate: str(v.birthdate), bio: str(v.bio) || str(v.role),
    }
  },
  publicHref: (r) => `/officiels/dirigeants/${r.slug}`,
}

const stadiums: CollectionSchema = {
  key: 'stadiums', label: 'Stades', singular: 'stade', group: 'Compétitions',
  description: 'Stades et terrains homologués.',
  fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true, wide: true },
    { name: 'cityId', label: 'Ville', type: 'select', ref: 'cities', required: true },
    { name: 'capacity', label: 'Capacité', type: 'number', min: 0 },
    { name: 'built', label: 'Mise en service (année)', type: 'number', min: 1900, max: 2100 },
    { name: 'surface', label: 'Pelouse', type: 'select', options: ['Pelouse naturelle', 'Pelouse hybride', 'Synthétique'], optional: true },
    { name: 'lighting', label: 'Éclairage homologué', type: 'boolean' },
    { name: 'image', label: 'Photo', type: 'image', wide: true },
    { name: 'note', label: 'Présentation', type: 'textarea', wide: true },
  ],
  columns: [{ label: 'Ville', value: (r) => cityName(r.cityId) }, { label: 'Capacité', value: (r) => (r.capacity ? r.capacity.toLocaleString('fr-FR') : '—') }],
  title: (r) => r.name, search: (r) => r.name,
  defaults: () => ({ cityId: 'c-abidjan' }),
  fromForm: (v, e) => {
    const id = e?.id ?? newRecordId('st')
    return {
      ...e, id, slug: e?.slug ?? slugWithId(str(v.name), id), name: str(v.name), cityId: str(v.cityId), capacity: num(v.capacity),
      built: num(v.built), surface: opt(v.surface), lighting: Boolean(v.lighting) || undefined, image: opt(v.image), note: opt(v.note),
    }
  },
  publicHref: (r) => `/stades/${r.slug}`,
}

const tickets: CollectionSchema = {
  key: 'tickets', label: 'Billetterie', singular: 'événement', group: 'Commerce',
  description: 'Matchs mis en vente : tarifs par tribune, statut de la vente, informations pratiques.',
  fields: [
    { name: 'homeName', label: 'Équipe à domicile', type: 'text', required: true, hint: 'Nom d’un club ou « Côte d’Ivoire ».' },
    { name: 'awayName', label: 'Équipe à l’extérieur', type: 'text', required: true },
    { name: 'category', label: 'Type', type: 'select', options: ['Éléphants', 'Ligue 1'], required: true },
    { name: 'competition', label: 'Compétition', type: 'text', required: true, wide: true, placeholder: 'Ligue 1 — 3e journée (saison 2026-2027)' },
    { name: 'date', label: 'Date', type: 'date' },
    { name: 'time', label: 'Heure', type: 'time' },
    { name: 'stadiumName', label: 'Stade', type: 'text', required: true },
    { name: 'stadiumCity', label: 'Ville', type: 'text' },
    { name: 'status', label: 'Vente', type: 'select', options: ['En vente', 'Bientôt en vente', 'Complet', 'Terminé'], required: true },
    { name: 'maxPerOrder', label: 'Billets max par commande', type: 'number', min: 1, max: 20 },
    { name: 'gatesOpen', label: 'Ouverture des portes', type: 'time' },
    { name: 'matchHref', label: 'Lien vers la page du match', type: 'text', placeholder: '/matches/…' },
    { name: 'note', label: 'Informations', type: 'textarea', wide: true },
    {
      name: 'tiers', label: 'Tarifs par tribune', type: 'rows', wide: true,
      newRow: () => ({ id: 'centrale', name: 'Tribune centrale', price: 5000, perks: '', gate: '', availability: 'Disponible' }),
      fields: [
        { name: 'id', label: 'Zone', type: 'select', options: TIER_IDS },
        { name: 'name', label: 'Nom affiché', type: 'text' },
        { name: 'price', label: 'Prix (F CFA)', type: 'number', min: 0 },
        { name: 'availability', label: 'Disponibilité', type: 'select', options: ['Disponible', 'Dernières places', 'Complet'] },
        { name: 'gate', label: 'Porte', type: 'text' },
        { name: 'perks', label: 'Avantages', type: 'text' },
      ],
    },
  ],
  columns: [
    { label: 'Date', value: (r) => (r.date ? new Date(`${r.date}T12:00:00Z`).toLocaleDateString('fr-FR') : 'À confirmer') },
    { label: 'Vente', value: (r) => r.status },
    { label: 'Tarifs', value: (r) => (r.tiers?.length ? r.tiers.map((t: any) => `${Number(t.price).toLocaleString('fr-FR')} F`).join(' / ') : '—') },
  ],
  title: (r) => `${r.home?.name ?? ''} vs ${r.away?.name ?? ''}`, search: (r) => `${r.home?.name} ${r.away?.name} ${r.competition}`,
  defaults: () => ({ category: 'Ligue 1', status: 'Bientôt en vente', maxPerOrder: 6, tiers: [] }),
  toForm: (r) => ({
    homeName: r.home?.name ?? '', awayName: r.away?.name ?? '', category: r.category, competition: r.competition,
    date: r.date ?? '', time: r.time ?? '', stadiumName: r.stadium?.name ?? '', stadiumCity: r.stadium?.city ?? '',
    status: r.status, maxPerOrder: r.maxPerOrder ?? 6, gatesOpen: r.gatesOpen ?? '', matchHref: r.matchHref ?? '', note: r.note ?? '',
    tiers: r.tiers ?? [],
  }),
  fromForm: (v, e) => {
    const home = str(v.homeName)
    const away = str(v.awayName)
    const date = str(v.date)
    const id = e?.id ?? e?.slug ?? `${slugify(`${home} ${away}`)}-${date || Date.now().toString(36)}`
    const side = (name: string, prev?: any) => (prev?.name === name ? prev : name === 'Côte d’Ivoire' || name === "Côte d'Ivoire"
      ? { name: 'Côte d’Ivoire', shortName: 'Éléphants', flag: '🇨🇮', crestUrl: '/fif-logo.png' }
      : { name, shortName: name })
    return {
      ...e, id, slug: id, category: str(v.category), competition: str(v.competition),
      home: side(home, e?.home), away: side(away, e?.away), date: date || undefined, time: opt(v.time),
      stadium: { name: str(v.stadiumName), city: str(v.stadiumCity) }, status: str(v.status),
      maxPerOrder: num(v.maxPerOrder) ?? 6, gatesOpen: opt(v.gatesOpen), matchHref: opt(v.matchHref), note: opt(v.note),
      tiers: (Array.isArray(v.tiers) ? v.tiers : []).map((t: any) => ({
        id: str(t.id) || 'centrale', name: str(t.name) || TIER_IDS.find((x) => x.value === t.id)?.label || 'Tribune',
        price: num(t.price) ?? 0, perks: str(t.perks), gate: str(t.gate), availability: str(t.availability) || 'Disponible',
      })),
    }
  },
  publicHref: (r) => `/billetterie/${r.slug ?? r.id}`,
}

const products: CollectionSchema = {
  key: 'products', label: 'Boutique', singular: 'article', group: 'Commerce',
  description: 'Articles de la boutique officielle : prix, tailles, couleurs, photos.',
  fields: [
    { name: 'name', label: 'Nom de l’article', type: 'text', required: true, wide: true },
    { name: 'category', label: 'Catégorie', type: 'select', options: productCategories, required: true },
    { name: 'price', label: 'Prix (F CFA)', type: 'number', min: 0, required: true },
    { name: 'badge', label: 'Badge', type: 'text', placeholder: 'Nouveau, Édition limitée…' },
    { name: 'photo', label: 'Photo', type: 'image', wide: true },
    { name: 'description', label: 'Description', type: 'textarea', wide: true },
    { name: 'sizes', label: 'Tailles', type: 'tags', placeholder: 'S, M, L, XL' },
    { name: 'colors', label: 'Couleurs', type: 'tags', placeholder: 'Orange, Blanc' },
    { name: 'customizable', label: 'Personnalisable (nom + numéro)', type: 'boolean' },
  ],
  columns: [{ label: 'Catégorie', value: (r) => r.category }, { label: 'Prix', value: (r) => `${Number(r.price).toLocaleString('fr-FR')} F CFA` }],
  title: (r) => r.name, search: (r) => `${r.name} ${r.category}`,
  defaults: () => ({ category: 'Maillots', customizable: false }),
  fromForm: (v, e) => ({
    ...e, id: e?.id ?? newRecordId('prod'), name: str(v.name), category: str(v.category), price: num(v.price) ?? 0,
    badge: opt(v.badge), photo: opt(v.photo), image: opt(v.photo) ?? e?.image ?? '/fif-logo.png', description: opt(v.description),
    sizes: list(v.sizes), colors: list(v.colors), customizable: Boolean(v.customizable),
  }),
  publicHref: (r) => `/boutique/${r.id}`,
}

const academies: CollectionSchema = {
  key: 'academies', label: 'Académies', singular: 'académie', group: 'Contenus',
  description: 'Centres de formation et académies agréés.',
  fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true, wide: true },
    { name: 'cityId', label: 'Ville', type: 'select', ref: 'cities', required: true },
    { name: 'founded', label: 'Année de création', type: 'number', min: 1900, max: 2100 },
    { name: 'status', label: 'Statut', type: 'select', options: ['Agréée FIF', 'En cours d’agrément'], required: true },
    { name: 'categories', label: 'Catégories d’âge', type: 'tags', placeholder: 'U12, U15, U17' },
  ],
  columns: [{ label: 'Ville', value: (r) => cityName(r.cityId) }, { label: 'Statut', value: (r) => r.status }],
  title: (r) => r.name, search: (r) => r.name,
  defaults: () => ({ cityId: 'c-abidjan', status: 'Agréée FIF' }),
  fromForm: (v, e) => {
    const id = e?.id ?? newRecordId('academy')
    return { ...e, id, slug: e?.slug ?? slugWithId(str(v.name), id), name: str(v.name), cityId: str(v.cityId), founded: num(v.founded), status: str(v.status), categories: list(v.categories) }
  },
  publicHref: (r) => `/academies/${r.slug}`,
}

export const FINANCE_CATEGORIES = [
  'Billetterie', 'Boutique', 'Subventions FIFA / CAF', 'Subvention de l’État', 'Sponsoring', 'Droits TV', 'Licences et affiliations',
  'Amendes', 'Salaires', 'Compétitions', 'Équipes nationales', 'Arbitrage', 'Formation', 'Infrastructures', 'Fonctionnement', 'Autre',
]

const finances: CollectionSchema = {
  key: 'finances', label: 'Finances', singular: 'opération', group: 'Administration',
  description: 'Journal des recettes et des dépenses de la Fédération.',
  fields: [
    { name: 'date', label: 'Date', type: 'date', required: true },
    { name: 'type', label: 'Type', type: 'select', options: ['Recette', 'Dépense'], required: true },
    { name: 'label', label: 'Libellé', type: 'text', required: true, wide: true },
    { name: 'category', label: 'Catégorie', type: 'select', options: FINANCE_CATEGORIES, required: true },
    { name: 'amount', label: 'Montant (F CFA)', type: 'number', min: 0, required: true },
    { name: 'method', label: 'Moyen de paiement', type: 'select', options: ['Virement', 'Mobile Money', 'Espèces', 'Chèque', 'Carte bancaire'], optional: true },
    { name: 'reference', label: 'Référence / pièce', type: 'text' },
    { name: 'notes', label: 'Notes', type: 'textarea', wide: true },
  ],
  columns: [
    { label: 'Date', value: (r) => (r.date ? new Date(`${r.date}T12:00:00Z`).toLocaleDateString('fr-FR') : '') },
    { label: 'Catégorie', value: (r) => r.category },
    { label: 'Montant', value: (r) => `${r.type === 'Dépense' ? '−' : '+'} ${Number(r.amount).toLocaleString('fr-FR')} F` },
  ],
  title: (r) => r.label, search: (r) => `${r.label} ${r.category} ${r.reference}`,
  defaults: () => ({ date: today(), type: 'Recette', category: 'Billetterie', method: 'Mobile Money' }),
  fromForm: (v, e) => ({
    ...e, id: e?.id ?? newRecordId('fin'), date: str(v.date) || today(), type: str(v.type), label: str(v.label),
    category: str(v.category), amount: num(v.amount) ?? 0, method: str(v.method), reference: str(v.reference), notes: str(v.notes),
  }),
}

export const SCHEMAS: Record<CollectionKey, CollectionSchema> = {
  articles, videos, competitions, matches, players, clubs, licences, referees, coaches, agents, officials,
  stadiums, tickets, products, academies, finances,
}

export const SCHEMA_ORDER: CollectionKey[] = [
  'articles', 'videos', 'competitions', 'matches', 'clubs', 'players', 'licences', 'referees', 'coaches',
  'agents', 'officials', 'stadiums', 'tickets', 'products', 'finances', 'academies',
]

export function isCollectionKey(v: string): v is CollectionKey {
  return v in SCHEMAS
}
