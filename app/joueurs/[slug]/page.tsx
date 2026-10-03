import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Award, Flag, Info, QrCode, Trophy } from 'lucide-react'
import { players, getPlayer, getClubById, nationalTeams, KEY_ATTRS_BY_POSITION } from '@/lib/data/mock'
import { Breadcrumb, HeroCarousel } from '@/components/site/PageHero'
import { ClubCrest } from '@/components/site/cards'
import { StarRating, PositionChips, AttributePanel } from '@/components/site/PlayerAttributes'
import { PlayerRadar } from '@/components/site/PlayerRadar'
import { radarAxesFor } from '@/lib/attributes'
import { age, formatDate } from '@/lib/format'
import { loadCms } from '@/lib/cms/server'

export async function generateStaticParams() {
  await loadCms()
  return players.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  await loadCms()
  const { slug } = await params
  const player = getPlayer(slug)
  return { title: player ? `${player.name} — FIF Digital` : 'Joueur' }
}

export default async function PlayerPage({ params }: { params: Promise<{ slug: string }> }) {
  await loadCms()
  const { slug } = await params
  const player = getPlayer(slug)
  if (!player) notFound()
  const club = getClubById(player.clubId)
  const keyAttrs = KEY_ATTRS_BY_POSITION[player.position] ?? []
  const radarAxes = radarAxesFor(player.attributes)
  const seasonStats = [...player.seasonStats].reverse()

  return (
    <main>
      <section className="page-hero tone-forest">
        <HeroCarousel seed={player.name} />
        <div className="page-hero-content">
          <div className="breadcrumb"><Link href="/">Accueil</Link><span>›</span><Link href="/joueurs">Joueurs</Link><span>›</span><b>{player.name}</b></div>
          <div style={{ alignItems: 'center', display: 'flex', gap: 24, marginTop: 8 }}>
            <span className="avatar-wrap" style={{ height: 84, width: 84 }}>
              <span className="avatar" style={{ background: club?.colors[0], fontSize: 22, height: 84, width: 84 }}>{player.name.split(' ').map((n) => n[0]).join('')}</span>
              {club && <span className="avatar-crest-badge"><ClubCrest club={club} size={28} /></span>}
            </span>
            <div>
              <p className="eyebrow"><span /> {player.squadNumber ? `N°${player.squadNumber} · ` : ''}{player.positionDetail ?? player.position} · {club?.name}</p>
              <h1 style={{ fontSize: 'clamp(30px,4vw,48px)' }}>{player.name}</h1>
            </div>
          </div>
          <div className="page-hero-meta">
            {player.birthdate && <div><strong>{age(player.birthdate)}</strong><span>Âge</span></div>}
            <div><strong>{player.stats.matches}</strong><span>Matchs joués</span></div>
            <div><strong>{player.stats.goals}</strong><span>Buts</span></div>
            <div><strong>{player.stats.assists}</strong><span>Passes décisives</span></div>
          </div>
        </div>
      </section>

      <section className="page-section tight" style={{ paddingBottom: 0 }}>
        <p className="press-source-note"><Info size={13} /> {player.realMeasures
          ? <>Nom, poste, numéro, taille, poids et date de naissance réels — effectif officiel {club?.name}, saison 2026-2027.</>
          : <>Nom, poste et numéro de maillot réels — effectif officiel {club?.name}, saison 2026-2027.</>}
          {' '}Statistiques calculées à partir des matchs réels de Ligue 1 (buts, passes décisives, cartons, compositions lorsqu’elles sont publiées). Attributs et profil ci-dessous : estimations indicatives, non officielles.</p>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Informations générales</p>
        <div className="card-grid cols-3" style={{ marginTop: 16 }}>
          <div className="dashboard-panel" style={{ borderTop: '3px solid var(--orange)', margin: 0 }}>
            <h3>Identité</h3>
            <div className="dashboard-list">
              {player.squadNumber && <div><small>Numéro de maillot</small><b>N°{player.squadNumber}</b></div>}
              <div><small>Poste</small><b>{player.positionDetail ?? player.position}</b></div>
              <div><small>Club</small><b>{club?.name}</b></div>
              {player.birthdate && <div><small>Date de naissance</small><b>{formatDate(player.birthdate)}</b></div>}
              {player.realMeasures && <div><small>Taille</small><b>{player.height} cm</b></div>}
              {player.realMeasures && <div><small>Poids</small><b>{player.weight} kg</b></div>}
            </div>
          </div>
          <div className="dashboard-panel" style={{ borderTop: '3px solid var(--green)', margin: 0 }}>
            <h3>Évaluation (estimation)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <StarRating count={player.currentAbilityStars} label="Niveau actuel" />
              <StarRating count={player.potentialAbilityStars} label="Potentiel" />
            </div>
            <p className="lede" style={{ fontSize: 12, marginTop: 14 }}>Estimation relative à l’effectif de {club?.name}.</p>
          </div>
          <div className="dashboard-panel" style={{ borderTop: '3px solid var(--orange)', margin: 0 }}>
            <h3>Postes préférentiels</h3>
            <PositionChips positions={player.preferredPositions} />
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
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Profil psychologique & rapports (estimation)</p>
        <div className="card-grid cols-3" style={{ marginTop: 16, alignItems: 'start' }}>
          <div className="info-tile"><strong>Personnalité</strong><p>{player.personality}</p></div>
          <div className="info-tile">
            <strong>Points forts</strong>
            <p>{player.scoutReport.pros.join(' · ')}</p>
          </div>
          <div className="info-tile">
            <strong>Axes de progression</strong>
            <p>{player.scoutReport.cons.join(' · ')}</p>
          </div>
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
        <p className="section-tag">Vue d’ensemble des performances</p>
        <div className="card-grid cols-2" style={{ alignItems: 'start', marginTop: 16 }}>
          <div className="radar-wrap"><PlayerRadar axes={radarAxes} /></div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th className="align-left">SAISON</th><th className="align-left">COMPÉTITION</th><th>MJ</th><th>BUTS</th><th>PD</th></tr></thead>
              <tbody>
                {seasonStats.map((s, i) => (
                  <tr key={i}>
                    <td className="align-left">{s.season}</td>
                    <td className="align-left">{s.competition}</td>
                    <td>{s.matches}</td>
                    <td>{s.goals}</td>
                    <td>{s.assists}</td>
                  </tr>
                ))}
                {!seasonStats.length && <tr><td colSpan={5}>Aucun match officiel recensé pour l’instant.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Statistiques</p>
        <div className="stats-highlight-grid" style={{ marginTop: 16 }}>
          <div className="stats-highlight-card tone-orange">
            <Trophy size={22} />
            <h3>Saison en cours</h3>
            <span className="stats-highlight-sub">{club?.name}</span>
            <div className="stats-highlight-numbers">
              <div><strong>{player.stats.matches}</strong><span>Matchs</span></div>
              <div><strong>{player.stats.goals}</strong><span>Buts</span></div>
              <div><strong>{player.stats.assists}</strong><span>Passes D.</span></div>
            </div>
          </div>
          <div className="stats-highlight-card tone-green">
            <Award size={22} />
            <h3>Discipline & temps de jeu</h3>
            <span className="stats-highlight-sub">Saison en cours</span>
            <div className="stats-highlight-numbers">
              <div><strong>{player.stats.minutes > 0 ? player.stats.minutes : '—'}</strong><span>Minutes</span></div>
              <div><strong>{player.stats.yellow}</strong><span>Jaunes</span></div>
              <div><strong>{player.stats.red}</strong><span>Rouges</span></div>
            </div>
          </div>
          {player.nationalSelections.length > 0 && (
            <div className="stats-highlight-card tone-flag">
              <Flag size={22} />
              <h3>Sélection nationale</h3>
              <span className="stats-highlight-sub">Toutes compétitions</span>
              <div className="stats-highlight-numbers">
                <div><strong>{player.nationalSelections.reduce((a, s) => a + s.caps, 0)}</strong><span>Sélections</span></div>
                <div><strong>{player.nationalSelections.reduce((a, s) => a + s.goals, 0)}</strong><span>Buts</span></div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="page-section tight">
        <div className="dashboard-panel" style={{ maxWidth: 520 }}>
          <h3>Identité fédérale — FIF ID</h3>
          <div className="dashboard-list">
            <div><small>FIF ID</small><b>{player.fifId}</b></div>
            <div><small>Club</small><b>{club?.name}</b></div>
          </div>
          <Link href={`/verifier/${player.fifId}`} className="button-outline" style={{ marginTop: 16 }}><QrCode size={14} /> Vérifier ce FIF ID</Link>
        </div>
      </section>

      {player.nationalSelections.length > 0 && (
        <section className="page-section tight">
          <p className="section-tag">Sélections nationales</p>
          <div className="table-wrap" style={{ marginTop: 16 }}>
            <table className="data-table">
              <thead><tr><th className="align-left">ÉQUIPE</th><th>SÉLECTIONS</th><th>BUTS</th></tr></thead>
              <tbody>
                {player.nationalSelections.map((s, i) => {
                  const team = nationalTeams.find((t) => t.id === s.teamId)
                  return (
                    <tr key={i}>
                      <td className="align-left">{team ? <Link href={`/equipes-nationales/${team.slug}`}>{team.name}</Link> : s.teamId}</td>
                      <td>{s.caps}</td>
                      <td>{s.goals}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  )
}
