import Link from 'next/link'
import { PageHero } from '@/components/site/PageHero'

export const metadata = { title: 'Recrutement — FIF', description: 'Offres d’emploi et candidatures à la Fédération Ivoirienne de Football.' }

// Aucune offre fictive : seules les offres officiellement publiées par la FIF
// (collection « Offres » de l'administration, à venir) seront listées ici.
export default function CareersPage() {
  return (
    <main>
      <PageHero
        eyebrow="Fédération · Recrutement"
        title="Travailler à la FIF"
        subtitle="Administration, sport, communication, digital, juridique, finance, médical : rejoignez les équipes de la Fédération."
        breadcrumb={[{ label: 'Fédération', href: '/federation' }, { label: 'Recrutement' }]}
        noPhotos
      />
      <section className="page-section">
        <h2>Offres en cours</h2>
        <div className="empty-state" style={{ marginTop: 16 }}>
          <strong>Aucune offre publiée pour le moment</strong>
          <span>Les offres d’emploi et de stage de la FIF seront publiées sur cette page avec leur fiche de poste et la procédure de candidature.</span>
        </div>
        <p style={{ marginTop: 24 }}><Link className="button-outline" href="/contact">Contacter la FIF</Link></p>
      </section>
    </main>
  )
}
