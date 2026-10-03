'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/admin-auth'
import { baseRecords, mergeCollection, recordId } from '@/lib/cms/apply'
import { isCollectionKey, missingFields, SCHEMAS, type FormValues } from '@/lib/cms/schema'
import { loadCms } from '@/lib/cms/server'
import { saveImage, StorageUnavailableError, updateCms } from '@/lib/cms/store'
import { DEFAULT_SETTINGS, PRIVATE_COLLECTIONS, emptyDoc, type CmsData, type CollectionDoc, type CollectionKey, type PrivateCollection, type PublicCollection, type SiteSettings } from '@/lib/cms/types'
import type { MatchSheetOverride } from '@/lib/matchsheet'

export interface ActionResult { ok?: boolean; error?: string; id?: string; url?: string }

async function requireAdmin() {
  const session = verifyAdminSession((await cookies()).get(ADMIN_COOKIE)?.value)
  if (!session) throw new Error('Session administrateur expirée : reconnectez-vous.')
  return session
}

function docOf(data: CmsData, collection: CollectionKey): CollectionDoc {
  if ((PRIVATE_COLLECTIONS as readonly string[]).includes(collection)) {
    const key = collection as PrivateCollection
    return (data.private[key] ??= emptyDoc())
  }
  const key = collection as PublicCollection
  return (data.collections[key] ??= emptyDoc())
}

function failure(e: unknown): ActionResult {
  if (e instanceof StorageUnavailableError) return { error: e.message }
  return { error: e instanceof Error ? e.message : 'Enregistrement impossible.' }
}

function done() {
  revalidatePath('/', 'layout')
}

/** Ajoute ou modifie un élément d'un module. */
export async function saveRecordAction(collection: string, values: FormValues, id?: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    if (!isCollectionKey(collection)) return { error: 'Module inconnu.' }
    const schema = SCHEMAS[collection]
    const missing = missingFields(schema, values)
    if (missing.length) return { error: `Champs obligatoires : ${missing.join(', ')}.` }
    if (collection === 'matches' && values.homeClubId === values.awayClubId) return { error: 'Les deux équipes doivent être différentes.' }
    const cms = await loadCms()
    const current = id ? mergeCollection(collection, docOf(structuredClone(cms), collection)).find((r) => recordId(collection, r) === id) : undefined
    if (id && !current) return { error: 'Élément introuvable (il a peut-être été supprimé).' }
    const record = schema.fromForm(values, current)
    for (const k of Object.keys(record)) if (k.startsWith('__')) delete (record as Record<string, unknown>)[k]
    const recId = recordId(collection, record)
    await updateCms((data) => {
      const doc = docOf(data, collection)
      doc.upserts[recId] = record
      doc.deleted = doc.deleted.filter((d) => d !== recId)
    })
    done()
    return { ok: true, id: recId }
  } catch (e) {
    return failure(e)
  }
}

/** Retire un ou plusieurs éléments. */
export async function deleteRecordsAction(collection: string, ids: string[]): Promise<ActionResult> {
  try {
    await requireAdmin()
    if (!isCollectionKey(collection)) return { error: 'Module inconnu.' }
    await loadCms()
    const baseIds = new Set(baseRecords(collection).map((r) => recordId(collection, r)))
    await updateCms((data) => {
      const doc = docOf(data, collection)
      for (const id of ids) {
        delete doc.upserts[id]
        if (baseIds.has(id) && !doc.deleted.includes(id)) doc.deleted.push(id)
      }
    })
    done()
    return { ok: true }
  } catch (e) {
    return failure(e)
  }
}

/** Remet un élément d'origine supprimé ou modifié dans son état initial. */
export async function restoreRecordAction(collection: string, id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    if (!isCollectionKey(collection)) return { error: 'Module inconnu.' }
    await updateCms((data) => {
      const doc = docOf(data, collection)
      doc.deleted = doc.deleted.filter((d) => d !== id)
      delete doc.upserts[id]
    })
    done()
    return { ok: true }
  } catch (e) {
    return failure(e)
  }
}

export async function saveSettingsAction(values: Partial<SiteSettings>): Promise<ActionResult> {
  try {
    await requireAdmin()
    const clean: SiteSettings = { ...DEFAULT_SETTINGS }
    for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof SiteSettings)[]) {
      const v = values[key]
      if (typeof DEFAULT_SETTINGS[key] === 'boolean') (clean as unknown as Record<string, unknown>)[key] = Boolean(v)
      else (clean as unknown as Record<string, unknown>)[key] = String(v ?? '').trim()
    }
    await updateCms((data) => { data.settings = clean })
    done()
    return { ok: true }
  } catch (e) {
    return failure(e)
  }
}

export async function saveMatchSheetAction(sheet: MatchSheetOverride): Promise<ActionResult> {
  try {
    const session = await requireAdmin()
    const clean: MatchSheetOverride = { ...sheet, submittedBy: `Administrateur FIF (${session.phone})`, submittedAt: new Date().toISOString() }
    await updateCms((data) => { data.sheets[sheet.matchId] = clean })
    done()
    return { ok: true }
  } catch (e) {
    return failure(e)
  }
}

export async function deleteMatchSheetAction(matchId: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    await updateCms((data) => { delete data.sheets[matchId] })
    done()
    return { ok: true }
  } catch (e) {
    return failure(e)
  }
}

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

/** Enregistre une image (déjà compressée dans le navigateur) et renvoie son adresse. */
export async function uploadImageAction(dataUrl: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    const m = dataUrl.match(/^data:([\w/+.-]+);base64,(.+)$/)
    if (!m || !IMAGE_TYPES.includes(m[1])) return { error: 'Format d’image non pris en charge (JPEG, PNG, WebP ou GIF).' }
    if (m[2].length > 1_400_000) return { error: 'Image trop lourde (1 Mo maximum après compression).' }
    const id = `img-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
    await saveImage(id, m[1], m[2])
    return { ok: true, url: `/api/cms/image/${id}` }
  } catch (e) {
    return failure(e)
  }
}
