import { products } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { StoreGrid } from '@/components/site/StoreGrid'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'FIF Store — Boutique' }

export default function StorePage() {
  return (
    <main>
      <PageHero
        eyebrow="FIF Store"
        title="Boutique"
        subtitle="Maillots, tenues, accessoires et collections officielles Éléphants — personnalisation nom, numéro et floquage."
        breadcrumb={[{ label: 'Boutique' }]}
        meta={[{ value: String(products.length), label: 'Articles disponibles' }]}
      />
      <section className="page-section tight">
        <StoreGrid products={products} />
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
