import Link from 'next/link'
import { notFound } from 'next/navigation'
import { products } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { ProductArt } from '@/components/site/ProductArt'
import { ProductPurchase } from '@/components/site/ProductPurchase'
import { CartLink } from '@/components/site/CartLink'
import { DemoBadge } from '@/components/site/DemoBadge'
import { loadCms } from '@/lib/cms/server'

export async function generateStaticParams() {
  await loadCms()
  return products.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  await loadCms()
  const { id } = await params
  const product = products.find((p) => p.id === id)
  return { title: product ? `${product.name} — FIF Store` : 'FIF Store' }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  await loadCms()
  const { id } = await params
  const product = products.find((p) => p.id === id)
  if (!product) notFound()
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <main>
      <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'Boutique', href: '/boutique' }, { label: product.category, href: '/boutique' }, { label: product.name }]} />
        <CartLink />
      </div>

      <section className="page-section tight">
        <div className="product-detail">
          <div className="product-detail-media">
            {product.photo ? <img src={product.photo} alt={product.name} /> : <ProductArt product={product} />}
            {product.badge && <em className="product-badge">{product.badge}</em>}
          </div>
          <div>
            <p className="section-tag">{product.category}</p>
            <h1 style={{ fontSize: 'clamp(26px,3.4vw,40px)', letterSpacing: '-.03em', margin: '6px 0 10px' }}>{product.name}</h1>
            {product.description && <p className="lede" style={{ marginTop: 0 }}>{product.description}</p>}
            <ProductPurchase product={product} />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="page-section tight">
          <p className="section-tag">Dans la même catégorie</p>
          <div className="card-grid cols-4" style={{ marginTop: 16 }}>
            {related.map((p) => (
              <Link key={p.id} href={`/boutique/${p.id}`} className="product-card">
                <div className={p.photo ? 'product-image has-photo' : 'product-image'}>
                  {p.photo ? <img src={p.photo} alt={p.name} loading="lazy" /> : <ProductArt product={p} />}
                </div>
                <strong>{p.name}</strong>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
