import Link from 'next/link'
import type { RealLeagueFixture, RealLeagueMatch } from '@/lib/data/mock'
import { getClubByName } from '@/lib/data/mock'
import { ClubCrest } from './cards'

type Row =
  | { kind: 'result'; match: RealLeagueMatch }
  | { kind: 'fixture'; fixture: RealLeagueFixture }

function shortDate(iso: string) {
  const [, m, d] = iso.slice(0, 10).split('-')
  return `${d}.${m}.`
}

function TeamLine({ name, bold, red }: { name: string; bold: boolean; red: boolean }) {
  const club = getClubByName(name)
  return (
    <div className="md-team">
      {club ? <ClubCrest club={club} size={18} /> : <span style={{ width: 18 }} />}
      <span style={{ fontWeight: bold ? 800 : 500 }}>{name}</span>
      {red && <i className="md-red" aria-label="Carton rouge" />}
    </div>
  )
}

function MatchRow({ row }: { row: Row }) {
  if (row.kind === 'result') {
    const m = row.match
    const homeWin = m.homeScore > m.awayScore
    const awayWin = m.awayScore > m.homeScore
    const homeRed = m.events.some((e) => e.type === 'red' && e.team === 'home')
    const awayRed = m.events.some((e) => e.type === 'red' && e.team === 'away')
    return (
      <Link href={`/competitions/ligue-1/matchs/${m.slug}`} className="md-row">
        <div className="md-teams">
          <TeamLine name={m.homeClub} bold={homeWin} red={homeRed} />
          <TeamLine name={m.awayClub} bold={awayWin} red={awayRed} />
        </div>
        <span className="md-date">{shortDate(m.date)}</span>
        <div className="md-scores">
          <b style={{ fontWeight: homeWin ? 900 : 600 }}>{m.homeScore}</b>
          <b style={{ fontWeight: awayWin ? 900 : 600 }}>{m.awayScore}</b>
        </div>
      </Link>
    )
  }
  const f = row.fixture
  return (
    <div className="md-row">
      <div className="md-teams">
        <TeamLine name={f.homeClub} bold={false} red={false} />
        <TeamLine name={f.awayClub} bold={false} red={false} />
      </div>
      <span className="md-date">{shortDate(f.date)}</span>
      <div className="md-scores md-time">{f.time ?? '—'}</div>
    </div>
  )
}

// Liste compacte groupée par journée (la plus récente en premier pour les
// résultats, la plus proche en premier pour le calendrier), à la Flashscore.
export function MatchdayList({ results = [], fixtures = [] }: { results?: RealLeagueMatch[]; fixtures?: RealLeagueFixture[] }) {
  const rows: (Row & { matchday: number; date: string })[] = [
    ...results.map((m) => ({ kind: 'result' as const, match: m, matchday: m.matchday, date: m.date })),
    ...fixtures.map((f) => ({ kind: 'fixture' as const, fixture: f, matchday: f.matchday, date: f.date })),
  ]
  const isResults = fixtures.length === 0
  const days = [...new Set(rows.map((r) => r.matchday))].sort((a, b) => (isResults ? b - a : a - b))

  return (
    <div className="md-list">
      {days.map((day) => (
        <div key={day}>
          <p className="md-head">Journée {day}</p>
          {rows
            .filter((r) => r.matchday === day)
            .sort((a, b) => (isResults ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)))
            .map((r) => <MatchRow key={r.kind === 'result' ? r.match.slug : r.fixture.slug} row={r} />)}
        </div>
      ))}
    </div>
  )
}
