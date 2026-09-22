'use client'

import { useState } from 'react'
import { Download, Shuffle } from 'lucide-react'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

const COLORS = ['#f7941d', '#0a5c33', '#ffffff', '#0b1110', '#1c4587', '#c62828']
const PATTERNS = ['Uni', 'Rayures', 'Chevrons'] as const
type Pattern = (typeof PATTERNS)[number]

function TifoSvg({ primary, secondary, pattern, message }: { primary: string; secondary: string; pattern: Pattern; message: string }) {
  const patternId = 'tifo-pattern'
  return (
    <svg viewBox="0 0 640 360" width="100%" role="img" aria-label="Aperçu du tifo">
      <defs>
        {pattern === 'Rayures' && (
          <pattern id={patternId} width="64" height="360" patternUnits="userSpaceOnUse">
            <rect width="32" height="360" fill={primary} />
            <rect x="32" width="32" height="360" fill={secondary} />
          </pattern>
        )}
        {pattern === 'Chevrons' && (
          <pattern id={patternId} width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="80" height="40" fill={primary} />
            <rect y="40" width="80" height="40" fill={secondary} />
          </pattern>
        )}
      </defs>
      <rect width="640" height="360" fill={pattern === 'Uni' ? primary : `url(#${patternId})`} />
      <text x="320" y="195" textAnchor="middle" fontSize="44" fontWeight="900" fill={pattern === 'Uni' ? secondary : '#fff'} style={{ paintOrder: 'stroke', stroke: '#0b1110', strokeWidth: 3 }}>{message || 'LES ÉLÉPHANTS'}</text>
    </svg>
  )
}

export default function TifoStudioPage() {
  const [primary, setPrimary] = useState(COLORS[0])
  const [secondary, setSecondary] = useState(COLORS[1])
  const [pattern, setPattern] = useState<Pattern>('Rayures')
  const [message, setMessage] = useState('LES ÉLÉPHANTS')

  return (
    <main>
      <PageHero
        eyebrow="🎨 Fan Zone"
        title="Tifo Studio"
        subtitle="Créez votre tifo : couleurs, motif et message. La FIF peut sélectionner certains designs pour des animations officielles, selon autorisation."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Tifo Studio' }]}
      />

      <section className="page-section tight">
        <div className="tifo-canvas" style={{ background: '#eef2ee', marginBottom: 24 }}>
          <TifoSvg primary={primary} secondary={secondary} pattern={pattern} message={message} />
        </div>

        <div className="tifo-controls">
          <div className="text-field">
            <label htmlFor="tifo-message">Message</label>
            <input id="tifo-message" type="text" maxLength={28} value={message} onChange={(e) => setMessage(e.target.value.toUpperCase())} />
          </div>

          <div>
            <p className="section-tag">Motif</p>
            <div className="tab-bar" style={{ marginTop: 8 }}>
              {PATTERNS.map((p) => (
                <button type="button" key={p} className={pattern === p ? 'tab active' : 'tab'} onClick={() => setPattern(p)}>{p}</button>
              ))}
            </div>
          </div>

          <div>
            <p className="section-tag">Couleur principale</p>
            <div className="color-swatches" style={{ marginTop: 8 }}>
              {COLORS.map((c) => (
                <button type="button" key={c} aria-label={c} className={`color-swatch${c === primary ? ' active' : ''}`} style={{ background: c }} onClick={() => setPrimary(c)} />
              ))}
            </div>
          </div>

          <div>
            <p className="section-tag">Couleur secondaire</p>
            <div className="color-swatches" style={{ marginTop: 8 }}>
              {COLORS.map((c) => (
                <button type="button" key={c} aria-label={c} className={`color-swatch${c === secondary ? ' active' : ''}`} style={{ background: c }} onClick={() => setSecondary(c)} />
              ))}
            </div>
          </div>

          <div className="button-group">
            <button type="button" className="button-outline" onClick={() => { setPrimary(COLORS[Math.floor(Math.random() * COLORS.length)]); setSecondary(COLORS[Math.floor(Math.random() * COLORS.length)]) }}>
              <Shuffle size={14} /> Couleurs aléatoires
            </button>
            <button type="button" className="button-outline" disabled><Download size={14} /> Télécharger (démonstration)</button>
          </div>
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
