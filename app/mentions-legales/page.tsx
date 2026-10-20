import Link from 'next/link'
import { PageHero } from '@/components/site/PageHero'
import { loadCms } from '@/lib/cms/server'
import { getSettings } from '@/lib/cms/runtime'

export const metadata = { title: 'Mentions légales — FIF', description: 'Éditeur, hébergement et conditions d’utilisation du site de la Fédération Ivoirienne de Football.' }

const TODO = <em className="legal-todo">à compléter par la FIF</em>

export default async function MentionsLegalesPage() {
  await loadCms()
  const s = getSettings()
  return (
    <main>
      <PageHero eyebrow="Informations légales" title="Mentions légales" breadcrumb={[{ label: 'Mentions légales' }]} noPhotos />
      <section className="page-section legal">
        <h2>Éditeur du site</h2>
        <p>Fédération Ivoirienne de Football (FIF), membre de la FIFA et de la CAF.</p>
        <ul>
          <li>Adresse : {s.address || TODO}</li>
          <li>Téléphone : {s.contactPhone || TODO}</li>
          <li>Courriel : {s.contactEmail ? <a href={`mailto:${s.contactEmail}`}>{s.contactEmail}</a> : TODO}</li>
          <li>Directeur ou directrice de la publication : {TODO}</li>
        </ul>
        <h2>Hébergement</h2>
        <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — <a href="https://vercel.com" rel="noopener noreferrer">vercel.com</a>.</p>
        <h2>Contenus</h2>
        <p>Les résultats, calendriers et informations publiés proviennent de sources citées sur chaque page (communiqués officiels et presse sportive). Un score publié par une seule source est signalé « à confirmer ». Les services en ligne marqués « démonstration » ne transmettent aucune demande à la FIF et n’effectuent aucun paiement.</p>
        <h2>Propriété intellectuelle</h2>
        <p>Le nom, le logo et les marques de la FIF sont protégés. Toute reproduction sans autorisation est interdite. Les photographies et vidéos restent la propriété de leurs auteurs.</p>
        <p>Voir aussi la <Link href="/confidentialite">politique de confidentialité</Link> et les <Link href="/documents">documents officiels</Link>.</p>
      </section>
    </main>
  )
}
