'use client'

// ---------------------------------------------------------------------------
// FIF Academy — inscriptions, progression, examen et diplômes (prototype :
// données conservées dans le navigateur, comme le compte FIF ID).
// ---------------------------------------------------------------------------

import { useEffect, useState } from 'react'
import { EXAM_PASS, type AcademyProgram } from '@/lib/data/academy'

export interface AcademyEnrollment {
  slug: string
  title: string
  diplomaTitle: string
  accreditationLabel: string
  sessionId: string
  sessionLabel: string
  holderPhone: string
  holderName: string
  amountPaid: number
  amountDue: number
  plan: 'comptant' | '3 fois'
  payment: string
  enrolledAt: string
  completedLessons: string[]
  practicalValidatedAt?: string
  examScore?: number
  examAttempts: number
  diplomaNo?: string
  diplomaIssuedAt?: string
}

const KEY = 'fif-academy-v1'
const EVENT = 'fif-academy-change'

function readAll(): AcademyEnrollment[] {
  try { return JSON.parse(window.localStorage.getItem(KEY) ?? '[]') } catch { return [] }
}
function writeAll(list: AcademyEnrollment[]) {
  try { window.localStorage.setItem(KEY, JSON.stringify(list)) } catch { /* stockage indisponible */ }
  window.dispatchEvent(new Event(EVENT))
}
function update(slug: string, phone: string, patch: (e: AcademyEnrollment) => AcademyEnrollment) {
  writeAll(readAll().map((e) => (e.slug === slug && e.holderPhone === phone ? patch(e) : e)))
}

export function lessonId(moduleIndex: number, lessonIndex: number) { return `${moduleIndex}.${lessonIndex}` }
export function totalLessons(p: AcademyProgram) { return p.modules.reduce((n, m) => n + m.lessons.length, 0) }

export function enrollInProgram(input: { program: AcademyProgram; sessionId: string; sessionLabel: string; phone: string; name: string; plan: 'comptant' | '3 fois'; payment: string }) {
  const { program } = input
  const amountPaid = input.plan === '3 fois' ? Math.ceil(program.price / 3) : program.price
  const enrollment: AcademyEnrollment = {
    slug: program.slug,
    title: program.title,
    diplomaTitle: program.diplomaTitle,
    accreditationLabel: program.accreditation.label,
    sessionId: input.sessionId,
    sessionLabel: input.sessionLabel,
    holderPhone: input.phone,
    holderName: input.name,
    amountPaid,
    amountDue: program.price - amountPaid,
    plan: input.plan,
    payment: input.payment,
    enrolledAt: new Date().toISOString(),
    completedLessons: [],
    examAttempts: 0,
  }
  writeAll([enrollment, ...readAll().filter((e) => !(e.slug === program.slug && e.holderPhone === input.phone))])
  return enrollment
}

export function payBalance(program: AcademyProgram, phone: string, amount: number) {
  update(program.slug, phone, (e) => issueIfComplete(program, { ...e, amountPaid: e.amountPaid + amount, amountDue: Math.max(0, e.amountDue - amount) }))
}

function issueIfComplete(program: AcademyProgram, e: AcademyEnrollment): AcademyEnrollment {
  if (e.diplomaNo || !canGraduate(program, e)) return e
  const year = new Date().getFullYear()
  const rand = String(Math.floor(10000 + Math.random() * 90000))
  const code = program.slug.split('-').map((w) => w[0]).join('').toUpperCase().slice(0, 4)
  return { ...e, diplomaNo: `FIF-ACA-${year}-${code}-${rand}`, diplomaIssuedAt: new Date().toISOString() }
}

export function toggleLesson(slug: string, phone: string, id: string) {
  update(slug, phone, (e) => ({ ...e, completedLessons: e.completedLessons.includes(id) ? e.completedLessons.filter((l) => l !== id) : [...e.completedLessons, id] }))
}

export function validatePractical(slug: string, phone: string) {
  update(slug, phone, (e) => ({ ...e, practicalValidatedAt: new Date().toISOString() }))
}

/** Enregistre la note d'examen ; délivre le diplôme si toutes les conditions sont remplies. */
export function submitExam(program: AcademyProgram, phone: string, score: number) {
  update(program.slug, phone, (e) => issueIfComplete(program, { ...e, examScore: Math.max(score, e.examScore ?? 0), examAttempts: e.examAttempts + 1 }))
}

export function canGraduate(program: AcademyProgram, e: AcademyEnrollment) {
  return e.completedLessons.length >= totalLessons(program)
    && (!program.practical || Boolean(e.practicalValidatedAt))
    && (e.examScore ?? 0) >= EXAM_PASS
    && e.amountDue === 0
}

export function findDiploma(no: string) {
  return readAll().find((e) => e.diplomaNo?.toUpperCase() === no.trim().toUpperCase()) ?? null
}

export function useAcademy(phone?: string) {
  const [state, setState] = useState<{ enrollments: AcademyEnrollment[]; ready: boolean }>({ enrollments: [], ready: false })
  useEffect(() => {
    const sync = () => setState({ enrollments: readAll().filter((e) => !phone || e.holderPhone === phone), ready: true })
    sync()
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => { window.removeEventListener(EVENT, sync); window.removeEventListener('storage', sync) }
  }, [phone])
  return state
}
