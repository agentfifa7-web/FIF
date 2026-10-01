'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { cartCount, useCart } from '@/lib/cart'

// Accès au panier avec le nombre d'articles, mis à jour en direct.
export function CartLink({ compact = false }: { compact?: boolean }) {
  const count = cartCount(useCart())
  if (compact) {
    return (
      <Link href="/boutique/panier" className="icon-button cart-icon" aria-label={`Panier : ${count} article${count > 1 ? 's' : ''}`}>
        <ShoppingBag />
        {count > 0 && <span className="cart-badge">{count}</span>}
      </Link>
    )
  }
  return (
    <Link href="/boutique/panier" className="cart-pill">
      <ShoppingBag size={14} /> Panier : {count} article{count > 1 ? 's' : ''}
    </Link>
  )
}
