'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Camera, Clock, Flag, Heart } from 'lucide-react'
import { cityName, fanZonePosts } from '@/lib/data/mock'
import { publishFanZonePost, type FanZoneDraft, type FanProfile } from '@/lib/fan'
import { FanIdGate } from '@/components/site/FanIdGate'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'
import { formatDate } from '@/lib/format'

const TYPES: FanZoneDraft['type'][] = ['Photo', 'Vidéo', 'Chant', 'Message', 'Tifo']

function PublishForm({ profile }: { profile: FanProfile }) {
  const [type, setType] = useState<FanZoneDraft['type']>('Message')
  const [caption, setCaption] = useState('')
  const [justPublished, setJustPublished] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!caption.trim()) return
    publishFanZonePost(type, caption.trim())
    setCaption('')
    setJustPublished(true)
  }

  return (
    <form className="form-card" style={{ margin: 0, maxWidth: 'none' }} onSubmit={submit}>
      <h1 style={{ fontSize: 20 }}>Publier dans la Fan Zone</h1>
      <p className="muted-sm">Photos, vidéos, chants, messages ou créations — tout contenu est soumis à modération avant publication publique.</p>
      <div className="text-field">
        <label htmlFor="fz-type">Type de contenu</label>
        <select id="fz-type" value={type} onChange={(e) => setType(e.target.value as FanZoneDraft['type'])}>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="text-field">
        <label htmlFor="fz-caption">Votre message</label>
        <textarea id="fz-caption" rows={3} required placeholder="Partagez un moment, une photo décrite, un souvenir…" value={caption} onChange={(e) => setCaption(e.target.value)} />
      </div>
      <div className="form-actions">
        <button type="submit" className="button button-primary" style={{ justifyContent: 'center' }}><Camera size={14} /> Publier (+20 XP)</button>
      </div>
      {justPublished && <p className="pronostic-submitted" style={{ justifyContent: 'flex-start' }}><Clock size={14} /> Envoyé — en attente de modération</p>}
      {profile.fanZonePosts.length > 0 && (
        <>
          <p className="section-tag" style={{ marginTop: 24 }}>Mes publications</p>
          <div className="ci-map-panel-list" style={{ marginTop: 10 }}>
            {profile.fanZonePosts.map((d) => (
              <div className="entity-card" key={d.id}>
                <Clock size={16} color="var(--orange)" />
                <div><strong>{d.type}</strong><span>{d.caption}</span></div>
                <span className="status-pill pending">En modération</span>
              </div>
            ))}
          </div>
        </>
      )}
    </form>
  )
}

export default function FanZonePage() {
  return (
    <main>
      <PageHero
        eyebrow="📸 Fan Zone"
        title="FIF Fan Zone"
        subtitle="La plateforme communautaire modérée par la FIF : photos, vidéos, chants, messages et créations des supporters."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Fan Zone' }]}
        meta={[{ value: String(fanZonePosts.length), label: 'Publications' }]}
      />

      <section className="page-section tight">
        <FanIdGate title="Créez votre Fan ID pour publier" hint="La lecture du fil est libre ; publier nécessite un Fan ID.">
          {(profile) => <PublishForm profile={profile} />}
        </FanIdGate>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Fil Fan Zone</p>
        <div className="fanzone-grid" style={{ marginTop: 16 }}>
          {fanZonePosts.map((p) => (
            <div className="fanzone-post" key={p.id}>
              <div className="fanzone-post-media">{p.type}</div>
              <div className="fanzone-post-body">
                <strong style={{ fontSize: 13 }}>{p.authorName} · {cityName(p.authorCityId)}</strong>
                <p>{p.caption}</p>
                <div className="fanzone-post-meta">
                  <span>{formatDate(p.date)}</span>
                  <span><Heart size={11} style={{ verticalAlign: 'middle' }} /> {p.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="muted-sm" style={{ marginTop: 20 }}><Flag size={12} style={{ verticalAlign: 'middle' }} /> Un contenu vous semble inapproprié ? Consultez la page <Link href="/supporters/moderation">Modération &amp; signalement</Link>.</p>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
