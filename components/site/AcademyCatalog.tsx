'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Clock, GraduationCap, MapPin, Search } from 'lucide-react'
import { ACADEMY_TRACKS, type AcademyProgram, type AcademyTrackId } from '@/lib/data/academy'
import { formatMoney } from '@/lib/format'

export function AccreditationBadge({ program, large = false }: { program: AcademyProgram; large?: boolean }) {
  const a = program.accreditation
  return (
    <span className={`acc-badge acc-${a.kind === 'Université' ? 'uni' : a.kind.toLowerCase()}${large ? ' is-large' : ''}`} title={`${a.label} — ${a.status}`}>
      {a.kind === 'Université' ? 'Diplôme universitaire' : a.kind === 'CAF' ? 'Licence CAF' : a.kind === 'FIFA' ? 'Prépa FIFA' : 'Certifié FIF'}
    </span>
  )
}

export function ProgramCard({ p }: { p: AcademyProgram }) {
  const next = p.sessions[0]
  return (
    <Link href={`/formation/${p.slug}`} className={`prog-card track-${p.track}`}>
      <div className="prog-card-top"><AccreditationBadge program={p} /><span className="prog-level">{p.level}</span></div>
      <strong>{p.title}</strong>
      <p>{p.short}</p>
      <div className="prog-meta">
        <span><Clock size={13} /> {p.duration}</span>
        <span><GraduationCap size={13} /> {p.format}{p.hours ? ` · ${p.hours} h` : ''}</span>
        {next && <span><MapPin size={13} /> {next.city} · dès le {new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${next.start}T12:00:00`))}</span>}
      </div>
      <div className="prog-foot">
        <b>{p.applyOnly ? 'Sur candidature' : formatMoney(p.price)}</b>
        {p.installments && <small>ou 3 × {formatMoney(Math.ceil(p.price / 3))}</small>}
      </div>
    </Link>
  )
}

export function AcademyCatalog({ programs }: { programs: AcademyProgram[] }) {
  const [q, setQ] = useState('')
  const [track, setTrack] = useState<AcademyTrackId | 'all'>('all')
  const [acc, setAcc] = useState('Toutes')
  const [format, setFormat] = useState('Tous')

  const filtered = useMemo(() => {
    const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    return programs.filter((p) =>
      (track === 'all' || p.track === track)
      && (acc === 'Toutes' || p.accreditation.kind === acc)
      && (format === 'Tous' || p.format === format)
      && (!q || norm(`${p.title} ${p.short} ${p.audience}`).includes(norm(q))))
  }, [programs, q, track, acc, format])

  return (
    <div>
      <div className="academy-filters">
        <label className="search-field" style={{ flex: 1, minWidth: 220 }}>
          <Search />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une formation, un métier…" aria-label="Rechercher une formation" />
        </label>
        <select value={acc} onChange={(e) => setAcc(e.target.value)} aria-label="Accréditation">
          <option value="Toutes">Toutes les accréditations</option>
          <option value="CAF">Licences CAF</option>
          <option value="FIF">Certifications FIF</option>
          <option value="Université">Diplômes universitaires</option>
          <option value="FIFA">Préparation FIFA</option>
        </select>
        <select value={format} onChange={(e) => setFormat(e.target.value)} aria-label="Format">
          <option>Tous</option><option>Présentiel</option><option>Hybride</option><option>En ligne</option>
        </select>
      </div>
      <div className="chip-row" style={{ margin: '14px 0 22px' }}>
        <button type="button" className={track === 'all' ? 'chip is-active' : 'chip'} onClick={() => setTrack('all')}>Tous les métiers ({programs.length})</button>
        {ACADEMY_TRACKS.map((t) => (
          <button key={t.id} type="button" className={track === t.id ? 'chip is-active' : 'chip'} onClick={() => setTrack(t.id)}>
            {t.label} ({programs.filter((p) => p.track === t.id).length})
          </button>
        ))}
      </div>
      {filtered.length === 0 ? <p className="lede">Aucune formation ne correspond à votre recherche.</p> : (
        <div className="card-grid">{filtered.map((p) => <ProgramCard key={p.slug} p={p} />)}</div>
      )}
    </div>
  )
}
