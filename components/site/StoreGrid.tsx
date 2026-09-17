'use client'

import { useMemo, useState } from 'react'
import type { Product } from '@/lib/data/types'
import { formatMoney } from '@/lib/format'
import { FilterSelect } from './widgets'
import { ProductArt } from './ProductArt'

export function StoreGrid({ products }: { products: Product[] }) {
  const categories = ['Toutes', ...Array.from(new Set(products.map((p) => p.category)))]
  const [category, setCategory] = useState('Toutes')
  const [cart, setCart] = useState<Record<string, number>>({})

  const filtered = useMemo(() => (category === 'Toutes' ? products : products.filter((p) => p.category === category)), [products, category])
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => sum + qty * (products.find((p) => p.id === id)?.price ?? 0), 0)

  return (
    <div>
      <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
        <FilterSelect label="Catégorie" value={category} options={categories} onChange={setCategory} />
        <div className="cart-pill">Panier : {cartCount} article{cartCount > 1 ? 's' : ''} · {formatMoney(cartTotal)}</div>
      </div>
      <div className="card-grid cols-4">
        {filtered.map((p) => (
          <div className="product-card" key={p.id}>
            <div className="product-image"><ProductArt product={p} /></div>
            <strong>{p.name}</strong>
            <span>{formatMoney(p.price)}{p.customizable ? ' · Personnalisable' : ''}</span>
            <button type="button" className="button-outline" onClick={() => setCart((c) => ({ ...c, [p.id]: (c[p.id] ?? 0) + 1 }))}>
              Ajouter au panier
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
