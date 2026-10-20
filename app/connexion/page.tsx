import Link from 'next/link'
import { PhoneAuthForm } from '@/components/site/PhoneAuthForm'
import { DemoNotice } from '@/components/site/DemoNotice'

export const metadata = { title: 'Se connecter — FIF' }

export default function LoginPage() {
  return (
    <main className="page-section auth-page">
      <div className="form-card auth-card">
        <DemoNotice title="Compte de démonstration">Le compte FIF ID est conservé dans ce navigateur. Il ne s’agit pas encore d’une authentification sécurisée : ne saisissez pas de données sensibles.</DemoNotice>
        <h1>Se connecter</h1>
        <p className="muted-sm">Accédez à votre compte FIF ID avec votre numéro de téléphone .</p>
        <PhoneAuthForm mode="login" />
        <p className="form-foot">Pas encore de FIF ID ? <Link href="/inscription">Créer un FIF ID</Link></p>
      </div>
    </main>
  )
}
