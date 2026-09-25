'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { upcomingMatches, getClubById, nextElephantsFixture } from '@/lib/data/mock'
import { recordPronostic, type FanProfile } from '@/lib/fan'
import { FanIdGate } from '@/components/site/FanIdGate'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'
import { formatDate } from '@/lib/format'

interface PronosticTarget { id: string; home: string; away: string; competition: string; date: string }

function buildTargets(): PronosticTarget[] {
  const targets: PronosticTarget[] = []
  const fixture = nextElephantsFixture()
  if (fixture) {
    targets.push({
      id: fixture.slug,
      home: fixture.home ? 'Côte d’Ivoire' : fixture.opponent,
      away: fixture.home ? fixture.opponent : 'Côte d’Ivoire',
      competition: fixture.competition,
      date: fixture.date,
    })
  }
  for (const m of upcomingMatches(6)) {
    const home = getClubById(m.homeClubId)
    const away = getClubById(m.awayClubId)
    if (!home || !away) continue
    targets.push({ id: m.id, home: home.name, away: away.name, competition: 'Championnat', date: m.date })
  }
  return targets
}

function PronosticRow({ target, profile }: { target: PronosticTarget; profile: FanProfile }) {
  const existing = profile.pronostics.find((p) => p.matchId === target.id)
  const [home, setHome] = useState(existing?.homeScore ?? 0)
  const [away, setAway] = useState(existing?.awayScore ?? 0)
  const [submitted, setSubmitted] = useState(Boolean(existing))

  function submit(e: React.FormEvent) {
    e.preventDefault()
    recordPronostic(target.id, home, away)
    setSubmitted(true)
  }

  return (
    <form className="pronostic-card" onSubmit={submit}>
      <p className="quiz-progress">{target.competition} · {formatDate(target.date)}</p>
      <div className="pronostic-teams" style={{ marginTop: 10 }}>
        <div><strong>{target.home}</strong></div>
        <div className="pronostic-score">
          <input type="number" min={0} value={home} onChange={(e) => setHome(Number(e.target.value))} aria-label={`Score ${target.home}`} />
          <span>—</span>
          <input type="number" min={0} value={away} onChange={(e) => setAway(Number(e.target.value))} aria-label={`Score ${target.away}`} />
        </div>
        <div><strong>{target.away}</strong></div>
      </div>
      <div className="form-actions" style={{ marginTop: 14 }}>
        <button type="submit" className="button button-primary" style={{ justifyContent: 'center' }}>{submitted ? 'Mettre à jour mon pronostic' : 'Valider mon pronostic'}</button>
      </div>
      {submitted && <p className="pronostic-submitted"><CheckCircle2 size={14} /> Pronostic enregistré (+20 XP)</p>}
    </form>
  )
}

export default function PronosticsPage() {
  return (
    <main>
      <PageHero
        eyebrow="🔮 Fan Arena"
        title="FIF Prédictions"
        subtitle="Prédisez le score des prochains matchs. Aucune mise, aucun gain monétaire — uniquement des points XP."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Fan Arena', href: '/supporters/arena' }, { label: 'Pronostics' }]}
      />
      <section className="page-section tight">
        <FanIdGate title="Créez votre Fan ID pour pronostiquer" hint="Vos pronostics comptent pour votre XP et le classement des pronostiqueurs.">
          {(profile) => {
            const targets = buildTargets()
            return (
              <div className="card-grid cols-2">
                {targets.map((t) => <PronosticRow key={t.id} target={t} profile={profile} />)}
              </div>
            )
          }}
        </FanIdGate>
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
