import Link from 'next/link'

const SUGGESTIONS = [
  { href: '/matches', label: 'Calendrier des matchs' },
  { href: '/resultats', label: 'Résultats' },
  { href: '/actualites', label: 'Actualités' },
  { href: '/equipes-nationales/elephants', label: 'Les Éléphants' },
  { href: '/clubs', label: 'Clubs' },
  { href: '/services', label: 'Services en ligne' },
]

/** Écran commun aux pages « introuvable » et « erreur ». */
export function ErrorScreen({ code, title, text, actions }: { code: string; title: string; text: string; actions?: React.ReactNode }) {
  return (
    <main className="err-page">
      <div className="err-inner">
        <p className="err-code" aria-hidden="true">{code}</p>
        <h1>{title}</h1>
        <p className="lede">{text}</p>
        <div className="button-group">{actions ?? <Link href="/" className="button button-primary">Retour à l’accueil</Link>}</div>
        <nav aria-label="Pages utiles" className="err-links">
          <strong>Vous cherchiez peut-être</strong>
          <ul>{SUGGESTIONS.map((s) => <li key={s.href}><Link href={s.href}>{s.label}</Link></li>)}</ul>
        </nav>
      </div>
    </main>
  )
}
