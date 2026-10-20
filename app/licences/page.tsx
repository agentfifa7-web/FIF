import { Award, FileCheck2, Shield, Users } from 'lucide-react'
import { PageHero } from '@/components/site/PageHero'
import { LicenceWorkflow } from '@/components/site/LicenceWorkflow'
import { ServiceSteps } from '@/components/site/ServiceSteps'
import { loadCms } from '@/lib/cms/server'

export const metadata = { title: 'Licences — FIF', description: 'Demander ou renouveler une licence fédérale : joueurs, entraîneurs, arbitres, dirigeants, agents et clubs.' }

const audiences = [
  { icon: Users, label: 'Joueurs et joueuses', desc: 'Licence sportive obligatoire pour évoluer en compétition officielle.' },
  { icon: Shield, label: 'Dirigeants et clubs', desc: 'Affiliation du club et habilitation des dirigeants.' },
  { icon: Award, label: 'Entraîneurs, arbitres et agents', desc: 'Licences techniques, d’arbitre et d’agent sportif.' },
]
const documents = [
  { title: 'Certificat médical', hint: 'De moins de 3 mois' },
  { title: 'Pièce d’identité', hint: 'CNI, passeport ou extrait de naissance' },
  { title: 'Photo d’identité', hint: 'Fond clair, format JPEG ou PNG' },
  { title: 'Justificatif du club', hint: 'Attestation signée par le club' },
]

export default async function LicencesPage() {
  await loadCms()
  return (
    <main>
      <PageHero
        eyebrow="Services · Licences"
        title="Demander une licence"
        subtitle="La licence fédérale ouvre l’accès aux compétitions officielles pour les joueurs, entraîneurs, arbitres, dirigeants, agents et clubs."
        breadcrumb={[{ label: 'Services', href: '/services' }, { label: 'Licences' }]}
        actions={<a className="button button-primary" href="#demarche">Commencer ma demande</a>}
      />
      <section className="page-section">
        <div className="svc-layout">
          <div>
            <div className="svc-block">
              <h2>Qui est concerné ?</h2>
              <div className="svc-who">
                {audiences.map((a) => <div key={a.label}><a.icon aria-hidden /><strong>{a.label}</strong><p>{a.desc}</p></div>)}
              </div>
            </div>
            <div className="svc-block">
              <h2>Comment ça marche</h2>
              <ServiceSteps steps={[
                { title: 'Création du dossier', text: 'Le licencié ou son club renseigne le type de licence et l’identité.' },
                { title: 'Pièces justificatives', text: 'Certificat médical, pièce d’identité, photo et justificatif du club.' },
                { title: 'Validation', text: 'Contrôle par la ligue et la FIF, puis paiement des droits de licence.' },
                { title: 'Émission', text: 'Licence numérique rattachée au FIF ID, renouvelable chaque saison.' },
              ]} />
            </div>
            <div className="svc-block">
              <h2>Pièces à fournir</h2>
              <ul className="svc-docs">
                {documents.map((d) => <li key={d.title}><FileCheck2 size={20} aria-hidden /><div><strong>{d.title}</strong><span>{d.hint}</span></div></li>)}
              </ul>
            </div>
          </div>
          <aside className="svc-action" id="demarche" aria-label="Formulaire de demande">
            <h2>Votre demande</h2>
            <p>Suivez ensuite l’avancement de votre dossier sur cette page.</p>
            <LicenceWorkflow />
          </aside>
        </div>
      </section>
    </main>
  )
}
