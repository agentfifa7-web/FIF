// Chargement des données du back-office pour les pages serveur.
import { cache } from 'react'
import { applyOverlay } from './apply'
import { readCms } from './store'
import type { CmsData, PublicOverlay } from './types'

/** Lit les modifications et les applique aux données du site (une fois par requête). */
export const loadCms = cache(async (): Promise<CmsData> => {
  const data = await readCms()
  applyOverlay(toPublicOverlay(data), data.private)
  return data
})

export function toPublicOverlay(data: CmsData): PublicOverlay {
  return { version: data.version, collections: data.collections, sheets: data.sheets, settings: data.settings }
}
