import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Award, BookOpen, Briefcase, CheckCircle2, ClipboardCheck, Clock, GraduationCap, Info, Layers, Users } from 'lucide-react'
import { academyPrograms, getProgram, ACADEMY_TRACKS } from '@/lib/data/academy'
import { Breadcrumb } from '@/components/site/PageHero'
import { AccreditationBadge, ProgramCard } from '@/components/site/AcademyCatalog'
import { ProgramEnroll } from '@/components/site/ProgramEnroll'
import { DemoBadge } from '@/components/site/DemoBadge'
import { LessonBody } from '@/components/site/LessonBody'
import { lessonContent, programContent, readingMinutes } from '@/lib/data/academy-content'

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
  const content = programContent[p.slug]
  const online = content ? content.flat().filter((c) => !c.inPerson) : []
  const onsite = content ? content.flat().filter((c) => c.inPerson) : []
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

            <div className="prog-section" id="contenu">
              <h2><BookOpen size={18} /> Programme et contenu des cours</h2>
              {content && (
                <p className="lede" style={{ fontSize: 14, marginTop: 0 }}>
                  {online.length} leçons en ligne{onsite.length > 0 ? ` et ${onsite.length} séances en présentiel` : ''}. <b>Touchez une leçon pour lire son contenu</b> : points clés, exercice de mise en pratique et message à retenir.
                </p>
              )}
              <div className="learn-modules">
                {p.modules.map((m, i) => (
                  <details key={m.title} open={i === 0}>
                    <summary><span>Module {i + 1} — {m.title}</span><small>{m.lessons.length} leçons{m.hours > 0 ? ` · ${m.hours} h` : ''}</small></summary>
                    <div className="course-lessons">{m.lessons.map((l, li) => {
                      const c = lessonContent(p.slug, i, li)
                      if (!c) return <div key={l} className="course-lesson is-empty"><span>{i + 1}.{li + 1}</span>{l}</div>
                      return (
                        <details key={l} className="course-lesson">
                          <summary>
                            <span className="course-lesson-num">{i + 1}.{li + 1}</span>
                            <span className="course-lesson-title">{l}</span>
                            <small className={c.inPerson ? 'lesson-mini is-onsite' : 'lesson-mini'}>{c.inPerson ? 'présentiel' : `${readingMinutes(c)} min`}</small>
                          </summary>
                          <div className="course-lesson-body"><LessonBody content={c} title={l} bare /></div>
                        </details>
                      )
                    })}</div>
                  </details>
                ))}
              </div>
              {content && <p className="course-note"><Info size={14} /> Le contenu des cours est consultable librement. L’inscription donne accès à l’espace de formation : suivi de progression, validation pratique, examen final et diplôme.</p>}
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
