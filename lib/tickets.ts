'use client'

// ---------------------------------------------------------------------------
// FIF Tickets — commandes et billets (prototype : stockés dans le navigateur).
// Chaque billet est nominatif, porte un identifiant unique et un QR code de
// contrôle ; les places d'une même commande sont attribuées côte à côte.
// ---------------------------------------------------------------------------

import { useEffect, useState } from 'react'
import type { TicketEvent, TicketTierId } from '@/lib/data/tickets'

export interface Ticket {
  id: string
  orderRef: string
  eventSlug: string
  eventLabel: string
  competition: string
  date?: string
  time?: string
  stadium: string
  gatesOpen?: string
  tierId: TicketTierId
  tierName: string
  price: number
  holder: string
  gate: string
  block: string
  row: number
  seat: number
  purchasedAt: string
  status: 'Valide' | 'Utilisé' | 'Annulé'
}

export interface TicketOrder {
  ref: string
  eventSlug: string
  buyerPhone: string
  buyerName: string
  payment: string
  total: number
  createdAt: string
  ticketIds: string[]
}

const TICKETS_KEY = 'fif-tickets-v1'
const ORDERS_KEY = 'fif-ticket-orders-v1'
const ALERTS_KEY = 'fif-ticket-alerts-v1'
const EVENT = 'fif-tickets-change'

const BLOCK_LETTERS: Record<TicketTierId, string> = { vip: 'P', centrale: 'C', laterale: 'L', virage: 'V' }

function read<T>(key: string, fallback: T): T {
  try { return JSON.parse(window.localStorage.getItem(key) ?? '') as T } catch { return fallback }
}
function write(key: string, value: unknown) {
  try { window.localStorage.setItem(key, JSON.stringify(value)) } catch { /* stockage indisponible */ }
  window.dispatchEvent(new Event(EVENT))
}

function randomId(prefix: string) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  const bytes = new Uint8Array(10)
  crypto.getRandomValues(bytes)
  for (const b of bytes) out += alphabet[b % alphabet.length]
  return `${prefix}-${out.slice(0, 5)}-${out.slice(5)}`
}

export function readTickets(): Ticket[] { return read<Ticket[]>(TICKETS_KEY, []) }
export function readOrders(): TicketOrder[] { return read<TicketOrder[]>(ORDERS_KEY, []) }
export function findTicket(id: string) { return readTickets().find((t) => t.id.toUpperCase() === id.trim().toUpperCase()) ?? null }

export interface CheckoutLine { tierId: TicketTierId; qty: number }

/** Crée la commande et les billets après paiement confirmé. */
export function createOrder(input: {
  event: TicketEvent
  lines: CheckoutLine[]
  holders: string[]
  buyerName: string
  buyerPhone: string
  payment: string
}): TicketOrder {
  const { event } = input
  const ref = randomId('CMD')
  const now = new Date().toISOString()
  const existing = readTickets()
  const tickets: Ticket[] = []
  let holderIndex = 0
  for (const line of input.lines) {
    const tier = event.tiers.find((t) => t.id === line.tierId)
    if (!tier || line.qty <= 0) continue
    // Places côte à côte : même bloc, même rang, sièges consécutifs.
    const sold = existing.filter((t) => t.eventSlug === event.slug && t.tierId === tier.id).length + tickets.filter((t) => t.tierId === tier.id).length
    const blockNumber = 1 + Math.floor(sold / 400) + (crypto.getRandomValues(new Uint8Array(1))[0] % 8)
    const row = 1 + (crypto.getRandomValues(new Uint8Array(1))[0] % 30)
    const firstSeat = 1 + (crypto.getRandomValues(new Uint8Array(1))[0] % 20)
    for (let i = 0; i < line.qty; i++) {
      tickets.push({
        id: randomId('TKT'),
        orderRef: ref,
        eventSlug: event.slug,
        eventLabel: `${event.home.name} – ${event.away.name}`,
        competition: event.competition,
        date: event.date,
        time: event.time,
        stadium: `${event.stadium.name}${event.stadium.city ? `, ${event.stadium.city}` : ''}`,
        gatesOpen: event.gatesOpen,
        tierId: tier.id,
        tierName: tier.name,
        price: tier.price,
        holder: (input.holders[holderIndex++] || input.buyerName).trim(),
        gate: tier.gate,
        block: `${BLOCK_LETTERS[tier.id]}${blockNumber}`,
        row,
        seat: firstSeat + i,
        purchasedAt: now,
        status: 'Valide',
      })
    }
  }
  const order: TicketOrder = {
    ref,
    eventSlug: event.slug,
    buyerName: input.buyerName,
    buyerPhone: input.buyerPhone,
    payment: input.payment,
    total: tickets.reduce((s, t) => s + t.price, 0),
    createdAt: now,
    ticketIds: tickets.map((t) => t.id),
  }
  write(TICKETS_KEY, [...tickets, ...existing])
  write(ORDERS_KEY, [order, ...readOrders()])
  return order
}

/** Contrôle d'accès : marque le billet comme utilisé (scan à l'entrée). */
export function markUsed(id: string) {
  write(TICKETS_KEY, readTickets().map((t) => (t.id === id ? { ...t, status: 'Utilisé' as const } : t)))
}

export function toggleSaleAlert(slug: string) {
  const alerts = read<string[]>(ALERTS_KEY, [])
  write(ALERTS_KEY, alerts.includes(slug) ? alerts.filter((s) => s !== slug) : [...alerts, slug])
}

export function useTickets() {
  const [state, setState] = useState<{ tickets: Ticket[]; orders: TicketOrder[]; alerts: string[]; ready: boolean }>({ tickets: [], orders: [], alerts: [], ready: false })
  useEffect(() => {
    const sync = () => setState({ tickets: readTickets(), orders: readOrders(), alerts: read<string[]>(ALERTS_KEY, []), ready: true })
    sync()
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => { window.removeEventListener(EVENT, sync); window.removeEventListener('storage', sync) }
  }, [])
  return state
}
