import { FileText } from 'lucide-react'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Documents officiels — FIF Digital' }

const categories = [
  { title: 'Statuts & règlements', docs: ['Statuts de la FIF', 'Règlement des compétitions', 'Règlement disciplinaire', 'Charte d’éthique'] },
  { title: 'Procès-verbaux & décisions', docs: ['PV Assemblée Générale 2026', 'PV Comité Exécutif — Septembre 2026', 'Décisions de la Commission de discipline'] },
  { title: 'Calendriers & formulaires', docs: ['Calendrier Ligue 1 2025-2026', 'Formulaire de demande de licence', 'Formulaire d’accréditation presse'] },
  { title: 'Guides & rapports', docs: ['Guide du dirigeant de club', 'Rapport d’activité 2025', 'Guide Projet Club FIF'] },
]

export default function DocumentsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Centre de documentation"
        title="Documents officiels"
        subtitle="Statuts, règlements, circulaires, procès-verbaux, calendriers, formulaires, guides et rapports de la Fédération."
        breadcrumb={[{ label: 'Documents' }]}
      />
      <section className="page-section tight">
        {categories.map((cat) => (
          <div key={cat.title} style={{ marginBottom: 32 }}>
            <p className="section-tag">{cat.title}</p>
            <div className="card-grid cols-2" style={{ marginTop: 12 }}>
              {cat.docs.map((d) => (
                <div className="entity-card" key={d}>
                  <FileText size={18} color="var(--orange)" />
                  <div><strong>{d}</strong><span>PDF · Téléchargement</span></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
