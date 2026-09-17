import { Banknote, ClipboardList, Handshake, LineChart, Megaphone, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Projet Club FIF — FIF Digital' }

const modules = [
  { icon: ClipboardList, label: 'Diagnostic', desc: 'État des lieux sportif, administratif et financier du club.' },
  { icon: ShieldCheck, label: 'Gouvernance', desc: 'Structuration des instances dirigeantes et des statuts.' },
  { icon: LineChart, label: 'Sportif', desc: 'Projet de jeu, filières de formation et détection.' },
  { icon: Users, label: 'Formation', desc: 'Plan de formation des éducateurs et dirigeants.' },
  { icon: Banknote, label: 'Finances', desc: 'Budget prévisionnel et diversification des ressources.' },
  { icon: Megaphone, label: 'Communication', desc: 'Visibilité du club auprès des supporters et partenaires.' },
  { icon: Sparkles, label: 'Infrastructure', desc: 'Plan d’amélioration des équipements sportifs.' },
  { icon: Handshake, label: 'Féminin & Jeunes', desc: 'Développement du football féminin et des filières jeunes.' },
]

export default function ProjetClubPage() {
  return (
    <main>
      <PageHero
        eyebrow="Projet Club FIF"
        title="Projet Club"
        subtitle="Un outil d’accompagnement pour structurer le développement de chaque club : diagnostic, priorités et plan d’action."
        breadcrumb={[{ label: 'Projet Club' }]}
      />
      <section className="page-section tight">
        <div className="card-grid cols-4">
          {modules.map((m) => (
            <div className="info-tile" key={m.label}><m.icon /><strong>{m.label}</strong><p>{m.desc}</p></div>
          ))}
        </div>
      </section>
      <section className="page-section tight">
        <p className="lede">Chaque club engagé dans le programme reçoit un plan d’action personnalisé et un jeu d’indicateurs suivis depuis son Portail Clubs.</p>
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
