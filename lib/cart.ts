'use client'

// ---------------------------------------------------------------------------
// Panier de la Boutique FIF — stocké dans le navigateur (localStorage) et
// partagé entre les pages via un événement custom, comme les autres modules
// de la plateforme (lib/workflows.ts).
// ---------------------------------------------------------------------------

import { useSyncExternalStore } from 'react'

export interface CartLine {
  /** Clé unique : article + taille + couleur + flocage. */
  key: string
  productId: string
  qty: number
  size?: string
  color?: string
  flocage?: { name: string; number: string }
}

export interface ShopOrder {
  ref: string
  date: string
  lines: (CartLine & { name: string; unitPrice: number })[]
  subtotal: number
  delivery: { label: string; price: number }
  total: number
  customer: { name: string; phone: string; address: string }
  payment: string
}

const CART_KEY = 'fif-store-cart'
const ORDERS_KEY = 'fif-store-orders'
const EVENT = 'fif-store-change'

/** Supplément floquage nom + numéro (prix indicatif). */
export const FLOCAGE_PRICE = 5000
export const MAX_QTY = 10

const EMPTY: CartLine[] = []
let cache: { raw: string | null; lines: CartLine[] } = { raw: null, lines: EMPTY }

function read(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(CART_KEY)
    if (raw !== cache.raw) cache = { raw, lines: raw ? JSON.parse(raw) : EMPTY }
    return cache.lines
  } catch {
    return EMPTY
  }
}

function write(lines: CartLine[]) {
  try { window.localStorage.setItem(CART_KEY, JSON.stringify(lines)) } catch { /* stockage indisponible */ }
  window.dispatchEvent(new Event(EVENT))
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb)
  window.addEventListener('storage', cb)
  return () => { window.removeEventListener(EVENT, cb); window.removeEventListener('storage', cb) }
}

export function useCart(): CartLine[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}

export function lineKey(l: Omit<CartLine, 'key' | 'qty'>) {
  return [l.productId, l.size ?? '', l.color ?? '', l.flocage ? `${l.flocage.name}#${l.flocage.number}` : ''].join('|')
}

export function addToCart(line: Omit<CartLine, 'key'>) {
  const key = lineKey(line)
  const lines = read()
  const existing = lines.find((l) => l.key === key)
  write(existing
    ? lines.map((l) => (l.key === key ? { ...l, qty: Math.min(MAX_QTY, l.qty + line.qty) } : l))
    : [...lines, { ...line, key }])
}

export function setQty(key: string, qty: number) {
  write(qty <= 0 ? read().filter((l) => l.key !== key) : read().map((l) => (l.key === key ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)))
}

export function removeLine(key: string) {
  write(read().filter((l) => l.key !== key))
}

export function clearCart() {
  write([])
}

export function cartCount(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.qty, 0)
}

export function saveOrder(order: ShopOrder) {
  try {
    const orders: ShopOrder[] = JSON.parse(window.localStorage.getItem(ORDERS_KEY) ?? '[]')
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...orders].slice(0, 20)))
  } catch { /* stockage indisponible */ }
}
