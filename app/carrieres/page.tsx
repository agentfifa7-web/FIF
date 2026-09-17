import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Carrières — FIF Digital' }

const offers = [
  { title: 'Chargé(e) de communication digitale', dept: 'Communication', location: 'Abidjan', type: 'CDI' },
  { title: 'Analyste données football', dept: 'Digital', location: 'Abidjan', type: 'CDI' },
  { title: 'Responsable juridique', dept: 'Juridique', location: 'Abidjan', type: 'CDI' },
  { title: 'Coordinateur football féminin', dept: 'Sport', location: 'Abidjan', type: 'CDI' },
  { title: 'Chargé(e) de billetterie événementielle', dept: 'Événementiel', location: 'Abidjan', type: 'CDD' },
  { title: 'Médecin fédéral adjoint', dept: 'Médical', location: 'Abidjan', type: 'CDI' },
]

export default function CareersPage() {
  return (
    <main>
      <PageHero
        eyebrow="Travailler à la FIF"
        title="Carrières"
        subtitle="Rejoignez les équipes de la Fédération : administration, sport, communication, digital, juridique, finance, médias, technique."
        breadcrumb={[{ label: 'Carrières' }]}
        meta={[{ value: String(offers.length), label: 'Offres ouvertes' }]}
      />
      <section className="page-section tight">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th className="align-left">POSTE</th><th className="align-left">DÉPARTEMENT</th><th className="align-left">LIEU</th><th>CONTRAT</th><th></th></tr></thead>
            <tbody>
              {offers.map((o) => (
                <tr key={o.title}>
                  <td className="align-left">{o.title}</td>
                  <td className="align-left">{o.dept}</td>
                  <td className="align-left">{o.location}</td>
                  <td>{o.type}</td>
                  <td><Link href="/contact" className="text-link" style={{ margin: 0 }}>Postuler <ArrowRight size={14} /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
