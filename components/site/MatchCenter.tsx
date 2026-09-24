'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { CalendarDays, MapPin, Radio, Users } from 'lucide-react'
import type { Match, MatchEvent, Player } from '@/lib/data/types'
import { ClubCrest } from './cards'
import { getClubById, getPlayerById, getStadiumById, getRefereeById } from '@/lib/data/mock'
import { useLiveMatch } from '@/lib/liveMatch'
import { formatDate, formatTime } from '@/lib/format'

const eventLabel: Record<MatchEvent['type'], string> = {
  goal: 'BUT', yellow: 'CARTON JAUNE', red: 'CARTON ROUGE', sub: 'REMPLACEMENT', var: 'VAR', ht: 'MI-TEMPS', ft: 'FIN', kickoff: 'COUP D’ENVOI',
}

export function MatchCenter({
  match: initialMatch,
  homeRoster,
  awayRoster,
}: {
  match: Match
  homeRoster: Player[]
  awayRoster: Player[]
}) {
  const live = useLiveMatch(initialMatch)
  const match: Match = { ...initialMatch, ...live }
  const home = getClubById(match.homeClubId)!
  const away = getClubById(match.awayClubId)!
  const stadium = getStadiumById(match.stadiumId)
  const referee = getRefereeById(match.refereeId)
  const hasLiveScript = !!initialMatch.liveScript?.length

  const sortedEvents = useMemo(() => [...match.events].sort((a, b) => a.minute - b.minute), [match.events])

  const startingXI = (roster: Player[]) => {
    const gk = roster.filter((p) => p.position === 'Gardien').slice(0, 1)
    const def = roster.filter((p) => p.position === 'Défenseur').slice(0, 4)
    const mid = roster.filter((p) => p.position === 'Milieu').slice(0, 4)
    const att = roster.filter((p) => p.position === 'Attaquant').slice(0, 2)
    return { gk, def, mid, att }
  }
  const homeXI = startingXI(homeRoster)
  const awayXI = startingXI(awayRoster)

  const statBase = (match.homeScore ?? 0) * 7 + 42
  const homePossession = Math.min(68, Math.max(32, statBase % 68 || 50))

  return (
    <div>
      <div className="match-center-header">
        <div className="match-center-team">
          <ClubCrest club={home} size={72} />
          <Link href={`/clubs/${home.slug}`}>{home.name}</Link>
        </div>
        <div className="match-center-score">
          {match.status === 'Live' && <span className="live-pill"><i /> {match.minute}&apos;</span>}
          <strong>{match.homeScore ?? '–'} : {match.awayScore ?? '–'}</strong>
          <span>{match.status}</span>
        </div>
        <div className="match-center-team">
          <ClubCrest club={away} size={72} />
          <Link href={`/clubs/${away.slug}`}>{away.name}</Link>
        </div>
      </div>

      <div className="match-center-meta">
        <span><CalendarDays /> {formatDate(match.date, { weekday: 'long', day: 'numeric', month: 'long' })} · {formatTime(match.date)}</span>
        <span><MapPin /> {stadium?.name}</span>
        {match.attendance && <span><Users /> {match.attendance.toLocaleString('fr-FR')} spectateurs</span>}
        <span>Arbitre : {referee?.name ?? 'à confirmer'}</span>
        {hasLiveScript && (
          <span><Radio size={14} /> {match.status === 'Live' ? 'Suivi automatique en temps réel' : match.status === 'Terminé' ? 'Résultat automatique (coup d’envoi passé)' : 'Passera en direct au coup d’envoi'}</span>
        )}
      </div>

      <div className="match-center-grid">
        <div>
          <p className="section-tag">Timeline</p>
          <div className="timeline" style={{ marginTop: 16 }}>
            {sortedEvents.map((e, i) => {
              const player = e.playerId ? getPlayerById(e.playerId) : undefined
              const team = e.team === 'home' ? home : away
              return (
                <div key={i}>
                  <b>{e.minute}&apos;</b>
                  <div>
                    <strong>{eventLabel[e.type]}</strong>
                    <span>{team.shortName}{player ? ` · ${player.name}` : ''}</span>
                  </div>
                </div>
              )
            })}
            {!sortedEvents.length && <p className="lede">Aucun événement pour le moment.</p>}
          </div>
        </div>
        <div>
          <p className="section-tag">Statistiques (illustratives)</p>
          <div style={{ marginTop: 16 }}>
            <StatBar label="Possession" left={homePossession} right={100 - homePossession} leftLabel={`${homePossession}%`} rightLabel={`${100 - homePossession}%`} />
            <StatBar label="Tirs" left={(match.homeScore ?? 0) * 2 + 4} right={(match.awayScore ?? 0) * 2 + 3} />
            <StatBar label="Tirs cadrés" left={(match.homeScore ?? 0) + 2} right={(match.awayScore ?? 0) + 1} />
            <StatBar label="Corners" left={5} right={4} />
            <StatBar label="Fautes" left={9} right={11} />
          </div>
        </div>
      </div>

      <div className="match-center-grid" style={{ marginTop: 40 }}>
        <div>
          <p className="section-tag">Composition — {home.name}</p>
          <Lineup xi={homeXI} />
        </div>
        <div>
          <p className="section-tag">Composition — {away.name}</p>
          <Lineup xi={awayXI} />
        </div>
      </div>
    </div>
  )
}

function StatBar({ label, left, right, leftLabel, rightLabel }: { label: string; left: number; right: number; leftLabel?: string; rightLabel?: string }) {
  const total = left + right || 1
  return (
    <div className="stat-bar">
      <div className="stat-bar-labels"><span>{leftLabel ?? left}</span><b>{label}</b><span>{rightLabel ?? right}</span></div>
      <div className="stat-bar-track">
        <div style={{ width: `${(left / total) * 100}%` }} />
        <div style={{ width: `${(right / total) * 100}%` }} />
      </div>
    </div>
  )
}

function Lineup({ xi }: { xi: { gk: Player[]; def: Player[]; mid: Player[]; att: Player[] } }) {
  return (
    <div className="lineup">
      <div className="lineup-row">{xi.att.map((p) => <PlayerDot key={p.id} p={p} />)}</div>
      <div className="lineup-row">{xi.mid.map((p) => <PlayerDot key={p.id} p={p} />)}</div>
      <div className="lineup-row">{xi.def.map((p) => <PlayerDot key={p.id} p={p} />)}</div>
      <div className="lineup-row">{xi.gk.map((p) => <PlayerDot key={p.id} p={p} />)}</div>
    </div>
  )
}

function PlayerDot({ p }: { p: Player }) {
  return (
    <Link href={`/joueurs/${p.slug}`} className="lineup-player">
      <span>{p.name.split(' ').map((n) => n[0]).join('')}</span>
      {p.name.split(' ').slice(-1)[0]}
    </Link>
  )
}
