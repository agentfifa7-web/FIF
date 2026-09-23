'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Plus, Trash2 } from 'lucide-react'
import {
  getMatchSheet, saveMatchSheet,
  type MatchSheetCard, type MatchSheetGoal, type MatchSheetOverride,
} from '@/lib/matchsheet'

interface PersonRef { id: string; name: string }
interface StandingSnapshot { played: number; won: number; drawn: number; lost: number; goalsFor: number; goalsAgainst: number; points: number }

export function MatchSheetForm({
  matchId, matchLabel, homeClub, awayClub, homePlayers, awayPlayers, homeStanding, awayStanding, note,
}: {
  matchId: string
  matchLabel: string
  homeClub: PersonRef
  awayClub: PersonRef
  homePlayers: PersonRef[]
  awayPlayers: PersonRef[]
  homeStanding?: StandingSnapshot
  awayStanding?: StandingSnapshot
  note?: string
}) {
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const [attendance, setAttendance] = useState('')
  const [goals, setGoals] = useState<MatchSheetGoal[]>([])
  const [cards, setCards] = useState<MatchSheetCard[]>([])
  const [published, setPublished] = useState<MatchSheetOverride | null>(null)

  useEffect(() => {
    const existing = getMatchSheet(matchId)
    if (existing) {
      setPublished(existing)
      setHomeScore(existing.homeScore)
      setAwayScore(existing.awayScore)
      setAttendance(existing.attendance ? String(existing.attendance) : '')
      setGoals(existing.goals)
      setCards(existing.cards)
    }
  }, [matchId])

  function addGoal(team: 'home' | 'away') {
    const pool = team === 'home' ? homePlayers : awayPlayers
    if (!pool.length) return
    setGoals((g) => [...g, { minute: 1, team, playerId: pool[0].id, playerName: pool[0].name }])
  }

  function addCard(team: 'home' | 'away') {
    const pool = team === 'home' ? homePlayers : awayPlayers
    if (!pool.length) return
    setCards((c) => [...c, { minute: 1, team, playerId: pool[0].id, playerName: pool[0].name, type: 'yellow' }])
  }

  function publish(e: React.FormEvent) {
    e.preventDefault()
    const sheet: MatchSheetOverride = {
      matchId,
      homeScore,
      awayScore,
      attendance: attendance ? Number(attendance) : null,
      goals,
      cards,
      submittedBy: 'Délégué de match (démonstration)',
      submittedAt: new Date().toISOString(),
    }
    saveMatchSheet(sheet)
    setPublished(sheet)
  }

  const afterHome = homeStanding ? applyResult(homeStanding, homeScore, awayScore) : null
  const afterAway = awayStanding ? applyResult(awayStanding, awayScore, homeScore) : null
  const goalTally = new Map<string, number>()
  for (const g of goals) goalTally.set(g.playerName, (goalTally.get(g.playerName) ?? 0) + 1)

  return (
    <div>
      <form className="form-card" style={{ margin: 0, maxWidth: 'none' }} onSubmit={publish}>
        <h1 style={{ fontSize: 22 }}>Feuille de match</h1>
        <p className="muted-sm">{matchLabel}</p>
        {note && <p className="muted-sm" style={{ marginTop: 4 }}>{note}</p>}

        <div className="matchsheet-score">
          <div className="text-field">
            <label htmlFor="home-score">{homeClub.name}</label>
            <input id="home-score" type="number" min={0} value={homeScore} onChange={(e) => setHomeScore(Number(e.target.value))} />
          </div>
          <span className="matchsheet-vs">—</span>
          <div className="text-field">
            <label htmlFor="away-score">{awayClub.name}</label>
            <input id="away-score" type="number" min={0} value={awayScore} onChange={(e) => setAwayScore(Number(e.target.value))} />
          </div>
        </div>

        <div className="text-field">
          <label htmlFor="attendance">Affluence</label>
          <input id="attendance" type="number" min={0} placeholder="Nombre de spectateurs" value={attendance} onChange={(e) => setAttendance(e.target.value)} />
        </div>

        <p className="section-tag" style={{ marginTop: 24 }}>Buteurs</p>
        <div className="matchsheet-list">
          {goals.map((g, i) => (
            <div className="matchsheet-row" key={i}>
              <select value={g.team} onChange={(e) => setGoals((all) => all.map((x, xi) => xi === i ? { ...x, team: e.target.value as 'home' | 'away', playerId: (e.target.value === 'home' ? homePlayers : awayPlayers)[0]?.id ?? '', playerName: (e.target.value === 'home' ? homePlayers : awayPlayers)[0]?.name ?? '' } : x))}>
                <option value="home">{homeClub.name}</option>
                <option value="away">{awayClub.name}</option>
              </select>
              <select value={g.playerId} onChange={(e) => {
                const pool = g.team === 'home' ? homePlayers : awayPlayers
                const p = pool.find((pp) => pp.id === e.target.value)
                setGoals((all) => all.map((x, xi) => xi === i ? { ...x, playerId: e.target.value, playerName: p?.name ?? x.playerName } : x))
              }}>
                {(g.team === 'home' ? homePlayers : awayPlayers).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input type="number" min={1} max={120} value={g.minute} onChange={(e) => setGoals((all) => all.map((x, xi) => xi === i ? { ...x, minute: Number(e.target.value) } : x))} />
              <span>’</span>
              <button type="button" className="matchsheet-remove" onClick={() => setGoals((all) => all.filter((_, xi) => xi !== i))}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <div className="button-group">
          {homePlayers.length > 0 && <button type="button" className="button-outline" onClick={() => addGoal('home')}><Plus size={14} /> But {homeClub.name}</button>}
          {awayPlayers.length > 0 && <button type="button" className="button-outline" onClick={() => addGoal('away')}><Plus size={14} /> But {awayClub.name}</button>}
        </div>

        <p className="section-tag" style={{ marginTop: 24 }}>Cartons</p>
        <div className="matchsheet-list">
          {cards.map((c, i) => (
            <div className="matchsheet-row" key={i}>
              <select value={c.team} onChange={(e) => setCards((all) => all.map((x, xi) => xi === i ? { ...x, team: e.target.value as 'home' | 'away', playerId: (e.target.value === 'home' ? homePlayers : awayPlayers)[0]?.id ?? '', playerName: (e.target.value === 'home' ? homePlayers : awayPlayers)[0]?.name ?? '' } : x))}>
                <option value="home">{homeClub.name}</option>
                <option value="away">{awayClub.name}</option>
              </select>
              <select value={c.playerId} onChange={(e) => {
                const pool = c.team === 'home' ? homePlayers : awayPlayers
                const p = pool.find((pp) => pp.id === e.target.value)
                setCards((all) => all.map((x, xi) => xi === i ? { ...x, playerId: e.target.value, playerName: p?.name ?? x.playerName } : x))
              }}>
                {(c.team === 'home' ? homePlayers : awayPlayers).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select value={c.type} onChange={(e) => setCards((all) => all.map((x, xi) => xi === i ? { ...x, type: e.target.value as 'yellow' | 'red' } : x))}>
                <option value="yellow">Jaune</option>
                <option value="red">Rouge</option>
              </select>
              <input type="number" min={1} max={120} value={c.minute} onChange={(e) => setCards((all) => all.map((x, xi) => xi === i ? { ...x, minute: Number(e.target.value) } : x))} />
              <span>’</span>
              <button type="button" className="matchsheet-remove" onClick={() => setCards((all) => all.filter((_, xi) => xi !== i))}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <div className="button-group">
          {homePlayers.length > 0 && <button type="button" className="button-outline" onClick={() => addCard('home')}><Plus size={14} /> Carton {homeClub.name}</button>}
          {awayPlayers.length > 0 && <button type="button" className="button-outline" onClick={() => addCard('away')}><Plus size={14} /> Carton {awayClub.name}</button>}
        </div>

        <div className="form-actions">
          <button type="submit" className="button button-primary" style={{ justifyContent: 'center' }}>Publier la feuille de match</button>
        </div>
      </form>

      {published && (
        <div className="form-card matchsheet-published" style={{ margin: '24px 0 0', maxWidth: 'none' }}>
          <p className="matchsheet-published-head"><CheckCircle2 size={18} /> Feuille de match publiée — statistiques mises à jour (démonstration locale)</p>
          <p className="muted-sm">Publiée par {published.submittedBy} le {new Date(published.submittedAt).toLocaleString('fr-FR')}. Cette mise à jour est enregistrée dans votre navigateur ; une synchronisation avec la base fédérale serait nécessaire pour la rendre visible à tous les visiteurs.</p>

          {homeStanding && awayStanding && afterHome && afterAway && (
            <>
              <p className="section-tag" style={{ marginTop: 20 }}>Impact sur le classement</p>
              <div className="matchsheet-compare">
                <StandingDelta name={homeClub.name} before={homeStanding} after={afterHome} />
                <StandingDelta name={awayClub.name} before={awayStanding} after={afterAway} />
              </div>
            </>
          )}

          {goalTally.size > 0 && (
            <>
              <p className="section-tag" style={{ marginTop: 20 }}>Buteurs comptabilisés</p>
              <ul className="honour-list">
                {[...goalTally.entries()].map(([name, count]) => (
                  <li key={name}><span>{name}</span><em>{count} but{count > 1 ? 's' : ''}</em></li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function applyResult(row: StandingSnapshot, scored: number, conceded: number): StandingSnapshot {
  const points = row.points + (scored > conceded ? 3 : scored === conceded ? 1 : 0)
  return {
    played: row.played + 1,
    won: row.won + (scored > conceded ? 1 : 0),
    drawn: row.drawn + (scored === conceded ? 1 : 0),
    lost: row.lost + (scored < conceded ? 1 : 0),
    goalsFor: row.goalsFor + scored,
    goalsAgainst: row.goalsAgainst + conceded,
    points,
  }
}

function StandingDelta({ name, before, after }: { name: string; before: StandingSnapshot; after: StandingSnapshot }) {
  return (
    <div className="matchsheet-delta">
      <strong>{name}</strong>
      <div><span>{before.points} pts</span><span aria-hidden>→</span><span className="matchsheet-delta-new">{after.points} pts</span></div>
      <span className="muted-sm">{after.played} matchs joués · {after.goalsFor}-{after.goalsAgainst}</span>
    </div>
  )
}
