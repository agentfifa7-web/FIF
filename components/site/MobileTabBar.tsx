'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, Home, Newspaper, Ticket, Users } from 'lucide-react'

// Barre d'onglets fixe en bas d'écran, affichée uniquement sur mobile
// (voir .mtab dans ds.css) : accès en un geste aux rubriques les plus utilisées.
const TABS = [
  { href: '/', label: 'Accueil', icon: Home, match: (p: string) => p === '/' },
  { href: '/matches', label: 'Matchs', icon: CalendarDays, match: (p: string) => /^\/(matches|resultats|competitions|equipes-nationales)/.test(p) },
  { href: '/actualites', label: 'Actualités', icon: Newspaper, match: (p: string) => p.startsWith('/actualites') || p.startsWith('/fif-tv') },
  { href: '/billetterie', label: 'Billets', icon: Ticket, match: (p: string) => p.startsWith('/billetterie') },
  { href: '/supporters', label: 'Supporters', icon: Users, match: (p: string) => p.startsWith('/supporters') },
]

export function MobileTabBar() {
  const pathname = usePathname() || '/'
  if (pathname.startsWith('/admin')) return null
  return (
    <nav className="mtab" aria-label="Navigation rapide">
      {TABS.map(({ href, label, icon: Icon, match }) => {
        const active = match(pathname)
        return (
          <Link key={href} href={href} className={active ? 'is-active' : undefined} aria-current={active ? 'page' : undefined}>
            <Icon aria-hidden />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
