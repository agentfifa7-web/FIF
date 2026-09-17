'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DemoBadge } from '@/components/site/DemoBadge'

export default function LoginPage() {
  const router = useRouter()
  return (
    <main className="page-section" style={{ paddingBottom: 90, paddingTop: 70 }}>
      <div className="form-card">
        <h1>Se connecter</h1>
        <p className="muted-sm">Accédez à votre compte FIF ID — un seul identifiant pour la Fédération, les clubs, la formation, la billetterie et la boutique.</p>
        <form onSubmit={(e) => { e.preventDefault(); router.push('/compte') }}>
          <div className="text-field">
            <label htmlFor="email">Email ou téléphone</label>
            <input id="email" type="text" required placeholder="vous@exemple.com" />
          </div>
          <div className="text-field">
            <label htmlFor="password">Mot de passe</label>
            <input id="password" type="password" required placeholder="••••••••" />
          </div>
          <div className="form-actions">
            <button type="submit" className="button button-primary" style={{ justifyContent: 'center' }}>Se connecter</button>
            <button type="button" className="button-outline" style={{ justifyContent: 'center' }}>Recevoir un code OTP</button>
          </div>
        </form>
        <p className="form-foot">Pas encore de compte ? <Link href="/inscription">Créer un FIF ID</Link></p>
        <div style={{ marginTop: 24, textAlign: 'center' }}><DemoBadge /></div>
      </div>
    </main>
  )
}
