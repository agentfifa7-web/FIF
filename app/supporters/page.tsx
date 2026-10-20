import Link from 'next/link'
import {
  ArrowRight, Brain, CalendarDays, Camera, Gamepad2, HeartHandshake, IdCard, MapPin, Music, Palette, ShieldCheck, Target, Trophy, Users,
} from 'lucide-react'
import { elephantsNextWindow, lastElephantsFixture, nextElephantsFixture, quizQuestions } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { FanWelcome } from '@/components/site/FanWelcome'
import { loadCms } from '@/lib/cms/server'
import { formatDateLong } from '@/lib/format'

export const metadata = {
  title: 'FIF Fan Universe — Espace supporters',
  description: 'Quiz, pronostics, Fan ID, badges, Football Tour et Fan Zone : l’espace des supporters du football ivoirien, sans mise ni argent en jeu.',
}

const PLAY = [
  { icon: Brain, title: 'Quiz Éléphants', text: 'Histoire des sélections, stades et compétitions.', href: '/supporters/arena/quiz', cta: 'Jouer' },
  { icon: Target, title: 'Pronostics', text: 'Prédisez le score des prochains matchs. Aucune mise.', href: '/supporters/arena/pronostics', cta: 'Pronostiquer' },
  { icon: MapPin, title: 'Football Tour', text: 'Faites votre check-in dans les pôles du football ivoirien.', href: '/supporters/passeport', cta: 'Explorer la carte' },
  { icon: Trophy, title: 'Classements', text: 'Votre XP et la précision de vos pronostics.', href: '/supporters/classements', cta: 'Voir' },
]

const UNIVERSES = [
  {
    icon: IdCard, title: 'Fan Pass', text: 'Votre identité de supporter, vos niveaux et vos badges.',
    links: [{ label: 'Mon Fan ID', href: '/supporters/fan-id' }, { label: 'Niveaux & XP', href: '/supporters/niveaux' }, { label: 'Badges', href: '/supporters/badges' }, { label: 'Fan Studio', href: '/supporters/fan-studio' }],
  },
  {
    icon: Gamepad2, title: 'Fan Arena', text: 'Jeux et défis autour du football ivoirien.',
    links: [{ label: 'Tous les jeux', href: '/supporters/arena' }, { label: 'Quiz', href: '/supporters/arena/quiz' }, { label: 'Pronostics', href: '/supporters/arena/pronostics' }, { label: 'Classements', href: '/supporters/classements' }],
  },
  {
    icon: Camera, title: 'Fan Zone', text: 'Créations et messages des supporters, modérés.',
    links: [{ label: 'Fil Fan Zone', href: '/supporters/fan-zone' }, { label: 'Tifo Studio', href: '/supporters/tifo-studio' }, { label: 'Chants', href: '/supporters/chants' }],
  },
  {
    icon: Users, title: 'Communauté', text: 'Associations, charte et règles de la communauté.',
    links: [{ label: 'Associations de supporters', href: '/supporters/associations' }, { label: 'Club des Supporters', href: '/supporters/club-des-supporters' }, { label: 'Charte du supporter', href: '/supporters/charte' }, { label: 'Modération', href: '/supporters/moderation' }],
  },
]

