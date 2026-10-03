// Stockage serveur du back-office.
// - Base Upstash Redis (Vercel → Storage → Upstash for Redis) si les variables
//   KV_REST_API_URL / KV_REST_API_TOKEN (ou UPSTASH_REDIS_REST_URL / _TOKEN)
//   sont définies : les modifications sont partagées par tous les visiteurs.
// - Sinon, fichier local .data/cms.json (développement, hébergement classique).
//   Sur Vercel sans base, l'enregistrement est refusé (disque en lecture seule).
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { EMPTY_CMS, type CmsData } from './types'

const DATA_KEY = 'fif:cms:data:v1'
const IMAGE_PREFIX = 'fif:cms:img:'
const LOCAL_DIR = path.join(process.cwd(), '.data')
const LOCAL_FILE = path.join(LOCAL_DIR, 'cms.json')

function redisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  return url && token ? { url: url.replace(/\/$/, ''), token } : null
}

export type StorageMode = 'redis' | 'file' | 'unavailable'

export function storageMode(): StorageMode {
  if (redisConfig()) return 'redis'
  return process.env.VERCEL ? 'unavailable' : 'file'
}

async function redis(command: (string | number)[]) {
  const cfg = redisConfig()!
  const res = await fetch(cfg.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  })
  if (!res.ok) throw new Error(`Base de données indisponible (${res.status})`)
  const json = (await res.json()) as { result?: unknown; error?: string }
  if (json.error) throw new Error(json.error)
  return json.result
}

function normalize(raw: unknown): CmsData {
  if (!raw || typeof raw !== 'object') return structuredClone(EMPTY_CMS)
  const d = raw as Partial<CmsData>
  return {
    version: d.version ?? 0,
    collections: d.collections ?? {},
    sheets: d.sheets ?? {},
    settings: { ...EMPTY_CMS.settings, ...(d.settings ?? {}) },
    private: d.private ?? {},
  }
}

export async function readCms(): Promise<CmsData> {
  try {
    const mode = storageMode()
    if (mode === 'redis') {
      const value = await redis(['GET', DATA_KEY])
      return normalize(typeof value === 'string' ? JSON.parse(value) : null)
    }
    if (mode === 'file') {
      const text = await fs.readFile(LOCAL_FILE, 'utf8').catch(() => '')
      return normalize(text ? JSON.parse(text) : null)
    }
  } catch (e) {
    console.error('[cms] lecture impossible', e)
  }
  return structuredClone(EMPTY_CMS)
}

export class StorageUnavailableError extends Error {}

/** Lit, modifie puis enregistre les données ; incrémente la version. */
export async function updateCms(mutate: (data: CmsData) => void): Promise<CmsData> {
  const mode = storageMode()
  if (mode === 'unavailable') throw new StorageUnavailableError('Aucune base de données n’est connectée : connectez Upstash Redis au projet Vercel pour enregistrer les modifications.')
  const data = await readCms()
  mutate(data)
  data.version = Math.max(data.version + 1, Date.now())
  const text = JSON.stringify(data)
  if (mode === 'redis') await redis(['SET', DATA_KEY, text])
  else {
    await fs.mkdir(LOCAL_DIR, { recursive: true })
    await fs.writeFile(LOCAL_FILE, text)
  }
  return data
}

// --- Images envoyées depuis le back-office ---------------------------------
export async function saveImage(id: string, contentType: string, base64: string) {
  const mode = storageMode()
  if (mode === 'unavailable') throw new StorageUnavailableError('Aucune base de données n’est connectée.')
  const value = JSON.stringify({ contentType, base64 })
  if (mode === 'redis') await redis(['SET', IMAGE_PREFIX + id, value])
  else {
    await fs.mkdir(path.join(LOCAL_DIR, 'images'), { recursive: true })
    await fs.writeFile(path.join(LOCAL_DIR, 'images', `${id}.json`), value)
  }
}

export async function readImage(id: string): Promise<{ contentType: string; data: Buffer } | null> {
  if (!/^[a-z0-9-]+$/i.test(id)) return null
  try {
    const mode = storageMode()
    let raw: string | null = null
    if (mode === 'redis') raw = (await redis(['GET', IMAGE_PREFIX + id])) as string | null
    else if (mode === 'file') raw = await fs.readFile(path.join(LOCAL_DIR, 'images', `${id}.json`), 'utf8').catch(() => null)
    if (!raw) return null
    const { contentType, base64 } = JSON.parse(raw) as { contentType: string; base64: string }
    return { contentType, data: Buffer.from(base64, 'base64') }
  } catch {
    return null
  }
}
