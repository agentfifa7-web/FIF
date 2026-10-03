import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SettingsForm } from '@/components/admin/SettingsForm'
import { StorageNotice } from '@/components/admin/StorageNotice'
import { loadCms } from '@/lib/cms/server'
import { storageMode } from '@/lib/cms/store'

export const metadata = { title: 'Paramètres — Administration FIF' }

export default async function SettingsPage() {
  const cms = await loadCms()
  const mode = storageMode()
  return (
    <main className="adm-page">
      <Link href="/admin" className="adm-back"><ArrowLeft size={15} /> Tableau de bord</Link>
      <h1>Paramètres</h1>
      <p className="adm-lede">Informations générales du site, bandeau d’annonce, coordonnées, réseaux sociaux et ouverture des ventes.</p>
      <StorageNotice mode={mode} />
      <SettingsForm initial={cms.settings} canWrite={mode !== 'unavailable'} />
    </main>
  )
}
