'use client'

import { useMemo, useState } from 'react'
import type { Match } from '@/lib/data/types'
import { competitions } from '@/lib/data/mock'
import { formatDate } from '@/lib/format'
import { EmptyState, FilterSelect } from './widgets'
import { MatchCard } from './cards'

export function MatchExplorer({ matches, mode }: { matches: Match[]; mode: 'calendrier' | 'resultats' }) {
  const [competition, setCompetition] = useState('Toutes')
  const [category, setCategory] = useState('Toutes')

  const categories = ['Toutes', ...Array.from(new Set(competitions.map((c) => c.category)))]
  const competitionOptions = ['Toutes', ...competitions.filter((c) => category === 'Toutes' || c.category === category).map((c) => c.name)]

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      const comp = competitions.find((c) => c.id === m.competitionId)
      if (!comp) return false
      if (category !== 'Toutes' && comp.category !== category) return false
      if (competition !== 'Toutes' && comp.name !== competition) return false
      return true
    })
  }, [matches, category, competition])

  const grouped = useMemo(() => {
    const map = new Map<string, Match[]>()
    for (const m of filtered) {
      const key = formatDate(m.date, { weekday: 'long', day: 'numeric', month: 'long' })
      map.set(key, [...(map.get(key) ?? []), m])
    }
    return [...map.entries()]
  }, [filtered])

  return (
    <div>
      <div className="filter-bar">
        <FilterSelect label="Catégorie" value={category} options={categories} onChange={(v) => { setCategory(v); setCompetition('Toutes') }} />
        <FilterSelect label="Compétition" value={competition} options={competitionOptions} onChange={setCompetition} />
      </div>
      {grouped.length === 0 && <EmptyState title={mode === 'calendrier' ? 'Aucun match à venir' : 'Aucun résultat'} hint="Essayez un autre filtre de compétition." />}
      {grouped.map(([day, list]) => (
        <div key={day} style={{ marginBottom: 32 }}>
          <p className="section-tag" style={{ textTransform: 'capitalize', marginBottom: 14 }}>{day}</p>
          <div className="card-grid cols-4">
            {list.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        </div>
      ))}
    </div>
  )
}
