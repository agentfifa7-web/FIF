import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { AdminCollectionManager } from '@/components/admin/AdminCollectionManager'
import { StorageNotice } from '@/components/admin/StorageNotice'
import { getAdminCollection } from '@/lib/cms/admin-data'
import { isCollectionKey, SCHEMAS } from '@/lib/cms/schema'

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params
  return { title: isCollectionKey(collection) ? `${SCHEMAS[collection].label} — Administration FIF` : 'Administration FIF' }
}

export default async function AdminCollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params
  if (!isCollectionKey(collection)) notFound()
  const schema = SCHEMAS[collection]
  const data = await getAdminCollection(collection)

  return (
    <main className="adm-page">
      <Link href="/admin" className="adm-back"><ArrowLeft size={15} /> Tableau de bord</Link>
      <h1>{schema.label}</h1>
      <p className="adm-lede">{schema.description}</p>
      {collection === 'matches' && <p className="adm-lede">La feuille de match (compositions, buteurs, cartons) se remplit avec le bouton « Feuille de match » de chaque ligne.</p>}
      <StorageNotice mode={data.storage} />
      <AdminCollectionManager collection={collection} records={data.records} refs={data.refs} deleted={data.deleted} edited={data.edited} canWrite={data.storage !== 'unavailable'} />
    </main>
  )
}
