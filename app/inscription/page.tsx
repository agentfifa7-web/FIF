'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DemoBadge } from '@/components/site/DemoBadge'

export default function RegisterPage() {
  const router = useRouter()
  return (
    <main className="page-section" style={{ paddingBottom: 90, paddingTop: 70 }}>
      <div className="form-card">
        <h1>Créer un FIF ID</h1>
        <p className="muted-sm">Votre identité numérique fédérale : supporter, joueur, dirigeant, arbitre, agent ou club.</p>
        <form onSubmit={(e) => { e.preventDefault(); router.push('/compte') }}>
          <div className="text-field">
            <label htmlFor="name">Nom complet</label>
            <input id="name" type="text" required placeholder="Prénom et nom" />
          </div>
          <div className="text-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required placeholder="vous@exemple.com" />
          </div>
          <div className="text-field">
            <label htmlFor="role">Je suis…</label>
            <select id="role" defaultValue="Supporter">
              {['Supporter', 'Joueur / Joueuse', 'Dirigeant de club', 'Entraîneur', 'Arbitre', 'Agent', 'Journaliste'].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="text-field">
            <label htmlFor="password">Mot de passe</label>
            <input id="password" type="password" required placeholder="••••••••" />
          </div>
          <div className="form-actions">
            <button type="submit" className="button button-primary" style={{ justifyContent: 'center' }}>Créer mon FIF ID</button>
          </div>
        </form>
        <p className="form-foot">Déjà un compte ? <Link href="/connexion">Se connecter</Link></p>
        <div style={{ marginTop: 24, textAlign: 'center' }}><DemoBadge /></div>
      </div>
    </main>
  )
}
