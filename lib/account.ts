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
  /** Numéro de matricule de la corporation (tous les rôles sauf supporter). */
  matricule?: string
}

// ---------------------------------------------------------------------------
// Numéros de matricule par corporation. Seul le supporter en est dispensé.
// Chaque corporation a son propre modèle ; les modèles encore inconnus sont
// marqués `pending` et ne font l'objet que d'un contrôle minimal en attendant.
// ---------------------------------------------------------------------------

interface MatriculeRule {
  /** Libellé du champ. */
  label: string
  example?: string
  /** Explication du modèle affichée sous le champ. */
  hint: string
  /** Modèle officiel pas encore communiqué. */
  pending?: boolean
  /** Renvoie un message d'erreur, ou null si le matricule est valide. */
  validate: (value: string) => string | null
}

/** Agents : AAAAMM-NNNN — année et mois d'obtention de la licence, puis
 *  nombre d'agents au moment de la délivrance. Ex. 202307-3048. */
function validateAgentMatricule(value: string): string | null {
  const m = value.match(/^(\d{4})(\d{2})-(\d{4})$/)
  if (!m) return 'Matricule d’agent invalide : format attendu AAAAMM-NNNN, par exemple 202307-3048.'
  const year = Number(m[1])
  const month = Number(m[2])
  const now = new Date()
  if (month < 1 || month > 12) return 'Matricule d’agent invalide : le mois (5e et 6e chiffres) doit être compris entre 01 et 12.'
  if (year < 1990 || year > now.getFullYear() || (year === now.getFullYear() && month > now.getMonth() + 1)) {
    return 'Matricule d’agent invalide : la date d’obtention de la licence ne peut pas être dans le futur.'
  }
  if (Number(m[3]) === 0) return 'Matricule d’agent invalide : le numéro d’ordre (4 derniers chiffres) ne peut pas être 0000.'
  return null
}

function provisionalRule(corporation: string): MatriculeRule {
  return {
    label: `Numéro de matricule (${corporation})`,
    hint: `Saisissez le matricule qui figure sur votre licence ou carte de ${corporation}. Il sera vérifié par la FIF.`,
    pending: true,
    validate: (v) => (/^[A-Za-z0-9][A-Za-z0-9/-]{3,23}$/.test(v) ? null : 'Matricule invalide : 4 caractères minimum (lettres, chiffres, « - » ou « / »).'),
  }
}

export const MATRICULE_RULES: Partial<Record<AccountRole, MatriculeRule>> = {
  'Agent': {
    label: 'Numéro de matricule d’agent',
    example: '202307-3048',
    hint: 'Format AAAAMM-NNNN : année et mois d’obtention de la licence, puis nombre d’agents au moment de la délivrance. Ex. 202307-3048.',
    validate: validateAgentMatricule,
  },
  'Joueur / Joueuse': provisionalRule('joueur'),
  'Dirigeant de club': provisionalRule('dirigeant'),
  'Entraîneur': provisionalRule('entraîneur'),
  'Arbitre': provisionalRule('arbitre'),
  'Journaliste': provisionalRule('journaliste'),
}

/** Vérifie le matricule pour un rôle ; null si valide (ou non requis). */
export function checkMatricule(role: AccountRole, raw: string): string | null {
  const rule = MATRICULE_RULES[role]
  if (!rule) return null
  const value = raw.trim().toUpperCase()
  if (!value) return 'Le numéro de matricule est obligatoire pour ce profil.'
  const error = rule.validate(value)
  if (error) return error
  if (readAccounts().some((a) => a.role === role && a.matricule === value)) return 'Ce numéro de matricule est déjà associé à un autre FIF ID.'
  return null
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

export function createAccount(input: { phone: string; fullName: string; role: AccountRole; matricule?: string }): FifAccount {
  const existing = findAccount(input.phone)
  if (existing) { setSession(existing.phone); return existing }
  const account: FifAccount = {
    ...input,
    matricule: MATRICULE_RULES[input.role] ? input.matricule?.trim().toUpperCase() : undefined,
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
