import { clubs } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { TransfertWorkflow } from '@/components/site/TransfertWorkflow'
import { ServiceSteps } from '@/components/site/ServiceSteps'
import { loadCms } from '@/lib/cms/server'

export const metadata = { title: 'Transferts — FIF', description: 'Demande et suivi d’un transfert de joueur entre clubs affiliés à la FIF.' }

export default async function TransfersPage() {
  await loadCms()
  const clubOptions = clubs.map((c) => ({ id: c.id, name: c.name }))
  return (
    <main>
      <PageHero
        eyebrow="Services · Transferts"
        title="Transferts de joueurs"
        subtitle="Un circuit traçable pour les transferts entre clubs affiliés, du dépôt de la demande à l’homologation."
        breadcrumb={[{ label: 'Services', href: '/services' }, { label: 'Transferts' }]}
        actions={<a className="button button-primary" href="#demarche">Déposer une demande</a>}
      />
      <section className="page-section">
        <div className="svc-layout">
          <div>
            <div className="svc-block">
              <h2>Comment ça marche</h2>
              <ServiceSteps steps={[
                { title: 'Demande du club d’accueil', text: 'Le club recruteur dépose la demande pour le joueur concerné.' },
                { title: 'Accord du club quitté', text: 'Le club d’origine confirme ou délivre sa lettre de sortie.' },
                { title: 'Contrôle fédéral', text: 'Vérification de la licence, des contrats et des périodes d’enregistrement.' },
                { title: 'Homologation', text: 'La FIF valide le transfert et met à jour la licence du joueur.' },
              ]} />
            </div>
            <div className="svc-block">
              <h2>Transferts homologués</h2>
              <div className="empty-state"><strong>Aucun transfert enregistré pour le moment</strong><span>Les transferts officiellement homologués par la FIF apparaîtront ici.</span></div>
            </div>
          </div>
          <aside className="svc-action" id="demarche" aria-label="Demande de transfert">
            <h2>Nouvelle demande</h2>
            <p>Réservée aux clubs affiliés.</p>
            <TransfertWorkflow clubs={clubOptions} />
          </aside>
        </div>
      </section>
    </main>
  )
}
