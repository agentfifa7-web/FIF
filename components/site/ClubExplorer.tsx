'use client'

import { useMemo, useState } from 'react'
import { List, Map as MapIcon } from 'lucide-react'
import type { Club } from '@/lib/data/types'
import { cities, competitions } from '@/lib/data/mock'
import { ClubCard } from './cards'
import { EmptyState, FilterSelect } from './widgets'

const LEAGUE_PRIORITY = ['comp-l1', 'comp-l2', 'comp-fem', 'comp-u20', 'comp-futsal', 'comp-beach']
const LEAGUE_LABEL_OVERRIDE: Record<string, string> = {
  'comp-u20': 'Football des jeunes — U20 / U17',
}

function primaryLeagueId(club: Club) {
  for (const id of LEAGUE_PRIORITY) {
    if (club.competitionIds.includes(id)) return id
  }
  return 'autre'
}

export function ClubExplorer({ clubs }: { clubs: Club[] }) {
  const [city, setCity] = useState('Toutes')
  const [category, setCategory] = useState('Toutes')
  const [gender, setGender] = useState('Tous')
  const [view, setView] = useState<'ligue' | 'carte'>('ligue')

  const categories = ['Toutes', ...Array.from(new Set(clubs.map((c) => c.category)))]
  const cityOptions = ['Toutes', ...cities.map((c) => c.name)]

  const filtered = useMemo(() => {
    return clubs.filter((c) => {
      const cityName = cities.find((ci) => ci.id === c.cityId)?.name
      if (city !== 'Toutes' && cityName !== city) return false
      if (category !== 'Toutes' && c.category !== category) return false
      if (gender !== 'Tous' && c.gender !== gender) return false
      return true
    })
  }, [clubs, city, category, gender])

  const byLeague = useMemo(() => {
    const map = new Map<string, Club[]>()
    for (const c of filtered) {
      const id = primaryLeagueId(c)
      map.set(id, [...(map.get(id) ?? []), c])
    }
    const ordered = [...LEAGUE_PRIORITY, 'autre']
      .filter((id) => map.has(id))
      .map((id) => {
        const label = LEAGUE_LABEL_OVERRIDE[id] ?? competitions.find((comp) => comp.id === id)?.name ?? 'Autres clubs'
        return { id, label, clubs: map.get(id)! }
      })
    return ordered
  }, [filtered])

  const byCity = useMemo(() => {
    const map = new Map<string, Club[]>()
    for (const c of filtered) {
      const name = cities.find((ci) => ci.id === c.cityId)?.name ?? 'Autre'
      map.set(name, [...(map.get(name) ?? []), c])
    }
    return [...map.entries()].sort((a, b) => b[1].length - a[1].length)
  }, [filtered])

  return (
    <div>
      <div className="filter-bar">
        <FilterSelect label="Ville" value={city} options={cityOptions} onChange={setCity} />
        <FilterSelect label="Catégorie" value={category} options={categories} onChange={setCategory} />
        <FilterSelect label="Genre" value={gender} options={['Tous', 'M', 'F']} onChange={setGender} />
        <div className="tab-bar" style={{ borderBottom: 0, marginBottom: 0 }}>
          <button type="button" className={view === 'ligue' ? 'tab active' : 'tab'} onClick={() => setView('ligue')}><List size={14} /> Par ligue</button>
          <button type="button" className={view === 'carte' ? 'tab active' : 'tab'} onClick={() => setView('carte')}><MapIcon size={14} /> Carte</button>
        </div>
      </div>

      {!filtered.length && <EmptyState title="Aucun club trouvé" hint="Essayez d’élargir vos filtres." />}

      {view === 'ligue' && (
        <div>
          {byLeague.map((group) => (
            <div key={group.id} style={{ marginBottom: 32 }}>
              <p className="section-tag">{group.label} · {group.clubs.length} club{group.clubs.length > 1 ? 's' : ''}</p>
              <div className="card-grid" style={{ marginTop: 12 }}>
                {group.clubs.map((c) => <ClubCard key={c.id} club={c} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'carte' && (
        <div>
          <p className="lede" style={{ marginBottom: 20 }}>Carte du football ivoirien — regroupement par ville (aperçu schématique, géolocalisation précise à venir).</p>
          {byCity.map(([cityName, list]) => (
            <div key={cityName} style={{ marginBottom: 24 }}>
              <p className="section-tag">{cityName} · {list.length} club{list.length > 1 ? 's' : ''}</p>
              <div className="card-grid" style={{ marginTop: 12 }}>
                {list.map((c) => <ClubCard key={c.id} club={c} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
