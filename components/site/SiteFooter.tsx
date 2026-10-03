import Link from 'next/link'
import type { SiteSettings } from '@/lib/cms/types'

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

export function SiteFooter({ settings }: { settings?: SiteSettings }) {
  const socials = [
    { href: settings?.facebook, label: 'Facebook', short: 'f' },
    { href: settings?.x, label: 'X', short: 'x' },
    { href: settings?.instagram, label: 'Instagram', short: 'ig' },
    { href: settings?.youtube, label: 'YouTube', short: 'yt' },
    { href: settings?.tiktok, label: 'TikTok', short: 'tk' },
  ].filter((s) => s.href)
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
          {socials.length > 0 && (
            <div>
              <b>Suivez-nous</b>
              <div className="socials">
                {socials.map((s) => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>{s.short}</a>)}
              </div>
            </div>
          )}
          {(settings?.contactEmail || settings?.contactPhone) && (
            <div>
              <b>Contact</b>
              {settings.contactEmail && <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>}
              {settings.contactPhone && <a href={`tel:${settings.contactPhone.replace(/\s/g, '')}`}>{settings.contactPhone}</a>}
              {settings.address && <span>{settings.address}</span>}
            </div>
          )}
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
