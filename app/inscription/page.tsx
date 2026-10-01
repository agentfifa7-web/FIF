import Link from 'next/link'
import { PhoneAuthForm } from '@/components/site/PhoneAuthForm'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Créer un FIF ID — FIF Digital' }

export default function RegisterPage() {
  return (
    <main className="page-section" style={{ paddingBottom: 90, paddingTop: 70 }}>
      <div className="form-card">
        <h1>Créer un FIF ID</h1>
        <p className="muted-sm">Votre identité numérique fédérale : supporter, joueur, dirigeant, entraîneur, arbitre, agent ou journaliste. Il suffit de votre numéro de téléphone.</p>
        <PhoneAuthForm mode="signup" />
        <p className="form-foot">Déjà un FIF ID ? <Link href="/connexion">Se connecter</Link></p>
        <div style={{ marginTop: 24, textAlign: 'center' }}><DemoBadge /></div>
      </div>
    </main>
  )
}
