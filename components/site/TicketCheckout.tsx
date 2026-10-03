'use client'

import { getSettings } from '@/lib/cms/runtime'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Minus, Plus, Printer, Ticket as TicketIcon, UserRound } from 'lucide-react'
import type { TicketEvent, TicketTierId } from '@/lib/data/tickets'
import { formatMoney } from '@/lib/format'
import { useAccount } from '@/lib/account'
import { createOrder, readTickets, type Ticket } from '@/lib/tickets'
import { StadiumMap, TIER_COLORS } from './StadiumMap'
import { PaymentPanel } from './PaymentPanel'
import { DigitalTicket } from './DigitalTicket'

const STEPS = ['Places', 'Titulaires', 'Paiement', 'Billets']

function TicketCheckoutInner({ event }: { event: TicketEvent }) {
  const { account, ready } = useAccount()
  const storageKey = `fif-checkout-${event.slug}`
  const [step, setStep] = useState(0)
  const [qty, setQty] = useState<Partial<Record<TicketTierId, number>>>({})
  const [focusTier, setFocusTier] = useState<TicketTierId | undefined>(event.tiers[0]?.id)
  const [holders, setHolders] = useState<string[]>([])
  const [error, setError] = useState('')
  const [issued, setIssued] = useState<Ticket[]>([])

  // Conserve la sélection si l'utilisateur doit se connecter en cours de route.
  useEffect(() => {
    try {
      const saved = JSON.parse(window.sessionStorage.getItem(storageKey) ?? 'null')
      if (saved?.qty) { setQty(saved.qty); if (saved.step) setStep(saved.step) }
    } catch { /* rien */ }
  }, [storageKey])
  useEffect(() => {
    try { window.sessionStorage.setItem(storageKey, JSON.stringify({ qty, step: step < 2 ? step : 0 })) } catch { /* rien */ }
  }, [qty, step, storageKey])

  const lines = useMemo(() => event.tiers.map((t) => ({ tier: t, qty: qty[t.id] ?? 0 })).filter((l) => l.qty > 0), [event.tiers, qty])
  const count = lines.reduce((n, l) => n + l.qty, 0)
  const total = lines.reduce((s, l) => s + l.qty * l.tier.price, 0)

  useEffect(() => {
    setHolders((h) => Array.from({ length: count }, (_, i) => h[i] ?? (i === 0 && account ? account.fullName : '')))
  }, [count, account])

  function change(id: TicketTierId, delta: number) {
    setError('')
    setFocusTier(id)
    setQty((q) => {
      const next = Math.max(0, (q[id] ?? 0) + delta)
      const others = Object.entries(q).filter(([k]) => k !== id).reduce((n, [, v]) => n + (v ?? 0), 0)
      if (others + next > event.maxPerOrder) { setError(`${event.maxPerOrder} billets maximum par commande.`); return q }
      return { ...q, [id]: next }
    })
  }

  function toHolders() {
    if (!count) return setError('Choisissez au moins un billet.')
    setError(''); setStep(1)
  }

  function toPayment() {
    if (holders.some((h) => h.trim().length < 3)) return setError('Indiquez le nom et le prénom de chaque titulaire (billets nominatifs).')
    setError(''); setStep(2)
  }

  function paid(method: string) {
    if (!account) return
    const order = createOrder({
      event,
      lines: lines.map((l) => ({ tierId: l.tier.id, qty: l.qty })),
      holders,
      buyerName: account.fullName,
      buyerPhone: account.phone,
      payment: method,
    })
    const all = readTickets()
    setIssued(order.ticketIds.map((id) => all.find((t) => t.id === id)!).filter(Boolean))
    try { window.sessionStorage.removeItem(storageKey) } catch { /* rien */ }
    setStep(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const summary = (
    <aside className="checkout-summary">
      <p className="section-tag">Récapitulatif</p>
      {lines.length === 0 ? <p className="lede" style={{ fontSize: 14 }}>Aucun billet sélectionné.</p> : (
        <ul className="cart-recap">
          {lines.map((l) => <li key={l.tier.id}><span><i className="tier-dot" style={{ background: TIER_COLORS[l.tier.id] }} />{l.qty} × {l.tier.name}</span><b>{formatMoney(l.qty * l.tier.price)}</b></li>)}
          <li><span>Frais de service</span><b>Offerts</b></li>
          <li className="is-total"><span>Total</span><b>{formatMoney(total)}</b></li>
        </ul>
      )}
      <p className="checkout-note">Billets nominatifs · places côte à côte · {event.maxPerOrder} billets max. par commande.</p>
    </aside>
  )

  return (
    <div className="checkout">
      <ol className="checkout-steps">
        {STEPS.map((s, i) => <li key={s} className={i === step ? 'is-current' : i < step ? 'is-done' : ''}><b>{i < step ? '✓' : i + 1}</b>{s}</li>)}
      </ol>

      {step === 0 && (
        <div className="checkout-grid">
          <div>
            <StadiumMap tiers={event.tiers} selected={focusTier} onSelect={setFocusTier} />
            <div className="tier-list">
              {event.tiers.map((t) => (
                <div key={t.id} className={`tier-row${focusTier === t.id ? ' is-focus' : ''}`} onClick={() => setFocusTier(t.id)}>
                  <i className="tier-dot" style={{ background: TIER_COLORS[t.id] }} />
                  <div className="tier-info">
                    <strong>{t.name}</strong>
                    <span>{t.perks}</span>
                    <small className={t.availability === 'Disponible' ? 'avail-ok' : 'avail-low'}>{t.availability} · {t.gate}</small>
                  </div>
                  <b className="tier-price">{formatMoney(t.price)}</b>
                  <div className="cart-line-qty">
                    <button type="button" className="option-chip" aria-label={`Retirer un billet ${t.name}`} onClick={(e) => { e.stopPropagation(); change(t.id, -1) }}><Minus size={13} /></button>
                    <b>{qty[t.id] ?? 0}</b>
                    <button type="button" className="option-chip" aria-label={`Ajouter un billet ${t.name}`} disabled={t.availability === 'Complet'} onClick={(e) => { e.stopPropagation(); change(t.id, 1) }}><Plus size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            {summary}
            {error && <p className="form-error" style={{ marginTop: 12 }}>{error}</p>}
            <button type="button" className="button button-primary" style={{ justifyContent: 'center', marginTop: 14, width: '100%' }} onClick={toHolders} disabled={!count}>
              Continuer — {count} billet{count > 1 ? 's' : ''} <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="checkout-grid">
          <div className="dashboard-panel" style={{ margin: 0 }}>
            {!ready ? null : !account ? (
              <>
                <h3><UserRound size={17} style={{ verticalAlign: 'middle', marginRight: 6 }} />Identifiez-vous avec votre FIF ID</h3>
                <p className="lede" style={{ fontSize: 14 }}>Les billets sont nominatifs et rattachés à votre compte : connectez-vous avec votre numéro de téléphone (code SMS). Votre sélection est conservée.</p>
                <div className="button-group">
                  <Link href={`/connexion?next=${encodeURIComponent(`/billetterie/${event.slug}`)}`} className="button button-primary">Se connecter</Link>
                  <Link href={`/inscription?next=${encodeURIComponent(`/billetterie/${event.slug}`)}`} className="button-outline">Créer mon FIF ID</Link>
                </div>
              </>
            ) : (
              <>
                <h3>Titulaires des billets</h3>
                <p className="lede" style={{ fontSize: 14 }}>Chaque billet porte le nom de la personne qui l’utilisera. Une pièce d’identité ou la carte FIF ID pourra être demandée à l’entrée.</p>
                {(() => {
                  let i = 0
                  return lines.flatMap((l) => Array.from({ length: l.qty }, () => {
                    const idx = i++
                    return (
                      <div className="text-field" key={idx}>
                        <label htmlFor={`holder-${idx}`}>Billet {idx + 1} — {l.tier.name}</label>
                        <input id={`holder-${idx}`} required placeholder="Prénom et nom" value={holders[idx] ?? ''} onChange={(e) => setHolders((h) => h.map((v, j) => (j === idx ? e.target.value : v)))} />
                      </div>
                    )
                  }))
                })()}
              </>
            )}
            {error && <p className="form-error">{error}</p>}
            <div className="button-group" style={{ marginTop: 8 }}>
              <button type="button" className="button-outline" onClick={() => { setStep(0); setError('') }}><ArrowLeft size={15} /> Modifier les places</button>
              {account && <button type="button" className="button button-primary" onClick={toPayment}>Passer au paiement <ArrowRight size={15} /></button>}
            </div>
          </div>
          {summary}
        </div>
      )}

      {step === 2 && account && (
        <div className="checkout-grid">
          <div>
            <PaymentPanel amount={total} description={`${count} billet${count > 1 ? 's' : ''} — ${event.home.name} – ${event.away.name}`} defaultPhone={account.phone} onPaid={paid} />
            <button type="button" className="button-outline" style={{ marginTop: 12 }} onClick={() => setStep(1)}><ArrowLeft size={15} /> Retour</button>
          </div>
          {summary}
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="dashboard-panel checkout-success" style={{ margin: '0 0 20px' }}>
            <h3><TicketIcon size={18} style={{ verticalAlign: 'middle', marginRight: 6, color: 'var(--green)' }} />Paiement confirmé — vos billets sont prêts</h3>
            <p className="lede" style={{ fontSize: 14 }}>Présentez le QR code à l’entrée, directement sur votre téléphone, ou imprimez vos billets. Ils restent disponibles dans « Mes billets ».</p>
            <div className="button-group">
              <button type="button" className="button button-primary" onClick={() => window.print()}><Printer size={15} /> Imprimer / enregistrer en PDF</button>
              <Link href="/billetterie/mes-billets" className="button-outline">Mes billets</Link>
            </div>
          </div>
          <div className="e-ticket-list print-area">
            {issued.map((t) => <DigitalTicket key={t.id} ticket={t} />)}
          </div>
        </div>
      )}
    </div>
  )
}

/** Fermeture possible depuis Admin → Paramètres. */
export function TicketCheckout(props: Parameters<typeof TicketCheckoutInner>[0]) {
  if (!getSettings().ticketingOpen) return <p className="sales-closed">La vente de billets en ligne est momentanément fermée. Revenez un peu plus tard.</p>
  return <TicketCheckoutInner {...props} />
}
