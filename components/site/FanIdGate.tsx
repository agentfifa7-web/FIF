'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IdCard } from 'lucide-react'
import { useFanProfile, type FanProfile } from '@/lib/fan'

/**
 * Réserve une fonctionnalité aux supporters connectés. Il n'y a qu'un seul
 * compte : le FIF ID, qui active automatiquement le profil supporter.
 */
export function FanIdGate({ children, title, hint }: { children: (profile: FanProfile) => React.ReactNode; title?: string; hint?: string }) {
  const { profile, ready } = useFanProfile()
  const pathname = usePathname()

  if (!ready) return null

  if (!profile) {
    const next = encodeURIComponent(pathname || '/supporters')
    return (
      <div className="fan-gate">
        <IdCard size={28} />
        <strong>{title ?? 'Connectez-vous avec votre FIF ID'}</strong>
        <p>{hint ?? 'Un seul compte pour tout : votre FIF ID inclut votre Fan ID et toutes les fonctionnalités supporters. Il se crée en une minute avec votre numéro de téléphone.'}</p>
        <div className="button-group" style={{ justifyContent: 'center' }}>
          <Link href={`/inscription?next=${next}`} className="button button-primary">Créer mon FIF ID</Link>
          <Link href={`/connexion?next=${next}`} className="button-outline">Se connecter</Link>
        </div>
      </div>
    )
  }

  return <>{children(profile)}</>
}
