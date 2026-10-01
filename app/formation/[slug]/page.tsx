import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Award, BookOpen, Briefcase, CheckCircle2, ClipboardCheck, Clock, GraduationCap, Info, Layers, Users } from 'lucide-react'
import { academyPrograms, getProgram, ACADEMY_TRACKS } from '@/lib/data/academy'
import { Breadcrumb } from '@/components/site/PageHero'
import { AccreditationBadge, ProgramCard } from '@/components/site/AcademyCatalog'
import { ProgramEnroll } from '@/components/site/ProgramEnroll'
import { DemoBadge } from '@/components/site/DemoBadge'

export function generateStaticParams() {
  return academyPrograms.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = getProgram(slug)
  return { title: p ? `${p.title} — FIF Academy` : 'FIF Academy' }
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = getProgram(slug)
  if (!p) notFound()
  const track = ACADEMY_TRACKS.find((t) => t.id === p.track)
  const related = academyPrograms.filter((x) => x.track === p.track && x.slug !== p.slug).slice(0, 3)

  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'FIF Academy', href: '/formation' }, { label: track?.label ?? '' }, { label: p.title }]} />
      </div>

      <section className="page-section tight">
        <div className="prog-layout">
          <div>
            <div className={`prog-hero track-${p.track}`}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}><AccreditationBadge program={p} large /><span className="prog-level">{p.level}</span></div>
              <h1>{p.title}</h1>
              <p>{p.short}</p>
              <div className="prog-facts">
                <div><Clock size={16} /><span>Durée</span><b>{p.duration}</b></div>
                <div><Layers size={16} /><span>Format</span><b>{p.format}{p.hours ? ` · ${p.hours} h` : ''}</b></div>
                <div><Award size={16} /><span>Diplôme</span><b>{p.diplomaTitle}</b></div>
                <div><Users size={16} /><span>Public</span><b>{p.audience}</b></div>
              </div>
            </div>

            <div className="prog-acc-note"><Info size={15} /><span><b>{p.accreditation.label}</b> — {p.accreditation.status}.</span></div>

            <div className="prog-section">
              <h2><CheckCircle2 size={18} /> Objectifs</h2>
              <ul className="check-list">{p.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
            </div>

            <div className="prog-section">
              <h2><BookOpen size={18} /> Programme</h2>
              <div className="learn-modules">
                {p.modules.map((m, i) => (
                  <details key={m.title} open={i === 0}>
                    <summary><span>Module {i + 1} — {m.title}</span>{m.hours > 0 && <small>{m.hours} h</small>}</summary>
                    <ul className="module-lessons">{m.lessons.map((l) => <li key={l}>{l}</li>)}</ul>
                  </details>
                ))}
              </div>
            </div>

            <div className="prog-two">
              <div className="prog-section">
                <h2><GraduationCap size={18} /> Prérequis</h2>
                <ul className="check-list">{p.prerequisites.map((o) => <li key={o}>{o}</li>)}</ul>
              </div>
              <div className="prog-section">
                <h2><ClipboardCheck size={18} /> Évaluation</h2>
                <ul className="check-list">{p.evaluation.map((o) => <li key={o}>{o}</li>)}</ul>
              </div>
            </div>

            <div className="prog-section">
              <h2><Briefcase size={18} /> Débouchés</h2>
              <ul className="check-list">{p.careers.map((o) => <li key={o}>{o}</li>)}</ul>
            </div>
          </div>

          <aside className="prog-aside"><ProgramEnroll program={p} /></aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="page-section tight">
          <p className="section-tag">Dans la même filière</p>
          <div className="card-grid" style={{ marginTop: 16 }}>{related.map((r) => <ProgramCard key={r.slug} p={r} />)}</div>
          <Link href="/formation" className="text-link">Tout le catalogue →</Link>
        </section>
      )}

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
