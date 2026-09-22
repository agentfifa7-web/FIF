'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

const COLORS = ['#f7941d', '#0a5c33', '#ffffff', '#0b1110', '#1c4587', '#c62828']

function AvatarSvg({ jersey, scarf, cap, flag }: { jersey: string; scarf: string; cap: boolean; flag: boolean }) {
  return (
    <svg viewBox="0 0 200 220" width="220" role="img" aria-label="Aperçu de l’avatar">
      <rect width="200" height="220" fill="#eef2ee" />
      <circle cx="100" cy="80" r="38" fill="#f2d0a4" />
      <path d="M30,220 C30,150 60,120 100,120 C140,120 170,150 170,220 Z" fill={jersey} />
      <path d="M76,120 C84,150 116,150 124,120" stroke={scarf} strokeWidth="14" fill="none" strokeLinecap="round" />
      {cap && <path d="M64,58 A36,36 0 0 1 136,58 L136,50 A36,20 0 0 0 64,50 Z" fill={jersey} />}
      {flag && (
        <g transform="translate(14,14)" stroke="#0b1110" strokeWidth="1.5">
          <rect x="0" width="12" height="24" fill="#f7941d" />
          <rect x="12" width="12" height="24" fill="#fff" />
          <rect x="24" width="12" height="24" fill="#0a5c33" />
          <rect x="0" width="36" height="24" fill="none" />
        </g>
      )}
    </svg>
  )
}

function BannerSvg({ background, text, textColor }: { background: string; text: string; textColor: string }) {
  return (
    <svg viewBox="0 0 640 140" width="100%" role="img" aria-label="Aperçu de la bannière">
      <rect width="640" height="140" fill={background} />
      <text x="320" y="82" textAnchor="middle" fontSize="34" fontWeight="900" fill={textColor}>{text || 'ON EST ENSEMBLE'}</text>
    </svg>
  )
}

export default function FanStudioPage() {
  const [tab, setTab] = useState<'avatar' | 'banner'>('avatar')
  const [jersey, setJersey] = useState(COLORS[0])
  const [scarf, setScarf] = useState(COLORS[1])
  const [cap, setCap] = useState(true)
  const [flag, setFlag] = useState(true)
  const [bannerBg, setBannerBg] = useState(COLORS[1])
  const [bannerText, setBannerText] = useState('ON EST ENSEMBLE')
  const [bannerTextColor, setBannerTextColor] = useState('#ffffff')

  return (
    <main>
      <PageHero
        eyebrow="👕 Fan Zone"
        title="Fan Studio"
        subtitle="Personnalisez votre avatar de supporter ou créez votre bannière digitale."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Fan Studio' }]}
      />

      <section className="page-section tight">
        <div className="tab-bar">
          <button type="button" className={tab === 'avatar' ? 'tab active' : 'tab'} onClick={() => setTab('avatar')}>Avatar</button>
          <button type="button" className={tab === 'banner' ? 'tab active' : 'tab'} onClick={() => setTab('banner')}>Bannière</button>
        </div>

        {tab === 'avatar' ? (
          <div className="card-grid cols-2" style={{ marginTop: 20, alignItems: 'start' }}>
            <div className="tifo-canvas" style={{ background: '#fff', border: '1px solid var(--line)', aspectRatio: 'auto' }}>
              <AvatarSvg jersey={jersey} scarf={scarf} cap={cap} flag={flag} />
            </div>
            <div className="tifo-controls">
              <div>
                <p className="section-tag">Maillot</p>
                <div className="color-swatches" style={{ marginTop: 8 }}>
                  {COLORS.map((c) => <button type="button" key={c} aria-label={c} className={`color-swatch${c === jersey ? ' active' : ''}`} style={{ background: c }} onClick={() => setJersey(c)} />)}
                </div>
              </div>
              <div>
                <p className="section-tag">Écharpe</p>
                <div className="color-swatches" style={{ marginTop: 8 }}>
                  {COLORS.map((c) => <button type="button" key={c} aria-label={c} className={`color-swatch${c === scarf ? ' active' : ''}`} style={{ background: c }} onClick={() => setScarf(c)} />)}
                </div>
              </div>
              <label style={{ alignItems: 'center', display: 'flex', gap: 8, fontSize: 13 }}><input type="checkbox" checked={cap} onChange={(e) => setCap(e.target.checked)} /> Casquette</label>
              <label style={{ alignItems: 'center', display: 'flex', gap: 8, fontSize: 13 }}><input type="checkbox" checked={flag} onChange={(e) => setFlag(e.target.checked)} /> Drapeau</label>
              <button type="button" className="button-outline" disabled><Download size={14} /> Télécharger (démonstration)</button>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 20 }}>
            <div className="tifo-canvas" style={{ aspectRatio: 'auto', background: '#eef2ee', marginBottom: 20 }}>
              <BannerSvg background={bannerBg} text={bannerText} textColor={bannerTextColor} />
            </div>
            <div className="tifo-controls">
              <div className="text-field">
                <label htmlFor="banner-text">Message</label>
                <input id="banner-text" type="text" maxLength={30} value={bannerText} onChange={(e) => setBannerText(e.target.value.toUpperCase())} />
              </div>
              <div>
                <p className="section-tag">Fond</p>
                <div className="color-swatches" style={{ marginTop: 8 }}>
                  {COLORS.map((c) => <button type="button" key={c} aria-label={c} className={`color-swatch${c === bannerBg ? ' active' : ''}`} style={{ background: c }} onClick={() => setBannerBg(c)} />)}
                </div>
              </div>
              <div>
                <p className="section-tag">Couleur du texte</p>
                <div className="color-swatches" style={{ marginTop: 8 }}>
                  {COLORS.map((c) => <button type="button" key={c} aria-label={c} className={`color-swatch${c === bannerTextColor ? ' active' : ''}`} style={{ background: c }} onClick={() => setBannerTextColor(c)} />)}
                </div>
              </div>
              <button type="button" className="button-outline" disabled><Download size={14} /> Télécharger (démonstration)</button>
            </div>
          </div>
        )}
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
