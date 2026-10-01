import { Breadcrumb } from '@/components/site/PageHero'
import { DiplomaVerify } from '@/components/site/DiplomaVerify'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Vérifier un diplôme — FIF Academy' }

export default function DiplomaVerifyPage() {
  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'FIF Academy', href: '/formation' }, { label: 'Vérifier un diplôme' }]} />
        <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', letterSpacing: '-.03em', margin: '14px 0 0' }}>Vérifier un diplôme</h1>
        <p className="lede" style={{ maxWidth: 680 }}>Clubs, employeurs et ligues : saisissez le numéro du diplôme ou scannez son QR code.</p>
      </div>
      <section className="page-section tight"><DiplomaVerify /></section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
