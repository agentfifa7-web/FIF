'use client'

import { useEffect, useState } from 'react'
import type { Match, MatchEvent } from './data/types'

export interface LiveState {
  status: Match['status']
  minute?: number
  homeScore: number | null
  awayScore: number | null
  events: MatchEvent[]
}

// Un match « live » dure ~105 minutes en temps réel : 45 min de 1ère période,
// 15 min de pause à la mi-temps, 45 min de 2e période.
const HALF_MIN = 45
const HT_BREAK_MIN = 15
const FULL_MIN = HALF_MIN * 2 + HT_BREAK_MIN

function staticState(match: Match): LiveState {
  return { status: match.status, minute: match.minute, homeScore: match.homeScore, awayScore: match.awayScore, events: match.events }
}

/** Dérive l'état visible d'un match (score, minute, événements) à partir de
 *  son heure de coup d'envoi réelle (match.date), de son scénario
 *  pré-généré (match.liveScript) et de l'heure actuelle — sans backend. */
export function computeLiveState(match: Match, now: number): LiveState {
  const script = match.liveScript
  if (!script || !script.length) return staticState(match)

  const kickoff = new Date(match.date).getTime()
  const elapsedMin = (now - kickoff) / 60000
  if (elapsedMin < 0) return { status: 'À venir', homeScore: null, awayScore: null, events: [] }

  const finished = elapsedMin >= FULL_MIN
  let minute: number
  if (elapsedMin < HALF_MIN) minute = Math.max(1, Math.floor(elapsedMin) + 1)
  else if (elapsedMin < HALF_MIN + HT_BREAK_MIN) minute = 45
  else if (elapsedMin < FULL_MIN) minute = Math.min(90, 45 + Math.floor(elapsedMin - HALF_MIN - HT_BREAK_MIN) + 1)
  else minute = 90

  const visible = script.filter((e) => e.minute <= minute)
  const homeScore = visible.filter((e) => e.type === 'goal' && e.team === 'home').length
  const awayScore = visible.filter((e) => e.type === 'goal' && e.team === 'away').length

  return {
    status: finished ? 'Terminé' : 'Live',
    minute: finished ? undefined : minute,
    homeScore,
    awayScore,
    events: visible,
  }
}

/** État live d'un match, sûr pour l'hydratation : le rendu initial reprend
 *  exactement les valeurs statiques de la génération, l'état réel (dérivé de
 *  l'heure courante) n'est calculé qu'après le montage, côté client. */
export function useLiveMatch(match: Match): LiveState {
  const [state, setState] = useState<LiveState>(() => staticState(match))

  useEffect(() => {
    if (!match.liveScript || !match.liveScript.length) return
    const tick = () => setState(computeLiveState(match, Date.now()))
    tick()
    const interval = setInterval(tick, 20000)
    return () => clearInterval(interval)
  }, [match])

  return state
}

/** État live de plusieurs matchs à la fois (ex. tout le calendrier d'une page),
 *  pour filtrer/recompter les listes (calendrier, résultats) sans backend.
 *  Vide tant que le composant n'est pas monté, afin de rester identique au
 *  rendu statique généré au build et d'éviter toute divergence d'hydratation ;
 *  se remplit puis se rafraîchit ensuite automatiquement. */
export function useLiveMatches(matches: Match[]): Map<string, LiveState> {
  const [map, setMap] = useState<Map<string, LiveState>>(() => new Map())

  useEffect(() => {
    const tick = () => {
      const now = Date.now()
      const next = new Map<string, LiveState>()
      for (const m of matches) {
        if (!m.liveScript || !m.liveScript.length) continue
        next.set(m.id, computeLiveState(m, now))
      }
      setMap(next)
    }
    tick()
    const interval = setInterval(tick, 20000)
    return () => clearInterval(interval)
  }, [matches])

  return map
}

/** Premier match actuellement en direct parmi une liste, recalculé en temps
 *  réel côté client (aucun match n'est « Live » lors de la génération statique). */
export function useFirstLiveMatch(matches: Match[]): (Match & LiveState) | null {
  const [result, setResult] = useState<(Match & LiveState) | null>(null)

  useEffect(() => {
    const tick = () => {
      const now = Date.now()
      for (const m of matches) {
        if (!m.liveScript || !m.liveScript.length) continue
        const state = computeLiveState(m, now)
        if (state.status === 'Live') {
          setResult({ ...m, ...state })
          return
        }
      }
      setResult(null)
    }
    tick()
    const interval = setInterval(tick, 20000)
    return () => clearInterval(interval)
  }, [matches])

  return result
}
