import Link from 'next/link'
import { PageHero } from '@/components/site/PageHero'
import { loadCms } from '@/lib/cms/server'
import { getSettings } from '@/lib/cms/runtime'

export const metadata = { title: 'Politique de confidentialité — FIF', description: 'Quelles données le site de la FIF enregistre, où et pourquoi.' }

export default async function ConfidentialitePage() {
  await loadCms()
  const s = getSettings()
  return (
    <main>
      <PageHero eyebrow="Informations légales" title="Politique de confidentialité" subtitle="Ce que le site enregistre, où, et pourquoi." breadcrumb={[{ label: 'Confidentialité' }]} noPhotos />
      <section className="page-section legal">
        <h2>Données enregistrées dans votre navigateur</h2>
        <p>Le compte FIF ID, le profil supporter (XP, badges, pronostics, publications), le panier, les billets et les demandes faites via les services en démonstration sont enregistrés <strong>uniquement dans votre navigateur</strong> (stockage local). Ils ne sont pas envoyés aux serveurs de la FIF. Vous pouvez les effacer à tout moment en supprimant les données du site dans votre navigateur.</p>
        <h2>Mesure d’audience</h2>
        <p>Le site utilise Vercel Web Analytics pour compter les visites de façon agrégée, sans cookie publicitaire.</p>
        <h2>Vidéos</h2>
        <p>Les vidéos YouTube sont intégrées en mode « confidentialité renforcée » (youtube-nocookie.com).</p>
        <h2>Espace administrateur</h2>
        <p>Un cookie de session est déposé uniquement pour les administrateurs connectés, afin de sécuriser l’accès au back-office.</p>
        <h2>Vos questions</h2>
        <p>{s.contactEmail ? <>Pour toute question sur vos données, écrivez à <a href={`mailto:${s.contactEmail}`}>{s.contactEmail}</a>.</> : <>Pour toute question sur vos données, utilisez la page <Link href="/contact">Contact</Link>.</>}</p>
      </section>
    </main>
  )
}
