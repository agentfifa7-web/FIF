import type { PlayerAttributes } from './data/types'

export function attributeColor(value: number) {
  if (value >= 17) return '#04642f'
  if (value >= 14) return 'var(--green)'
  if (value >= 10) return 'var(--ink)'
  if (value >= 6) return 'var(--orange)'
  return '#c62828'
}

export function attributeTint(value: number) {
  if (value >= 17) return '#e3f2e8'
  if (value >= 14) return '#e5f4ea'
  if (value >= 10) return '#eef0ee'
  if (value >= 6) return '#fff3e6'
  return '#fdeceb'
}

export function starsArray(count: number, max = 5) {
  return Array.from({ length: max }, (_, i) => i < count)
}

export function radarAxesFor(attrs: PlayerAttributes) {
  const t = attrs.technical
  const m = attrs.mental
  const p = attrs.physical
  const avg = (vals: number[]) => vals.reduce((a, b) => a + b, 0) / vals.length
  return [
    { axis: 'Défense', value: avg([t['Tacles'], t['Marquage'], m['Anticipation'], m['Placement'], t['Un contre un']]) },
    { axis: 'Physique', value: avg([p['Endurance'], p['Puissance'], p['Équilibre'], p['Qualités phys. nat.']]) },
    { axis: 'Jeu aérien', value: avg([t['Jeu de tête'], p['Détente verticale'], t['Prise de balle aérienne']]) },
    { axis: 'Vitesse', value: avg([p['Accélération'], p['Vitesse'], p['Agilité']]) },
    { axis: 'Technique', value: avg([t['Technique'], t['Contrôle de balle'], t['Dribble'], t['Touches longues'], t['Jeu au pied']]) },
    { axis: 'Vision', value: avg([m['Vision du jeu'], t['Passes'], m['Décisions'], m['Inspiration']]) },
    { axis: 'Attaque', value: avg([t['Finition'], t['Tirs de loin'], m['Sang-froid'], m['Appels de balle']]) },
    { axis: 'Mental', value: avg([m['Collectif'], m['Détermination'], m['Concentration'], m['Courage'], m['Leadership']]) },
  ]
}

export function formatFcfa(amount: number) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}

const STATUS_FLAG_TONE: Record<string, 'error' | 'pending' | 'ok'> = {
  'Blessé': 'error',
  'Mécontent': 'pending',
  'Fin de contrat proche': 'pending',
  'Joueur clé': 'ok',
  'Espoir': 'ok',
}

export function statusFlagTone(flag: string) {
  return STATUS_FLAG_TONE[flag] ?? 'pending'
}
