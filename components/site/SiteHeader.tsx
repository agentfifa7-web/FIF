'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { CalendarDays, ChevronDown, Menu, Search, ShoppingBag, Ticket, User, Users, X, Smartphone } from 'lucide-react'
import { CartLink } from './CartLink'
import { useAccount } from '@/lib/account'

type MegaLink = { label: string; href: string; hint?: string }
type MegaGroup = { title: string; links: MegaLink[] }
type NavEntry = { id: string; label: string; href: string; match: string[]; intro: string; cta: MegaLink; groups: MegaGroup[] }

// Navigation principale : six univers, chacun avec un sous-menu organisé.
export const NAV: NavEntry[] = [
  {
    id: 'equipes', label: 'Équipes nationales', href: '/equipes-nationales', match: ['/equipes-nationales', '/palmares'],
    intro: 'Les sept sélections de la Côte d’Ivoire, leurs calendriers, effectifs et palmarès.',
    cta: { label: 'Toutes les sélections', href: '/equipes-nationales' },
    groups: [
      { title: 'Seniors', links: [{ label: 'Éléphants', href: '/equipes-nationales/elephants', hint: 'Équipe A masculine' }, { label: 'Éléphantes', href: '/equipes-nationales/elephantes', hint: 'Équipe A féminine' }, { label: 'Palmarès', href: '/palmares' }] },
      { title: 'Jeunes et autres pratiques', links: [{ label: 'U23', href: '/equipes-nationales/u23' }, { label: 'U20', href: '/equipes-nationales/u20' }, { label: 'U17', href: '/equipes-nationales/u17' }, { label: 'Futsal', href: '/equipes-nationales/futsal' }, { label: 'Beach Soccer', href: '/equipes-nationales/beach-soccer' }] },
    ],
  },
  {
    id: 'competitions', label: 'Compétitions', href: '/competitions', match: ['/competitions', '/matches', '/resultats', '/data'],
    intro: 'Calendriers, résultats et classements de toutes les compétitions fédérales.',
    cta: { label: 'Calendrier des matchs', href: '/matches' },
    groups: [
      { title: 'Football professionnel', links: [{ label: 'Ligue 1', href: '/competitions/ligue-1' }, { label: 'Ligue 2', href: '/competitions/ligue-2' }, { label: 'Coupe Nationale', href: '/competitions/coupe-nationale' }, { label: 'Super Coupe', href: '/competitions/super-coupe' }] },
      { title: 'Autres championnats', links: [{ label: 'National Amateur (D3)', href: '/competitions/championnat-national-amateur' }, { label: 'Championnat féminin', href: '/competitions/championnat-feminin' }, { label: 'U20 · U17', href: '/competitions/championnat-u20' }, { label: 'Futsal · Beach Soccer', href: '/competitions/futsal-elite' }] },
      { title: 'Match Center', links: [{ label: 'Calendrier', href: '/matches' }, { label: 'Résultats', href: '/resultats' }, { label: 'Data Center', href: '/data' }] },
    ],
  },
  {
    id: 'football', label: 'Football ivoirien', href: '/football', match: ['/football', '/clubs', '/joueurs', '/stades', '/carte', '/academies', '/talent-hub'],
    intro: 'Clubs, joueurs, stades et toutes les pratiques du football en Côte d’Ivoire.',
    cta: { label: 'Trouver un club', href: '/clubs' },
    groups: [
      { title: 'Acteurs', links: [{ label: 'Clubs', href: '/clubs' }, { label: 'Joueurs', href: '/joueurs' }, { label: 'Stades', href: '/stades' }, { label: 'Carte du football', href: '/carte' }] },
      { title: 'Pratiques', links: [{ label: 'Football féminin', href: '/football/feminin' }, { label: 'Football amateur', href: '/football/amateur' }, { label: 'Football des jeunes', href: '/football/jeunes' }, { label: 'Futsal & Beach Soccer', href: '/football/futsal' }] },
      { title: 'Talents & mémoire', links: [{ label: 'Académies', href: '/academies' }, { label: 'Talent Hub', href: '/talent-hub' }, { label: 'Mémoire du football ivoirien', href: '/football' }] },
    ],
  },
  {
    id: 'actualites', label: 'Actualités', href: '/actualites', match: ['/actualites', '/presse', '/notifications'],
    intro: 'Résultats, annonces fédérales et revue de presse, mis à jour plusieurs fois par jour.',
    cta: { label: 'Toutes les actualités', href: '/actualites' },
    groups: [
      { title: 'S’informer', links: [{ label: 'Actualités fédérales', href: '/actualites' }, { label: 'Revue de presse', href: '/actualites#revue-de-presse' }, { label: 'Notifications', href: '/notifications' }] },
      { title: 'Médias', links: [{ label: 'Espace presse', href: '/presse' }, { label: 'Accréditations', href: '/presse' }] },
    ],
  },
  {
    id: 'tv', label: 'FIF TV', href: '/fif-tv', match: ['/fif-tv'],
    intro: 'Résumés, conférences de presse et coulisses des sélections.',
    cta: { label: 'Ouvrir FIF TV', href: '/fif-tv' },
    groups: [{ title: 'Vidéothèque', links: [{ label: 'Toutes les vidéos', href: '/fif-tv' }, { label: 'Application FIF', href: '/application', hint: 'Installer sur votre téléphone' }] }],
  },
  {
    id: 'federation', label: 'Fédération', href: '/federation', match: ['/federation', '/services', '/documents', '/discipline', '/reclamations', '/carrieres', '/licences', '/formation', '/arbitrage', '/transferts', '/portail', '/officiels', '/fif-id', '/aides-projets', '/projet-club', '/contact'],
    intro: 'Gouvernance, transparence, documents officiels et services aux licenciés.',
    cta: { label: 'Découvrir la FIF', href: '/federation' },
    groups: [
      { title: 'Institution', links: [{ label: 'La Fédération', href: '/federation' }, { label: 'Le Président', href: '/federation/president' }, { label: 'Transparence', href: '/federation/transparence' }, { label: 'Documents officiels', href: '/documents' }, { label: 'Discipline', href: '/discipline' }, { label: 'Carrières', href: '/carrieres' }] },
      { title: 'Services', links: [{ label: 'Tous les services en ligne', href: '/services' }, { label: 'Licences', href: '/licences' }, { label: 'FIF ID', href: '/fif-id' }, { label: 'Formation — FIF Academy', href: '/formation' }, { label: 'Arbitrage', href: '/arbitrage' }, { label: 'Transferts', href: '/transferts' }, { label: 'Réclamations', href: '/reclamations' }] },
      { title: 'Espaces professionnels', links: [{ label: 'Portail Clubs', href: '/portail/clubs' }, { label: 'Portail Officiels', href: '/officiels' }, { label: 'Projet Club & aides', href: '/aides-projets' }, { label: 'Contact', href: '/contact' }] },
    ],
  },
]

