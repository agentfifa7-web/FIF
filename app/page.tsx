'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CalendarDays, Clock3, MapPin, Newspaper, Play, Trophy, Users } from 'lucide-react'
import {
  articles,
  getClubById,
  getStadiumById,
  getTeam,
  matches,
  nextElephantsFixture,
  elephantsFlag,
  upcomingMatches,
  videos,
} from '@/lib/data/mock'
import { formatDate, formatTime } from '@/lib/format'
import { NewsCard } from '@/components/site/cards'
import { DemoBadge } from '@/components/site/DemoBadge'
import { useFirstLiveMatch } from '@/lib/liveMatch'

const categories = ['Tous', 'Éléphants', 'Éléphantes', 'Ligue 1', 'Féminin', 'Jeunes', 'Compétitions', 'Fédération']

export default function Page() {
  const [category, setCategory] = useState('Tous')
  const filteredNews = useMemo(
    () => (category === 'Tous' ? articles.slice(0, 4) : articles.filter((a) => a.category === category).slice(0, 4)),
    [category],
  )
  const nextMatch = upcomingMatches(1)[0]
  const live = useFirstLiveMatch(matches)
  const elephants = getTeam('elephants')!
  const nextFixture = nextElephantsFixture()
  const ticker = [...articles.slice(0, 3), ...upcomingMatches(2)].slice(0, 4)

  return (
    <main>
      <section className="hero" id="accueil">
        <video
          className="hero-video"
          src="/hero-elephants.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow light"><span /> Fédération Ivoirienne de Football</p>
          <h1>Le football ivoirien,<br /><em>entre dans une</em><br />nouvelle ère.</h1>
          <p className="hero-lede">Tout le football ivoirien, dans un seul univers. Actualités, compétitions, Éléphants, clubs, joueurs et données fédérales.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/matches">Voir les prochains matchs <ArrowRight /></Link>
            <Link className="button button-ghost" href="/equipes-nationales/elephants">Découvrir les Éléphants</Link>
          </div>
        </div>
        <div className="hero-meta"><span>01</span><div className="hero-line"><i /></div><span>03</span><b>Abidjan · Côte d&apos;Ivoire</b></div>
      </section>

      <section className="alert-bar">
        <span className="alert-live"><i /> EN DIRECT</span>
        <strong>{live ? getClubById(live.homeClubId)?.shortName : 'Éléphants'}</strong>
        <span>{live ? `${getClubById(live.homeClubId)?.name} ${live.homeScore} - ${live.awayScore} ${getClubById(live.awayClubId)?.name} (${live.minute}')` : `Prochain rendez-vous : ${elephants.name} vs ${nextFixture.opponent}, ${formatDate(nextFixture.date)}`}</span>
        <Link href="/actualites">Lire l&apos;annonce <ArrowRight /></Link>
      </section>

      <section className="ticker" aria-label="Fil d'information">
        {ticker.map((item, i) => (
          <span key={i}>
            {formatDate('title' in item ? item.date : item.date, { day: '2-digit', month: '2-digit' })}{' '}
            <b>{'title' in item ? item.category.toUpperCase() : 'MATCH'}</b>{' '}
            {'title' in item ? item.title : `${getClubById(item.homeClubId)?.shortName} vs ${getClubById(item.awayClubId)?.shortName}`}
          </span>
        ))}
      </section>

      {nextMatch && (
        <section className="match-strip" id="matchs">
          <div className="section-label"><span className="live-dot" /> Match du jour</div>
          <div className="match-main">
            <div>
              <small>{'CHAMPIONNAT NATIONAL · J' + nextMatch.matchday}</small>
              <strong>{getClubById(nextMatch.homeClubId)?.name} <b>vs</b> {getClubById(nextMatch.awayClubId)?.name}</strong>
              <p><CalendarDays /> {formatDate(nextMatch.date, { weekday: 'long', day: 'numeric', month: 'long' })} <i /> <Clock3 /> {formatTime(nextMatch.date)} · {getStadiumById(nextMatch.stadiumId)?.name}</p>
            </div>
            <Link className="circle-arrow" href={`/matches/${nextMatch.id}`} aria-label="Voir le match"><ArrowRight /></Link>
          </div>
          <div className="match-status"><span>À venir</span><strong>{Math.max(0, Math.round((+new Date(nextMatch.date) - Date.now()) / 86400000))} <small>J</small></strong></div>
        </section>
      )}

      <section className="next-match" id="elephants">
        <div className="next-copy">
          <p className="eyebrow"><span /> Équipe nationale</p>
          <h2>Prochain match<br /><em>des Éléphants</em></h2>
          <p className="muted">Les champions d&apos;Afrique retrouvent le terrain pour une nouvelle bataille.</p>
          <Link className="text-link" href="/equipes-nationales/elephants">Tout sur les Éléphants <ArrowRight /></Link>
        </div>
        <Link href={`/equipes-nationales/elephants/matchs/${nextFixture.slug}`} className="next-card" style={{ display: 'block' }}>
          <div className="next-card-top"><span>{nextFixture.competition.toUpperCase()}</span><span>{formatDate(nextFixture.date).toUpperCase()}</span></div>
          <div className="teams">
            <div className="team"><div className="crest ivory" style={{ fontSize: 32 }}>{elephantsFlag}</div><strong>Côte<br />d&apos;Ivoire</strong></div>
            <div className="versus"><small>{nextFixture.time}</small><b>VS</b><span>{nextFixture.venue}<br />{nextFixture.home ? 'Domicile' : 'Extérieur'}</span></div>
            <div className="team"><div className="crest red" style={{ fontSize: 32 }}>{nextFixture.opponentFlag}</div><strong>{nextFixture.opponent}</strong></div>
          </div>
          <CountdownBar targetIso={nextFixture.date} />
        </Link>
      </section>

      <section className="news-section" id="actualites">
        <div className="section-heading">
          <div><p className="eyebrow"><span /> Le fil FIF</p><h2>À la une</h2></div>
          <Link className="text-link" href="/actualites">Toutes les actualités <ArrowRight /></Link>
        </div>
        <div className="filters" role="tablist" aria-label="Filtrer les actualités">
          {categories.map((item) => (
            <button key={item} type="button" className={category === item ? 'filter active' : 'filter'} onClick={() => setCategory(item)}>{item}</button>
          ))}
        </div>
        <div className="news-grid">
          {filteredNews.map((item, i) => <NewsCard key={item.id} article={item} featured={i === 0} />)}
        </div>
        <Link href="/actualites#revue-de-presse" className="press-teaser">
          <Newspaper />
          <div><strong>Revue de presse — médias ivoiriens</strong><span>Titres agrégés en direct depuis Fraternité Matin, Koaci, Abidjan.net, RTI et plus, sur le football ivoirien et les pros ivoiriens à l’international.</span></div>
          <ArrowRight />
        </Link>
      </section>

      <section className="quick-links">
        <div className="section-heading">
          <div><p className="eyebrow"><span /> Services fédéraux</p><h2>Tout le football,<br /><em>à portée de main.</em></h2></div>
        </div>
        <div className="service-grid">
          <Link href="/competitions"><Trophy /><strong>Compétitions</strong><span>Calendriers, classements et résultats <ArrowRight /></span></Link>
          <Link href="/clubs"><Users /><strong>Clubs & licenciés</strong><span>Trouver un club, gérer sa licence <ArrowRight /></span></Link>
          <Link href="/formation"><CalendarDays /><strong>Formation</strong><span>FIF Academy et parcours fédéraux <ArrowRight /></span></Link>
        </div>
      </section>

      <section className="tv-section" id="fif-tv">
        <div className="section-heading">
          <div><p className="eyebrow light"><span /> L&apos;image du football ivoirien</p><h2>FIF <em>TV</em></h2></div>
          <Link className="text-link light-link" href="/fif-tv">Voir toutes les vidéos <ArrowRight /></Link>
        </div>
        <div className="video-grid">
          <article className="video-feature">
            <div className="video-image" style={{ backgroundImage: `linear-gradient(0deg,rgba(0,0,0,.45),transparent),url(${videos[0].image})` }}>
              <Link href={`/fif-tv/${videos[0].slug}`} aria-label="Lire la vidéo"><Play fill="currentColor" /></Link>
              <span>{videos[0].duration}</span>
            </div>
            <div><small>{videos[0].category.toUpperCase()}</small><h3>{videos[0].title}</h3></div>
          </article>
          {videos.slice(1, 3).map((v, i) => (
            <article className="video-small" key={v.id}>
              <div className={`video-thumb thumb-${i === 0 ? 'two' : 'three'}`} style={{ backgroundImage: `linear-gradient(0deg,rgba(0,0,0,.35),transparent),url(${v.image})` }}>
                <Link href={`/fif-tv/${v.slug}`} aria-label="Lire la vidéo"><Play fill="currentColor" /></Link>
              </div>
              <small>{v.category.toUpperCase()}</small>
              <h3>{v.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section tight">
        <DemoBadge />
        <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 12, maxWidth: 640 }}>
          FIF Digital Universe est un prototype : joueurs, clubs, résultats et statistiques affichés sont des données de démonstration générées pour illustrer la plateforme, et ne représentent aucune donnée officielle de la Fédération Ivoirienne de Football, de ses membres ou de ses partenaires.
        </p>
      </section>
    </main>
  )
}

function CountdownBar({ targetIso }: { targetIso: string }) {
  const initialDiff = Math.max(0, +new Date(targetIso) - +new Date('2026-09-17T12:00:00Z'))
  const [diff, setDiff] = useState(initialDiff)

  useEffect(() => {
    const tick = () => setDiff(Math.max(0, +new Date(targetIso) - Date.now()))
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [targetIso])

  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  return (
    <div className="countdown" suppressHydrationWarning>
      <div><b>{String(days).padStart(2, '0')}</b><small>JOURS</small></div>
      <i>:</i>
      <div><b>{String(hours).padStart(2, '0')}</b><small>HEURES</small></div>
      <i>:</i>
      <div><b>{String(minutes).padStart(2, '0')}</b><small>MINUTES</small></div>
    </div>
  )
}
