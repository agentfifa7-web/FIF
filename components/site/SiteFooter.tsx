import Link from 'next/link'

const columns = [
  {
    title: 'Explorer',
    links: [
      { label: 'Éléphants', href: '/equipes-nationales/elephants' },
      { label: 'Compétitions', href: '/competitions' },
      { label: 'Clubs', href: '/clubs' },
      { label: 'Joueurs', href: '/joueurs' },
      { label: 'Actualités', href: '/actualites' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'FIF ID', href: '/fif-id' },
      { label: 'Licences', href: '/licences' },
      { label: 'Transferts', href: '/transferts' },
      { label: 'Portail Clubs', href: '/portail/clubs' },
      { label: 'Portail Officiels', href: '/officiels' },
      { label: 'Formation', href: '/formation' },
      { label: 'Stades', href: '/stades' },
      { label: 'Académies', href: '/academies' },
    ],
  },
  {
    title: 'La FIF',
    links: [
      { label: 'La Fédération', href: '/federation' },
      { label: 'Documents officiels', href: '/documents' },
      { label: 'Transparence', href: '/federation/transparence' },
      { label: 'Discipline', href: '/discipline' },
      { label: 'Réclamations', href: '/reclamations' },
      { label: 'Presse', href: '/presse' },
      { label: 'Carrières', href: '/carrieres' },
      { label: 'Archives', href: '/archives' },
    ],
  },
  {
    title: 'Supporters',
    links: [
      { label: 'Billetterie', href: '/billetterie' },
      { label: 'Boutique', href: '/boutique' },
      { label: 'FIF Fan Universe', href: '/supporters' },
      { label: 'FIF TV', href: '/fif-tv' },
      { label: 'Notifications', href: '/notifications' },
      { label: 'Contact & FAQ', href: '/contact' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <Link className="brand footer-brand" href="/">
            <img className="fif-logo" src="/fif-logo.png" alt="Fédération Ivoirienne de Football" />
            <span className="brand-copy"><strong>FIF</strong><small>DIGITAL</small></span>
          </Link>
          <p>Tout le football ivoirien,<br /><strong>dans un seul univers.</strong></p>
        </div>
        <div className="footer-links">
          {columns.map((col) => (
            <div key={col.title}>
              <b>{col.title}</b>
              {col.links.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
            </div>
          ))}
          <div>
            <b>Suivez-nous</b>
            <div className="socials">
              <a href="#facebook" aria-label="Facebook">f</a>
              <a href="#twitter" aria-label="Twitter">x</a>
              <a href="#instagram" aria-label="Instagram">ig</a>
              <a href="#youtube" aria-label="Youtube">yt</a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Fédération Ivoirienne de Football</span>
        <span><Link href="/documents">Mentions légales</Link> · <Link href="/documents">Politique de confidentialité</Link></span>
        <span className="made-in">Côte d&apos;Ivoire <i /></span>
      </div>
    </footer>
  )
}
