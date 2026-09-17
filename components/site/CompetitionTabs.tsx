'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Competition, Match, Player, StandingRow } from '@/lib/data/types'
import { getClubById } from '@/lib/data/mock'
import { RankingTable, Tabs } from './widgets'
import { ClubCard, MatchCard } from './cards'

const TABS = ['Présentation', 'Classement', 'Calendrier', 'Résultats', 'Buteurs', 'Clubs'] as const

export function CompetitionTabs({
  competition,
  standings,
  upcoming,
  results,
  scorers,
}: {
  competition: Competition
  standings: StandingRow[]
  upcoming: Match[]
  results: Match[]
  scorers: { player: Player; goals: number }[]
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Présentation')
  const clubs = competition.clubIds.map((id) => getClubById(id)).filter(Boolean)

  return (
    <div>
      <Tabs tabs={[...TABS]} active={tab} onChange={(t) => setTab(t as (typeof TABS)[number])} />

      {tab === 'Présentation' && (
        <div>
          <p className="lede">{competition.name} réunit {clubs.length} équipes pour la saison {competition.season}. Format : {competition.format}.</p>
          <div className="card-grid cols-4" style={{ marginTop: 24 }}>
            <div className="stat-card"><strong>{clubs.length}</strong><span>Équipes engagées</span></div>
            <div className="stat-card"><strong>{results.length}</strong><span>Matchs joués</span></div>
            <div className="stat-card"><strong>{upcoming.length}</strong><span>Matchs à venir</span></div>
            <div className="stat-card"><strong>{scorers[0]?.goals ?? 0}</strong><span>Meilleur total de buts</span></div>
          </div>
        </div>
      )}

      {tab === 'Classement' && (
        standings.length ? <RankingTable rows={standings} highlightTop={competition.category === 'Seniors' ? 1 : 0} highlightBottom={competition.category === 'Seniors' ? 3 : 0} /> : <p className="lede">Aucun résultat enregistré pour construire un classement sur cette compétition.</p>
      )}

      {tab === 'Calendrier' && (
        <div className="card-grid cols-4">
          {upcoming.length ? upcoming.map((m) => <MatchCard key={m.id} match={m} />) : <p className="lede">Aucun match à venir programmé.</p>}
        </div>
      )}

      {tab === 'Résultats' && (
        <div className="card-grid cols-4">
          {results.length ? results.map((m) => <MatchCard key={m.id} match={m} />) : <p className="lede">Aucun résultat disponible.</p>}
        </div>
      )}

      {tab === 'Buteurs' && (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>POS</th><th className="align-left">JOUEUR</th><th className="align-left">CLUB</th><th>BUTS</th></tr></thead>
            <tbody>
              {scorers.map((s, i) => {
                const club = getClubById(s.player.clubId)
                return (
                  <tr key={s.player.id}>
                    <td>{i + 1}</td>
                    <td className="align-left"><Link href={`/joueurs/${s.player.slug}`}>{s.player.name}</Link></td>
                    <td className="align-left">{club?.name}</td>
                    <td><b>{s.goals}</b></td>
                  </tr>
                )
              })}
              {!scorers.length && <tr><td colSpan={4}>Aucun but enregistré pour l’instant.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Clubs' && (
        <div className="card-grid">
          {clubs.map((c) => c && <ClubCard key={c.id} club={c} />)}
        </div>
      )}
    </div>
  )
}
