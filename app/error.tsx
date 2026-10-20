'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ErrorScreen } from '@/components/site/ErrorScreen'

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <ErrorScreen
      code="Oups"
      title="Un problème est survenu"
      text={`Cette page n’a pas pu s’afficher. Réessayez dans un instant ; si le problème persiste, revenez à l’accueil.${error.digest ? ` (référence : ${error.digest})` : ''}`}
      actions={<><button type="button" className="button button-primary" onClick={() => retry()}>Réessayer</button><Link href="/" className="button-outline">Retour à l’accueil</Link></>}
    />
  )
}
