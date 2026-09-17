'use client'

import { useMemo, useState } from 'react'
import { List, Map as MapIcon } from 'lucide-react'
import type { Club } from '@/lib/data/types'
import { cities } from '@/lib/data/mock'
import { ClubCard } from './cards'
import { EmptyState, FilterSelect } from './widgets'

export function ClubExplorer({ clubs }: { clubs: Club[] }) {
  const [city, setCity] = useState('Toutes')
  const [category, setCategory] = useState('Toutes')
  const [gender, setGender] = useState('Tous')
  const [view, setView] = useState<'liste' | 'carte'>('liste')

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
          <button type="button" className={view === 'liste' ? 'tab active' : 'tab'} onClick={() => setView('liste')}><List size={14} /> Liste</button>
          <button type="button" className={view === 'carte' ? 'tab active' : 'tab'} onClick={() => setView('carte')}><MapIcon size={14} /> Carte</button>
        </div>
      </div>

      {!filtered.length && <EmptyState title="Aucun club trouvé" hint="Essayez d’élargir vos filtres." />}

      {view === 'liste' && (
        <div className="card-grid">
          {filtered.map((c) => <ClubCard key={c.id} club={c} />)}
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
