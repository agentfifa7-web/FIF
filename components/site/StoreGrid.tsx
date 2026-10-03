'use client'

import { getSettings } from '@/lib/cms/runtime'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Check, ShoppingBag } from 'lucide-react'
import type { Product } from '@/lib/data/types'
import { formatMoney } from '@/lib/format'
import { addToCart } from '@/lib/cart'
import { FilterSelect } from './widgets'
import { ProductArt } from './ProductArt'
import { CartLink } from './CartLink'

/** Un article sans option à choisir peut être ajouté directement depuis la liste.
 *  Pour les articles photographiés, les couleurs décrivent le modèle (pas de choix). */
function needsChoice(p: Product) {
  return p.sizes.length > 0 || (!p.photo && p.colors.length > 1) || p.customizable
}

export function StoreGrid({ products }: { products: Product[] }) {
  const categories = ['Toutes', ...Array.from(new Set(products.map((p) => p.category)))]
  const [category, setCategory] = useState('Toutes')
  const [justAdded, setJustAdded] = useState<string | null>(null)

  const filtered = useMemo(() => (category === 'Toutes' ? products : products.filter((p) => p.category === category)), [products, category])

  function quickAdd(p: Product) {
    if (!getSettings().shopOpen) return window.alert('La boutique en ligne est momentanément fermée.')
    addToCart({ productId: p.id, qty: 1, color: p.photo ? undefined : p.colors[0] })
    setJustAdded(p.id)
    window.setTimeout(() => setJustAdded((id) => (id === p.id ? null : id)), 1800)
  }

  return (
    <div>
      <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
        <FilterSelect label="Catégorie" value={category} options={categories} onChange={setCategory} />
        <CartLink />
      </div>
      <div className="card-grid cols-4">
        {filtered.map((p) => (
          <div className="product-card" key={p.id}>
            <Link href={`/boutique/${p.id}`} className={p.photo ? 'product-image has-photo' : 'product-image'}>
              {p.photo ? <img src={p.photo} alt={p.name} loading="lazy" /> : <ProductArt product={p} />}
              {p.badge && <em className="product-badge">{p.badge}</em>}
            </Link>
            <Link href={`/boutique/${p.id}`} className="product-name"><strong>{p.name}</strong></Link>
            {p.description && <small className="product-desc">{p.description}</small>}
            <span>{formatMoney(p.price)}{p.customizable ? ' · Personnalisable' : ''}{p.sizes.length ? ` · ${p.sizes[0]}–${p.sizes[p.sizes.length - 1]}` : ''}</span>
            {needsChoice(p) ? (
              <Link href={`/boutique/${p.id}`} className="button-outline product-cta">
                <ShoppingBag size={14} /> Choisir {p.sizes.length ? (p.category === 'Crampons' ? 'ma pointure' : 'ma taille') : 'les options'}
              </Link>
            ) : (
              <button type="button" className="button-outline product-cta" onClick={() => quickAdd(p)}>
                {justAdded === p.id ? <><Check size={14} /> Ajouté au panier</> : <><ShoppingBag size={14} /> Ajouter au panier</>}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
