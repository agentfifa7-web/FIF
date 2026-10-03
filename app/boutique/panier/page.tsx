import { products } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { CartView } from '@/components/site/CartView'
import { DemoBadge } from '@/components/site/DemoBadge'
import { loadCms } from '@/lib/cms/server'

export const metadata = { title: 'Mon panier — FIF Store' }

export default async function CartPage() {
  await loadCms()
  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'Boutique', href: '/boutique' }, { label: 'Mon panier' }]} />
        <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', letterSpacing: '-.03em', margin: '14px 0 0' }}>Mon panier</h1>
      </div>
      <section className="page-section tight">
        <CartView products={products} />
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
