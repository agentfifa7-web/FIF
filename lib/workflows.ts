import { useEffect, useState } from 'react'

// Moteur générique de suivi de dossiers (licences, transferts, aides &
// projets) — démonstration locale au navigateur : aucun compte serveur,
// aucun paiement réel. Même schéma que lib/fan.ts et lib/matchsheet.ts
// (localStorage + événement custom pour les mises à jour réactives).

export const LICENCE_STAGES = ['Création du dossier', 'Soumission', 'Contrôle FIF', 'Validation', 'Paiement', 'Émission', 'Renouvellement'] as const
export type LicenceStage = (typeof LICENCE_STAGES)[number]

export const TRANSFERT_STAGES = ['Demande', 'Contrat', 'Documents', 'Validation club vendeur', 'Validation club acheteur', 'Validation FIF', 'Statut mis à jour'] as const
export type TransfertStage = (typeof TRANSFERT_STAGES)[number]

export const AIDE_STAGES = ['Brouillon', 'Soumis', 'En instruction', 'Approuvé', 'Payé'] as const
export type AideStage = (typeof AIDE_STAGES)[number] | 'Rejeté'

export const EXAMEN_STAGES = ['Inscription', 'Formation initiale', 'Examen théorique', 'Examen pratique', 'Résultat'] as const
export type ExamenStage = (typeof EXAMEN_STAGES)[number]

export interface LicenceDossier {
  id: string
  acteur: string
  nom: string
  stage: LicenceStage
  createdAt: string
  updatedAt: string
}

export interface TransfertDossier {
  id: string
  joueur: string
  clubVendeur: string
  clubAcheteur: string
  stage: TransfertStage
  createdAt: string
  updatedAt: string
}

export interface AideDossier {
  id: string
  programme: string
  club: string
  stage: AideStage
  createdAt: string
  updatedAt: string
}

export interface ExamenDossier {
  id: string
  candidat: string
  categorie: string
  stage: ExamenStage
  createdAt: string
  updatedAt: string
}

interface Store {
  licence: LicenceDossier[]
  transfert: TransfertDossier[]
  aide: AideDossier[]
  examen: ExamenDossier[]
}

const STORAGE_KEY = 'fif-dossiers-v1'
export const WORKFLOW_EVENT = 'fif-workflow-updated'

function emptyStore(): Store {
  return { licence: [], transfert: [], aide: [], examen: [] }
}

function load(): Store {
  if (typeof window === 'undefined') return emptyStore()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? { ...emptyStore(), ...JSON.parse(raw) } : emptyStore()
  } catch {
    return emptyStore()
  }
}

function save(store: Store) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  window.dispatchEvent(new CustomEvent(WORKFLOW_EVENT))
}

export function getLicenceDossiers(): LicenceDossier[] { return load().licence }
export function getTransfertDossiers(): TransfertDossier[] { return load().transfert }
export function getAideDossiers(): AideDossier[] { return load().aide }
export function getExamenDossiers(): ExamenDossier[] { return load().examen }

export function submitLicence(acteur: string, nom: string): LicenceDossier {
  const store = load()
  const now = new Date().toISOString()
  const dossier: LicenceDossier = { id: `lic-${Date.now()}`, acteur, nom, stage: 'Soumission', createdAt: now, updatedAt: now }
  store.licence = [dossier, ...store.licence]
  save(store)
  return dossier
}

export function submitTransfert(joueur: string, clubVendeur: string, clubAcheteur: string): TransfertDossier {
  const store = load()
  const now = new Date().toISOString()
  const dossier: TransfertDossier = { id: `trf-${Date.now()}`, joueur, clubVendeur, clubAcheteur, stage: 'Demande', createdAt: now, updatedAt: now }
  store.transfert = [dossier, ...store.transfert]
  save(store)
  return dossier
}

export function submitAide(programme: string, club: string): AideDossier {
  const store = load()
  const now = new Date().toISOString()
  const dossier: AideDossier = { id: `aid-${Date.now()}`, programme, club, stage: 'Soumis', createdAt: now, updatedAt: now }
  store.aide = [dossier, ...store.aide]
  save(store)
  return dossier
}

export function submitExamen(candidat: string, categorie: string): ExamenDossier {
  const store = load()
  const now = new Date().toISOString()
  const dossier: ExamenDossier = { id: `exa-${Date.now()}`, candidat, categorie, stage: 'Inscription', createdAt: now, updatedAt: now }
  store.examen = [dossier, ...store.examen]
  save(store)
  return dossier
}

export function advanceExamen(id: string) {
  const store = load()
  const d = store.examen.find((x) => x.id === id)
  if (!d) return
  const idx = EXAMEN_STAGES.indexOf(d.stage)
  if (idx < EXAMEN_STAGES.length - 1) {
    d.stage = EXAMEN_STAGES[idx + 1]
    d.updatedAt = new Date().toISOString()
    save(store)
  }
}

export function advanceLicence(id: string) {
  const store = load()
  const d = store.licence.find((x) => x.id === id)
  if (!d) return
  const idx = LICENCE_STAGES.indexOf(d.stage)
  if (idx < LICENCE_STAGES.length - 1) {
    d.stage = LICENCE_STAGES[idx + 1]
    d.updatedAt = new Date().toISOString()
    save(store)
  }
}

export function advanceTransfert(id: string) {
  const store = load()
  const d = store.transfert.find((x) => x.id === id)
  if (!d) return
  const idx = TRANSFERT_STAGES.indexOf(d.stage)
  if (idx < TRANSFERT_STAGES.length - 1) {
    d.stage = TRANSFERT_STAGES[idx + 1]
    d.updatedAt = new Date().toISOString()
    save(store)
  }
}

export function advanceAide(id: string, outcome?: 'approve' | 'reject') {
  const store = load()
  const d = store.aide.find((x) => x.id === id)
  if (!d) return
  if (d.stage === 'En instruction' && outcome) {
    d.stage = outcome === 'approve' ? 'Approuvé' : 'Rejeté'
  } else {
    const idx = AIDE_STAGES.indexOf(d.stage as (typeof AIDE_STAGES)[number])
    if (idx >= 0 && idx < AIDE_STAGES.length - 1) d.stage = AIDE_STAGES[idx + 1]
  }
  d.updatedAt = new Date().toISOString()
  save(store)
}

export function useDossiers() {
  const [store, setStore] = useState<Store>(emptyStore())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const sync = () => { setStore(load()); setReady(true) }
    sync()
    window.addEventListener(WORKFLOW_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(WORKFLOW_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return { ...store, ready }
}
