import Link from 'next/link'
import { Megaphone } from 'lucide-react'
import type { SiteSettings } from '@/lib/cms/types'

/** Bandeau d'annonce défini dans Admin → Paramètres. */
export function SiteAnnouncement({ settings }: { settings: SiteSettings }) {
  if (!settings.alertEnabled || !settings.alertText.trim()) return null
  const content = <><Megaphone size={15} /> <span>{settings.alertText}</span></>
  return (
    <div className="site-announcement" role="status">
      {settings.alertLink ? <Link href={settings.alertLink}>{content}</Link> : <p>{content}</p>}
    </div>
  )
}
