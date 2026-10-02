'use client'

import { useActionState } from 'react'
import { LockKeyhole } from 'lucide-react'
import { adminLogin, type AdminLoginState } from '@/app/admin/actions'

export function AdminLoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<AdminLoginState, FormData>(adminLogin, {})
  return (
    <form action={action}>
      <input type="hidden" name="next" value={next} />
      <div className="text-field">
        <label htmlFor="admin-phone">Numéro de téléphone administrateur</label>
        <input id="admin-phone" name="phone" type="tel" inputMode="tel" autoComplete="username" required placeholder="07 08 09 10 11" />
      </div>
      <div className="text-field">
        <label htmlFor="admin-password">Mot de passe</label>
        <input id="admin-password" name="password" type="password" autoComplete="current-password" required minLength={12} />
      </div>
      {state.error && <p className="form-error" role="alert" style={{ marginBottom: 12 }}>{state.error}</p>}
      <div className="form-actions">
        <button type="submit" className="button button-primary" style={{ justifyContent: 'center' }} disabled={pending}>
          <LockKeyhole size={16} /> {pending ? 'Vérification…' : 'Se connecter'}
        </button>
      </div>
    </form>
  )
}
