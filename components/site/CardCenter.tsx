'use client'

import Link from 'next/link'
import { useState } from 'react'
import { BellRing, CreditCard, IdCard, Printer, ShieldCheck } from 'lucide-react'
import { accountStatus, identityProgress, updateAccount, useAccount, type PhysicalCardRequest } from '@/lib/account'
import { FifIdCardBack, FifIdCardFlip, FifIdCardFront } from './FifIdCard'

const PICKUP = ['Retrait au siège de la FIF (Abidjan)', 'Retrait à la ligue régionale de ma région', 'Livraison à mon adresse']
const PHYSICAL_STEPS: PhysicalCardRequest['status'][] = ['Demande reçue', 'En fabrication', 'Disponible']

export function CardCenter() {
  const { account, ready } = useAccount()
  const [pickup, setPickup] = useState(PICKUP[0])

  if (!ready) return null
  if (!account) {
    return (
      <div className="dashboard-panel" style={{ margin: 0, maxWidth: 560 }}>
        <p className="lede">Connectez-vous ou créez votre FIF ID pour obtenir votre carte.</p>
        <div className="button-group"><Link href="/inscription" className="button button-primary">Créer mon FIF ID</Link><Link href="/connexion" className="button-outline">Se connecter</Link></div>
      </div>
    )
  }

  const progress = identityProgress(account)
  const status = accountStatus(account)
  const verified = status.tone === 'ok'
  const issued = Boolean(account.cardIssuedAt)
  const steps = [
    { label: 'FIF ID créé avec votre numéro de téléphone', done: true },
    { label: `Identité complète (${progress.done}/${progress.total})`, done: progress.complete },
    { label: account.role === 'Supporter' ? 'Vérification automatique (supporter)' : 'Vérification du matricule par la FIF', done: verified },
    { label: 'Carte numérique émise', done: issued },
  ]
  const current = steps.findIndex((s) => !s.done)
  const physicalIndex = account.physicalCard ? PHYSICAL_STEPS.indexOf(account.physicalCard.status) : -1

  return (
    <>
      <div className="card-center">
        <div className="card-faces">
          <FifIdCardFlip account={account} />
          <div className="button-group" style={{ justifyContent: 'center' }}>
            <button type="button" className="button-outline" onClick={() => window.print()} disabled={!issued} title={issued ? '' : 'Complétez votre identité pour obtenir la carte'}>
              <Printer size={15} /> Télécharger / imprimer
            </button>
            <Link href={`/verifier/${encodeURIComponent(account.fifId)}`} className="button-outline"><ShieldCheck size={15} /> Tester la vérification</Link>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="dashboard-panel" style={{ margin: 0 }}>
            <h3><IdCard size={17} style={{ verticalAlign: 'middle', marginRight: 6, color: 'var(--orange)' }} />Ma carte FIF ID</h3>
            <ol className="card-steps">
              {steps.map((s, i) => (
                <li key={s.label} className={s.done ? 'is-done' : i === current ? 'is-current' : ''}><b>{s.done ? '✓' : i + 1}</b>{s.label}</li>
              ))}
            </ol>
            {!progress.complete && (
              <>
                <div className="progress-track" style={{ marginTop: 16 }}><div className="progress-fill" style={{ width: `${(progress.done / progress.total) * 100}%` }} /></div>
                <p className="lede" style={{ fontSize: 13 }}>À compléter : {progress.missing.join(', ')}.</p>
                <Link href="/compte/identite" className="button button-primary">Compléter mon identité</Link>
              </>
            )}
            {progress.complete && <Link href="/compte/identite" className="text-link">Modifier mes informations →</Link>}
          </div>

          <div className="dashboard-panel" style={{ margin: 0 }}>
            <h3><CreditCard size={17} style={{ verticalAlign: 'middle', marginRight: 6, color: 'var(--orange)' }} />Carte physique</h3>
            {!account.physicalCard ? (
              <>
                <p className="lede" style={{ fontSize: 14 }}>Recevez votre carte FIF ID en PVC au format carte bancaire, avec photo, QR code de vérification et puce prête pour le paiement.</p>
                <div className="text-field">
                  <label htmlFor="pickup">Mode de remise</label>
                  <select id="pickup" value={pickup} onChange={(e) => setPickup(e.target.value)}>{PICKUP.map((p) => <option key={p}>{p}</option>)}</select>
                </div>
                <button type="button" className="button button-primary" disabled={!issued}
                  onClick={() => updateAccount({ physicalCard: { requestedAt: new Date().toISOString(), delivery: pickup, status: 'Demande reçue' } })}>
                  Commander ma carte physique
                </button>
                {!issued && <p className="lede" style={{ fontSize: 12 }}>Disponible dès que votre carte numérique est émise.</p>}
                <p className="lede" style={{ fontSize: 12 }}>Frais de fabrication et délais : communiqués par la FIF.</p>
              </>
            ) : (
              <>
                <ol className="card-steps">
                  {PHYSICAL_STEPS.map((s, i) => (
                    <li key={s} className={i <= physicalIndex ? 'is-done' : i === physicalIndex + 1 ? 'is-current' : ''}><b>{i <= physicalIndex ? '✓' : i + 1}</b>{s}</li>
                  ))}
                </ol>
                <p className="lede" style={{ fontSize: 13 }}>{account.physicalCard.delivery} · demandée le {new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(account.physicalCard.requestedAt))}.</p>
                <button type="button" className="text-link" style={{ background: 'none', border: 0, cursor: 'pointer', padding: 0 }} onClick={() => updateAccount({ physicalCard: undefined })}>Annuler la demande</button>
              </>
            )}
          </div>

          <div className="dashboard-panel" style={{ margin: 0 }}>
            <h3><BellRing size={17} style={{ verticalAlign: 'middle', marginRight: 6, color: 'var(--orange)' }} />Paiement avec la carte</h3>
            <span className="status-pill pending">Partenariat bancaire en préparation</span>
            <p className="lede" style={{ fontSize: 14 }}>
              Grâce au partenariat entre la FIF et une banque, votre carte FIF ID pourra servir de moyen de paiement : achats en ligne (billetterie, boutique FIF), paiement sans contact en magasin et au stade.
              L’activation se fera avec votre accord, après vérification de votre identité par la banque partenaire.
            </p>
            <label className="check-line">
              <input type="checkbox" checked={Boolean(account.paymentInterest)} onChange={(e) => updateAccount({ paymentInterest: e.target.checked })} />
              M’avertir par SMS dès que le paiement est disponible
            </label>
          </div>
        </div>
      </div>

      {issued && (
        <div className="fid-print" aria-hidden>
          <div className="fid-sizer"><FifIdCardFront account={account} /></div>
          <div className="fid-sizer"><FifIdCardBack account={account} /></div>
        </div>
      )}
    </>
  )
}
