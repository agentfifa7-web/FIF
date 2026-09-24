import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Award, Flag, Info, Trophy } from 'lucide-react'
import { elephantsCallUp, getElephantsPlayer, KEY_ATTRS_BY_POSITION } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'
import { PlayerPhoto } from '@/components/site/PlayerPhoto'
import { StarRating, PositionChips, AttributePanel } from '@/components/site/PlayerAttributes'
import { PlayerRadar } from '@/components/site/PlayerRadar'
import { radarAxesFor } from '@/lib/attributes'
import { age, formatDate } from '@/lib/format'

export function generateStaticParams() {
  return elephantsCallUp.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const player = getElephantsPlayer(slug)
  return { title: player ? `${player.name} — Éléphants — FIF Digital` : 'Joueur' }
}

export default async function ElephantsPlayerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const player = getElephantsPlayer(slug)
  if (!player) notFound()
  const keyAttrs = KEY_ATTRS_BY_POSITION[player.position] ?? []
  const radarAxes = radarAxesFor(player.attributes)

  return (
    <main>
      <section className="page-hero tone-forest">
        <video className="page-hero-flag" src="/flags/cote-divoire-flottant-icone.mp4" autoPlay muted loop playsInline aria-hidden="true" />
        <div className="page-hero-content">
          <div style={{ padding: '0 0 8px' }}>
            <Breadcrumb items={[{ label: 'Équipes nationales', href: '/equipes-nationales' }, { label: 'Éléphants', href: '/equipes-nationales/elephants' }, { label: player.name }]} />
          </div>
          <div style={{ alignItems: 'center', display: 'flex', gap: 24, marginTop: 8 }}>
            <PlayerPhoto name={player.name} photoUrl={player.photoUrl} size={84} background="var(--forest)" />
            <div>
              <p className="eyebrow"><span /> {player.position} · {player.flag} {player.club} ({player.country})</p>
              <h1 style={{ fontSize: 'clamp(30px,4vw,48px)' }}>{player.name}</h1>
            </div>
          </div>
          <div className="page-hero-meta">
            <div><strong>{age(player.birthdate)}</strong><span>Âge</span></div>
            <div><strong>{formatDate(player.birthdate)}</strong><span>Né le</span></div>
            <div><strong>{player.club}</strong><span>Club</span></div>
            <div><strong>{player.country}</strong><span>Championnat</span></div>
          </div>
        </div>
      </section>

      <section className="page-section tight" style={{ paddingBottom: 0 }}>
        <p className="press-source-note"><Info size={13} /> Identité, club et âge réels — sélection communiquée par Hervé Renard. Étoiles, attributs, personnalité et rapport de recrutement ci-dessous sont des estimations générées à titre indicatif, non des données officielles.{player.fmCalibrated ? ' Niveau global calibré à partir de données Football Manager 24/25/26 publiquement disponibles pour ce joueur.' : ''}</p>
        <p className="press-source-note"><Info size={13} /> Statistiques (championnat, coupe, sélection) : chiffres réels compilés le 24 septembre 2026 depuis des sources publiques (FotMob, sites officiels des clubs, presse sportive, Wikipédia) — transfermarkt.com n’étant pas accessible depuis cet environnement. Certains chiffres restaient contradictoires selon les sources au moment de la recherche ; les passes décisives en sélection nationale, rarement recensées publiquement, sont laissées à 0 plutôt qu’estimées.</p>
        {player.note && (
          <p className="status-flag pending" style={{ display: 'inline-block', marginTop: 12 }}>{player.note}</p>
        )}
      </section>

      <section className="page-section tight">
        <p className="section-tag">Informations générales et statuts</p>
        <div className="card-grid cols-2" style={{ marginTop: 16 }}>
          <div className="dashboard-panel" style={{ borderTop: '3px solid var(--orange)', margin: 0 }}>
            <h3>Évaluation (estimation)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <StarRating count={player.currentAbilityStars} label="Niveau actuel" />
              <StarRating count={player.potentialAbilityStars} label="Potentiel" />
            </div>
            <p className="lede" style={{ fontSize: 12, marginTop: 14 }}>Estimation relative à l’ensemble des 25 Éléphants sélectionnés.</p>
          </div>
          <div className="dashboard-panel" style={{ borderTop: '3px solid var(--green)', margin: 0 }}>
            <h3>Postes préférentiels</h3>
            <PositionChips positions={player.preferredPositions} />
          </div>
        </div>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Statistiques (saison 2026-2027)</p>
        <div className="stats-highlight-grid" style={{ marginTop: 16 }}>
          <div className="stats-highlight-card tone-orange">
            <Trophy size={22} />
            <h3>Championnat</h3>
            <span className="stats-highlight-sub">{player.stats.club.championship.competition}</span>
            <div className="stats-highlight-numbers">
              <div><strong>{player.stats.club.championship.matches}</strong><span>Matchs</span></div>
              <div><strong>{player.stats.club.championship.goals}</strong><span>Buts</span></div>
              <div><strong>{player.stats.club.championship.assists}</strong><span>Passes D.</span></div>
            </div>
          </div>
          <div className="stats-highlight-card tone-green">
            <Award size={22} />
            <h3>Coupe nationale</h3>
            <span className="stats-highlight-sub">{player.stats.club.cup.competition}</span>
            <div className="stats-highlight-numbers">
              <div><strong>{player.stats.club.cup.matches}</strong><span>Matchs</span></div>
              <div><strong>{player.stats.club.cup.goals}</strong><span>Buts</span></div>
              <div><strong>{player.stats.club.cup.assists}</strong><span>Passes D.</span></div>
            </div>
          </div>
          <div className="stats-highlight-card tone-flag">
            <Flag size={22} />
            <h3>Sélection Éléphants</h3>
            <span className="stats-highlight-sub">Côte d’Ivoire · toutes compétitions</span>
            <div className="stats-highlight-numbers">
              <div><strong>{player.stats.national.caps}</strong><span>Sélections</span></div>
              <div><strong>{player.stats.national.goals}</strong><span>Buts</span></div>
              <div><strong>{player.stats.national.assists}</strong><span>Passes D.</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Attributs — notés sur 20 (estimation)</p>
        <div className="card-grid cols-3" style={{ marginTop: 16 }}>
          <AttributePanel title="Technique" attrs={player.attributes.technical} keyAttrs={keyAttrs} />
          <AttributePanel title="Mental" attrs={player.attributes.mental} keyAttrs={keyAttrs} />
          <AttributePanel title="Physique" attrs={player.attributes.physical} keyAttrs={keyAttrs} />
        </div>
      </section>

      <section className="page-section tight dark-section">
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Profil psychologique & rapport (estimation)</p>
        <div className="card-grid cols-3" style={{ marginTop: 16, alignItems: 'start' }}>
          <div className="info-tile"><strong>Personnalité</strong><p>{player.personality}</p></div>
          <div className="info-tile"><strong>Points forts</strong><p>{player.scoutReport.pros.join(' · ')}</p></div>
          <div className="info-tile"><strong>Axes de progression</strong><p>{player.scoutReport.cons.join(' · ')}</p></div>
        </div>
        <p className="lede" style={{ color: '#cfe0d6', marginTop: 20 }}>{player.scoutReport.summary}</p>
        {player.traits.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <b style={{ fontSize: 12, letterSpacing: '.06em', color: '#8fa79a', textTransform: 'uppercase' }}>Caractéristiques du joueur</b>
            <div className="chip-row" style={{ marginTop: 10 }}>
              {player.traits.map((t, i) => <span key={i} className="chip">{t}</span>)}
            </div>
          </div>
        )}
      </section>

      <section className="page-section tight">
        <p className="section-tag">Profil de performance (estimation)</p>
        <div className="radar-wrap" style={{ marginTop: 16 }}><PlayerRadar axes={radarAxes} /></div>
      </section>

      <section className="page-section tight">
        <Link href="/equipes-nationales/elephants" className="button-outline">Retour à l’effectif des Éléphants</Link>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
