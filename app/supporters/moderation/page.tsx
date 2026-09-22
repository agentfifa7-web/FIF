import { AlertTriangle, Bot, Flag, ShieldCheck, UserCheck } from 'lucide-react'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Modération & signalement — FIF Digital' }

const REPORT_REASONS = ['Harcèlement', 'Insulte', 'Discrimination', 'Spam', 'Contenu violent', 'Fausse information', 'Droits d’auteur', 'Autre']

export default function ModerationPage() {
  return (
    <main>
      <PageHero
        eyebrow="🛡️ Fan Life"
        title="Modération & signalement"
        subtitle="La Fan Zone est modérée pour rester un espace sûr, positif et respectueux — pour tous les supporters."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Modération' }]}
      />

      <section className="page-section tight">
        <div className="info-tiles">
          <div className="info-tile"><Bot /><strong>Détection automatique</strong><p>Insultes, spam, contenu violent, harcèlement, contenu sexuel, discrimination, incitation à la violence.</p></div>
          <div className="info-tile"><UserCheck /><strong>Modération humaine FIF</strong><p>Une équipe FIF tranche les décisions importantes et les cas ambigus.</p></div>
          <div className="info-tile"><ShieldCheck /><strong>Système de réputation</strong><p>🟢 Bon comportement · 🟡 Avertissement · 🔴 Restriction — uniquement pour la modération, jamais comme notation générale d’une personne.</p></div>
        </div>
      </section>

      <section className="page-section tight dark-section">
        <p className="section-tag" style={{ color: 'var(--orange)' }}><Flag size={13} style={{ verticalAlign: 'middle' }} /> Motifs de signalement</p>
        <div className="chip-row" style={{ marginTop: 12 }}>
          {REPORT_REASONS.map((r) => <span className="chip" key={r}>{r}</span>)}
        </div>
      </section>

      <section className="page-section tight">
        <div className="sim-panel" style={{ marginLeft: 0, marginRight: 0 }}>
          <p><AlertTriangle size={15} /> Le score de « contribution communautaire » (contenus validés, participation, respect des règles) n’est jamais utilisé pour restreindre l’accès aux services essentiels de la FIF.</p>
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
