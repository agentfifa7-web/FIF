'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { players } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

export default function VerifyPage() {
  const router = useRouter()
  const [id, setId] = useState('')
  const sample = players[12]?.fifId

  return (
    <main>
      <PageHero
        eyebrow="Vérification d’identité"
        title="Vérifier un FIF ID"
        subtitle="Saisissez un identifiant fédéral pour vérifier son authenticité. Aucune donnée privée n’est révélée."
        breadcrumb={[{ label: 'FIF ID', href: '/fif-id' }, { label: 'Vérifier' }]}
      />
      <section className="page-section tight">
        <form
          className="search-field"
          style={{ maxWidth: 460 }}
          onSubmit={(e) => { e.preventDefault(); if (id.trim()) router.push(`/verifier/${encodeURIComponent(id.trim())}`) }}
        >
          <input value={id} onChange={(e) => setId(e.target.value)} placeholder={`ex. ${sample ?? 'FIF-000123'}`} aria-label="Identifiant FIF" />
          <button type="submit" className="button-outline" style={{ padding: '8px 14px' }}>Vérifier</button>
        </form>
        <p className="lede" style={{ marginTop: 16 }}>Exemple à tester : <Link href={`/verifier/${sample}`}>{sample}</Link></p>
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
