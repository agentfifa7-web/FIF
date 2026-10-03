'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, Plus, Trash2, UserPlus, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { saveMatchSheetAction } from '@/app/admin/cms-actions'
import {
  getMatchSheet,
  type MatchSheetCard, type MatchSheetGoal, type MatchSheetOverride, type MatchSheetPlayer, type MatchSheetSubstitution,
} from '@/lib/matchsheet'

type Side = 'home' | 'away'
interface PersonRef { id: string; name: string }
/** Joueur de l'effectif enregistré d'une équipe. */
export interface RosterPlayer { id: string; name: string; number?: number; position?: string }
interface StandingSnapshot { played: number; won: number; drawn: number; lost: number; goalsFor: number; goalsAgainst: number; points: number }

type LineupStatus = 'none' | 'starter' | 'sub'
interface SheetEntry { id: string; name: string; number?: number; position?: string; status: LineupStatus; captain: boolean; added?: boolean }

const STARTERS = 11

function initialEntries(roster: RosterPlayer[]): SheetEntry[] {
  return roster.map((p) => ({ ...p, status: 'none', captain: false }))
}

/** Fusionne l'effectif enregistré et une feuille déjà publiée (joueurs ajoutés à la main compris). */
function mergeEntries(roster: RosterPlayer[], saved: MatchSheetPlayer[] | undefined): SheetEntry[] {
  const base = initialEntries(roster)
  if (!saved) return base
  const byId = new Map(saved.map((p) => [p.id, p]))
  const merged = base.map((e) => {
    const s = byId.get(e.id)
    return s ? { ...e, number: s.number ?? e.number, status: (s.starter ? 'starter' : 'sub') as LineupStatus, captain: Boolean(s.captain) } : e
  })
  const extra = saved.filter((p) => !roster.some((r) => r.id === p.id))
    .map((p) => ({ id: p.id, name: p.name, number: p.number, position: p.position, status: (p.starter ? 'starter' : 'sub') as LineupStatus, captain: Boolean(p.captain), added: true }))
  return [...merged, ...extra]
}

const toSheetPlayers = (entries: SheetEntry[]): MatchSheetPlayer[] =>
  entries.filter((e) => e.status !== 'none').map((e) => ({ id: e.id, name: e.name, number: e.number, position: e.position, starter: e.status === 'starter', captain: e.captain || undefined }))

