'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Award, BookOpen, CheckCircle2, Circle, ClipboardCheck, Lock, MapPin, Printer, ShieldCheck, X } from 'lucide-react'
import { EXAM_PASS, quizBanks, type AcademyProgram } from '@/lib/data/academy'
import { useAccount } from '@/lib/account'
import { lessonId, payBalance, submitExam, toggleLesson, totalLessons, useAcademy, validatePractical } from '@/lib/academy'
import { formatMoney } from '@/lib/format'
import { PaymentPanel } from './PaymentPanel'
import { Diploma } from './Diploma'
import { LessonBody } from './LessonBody'
import { lessonContent, readingMinutes } from '@/lib/data/academy-content'

export function LearningSpace({ program }: { program: AcademyProgram }) {
  const { account, ready } = useAccount()
  const { enrollments, ready: loaded } = useAcademy(account?.phone)
  const e = enrollments.find((x) => x.slug === program.slug)
  const questions = useMemo(() => quizBanks[program.examBank], [program.examBank])
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null))
  const [result, setResult] = useState<number | null>(null)
  const [payingBalance, setPayingBalance] = useState(false)
  const [open, setOpen] = useState<{ mi: number; li: number } | null>(null)
  const readerRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (open) readerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, [open])

  if (!ready || !loaded) return null
  if (!account || !e) {
    return (
      <div className="dashboard-panel" style={{ margin: 0, maxWidth: 560 }}>
        <p className="lede">Cet espace est réservé aux personnes inscrites à « {program.title} ».</p>
        <Link href={`/formation/${program.slug}`} className="button button-primary">Voir la formation et s’inscrire</Link>
      </div>
    )
  }

  const total = totalLessons(program)
  const done = e.completedLessons.length
  const lessonsOk = done >= total
  const practicalOk = !program.practical || Boolean(e.practicalValidatedAt)
  const examOk = (e.examScore ?? 0) >= EXAM_PASS
  const paidOk = e.amountDue === 0
  const graduated = Boolean(e.diplomaNo)
  const examUnlocked = lessonsOk && practicalOk

  function submit() {
    const score = questions.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0)
    setResult(score)
    submitExam(program, account!.phone, score)
  }

  const steps = [
    { label: `Cours (${done}/${total})`, ok: lessonsOk },
    ...(program.practical ? [{ label: 'Évaluation pratique', ok: practicalOk }] : []),
    { label: `Examen final (${EXAM_PASS}/${questions.length} requis)`, ok: examOk },
    { label: 'Frais réglés', ok: paidOk },
    { label: 'Diplôme', ok: graduated },
  ]

  return (
    <div className="learn">
      <div className="learn-head">
        <div>
          <p className="section-tag">Mon espace de formation</p>
          <h1>{program.title}</h1>
          <p className="lede" style={{ margin: 0 }}>{e.sessionLabel} · inscrit(e) le {new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(e.enrolledAt))}</p>
        </div>
        <div className="learn-progress">
          <b>{Math.round((done / total) * 100)} %</b><span>du programme</span>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${(done / total) * 100}%` }} /></div>
        </div>
      </div>

      <ol className="card-steps learn-steps">
        {steps.map((s, i) => <li key={s.label} className={s.ok ? 'is-done' : steps.findIndex((x) => !x.ok) === i ? 'is-current' : ''}><b>{s.ok ? '✓' : i + 1}</b>{s.label}</li>)}
      </ol>

      {graduated && (
        <section className="learn-block">
          <h3><Award size={18} style={{ verticalAlign: 'middle', marginRight: 6, color: 'var(--orange)' }} />Félicitations, vous êtes diplômé(e) !</h3>
          <div className="print-area"><Diploma e={e} birth={account.identity?.birthDate} /></div>
          <div className="button-group" style={{ marginTop: 14 }}>
            <button type="button" className="button button-primary" onClick={() => window.print()}><Printer size={15} /> Imprimer / enregistrer en PDF</button>
            <Link href={`/formation/diplome?n=${encodeURIComponent(e.diplomaNo!)}`} className="button-outline"><ShieldCheck size={15} /> Vérifier le diplôme</Link>
          </div>
        </section>
      )}

      {open && (() => {
        const flat = program.modules.flatMap((m, mi) => m.lessons.map((title, li) => ({ mi, li, title })))
        const idx = flat.findIndex((x) => x.mi === open.mi && x.li === open.li)
        const cur = flat[idx]
        const content = lessonContent(program.slug, cur.mi, cur.li)
        const id = lessonId(cur.mi, cur.li)
        const done = e.completedLessons.includes(id)
        const next = flat[idx + 1]
        return (
          <section className="learn-block lesson-reader" ref={readerRef}>
            <button type="button" className="lesson-close" aria-label="Fermer la leçon" onClick={() => setOpen(null)}><X size={18} /></button>
            {content ? (
              <LessonBody content={content} title={cur.title} kicker={`Module ${cur.mi + 1} — ${program.modules[cur.mi].title} · Leçon ${idx + 1}/${flat.length}`} />
            ) : (
              <article className="lesson-body">
                <header><span className="lesson-kicker">Module {cur.mi + 1} · Leçon {idx + 1}/{flat.length}</span><h2>{cur.title}</h2></header>
                <p className="lesson-intro"><MapPin size={14} style={{ verticalAlign: 'middle' }} /> Cette formation se déroule en présentiel : le support de cours de cette leçon est remis par l’instructeur lors de la session.</p>
              </article>
            )}
            <div className="lesson-nav">
              <button type="button" className="button-outline" disabled={idx === 0} onClick={() => setOpen(flat[idx - 1])}><ArrowLeft size={15} /> Précédente</button>
              <button type="button" className="button button-primary" onClick={() => { if (!done) toggleLesson(program.slug, account.phone, id); setOpen(next ? { mi: next.mi, li: next.li } : null) }}>
                {done ? (next ? <>Leçon suivante <ArrowRight size={15} /></> : 'Terminer') : (next ? <>Marquer comme terminée et continuer <ArrowRight size={15} /></> : <>Marquer comme terminée <CheckCircle2 size={15} /></>)}
              </button>
            </div>
          </section>
        )
      })()}

      <section className="learn-block">
        <h3>Programme</h3>
        <div className="learn-modules">
          {program.modules.map((m, mi) => (
            <details key={m.title} open={mi === 0}>
              <summary><span>Module {mi + 1} — {m.title}</span><small>{m.lessons.filter((_, li) => e.completedLessons.includes(lessonId(mi, li))).length}/{m.lessons.length} · {m.hours} h</small></summary>
              <ul>
                {m.lessons.map((l, li) => {
                  const id = lessonId(mi, li)
                  const ok = e.completedLessons.includes(id)
                  return (
                    <li key={id} className={ok ? 'lesson-row is-done' : 'lesson-row'}>
                      <button type="button" className="lesson-check" aria-label={ok ? `Marquer « ${l} » comme non terminée` : `Marquer « ${l} » comme terminée`} onClick={() => toggleLesson(program.slug, account.phone, id)}>
                        {ok ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                      </button>
                      <button type="button" className={ok ? 'lesson is-done' : 'lesson'} onClick={() => setOpen({ mi, li })}>
                        <span>{l}</span>
                        <small>{(() => { const c = lessonContent(program.slug, mi, li); return c ? (c.inPerson ? 'Présentiel' : `${readingMinutes(c)} min`) : 'Présentiel' })()}</small>
                        <b><BookOpen size={14} /> {ok ? 'Relire' : 'Lire'}</b>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </details>
          ))}
        </div>
      </section>

      {program.practical && (
        <section className="learn-block">
          <h3><ClipboardCheck size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />Évaluation pratique</h3>
          <p className="lede" style={{ fontSize: 14 }}>{program.evaluation.join(' · ')}. Elle est validée par l’instructeur FIF lors de la session en présentiel.</p>
          {practicalOk ? <p className="enroll-ok"><CheckCircle2 size={18} /> Validée le {new Intl.DateTimeFormat('fr-FR').format(new Date(e.practicalValidatedAt!))}</p> : (
            <button type="button" className="button-outline" disabled={!lessonsOk} onClick={() => validatePractical(program.slug, account.phone)}>
              {lessonsOk ? 'Simuler la validation par l’instructeur (prototype)' : <><Lock size={14} /> Terminez d’abord tous les cours</>}
            </button>
          )}
        </section>
      )}

      <section className="learn-block">
        <h3>Examen final</h3>
        {!examUnlocked ? <p className="lede" style={{ fontSize: 14 }}><Lock size={14} style={{ verticalAlign: 'middle' }} /> L’examen se débloque une fois les cours{program.practical ? ' et l’évaluation pratique' : ''} validés.</p>
          : examOk ? <p className="enroll-ok"><CheckCircle2 size={18} /> Examen réussi — {e.examScore}/{questions.length}</p> : (
            <div className="exam">
              {questions.map((q, i) => (
                <fieldset key={q.q}>
                  <legend>{i + 1}. {q.q}</legend>
                  {q.choices.map((c, ci) => (
                    <label key={c} className={answers[i] === ci ? 'exam-choice is-active' : 'exam-choice'}>
                      <input type="radio" name={`q${i}`} checked={answers[i] === ci} onChange={() => setAnswers((a) => a.map((v, j) => (j === i ? ci : v)))} /> {c}
                    </label>
                  ))}
                </fieldset>
              ))}
              {result !== null && result < EXAM_PASS && <p className="form-error">Résultat : {result}/{questions.length}. Il faut {EXAM_PASS} bonnes réponses — révisez et retentez.</p>}
              <button type="button" className="button button-primary" disabled={answers.some((a) => a === null)} onClick={submit}>Valider mes réponses</button>
              <small className="field-hint">Tentatives : {e.examAttempts}</small>
            </div>
          )}
      </section>

      {!paidOk && (
        <section className="learn-block">
          <h3>Solde à régler</h3>
          <p className="lede" style={{ fontSize: 14 }}>Payé : {formatMoney(e.amountPaid)} · reste dû : <b>{formatMoney(e.amountDue)}</b>. Le diplôme est délivré une fois la formation entièrement réglée.</p>
          {payingBalance ? (
            <PaymentPanel amount={Math.min(e.amountDue, Math.ceil(program.price / 3))} description={`${program.title} — versement suivant`} defaultPhone={account.phone}
              onPaid={() => { payBalance(program, account.phone, Math.min(e.amountDue, Math.ceil(program.price / 3))); setPayingBalance(false) }} />
          ) : <button type="button" className="button button-primary" onClick={() => setPayingBalance(true)}>Payer le versement suivant</button>}
        </section>
      )}

    </div>
  )
}