export default async function SupportersPage() {
  await loadCms()
  const next = nextElephantsFixture()
  const last = lastElephantsFixture()
  // Défi du jour : une question de culture générale vérifiée, qui change chaque jour.
  const facts = quizQuestions.filter((q) => q.id.startsWith('q-real-'))
  const daily = facts[Math.floor(Date.now() / 86_400_000) % facts.length]

  return (
    <main>
      <PageHero
        eyebrow="FIF Fan Universe"
        title="Vivez le football ivoirien autrement."
        subtitle="Jouez, pronostiquez, collectionnez des badges et partagez votre passion pour les Éléphants et les clubs ivoiriens — sans jamais miser ni gagner d’argent."
        breadcrumb={[{ label: 'Supporters' }]}
        actions={<><Link className="button button-primary" href="/supporters/arena/quiz">Jouer au quiz</Link><Link className="button-outline" href="/supporters/fan-id">Mon Fan ID</Link></>}
      />

      <section className="page-section">
        <FanWelcome />
      </section>

      <section className="page-section section-alt" aria-labelledby="fan-rdv">
        <div className="page-section-head"><div><p className="section-tag">Rendez-vous</p><h2 id="fan-rdv">Les Éléphants et le défi du jour</h2></div></div>
        <div className="fan-rdv">
          <article className="fan-rdv-card">
            <span className="fan-kicker"><CalendarDays aria-hidden /> Prochain match des Éléphants</span>
            {next ? (
              <>
                <h3>Côte d’Ivoire – {next.opponent}</h3>
                <p>{next.competition} · {formatDateLong(next.date)} · {next.venue}</p>
                <Link href="/supporters/matchday" className="button button-primary">Préparer le Matchday</Link>
              </>
            ) : elephantsNextWindow ? (
              <>
                <h3>Côte d’Ivoire – {elephantsNextWindow.opponent}</h3>
                <p>{elephantsNextWindow.competition} · {elephantsNextWindow.period}</p>
                <Link href="/supporters/arena/pronostics" className="button button-primary">Faire un pronostic</Link>
              </>
            ) : <p>Le prochain match sera annoncé dès sa confirmation officielle.</p>}
            {last?.result && (
              <p className="fan-rdv-last">Dernier match : Côte d’Ivoire {last.result.civScore} – {last.result.opponentScore} {last.opponent} ({last.competition.toLowerCase()}) · <Link href={`/equipes-nationales/elephants/matchs/${last.slug}`}>Voir le match</Link></p>
            )}
          </article>
          <article className="fan-rdv-card is-quiz">
            <span className="fan-kicker"><Brain aria-hidden /> Défi du jour</span>
            <h3>{daily.question}</h3>
            <p>Catégorie {daily.category} · gagnez de l’XP en répondant juste.</p>
            <Link href="/supporters/arena/quiz" className="button button-primary">Répondre</Link>
          </article>
        </div>
      </section>

      <section className="page-section" aria-labelledby="fan-play">
        <div className="page-section-head"><div><p className="section-tag">Fan Arena</p><h2 id="fan-play">Jouer et progresser</h2></div><Link href="/supporters/arena" className="text-link">Tous les jeux <ArrowRight size={15} /></Link></div>
        <div className="fan-play">
          {PLAY.map(({ icon: Icon, title, text, href, cta }) => (
            <Link key={href} href={href} className="fan-play-card">
              <Icon aria-hidden />
              <strong>{title}</strong>
              <span>{text}</span>
              <span className="text-link">{cta} <ArrowRight size={15} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-section section-alt" aria-labelledby="fan-universes">
        <div className="page-section-head"><div><p className="section-tag">Explorer</p><h2 id="fan-universes">Les quatre univers du supporter</h2></div></div>
        <div className="fan-universes">
          {UNIVERSES.map(({ icon: Icon, title, text, links }) => (
            <div key={title} className="fan-universe">
              <Icon aria-hidden />
              <h3>{title}</h3>
              <p>{text}</p>
              <ul>{links.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section" aria-labelledby="fan-values">
        <div className="fan-values">
          <div>
            <p className="section-tag">Nos valeurs</p>
            <h2 id="fan-values">Un espace sûr et positif</h2>
            <p>Respect, fair-play, zéro violence, zéro racisme, zéro discrimination : la charte du supporter s’applique en ligne comme au stade. Les publications de la Fan Zone sont modérées avant d’être visibles.</p>
            <div className="button-group">
              <Link href="/supporters/charte" className="button-outline"><HeartHandshake size={16} /> Lire la charte</Link>
              <Link href="/supporters/moderation" className="button-outline"><ShieldCheck size={16} /> Modération</Link>
            </div>
          </div>
          <ul className="fan-values-list">
            <li><Palette aria-hidden /> Créez votre avatar et vos tifos</li>
            <li><Music aria-hidden /> Chantez L’Abidjanaise avant chaque match</li>
            <li><Trophy aria-hidden /> Aucune mise, aucun gain d’argent</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
