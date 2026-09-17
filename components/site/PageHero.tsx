import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="breadcrumb" aria-label="Fil d’Ariane">
      <Link href="/">Accueil</Link>
      {items.map((item, i) => (
        <span key={i}>
          <ChevronRight />
          {item.href ? <Link href={item.href}>{item.label}</Link> : <b>{item.label}</b>}
        </span>
      ))}
    </nav>
  )
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumb,
  meta,
  tone = 'forest',
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  breadcrumb?: { label: string; href?: string }[]
  meta?: { label: string; value: string }[]
  tone?: 'forest' | 'cream'
}) {
  return (
    <section className={`page-hero tone-${tone}`}>
      {breadcrumb && <Breadcrumb items={breadcrumb} />}
      {eyebrow && (
        <p className="eyebrow">
          <span /> {eyebrow}
        </p>
      )}
      <h1>{title}</h1>
      {subtitle && <p className="page-hero-sub">{subtitle}</p>}
      {meta && meta.length > 0 && (
        <div className="page-hero-meta">
          {meta.map((m) => (
            <div key={m.label}>
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
