import Link from 'next/link'
import { PhoneAuthForm } from '@/components/site/PhoneAuthForm'
import { DemoNotice } from '@/components/site/DemoNotice'

export const metadata = { title: 'Créer un FIF ID — FIF Digital' }

export default function RegisterPage() {
  return (
    <main className="page-section auth-page">
      <div className="form-card auth-card">
        <DemoNotice title="Compte de démonstration">Le compte FIF ID est conservé dans ce navigateur. Il ne s’agit pas encore d’une authentification sécurisée : ne saisissez pas de données sensibles.</DemoNotice>
        <h1>Créer un FIF ID</h1>
        <p className="muted-sm">Votre identité numérique fédérale : supporter, joueur, dirigeant, entraîneur, arbitre, agent ou journaliste. Il suffit de votre numéro de téléphone.</p>
        <PhoneAuthForm mode="signup" />
        <p className="form-foot">Déjà un FIF ID ? <Link href="/connexion">Se connecter</Link></p>
      </div>
    </main>
  )
}
