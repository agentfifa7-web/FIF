import { Breadcrumb } from '@/components/site/PageHero'
import { CardCenter } from '@/components/site/CardCenter'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Ma carte FIF ID — FIF Digital' }

export default function CardPage() {
  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'Mon compte', href: '/compte' }, { label: 'Ma carte FIF ID' }]} />
        <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', letterSpacing: '-.03em', margin: '14px 0 6px' }}>Ma carte FIF ID</h1>
        <p className="lede" style={{ marginTop: 0, maxWidth: 760 }}>Votre carte d’identité fédérale : elle vous identifie auprès de la FIF, des ligues et des clubs, se vérifie par QR code, existe en version numérique et physique, et deviendra un moyen de paiement avec le partenaire bancaire de la FIF.</p>
      </div>
      <section className="page-section tight"><CardCenter /></section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
