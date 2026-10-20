import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import type { SiteSettings } from '@/lib/cms/types'
import { InstallAppButton } from '@/components/site/InstallApp'

const columns = [
  {
    title: 'Équipes & compétitions',
    links: [
      { label: 'Éléphants', href: '/equipes-nationales/elephants' },
      { label: 'Éléphantes', href: '/equipes-nationales/elephantes' },
      { label: 'Ligue 1', href: '/competitions/ligue-1' },
      { label: 'Ligue 2', href: '/competitions/ligue-2' },
      { label: 'Calendrier', href: '/matches' },
      { label: 'Résultats', href: '/resultats' },
    ],
  },
  {
    title: 'Football ivoirien',
    links: [
      { label: 'Clubs', href: '/clubs' },
      { label: 'Joueurs', href: '/joueurs' },
      { label: 'Stades', href: '/stades' },
      { label: 'Football féminin', href: '/football/feminin' },
      { label: 'Académies', href: '/academies' },
      { label: 'Supporters', href: '/supporters' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Licences', href: '/licences' },
      { label: 'FIF ID', href: '/fif-id' },
      { label: 'Formation', href: '/formation' },
      { label: 'Portail Clubs', href: '/portail/clubs' },
      { label: 'Portail Officiels', href: '/officiels' },
      { label: 'Réclamations', href: '/reclamations' },
    ],
  },
  {
    title: 'La Fédération',
    links: [
      { label: 'Gouvernance', href: '/federation' },
      { label: 'Transparence', href: '/federation/transparence' },
      { label: 'Documents officiels', href: '/documents' },
      { label: 'Presse', href: '/presse' },
      { label: 'Recrutement', href: '/carrieres' },
      { label: 'Contact & FAQ', href: '/contact' },
    ],
  },
]

export function SiteFooter({ settings }: { settings?: SiteSettings }) {
  const socials = [
    { href: settings?.facebook, label: 'Facebook', short: 'f' },
    { href: settings?.x, label: 'X', short: 'X' },
    { href: settings?.instagram, label: 'Instagram', short: 'ig' },
    { href: settings?.youtube, label: 'YouTube', short: 'yt' },
    { href: settings?.tiktok, label: 'TikTok', short: 'tk' },
  ].filter((s) => s.href)
  return (
    <footer className="sf">
      <div className="sf-top">
        <div>
          <Link className="sf-brand" href="/">
            <img src="/fif-logo.png" alt="" width={64} height={64} />
            <span><strong>Fédération Ivoirienne de Football</strong><small>Membre de la FIFA et de la CAF</small></span>
          </Link>
          <p>Tout le football ivoirien : sélections nationales, compétitions, clubs, licenciés et supporters.</p>
          <div className="sf-contact">
            {settings?.address && <span><MapPin aria-hidden /> {settings.address}</span>}
            {settings?.contactPhone && <a href={`tel:${settings.contactPhone.replace(/\s/g, '')}`}><Phone aria-hidden /> {settings.contactPhone}</a>}
            {settings?.contactEmail && <a href={`mailto:${settings.contactEmail}`}><Mail aria-hidden /> {settings.contactEmail}</a>}
          </div>
          {socials.length > 0 && (
            <div className="sf-socials" aria-label="Réseaux sociaux">
              {socials.map((s) => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>{s.short}</a>)}
            </div>
          )}
          <div className="sf-app">
            <InstallAppButton className="button button-primary" label="Télécharger l’application" />
            <span>Android, iPhone et ordinateur</span>
          </div>
        </div>
        <div className="sf-cols">
          {columns.map((col) => (
            <div key={col.title}>
              <b>{col.title}</b>
              {col.links.map((l) => <Link key={l.href + l.label} href={l.href}>{l.label}</Link>)}
            </div>
          ))}
        </div>
      </div>
      <div className="sf-bottom">
        <span>© {new Date().getFullYear()} Fédération Ivoirienne de Football <span className="sf-flag" aria-hidden><i /><i /><i /></span></span>
        <nav aria-label="Informations légales">
          <Link href="/documents">Mentions légales</Link>
          <Link href="/documents">Politique de confidentialité</Link>
          <Link href="/supporters/charte">Charte du supporter</Link>
          <Link href="/design-system">Design system</Link>
        </nav>
      </div>
    </footer>
  )
}
