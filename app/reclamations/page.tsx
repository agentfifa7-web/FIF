import { PageHero } from '@/components/site/PageHero'
import { ServiceSteps } from '@/components/site/ServiceSteps'
import { ReclamationForm } from '@/components/site/ReclamationForm'
import { loadCms } from '@/lib/cms/server'
import { getSettings } from '@/lib/cms/runtime'

export const metadata = { title: 'Réclamations et appels — FIF', description: 'Déposer une réclamation ou un appel et suivre son instruction.' }

export default async function ComplaintsPage() {
  await loadCms()
  const settings = getSettings()
  return (
    <main>
      <PageHero
        eyebrow="Services · Réclamations"
        title="Réclamations et appels"
        subtitle="Contester un résultat, une décision disciplinaire ou une décision administrative, et suivre l’instruction de votre dossier."
        breadcrumb={[{ label: 'Services', href: '/services' }, { label: 'Réclamations' }]}
        actions={<a className="button button-primary" href="#demarche">Déposer une réclamation</a>}
        noPhotos
      />
      <section className="page-section">
        <div className="svc-layout">
          <div>
            <div className="svc-block">
              <h2>Comment ça marche</h2>
              <ServiceSteps steps={[
                { title: 'Dépôt', text: 'Exposez les faits et joignez les pièces utiles, dans les délais prévus par les règlements.' },
                { title: 'Numéro de dossier', text: 'Un numéro de suivi vous est attribué dès l’enregistrement.' },
                { title: 'Instruction', text: 'La commission compétente examine le dossier et peut vous entendre.' },
                { title: 'Notification', text: 'La décision motivée vous est notifiée et peut faire l’objet d’un appel.' },
              ]} />
            </div>
            <div className="svc-block">
              <h2>Bon à savoir</h2>
              <p className="lede">Les délais et conditions de recevabilité sont fixés par les règlements des compétitions et le Code disciplinaire, consultables dans les documents officiels.</p>
              <a className="text-link" href="/documents">Consulter les documents officiels</a>
            </div>
          </div>
          <aside className="svc-action" id="demarche" aria-label="Formulaire de réclamation">
            <h2>Votre réclamation</h2>
            <ReclamationForm contactEmail={settings.contactEmail} />
          </aside>
        </div>
      </section>
    </main>
  )
}
