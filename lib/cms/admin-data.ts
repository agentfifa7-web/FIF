// Données préparées pour les pages du back-office (serveur uniquement).
/* eslint-disable @typescript-eslint/no-explicit-any */
import { cities, clubs, competitions, regions, stadiums } from '@/lib/data/mock'
import { baseRecords, mergeCollection, recordId } from './apply'
import { SCHEMAS, type Refs } from './schema'
import { loadCms } from './server'
import { storageMode } from './store'
import { PRIVATE_COLLECTIONS, type CmsData, type CollectionDoc, type CollectionKey, type PrivateCollection, type PublicCollection } from './types'

export function collectionDoc(cms: CmsData, collection: CollectionKey): CollectionDoc | undefined {
  return (PRIVATE_COLLECTIONS as readonly string[]).includes(collection)
    ? cms.private[collection as PrivateCollection]
    : cms.collections[collection as PublicCollection]
}

export function buildRefs(): Refs {
  const byLabel = (a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label, 'fr')
  return {
    clubs: clubs.map((c) => ({ value: c.id, label: c.name })).sort(byLabel),
    competitions: competitions.map((c) => ({ value: c.id, label: `${c.name} (${c.season})` })),
    stadiums: stadiums.map((s) => ({ value: s.id, label: s.name })).sort(byLabel),
    cities: cities.map((c) => ({ value: c.id, label: c.name })),
    regions: regions.map((r) => ({ value: r.id, label: r.name })),
  }
}

function withTitle(collection: CollectionKey, r: any) {
  if (collection !== 'matches') return r
  const home = clubs.find((c) => c.id === r.homeClubId)?.name ?? '?'
  const away = clubs.find((c) => c.id === r.awayClubId)?.name ?? '?'
  return { ...r, __title: `${home} vs ${away}` }
}

export async function getAdminCollection(collection: CollectionKey) {
  const cms = await loadCms()
  const doc = collectionDoc(cms, collection)
  const schema = SCHEMAS[collection]
  const base = baseRecords(collection)
  const baseIds = new Set(base.map((r) => recordId(collection, r)))
  const records = mergeCollection(collection, doc).map((r) => {
    const id = recordId(collection, r)
    return { ...withTitle(collection, r), id, __new: !baseIds.has(id) }
  })
  const deletedSet = new Set(doc?.deleted ?? [])
  return {
    records,
    refs: buildRefs(),
    deleted: base.filter((r) => deletedSet.has(recordId(collection, r))).map((r) => ({ id: recordId(collection, r), title: schema.title(withTitle(collection, r)) || recordId(collection, r) })),
    edited: Object.keys(doc?.upserts ?? {}).filter((id) => baseIds.has(id)),
    storage: storageMode(),
  }
}
