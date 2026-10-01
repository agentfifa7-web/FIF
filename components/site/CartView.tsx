'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import type { Product } from '@/lib/data/types'
import { formatMoney } from '@/lib/format'
import { ProductArt } from './ProductArt'
import { clearCart, FLOCAGE_PRICE, removeLine, saveOrder, setQty, useCart, type ShopOrder } from '@/lib/cart'

const DELIVERY = [
  { id: 'retrait', label: 'Retrait au siège de la FIF (Abidjan)', price: 0 },
  { id: 'abidjan', label: 'Livraison à Abidjan (24 — 48 h)', price: 2000 },
  { id: 'interieur', label: 'Livraison à l’intérieur du pays (3 — 5 jours)', price: 5000 },
]

const PAYMENTS = ['Orange Money', 'MTN Mobile Money', 'Moov Money', 'Wave', 'Carte bancaire', 'Paiement à la livraison']

export function CartView({ products }: { products: Product[] }) {
  const lines = useCart()
  const [delivery, setDelivery] = useState(DELIVERY[1].id)
  const [payment, setPayment] = useState(PAYMENTS[0])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [order, setOrder] = useState<ShopOrder | null>(null)

  const detailed = lines
    .map((l) => {
      const p = products.find((x) => x.id === l.productId)
      return p ? { ...l, product: p, unitPrice: p.price + (l.flocage ? FLOCAGE_PRICE : 0) } : null
    })
    .filter((l): l is NonNullable<typeof l> => l !== null)
  const subtotal = detailed.reduce((s, l) => s + l.unitPrice * l.qty, 0)
  const deliveryOpt = DELIVERY.find((d) => d.id === delivery) ?? DELIVERY[0]
  const total = subtotal + deliveryOpt.price
  const needsAddress = deliveryOpt.id !== 'retrait'

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const o: ShopOrder = {
      ref: `FIF-STORE-${Date.now().toString(36).toUpperCase()}`,
      date: new Date().toISOString(),
      lines: detailed.map(({ product, ...l }) => ({ ...l, name: product.name })),
      subtotal,
      delivery: { label: deliveryOpt.label, price: deliveryOpt.price },
      total,
      customer: { name: name.trim(), phone: phone.trim(), address: needsAddress ? address.trim() : 'Retrait au siège' },
      payment,
    }
    saveOrder(o)
    clearCart()
    setOrder(o)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (order) {
    return (
      <div className="dashboard-panel" style={{ borderColor: 'var(--green)', margin: 0, maxWidth: 720 }}>
        <div style={{ alignItems: 'center', display: 'flex', gap: 14 }}>
          <CheckCircle2 size={24} color="var(--green)" style={{ flexShrink: 0 }} />
          <div>
            <strong>Commande enregistrée (démonstration)</strong>
            <p className="lede" style={{ margin: '4px 0 0' }}>Référence : <b>{order.ref}</b> · Total : <b>{formatMoney(order.total)}</b></p>
          </div>
        </div>
        <ul className="cart-recap">
          {order.lines.map((l) => (
            <li key={l.key}><span>{l.qty} × {l.name}{l.size ? ` — ${l.size}` : ''}{l.flocage ? ` — floqué ${l.flocage.name} ${l.flocage.number}` : ''}</span><b>{formatMoney(l.unitPrice * l.qty)}</b></li>
          ))}
          <li><span>{order.delivery.label}</span><b>{order.delivery.price ? formatMoney(order.delivery.price) : 'Offert'}</b></li>
        </ul>
        <p className="lede" style={{ fontSize: 13 }}>Paiement choisi : <b>{order.payment}</b>. Un conseiller FIF Store contacterait {order.customer.name} au {order.customer.phone} pour confirmer la commande.</p>
        <p className="lede" style={{ fontSize: 12 }}>Démonstration locale : aucun paiement réel n’est effectué et aucune commande n’est transmise.</p>
        <Link href="/boutique" className="button button-primary" style={{ marginTop: 8 }}>Retour à la boutique</Link>
      </div>
    )
  }

  if (detailed.length === 0) {
    return (
      <div className="dashboard-panel" style={{ margin: 0, maxWidth: 560, textAlign: 'center' }}>
        <ShoppingBag size={28} color="var(--muted)" />
        <p className="lede">Votre panier est vide.</p>
        <Link href="/boutique" className="button button-primary">Découvrir la boutique</Link>
      </div>
    )
  }

  return (
    <div className="cart-layout">
      <div className="cart-lines">
        {detailed.map((l) => (
          <div className="cart-line" key={l.key}>
            <Link href={`/boutique/${l.product.id}`} className="cart-thumb">
              {l.product.photo ? <img src={l.product.photo} alt={l.product.name} /> : <ProductArt product={l.product} />}
            </Link>
            <div className="cart-line-info">
              <Link href={`/boutique/${l.product.id}`}><strong>{l.product.name}</strong></Link>
              <span>
                {[l.color, l.size && `${l.product.category === 'Crampons' ? 'Pointure' : 'Taille'} ${l.size}`, l.flocage && `Floquage ${l.flocage.name} ${l.flocage.number}`].filter(Boolean).join(' · ')}
              </span>
              <span>{formatMoney(l.unitPrice)} l’unité</span>
            </div>
            <div className="cart-line-qty">
              <button type="button" className="option-chip" aria-label="Diminuer" onClick={() => setQty(l.key, l.qty - 1)}><Minus size={13} /></button>
              <b>{l.qty}</b>
              <button type="button" className="option-chip" aria-label="Augmenter" onClick={() => setQty(l.key, l.qty + 1)}><Plus size={13} /></button>
            </div>
            <b className="cart-line-total">{formatMoney(l.unitPrice * l.qty)}</b>
            <button type="button" className="cart-remove" aria-label={`Retirer ${l.product.name}`} onClick={() => removeLine(l.key)}><Trash2 size={16} /></button>
          </div>
        ))}
        <Link href="/boutique" className="text-link">← Continuer mes achats</Link>
      </div>

      <form className="form-card cart-checkout" onSubmit={submit}>
        <h3 style={{ margin: '0 0 14px' }}>Finaliser la commande</h3>
        <div className="text-field">
          <label htmlFor="co-delivery">Mode de livraison</label>
          <select id="co-delivery" value={delivery} onChange={(e) => setDelivery(e.target.value)}>
            {DELIVERY.map((d) => <option key={d.id} value={d.id}>{d.label} — {d.price ? formatMoney(d.price) : 'gratuit'}</option>)}
          </select>
        </div>
        <div className="text-field">
          <label htmlFor="co-name">Nom complet</label>
          <input id="co-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" />
        </div>
        <div className="text-field">
          <label htmlFor="co-phone">Téléphone</label>
          <input id="co-phone" required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+225 07 00 00 00 00" />
        </div>
        {needsAddress && (
          <div className="text-field">
            <label htmlFor="co-address">Adresse de livraison</label>
            <textarea id="co-address" required rows={2} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Commune, quartier, repère" />
          </div>
        )}
        <div className="text-field">
          <label htmlFor="co-pay">Moyen de paiement</label>
          <select id="co-pay" value={payment} onChange={(e) => setPayment(e.target.value)}>
            {PAYMENTS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <ul className="cart-recap">
          <li><span>Sous-total</span><b>{formatMoney(subtotal)}</b></li>
          <li><span>Livraison</span><b>{deliveryOpt.price ? formatMoney(deliveryOpt.price) : 'Gratuit'}</b></li>
          <li className="is-total"><span>Total</span><b>{formatMoney(total)}</b></li>
        </ul>
        <button type="submit" className="button button-primary" style={{ justifyContent: 'center', width: '100%' }}>Valider la commande — {formatMoney(total)}</button>
        <p className="muted-sm" style={{ margin: '12px 0 0' }}>Démonstration : aucun paiement réel n’est effectué.</p>
      </form>
    </div>
  )
}
