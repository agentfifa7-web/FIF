'use client'

import Link from 'next/link'
import { HeroVideo } from '@/components/site/HeroVideo'
import {
  ArrowRight, BadgeCheck, BookOpen, CalendarDays, ClipboardList, Clock3, FileText, GraduationCap, Heart, IdCard,
  MapPin, Megaphone, Newspaper, PlayCircle, Scale, Shield, Trophy, Users, Flag,
} from 'lucide-react'
import {
  articles,
  clubs,
  competitions,
  getClubById,
  getStadiumById,
  matches,
  players,
  recentResults,
  standingsFor,
  upcomingMatches,
  videos,
} from '@/lib/data/mock'
import { formatDate, matchWhen } from '@/lib/format'
import { ClubCrest } from '@/components/site/cards'
import { NewsThumb } from '@/components/site/NewsThumb'
import { useFirstLiveMatch } from '@/lib/liveMatch'
import { NationalTeamsGrid } from '@/components/site/NationalTeamsGrid'
import { getSettings } from '@/lib/cms/runtime'

export default function HomePage() {
  const settings = getSettings()
  const live = useFirstLiveMatch(matches)
  const next = live ?? upcomingMatches(1)[0]
  const results = recentResults(5)
  const lead = articles[0]
  const secondary = articles.slice(1, 5)
  const table = standingsFor('comp-l1').filter((r) => r.played > 0).slice(0, 8)
  const proClubs = clubs.filter((c) => c.category === 'Professionnel').length
  const activeComps = competitions.filter((c) => c.clubIds.length > 0)

  return (
    <main>
      {/* A. HÉROS ÉDITORIAL */}
      <section className="h-hero" aria-labelledby="hero-title">
        {settings.heroImage
          ? <div className="h-hero-media" aria-hidden="true"><img src={settings.heroImage} alt="" fetchPriority="high" /></div>
          : <HeroVideo src="/hero-elephants.mp4" poster="/media/hero-poster.jpg" />}
        <div className="h-hero-inner">
          <p className="eyebrow" style={{ color: '#fff' }}><span /> Fédération Ivoirienne de Football</p>
          <h1 id="hero-title">La fierté d’une nation,<br /><em>la passion d’un peuple.</em></h1>
          <p>Éléphants, championnats, clubs et supporters : suivez tout le football ivoirien, en direct et au quotidien.</p>
          <div className="h-hero-actions">
            <Link className="button button-primary" href="/equipes-nationales/elephants">Découvrir les Éléphants <ArrowRight /></Link>
            <Link className="button button-ghost" href="/matches">Prochains matchs</Link>
          </div>
        </div>
        {settings.heroImage && settings.heroCredit && <span className="h-hero-credit">{settings.heroCredit}</span>}
      </section>

      {/* B. MATCH CENTER */}
      <section className="h-mc" aria-labelledby="h-mc-title">
        <h2 id="h-mc-title" className="sr-only">Match Center</h2>
        <div className="h-mc-grid">
          <div className="h-mc-next">
            {next ? (
              <>
                <p className="h-mc-label"><i /> {live ? 'En direct' : 'Prochain match'}</p>
                <p className="h-mc-comp">{competitions.find((c) => c.id === next.competitionId)?.name} · {next.matchday}e journée</p>
                <div className="h-mc-teams">
                  {[next.homeClubId, next.awayClubId].map((id, i) => {
                    const club = getClubById(id)
                    return (
                      <div className="h-mc-team" key={id} style={{ order: i === 0 ? 0 : 2 }}>
                        {club && <ClubCrest club={club} size={64} />}
                        <strong>{club?.name}</strong>
                      </div>
                    )
                  })}
                  <div className="h-mc-vs" style={{ order: 1 }}>
                    {live ? <b>{live.homeScore} – {live.awayScore}</b> : 'VS'}
                  </div>
                </div>
                <div className="h-mc-meta">
                  <span><CalendarDays aria-hidden /> {matchWhen(next, { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                  <span><MapPin aria-hidden /> {(next.stadiumId ? getStadiumById(next.stadiumId)?.name : next.venue) ?? 'Stade à confirmer'}</span>
                </div>
                <div className="h-mc-actions">
                  <Link className="button button-secondary" href={`/matches/${next.id}`}>Fiche du match</Link>
                  <Link className="button-outline" href="/matches">Calendrier complet <ArrowRight size={16} /></Link>
                </div>
              </>
            ) : (
              <p className="lede">Le prochain programme sera publié dès son annonce par la FIF.</p>
            )}
          </div>
          <div className="h-mc-results">
            <h3>Derniers résultats</h3>
            {results.map((m) => (
              <Link key={m.id} href={`/matches/${m.id}`} className="h-res">
                <small>{competitions.find((c) => c.id === m.competitionId)?.name} · {formatDate(m.date)}</small>
                <span>{getClubById(m.homeClubId)?.name} – {getClubById(m.awayClubId)?.name}</span>
                <b>{m.homeScore}-{m.awayScore}</b>
                {m.scoreConfirmed === false && <em>Score à confirmer</em>}
              </Link>
            ))}
            <Link className="text-link" href="/resultats">Tous les résultats <ArrowRight size={16} style={{ verticalAlign: 'middle' }} /></Link>
          </div>
        </div>
      </section>

      {/* C. ACTUALITÉS À LA UNE */}
      <section className="h-section reveal" aria-labelledby="news-title">
        <div className="h-head">
          <div><span className="h-kicker">À la une</span><h2 id="news-title">L’actualité du football ivoirien</h2></div>
          <Link className="text-link" href="/actualites">Toutes les actualités <ArrowRight size={16} style={{ verticalAlign: 'middle' }} /></Link>
        </div>
        <div className="h-news">
          {lead && (
            <article className="news-card h-news-lead">
              <Link href={`/actualites/${lead.slug}`} className="news-image"><NewsThumb article={lead} /><span>{lead.category}</span></Link>
              <div className="news-body">
                <small>{formatDate(lead.date, { day: 'numeric', month: 'long', year: 'numeric' })}</small>
                <h3><Link href={`/actualites/${lead.slug}`}>{lead.title}</Link></h3>
                <p className="muted" style={{ margin: '10px 0 0' }}>{lead.excerpt}</p>
              </div>
            </article>
          )}
          <div className="h-news-list">
            {secondary.map((a) => (
              <article className="h-news-item" key={a.id}>
                <Link href={`/actualites/${a.slug}`} className="h-news-thumb" tabIndex={-1} aria-hidden="true"><NewsThumb article={a} /></Link>
                <div>
                  <small>{a.category}<time dateTime={a.date}>{formatDate(a.date)}</time></small>
                  <h3><Link href={`/actualites/${a.slug}`}>{a.title}</Link></h3>
                </div>
              </article>
            ))}
          </div>
        </div>
        <Link className="h-press" href="/actualites#revue-de-presse">
          <Newspaper aria-hidden />
          <div><strong>Revue de presse</strong><span>Les titres des médias sportifs ivoiriens, mis à jour en continu.</span></div>
          <ArrowRight aria-hidden />
        </Link>
      </section>

      {/* D. ÉQUIPES NATIONALES */}
      <section className="h-section section-alt reveal" aria-labelledby="teams-title">
        <div className="h-head">
          <div><span className="h-kicker">Équipes nationales</span><h2 id="teams-title">Sept sélections, une seule fierté</h2></div>
          <Link className="text-link" href="/equipes-nationales">Toutes les sélections <ArrowRight size={16} style={{ verticalAlign: 'middle' }} /></Link>
        </div>
        <NationalTeamsGrid />
      </section>

      {/* E. COMPÉTITIONS */}
      <section className="h-section reveal" aria-labelledby="comp-title">
        <div className="h-head">
          <div><span className="h-kicker">Compétitions</span><h2 id="comp-title">Saison 2026-2027</h2><p>Classements calculés à partir des résultats officiels publiés.</p></div>
          <Link className="text-link" href="/competitions">Toutes les compétitions <ArrowRight size={16} style={{ verticalAlign: 'middle' }} /></Link>
        </div>
        <div className="h-comp">
          <div className="h-table">
            <div className="h-table-head"><strong>Ligue 1 — classement</strong><Link className="text-link" href="/competitions/ligue-1">Complet</Link></div>
            <div className="table-scroll">
              <table>
                <caption className="sr-only">Classement de la Ligue 1 (8 premiers)</caption>
                <thead><tr><th scope="col">#</th><th scope="col">Club</th><th scope="col">J</th><th scope="col" className="hide-sm">Diff.</th><th scope="col">Pts</th></tr></thead>
                <tbody>
                  {table.map((r, i) => {
                    const club = getClubById(r.clubId)
                    return (
                      <tr key={r.clubId}>
                        <td>{i + 1}</td>
                        <td className="club">{club && <ClubCrest club={club} size={24} />}<Link href={`/clubs/${club?.slug}`}>{club?.name}</Link></td>
                        <td>{r.played}</td>
                        <td className="hide-sm">{r.goalsFor - r.goalsAgainst > 0 ? '+' : ''}{r.goalsFor - r.goalsAgainst}</td>
                        <td className="pts">{r.points}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="h-comp-list">
            {activeComps.map((c) => (
              <Link key={c.id} href={`/competitions/${c.slug}`} className="h-comp-link">
                <span className="h-comp-icon"><Trophy aria-hidden size={20} /></span>
                <div><strong>{c.name}</strong><span>{c.clubIds.length} équipes · {c.format.split(' — ')[0]}</span></div>
                <ArrowRight aria-hidden />
              </Link>
            ))}
            <Link href="/matches" className="h-comp-link">
              <span className="h-comp-icon"><CalendarDays aria-hidden size={20} /></span>
              <div><strong>Calendrier & résultats</strong><span>Tous les matchs officiels, journée par journée</span></div>
              <ArrowRight aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* F. FIF TV */}
      <section className="h-section section-brand reveal" aria-labelledby="tv-title">
        <div className="h-head">
          <div><span className="h-kicker">FIF TV</span><h2 id="tv-title">Le football ivoirien en images</h2></div>
          <Link className="text-link" style={{ color: '#fff' }} href="/fif-tv">Ouvrir FIF TV <ArrowRight size={16} style={{ verticalAlign: 'middle' }} /></Link>
        </div>
        <div className="h-tv">
          <div className="h-tv-screen">
            {videos[0]
              ? <Link href={`/fif-tv/${videos[0].slug}`} aria-label={`Lire : ${videos[0].title}`}><img src={videos[0].image} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></Link>
              : <video src="/hero-elephants.mp4" poster="/media/hero-poster.jpg" muted loop playsInline preload="none" controls aria-label="Clip vidéo FIF" />}
          </div>
          <div className="h-tv-list">
            {videos.length ? videos.slice(0, 4).map((v) => (
              <div key={v.id}><strong><Link href={`/fif-tv/${v.slug}`}>{v.title}</Link></strong><span>{v.category} · {v.duration}</span></div>
            )) : (
              <>
                <div><strong>Résumés des matchs</strong><span>Les temps forts des Éléphants et des championnats.</span></div>
                <div><strong>Conférences de presse</strong><span>Sélectionneurs, joueurs et dirigeants.</span></div>
                <div><strong>Coulisses et reportages</strong><span>Au cœur des sélections et des clubs.</span></div>
                <p className="h-fan-note" style={{ color: '#c8d6ce' }}>Les vidéos officielles seront publiées ici dès leur mise en ligne par la FIF.</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* G. FOOTBALL IVOIRIEN */}
      <section className="h-section reveal" aria-labelledby="foot-title">
        <div className="h-head">
          <div><span className="h-kicker">Football ivoirien</span><h2 id="foot-title">Du quartier à l’élite</h2><p>Clubs, joueurs, formation et toutes les pratiques du football en Côte d’Ivoire.</p></div>
        </div>
        <div className="h-foot">
          <Link href="/clubs"><b>{proClubs}</b><strong>Clubs professionnels</strong><span>Ligue 1 et Ligue 2 : fiches, effectifs, stades et résultats.</span><span className="text-link">Trouver un club <ArrowRight size={16} style={{ verticalAlign: 'middle' }} /></span></Link>
          <Link href="/joueurs"><Users aria-hidden /><strong>Joueurs</strong><span>{players.length} profils de licenciés et d’internationaux.</span></Link>
          <Link href="/formation"><GraduationCap aria-hidden /><strong>Formation</strong><span>FIF Academy : entraîneurs, arbitres, dirigeants.</span></Link>
          <Link href="/football/amateur"><Shield aria-hidden /><strong>Football amateur</strong><span>Championnats régionaux, D3 et districts.</span></Link>
          <Link href="/football/feminin"><Heart aria-hidden /><strong>Football féminin</strong><span>Éléphantes, championnat et développement.</span></Link>
          <Link href="/talent-hub"><BadgeCheck aria-hidden /><strong>Talents</strong><span>Académies agréées et détection.</span></Link>
        </div>
      </section>

      {/* H. FIF FAN UNIVERSE */}
      <section className="h-section compact reveal" aria-labelledby="fan-title">
        <div className="h-fan">
          <div>
            <span className="h-kicker" style={{ color: 'var(--gray-900)' }}>FIF Fan Universe</span>
            <h2 id="fan-title">Supporters, entrez dans le jeu</h2>
            <p>Créez votre Fan ID, gagnez des points et des badges, jouez aux quiz et partagez votre passion dans la Fan Zone.</p>
            <Link className="button button-secondary" href="/supporters/fan-id">Créer mon Fan ID <ArrowRight /></Link>
            <p className="h-fan-note">Points symboliques uniquement : aucune mise, aucun gain d’argent.</p>
          </div>
          <div className="h-fan-grid">
            <Link href="/supporters/arena/quiz"><strong>Quiz</strong><span>Testez vos connaissances</span></Link>
            <Link href="/supporters/arena/pronostics"><strong>Pronostics</strong><span>Gratuits, sans mise</span></Link>
            <Link href="/supporters/fan-zone"><strong>Fan Zone</strong><span>Photos, chants, créations</span></Link>
            <Link href="/supporters/classements"><strong>Classements</strong><span>Villes, écoles, communautés</span></Link>
          </div>
        </div>
      </section>

      {/* I. SERVICES FÉDÉRAUX */}
      <section className="h-section section-alt reveal" aria-labelledby="services-title">
        <div className="h-head">
          <div><span className="h-kicker">Services fédéraux</span><h2 id="services-title">Vos démarches en ligne</h2></div>
          <Link className="text-link" href="/services">Tous les services <ArrowRight size={16} style={{ verticalAlign: 'middle' }} /></Link>
        </div>
        <div className="h-services">
          <Link href="/licences"><IdCard aria-hidden /><div><strong>Licences</strong><span>Demander ou renouveler une licence</span></div></Link>
          <Link href="/portail/clubs"><ClipboardList aria-hidden /><div><strong>Portail Clubs</strong><span>Effectifs, licenciés, feuilles de match</span></div></Link>
          <Link href="/officiels"><Flag aria-hidden /><div><strong>Portail Officiels</strong><span>Arbitres, délégués, commissaires</span></div></Link>
          <Link href="/formation"><BookOpen aria-hidden /><div><strong>Formation</strong><span>Parcours diplômants FIF Academy</span></div></Link>
          <Link href="/documents"><FileText aria-hidden /><div><strong>Documents officiels</strong><span>Règlements, circulaires, décisions</span></div></Link>
          <Link href="/reclamations"><Scale aria-hidden /><div><strong>Réclamations</strong><span>Déposer et suivre une réclamation</span></div></Link>
        </div>
      </section>

      {/* J. FOOTBALL POUR TOUS & PARTENAIRES */}
      <section className="h-section reveal" aria-labelledby="all-title">
        <div className="h-for-all">
          <div>
            <span className="h-kicker">Football pour tous</span>
            <h2 id="all-title" style={{ fontSize: 'var(--fs-h2)', margin: 0 }}>Développer le football partout en Côte d’Ivoire</h2>
            <div className="h-programs" style={{ marginTop: 24 }}>
              <Link href="/aides-projets"><Megaphone aria-hidden /><div><strong>Projet Club & aides FIF</strong><span>Accompagnement et financement des clubs</span></div></Link>
              <Link href="/football/scolaire"><GraduationCap aria-hidden /><div><strong>Football scolaire</strong><span>Le football à l’école et à l’université</span></div></Link>
              <Link href="/academies"><Clock3 aria-hidden /><div><strong>Académies</strong><span>Formation des jeunes talents</span></div></Link>
            </div>
          </div>
          <div className="h-partners">
            <span className="h-kicker">Partenaires</span>
            <strong>Partenaires officiels de la FIF</strong>
            <p>Cet espace présente uniquement les partenaires dont le contrat est validé par la Fédération. Les logos seront affichés dès leur transmission officielle.</p>
            <Link className="button-outline" href="/contact" style={{ alignSelf: 'flex-start' }}>Devenir partenaire <ArrowRight size={16} /></Link>
          </div>
        </div>
        <p className="h-source"><PlayCircle size={14} style={{ verticalAlign: 'middle' }} aria-hidden /> Résultats, calendriers et classements issus de sources publiques citées sur chaque page (FIF, presse sportive), mis à jour plusieurs fois par jour.</p>
      </section>
    </main>
  )
}
