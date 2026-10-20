'use client'

import Link from 'next/link'
import { Music } from 'lucide-react'
import { chants } from '@/lib/data/mock'
import { useFanProfile, viewChant } from '@/lib/fan'
import { PageHero } from '@/components/site/PageHero'

export default function ChantsPage() {
  const { profile } = useFanProfile()
  return (
    <main>
      <PageHero
        eyebrow="Fan Zone"
        title="Chants des supporters"
        subtitle="Les chants qui accompagnent les Éléphants et les clubs ivoiriens, avec leur origine et le moment où on les entonne."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Chants' }]}
        noPhotos
      />
      <section className="page-section">
        <div className="card-grid cols-2">
          {chants.map((c) => {
            const learned = profile?.chantsViewed.includes(c.id)
            return (
              <button type="button" key={c.id} className="entity-card fan-chant" onClick={() => viewChant(c.id)}>
                <Music size={18} aria-hidden />
                <div><strong>{c.title}</strong><span>{c.origin} · {c.occasion}</span></div>
                {profile && <span className={`status-pill ${learned ? 'ok' : 'neutral'}`}>{learned ? 'Consulté' : '+10 XP'}</span>}
              </button>
            )
          })}
        </div>
        <div className="empty-state" style={{ marginTop: 24 }}>
          <Music aria-hidden />
          <strong>Les chants des tribunes arrivent</strong>
          <p>Seuls des chants dont l’origine est documentée sont publiés. Vous connaissez un chant de supporters ? Partagez-le dans la <Link href="/supporters/fan-zone">Fan Zone</Link> : après modération, il pourra rejoindre ce recueil.</p>
        </div>
      </section>
    </main>
  )
}
