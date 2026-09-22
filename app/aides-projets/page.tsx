import { PageHero } from '@/components/site/PageHero'
import { AideWorkflow } from '@/components/site/AideWorkflow'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'FIF Aides & Projets — FIF Digital' }

const programs = [
  { title: 'Fonds Développement Féminin', desc: 'Soutien aux clubs qui structurent une section féminine.' },
  { title: 'Fonds Infrastructures', desc: 'Cofinancement de terrains, vestiaires et éclairage.' },
  { title: 'Fonds Formation Jeunes', desc: 'Appui aux centres de formation et académies agréées.' },
  { title: 'Fonds Inclusion & Handicap', desc: 'Programmes de football adapté et d’inclusion.' },
]

export default function GrantsPage() {
  return (
    <main>
      <PageHero
        eyebrow="FIF Aides & Projets"
        title="Financement & aides"
        subtitle="Découvrez les programmes de soutien aux clubs et déposez votre dossier en ligne."
        breadcrumb={[{ label: 'Aides & Projets' }]}
      />
      <section className="page-section tight">
        <div className="card-grid cols-2">
          {programs.map((p) => (
            <div className="entity-card" key={p.title}><div><strong>{p.title}</strong><span>{p.desc}</span></div></div>
          ))}
        </div>
      </section>
      <section className="page-section tight">
        <p className="section-tag">Déposer un dossier et suivre son instruction</p>
        <AideWorkflow programs={programs.map((p) => ({ title: p.title }))} />
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
