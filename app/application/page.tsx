import { Download, RefreshCw, Smartphone, WifiOff } from 'lucide-react'
import { PageHero } from '@/components/site/PageHero'
import { InstallAppButton, InstallSteps } from '@/components/site/InstallApp'

export const metadata = {
  title: 'Application FIF — Télécharger',
  description: 'Installez gratuitement l’application FIF sur votre téléphone : résultats, calendrier, classements et Éléphants.',
}

const features = [
  { icon: Smartphone, title: 'Sur votre écran d’accueil', text: 'L’icône FIF s’ajoute à côté de vos autres applications et s’ouvre en plein écran.' },
  { icon: RefreshCw, title: 'Toujours à jour', text: 'Scores, classements et programmes se mettent à jour en même temps que le site, sans rien réinstaller.' },
  { icon: WifiOff, title: 'Consultation hors connexion', text: 'Les dernières pages consultées restent lisibles même sans réseau.' },
  { icon: Download, title: 'Gratuite et légère', text: 'Aucun magasin d’applications, aucun compte requis : quelques secondes suffisent.' },
]

export default function ApplicationPage() {
  return (
    <main>
      <PageHero
        eyebrow="Application mobile"
        title="Téléchargez l’application FIF"
        subtitle="Tout le football ivoirien dans votre poche : résultats, calendrier, classements, Éléphants, clubs et joueurs."
        breadcrumb={[{ label: 'Application' }]}
      />

      <section className="page-section tight">
        <div className="app-install-hero">
          <img src="/icons/icon-192.png" alt="Icône de l’application FIF" width={96} height={96} />
          <div>
            <h2>FIF — Fédération Ivoirienne de Football</h2>
            <p className="lede">Gratuite · Android, iPhone, iPad et ordinateur</p>
            <InstallAppButton />
          </div>
        </div>
      </section>

      <section className="page-section tight">
        <div className="card-grid cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="app-feature">
              <Icon size={22} aria-hidden />
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section tight">
        <div className="card-grid cols-2">
          <div className="app-feature">
            <p className="section-tag">Android</p>
            <p>Touchez <strong>« Télécharger l’application »</strong> puis <strong>Installer</strong>. Si le bouton ne propose rien :</p>
            <InstallSteps platform="manual" />
          </div>
          <div className="app-feature">
            <p className="section-tag">iPhone / iPad</p>
            <p>Apple n’autorise pas l’installation en un clic depuis un site :</p>
            <InstallSteps platform="ios" />
          </div>
        </div>
      </section>
    </main>
  )
}
