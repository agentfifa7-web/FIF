import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Charte du supporter — FIF Digital' }

const PRINCIPLES = [
  'Respect', 'Fair-play', 'Respect des adversaires', 'Respect des arbitres', 'Respect des joueurs',
  'Zéro violence', 'Zéro racisme', 'Zéro discrimination', 'Zéro haine', 'Respect des infrastructures', 'Ambiance positive',
]

export default function ChartePage() {
  return (
    <main>
      <PageHero
        eyebrow="📜 Fan Life"
        title="Charte du supporter ivoirien"
        subtitle="Les principes qui encadrent la communauté FIF Fan Universe, en ligne comme au stade."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Charte' }]}
      />

      <section className="page-section tight">
        <div className="card-grid cols-2">
          {PRINCIPLES.map((p) => (
            <div className="entity-card" key={p}>
              <CheckCircle2 size={18} color="var(--green)" />
              <div><strong>{p}</strong></div>
            </div>
          ))}
        </div>
        <p className="lede" style={{ marginTop: 24 }}>Cette charte s’applique à toute la Fan Zone, aux commentaires, aux publications et aux comportements dans les Fan Villages officiels. Tout manquement peut entraîner un avertissement, une restriction ou une exclusion de la plateforme, conformément à la page <Link href="/supporters/moderation">Modération &amp; signalement</Link>.</p>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
