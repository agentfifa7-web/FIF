import Link from 'next/link'
import { PhoneAuthForm } from '@/components/site/PhoneAuthForm'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Se connecter — FIF Digital' }

export default function LoginPage() {
  return (
    <main className="page-section" style={{ paddingBottom: 90, paddingTop: 70 }}>
      <div className="form-card">
        <h1>Se connecter</h1>
        <p className="muted-sm">Accédez à votre compte FIF ID avec votre numéro de téléphone : un code vous est envoyé par SMS.</p>
        <PhoneAuthForm mode="login" />
        <p className="form-foot">Pas encore de FIF ID ? <Link href="/inscription">Créer un FIF ID</Link></p>
        <div style={{ marginTop: 24, textAlign: 'center' }}><DemoBadge /></div>
      </div>
    </main>
  )
}
