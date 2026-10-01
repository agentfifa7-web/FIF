'use client'

import Link from 'next/link'
import { Award, GraduationCap } from 'lucide-react'
import { getProgram } from '@/lib/data/academy'
import { useAccount } from '@/lib/account'
import { totalLessons, useAcademy } from '@/lib/academy'
import { formatMoney } from '@/lib/format'

export function MyAcademy({ compact = false }: { compact?: boolean }) {
  const { account, ready } = useAccount()
  const { enrollments, ready: loaded } = useAcademy(account?.phone)
  if (!ready || !loaded) return null
  if (!account) return <p className="lede" style={{ fontSize: 14 }}>Connectez-vous avec votre FIF ID pour voir vos formations. <Link href="/connexion?next=/formation/mes-formations" className="text-link" style={{ display: 'inline' }}>Se connecter</Link></p>
  if (!enrollments.length) {
    return <p className="lede" style={{ fontSize: 14 }}>Aucune formation en cours. <Link href="/formation" className="text-link" style={{ display: 'inline' }}>Découvrir FIF Academy →</Link></p>
  }
  return (
    <div className={compact ? 'dashboard-list' : 'my-academy'}>
      {enrollments.map((e) => {
        const p = getProgram(e.slug)
        const pct = p ? Math.round((e.completedLessons.length / totalLessons(p)) * 100) : 0
        return compact ? (
          <div key={e.slug}><div><b>{e.title}</b><small>{e.diplomaNo ? `Diplômé(e) · ${e.diplomaNo}` : `${pct} % · ${e.sessionLabel}`}</small></div><Link href={`/formation/espace/${e.slug}`} className="text-link">Ouvrir</Link></div>
        ) : (
          <Link key={e.slug} href={`/formation/espace/${e.slug}`} className="my-course">
            {e.diplomaNo ? <Award size={22} color="var(--orange)" /> : <GraduationCap size={22} color="var(--green)" />}
            <div>
              <strong>{e.title}</strong>
              <span>{e.sessionLabel}</span>
              <div className="progress-track" style={{ marginTop: 8 }}><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
            </div>
            <div className="my-course-side">
              <b>{e.diplomaNo ? 'Diplômé(e)' : `${pct} %`}</b>
              <small>{e.amountDue ? `Reste ${formatMoney(e.amountDue)}` : 'Réglée'}</small>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
