'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { quizQuestions } from '@/lib/data/mock'
import type { QuizQuestion } from '@/lib/data/types'
import { recordQuizAnswer } from '@/lib/fan'
import { PageHero } from '@/components/site/PageHero'
import { FanIdGate } from '@/components/site/FanIdGate'
import { DemoBadge } from '@/components/site/DemoBadge'

const ROUND_SIZE = 8

function shuffledRound(): QuizQuestion[] {
  return [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, ROUND_SIZE)
}

function QuizRunner() {
  const [round, setRound] = useState<QuizQuestion[] | null>(null)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)

  useEffect(() => { setRound(shuffledRound()) }, [])

  function start() {
    setRound(shuffledRound())
    setIndex(0)
    setSelected(null)
    setCorrectCount(0)
  }

  if (!round) return null

  if (index >= round.length) {
    return (
      <div className="quiz-card quiz-result">
        <p className="section-tag">Résultat</p>
        <strong>{correctCount} / {round.length}</strong>
        <p className="muted-sm">+{correctCount * 70 + (round.length - correctCount) * 20} XP gagnés sur ce round.</p>
        <div className="button-group" style={{ justifyContent: 'center', marginTop: 16 }}>
          <button type="button" className="button button-primary" onClick={start}><RotateCcw size={14} /> Rejouer</button>
          <Link href="/supporters/badges" className="button-outline">Voir mes badges <ArrowRight size={14} /></Link>
        </div>
      </div>
    )
  }

  const q = round[index]

  function choose(i: number) {
    if (selected !== null) return
    setSelected(i)
    const correct = i === q.answerIndex
    if (correct) setCorrectCount((c) => c + 1)
    recordQuizAnswer(q.id, correct)
  }

  return (
    <div className="quiz-card">
      <p className="quiz-progress">Question {index + 1} / {round.length} · {q.category} · {q.difficulty}</p>
      <p className="quiz-question">{q.question}</p>
      <div className="quiz-choices">
        {q.choices.map((choice, i) => {
          let cls = 'quiz-choice'
          if (selected !== null) {
            if (i === q.answerIndex) cls += ' correct'
            else if (i === selected) cls += ' wrong'
          }
          return (
            <button type="button" key={i} className={cls} onClick={() => choose(i)} disabled={selected !== null}>{choice}</button>
          )
        })}
      </div>
      {selected !== null && (
        <>
          <p className="quiz-explanation">{q.explanation}</p>
          <div className="form-actions">
            <button type="button" className="button button-primary" style={{ justifyContent: 'center' }} onClick={() => { setIndex((n) => n + 1); setSelected(null) }}>
              {index + 1 < round.length ? 'Question suivante' : 'Voir le résultat'} <ArrowRight size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function QuizPage() {
  return (
    <main>
      <PageHero
        eyebrow="🧠 Fan Arena"
        title="Quiz Éléphants"
        subtitle="Questions sur les Éléphants, les clubs, les stades et les compétitions du football ivoirien. +20 XP par question, +50 XP bonus si la réponse est correcte."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Fan Arena', href: '/supporters/arena' }, { label: 'Quiz' }]}
      />
      <section className="page-section tight">
        <FanIdGate title="Créez votre Fan ID pour jouer" hint="Le quiz fait gagner de l’XP et débloque des badges — il faut un Fan ID pour suivre votre progression.">
          {() => <QuizRunner />}
        </FanIdGate>
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
