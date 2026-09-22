'use client'

import { CheckCircle2, Circle } from 'lucide-react'
import { buildFootballMapZones } from '@/lib/data/ci-geo'
import { useFanProfile, checkInStadium } from '@/lib/fan'
import { FanIdGate } from '@/components/site/FanIdGate'
import { IvoryCoastMap } from '@/components/site/IvoryCoastMap'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

const STAMPS = [
  { icon: '🇨🇮', label: 'Match des Éléphants' },
  { icon: '🏆', label: 'Finale Coupe Nationale FIF' },
  { icon: '⚽', label: 'Match de Ligue 1' },
  { icon: '👩', label: 'Match féminin' },
  { icon: '🧒', label: 'Match U17 / U20' },
]

export default function PasseportPage() {
  const zones = buildFootballMapZones()

  return (
    <main>
      <PageHero
        eyebrow="🎟️ Fan Pass"
        title="Passeport FIF & Football Tour"
        subtitle="Collectionnez des tampons numériques et visitez le football ivoirien : cliquez sur un pôle de la carte pour faire votre check-in FIF."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Passeport FIF' }]}
      />

      <section className="page-section tight">
        <p className="section-tag">Tampons du passeport</p>
        <div className="chip-row" style={{ marginTop: 12 }}>
          {STAMPS.map((s) => <span className="chip" key={s.label}>{s.icon} {s.label}</span>)}
        </div>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Football Tour de Côte d’Ivoire</p>
        <p className="lede" style={{ marginBottom: 16 }}>Objectif : visiter le football ivoirien. Chaque check-in débloque +40 XP et rapproche des badges « Premier Stade » et « Route des Éléphants ».</p>
        <FanIdGate title="Créez votre Fan ID pour faire un check-in" hint="La carte reste consultable librement ; le check-in nécessite un Fan ID.">
          {(profile) => (
            <>
              <IvoryCoastMap zones={zones} checkedInCityIds={profile.stadiumCheckIns} onCheckIn={checkInStadium} />
              <p className="section-tag" style={{ marginTop: 28 }}>Étapes ({profile.stadiumCheckIns.length}/{zones.length})</p>
              <div className="checkin-list" style={{ marginTop: 12 }}>
                {zones.map((z) => {
                  const done = profile.stadiumCheckIns.includes(z.cityId)
                  return (
                    <div className={`checkin-row${done ? ' done' : ''}`} key={z.cityId}>
                      {done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                      <div><strong>{z.cityName}</strong><span>{z.regionName}</span></div>
                      {done && <span className="status-pill ok">Visité</span>}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </FanIdGate>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
