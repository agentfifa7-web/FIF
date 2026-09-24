'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Competition, Match, Player, Referee, StandingRow } from '@/lib/data/types'
import { getClubById } from '@/lib/data/mock'
import { useLiveMatches } from '@/lib/liveMatch'
import { RankingTable, Tabs } from './widgets'
import { ClubCard, MatchCard } from './cards'
import { PersonPortrait } from './PersonPortrait'

const TABS = ['Présentation', 'Classement', 'Calendrier', 'Résultats', 'Buteurs', 'Passeurs', 'Statistiques', 'Clubs', 'Joueurs', 'Arbitres'] as const

// Le calendrier et les résultats sont recalculés ici en direct à partir de
// l'heure réelle (allMatches contient tous les matchs de la compétition) :
// un match dont le coup d'envoi est passé bascule automatiquement de l'un à
// l'autre. Classement, buteurs, passeurs et statistiques restent en revanche
// figés à la génération du site (ou à la prochaine feuille de match validée
// côté Portail Clubs) : les recalculer en direct nécessiterait de dupliquer
// ici toute la logique de classement/agrégation côté serveur.
export function CompetitionTabs({
  competition,
  standings,
  poules,
  scorers,
  assisters,
  officiatingReferees,
  compPlayers,
  allMatches,
}: {
  competition: Competition
  standings: StandingRow[]
  poules?: { label: string; standings: StandingRow[]; clubIds: string[] }[]
  scorers: { player: Player; goals: number }[]
  assisters: { player: Player; assists: number }[]
  officiatingReferees: { referee: Referee; count: number }[]
  compPlayers: Player[]
  allMatches: Match[]
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Présentation')
  const clubs = competition.clubIds.map((id) => getClubById(id)).filter(Boolean)
  const liveMap = useLiveMatches(allMatches)

  const upcoming = useMemo(
    () => allMatches
      .filter((m) => { const s = liveMap.get(m.id)?.status ?? m.status; return s === 'À venir' || s === 'Live' })
      .sort((a, b) => +new Date(a.date) - +new Date(b.date)),
    [allMatches, liveMap],
  )
  const results = useMemo(
    () => allMatches
      .filter((m) => (liveMap.get(m.id)?.status ?? m.status) === 'Terminé')
      .sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [allMatches, liveMap],
  )

  return (
    <div>
      <Tabs tabs={[...TABS]} active={tab} onChange={(t) => setTab(t as (typeof TABS)[number])} />

      {tab === 'Présentation' && (
        <div>
          <p className="lede">{competition.name} réunit {clubs.length} équipes pour la saison {competition.season}. Format : {competition.format}.{poules ? ` Chaque club affronte les 13 autres clubs de sa poule à domicile et à l’extérieur.` : ''}</p>
          <div className="card-grid cols-4" style={{ marginTop: 24 }}>
            <div className="stat-card"><strong>{clubs.length}</strong><span>Équipes engagées</span></div>
            <div className="stat-card"><strong>{results.length}</strong><span>Matchs joués</span></div>
            <div className="stat-card"><strong>{upcoming.length}</strong><span>Matchs à venir</span></div>
            <div className="stat-card"><strong>{scorers[0]?.goals ?? 0}</strong><span>Meilleur total de buts</span></div>
          </div>
        </div>
      )}

      {tab === 'Classement' && (
        poules ? (
          <div className="card-grid cols-2" style={{ alignItems: 'start' }}>
            {poules.map((p) => (
              <div key={p.label}>
                <p className="section-tag">{p.label}</p>
                {p.standings.length ? (
                  <div style={{ marginTop: 12 }}><RankingTable rows={p.standings} highlightTop={1} highlightBottom={3} /></div>
                ) : (
                  <p className="lede">Aucun résultat enregistré pour construire un classement sur cette poule.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          standings.length ? <RankingTable rows={standings} highlightTop={competition.category === 'Seniors' ? 1 : 0} highlightBottom={competition.category === 'Seniors' ? 3 : 0} /> : <p className="lede">Aucun résultat enregistré pour construire un classement sur cette compétition.</p>
        )
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

      {tab === 'Passeurs' && (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>POS</th><th className="align-left">JOUEUR</th><th className="align-left">CLUB</th><th>PASSES D.</th></tr></thead>
            <tbody>
              {assisters.map((s, i) => {
                const club = getClubById(s.player.clubId)
                return (
                  <tr key={s.player.id}>
                    <td>{i + 1}</td>
                    <td className="align-left"><Link href={`/joueurs/${s.player.slug}`}>{s.player.name}</Link></td>
                    <td className="align-left">{club?.name}</td>
                    <td><b>{s.assists}</b></td>
                  </tr>
                )
              })}
              {!assisters.length && <tr><td colSpan={4}>Aucune passe décisive enregistrée pour l’instant.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Statistiques' && (() => {
        const played = allMatches
          .filter((m) => (liveMap.get(m.id)?.status ?? m.status) === 'Terminé')
          .map((m) => { const live = liveMap.get(m.id); return live ? { ...m, homeScore: live.homeScore, awayScore: live.awayScore, events: live.events } : m })
        const goals = played.reduce((sum, m) => sum + (m.homeScore ?? 0) + (m.awayScore ?? 0), 0)
        const yellows = played.reduce((sum, m) => sum + m.events.filter((e) => e.type === 'yellow').length, 0)
        const reds = played.reduce((sum, m) => sum + m.events.filter((e) => e.type === 'red').length, 0)
        const attendances = played.map((m) => m.attendance ?? 0).filter((a) => a > 0)
        const avgAttendance = attendances.length ? Math.round(attendances.reduce((a, b) => a + b, 0) / attendances.length) : 0
        return (
          <div className="card-grid cols-4">
            <div className="stat-card"><strong>{goals}</strong><span>Buts marqués</span></div>
            <div className="stat-card"><strong>{played.length ? (goals / played.length).toFixed(2) : '0'}</strong><span>Buts / match</span></div>
            <div className="stat-card"><strong>{yellows}</strong><span>Cartons jaunes</span></div>
            <div className="stat-card"><strong>{reds}</strong><span>Cartons rouges</span></div>
            <div className="stat-card"><strong>{avgAttendance.toLocaleString('fr-FR')}</strong><span>Affluence moyenne</span></div>
            <div className="stat-card"><strong>{played.length}</strong><span>Matchs disputés</span></div>
          </div>
        )
      })()}

      {tab === 'Clubs' && (
        poules ? (
          <div>
            {poules.map((p) => (
              <div key={p.label} style={{ marginBottom: 28 }}>
                <p className="section-tag">{p.label} — {p.clubIds.length} clubs</p>
                <div className="card-grid" style={{ marginTop: 12 }}>
                  {p.clubIds.map((id) => getClubById(id)).filter(Boolean).map((c) => c && <ClubCard key={c.id} club={c} />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-grid">
            {clubs.map((c) => c && <ClubCard key={c.id} club={c} />)}
          </div>
        )
      )}

      {tab === 'Joueurs' && (
        <div className="card-grid">
          {compPlayers.map((p) => {
            const club = getClubById(p.clubId)
            return (
              <Link href={`/joueurs/${p.slug}`} className="entity-card" key={p.id}>
                <PersonPortrait seed={p.name} size={44} />
                <div><strong>{p.name}</strong><span>{p.position} · {club?.name}</span></div>
              </Link>
            )
          })}
          {!compPlayers.length && <p className="lede">Aucun joueur enregistré pour cette compétition.</p>}
        </div>
      )}

      {tab === 'Arbitres' && (
        <div className="card-grid">
          {officiatingReferees.map(({ referee, count }) => (
            <Link href={`/officiels/arbitres/${referee.slug}`} className="entity-card" key={referee.id}>
              <PersonPortrait seed={referee.name} size={44} />
              <div><strong>{referee.name}</strong><span>{referee.category} · {count} match{count > 1 ? 's' : ''} sur cette compétition</span></div>
            </Link>
          ))}
          {!officiatingReferees.length && <p className="lede">Aucun arbitre désigné pour l’instant.</p>}
        </div>
      )}
    </div>
  )
}
