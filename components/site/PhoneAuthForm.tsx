'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { MessageSquareText, Smartphone } from 'lucide-react'
import { ACCOUNT_ROLES, createAccount, DIAL_CODES, findAccount, formatPhone, generateOtp, normalizePhone, signIn, type AccountRole } from '@/lib/account'

// Création ou connexion à un FIF ID avec le seul numéro de téléphone :
// 1) saisie du numéro (et du nom pour une création), 2) code reçu par SMS.
export function PhoneAuthForm({ mode }: { mode: 'signup' | 'login' }) {
  const router = useRouter()
  const [dial, setDial] = useState('+225')
  const [local, setLocal] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<AccountRole>('Supporter')
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [phone, setPhone] = useState('')
  const [sentCode, setSentCode] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  function sendCode(e: React.FormEvent) {
    e.preventDefault()
    setNotFound(false)
    const normalized = normalizePhone(dial, local)
    if (!normalized) {
      return setError(dial === '+225' ? 'Numéro invalide : 10 chiffres attendus, par exemple 07 08 09 10 11.' : 'Numéro invalide.')
    }
    if (mode === 'signup' && fullName.trim().length < 3) return setError('Indiquez votre nom complet.')
    if (mode === 'login' && !findAccount(normalized)) {
      setNotFound(true)
      return setError('Aucun FIF ID n’est associé à ce numéro.')
    }
    setError('')
    setPhone(normalized)
    setSentCode(generateOtp())
    setCode('')
    setStep('code')
  }

  function verify(e: React.FormEvent) {
    e.preventDefault()
    if (code.trim() !== sentCode) return setError('Code incorrect. Vérifiez le SMS reçu.')
    if (mode === 'signup') createAccount({ phone, fullName: fullName.trim(), role })
    else signIn(phone)
    router.push('/compte')
  }

  if (step === 'code') {
    return (
      <form onSubmit={verify}>
        <p className="muted-sm" style={{ marginBottom: 16 }}>
          <MessageSquareText size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Un code à 6 chiffres a été envoyé par SMS au <b>{formatPhone(phone)}</b>.
        </p>
        <div className="otp-demo">Prototype : aucun SMS n’est réellement envoyé. Votre code est <b>{sentCode}</b>.</div>
        <div className="text-field">
          <label htmlFor="otp">Code reçu par SMS</label>
          <input id="otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required autoFocus placeholder="••••••"
            value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} style={{ fontSize: 22, letterSpacing: '.4em', textAlign: 'center' }} />
        </div>
        {error && <p className="form-error" style={{ marginBottom: 12 }}>{error}</p>}
        <div className="form-actions">
          <button type="submit" className="button button-primary" style={{ justifyContent: 'center' }}>{mode === 'signup' ? 'Valider et créer mon FIF ID' : 'Valider et me connecter'}</button>
          <button type="button" className="button-outline" style={{ justifyContent: 'center' }} onClick={() => { setSentCode(generateOtp()); setCode(''); setError('') }}>Renvoyer un code</button>
          <button type="button" className="text-link" style={{ background: 'none', border: 0, cursor: 'pointer', justifyContent: 'center' }} onClick={() => { setStep('phone'); setError('') }}>Modifier le numéro</button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={sendCode}>
      {mode === 'signup' && (
        <div className="text-field">
          <label htmlFor="name">Nom complet</label>
          <input id="name" type="text" required autoComplete="name" placeholder="Prénom et nom" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
      )}
      <div className="text-field">
        <label htmlFor="phone">Numéro de téléphone</label>
        <div className="phone-input">
          <select aria-label="Indicatif pays" value={dial} onChange={(e) => setDial(e.target.value)}>
            {DIAL_CODES.map((d) => <option key={d.code} value={d.code}>{d.code === '+225' ? '🇨🇮 +225' : d.label}</option>)}
          </select>
          <input id="phone" type="tel" inputMode="tel" autoComplete="tel-national" required placeholder={dial === '+225' ? '07 08 09 10 11' : 'Numéro'} value={local} onChange={(e) => setLocal(e.target.value)} />
        </div>
      </div>
      {mode === 'signup' && (
        <div className="text-field">
          <label htmlFor="role">Je suis…</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value as AccountRole)}>
            {ACCOUNT_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      )}
      {error && (
        <p className="form-error" style={{ marginBottom: 12 }}>
          {error}{notFound && <> <Link href="/inscription" className="text-link" style={{ display: 'inline' }}>Créer un FIF ID</Link></>}
        </p>
      )}
      <div className="form-actions">
        <button type="submit" className="button button-primary" style={{ justifyContent: 'center' }}>
          <Smartphone size={16} /> Recevoir mon code par SMS
        </button>
      </div>
      <p className="muted-sm" style={{ margin: '14px 0 0' }}>Pas d’email ni de mot de passe : votre numéro de téléphone suffit.</p>
    </form>
  )
}
