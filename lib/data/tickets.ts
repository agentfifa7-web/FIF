// ---------------------------------------------------------------------------
// FIF Tickets — événements mis en vente sur la billetterie officielle.
// Uniquement des matchs réels. Les tarifs ne sont renseignés que lorsqu'ils
// ont été officiellement communiqués ; sinon la vente est « bientôt ouverte ».
// ---------------------------------------------------------------------------

import { clubs } from './mock'
import { slugify } from './rng'

export type TicketTierId = 'vip' | 'centrale' | 'laterale' | 'virage'

export interface TicketTier {
  id: TicketTierId
  name: string
  price: number
  /** Description de la zone et des avantages. */
  perks: string
  /** Porte d'accès conseillée. */
  gate: string
  /** Niveau de disponibilité affiché (pas de jauge chiffrée inventée). */
  availability: 'Disponible' | 'Dernières places' | 'Complet'
}

export interface TicketSide {
  name: string
  shortName: string
  crestUrl?: string
  flag?: string
}

export interface TicketEvent {
  slug: string
  category: 'Éléphants' | 'Ligue 1'
  competition: string
  home: TicketSide
  away: TicketSide
  /** AAAA-MM-JJ ; absent si la date n'est pas encore officielle. */
  date?: string
  time?: string
  stadium: { name: string; city: string; capacity?: number }
  status: 'En vente' | 'Bientôt en vente' | 'Complet' | 'Terminé'
  tiers: TicketTier[]
  maxPerOrder: number
  gatesOpen?: string
  /** Source des informations de vente. */
  source?: { label: string; url: string }
  note?: string
  /** Lien vers la page du match sur la plateforme. */
  matchHref?: string
}

function clubSide(name: string): TicketSide {
  const club = clubs.find((c) => slugify(c.name) === slugify(name))
  return { name: club?.name ?? name, shortName: club?.shortName ?? name, crestUrl: club?.crestUrl }
}

const CIV: TicketSide = { name: 'Côte d’Ivoire', shortName: 'Éléphants', flag: '🇨🇮', crestUrl: '/fif-logo.png' }

/** 2e journée de Ligue 1 2026-2027 — affiches officielles (FIF), dates et
 *  stades non encore communiqués au moment de la mise à jour. */
const LIGUE1_J2: [string, string][] = [
  ['FC Mouna', 'Yakro FC'],
  ['ASEC Mimosas', 'Stella Club'],
  ['SOL FC', 'Stade d’Abidjan'],
  ['AFAD Plateau', 'SOA'],
  ['ES Agboville', 'OFC Adiaké'],
  ['ISCA Inova', 'Bouaké FC'],
  ['Zoman FC', 'CO Korhogo'],
  ['US Tchologo', 'FC San Pedro'],
]

export const ticketEvents: TicketEvent[] = [
  {
    slug: 'cote-divoire-cameroun-2026-10-03',
    category: 'Éléphants',
    competition: 'Match amical international — fenêtre FIFA d’octobre',
    home: CIV,
    away: { name: 'Cameroun', shortName: 'Lions Indomptables', flag: '🇨🇲' },
    date: '2026-10-03',
    time: '19:00',
    stadium: { name: 'Stade olympique Alassane-Ouattara', city: 'Ebimpé (Abidjan)', capacity: 60000 },
    status: 'Terminé',
    maxPerOrder: 6,
    gatesOpen: '15:00',
    tiers: [
      { id: 'vip', name: 'VIP', price: 50000, perks: 'Tribune présidentielle, siège rembourré, accès salon et parking réservé.', gate: 'Porte A — accès VIP', availability: 'Dernières places' },
      { id: 'centrale', name: 'Tribune centrale', price: 10000, perks: 'Vue axiale sur la pelouse, places assises numérotées.', gate: 'Porte B', availability: 'Disponible' },
      { id: 'laterale', name: 'Tribune latérale', price: 5000, perks: 'Tribune opposée, places assises numérotées.', gate: 'Porte C', availability: 'Disponible' },
      { id: 'virage', name: 'Virages (populaire)', price: 2000, perks: 'Ambiance supporters derrière les buts.', gate: 'Portes D et E', availability: 'Disponible' },
    ],
    source: { label: 'Prix des billets annoncés par la FIF (Camfoot)', url: 'https://www.camfoot.com/actualites/cote-divoire-cameroun-voici-les-prix-des-billets,557140.html' },
    note: 'Prix officiels communiqués par la FIF (2 000, 5 000, 10 000 et 50 000 F CFA). La répartition des tarifs par tribune affichée ici est indicative.',
    matchHref: '/equipes-nationales/elephants/matchs/elephants-cameroun-2026-10-03',
  },
  ...LIGUE1_J2.map(([h, a]): TicketEvent => ({
    slug: `ligue1-j2-${slugify(h)}-${slugify(a)}`,
    category: 'Ligue 1',
    competition: 'Ligue 1 — 2e journée (saison 2026-2027)',
    home: clubSide(h),
    away: clubSide(a),
    stadium: { name: 'Stade à confirmer', city: '' },
    status: 'Bientôt en vente',
    maxPerOrder: 6,
    tiers: [],
    note: 'Affiche officielle de la 2e journée. Date, stade et tarifs seront publiés par les organisateurs ; activez l’alerte pour être prévenu de l’ouverture de la vente.',
  })),
]

export function getTicketEvent(slug: string) {
  return ticketEvents.find((e) => e.slug === slug)
}
