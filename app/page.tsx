'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  Menu,
  Play,
  Search,
  Trophy,
  Users,
  X,
} from 'lucide-react'

const news = [
  { category: 'Éléphants', title: 'Les Éléphants préparent déjà leur prochaine échéance internationale', date: '16 SEPT. 2026', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=85', featured: true },
  { category: 'Compétitions', title: 'Ligue 1 LONACI : une saison qui promet encore du spectacle', date: '15 SEPT. 2026', image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=800&q=85' },
  { category: 'Fédération', title: 'La FIF renforce son programme de développement des jeunes talents', date: '14 SEPT. 2026', image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=800&q=85' },
  { category: 'Féminin', title: 'Le football féminin ivoirien écrit une nouvelle page', date: '12 SEPT. 2026', image: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&w=800&q=85' },
]

const categories = ['Tous', 'Éléphants', 'Clubs', 'Féminin', 'Jeunes', 'Compétitions', 'Fédération']
const universe = [
  { title: 'La FIF', items: ['La Fédération', 'Le Président', 'Les commissions', 'Les textes officiels'] },
  { title: 'Équipes nationales', items: ['Les Éléphants', 'Les Éléphantes', 'Équipes jeunes', 'Futsal', 'Beach Soccer'] },
  { title: 'Le football', items: ['Ligue 1 LONACI', 'Ligue 2', 'Football féminin', 'Football amateur', 'Football des jeunes'] },
  { title: 'Pratiquer', items: ['Trouver un club', 'Prendre une licence', 'Formation', 'Arbitrage', 'FIF ID'] },
]

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [universeOpen, setUniverseOpen] = useState(false)
  const [category, setCategory] = useState('Tous')
  const filteredNews = useMemo(() => category === 'Tous' ? news : news.filter((item) => item.category === category), [category])

  return (
    <main className="site-shell">
      <div className="utility-bar"><div className="utility-inner"><span>FIF DIGITAL UNIVERSE</span><div><a href="#billetterie">Billetterie</a><a href="#boutique">Boutique</a><a href="#academy">FIF Academy</a><a href="#clubs">Portail Clubs</a><a href="#presse">Presse</a><a href="#connexion">Se connecter</a></div></div></div>
      <header className="topbar">
        <a className="brand" href="#accueil" aria-label="FIF Digital accueil"><img className="fif-logo" src="/fif-logo.png" alt="Fédération Ivoirienne de Football" /><span className="brand-copy"><strong>FIF</strong><small>DIGITAL</small></span></a>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Navigation principale">
          <button className={universeOpen ? 'nav-dropdown active' : 'nav-dropdown'} onClick={() => setUniverseOpen(!universeOpen)}>Univers FIF <ChevronDown /></button>
          {['Équipes nationales', 'Compétitions', 'Le football', 'La FIF', 'Actualités', 'FIF TV', 'Pratiquer'].map((item) => <a key={item} href={`#${item.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setMenuOpen(false)}>{item}</a>)}
          {universeOpen && <div className="universe-panel">{universe.map((group) => <div key={group.title}><b>{group.title}</b>{group.items.map((item) => <a href={`#${item.toLowerCase().replaceAll(' ', '-')}`} key={item}>{item}</a>)}</div>)}</div>}
        </nav>
        <div className="nav-actions"><button className="icon-button" aria-label="Rechercher"><Search /></button><a className="login-link" href="#connexion">Compte</a><button className="menu-button" aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div>
      </header>

      <section className="hero" id="accueil"><div className="hero-overlay" /><div className="hero-content"><p className="eyebrow light"><span /> Fédération Ivoirienne de Football</p><h1>Le football ivoirien,<br /><em>entre dans une</em><br />nouvelle ère.</h1><p className="hero-lede">Tout le football ivoirien, dans un seul univers. Actualités, compétitions, Éléphants, clubs, joueurs et données fédérales.</p><div className="hero-actions"><a className="button button-primary" href="#matchs">Voir les prochains matchs <ArrowRight /></a><a className="button button-ghost" href="#elephants">Découvrir les Éléphants</a></div></div><div className="hero-meta"><span>01</span><div className="hero-line"><i /></div><span>03</span><b>Abidjan · Côte d&apos;Ivoire</b></div></section>

      <section className="alert-bar"><span className="alert-live"><i /> EN DIRECT</span><strong>Éléphants</strong><span>Nouvelle liste annoncée pour la prochaine fenêtre internationale</span><a href="#actualites">Lire l&apos;annonce <ArrowRight /></a></section>
      <section className="ticker" aria-label="Fil d'information"><span>16/09 <b>ÉLÉPHANTS</b> Nouvelle liste annoncée</span><span>16/09 <b>LIGUE 1</b> Résultats de la journée</span><span>15/09 <b>FÉMININ</b> Calendrier dévoilé</span><span>15/09 <b>FORMATION</b> Nouvelles sessions</span></section>

      <section className="match-strip" id="matchs"><div className="section-label"><span className="live-dot" /> Match du jour</div><div className="match-main"><div><small>CHAMPIONNAT NATIONAL · J12</small><strong>ASEC Mimosas <b>vs</b> Stade d&apos;Abidjan</strong><p><CalendarDays /> Samedi 20 septembre 2026 <i /> <Clock3 /> 18:00 · Stade Félix Houphouët-Boigny</p></div><a className="circle-arrow" href="#calendrier" aria-label="Voir le calendrier"><ArrowRight /></a></div><div className="match-status"><span>À venir</span><strong>02 <small>J</small></strong></div></section>

      <section className="next-match" id="elephants"><div className="next-copy"><p className="eyebrow"><span /> Équipe nationale</p><h2>Prochain match<br /><em>des Éléphants</em></h2><p className="muted">Les champions d&apos;Afrique retrouvent le terrain pour une nouvelle bataille.</p><a className="text-link" href="#details">Tout sur les Éléphants <ArrowRight /></a></div><div className="next-card"><div className="next-card-top"><span>QUALIFICATIONS CAN 2027</span><span>20 SEPT. 2026</span></div><div className="teams"><div className="team"><div className="crest ivory">CI</div><strong>Côte<br />d&apos;Ivoire</strong></div><div className="versus"><small>18:00</small><b>VS</b><span>Stade de la Paix<br />Bouaké</span></div><div className="team"><div className="crest red">GA</div><strong>Gabon</strong></div></div><div className="countdown"><div><b>02</b><small>JOURS</small></div><i>:</i><div><b>14</b><small>HEURES</small></div><i>:</i><div><b>36</b><small>MINUTES</small></div></div></div></section>

      <section className="news-section" id="actualites"><div className="section-heading"><div><p className="eyebrow"><span /> Le fil FIF</p><h2>À la une</h2></div><a className="text-link" href="#toutes-les-actualites">Toutes les actualités <ArrowRight /></a></div><div className="filters" role="tablist" aria-label="Filtrer les actualités">{categories.map((item) => <button key={item} className={category === item ? 'filter active' : 'filter'} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="news-grid">{filteredNews.map((item) => <article className={item.featured ? 'news-card featured' : 'news-card'} key={item.title}><div className="news-image" style={{ backgroundImage: `url(${item.image})` }}><span>{item.category}</span></div><div className="news-body"><small>{item.date}</small><h3>{item.title}</h3><a href="#article" aria-label={`Lire : ${item.title}`}><ArrowRight /></a></div></article>)}</div></section>

      <section className="quick-links"><div className="section-heading"><div><p className="eyebrow"><span /> Services fédéraux</p><h2>Tout le football,<br /><em>à portée de main.</em></h2></div></div><div className="service-grid"><a href="#competitions"><Trophy /><strong>Compétitions</strong><span>Calendriers, classements et résultats <ArrowRight /></span></a><a href="#clubs"><Users /><strong>Clubs & licenciés</strong><span>Trouver un club, gérer sa licence <ArrowRight /></span></a><a href="#formation"><CalendarDays /><strong>Formation</strong><span>FIF Academy et parcours fédéraux <ArrowRight /></span></a></div></section>

      <section className="tv-section" id="fif-tv"><div className="section-heading"><div><p className="eyebrow light"><span /> L&apos;image du football ivoirien</p><h2>FIF <em>TV</em></h2></div><a className="text-link light-link" href="#videos">Voir toutes les vidéos <ArrowRight /></a></div><div className="video-grid"><article className="video-feature"><div className="video-image"><button aria-label="Lire la vidéo"><Play fill="currentColor" /></button><span>06:42</span></div><div><small>ENTRETIEN · ÉLÉPHANTS</small><h3>Dans les coulisses de la sélection ivoirienne</h3></div></article><article className="video-small"><div className="video-thumb thumb-two"><button aria-label="Lire la vidéo"><Play fill="currentColor" /></button></div><small>RÉSUMÉ · LIGUE 1</small><h3>Les meilleurs moments de la 11e journée</h3></article><article className="video-small"><div className="video-thumb thumb-three"><button aria-label="Lire la vidéo"><Play fill="currentColor" /></button></div><small>FORMATION · JEUNES</small><h3>Au cœur du talent hub ivoirien</h3></article></div></section>

      <footer className="footer"><div className="footer-top"><div><a className="brand footer-brand" href="#accueil"><img className="fif-logo" src="/fif-logo.png" alt="Fédération Ivoirienne de Football" /><span className="brand-copy"><strong>FIF</strong><small>DIGITAL</small></span></a><p>Tout le football ivoirien,<br /><strong>dans un seul univers.</strong></p></div><div className="footer-links"><div><b>Explorer</b><a href="#elephants">Éléphants</a><a href="#competitions">Compétitions</a><a href="#clubs">Clubs</a><a href="#actualites">Actualités</a></div><div><b>La FIF</b><a href="#federation">La Fédération</a><a href="#formation">FIF Academy</a><a href="#fif-tv">FIF TV</a><a href="#documents">Documents</a></div><div><b>Suivez-nous</b><div className="socials"><a href="#facebook" aria-label="Facebook">f</a><a href="#twitter" aria-label="Twitter">x</a><a href="#instagram" aria-label="Instagram">ig</a><a href="#youtube" aria-label="Youtube">yt</a></div></div></div></div><div className="footer-bottom"><span>© 2026 Fédération Ivoirienne de Football</span><span>Mentions légales · Politique de confidentialité</span><span className="made-in">Côte d&apos;Ivoire <i /></span></div></footer>
    </main>
  )
}
