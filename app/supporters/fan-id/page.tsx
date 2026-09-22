'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { cities, nationalTeams } from '@/lib/data/mock'
import { useFanProfile, createFanProfile, resetFanProfile } from '@/lib/fan'
import { PageHero } from '@/components/site/PageHero'
import { FanIdCard } from '@/components/site/FanIdCard'
import { DemoBadge } from '@/components/site/DemoBadge'

export default function FanIdPage() {
  const { profile, ready } = useFanProfile()
  const [pseudo, setPseudo] = useState('')
  const [cityId, setCityId] = useState(cities[0]?.id ?? '')
  const [teamId, setTeamId] = useState('nt-elephants')

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!pseudo.trim()) return
    createFanProfile(pseudo.trim(), cityId, teamId)
  }

  function handleReset() {
    if (window.confirm('Réinitialiser votre Fan ID ? Votre XP, vos badges et votre historique seront effacés de ce navigateur.')) {
      resetFanProfile()
    }
  }

  if (!ready) return null

  return (
    <main>
      <PageHero
        eyebrow="🪪 Fan Pass"
        title="Mon FIF Fan ID"
        subtitle="Votre identité numérique de supporter : photo, niveau, XP, badges et historique."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Fan ID' }]}
      />

      {profile ? (
        <>
          <section className="page-section tight">
            <div className="card-grid cols-2">
              <FanIdCard profile={profile} />
              <div>
                <p className="section-tag">Statistiques</p>
                <div className="info-tiles" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="info-tile"><strong>{profile.pronostics.length}</strong><p>Matchs suivis (pronostics)</p></div>
                  <div className="info-tile"><strong>{Object.values(profile.quizAnswered).filter(Boolean).length}</strong><p>Quiz réussis</p></div>
                  <div className="info-tile"><strong>{profile.stadiumCheckIns.length}</strong><p>Stades visités</p></div>
                  <div className="info-tile"><strong>{profile.badges.length}</strong><p>Badges obtenus</p></div>
                </div>
              </div>
            </div>
          </section>

          <section className="page-section tight">
            <div className="button-group">
              <Link href="/supporters/badges" className="button-outline">Voir mes badges <ArrowRight size={14} /></Link>
              <Link href="/supporters/niveaux" className="button-outline">Voir les niveaux <ArrowRight size={14} /></Link>
              <button type="button" className="button-outline" onClick={handleReset}><RotateCcw size={14} /> Réinitialiser mon Fan ID</button>
            </div>
            <p className="muted-sm" style={{ marginTop: 16 }}>Fan ID de démonstration : les données (XP, badges, pronostics) sont enregistrées uniquement dans ce navigateur, sans compte ni paiement réel.</p>
          </section>
        </>
      ) : (
        <section className="page-section tight">
          <form className="form-card" onSubmit={handleCreate}>
            <h1>Créer mon Fan ID</h1>
            <p className="muted-sm">Gratuit, sans donnée bancaire. Votre profil reste dans ce navigateur.</p>
            <div className="text-field">
              <label htmlFor="pseudo">Pseudo</label>
              <input id="pseudo" type="text" required placeholder="Votre pseudo de supporter" value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
            </div>
            <div className="text-field">
              <label htmlFor="city">Ville</label>
              <select id="city" value={cityId} onChange={(e) => setCityId(e.target.value)}>
                {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="text-field">
              <label htmlFor="team">Équipe favorite</label>
              <select id="team" value={teamId} onChange={(e) => setTeamId(e.target.value)}>
                {nationalTeams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="button button-primary" style={{ justifyContent: 'center' }}>Créer mon Fan ID</button>
            </div>
          </form>
        </section>
      )}

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
