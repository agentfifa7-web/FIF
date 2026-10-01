'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, RotateCcw } from 'lucide-react'
import { cities } from '@/lib/data/mock'
import { useFanProfile, updateFanPreferences, resetFanProgress } from '@/lib/fan'
import { updateAccount, useAccount } from '@/lib/account'
import { PageHero } from '@/components/site/PageHero'
import { FanIdCard } from '@/components/site/FanIdCard'
import { SupportPicker, supportModeOf, type SupportMode } from '@/components/site/SupportPicker'
import { FanIdGate } from '@/components/site/FanIdGate'
import { DemoBadge } from '@/components/site/DemoBadge'

function SupporterSettings() {
  const { account } = useAccount()
  const { profile } = useFanProfile()
  const [support, setSupport] = useState<{ mode: SupportMode; nationalTeamId: string; clubId: string } | null>(null)
  const [pseudo, setPseudo] = useState('')
  const [cityId, setCityId] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!account || !profile || support) return
    setSupport({ mode: supportModeOf(account.favoriteNationalTeamId, account.favoriteClubId), nationalTeamId: account.favoriteNationalTeamId ?? '', clubId: account.favoriteClubId ?? '' })
    setPseudo(profile.pseudo)
    setCityId(profile.cityId)
  }, [account, profile, support])

  if (!account || !profile || !support) return null

  function save(e: React.FormEvent) {
    e.preventDefault()
    if (!support) return
    updateAccount({
      favoriteNationalTeamId: support.mode !== 'club' ? support.nationalTeamId || undefined : undefined,
      favoriteClubId: support.mode !== 'nation' ? support.clubId || undefined : undefined,
    })
    updateFanPreferences({ pseudo: pseudo.trim() || profile!.pseudo, cityId })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form className="form-card" style={{ margin: 0, maxWidth: 'none' }} onSubmit={save}>
      <h3 style={{ margin: '0 0 6px' }}>Mes équipes et mon profil supporter</h3>
      <p className="muted-sm" style={{ margin: '0 0 18px' }}>Rattaché à votre FIF ID {account.fifId} — un seul compte pour tout.</p>
      <span className="support-legend">Je supporte</span>
      <SupportPicker mode={support.mode} nationalTeamId={support.nationalTeamId} clubId={support.clubId} onChange={setSupport} idPrefix="fan" />
      <div className="text-field">
        <label htmlFor="fan-pseudo">Pseudo affiché (classements, Fan Zone)</label>
        <input id="fan-pseudo" value={pseudo} onChange={(e) => setPseudo(e.target.value)} maxLength={24} />
      </div>
      <div className="text-field">
        <label htmlFor="fan-city">Ville</label>
        <select id="fan-city" value={cityId} onChange={(e) => setCityId(e.target.value)}>
          <option value="">—</option>
          {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <button type="submit" className="button button-primary">{saved ? <><Check size={15} /> Enregistré</> : 'Enregistrer'}</button>
    </form>
  )
}

export default function FanIdPage() {
  const { profile, ready } = useFanProfile()

  function handleReset() {
    if (window.confirm('Remettre à zéro votre progression supporter ? Votre XP, vos badges et votre historique seront effacés (votre FIF ID et vos équipes sont conservés).')) {
      resetFanProgress()
    }
  }

  if (!ready) return null

  return (
    <main>
      <PageHero
        eyebrow="🪪 Fan Pass"
        title="Mon FIF Fan ID"
        subtitle="Votre carte de supporter, incluse dans votre FIF ID : équipes supportées, niveau, XP, badges et historique."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Fan ID' }]}
      />

      <section className="page-section tight">
        <FanIdGate title="Votre Fan ID est inclus dans votre FIF ID" hint="Pas de second compte : connectez-vous ou créez votre FIF ID avec votre numéro de téléphone, et toutes les fonctionnalités supporters sont activées automatiquement.">
          {() => profile && (
            <>
              <div className="card-grid cols-2" style={{ alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <FanIdCard profile={profile} />
                  <div className="info-tiles" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <div className="info-tile"><strong>{profile.pronostics.length}</strong><p>Matchs suivis (pronostics)</p></div>
                    <div className="info-tile"><strong>{Object.values(profile.quizAnswered).filter(Boolean).length}</strong><p>Quiz réussis</p></div>
                    <div className="info-tile"><strong>{profile.stadiumCheckIns.length}</strong><p>Stades visités</p></div>
                    <div className="info-tile"><strong>{profile.badges.length}</strong><p>Badges obtenus</p></div>
                  </div>
                </div>
                <SupporterSettings />
              </div>
              <div className="button-group" style={{ marginTop: 20 }}>
                <Link href="/supporters/badges" className="button-outline">Voir mes badges <ArrowRight size={14} /></Link>
                <Link href="/supporters/niveaux" className="button-outline">Voir les niveaux <ArrowRight size={14} /></Link>
                <Link href="/compte" className="button-outline">Mon compte FIF ID <ArrowRight size={14} /></Link>
                <button type="button" className="button-outline" onClick={handleReset}><RotateCcw size={14} /> Remettre à zéro ma progression</button>
              </div>
            </>
          )}
        </FanIdGate>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
