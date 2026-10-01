'use client'

import { useState } from 'react'
import { CreditCard, Loader2, Lock, ShieldCheck, Smartphone } from 'lucide-react'
import { formatMoney } from '@/lib/format'
import { formatPhone, normalizePhone } from '@/lib/account'

export const PAYMENT_METHODS = [
  { id: 'orange', label: 'Orange Money', kind: 'mobile', color: '#ff7900' },
  { id: 'mtn', label: 'MTN Mobile Money', kind: 'mobile', color: '#ffcb05' },
  { id: 'moov', label: 'Moov Money', kind: 'mobile', color: '#0066b3' },
  { id: 'wave', label: 'Wave', kind: 'mobile', color: '#1dc4ff' },
  { id: 'card', label: 'Carte bancaire (Visa, Mastercard)', kind: 'card', color: '#041b12' },
  { id: 'fifid', label: 'Carte FIF ID', kind: 'soon', color: '#087443' },
] as const

type MethodId = (typeof PAYMENT_METHODS)[number]['id']

/**
 * Paiement en 2 temps : choix du moyen, puis validation (code reçu sur le
 * téléphone pour le Mobile Money, authentification bancaire pour la carte).
 * Prototype : aucun prélèvement réel, la validation est simulée.
 */
export function PaymentPanel({ amount, description, defaultPhone, onPaid, cta = 'Payer' }: {
  amount: number
  description: string
  defaultPhone?: string
  onPaid: (method: string) => void
  cta?: string
}) {
  const [method, setMethod] = useState<MethodId>('orange')
  const [local, setLocal] = useState(defaultPhone?.replace(/^\+225/, '') ?? '')
  const [step, setStep] = useState<'choose' | 'confirm' | 'processing'>('choose')
  const [code, setCode] = useState('')
  const [expected, setExpected] = useState('')
  const [error, setError] = useState('')
  const current = PAYMENT_METHODS.find((m) => m.id === method)!

  function start(e: React.FormEvent) {
    e.preventDefault()
    if (current.kind === 'soon') return
    if (current.kind === 'mobile' && !normalizePhone('+225', local)) return setError('Numéro Mobile Money invalide (10 chiffres).')
    setError('')
    setExpected(String(Math.floor(1000 + Math.random() * 9000)))
    setCode('')
    setStep('confirm')
  }

  function confirm(e: React.FormEvent) {
    e.preventDefault()
    if (current.kind === 'mobile' && code !== expected) return setError('Code de confirmation incorrect.')
    setError('')
    setStep('processing')
    window.setTimeout(() => onPaid(current.label), 1200)
  }

  if (step === 'processing') {
    return (
      <div className="pay-box pay-processing">
        <Loader2 className="spin" size={28} />
        <strong>Paiement en cours de validation…</strong>
        <span>{formatMoney(amount)} · {current.label}</span>
      </div>
    )
  }

  if (step === 'confirm') {
    return (
      <form className="pay-box" onSubmit={confirm}>
        <div className="pay-summary"><span>{description}</span><b>{formatMoney(amount)}</b></div>
        {current.kind === 'mobile' ? (
          <>
            <p className="pay-instruction"><Smartphone size={16} /> Une demande de paiement de <b>{formatMoney(amount)}</b> a été envoyée au <b>{formatPhone(normalizePhone('+225', local) ?? '')}</b> ({current.label}). Validez-la avec le code reçu.</p>
            <div className="otp-demo">Prototype : aucun prélèvement réel. Code de confirmation : <b>{expected}</b></div>
            <div className="text-field">
              <label htmlFor="pay-code">Code de confirmation</label>
              <input id="pay-code" inputMode="numeric" maxLength={4} required autoFocus value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} style={{ fontSize: 20, letterSpacing: '.4em', textAlign: 'center' }} />
            </div>
          </>
        ) : (
          <>
            <p className="pay-instruction"><Lock size={16} /> Vous allez être redirigé vers la page de paiement sécurisée de la banque (3-D Secure) pour régler <b>{formatMoney(amount)}</b>.</p>
            <div className="otp-demo">Prototype : la passerelle bancaire est simulée, aucune donnée de carte n’est demandée ni enregistrée.</div>
          </>
        )}
        {error && <p className="form-error">{error}</p>}
        <div className="form-actions">
          <button type="submit" className="button button-primary" style={{ justifyContent: 'center' }}><ShieldCheck size={16} /> Confirmer le paiement</button>
          <button type="button" className="button-outline" style={{ justifyContent: 'center' }} onClick={() => setStep('choose')}>Changer de moyen de paiement</button>
        </div>
      </form>
    )
  }

  return (
    <form className="pay-box" onSubmit={start}>
      <div className="pay-summary"><span>{description}</span><b>{formatMoney(amount)}</b></div>
      <div className="pay-methods" role="radiogroup" aria-label="Moyen de paiement">
        {PAYMENT_METHODS.map((m) => (
          <button key={m.id} type="button" role="radio" aria-checked={method === m.id} disabled={m.kind === 'soon'}
            className={method === m.id ? 'pay-method is-active' : 'pay-method'} onClick={() => { setMethod(m.id); setError('') }}>
            <i style={{ background: m.color }}>{m.kind === 'card' || m.kind === 'soon' ? <CreditCard size={14} /> : m.label[0]}</i>
            <span>{m.label}{m.kind === 'soon' && <small> — bientôt (partenaire bancaire)</small>}</span>
          </button>
        ))}
      </div>
      {current.kind === 'mobile' && (
        <div className="text-field">
          <label htmlFor="pay-phone">Numéro {current.label}</label>
          <div className="phone-input">
            <select aria-label="Indicatif" defaultValue="+225" disabled><option>🇨🇮 +225</option></select>
            <input id="pay-phone" type="tel" inputMode="tel" required placeholder="07 08 09 10 11" value={local} onChange={(e) => setLocal(e.target.value)} />
          </div>
        </div>
      )}
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="button button-primary" style={{ justifyContent: 'center', width: '100%' }}>
        <Lock size={15} /> {cta} {formatMoney(amount)}
      </button>
      <p className="pay-secure"><ShieldCheck size={13} /> Paiement sécurisé · aucun frais caché · reçu dans Mon compte</p>
    </form>
  )
}
