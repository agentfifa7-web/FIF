'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CalendarDays, CheckCircle2, GraduationCap, MapPin, UserRound } from 'lucide-react'
import type { AcademyProgram } from '@/lib/data/academy'
import { formatMoney } from '@/lib/format'
import { useAccount } from '@/lib/account'
import { enrollInProgram, useAcademy } from '@/lib/academy'
import { PaymentPanel } from './PaymentPanel'

const fmt = (d: string) => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${d}T12:00:00`))

export function ProgramEnroll({ program }: { program: AcademyProgram }) {
  const { account, ready } = useAccount()
  const { enrollments } = useAcademy(account?.phone)
  const [sessionId, setSessionId] = useState(program.sessions[0]?.id ?? '')
  const [plan, setPlan] = useState<'comptant' | '3 fois'>('comptant')
  const [step, setStep] = useState<'choose' | 'pay'>('choose')
  const enrolled = enrollments.find((e) => e.slug === program.slug)
  const session = program.sessions.find((s) => s.id === sessionId)
  const amount = plan === '3 fois' ? Math.ceil(program.price / 3) : program.price

  if (program.applyOnly) {
    return (
      <div className="enroll-box">
        <p className="enroll-price">Sur candidature</p>
        <p className="lede" style={{ fontSize: 14 }}>La Licence CAF Pro est organisée par la CAF. La FIF, via sa Direction technique nationale, propose les candidats remplissant les conditions.</p>
        <a className="button button-primary" style={{ justifyContent: 'center' }} href={`mailto:contact@fif.ci?subject=${encodeURIComponent('Candidature Licence CAF Pro')}`}>Déposer ma candidature</a>
      </div>
    )
  }

  if (enrolled) {
    return (
      <div className="enroll-box">
        <p className="enroll-ok"><CheckCircle2 size={18} /> Vous êtes inscrit(e)</p>
        <p className="lede" style={{ fontSize: 14, margin: 0 }}>{enrolled.sessionLabel}</p>
        {enrolled.diplomaNo && <p className="lede" style={{ fontSize: 14, margin: 0 }}>Diplôme obtenu : <b>{enrolled.diplomaNo}</b></p>}
        <Link href={`/formation/espace/${program.slug}`} className="button button-primary" style={{ justifyContent: 'center' }}><GraduationCap size={16} /> Accéder à mon espace de formation</Link>
      </div>
    )
  }

  return (
    <div className="enroll-box">
      <p className="enroll-price">{formatMoney(program.price)}</p>
      {program.installments && <p className="enroll-sub">ou 3 × {formatMoney(Math.ceil(program.price / 3))} sans frais</p>}

      {step === 'choose' && (
        <>
          <div className="purchase-field">
            <span>Session</span>
            <div className="session-list">
              {program.sessions.map((s) => (
                <button key={s.id} type="button" className={sessionId === s.id ? 'session-opt is-active' : 'session-opt'} onClick={() => setSessionId(s.id)}>
                  <b><MapPin size={13} /> {s.city} · {s.mode}</b>
                  <span><CalendarDays size={13} /> {fmt(s.start)} → {fmt(s.end)}</span>
                  <small>{s.seats} places</small>
                </button>
              ))}
            </div>
          </div>
          {program.installments && (
            <div className="purchase-field">
              <span>Règlement</span>
              <div className="option-row">
                <button type="button" className={plan === 'comptant' ? 'option-chip is-active' : 'option-chip'} onClick={() => setPlan('comptant')}>Comptant</button>
                <button type="button" className={plan === '3 fois' ? 'option-chip is-active' : 'option-chip'} onClick={() => setPlan('3 fois')}>En 3 fois</button>
              </div>
            </div>
          )}
          {!ready ? null : !account ? (
            <>
              <p className="lede" style={{ fontSize: 13, margin: 0 }}><UserRound size={14} style={{ verticalAlign: 'middle' }} /> L’inscription est rattachée à votre FIF ID : votre diplôme portera votre identité.</p>
              <Link href={`/connexion?next=${encodeURIComponent(`/formation/${program.slug}`)}`} className="button button-primary" style={{ justifyContent: 'center' }}>Se connecter pour s’inscrire</Link>
              <Link href={`/inscription?next=${encodeURIComponent(`/formation/${program.slug}`)}`} className="button-outline" style={{ justifyContent: 'center' }}>Créer mon FIF ID</Link>
            </>
          ) : (
            <button type="button" className="button button-primary" style={{ justifyContent: 'center' }} disabled={!session} onClick={() => setStep('pay')}>
              S’inscrire — {formatMoney(amount)}{plan === '3 fois' ? ' (1er versement)' : ''}
            </button>
          )}
        </>
      )}

      {step === 'pay' && account && session && (
        <>
          <PaymentPanel
            amount={amount}
            description={`${program.title} — ${session.city}${plan === '3 fois' ? ' (1/3)' : ''}`}
            defaultPhone={account.phone}
            cta="Payer"
            onPaid={(method) => enrollInProgram({ program, sessionId: session.id, sessionLabel: `${session.city} · ${fmt(session.start)} → ${fmt(session.end)} · ${session.mode}`, phone: account.phone, name: account.fullName, plan, payment: method })}
          />
          <button type="button" className="button-outline" onClick={() => setStep('choose')}>Retour</button>
        </>
      )}
      <p className="enroll-note">Tarif indicatif · calendrier prévisionnel · facture disponible dans Mon compte.</p>
    </div>
  )
}
