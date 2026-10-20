import Link from 'next/link'
import { Lock } from 'lucide-react'
import { PageHero } from '@/components/site/PageHero'
import { ServiceSteps } from '@/components/site/ServiceSteps'

export const metadata = { title: 'Discipline — FIF', description: 'Procédures disciplinaires, décisions publiques des commissions et voies d’appel.' }

export default function DisciplinePage() {
  return (
    <main>
      <PageHero
        eyebrow="Fédération · Discipline"
        title="Discipline"
        subtitle="Procédures, décisions publiques des commissions juridictionnelles et voies d’appel."
        breadcrumb={[{ label: 'Fédération', href: '/federation' }, { label: 'Discipline' }]}
        noPhotos
      />
      <section className="page-section">
        <div className="svc-layout">
          <div>
            <div className="svc-block">
              <h2>La procédure disciplinaire</h2>
              <ServiceSteps steps={[
                { title: 'Saisine', text: 'Rapport d’arbitre ou de délégué, réclamation d’un club ou saisine d’office.' },
                { title: 'Instruction', text: 'La Commission de discipline examine les faits et entend les parties.' },
                { title: 'Décision', text: 'La décision motivée est notifiée aux intéressés, puis publiée si elle est publique.' },
                { title: 'Appel', text: 'Les parties peuvent faire appel devant la commission d’appel dans les délais réglementaires.' },
              ]} />
            </div>
            <div className="svc-block">
              <h2>Décisions publiées</h2>
              <div className="empty-state"><strong>Aucune décision publiée sur la plateforme pour le moment</strong><span>Les décisions publiques de la Commission de discipline seront mises en ligne ici dès leur communication officielle.</span></div>
            </div>
          </div>
          <aside className="svc-action" aria-label="Accès rapides">
            <h2>Contester une décision</h2>
            <p>Réclamation sur un match ou appel d’une décision disciplinaire.</p>
            <Link className="button button-primary" href="/reclamations" style={{ width: '100%' }}>Déposer une réclamation</Link>
            <p style={{ marginTop: 16 }}><Link className="text-link" href="/documents">Code disciplinaire et règlements</Link></p>
            <p className="cp-note"><Lock size={14} aria-hidden /> Les dossiers en cours d’instruction sont confidentiels : seules les décisions publiques figurent sur le site.</p>
          </aside>
        </div>
      </section>
    </main>
  )
}
