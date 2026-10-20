'use client'

import { useState } from 'react'
import type { Match } from '@/lib/data/types'
import { MatchdayList } from './MatchdayList'

/** Résultats ou programme d'une journée à la fois, avec sélection de la journée. */
export function MatchdayPicker({ matches, mode }: { matches: Match[]; mode: 'results' | 'fixtures' }) {
  const days = [...new Set(matches.map((m) => m.matchday))].sort((a, b) => a - b)
  const [day, setDay] = useState(mode === 'results' ? days[days.length - 1] : days[0])
  if (!days.length) return null
  return (
    <div>
      {days.length > 1 && (
        <div className="md-picker" role="group" aria-label="Choisir la journée">
          {days.map((d) => (
            <button key={d} type="button" className={d === day ? 'filter active' : 'filter'} aria-pressed={d === day} onClick={() => setDay(d)}>J{d}</button>
          ))}
        </div>
      )}
      <MatchdayList matches={matches.filter((m) => m.matchday === day)} mode={mode} />
    </div>
  )
}
