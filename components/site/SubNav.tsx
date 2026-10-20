'use client'

import { useEffect, useState } from 'react'

/** Navigation secondaire d'un univers : ancres vers les sections de la page,
 *  collée sous l'en-tête, avec la section visible mise en évidence. */
export function SubNav({ items, label = 'Sections de la page' }: { items: { id: string; label: string }[]; label?: string }) {
  const [active, setActive] = useState(items[0]?.id)
  useEffect(() => {
    const onScroll = () => {
      const offset = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sh-height')) || 112) + 80
      let current = items[0]?.id
      for (const it of items) {
        const el = document.getElementById(it.id)
        if (el && el.getBoundingClientRect().top - offset <= 0) current = it.id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [items])
  if (items.length < 2) return null
  return (
    <nav className="subnav" aria-label={label}>
      <div className="subnav-inner">
        {items.map((it) => (
          <a key={it.id} href={`#${it.id}`} className={active === it.id ? 'is-active' : undefined} aria-current={active === it.id ? 'location' : undefined}>{it.label}</a>
        ))}
      </div>
    </nav>
  )
}
