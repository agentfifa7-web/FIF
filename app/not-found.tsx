import Link from 'next/link'
import { ErrorScreen } from '@/components/site/ErrorScreen'

export const metadata = { title: 'Page introuvable — FIF', robots: { index: false } }

export default function NotFound() {
  return (
    <ErrorScreen
      code="404"
      title="Cette page est introuvable"
      text="L’adresse a peut-être changé, ou le contenu n’est plus disponible. Utilisez la recherche ou l’un des liens ci-dessous."
      actions={<><Link href="/" className="button button-primary">Retour à l’accueil</Link><Link href="/search" className="button-outline">Rechercher</Link></>}
    />
  )
}
