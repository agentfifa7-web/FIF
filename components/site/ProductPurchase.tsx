'use client'

import { getSettings } from '@/lib/cms/runtime'
import Link from 'next/link'
import { useState } from 'react'
import { CheckCircle2, Minus, Plus, ShoppingBag } from 'lucide-react'
import type { Product } from '@/lib/data/types'
import { formatMoney } from '@/lib/format'
import { addToCart, FLOCAGE_PRICE, MAX_QTY } from '@/lib/cart'

// Choix de l'article (couleur, taille, floquage, quantité) puis ajout au panier.
function ProductPurchaseInner({ product }: { product: Product }) {
  // Articles photographiés : les couleurs décrivent le modèle unique, sans choix.
  const colorChoice = !product.photo && product.colors.length > 0
  const [color, setColor] = useState(colorChoice && product.colors.length === 1 ? product.colors[0] : '')
  const [size, setSize] = useState('')
  const [qty, setQtyState] = useState(1)
  const [flocage, setFlocage] = useState(false)
  const [flocName, setFlocName] = useState('')
  const [flocNumber, setFlocNumber] = useState('')
  const [added, setAdded] = useState(false)
  const [error, setError] = useState('')

  const unit = product.price + (flocage ? FLOCAGE_PRICE : 0)

  function add() {
    if (colorChoice && product.colors.length > 1 && !color) return setError('Choisissez une couleur.')
    if (product.sizes.length > 0 && !size) return setError('Choisissez une taille.')
    if (flocage && (!flocName.trim() || !flocNumber.trim())) return setError('Indiquez le nom et le numéro à floquer.')
    setError('')
    addToCart({
      productId: product.id,
      qty,
      color: color || undefined,
      size: size || undefined,
      flocage: flocage ? { name: flocName.trim().toUpperCase(), number: flocNumber.trim() } : undefined,
    })
    setAdded(true)
  }

  return (
    <div className="purchase-box">
      <p className="purchase-price">{formatMoney(product.price)}</p>

      {!colorChoice && product.colors.length > 0 && (
        <p className="lede" style={{ fontSize: 13, margin: 0 }}>Coloris : {product.colors.join(', ')}</p>
      )}

      {colorChoice && (
        <div className="purchase-field">
          <span>Couleur{color ? ` : ${color}` : ''}</span>
          <div className="option-row">
            {product.colors.map((c) => (
              <button key={c} type="button" className={c === color ? 'option-chip is-active' : 'option-chip'} onClick={() => { setColor(c); setAdded(false) }}>{c}</button>
            ))}
          </div>
        </div>
      )}

      {product.sizes.length > 0 && (
        <div className="purchase-field">
          <span>{product.category === 'Crampons' ? 'Pointure' : 'Taille'}{size ? ` : ${size}` : ''}</span>
          <div className="option-row">
            {product.sizes.map((s) => (
              <button key={s} type="button" className={s === size ? 'option-chip is-active' : 'option-chip'} onClick={() => { setSize(s); setAdded(false) }}>{s}</button>
            ))}
          </div>
        </div>
      )}

      {product.customizable && (
        <div className="purchase-field">
          <label className="check-line">
            <input type="checkbox" checked={flocage} onChange={(e) => { setFlocage(e.target.checked); setAdded(false) }} />
            Floquage nom et numéro (+ {formatMoney(FLOCAGE_PRICE)})
          </label>
          {flocage && (
            <div className="option-row" style={{ marginTop: 8 }}>
              <input className="text-input" placeholder="Nom (12 lettres max.)" maxLength={12} value={flocName} onChange={(e) => setFlocName(e.target.value)} />
              <input className="text-input" placeholder="N°" inputMode="numeric" maxLength={2} style={{ width: 70 }} value={flocNumber} onChange={(e) => setFlocNumber(e.target.value.replace(/\D/g, ''))} />
            </div>
          )}
        </div>
      )}

      <div className="purchase-field">
        <span>Quantité</span>
        <div className="option-row" style={{ alignItems: 'center' }}>
          <button type="button" className="option-chip" aria-label="Diminuer" onClick={() => setQtyState((q) => Math.max(1, q - 1))}><Minus size={14} /></button>
          <b style={{ minWidth: 24, textAlign: 'center' }}>{qty}</b>
          <button type="button" className="option-chip" aria-label="Augmenter" onClick={() => setQtyState((q) => Math.min(MAX_QTY, q + 1))}><Plus size={14} /></button>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="button" className="button button-primary" style={{ marginTop: 8, width: '100%', justifyContent: 'center' }} onClick={add}>
        <ShoppingBag size={16} /> Ajouter au panier — {formatMoney(unit * qty)}
      </button>

      {added && (
        <div className="purchase-added">
          <CheckCircle2 size={18} color="var(--green)" />
          <span>Article ajouté au panier.</span>
          <Link href="/boutique/panier" className="text-link">Voir le panier</Link>
          <Link href="/boutique" className="text-link">Continuer mes achats</Link>
        </div>
      )}
    </div>
  )
}

/** Fermeture possible depuis Admin → Paramètres. */
export function ProductPurchase(props: Parameters<typeof ProductPurchaseInner>[0]) {
  if (!getSettings().shopOpen) return <p className="sales-closed">La boutique en ligne est momentanément fermée : les commandes reprendront prochainement.</p>
  return <ProductPurchaseInner {...props} />
}
