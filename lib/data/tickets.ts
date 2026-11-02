// ---------------------------------------------------------------------------
// FIF Tickets — événements mis en vente sur la billetterie officielle.
// Uniquement des matchs réels. Les tarifs ne sont renseignés que lorsqu'ils
// ont été officiellement communiqués ; sinon la vente est « bientôt ouverte ».
// ---------------------------------------------------------------------------

import { clubs, realLigue1UpcomingFixtures } from './mock'
import { slugify } from './rng'

export type TicketTierId = 'vvip' | 'vip' | 'centrale' | 'laterale' | 'virage'

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
const LIGUE1_J2 = realLigue1UpcomingFixtures

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
  {
    slug: 'cote-divoire-gambie-2026-11-12',
    category: 'Éléphants',
    competition: 'Éliminatoires CAN 2027 — 3e journée, groupe C',
    home: CIV,
    away: { name: 'Gambie', shortName: 'Scorpions', flag: '🇬🇲' },
    date: '2026-11-12',
    time: '19:00',
    stadium: { name: 'Stade de la Paix', city: 'Bouaké', capacity: 40000 },
    // Vente du jeudi 5 au mercredi 11 novembre 2026 (FIF).
    status: Date.now() > new Date('2026-11-12T23:59:00Z').getTime() ? 'Terminé' : Date.now() >= new Date('2026-11-05T00:00:00Z').getTime() ? 'En vente' : 'Bientôt en vente',
    maxPerOrder: 6,
    gatesOpen: '13:00',
    tiers: [
      { id: 'vvip', name: 'VVIP', price: 150000, perks: 'Catégorie officielle VVIP.', gate: 'Indiquée sur le billet', availability: 'Disponible' },
      { id: 'vip', name: 'VIP', price: 100000, perks: 'Catégorie officielle VIP.', gate: 'Indiquée sur le billet', availability: 'Disponible' },
      { id: 'centrale', name: 'Catégorie 1', price: 10000, perks: 'Catégorie officielle 1.', gate: 'Indiquée sur le billet', availability: 'Disponible' },
      { id: 'laterale', name: 'Catégorie 2', price: 5000, perks: 'Catégorie officielle 2.', gate: 'Indiquée sur le billet', availability: 'Disponible' },
      { id: 'virage', name: 'Catégorie 3', price: 3000, perks: 'Catégorie officielle 3.', gate: 'Indiquée sur le billet', availability: 'Disponible' },
    ],
    source: { label: 'Prix des billets et points de vente annoncés par la FIF (ami-sportif.com)', url: 'https://www.ami-sportif.com/2026/11/02/cote-divoire-gambie-les-prix-des-billets-et-les-points-de-vente-devoiles-pour-les-eliminatoires-de-la-can-2027/' },
    note: 'Tarifs officiels FIF : VVIP 150 000, VIP 100 000, catégorie 1 10 000, catégorie 2 5 000 et catégorie 3 3 000 F CFA. Vente du jeudi 5 au mercredi 11 novembre 2026 dans les points de vente d’Abidjan (Cocody, Treichville, Koumassi, Abobo, Yopougon), de Bouaké et de Yamoussoukro ; ouverture des portes à 13 h. La position des catégories sur le plan du stade est indicative.',
    matchHref: '/equipes-nationales/elephants/matchs/elephants-gambie-2026-11-12',
  },
  ...LIGUE1_J2.map(({ homeClub: h, awayClub: a, date, time, venue, postponed, note, matchday }): TicketEvent => ({
    slug: `ligue1-j${matchday}-${slugify(h)}-${slugify(a)}`,
    date,
    time,
    category: 'Ligue 1',
    competition: `Ligue 1 — ${matchday}e journée (saison 2026-2027)`,
    home: clubSide(h),
    away: clubSide(a),
    stadium: { name: venue ?? 'Stade à confirmer', city: '' },
    // Date passée (match joué, score en attente) : la vente est close.
    status: date && Date.now() > new Date(`${date}T23:59:00Z`).getTime() ? 'Terminé' : 'Bientôt en vente',
    maxPerOrder: 6,
    tiers: [],
    note: postponed && note
      ? `${note} La billetterie ouvrira dès l’annonce de la nouvelle date.`
      : `Affiche officielle de la ${matchday}e journée. Date, stade et tarifs seront publiés par les organisateurs ; activez l’alerte pour être prévenu de l’ouverture de la vente.`,
  })),
]

export function getTicketEvent(slug: string) {
  return ticketEvents.find((e) => e.slug === slug)
}