export function SiteHeader() {
  const [open, setOpen] = useState<string | null>(null)
  const [drawer, setDrawer] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  const { account } = useAccount()
  const headerRef = useRef<HTMLElement>(null)

  // Ferme les menus au changement de page, à Échap et au clic extérieur.
  useEffect(() => { setOpen(null); setDrawer(false) }, [pathname])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(null); setDrawer(false); setSearchOpen(false) } }
    const onClick = (e: MouseEvent) => { if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(null) }
    window.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick) }
  }, [])
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const update = () => {
      document.documentElement.style.setProperty('--sh-bottom', `${el.getBoundingClientRect().bottom}px`)
      document.documentElement.style.setProperty('--sh-height', `${el.offsetHeight}px`)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [open])
  useEffect(() => { document.body.style.overflow = drawer ? 'hidden' : '' }, [drawer])

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
    }
  }

  const current = NAV.find((n) => n.match.some((m) => pathname === m || pathname.startsWith(`${m}/`)))
  const firstName = account?.fullName.split(/\s+/)[0]

  return (
    <>
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <header className="site-header" ref={headerRef}>
        <div className="sh-utility">
          <div className="sh-utility-inner">
            <span className="sh-tag">Fédération Ivoirienne de Football</span>
            <nav className="sh-utility-links" aria-label="Accès rapides">
              <Link href="/supporters">Espace Supporters</Link>
              <Link href="/boutique">Boutique</Link>
              <Link href="/portail/clubs">Portail Clubs</Link>
              <Link href="/officiels">Portail Officiels</Link>
              <Link href="/application">Application</Link>
            </nav>
          </div>
        </div>
        <div className="sh-main">
          <Link className="sh-brand" href="/" aria-label="Fédération Ivoirienne de Football — accueil">
            <img src="/fif-logo.png" alt="" width={52} height={52} />
            <span className="sh-brand-text"><strong>FIF</strong><small>Fédération Ivoirienne de Football</small></span>
          </Link>

          <nav className="sh-nav" aria-label="Navigation principale">
            {NAV.map((item) => (
              <div key={item.id} className={open === item.id ? 'sh-nav-item is-open' : 'sh-nav-item'}>
                <button
                  type="button"
                  className={current?.id === item.id ? 'sh-nav-trigger is-current' : 'sh-nav-trigger'}
                  aria-expanded={open === item.id}
                  aria-controls={`mega-${item.id}`}
                  onClick={() => setOpen((v) => (v === item.id ? null : item.id))}
                >
                  {item.label} <ChevronDown aria-hidden />
                </button>
                {open === item.id && (
                  <div className="sh-mega" id={`mega-${item.id}`} style={{ ['--cols' as string]: item.groups.length }}>
                    <div className="sh-mega-intro">
                      <strong>{item.label}</strong>
                      <p>{item.intro}</p>
                      <Link className="button button-primary" href={item.cta.href}>{item.cta.label}</Link>
                    </div>
                    {item.groups.map((g) => (
                      <div className="sh-mega-col" key={g.title}>
                        <b>{g.title}</b>
                        {g.links.map((l) => (
                          <Link key={l.label} href={l.href}>{l.label}{l.hint && <small>{l.hint}</small>}</Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="sh-actions">
            <button className="sh-icon" aria-label="Rechercher" type="button" onClick={() => setSearchOpen(true)}><Search /></button>
            <CartLink compact />
            <Link className="sh-icon" href={account ? '/compte' : '/connexion'} aria-label={account ? `Mon compte (${firstName})` : 'Se connecter'}><User /></Link>
            <Link className="button button-primary sh-cta sh-cta-desk" href="/billetterie"><Ticket aria-hidden /> Billetterie</Link>
            <button className="sh-icon sh-burger" aria-label="Ouvrir le menu" aria-expanded={drawer} type="button" onClick={() => setDrawer(true)}><Menu /></button>
          </div>
        </div>
      </header>

      {drawer && (
        <div className="sh-drawer" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="sh-drawer-head">
            <Link className="sh-brand" href="/" onClick={() => setDrawer(false)}>
              <img src="/fif-logo.png" alt="" width={44} height={44} />
              <span className="sh-brand-text"><strong>FIF</strong></span>
            </Link>
            <button className="sh-icon" type="button" aria-label="Fermer le menu" onClick={() => setDrawer(false)}><X /></button>
          </div>
          <div className="sh-drawer-body">
            <div className="sh-drawer-quick">
              <Link href="/billetterie"><Ticket /> Billetterie</Link>
              <Link href="/matches"><CalendarDays /> Calendrier</Link>
              <Link href="/supporters"><Users /> Supporters</Link>
              <Link href="/boutique"><ShoppingBag /> Boutique</Link>
              <Link href={account ? '/compte' : '/connexion'}><User /> {account ? `Bonjour, ${firstName}` : 'Se connecter'}</Link>
              <Link href="/application"><Smartphone /> Application</Link>
            </div>
            {NAV.map((item) => (
              <details className="sh-acc" key={item.id} open={current?.id === item.id}>
                <summary>{item.label} <ChevronDown aria-hidden /></summary>
                <div>
                  <Link href={item.cta.href}><b>{item.cta.label}</b></Link>
                  {item.groups.flatMap((g) => g.links).map((l) => <Link key={l.label + l.href} href={l.href}>{l.label}</Link>)}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Recherche">
          <form onSubmit={submitSearch}>
            <Search />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un joueur, un club, un match, une formation…"
              aria-label="Recherche"
            />
            <button type="button" onClick={() => setSearchOpen(false)} aria-label="Fermer la recherche"><X /></button>
          </form>
          <div className="search-suggestions">
            <span>Essayez :</span>
            {['ASEC', 'Ligue 1', 'Éléphants', 'Licence', 'Calendrier'].map((s) => (
              <button key={s} type="button" onClick={() => { setQuery(s); router.push(`/search?q=${encodeURIComponent(s)}`); setSearchOpen(false) }}>{s}</button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
