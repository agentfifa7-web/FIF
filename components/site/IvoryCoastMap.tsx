'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Landmark, MapPin, ShieldHalf, Trophy, X } from 'lucide-react'
import type { Club, Stadium } from '@/lib/data/types'
import { ClubCrest } from './cards'

export type MapZoneClub = Club
export type MapZoneStadium = Stadium

export interface MapZone {
  cityId: string
  cityName: string
  regionName: string
  x: number
  y: number
  clubs: MapZoneClub[]
  stadiums: MapZoneStadium[]
  competitionNames: string[]
  proCount: number
}

const OUTLINE = '15,23 0,227 22,326 74,439 82,485 163,485 252,439 341,432 416,417 430,349 445,250 445,136 371,46 267,15 156,8 59,23'

export function IvoryCoastMap({ zones }: { zones: MapZone[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = zones.find((z) => z.cityId === activeId) ?? null

  return (
    <div className="ci-map">
      <svg viewBox="-20 -10 480 520" className="ci-map-svg" role="img" aria-label="Carte du football ivoirien par district">
        <polygon points={OUTLINE} className="ci-map-outline" />
        {zones.map((z) => {
          const size = 10 + Math.min(10, z.clubs.length + z.stadiums.length)
          const tone = z.proCount > 0 ? 'ci-marker-pro' : 'ci-marker-amateur'
          return (
            <g key={z.cityId} transform={`translate(${z.x}, ${z.y})`} className={`ci-marker ${tone}${activeId === z.cityId ? ' is-active' : ''}`} onClick={() => setActiveId(z.cityId)} role="button" tabIndex={0} aria-label={z.cityName}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveId(z.cityId) }}>
              <circle r={size} className="ci-marker-halo" />
              <circle r={size * 0.55} className="ci-marker-dot" />
              <text y={-(size + 8)} textAnchor="middle" className="ci-marker-label">{z.cityName}</text>
            </g>
          )
        })}
      </svg>

      <div className="ci-map-legend">
        <span><i className="ci-marker-dot ci-marker-pro" /> Pôle avec club professionnel</span>
        <span><i className="ci-marker-dot ci-marker-amateur" /> Pôle amateur / jeunes / féminin</span>
      </div>

      {active && (
        <div className="ci-map-panel">
          <button type="button" className="ci-map-panel-close" onClick={() => setActiveId(null)} aria-label="Fermer"><X size={16} /></button>
          <p className="section-tag"><MapPin size={13} style={{ verticalAlign: 'middle' }} /> {active.regionName}</p>
          <h3 style={{ fontSize: 22, margin: '4px 0 12px' }}>{active.cityName}</h3>

          {active.competitionNames.length > 0 && (
            <div className="chip-row" style={{ marginBottom: 16 }}>
              {active.competitionNames.map((c) => <span className="chip" key={c}>{c}</span>)}
            </div>
          )}

          {active.clubs.length > 0 && (
            <>
              <p className="ci-map-panel-head"><ShieldHalf size={14} /> Clubs ({active.clubs.length})</p>
              <div className="ci-map-panel-list">
                {active.clubs.map((c) => (
                  <Link href={`/clubs/${c.slug}`} key={c.id} className="entity-card">
                    <ClubCrest club={c} size={32} />
                    <div><strong>{c.name}</strong><span>{c.category}</span></div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {active.stadiums.length > 0 && (
            <>
              <p className="ci-map-panel-head"><Landmark size={14} /> Stades ({active.stadiums.length})</p>
              <div className="ci-map-panel-list">
                {active.stadiums.map((s) => (
                  <Link href={`/stades/${s.slug}`} key={s.id} className="entity-card">
                    <Trophy size={16} color="var(--orange)" />
                    <div><strong>{s.name}</strong><span>{s.capacity.toLocaleString('fr-FR')} places</span></div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
