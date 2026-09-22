'use client'

import Link from 'next/link'
import { IdCard } from 'lucide-react'
import { useFanProfile, type FanProfile } from '@/lib/fan'

export function FanIdGate({ children, title, hint }: { children: (profile: FanProfile) => React.ReactNode; title?: string; hint?: string }) {
  const { profile, ready } = useFanProfile()

  if (!ready) return null

  if (!profile) {
    return (
      <div className="fan-gate">
        <IdCard size={28} />
        <strong>{title ?? 'Créez votre FIF Fan ID'}</strong>
        <p>{hint ?? 'Cette fonctionnalité nécessite un Fan ID — votre identité numérique de supporter, gratuite et créée en quelques secondes.'}</p>
        <Link href="/supporters/fan-id" className="button button-primary">Créer mon Fan ID</Link>
      </div>
    )
  }

  return <>{children(profile)}</>
}
