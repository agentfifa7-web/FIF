import Link from 'next/link'
import { CalendarDays, MapPin } from 'lucide-react'
import { elephantsNextWindow, nextElephantsFixture, elephantsCallUp } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { MatchdayVote } from '@/components/site/MatchdayVote'
import { DemoNotice } from '@/components/site/DemoNotice'
import { formatDateLong } from '@/lib/format'
import { loadCms } from '@/lib/cms/server'

export const metadata = { title: 'Mode Matchday — FIF Fan Universe', description: 'Avant, pendant et après le match des Éléphants : informations pratiques, pronostic, vote des supporters.' }

const STEPS = [
  { tag: 'J-1', title: 'Préparation', text: 'Liste des joueurs convoqués, pronostic, quiz et informations pratiques.' },
  { tag: 'Jour J', title: 'Au stade', text: 'Billet, accès au stade, horaires d’ouverture des portes.' },
  { tag: 'Live', title: 'Pendant le match', text: 'Score et faits de match, vote « Joueur du match » des supporters.' },
  { tag: 'Après', title: 'Le résumé', text: 'Compte rendu, résultat de votre pronostic, classement.' },
]

export default async function MatchdayPage() {
  await loadCms()
  const fixture = nextElephantsFixture()
  const candidates = elephantsCallUp.slice(0, 6).map((p) => ({ id: p.slug, name: p.name }))

  return (
    <main>
      <PageHero
        eyebrow="Matchday"
        title="Le jour de match des Éléphants"
        subtitle="Avant, pendant et après le match : tout ce qu’il faut pour vivre la rencontre, au stade ou à distance."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Matchday' }]}
        noPhotos
      />

      <section className="page-section">
        <div className="fan-rdv-card">
          <span className="fan-kicker"><CalendarDays aria-hidden /> Prochain match</span>
          {fixture ? (
            <>
              <h3>Côte d’Ivoire – {fixture.opponent}</h3>
              <p>{fixture.competition} · {formatDateLong(fixture.date)} · <MapPin size={14} aria-hidden style={{ verticalAlign: 'middle' }} /> {fixture.venue}</p>
              <div className="button-group"><Link href="/billetterie" className="button button-primary">Billetterie</Link><Link href="/supporters/arena/pronostics" className="button-outline">Mon pronostic</Link></div>
            </>
          ) : elephantsNextWindow ? (
            <>
              <h3>Côte d’Ivoire – {elephantsNextWindow.opponent}</h3>
              <p>{elephantsNextWindow.competition} · {elephantsNextWindow.period}. Le stade et l’heure seront précisés dès l’annonce officielle.</p>
              <div className="button-group"><Link href="/supporters/arena/pronostics" className="button button-primary">Mon pronostic</Link><Link href="/equipes-nationales/elephants" className="button-outline">Les Éléphants</Link></div>
            </>
          ) : <p>Le prochain match sera annoncé dès sa confirmation officielle.</p>}
        </div>
      </section>

      <section className="page-section section-alt" aria-labelledby="md-steps">
        <h2 id="md-steps">Le déroulé</h2>
        <ol className="fan-steps">
          {STEPS.map((s) => <li key={s.tag}><span>{s.tag}</span><strong>{s.title}</strong><p>{s.text}</p></li>)}
        </ol>
        <div style={{ marginTop: 24 }}>
          <DemoNotice title="« Je suis au stade » — fonctionnalité à venir">Le passage en mode Matchday par scan du billet à l’entrée du stade n’est pas encore disponible.</DemoNotice>
        </div>
      </section>

      {candidates.length > 0 && (
        <section className="page-section" aria-labelledby="md-vote">
          <h2 id="md-vote">Vote « Joueur du match » des supporters</h2>
          <p className="lede" style={{ marginBottom: 16 }}>Parmi les joueurs convoqués. Ce vote des supporters, enregistré dans ce navigateur, est distinct de toute distinction officielle.</p>
          <MatchdayVote candidates={candidates} />
        </section>
      )}
    </main>
  )
}
