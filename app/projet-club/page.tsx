import { PageHero } from '@/components/site/PageHero'
import { ProjetClubScore, ProjetClubModules } from '@/components/site/ProjetClubDiagnostic'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Projet Club FIF — FIF Digital' }

export default function ProjetClubPage() {
  return (
    <main>
      <PageHero
        eyebrow="Projet Club FIF"
        title="Projet Club"
        subtitle="Un outil d’accompagnement pour structurer le développement de chaque club : diagnostic, priorités et plan d’action, module par module."
        breadcrumb={[{ label: 'Projet Club' }]}
      />

      <section className="page-section tight">
        <ProjetClubScore />
        <p className="lede" style={{ marginTop: 20 }}>Cochez les actions déjà réalisées dans chaque module. Votre progression est enregistrée dans ce navigateur et alimente l’indicateur de structuration ci-dessus.</p>
      </section>

      <section className="page-section tight">
        <ProjetClubModules />
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
