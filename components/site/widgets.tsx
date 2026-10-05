'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { StandingRow } from '@/lib/data/types'
import { getClubById } from '@/lib/data/mock'
import { ClubCrest } from './cards'

export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="tab-bar" role="tablist">
      {tabs.map((t) => (
        <button key={t} type="button" role="tab" aria-selected={active === t} className={active === t ? 'tab active' : 'tab'} onClick={() => onChange(t)}>
          {t}
        </button>
      ))}
    </div>
  )
}

export function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="filter-select">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  )
}

export function RankingTable({ rows, highlightTop = 0, highlightBottom = 0 }: { rows: StandingRow[]; highlightTop?: number; highlightBottom?: number }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>POS</th><th className="align-left">CLUB</th><th>MJ</th><th className="col-wdl">G</th><th className="col-wdl">N</th><th className="col-wdl">P</th><th className="col-goals">BP</th><th className="col-goals">BC</th><th>DB</th><th>PTS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const club = getClubById(row.clubId)
            if (!club) return null
            const rowClass = i < highlightTop ? 'promo' : i >= rows.length - highlightBottom ? 'relegation' : ''
            return (
              <tr key={row.clubId} className={rowClass}>
                <td>{i + 1}</td>
                <td className="align-left">
                  <Link href={`/clubs/${club.slug}`} className="table-club"><ClubCrest club={club} size={24} /> <span>{club.name}</span></Link>
                </td>
                <td>{row.played}</td>
                <td className="col-wdl">{row.won}</td>
                <td className="col-wdl">{row.drawn}</td>
                <td className="col-wdl">{row.lost}</td>
                <td className="col-goals">{row.goalsFor}</td>
                <td className="col-goals">{row.goalsAgainst}</td>
                <td>{row.goalsFor - row.goalsAgainst}</td>
                <td><b>{row.points}</b></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      {hint && <span>{hint}</span>}
    </div>
  )
}

export function Stepper({ steps, active }: { steps: string[]; active: number }) {
  return (
    <ol className="stepper">
      {steps.map((s, i) => (
        <li key={s} className={i < active ? 'done' : i === active ? 'current' : ''}>
          <span>{i + 1}</span>
          {s}
        </li>
      ))}
    </ol>
  )
}

export function useToggle(initial = false): [boolean, () => void] {
  const [v, setV] = useState(initial)
  return [v, () => setV((x) => !x)]
}
