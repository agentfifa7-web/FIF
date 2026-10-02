'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { CalendarDays, ClipboardList, ExternalLink, MapPin, Users } from 'lucide-react'
import type { Match, MatchEvent } from '@/lib/data/types'
import { ClubCrest } from './cards'
import { getClubById, getPlayerById, getStadiumById } from '@/lib/data/mock'
import { getMatchSheet, MATCHSHEET_EVENT, type MatchSheetOverride, type MatchSheetPlayer } from '@/lib/matchsheet'
import { matchWhen } from '@/lib/format'

const eventLabel: Record<MatchEvent['type'], string> = {
  goal: 'BUT', yellow: 'CARTON JAUNE', red: 'CARTON ROUGE', sub: 'REMPLACEMENT', var: 'VAR', ht: 'MI-TEMPS', ft: 'FIN', kickoff: 'COUP D’ENVOI',
}

interface TimelineRow { minute?: number; label: string; team: 'home' | 'away'; who?: string }

/** Match Center : uniquement des informations réelles (résultat officiel ou
 *  feuille de match publiée par l'administration). Aucune statistique inventée. */
export function MatchCenter({ match }: { match: Match }) {
  const [sheet, setSheet] = useState<MatchSheetOverride | null>(null)
  useEffect(() => {
    const check = () => setSheet(getMatchSheet(match.id))
    check()
    window.addEventListener(MATCHSHEET_EVENT, check)
    return () => window.removeEventListener(MATCHSHEET_EVENT, check)
  }, [match.id])

  const home = getClubById(match.homeClubId)!
  const away = getClubById(match.awayClubId)!
  const stadium = match.stadiumId ? getStadiumById(match.stadiumId) : undefined
  const venue = stadium?.name ?? match.venue
  const homeScore = sheet ? sheet.homeScore : match.homeScore
  const awayScore = sheet ? sheet.awayScore : match.awayScore
  const status = sheet ? 'Terminé' : match.status
  const attendance = sheet?.attendance ?? match.attendance

  const timeline = useMemo<TimelineRow[]>(() => {
    const rows: TimelineRow[] = sheet
      ? [
          ...sheet.goals.map((g) => ({ minute: g.minute, label: 'BUT', team: g.team, who: g.playerName })),
          ...sheet.cards.map((c) => ({ minute: c.minute, label: c.type === 'red' ? 'CARTON ROUGE' : 'CARTON JAUNE', team: c.team, who: c.playerName })),
          ...(sheet.substitutions ?? []).map((s) => ({ minute: s.minute, label: 'REMPLACEMENT', team: s.team, who: `${s.inName} ↔ ${s.outName}` })),
        ]
      : match.events.filter((e) => e.type !== 'kickoff' && e.type !== 'ht' && e.type !== 'ft').map((e) => ({
          minute: e.minute,
          label: eventLabel[e.type],
          team: e.team,
          who: (e.playerId ? getPlayerById(e.playerId)?.name : undefined) ?? e.detail,
        }))
    return rows.sort((a, b) => (a.minute ?? 999) - (b.minute ?? 999))
  }, [sheet, match.events])

  return (
    <div>
      <div className="match-center-header">
        <div className="match-center-team">
          <ClubCrest club={home} size={72} />
          <Link href={`/clubs/${home.slug}`}>{home.name}</Link>
        </div>
        <div className="match-center-score">
          <strong>{homeScore ?? '–'} : {awayScore ?? '–'}</strong>
          <span>{status}</span>
        </div>
        <div className="match-center-team">
          <ClubCrest club={away} size={72} />
          <Link href={`/clubs/${away.slug}`}>{away.name}</Link>
        </div>
      </div>

      <div className="match-center-meta">
        <span><CalendarDays /> {matchWhen(match, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}{match.timeConfirmed === false && match.dateConfirmed !== false ? ' · heure non communiquée' : ''}</span>
        <span><MapPin /> {venue ?? 'Stade à confirmer'}</span>
        {attendance ? <span><Users /> {attendance.toLocaleString('fr-FR')} spectateurs</span> : null}
        {match.refereeName && <span>Arbitre : {match.refereeName}</span>}
      </div>

      <div className="match-center-grid">
        <div>
          <p className="section-tag">Faits de match</p>
          <div className="timeline" style={{ marginTop: 16 }}>
            {timeline.map((e, i) => (
              <div key={i}>
                <b>{e.minute !== undefined ? `${e.minute}’` : '—'}</b>
                <div>
                  <strong>{e.label}</strong>
                  <span>{(e.team === 'home' ? home : away).shortName}{e.who ? ` · ${e.who}` : ''}</span>
                </div>
              </div>
            ))}
            {!timeline.length && <p className="lede">{status === 'Terminé' ? 'Détail des buts et cartons non communiqué.' : 'Le match n’a pas encore été joué.'}</p>}
          </div>
        </div>
        <div>
          <p className="section-tag">Informations</p>
          <ul className="match-facts">
            <li><span>Compétition</span><b>Journée {match.matchday}</b></li>
            <li><span>Statut</span><b>{status}</b></li>
            {match.source && <li><span>Source</span><b>{match.source}</b></li>}
            {sheet && <li><span>Feuille de match</span><b>Publiée le {new Date(sheet.submittedAt).toLocaleDateString('fr-FR')}</b></li>}
          </ul>
          {match.detailHref && <Link href={match.detailHref} className="text-link" style={{ marginTop: 12 }}>Fiche complète du match <ExternalLink size={14} /></Link>}
        </div>
      </div>

      <div style={{ marginTop: 40 }}>
        <p className="section-tag"><ClipboardList size={14} /> Compositions</p>
        {sheet?.lineups && (sheet.lineups.home.length > 0 || sheet.lineups.away.length > 0) ? (
          <div className="lineup-public">
            <LineupColumn title={home.name} players={sheet.lineups.home} />
            <LineupColumn title={away.name} players={sheet.lineups.away} />
          </div>
        ) : (
          <p className="lede" style={{ marginTop: 12 }}>Compositions d’équipe non publiées pour ce match.</p>
        )}
      </div>
    </div>
  )
}

function LineupColumn({ title, players }: { title: string; players: MatchSheetPlayer[] }) {
  const starters = players.filter((p) => p.starter)
  const subs = players.filter((p) => !p.starter)
  const row = (p: MatchSheetPlayer) => (
    <li key={p.id}><span className="lineup-num">{p.number ?? '–'}</span><span>{p.name}{p.captain && <em className="lineup-c"> (C)</em>}</span>{p.position && <small>{p.position}</small>}</li>
  )
  return (
    <div className="lineup-col">
      <strong>{title}</strong>
      <p className="lineup-sub">Titulaires</p>
      {starters.length ? <ul>{starters.map(row)}</ul> : <p className="muted-sm">Non renseignés</p>}
      <p className="lineup-sub">Remplaçants</p>
      {subs.length ? <ul>{subs.map(row)}</ul> : <p className="muted-sm">Non renseignés</p>}
    </div>
  )
}
