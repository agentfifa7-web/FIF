'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  ADMIN_COOKIE, ADMIN_SESSION_SECONDS, adminConfigured, checkAdminCredentials, clearLoginFailures,
  createAdminSession, loginBlockedFor, recordLoginFailure, safeAdminNext,
} from '@/lib/admin-auth'

export interface AdminLoginState { error?: string }

export async function adminLogin(_prev: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  if (!adminConfigured()) return { error: 'L’accès administrateur n’est pas encore configuré sur le serveur.' }
  const phone = String(formData.get('phone') ?? '')
  const password = String(formData.get('password') ?? '')
  const h = await headers()
  const key = h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  const blocked = loginBlockedFor(key)
  if (blocked) return { error: `Trop de tentatives. Réessayez dans ${blocked} min.` }

  const adminPhone = checkAdminCredentials(phone, password)
  if (!adminPhone) {
    recordLoginFailure(key)
    await new Promise((r) => setTimeout(r, 700))
    return { error: 'Numéro ou mot de passe incorrect.' }
  }
  clearLoginFailures(key)
  const jar = await cookies()
  jar.set(ADMIN_COOKIE, createAdminSession(adminPhone), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_SECONDS,
  })
  redirect(safeAdminNext(formData.get('next')))
}

export async function adminLogout() {
  const jar = await cookies()
  jar.delete(ADMIN_COOKIE)
  redirect('/admin/connexion')
}
