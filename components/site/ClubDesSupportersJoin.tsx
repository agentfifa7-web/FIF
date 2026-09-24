'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Gift } from 'lucide-react'
import { FanIdGate } from './FanIdGate'
import { subscribeMembership, type FanProfile } from '@/lib/fan'
import { formatMoney } from '@/lib/format'

export interface MembershipTier {
  name: string
  price: number
  tagline: string
  benefits: string[]
}

function MembershipCard({ tier, selected, onSelect }: { tier: MembershipTier; selected: boolean; onSelect: () => void }) {
  return (
    <div className="dashboard-panel" style={{ borderColor: selected ? 'var(--orange)' : undefined, display: 'flex', flexDirection: 'column', margin: 0 }}>
      <h3>{tier.name}</h3>
      <p className="lede" style={{ marginTop: 4 }}>{tier.tagline}</p>
      <p style={{ fontSize: 28, fontWeight: 800, margin: '10px 0' }}>{formatMoney(tier.price)}<span style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 400 }}> / an</span></p>
      <ul className="honour-list" style={{ flex: 1 }}>
        {tier.benefits.map((b, i) => (
          <li key={i}><span><CheckCircle2 size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} color="var(--green)" />{b}</span></li>
        ))}
      </ul>
      <button
        type="button"
        className={selected ? 'button button-primary' : 'button-outline'}
        style={{ justifyContent: 'center', marginTop: 16 }}
        onClick={onSelect}
      >
        {selected ? 'Sélectionné' : 'Choisir cette formule'}
      </button>
    </div>
  )
}

function JoinForm({ tier, profile }: { tier: MembershipTier; profile: FanProfile }) {
  const [gift, setGift] = useState(false)
  const [recipient, setRecipient] = useState('')
  const [confirmed, setConfirmed] = useState<FanProfile['membership']>(profile.membership)

  if (confirmed) {
    return (
      <div className="dashboard-panel" style={{ borderColor: 'var(--green)', margin: 0, maxWidth: 520 }}>
        <div style={{ alignItems: 'center', display: 'flex', gap: 14 }}>
          <CheckCircle2 size={22} color="var(--green)" style={{ flexShrink: 0 }} />
          <div>
            <strong>Adhésion confirmée (démonstration)</strong>
            <p className="lede" style={{ margin: '4px 0 0' }}>Formule {confirmed.tier}{confirmed.giftedTo ? ` — offerte à ${confirmed.giftedTo}` : ''}</p>
            <p className="lede" style={{ margin: '4px 0 0' }}>N° membre : <b>{confirmed.memberNumber}</b></p>
          </div>
        </div>
      </div>
    )
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const updated = subscribeMembership(tier.name, gift ? recipient : undefined)
    setConfirmed(updated?.membership ?? null)
  }

  return (
    <form className="form-card" style={{ margin: 0, maxWidth: 520 }} onSubmit={submit}>
      <h1 style={{ fontSize: 20 }}>Je m’abonne</h1>
      <p className="muted-sm">Formule sélectionnée : <b>{tier.name}</b> — {formatMoney(tier.price)} / an</p>
      <div className="text-field" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <input id="cds-gift" type="checkbox" checked={gift} onChange={(e) => setGift(e.target.checked)} style={{ height: 16, width: 16 }} />
        <label htmlFor="cds-gift" style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}><Gift size={14} /> Offrir cet abonnement</label>
      </div>
      {gift && (
        <div className="text-field">
          <label htmlFor="cds-recipient">Nom du destinataire</label>
          <input id="cds-recipient" type="text" required value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Prénom Nom" />
        </div>
      )}
      <div className="form-actions">
        <button type="submit" className="button button-primary" style={{ justifyContent: 'center' }}>
          {gift ? 'Offrir l’abonnement' : 'Confirmer mon adhésion'}
        </button>
      </div>
      <p className="lede" style={{ fontSize: 12, marginTop: 6 }}>Démonstration locale : aucun paiement réel n’est effectué.</p>
    </form>
  )
}

export function ClubDesSupportersJoin({ tiers }: { tiers: MembershipTier[] }) {
  const [selected, setSelected] = useState(1)

  return (
    <>
      <div className="card-grid cols-3" style={{ marginTop: 16 }}>
        {tiers.map((tier, i) => (
          <MembershipCard key={tier.name} tier={tier} selected={selected === i} onSelect={() => setSelected(i)} />
        ))}
      </div>

      <div style={{ marginTop: 28 }}>
        <FanIdGate title="Créez votre Fan ID pour vous abonner" hint="Le Club des Supporters s’appuie sur votre Fan ID — identité numérique gratuite, créée en quelques secondes.">
          {(profile) => <JoinForm tier={tiers[selected]} profile={profile} />}
        </FanIdGate>
      </div>
    </>
  )
}
