import Link from 'next/link'
import { WifiOff } from 'lucide-react'

export const metadata = { title: 'Hors connexion — FIF', robots: { index: false } }

// Page affichée par l'application lorsqu'aucune connexion n'est disponible
// et que la page demandée n'a pas encore été consultée.
export default function OfflinePage() {
  return (
    <main className="page-section" style={{ textAlign: 'center', minHeight: '50vh' }}>
      <WifiOff size={40} aria-hidden style={{ color: 'var(--orange)' }} />
      <h2>Vous êtes hors connexion</h2>
      <p className="lede" style={{ margin: '0 auto 24px' }}>
        Cette page n’est pas encore disponible hors connexion. Les pages déjà consultées restent accessibles ;
        les scores et classements se mettront à jour dès le retour du réseau.
      </p>
      <Link className="button button-primary" href="/">Retour à l’accueil</Link>
    </main>
  )
}
