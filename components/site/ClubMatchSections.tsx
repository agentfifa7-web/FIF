'use client'

import { useMemo } from 'react'
import type { Match } from '@/lib/data/types'
import { useLiveMatches } from '@/lib/liveMatch'
import { MatchCard } from './cards'

// Les onglets Calendrier/Résultats des compétitions recalculent le statut de
// chaque match en direct (voir CompetitionTabs.tsx) : un match généré dont le
// coup d'envoi est passé bascule de "À venir" à "Terminé" au fil du temps
// réel. Cette fiche club doit faire de même pour éviter qu'un match affiché
// sous « Prochains matchs » ne se rende lui-même avec le badge « TERMINÉ ».
export function ClubMatchSections({ matches }: { matches: Match[] }) {
  const liveMap = useLiveMatches(matches)

  const upcoming = useMemo(
    () => matches
      .filter((m) => { const s = liveMap.get(m.id)?.status ?? m.status; return s === 'À venir' || s === 'Live' })
      .sort((a, b) => +new Date(a.date) - +new Date(b.date))
      .slice(0, 4),
    [matches, liveMap],
  )
  const results = useMemo(
    () => matches
      .filter((m) => (liveMap.get(m.id)?.status ?? m.status) === 'Terminé')
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
      .slice(0, 4),
    [matches, liveMap],
  )

  return (
    <>
      <section className="page-section tight">
        <div className="page-section-head"><h2 style={{ fontSize: 24 }}>Prochains matchs</h2></div>
        <div className="card-grid cols-4">
          {upcoming.length ? upcoming.map((m) => <MatchCard key={m.id} match={m} />) : <p className="lede">Aucun match programmé pour le moment.</p>}
        </div>
      </section>

      <section className="page-section tight">
        <div className="page-section-head"><h2 style={{ fontSize: 24 }}>Derniers résultats</h2></div>
        <div className="card-grid cols-4">
          {results.length ? results.map((m) => <MatchCard key={m.id} match={m} />) : <p className="lede">Aucun résultat disponible.</p>}
        </div>
      </section>
    </>
  )
}
