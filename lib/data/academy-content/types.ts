/** Contenu pédagogique d'une leçon FIF Academy. */
export interface LessonContent {
  /** Introduction : pourquoi cette leçon, ce qu'on va apprendre. */
  intro: string
  /** Points clés du cours. */
  points: string[]
  /** Exercice ou mise en situation. */
  practice: string
  /** Message essentiel à retenir. */
  takeaway?: string
  /** Leçon réalisée lors de la session en présentiel (stage, séance, soutenance). */
  inPerson?: boolean
}

export const L = (intro: string, points: string[], practice: string, takeaway?: string): LessonContent => ({ intro, points, practice, takeaway })
export const P = (intro: string, points: string[], practice: string, takeaway?: string): LessonContent => ({ intro, points, practice, takeaway, inPerson: true })
