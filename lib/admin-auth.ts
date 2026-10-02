// ---------------------------------------------------------------------------
// Accès administrateur FIF (côté serveur uniquement).
// Les identifiants ne sont jamais écrits dans le code : ils sont lus dans les
// variables d'environnement du serveur (Vercel → Settings → Environment Variables).
//   FIF_ADMIN_PHONE     numéro du compte administrateur, ex. 0708091011 ou +2250708091011
//   FIF_ADMIN_PASSWORD  mot de passe (12 caractères minimum)
//   FIF_ADMIN_SECRET    (facultatif) clé de signature des sessions
// La session est un cookie httpOnly signé (HMAC-SHA256) valable 8 heures.
// ---------------------------------------------------------------------------

import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

export const ADMIN_COOKIE = 'fif_admin_session'
export const ADMIN_SESSION_SECONDS = 8 * 60 * 60
export const ADMIN_MIN_PASSWORD = 12

/** Ramène un numéro à la forme internationale ; les numéros ivoiriens à 10 chiffres prennent +225. */
export function normalizeAdminPhone(raw: string) {
  const trimmed = raw.trim()
  const digits = trimmed.replace(/\D/g, '')
  if (trimmed.startsWith('+') || trimmed.startsWith('00')) return `+${digits.replace(/^00/, '')}`
  if (/^(0[157]|2[157])\d{8}$/.test(digits)) return `+225${digits}`
  if (/^225\d{10}$/.test(digits)) return `+${digits}`
  return digits ? `+${digits}` : ''
}

function adminConfig() {
  const phone = normalizeAdminPhone(process.env.FIF_ADMIN_PHONE ?? '')
  const password = process.env.FIF_ADMIN_PASSWORD ?? ''
  if (!phone || password.length < ADMIN_MIN_PASSWORD) return null
  const secret = process.env.FIF_ADMIN_SECRET || `fif-admin-session|${phone}|${password}`
  return { phone, password, secret }
}

export function adminConfigured() {
  return adminConfig() !== null
}

const digest = (s: string) => createHash('sha256').update(s).digest()
const sameText = (a: string, b: string) => timingSafeEqual(digest(a), digest(b))
const sign = (payload: string, secret: string) => createHmac('sha256', secret).update(payload).digest('base64url')

/** Vérifie les identifiants ; renvoie le numéro normalisé si ils sont corrects. */
export function checkAdminCredentials(phoneInput: string, password: string): string | null {
  const cfg = adminConfig()
  if (!cfg) return null
  const phoneOk = sameText(normalizeAdminPhone(phoneInput), cfg.phone)
  const passwordOk = sameText(password, cfg.password)
  return phoneOk && passwordOk ? cfg.phone : null
}

export function createAdminSession(phone: string, now = Date.now()) {
  const cfg = adminConfig()
  if (!cfg) throw new Error('Accès administrateur non configuré')
  const payload = Buffer.from(JSON.stringify({ phone, exp: Math.floor(now / 1000) + ADMIN_SESSION_SECONDS })).toString('base64url')
  return `${payload}.${sign(payload, cfg.secret)}`
}

export interface AdminSession { phone: string; exp: number }

/** Lit et vérifie un jeton de session ; null si absent, falsifié ou expiré. */
export function verifyAdminSession(token: string | undefined | null): AdminSession | null {
  const cfg = adminConfig()
  if (!cfg || !token) return null
  const [payload, mac] = token.split('.')
  if (!payload || !mac || !sameText(mac, sign(payload, cfg.secret))) return null
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as AdminSession
    if (data.phone !== cfg.phone || data.exp * 1000 < Date.now()) return null
    return data
  } catch {
    return null
  }
}

/** N'accepte qu'une destination interne à l'espace admin. */
export function safeAdminNext(next: unknown) {
  return typeof next === 'string' && /^\/admin(\/|$|\?)/.test(next) && !next.startsWith('/admin/connexion') ? next : '/admin'
}

// Limitation des tentatives (par instance serveur) : 5 échecs → 15 minutes de blocage.
const failures = new Map<string, { count: number; until: number }>()
export function loginBlockedFor(key: string) {
  const f = failures.get(key)
  return f && f.until > Date.now() ? Math.ceil((f.until - Date.now()) / 60000) : 0
}
export function recordLoginFailure(key: string) {
  const f = failures.get(key) ?? { count: 0, until: 0 }
  f.count += 1
  if (f.count >= 5) { f.until = Date.now() + 15 * 60 * 1000; f.count = 0 }
  failures.set(key, f)
}
export function clearLoginFailures(key: string) {
  failures.delete(key)
}
