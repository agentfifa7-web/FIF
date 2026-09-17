'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ChevronDown, Menu, Search, X } from 'lucide-react'

const universe = [
  {
    title: 'La FIF',
    items: [
      { label: 'La Fédération', href: '/federation' },
      { label: 'Gouvernance', href: '/federation#gouvernance' },
      { label: 'Documents officiels', href: '/documents' },
      { label: 'Transparence', href: '/federation#transparence' },
      { label: 'Palmarès', href: '/palmares' },
      { label: 'Presse', href: '/presse' },
      { label: 'Carrières', href: '/carrieres' },
    ],
  },
  {
    title: 'Équipes nationales',
    items: [
      { label: 'Éléphants', href: '/equipes-nationales/elephants' },
      { label: 'Éléphantes', href: '/equipes-nationales/elephantes' },
      { label: 'U23 / U20 / U17', href: '/equipes-nationales' },
      { label: 'Futsal & Beach Soccer', href: '/equipes-nationales' },
    ],
  },
  {
    title: 'Le football',
    items: [
      { label: 'Ligue 1', href: '/competitions/ligue-1' },
      { label: 'Ligue 2', href: '/competitions/ligue-2' },
      { label: 'Football féminin', href: '/football/feminin' },
      { label: 'Football amateur', href: '/football/amateur' },
      { label: 'Football des jeunes', href: '/football/jeunes' },
      { label: 'Futsal & Beach Soccer', href: '/football/futsal' },
    ],
  },
  {
    title: 'Pratiquer & Services',
    items: [
      { label: 'Trouver un club', href: '/clubs' },
      { label: 'Carte du football ivoirien', href: '/carte' },
      { label: 'Prendre une licence', href: '/licences' },
      { label: 'FIF ID', href: '/fif-id' },
      { label: 'Formation — FIF Academy', href: '/formation' },
      { label: 'Arbitrage', href: '/arbitrage' },
      { label: 'Transferts', href: '/transferts' },
      { label: 'Stades', href: '/stades' },
      { label: 'Académies & Talent Hub', href: '/talent-hub' },
      { label: 'Projet Club & Aides FIF', href: '/aides-projets' },
      { label: 'Portail Clubs', href: '/portail/clubs' },
    ],
  },
]

const utilityLinks = [
  { label: 'Billetterie', href: '/billetterie' },
  { label: 'Boutique', href: '/boutique' },
  { label: 'Supporters', href: '/supporters' },
  { label: 'FIF Academy', href: '/formation' },
  { label: 'Portail Clubs', href: '/portail/clubs' },
  { label: 'Portail Officiels', href: '/officiels' },
  { label: 'Presse', href: '/presse' },
]

const mainNav = [
  { label: 'Équipes nationales', href: '/equipes-nationales' },
  { label: 'Compétitions', href: '/competitions' },
  { label: 'Football', href: '/football/amateur' },
  { label: 'Clubs', href: '/clubs' },
  { label: 'Joueurs', href: '/joueurs' },
  { label: 'Actualités', href: '/actualites' },
  { label: 'FIF TV', href: '/fif-tv' },
  { label: 'Data', href: '/data' },
]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [universeOpen, setUniverseOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
    }
  }

  return (
    <>
      <div className="utility-bar">
        <div className="utility-inner">
          <span>FIF DIGITAL UNIVERSE</span>
          <div>
            {utilityLinks.map((l) => (
              <Link key={l.href} href={l.href}>{l.label}</Link>
            ))}
            <Link href="/connexion">Se connecter</Link>
          </div>
        </div>
      </div>
      <header className="topbar">
        <Link className="brand" href="/" aria-label="FIF Digital accueil">
          <img className="fif-logo" src="/fif-logo.png" alt="Fédération Ivoirienne de Football" />
          <span className="brand-copy"><strong>FIF</strong><small>DIGITAL</small></span>
        </Link>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Navigation principale">
          <button type="button" className={universeOpen ? 'nav-dropdown active' : 'nav-dropdown'} onClick={() => setUniverseOpen((v) => !v)}>
            Univers FIF <ChevronDown />
          </button>
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>
          ))}
          <Link href="/federation" onClick={() => setMenuOpen(false)}>Fédération</Link>
          {universeOpen && (
            <div className="universe-panel">
              {universe.map((group) => (
                <div key={group.title}>
                  <b>{group.title}</b>
                  {group.items.map((item) => (
                    <Link href={item.href} key={item.label} onClick={() => { setUniverseOpen(false); setMenuOpen(false) }}>{item.label}</Link>
                  ))}
                </div>
              ))}
            </div>
          )}
        </nav>
        <div className="nav-actions">
          <button className="icon-button" aria-label="Rechercher" type="button" onClick={() => setSearchOpen(true)}><Search /></button>
          <Link className="login-link" href="/compte">Compte</Link>
          <button className="menu-button" aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} type="button" onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {searchOpen && (
        <div className="search-overlay" role="dialog" aria-modal="true">
          <form onSubmit={submitSearch}>
            <Search />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un joueur, un club, un match, une formation…"
              aria-label="Recherche fédérale"
            />
            <button type="button" onClick={() => setSearchOpen(false)} aria-label="Fermer la recherche"><X /></button>
          </form>
          <div className="search-suggestions">
            <span>Essayez :</span>
            {['ASEC', 'Ligue 1', 'Licence', 'Formation', 'Calendrier'].map((s) => (
              <button key={s} type="button" onClick={() => { setQuery(s); router.push(`/search?q=${encodeURIComponent(s)}`); setSearchOpen(false) }}>{s}</button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
