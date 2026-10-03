import Link from 'next/link'
import type { Match } from '@/lib/data/types'
import { getClubById } from '@/lib/data/mock'
import { ClubCrest } from './cards'

function shortDate(m: Match) {
  if (m.dateConfirmed === false) return 'À conf.'
  const [, mo, d] = m.date.slice(0, 10).split('-')
  return `${d}.${mo}.`
}

function TeamLine({ clubId, bold, red }: { clubId: string; bold: boolean; red: boolean }) {
  const club = getClubById(clubId)
  return (
    <div className="md-team">
      {club ? <ClubCrest club={club} size={18} /> : <span style={{ width: 18 }} />}
      <span style={{ fontWeight: bold ? 800 : 500 }}>{club?.name ?? '—'}</span>
      {red && <i className="md-red" aria-label="Carton rouge" />}
    </div>
  )
}

function MatchRow({ m }: { m: Match }) {
  const played = m.status === 'Terminé' && m.homeScore !== null && m.awayScore !== null
  const homeWin = played && m.homeScore! > m.awayScore!
  const awayWin = played && m.awayScore! > m.homeScore!
  return (
    <Link href={m.detailHref ?? `/matches/${m.id}`} className="md-row">
      <div className="md-teams">
        <TeamLine clubId={m.homeClubId} bold={homeWin} red={m.events.some((e) => e.type === 'red' && e.team === 'home')} />
        <TeamLine clubId={m.awayClubId} bold={awayWin} red={m.events.some((e) => e.type === 'red' && e.team === 'away')} />
      </div>
      <span className="md-date">{shortDate(m)}</span>
      {played ? (
        <div className="md-scores">
          <b style={{ fontWeight: homeWin ? 900 : 600 }}>{m.homeScore}</b>
          <b style={{ fontWeight: awayWin ? 900 : 600 }}>{m.awayScore}</b>
        </div>
      ) : (
        <div className="md-scores md-time">{m.status === 'Reporté' ? 'Rep.' : m.timeConfirmed !== false && m.dateConfirmed !== false ? m.date.slice(11, 16) : '—'}</div>
      )}
    </Link>
  )
}

// Liste compacte groupée par journée (la plus récente en premier pour les
// résultats, la plus proche en premier pour le calendrier), à la Flashscore.
export function MatchdayList({ matches, mode }: { matches: Match[]; mode: 'results' | 'fixtures' }) {
  const isResults = mode === 'results'
  const days = [...new Set(matches.map((m) => m.matchday))].sort((a, b) => (isResults ? b - a : a - b))
  return (
    <div className="md-list">
      {days.map((day) => (
        <div key={day}>
          <p className="md-head">Journée {day}</p>
          {matches
            .filter((m) => m.matchday === day)
            .sort((a, b) => (isResults ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)))
            .map((m) => <MatchRow key={m.id} m={m} />)}
        </div>
      ))}
    </div>
  )
}
