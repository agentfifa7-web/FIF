import { useEffect, useState } from 'react'

// Diagnostic interactif Projet Club (démonstration, local au navigateur) :
// chaque module possède une checklist ; la progression est enregistrée par
// item coché.

export interface ProjetModule {
  key: string
  label: string
  items: string[]
}

export const PROJET_MODULES: ProjetModule[] = [
  { key: 'diagnostic', label: 'Diagnostic', items: ['État des lieux sportif réalisé', 'État des lieux administratif réalisé', 'État des lieux financier réalisé', 'Synthèse partagée avec le bureau'] },
  { key: 'gouvernance', label: 'Gouvernance', items: ['Statuts à jour', 'Bureau élu et déclaré', 'Règlement intérieur adopté', 'Commissions internes désignées'] },
  { key: 'sportif', label: 'Sportif', items: ['Projet de jeu formalisé', 'Filière de détection en place', 'Encadrement technique complet', 'Calendrier de préparation défini'] },
  { key: 'formation', label: 'Formation', items: ['Plan de formation des éducateurs', 'Plan de formation des dirigeants', 'Suivi des licences de formation', 'Partenariat FIF Academy'] },
  { key: 'finances', label: 'Finances', items: ['Budget prévisionnel voté', 'Comptabilité à jour', 'Diversification des ressources', 'Rapport financier annuel prêt'] },
  { key: 'communication', label: 'Communication', items: ['Présence sur les réseaux sociaux', 'Relation supporters structurée', 'Kit de communication du club', 'Contact presse identifié'] },
  { key: 'infrastructure', label: 'Infrastructure', items: ['État des équipements évalué', 'Plan d’entretien du stade', 'Vestiaires conformes', 'Projet d’amélioration déposé'] },
  { key: 'feminin-jeunes', label: 'Féminin & Jeunes', items: ['Section féminine active', 'Filières jeunes structurées (U15-U20)', 'Éducateurs dédiés jeunes/féminin', 'Partenariats écoles/quartiers'] },
]

type Checked = Record<string, boolean>

const STORAGE_KEY = 'fif-projet-club-v1'
export const PROJET_EVENT = 'fif-projet-club-updated'

function load(): Checked {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') } catch { return {} }
}

export function toggleItem(moduleKey: string, item: string) {
  const checked = load()
  const id = `${moduleKey}::${item}`
  checked[id] = !checked[id]
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checked))
  window.dispatchEvent(new CustomEvent(PROJET_EVENT))
}

export function moduleProgress(checked: Checked, mod: ProjetModule) {
  const done = mod.items.filter((item) => checked[`${mod.key}::${item}`]).length
  return Math.round((done / mod.items.length) * 100)
}

export function overallProgress(checked: Checked) {
  const total = PROJET_MODULES.reduce((sum, m) => sum + m.items.length, 0)
  const done = PROJET_MODULES.reduce((sum, m) => sum + m.items.filter((item) => checked[`${m.key}::${item}`]).length, 0)
  return Math.round((done / total) * 100)
}

export function useProjetClub() {
  const [checked, setChecked] = useState<Checked>({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const sync = () => { setChecked(load()); setReady(true) }
    sync()
    window.addEventListener(PROJET_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(PROJET_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return { checked, ready }
}