export function MatchSheetForm({
  matchId, matchLabel, homeClub, awayClub, homePlayers, awayPlayers, homeStanding, awayStanding, note,
}: {
  matchId: string
  matchLabel: string
  homeClub: PersonRef
  awayClub: PersonRef
  homePlayers: RosterPlayer[]
  awayPlayers: RosterPlayer[]
  homeStanding?: StandingSnapshot
  awayStanding?: StandingSnapshot
  note?: string
}) {
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const [attendance, setAttendance] = useState('')
  const [lineups, setLineups] = useState<Record<Side, SheetEntry[]>>(() => ({ home: initialEntries(homePlayers), away: initialEntries(awayPlayers) }))
  const [goals, setGoals] = useState<MatchSheetGoal[]>([])
  const [cards, setCards] = useState<MatchSheetCard[]>([])
  const [subs, setSubs] = useState<MatchSheetSubstitution[]>([])
  const [published, setPublished] = useState<MatchSheetOverride | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const existing = getMatchSheet(matchId)
    if (!existing) return
    setPublished(existing)
    setHomeScore(existing.homeScore)
    setAwayScore(existing.awayScore)
    setAttendance(existing.attendance ? String(existing.attendance) : '')
    setLineups({ home: mergeEntries(homePlayers, existing.lineups?.home), away: mergeEntries(awayPlayers, existing.lineups?.away) })
    setGoals(existing.goals)
    setCards(existing.cards)
    setSubs(existing.substitutions ?? [])
  }, [matchId, homePlayers, awayPlayers])

  const clubs: Record<Side, PersonRef> = { home: homeClub, away: awayClub }

  /** Joueurs proposés pour les buts, cartons et remplacements : ceux de la feuille, sinon tout l'effectif. */
  const pool = (side: Side): PersonRef[] => {
    const onSheet = lineups[side].filter((e) => e.status !== 'none')
    return (onSheet.length ? onSheet : lineups[side]).map((e) => ({ id: e.id, name: e.number ? `${e.number}. ${e.name}` : e.name }))
  }
  const nameOf = (side: Side, id: string) => lineups[side].find((e) => e.id === id)?.name ?? ''

  function updateEntry(side: Side, id: string, patch: Partial<SheetEntry>) {
    setLineups((l) => ({
      ...l,
      [side]: l[side].map((e) => {
        if (e.id === id) return { ...e, ...patch, captain: patch.status === 'none' ? false : (patch.captain ?? e.captain) }
        return patch.captain ? { ...e, captain: false } : e
      }),
    }))
  }

  function addEntry(side: Side, name: string, number?: number) {
    const id = `manual-${side}-${Date.now().toString(36)}`
    setLineups((l) => ({ ...l, [side]: [...l[side], { id, name, number, status: 'starter', captain: false, added: true }] }))
  }

  function removeEntry(side: Side, id: string) {
    setLineups((l) => ({ ...l, [side]: l[side].filter((e) => e.id !== id) }))
  }

  function firstOf(side: Side) {
    const p = pool(side)[0]
    return p ? { playerId: p.id, playerName: nameOf(side, p.id) } : null
  }

  function addGoal(team: Side) {
    const p = firstOf(team)
    if (p) setGoals((g) => [...g, { minute: 1, team, ...p }])
  }

  function addCard(team: Side) {
    const p = firstOf(team)
    if (p) setCards((c) => [...c, { minute: 1, team, ...p, type: 'yellow' }])
  }

  function addSub(team: Side) {
    const list = pool(team)
    if (list.length < 2) return
    setSubs((s) => [...s, { minute: 46, team, outId: list[0].id, outName: nameOf(team, list[0].id), inId: list[1].id, inName: nameOf(team, list[1].id) }])
  }

  async function publish(e: React.FormEvent) {
    e.preventDefault()
    for (const side of ['home', 'away'] as const) {
      const starters = lineups[side].filter((x) => x.status === 'starter').length
      if (starters > STARTERS) return setError(`${clubs[side].name} : ${starters} titulaires sélectionnés, ${STARTERS} au maximum.`)
    }
    setError('')
    const sheet: MatchSheetOverride = {
      matchId,
      homeScore,
      awayScore,
      attendance: attendance ? Number(attendance) : null,
      lineups: { home: toSheetPlayers(lineups.home), away: toSheetPlayers(lineups.away) },
      substitutions: subs,
      goals,
      cards,
      submittedBy: 'Administrateur FIF',
      submittedAt: new Date().toISOString(),
    }
    setSaving(true)
    const res = await saveMatchSheetAction(sheet)
    setSaving(false)
    if (res.error) return setError(res.error)
    setPublished(sheet)
    router.refresh()
  }

  const afterHome = homeStanding ? applyResult(homeStanding, homeScore, awayScore) : null
  const afterAway = awayStanding ? applyResult(awayStanding, awayScore, homeScore) : null
  const goalTally = new Map<string, number>()
  for (const g of goals) goalTally.set(g.playerName, (goalTally.get(g.playerName) ?? 0) + 1)
  const goalMismatch = goals.length > 0 && (goals.filter((g) => g.team === 'home').length !== homeScore || goals.filter((g) => g.team === 'away').length !== awayScore)

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

        <p className="section-tag" style={{ marginTop: 24 }}><Users size={14} /> Listes des joueurs</p>
        <p className="muted-sm" style={{ margin: '6px 0 0' }}>Pour chaque équipe, indiquez les titulaires et les remplaçants, leur numéro de maillot et le capitaine. Un joueur absent de l’effectif enregistré peut être ajouté à la main.</p>
        <div className="lineup-grid">
          {(['home', 'away'] as const).map((side) => (
            <LineupEditor
              key={side}
              club={clubs[side]}
              entries={lineups[side]}
              onChange={(id, patch) => updateEntry(side, id, patch)}
              onAdd={(name, number) => addEntry(side, name, number)}
              onRemove={(id) => removeEntry(side, id)}
            />
          ))}
        </div>

        <p className="section-tag" style={{ marginTop: 24 }}>Buteurs</p>
        <div className="matchsheet-list">
          {goals.map((g, i) => (
            <div className="matchsheet-row" key={i}>
              <TeamSelect value={g.team} clubs={clubs} onChange={(team) => setGoals((all) => all.map((x, xi) => xi === i ? { ...x, team, ...(firstOf(team) ?? { playerId: '', playerName: '' }) } : x))} />
              <PlayerSelect value={g.playerId} options={pool(g.team)} onChange={(id) => setGoals((all) => all.map((x, xi) => xi === i ? { ...x, playerId: id, playerName: nameOf(g.team, id) } : x))} />
              <MinuteInput value={g.minute} onChange={(minute) => setGoals((all) => all.map((x, xi) => xi === i ? { ...x, minute } : x))} />
              <button type="button" className="matchsheet-remove" aria-label="Supprimer" onClick={() => setGoals((all) => all.filter((_, xi) => xi !== i))}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        {goalMismatch && <p className="matchsheet-warn"><AlertTriangle size={14} /> Le nombre de buteurs ne correspond pas au score saisi.</p>}
        <div className="button-group">
          {(['home', 'away'] as const).map((side) => lineups[side].length > 0 && (
            <button key={side} type="button" className="button-outline" onClick={() => addGoal(side)}><Plus size={14} /> But {clubs[side].name}</button>
          ))}
        </div>

        <p className="section-tag" style={{ marginTop: 24 }}>Cartons</p>
        <div className="matchsheet-list">
          {cards.map((c, i) => (
            <div className="matchsheet-row" key={i}>
              <TeamSelect value={c.team} clubs={clubs} onChange={(team) => setCards((all) => all.map((x, xi) => xi === i ? { ...x, team, ...(firstOf(team) ?? { playerId: '', playerName: '' }) } : x))} />
              <PlayerSelect value={c.playerId} options={pool(c.team)} onChange={(id) => setCards((all) => all.map((x, xi) => xi === i ? { ...x, playerId: id, playerName: nameOf(c.team, id) } : x))} />
              <select value={c.type} onChange={(e) => setCards((all) => all.map((x, xi) => xi === i ? { ...x, type: e.target.value as 'yellow' | 'red' } : x))}>
                <option value="yellow">Jaune</option>
                <option value="red">Rouge</option>
              </select>
              <MinuteInput value={c.minute} onChange={(minute) => setCards((all) => all.map((x, xi) => xi === i ? { ...x, minute } : x))} />
              <button type="button" className="matchsheet-remove" aria-label="Supprimer" onClick={() => setCards((all) => all.filter((_, xi) => xi !== i))}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <div className="button-group">
          {(['home', 'away'] as const).map((side) => lineups[side].length > 0 && (
            <button key={side} type="button" className="button-outline" onClick={() => addCard(side)}><Plus size={14} /> Carton {clubs[side].name}</button>
          ))}
        </div>

        <p className="section-tag" style={{ marginTop: 24 }}>Remplacements</p>
        <div className="matchsheet-list">
          {subs.map((s, i) => (
            <div className="matchsheet-row matchsheet-sub" key={i}>
              <TeamSelect value={s.team} clubs={clubs} onChange={(team) => {
                const list = pool(team)
                setSubs((all) => all.map((x, xi) => xi === i ? { ...x, team, outId: list[0]?.id ?? '', outName: list[0] ? nameOf(team, list[0].id) : '', inId: list[1]?.id ?? '', inName: list[1] ? nameOf(team, list[1].id) : '' } : x))
              }} />
              <span>Sort</span>
              <PlayerSelect value={s.outId} options={pool(s.team)} onChange={(id) => setSubs((all) => all.map((x, xi) => xi === i ? { ...x, outId: id, outName: nameOf(s.team, id) } : x))} />
              <span>Entre</span>
              <PlayerSelect value={s.inId} options={pool(s.team)} onChange={(id) => setSubs((all) => all.map((x, xi) => xi === i ? { ...x, inId: id, inName: nameOf(s.team, id) } : x))} />
              <MinuteInput value={s.minute} onChange={(minute) => setSubs((all) => all.map((x, xi) => xi === i ? { ...x, minute } : x))} />
              <button type="button" className="matchsheet-remove" aria-label="Supprimer" onClick={() => setSubs((all) => all.filter((_, xi) => xi !== i))}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <div className="button-group">
          {(['home', 'away'] as const).map((side) => lineups[side].length > 1 && (
            <button key={side} type="button" className="button-outline" onClick={() => addSub(side)}><Plus size={14} /> Remplacement {clubs[side].name}</button>
          ))}
        </div>

        {error && <p className="form-error" role="alert" style={{ marginTop: 16 }}>{error}</p>}
        <div className="form-actions">
          <button type="submit" className="button button-primary" style={{ justifyContent: 'center' }} disabled={saving}>{saving ? 'Enregistrement…' : 'Publier la feuille de match'}</button>
        </div>
      </form>

      {published && (
        <div className="form-card matchsheet-published" style={{ margin: '24px 0 0', maxWidth: 'none' }}>
          <p className="matchsheet-published-head"><CheckCircle2 size={18} /> Feuille de match publiée</p>
          <p className="muted-sm">Publiée par {published.submittedBy} le {new Date(published.submittedAt).toLocaleString('fr-FR')}. Le résultat, les compositions, le classement et les statistiques des joueurs sont mis à jour sur le site.</p>

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

function LineupEditor({ club, entries, onChange, onAdd, onRemove }: {
  club: PersonRef
  entries: SheetEntry[]
  onChange: (id: string, patch: Partial<SheetEntry>) => void
  onAdd: (name: string, number?: number) => void
  onRemove: (id: string) => void
}) {
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const starters = entries.filter((e) => e.status === 'starter').length
  const subs = entries.filter((e) => e.status === 'sub').length
  const sorted = useMemo(() => {
    const rank: Record<LineupStatus, number> = { starter: 0, sub: 1, none: 2 }
    return [...entries].sort((a, b) => rank[a.status] - rank[b.status] || (a.number ?? 99) - (b.number ?? 99))
  }, [entries])

  function add() {
    if (name.trim().length < 2) return
    onAdd(name.trim(), number ? Number(number) : undefined)
    setName('')
    setNumber('')
  }

  return (
    <div className="lineup-card">
      <div className="lineup-head">
        <strong>{club.name}</strong>
        <span className={starters === STARTERS ? 'is-ok' : starters > STARTERS ? 'is-bad' : ''}>{starters}/{STARTERS} titulaires · {subs} remplaçant{subs > 1 ? 's' : ''}</span>
      </div>
      {entries.length === 0 && <p className="muted-sm" style={{ margin: '8px 0' }}>Aucun effectif enregistré pour cette équipe : ajoutez les joueurs inscrits sur la feuille.</p>}
      <ul className="lineup-list">
        {sorted.map((e) => (
          <li key={e.id} className={`lineup-row is-${e.status}`}>
            <input aria-label={`Numéro de ${e.name}`} type="number" min={1} max={99} placeholder="N°" value={e.number ?? ''} onChange={(ev) => onChange(e.id, { number: ev.target.value ? Number(ev.target.value) : undefined })} />
            <span className="lineup-name">{e.name}{e.position && <small>{e.position}</small>}</span>
            <select aria-label={`Statut de ${e.name}`} value={e.status} onChange={(ev) => onChange(e.id, { status: ev.target.value as LineupStatus })}>
              <option value="none">Non retenu</option>
              <option value="starter">Titulaire</option>
              <option value="sub">Remplaçant</option>
            </select>
            <button type="button" className={`lineup-captain${e.captain ? ' is-on' : ''}`} disabled={e.status === 'none'} title="Capitaine" aria-pressed={e.captain} onClick={() => onChange(e.id, { captain: !e.captain })}>C</button>
            {e.added && <button type="button" className="matchsheet-remove" aria-label={`Retirer ${e.name}`} onClick={() => onRemove(e.id)}><Trash2 size={14} /></button>}
          </li>
        ))}
      </ul>
      <div className="lineup-add">
        <input aria-label="Numéro du joueur à ajouter" type="number" min={1} max={99} placeholder="N°" value={number} onChange={(e) => setNumber(e.target.value)} />
        <input aria-label="Nom du joueur à ajouter" type="text" placeholder="Ajouter un joueur (nom complet)" value={name} onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }} />
        <button type="button" className="button-outline" onClick={add} disabled={name.trim().length < 2}><UserPlus size={14} /> Ajouter</button>
      </div>
    </div>
  )
}

function TeamSelect({ value, clubs, onChange }: { value: Side; clubs: Record<Side, PersonRef>; onChange: (side: Side) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as Side)}>
      <option value="home">{clubs.home.name}</option>
      <option value="away">{clubs.away.name}</option>
    </select>
  )
}

function PlayerSelect({ value, options, onChange }: { value: string; options: PersonRef[]; onChange: (id: string) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {!options.some((o) => o.id === value) && <option value={value}>—</option>}
      {options.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
    </select>
  )
}

function MinuteInput({ value, onChange }: { value: number; onChange: (minute: number) => void }) {
  return (
    <>
      <input type="number" min={1} max={120} aria-label="Minute" value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <span>’</span>
    </>
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
