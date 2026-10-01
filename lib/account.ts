'use client'

// ---------------------------------------------------------------------------
// Compte FIF ID — création et connexion par numéro de téléphone (code SMS),
// sans email ni mot de passe. Prototype : les comptes sont conservés dans le
// navigateur (localStorage) et le code SMS est affiché à l'écran.
// ---------------------------------------------------------------------------

import { useEffect, useState } from 'react'

export const ACCOUNT_ROLES = ['Supporter', 'Joueur / Joueuse', 'Dirigeant de club', 'Entraîneur', 'Arbitre', 'Agent', 'Journaliste'] as const
export type AccountRole = (typeof ACCOUNT_ROLES)[number]

const ROLE_PREFIX: Record<AccountRole, string> = {
  'Supporter': 'SU',
  'Joueur / Joueuse': 'JO',
  'Dirigeant de club': 'OF',
  'Entraîneur': 'CO',
  'Arbitre': 'AR',
  'Agent': 'AG',
  'Journaliste': 'PR',
}

export const DIAL_CODES = [
  { code: '+225', label: 'Côte d’Ivoire (+225)' },
  { code: '+33', label: 'France (+33)' },
  { code: '+221', label: 'Sénégal (+221)' },
  { code: '+226', label: 'Burkina Faso (+226)' },
  { code: '+223', label: 'Mali (+223)' },
  { code: '+224', label: 'Guinée (+224)' },
  { code: '+233', label: 'Ghana (+233)' },
  { code: '+32', label: 'Belgique (+32)' },
  { code: '+1', label: 'États-Unis / Canada (+1)' },
  { code: '+44', label: 'Royaume-Uni (+44)' },
]

export interface FifAccount {
  fifId: string
  /** Numéro complet au format international, ex. +2250700000000 */
  phone: string
  fullName: string
  role: AccountRole
  createdAt: string
  favoriteClubId?: string
}

const ACCOUNTS_KEY = 'fif-accounts-v1'
const SESSION_KEY = 'fif-session-v1'
const EVENT = 'fif-account-change'

/** Normalise un numéro ; renvoie null s'il est invalide. */
export function normalizePhone(dial: string, local: string): string | null {
  let digits = local.replace(/\D/g, '')
  const dialDigits = dial.replace(/\D/g, '')
  if (digits.startsWith(dialDigits) && digits.length > dialDigits.length + 6) digits = digits.slice(dialDigits.length)
  if (dial === '+225') {
    // Numéros ivoiriens : 10 chiffres depuis 2021 (01, 05, 07 mobiles ; 21, 25, 27 fixes).
    return /^(0[157]|2[157])\d{8}$/.test(digits) ? `+225${digits}` : null
  }
  if (digits.startsWith('0')) digits = digits.slice(1)
  return digits.length >= 6 && digits.length <= 12 ? `${dial}${digits}` : null
}

export function formatPhone(phone: string) {
  const m = phone.match(/^\+225(\d{10})$/)
  if (m) return `+225 ${m[1].replace(/(\d{2})(?=\d)/g, '$1 ')}`
  return phone
}

export function maskPhone(phone: string) {
  const m = phone.match(/^\+225(\d{10})$/)
  if (m) return `+225 ${m[1].slice(0, 2)} •• •• •• ${m[1].slice(8)}`
  return `${phone.slice(0, -6)}••••${phone.slice(-2)}`
}

function readAccounts(): FifAccount[] {
  try { return JSON.parse(window.localStorage.getItem(ACCOUNTS_KEY) ?? '[]') } catch { return [] }
}

function writeAccounts(list: FifAccount[]) {
  try { window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list)) } catch { /* stockage indisponible */ }
}

function setSession(phone: string | null) {
  try {
    if (phone) window.localStorage.setItem(SESSION_KEY, phone)
    else window.localStorage.removeItem(SESSION_KEY)
  } catch { /* stockage indisponible */ }
  window.dispatchEvent(new Event(EVENT))
}

export function findAccount(phone: string) {
  return readAccounts().find((a) => a.phone === phone) ?? null
}

export function currentAccount(): FifAccount | null {
  try {
    const phone = window.localStorage.getItem(SESSION_KEY)
    return phone ? findAccount(phone) : null
  } catch {
    return null
  }
}

export function createAccount(input: { phone: string; fullName: string; role: AccountRole }): FifAccount {
  const existing = findAccount(input.phone)
  if (existing) { setSession(existing.phone); return existing }
  const account: FifAccount = {
    ...input,
    fifId: `FIF-${ROLE_PREFIX[input.role]}-${String(Math.floor(100000 + Math.random() * 900000))}`,
    createdAt: new Date().toISOString(),
  }
  writeAccounts([...readAccounts(), account])
  setSession(account.phone)
  return account
}

export function signIn(phone: string) {
  const account = findAccount(phone)
  if (account) setSession(phone)
  return account
}

export function signOut() {
  setSession(null)
}

export function updateAccount(patch: Partial<Pick<FifAccount, 'fullName' | 'favoriteClubId'>>) {
  const me = currentAccount()
  if (!me) return
  writeAccounts(readAccounts().map((a) => (a.phone === me.phone ? { ...a, ...patch } : a)))
  window.dispatchEvent(new Event(EVENT))
}

/** Les rôles autres que supporter doivent être validés par la FIF. */
export function accountStatus(a: FifAccount) {
  return a.role === 'Supporter' ? { label: 'Actif', tone: 'ok' } : { label: 'En attente de vérification FIF', tone: 'pending' }
}

/** Code à 6 chiffres envoyé par SMS (affiché à l'écran dans le prototype). */
export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function useAccount() {
  const [account, setAccount] = useState<FifAccount | null>(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const sync = () => { setAccount(currentAccount()); setReady(true) }
    sync()
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => { window.removeEventListener(EVENT, sync); window.removeEventListener('storage', sync) }
  }, [])
  return { account, ready }
}
