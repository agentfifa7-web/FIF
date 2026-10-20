import { Camera, Mic, Newspaper } from 'lucide-react'
import { articles } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { NewsCard } from '@/components/site/cards'
import { DemoRequestForm } from '@/components/site/DemoRequestForm'
import { loadCms } from '@/lib/cms/server'

export const metadata = { title: 'Espace presse — FIF', description: 'Actualités, médiathèque et demandes d’accréditation pour les médias.' }

export default async function PressPage() {
  await loadCms()
  return (
    <main>
      <PageHero
        eyebrow="Médias"
        title="Espace presse"
        subtitle="Actualités officielles, médiathèque et accréditations pour les journalistes et organes de presse."
        breadcrumb={[{ label: 'Actualités', href: '/actualites' }, { label: 'Presse' }]}
        actions={<a className="button button-primary" href="#accreditation">Demander une accréditation</a>}
      />
      <section className="page-section">
        <div className="svc-layout">
          <div>
            <div className="svc-block">
              <h2>Ressources pour les médias</h2>
              <div className="svc-who">
                <div><Newspaper aria-hidden /><strong>Actualités officielles</strong><p>Résultats, programmes et annonces de la Fédération.</p></div>
                <div><Camera aria-hidden /><strong>Médiathèque</strong><p>Photos et vidéos officielles pour la presse accréditée.</p></div>
                <div><Mic aria-hidden /><strong>Conférences de presse</strong><p>Calendrier et retranscriptions des conférences fédérales.</p></div>
              </div>
            </div>
            <div className="svc-block">
              <h2>Dernières actualités</h2>
              <div className="news-grid">{articles.slice(0, 3).map((a) => <NewsCard key={a.id} article={a} />)}</div>
            </div>
          </div>
          <aside className="svc-action" id="accreditation" aria-label="Demande d’accréditation">
            <h2>Accréditation</h2>
            <p>Pour un match, une conférence de presse ou un événement fédéral.</p>
            <DemoRequestForm prefix="ACC" submitLabel="Envoyer la demande" fields={[
              { id: 'media', label: 'Média / organe de presse', required: true },
              { id: 'name', label: 'Nom du journaliste', required: true },
              { id: 'email', label: 'E-mail professionnel', type: 'email', required: true },
              { id: 'event', label: 'Événement concerné', placeholder: 'Match, conférence, événement…' },
            ]} />
          </aside>
        </div>
      </section>
    </main>
  )
}
