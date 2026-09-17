import Link from 'next/link'
import { Search as SearchIcon } from 'lucide-react'
import { globalSearch } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { EmptyState } from '@/components/site/widgets'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Recherche — FIF Digital' }

const typeLabels: Record<string, string> = {
  joueur: 'Joueurs', club: 'Clubs', match: 'Matchs', 'compétition': 'Compétitions', article: 'Actualités', 'vidéo': 'Vidéos', arbitre: 'Arbitres', stade: 'Stades', formation: 'Formations',
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams
  const results = globalSearch(q)
  const grouped = results.reduce<Record<string, typeof results>>((acc, r) => {
    acc[r.type] = [...(acc[r.type] ?? []), r]
    return acc
  }, {})

  return (
    <main>
      <PageHero
        eyebrow="Moteur de recherche fédéral"
        title="Recherche"
        subtitle="Joueurs, clubs, matchs, compétitions, articles, vidéos, arbitres, stades, formations : un seul moteur pour tout le football ivoirien."
        breadcrumb={[{ label: 'Recherche' }]}
      />
      <section className="page-section tight">
        <form action="/search" method="get" className="search-field" style={{ maxWidth: 520, marginBottom: 32 }}>
          <SearchIcon />
          <input name="q" defaultValue={q} placeholder="ASEC, joueur, licence, calendrier…" aria-label="Recherche" />
        </form>

        {!q && <EmptyState title="Commencez votre recherche" hint="Essayez « ASEC », « joueur », « Ligue 1 », « licence » ou « formation »." />}
        {q && !results.length && <EmptyState title={`Aucun résultat pour « ${q} »`} hint="Vérifiez l’orthographe ou essayez un autre terme." />}

        {Object.entries(grouped).map(([type, items]) => (
          <div key={type} style={{ marginBottom: 28 }}>
            <p className="section-tag">{typeLabels[type] ?? type} ({items.length})</p>
            <div className="card-grid" style={{ marginTop: 12 }}>
              {items.map((r, i) => (
                <Link key={i} href={r.href} className="entity-card">
                  <div><strong>{r.title}</strong><span>{r.subtitle}</span></div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
