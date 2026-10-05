// Application des modifications du back-office aux données du site.
// Les tableaux de données (lib/data/mock.ts, lib/data/tickets.ts) sont modifiés
// en place, à partir d'une copie de leur contenu d'origine : réappliquer est
// donc toujours sûr (idempotent). Utilisé côté serveur et côté navigateur.
import {
  agents, academies, articles, clubs, coaches, competitions, matches, officials, players,
  products, referees, stadiums, videos, recomputeMatchStats,
} from '@/lib/data/mock'
import { ticketEvents } from '@/lib/data/tickets'
import { finances, licences } from './private-data'
import { cmsRuntime } from './runtime'
import {
  DEFAULT_SETTINGS, PUBLIC_COLLECTIONS, PRIVATE_COLLECTIONS,
  type CmsRecord, type CollectionDoc, type CollectionKey, type PrivateCollection, type PublicOverlay,
} from './types'

/* eslint-disable @typescript-eslint/no-explicit-any */
const TARGETS: Record<CollectionKey, any[]> = {
  articles, videos, competitions, matches, players, clubs, referees, coaches, agents,
  officials, stadiums, tickets: ticketEvents, products, academies, licences, finances,
}

/** Identifiant d'un élément (les événements de billetterie sont identifiés par leur slug). */
export function recordId(collection: CollectionKey, r: any): string {
  return collection === 'tickets' ? r.id ?? r.slug : r.id
}

/** Les nouveaux éléments de ces collections apparaissent en premier. */
const PREPEND = new Set<CollectionKey>(['articles', 'videos', 'finances', 'licences'])

const clone = <T,>(v: T): T => (typeof structuredClone === 'function' ? structuredClone(v) : JSON.parse(JSON.stringify(v)))

const snapshots = new Map<CollectionKey, any[]>()

/** Contenu d'origine (dans le code) d'une collection. */
export function baseRecords(collection: CollectionKey): any[] {
  if (!snapshots.has(collection)) snapshots.set(collection, TARGETS[collection].map(clone))
  return snapshots.get(collection)!
}

export function mergeCollection(collection: CollectionKey, doc: CollectionDoc | undefined): any[] {
  const base = baseRecords(collection)
  if (!doc) return base.map(clone)
  const deleted = new Set(doc.deleted)
  const seen = new Set<string>()
  const merged = base
    .filter((r) => !deleted.has(recordId(collection, r)))
    .map((r) => {
      const id = recordId(collection, r)
      seen.add(id)
      return clone(doc.upserts[id] ?? r)
    })
  const added = Object.values(doc.upserts).filter((r) => !seen.has(r.id) && !deleted.has(r.id)).map(clone)
  return PREPEND.has(collection) ? [...added.reverse(), ...merged] : [...merged, ...added]
}

function replaceContents(target: any[], items: any[]) {
  target.splice(0, target.length, ...items)
}

let appliedPrivateVersion = -1

/** Applique la partie publique (et, côté serveur, la partie privée) des modifications. */
export function applyOverlay(overlay: PublicOverlay, privateDocs?: Partial<Record<PrivateCollection, CollectionDoc>>) {
  if (privateDocs && appliedPrivateVersion !== overlay.version) {
    for (const key of PRIVATE_COLLECTIONS) replaceContents(TARGETS[key], mergeCollection(key, privateDocs[key]))
    appliedPrivateVersion = overlay.version
  }
  if (cmsRuntime.version === overlay.version) return false
  for (const key of PUBLIC_COLLECTIONS) replaceContents(TARGETS[key], mergeCollection(key, overlay.collections[key]))
  for (const t of ticketEvents as any[]) if (!t.slug && t.id) t.slug = t.id
  cmsRuntime.sheets = overlay.sheets ?? {}
  cmsRuntime.settings = { ...DEFAULT_SETTINGS, ...(overlay.settings ?? {}) }
  recomputeDerived()
  cmsRuntime.version = overlay.version
  return true
}

function recomputeDerived() {
  // Compétitions de chaque club.
  for (const club of clubs) club.competitionIds = competitions.filter((c) => c.clubIds.includes(club.id)).map((c) => c.id)

  // Feuilles de match publiées : résultat du match.
  for (const m of matches) {
    const sheet = cmsRuntime.sheets[m.id]
    if (!sheet) continue
    m.status = 'Terminé'
    m.homeScore = sheet.homeScore
    m.awayScore = sheet.awayScore
    if (sheet.attendance) m.attendance = sheet.attendance
  }
  // Faits de match et statistiques des joueurs (résultats réels + feuilles de match).
  recomputeMatchStats(cmsRuntime.sheets)
}

export function newRecordId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

export type { CmsRecord }
