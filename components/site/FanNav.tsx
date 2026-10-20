'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Navigation commune du FIF Fan Universe, collée sous l'en-tête.
const LINKS: { href: string; label: string; match?: string[] }[] = [
  { href: '/supporters', label: 'Accueil' },
  { href: '/supporters/fan-id', label: 'Mon Fan ID', match: ['/supporters/fan-id', '/supporters/niveaux', '/supporters/badges', '/supporters/fan-studio'] },
  { href: '/supporters/arena', label: 'Jeux & quiz', match: ['/supporters/arena', '/supporters/classements'] },
  { href: '/supporters/matchday', label: 'Matchday' },
  { href: '/supporters/fan-zone', label: 'Fan Zone', match: ['/supporters/fan-zone', '/supporters/tifo-studio', '/supporters/chants'] },
  { href: '/supporters/passeport', label: 'Football Tour' },
  { href: '/supporters/associations', label: 'Communauté', match: ['/supporters/associations', '/supporters/club-des-supporters', '/supporters/partenaires', '/supporters/recompenses', '/supporters/charte', '/supporters/moderation'] },
]

export function FanNav() {
  const pathname = usePathname() || ''
  const isActive = (l: (typeof LINKS)[number]) =>
    l.href === '/supporters' ? pathname === '/supporters' : (l.match ?? [l.href]).some((m) => pathname === m || pathname.startsWith(m + '/'))
  return (
    <nav className="subnav fan-nav" aria-label="FIF Fan Universe">
      <div className="subnav-inner">
        <span className="fan-nav-brand" aria-hidden>Fan Universe</span>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={isActive(l) ? 'is-active' : undefined} aria-current={isActive(l) ? 'page' : undefined}>{l.label}</Link>
        ))}
      </div>
    </nav>
  )
}
