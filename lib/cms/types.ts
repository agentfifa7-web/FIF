// Types partagés du back-office (serveur et navigateur).
import type { MatchSheetOverride } from '@/lib/matchsheet'

/** Collections affichées sur le site public. */
export const PUBLIC_COLLECTIONS = [
  'articles', 'videos', 'competitions', 'matches', 'players', 'clubs', 'referees',
  'coaches', 'agents', 'officials', 'stadiums', 'tickets', 'products', 'academies',
] as const
/** Collections réservées à l'administration (jamais envoyées au navigateur des visiteurs). */
export const PRIVATE_COLLECTIONS = ['licences', 'finances'] as const

export type PublicCollection = (typeof PUBLIC_COLLECTIONS)[number]
export type PrivateCollection = (typeof PRIVATE_COLLECTIONS)[number]
export type CollectionKey = PublicCollection | PrivateCollection

export type CmsRecord = { id: string } & Record<string, unknown>

/** Modifications d'une collection : éléments ajoutés ou modifiés, et identifiants retirés. */
export interface CollectionDoc {
  upserts: Record<string, CmsRecord>
  deleted: string[]
}

export interface SiteSettings {
  siteName: string
  tagline: string
  season: string
  contactEmail: string
  contactPhone: string
  address: string
  facebook: string
  instagram: string
  x: string
  youtube: string
  tiktok: string
  alertEnabled: boolean
  alertText: string
  alertLink: string
  ticketingOpen: boolean
  shopOpen: boolean
}

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'FIF Digital',
  tagline: 'Le football ivoirien, plus proche que jamais',
  season: '2026-2027',
  contactEmail: '',
  contactPhone: '',
  address: 'Abidjan, Côte d’Ivoire',
  facebook: '',
  instagram: '',
  x: '',
  youtube: '',
  tiktok: '',
  alertEnabled: false,
  alertText: '',
  alertLink: '',
  ticketingOpen: true,
  shopOpen: true,
}

/** Partie publique, transmise à toutes les pages. */
export interface PublicOverlay {
  version: number
  collections: Partial<Record<PublicCollection, CollectionDoc>>
  sheets: Record<string, MatchSheetOverride>
  settings: SiteSettings
}

/** Données complètes du back-office (serveur uniquement). */
export interface CmsData extends PublicOverlay {
  private: Partial<Record<PrivateCollection, CollectionDoc>>
}

export const EMPTY_CMS: CmsData = { version: 0, collections: {}, sheets: {}, settings: DEFAULT_SETTINGS, private: {} }

export function emptyDoc(): CollectionDoc {
  return { upserts: {}, deleted: [] }
}
