import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin } from 'lucide-react'
import type { RealFixtureEvent, RealFixtureSubstitution } from '@/lib/data/mock'
import { elephantsFixtures, getElephantsFixture, elephantsFlag, elephantsCallUp } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'
import { PlayerPhoto } from '@/components/site/PlayerPhoto'
import { TicketPurchase, LivePreview } from '@/components/site/ElephantsMatchTools'
import { MatchSheetBanner } from '@/components/site/MatchSheetBanner'
import { formatDate, formatDateLong } from '@/lib/format'

export function generateStaticParams() {
  return elephantsFixtures.map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const fixture = getElephantsFixture(slug)
  return { title: fixture ? `Côte d'Ivoire — ${fixture.opponent} — FIF Digital` : 'Match' }
}

const eventLabel: Record<RealFixtureEvent['type'], string> = {
  goal: 'BUT', penalty: 'BUT (PENALTY)', yellow: 'CARTON JAUNE', red: 'CARTON ROUGE',
}

function subLabel(s: RealFixtureSubstitution) {
  return s.playerOut ? `${s.playerOut} ➜ ${s.playerIn}` : `${s.playerIn} (entrée en jeu)`
}

export default async function ElephantsMatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const fixture = getElephantsFixture(slug)
  if (!fixture) notFound()
  const matchLabel = `Côte d'Ivoire vs ${fixture.opponent}`
  const result = fixture.result

  return (
    <main>
      <section className="page-hero tone-forest">
        <div className="page-hero-content">
          <div style={{ padding: '0 0 8px' }}>
            <Breadcrumb items={[{ label: 'Équipes nationales', href: '/equipes-nationales' }, { label: 'Éléphants', href: '/equipes-nationales/elephants' }, { label: matchLabel }]} />
          </div>
          <p className="eyebrow"><span /> {fixture.competition}{result ? ' · Terminé' : ''}</p>
          <h1 style={{ fontSize: 'clamp(28px,4vw,44px)' }}>{matchLabel}</h1>
          <div className="page-hero-meta">
            {result ? (
              <div><strong>{result?.civScore} - {result?.opponentScore}</strong><span>Score final</span></div>
            ) : (
              <div><strong>{fixture.time}</strong><span>Coup d’envoi</span></div>
            )}
            <div><strong>{formatDate(fixture.date)}</strong><span>Date</span></div>
            <div><strong>{fixture.venue}</strong><span>Stade</span></div>
          </div>
        </div>
      </section>

      <section className="page-section tight">
        <div className="next-card" style={{ maxWidth: 560 }}>
          <div className="next-card-top"><span>{fixture.competition.toUpperCase()}</span><span>{formatDateLong(fixture.date).toUpperCase()}</span></div>
          <div className="teams">
            <div className="team"><div className="crest ivory" style={{ fontSize: 32 }}>{elephantsFlag}</div><strong>Côte<br />d&apos;Ivoire</strong></div>
            {result ? (
              <div className="versus"><small>TERMINÉ</small><b style={{ fontSize: 28 }}>{result?.civScore} - {result?.opponentScore}</b><span><MapPin size={11} style={{ verticalAlign: 'middle' }} /> {fixture.venue}</span></div>
            ) : (
              <div className="versus"><small>{fixture.time}</small><b>VS</b><span><MapPin size={11} style={{ verticalAlign: 'middle' }} /> {fixture.venue}<br />{fixture.home ? 'Domicile' : 'Extérieur'}</span></div>
            )}
            <div className="team"><div className="crest red" style={{ fontSize: 32 }}>{fixture.opponentFlag}</div><strong>{fixture.opponent}</strong></div>
          </div>
        </div>
      </section>

      {result ? (
        <>
          <section className="page-section tight dark-section">
            <p className="section-tag" style={{ color: 'var(--orange)' }}>Résultat</p>
            <div className="timeline" style={{ marginTop: 16, maxWidth: 640 }}>
              {result.events.map((e, i) => (
                <div key={i}>
                  <b>{e.minute}&apos;</b>
                  <div>
                    <strong>{eventLabel[e.type]}</strong>
                    <span>{e.team === 'civ' ? 'Côte d’Ivoire' : fixture.opponent}{e.scorer ? ` · ${e.scorer}` : ''}</span>
                  </div>
                </div>
              ))}
              {!result.events.length && <p className="lede" style={{ color: '#cfe0d6' }}>Aucun but ni carton recensé pour ce match.</p>}
            </div>
            {result.cards && result.cards.length > 0 && (
              <div style={{ marginTop: 24, maxWidth: 640 }}>
                <b style={{ fontSize: 12, letterSpacing: '.06em', color: '#8fa79a', textTransform: 'uppercase' }}>Cartons</b>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                  {result.cards.map((c, i) => (
                    <span key={i} style={{ background: 'rgba(255,255,255,.08)', border: `1px solid ${c.type === 'yellow' ? '#e8b923' : '#e0433d'}`, borderRadius: 999, color: '#fff', fontSize: 12, fontWeight: 600, padding: '6px 12px' }}>
                      {c.type === 'yellow' ? '🟨' : '🟥'} {c.player} · {c.team === 'civ' ? 'CIV' : fixture.opponent}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {result.referee && (
              <p className="lede" style={{ color: '#8fa79a', marginTop: 24, fontSize: 12 }}>
                Arbitre : {result.referee.name}{result.referee.assistants.length ? ` · Assistants : ${result.referee.assistants.join(', ')}` : ''}{result.referee.fourthOfficial ? ` · 4e arbitre : ${result.referee.fourthOfficial}` : ''}
              </p>
            )}
          </section>

          {result.lineups && (
            <section className="page-section tight">
              <p className="section-tag">Compositions de départ</p>
              <div className="card-grid cols-2" style={{ marginTop: 16 }}>
                <div className="dashboard-panel" style={{ borderTop: '3px solid var(--orange)', margin: 0 }}>
                  <h3>Côte d&apos;Ivoire <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 13 }}>({result.lineups.civ.formation})</span></h3>
                  <ol style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, paddingLeft: 20 }}>
                    {result.lineups.civ.startingXI.map((name, i) => <li key={i} style={{ fontSize: 14 }}>{name}</li>)}
                  </ol>
                </div>
                <div className="dashboard-panel" style={{ borderTop: '3px solid var(--green)', margin: 0 }}>
                  <h3>{fixture.opponent} <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 13 }}>({result.lineups.opponent.formation})</span></h3>
                  <ol style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, paddingLeft: 20 }}>
                    {result.lineups.opponent.startingXI.map((name, i) => <li key={i} style={{ fontSize: 14 }}>{name}</li>)}
                  </ol>
                </div>
              </div>
            </section>
          )}

          {result.substitutions && result.substitutions.length > 0 && (
            <section className="page-section tight">
              <p className="section-tag">Remplacements</p>
              <div className="card-grid cols-2" style={{ marginTop: 16 }}>
                <div className="info-tile">
                  <strong>Côte d&apos;Ivoire</strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                    {result.substitutions.filter((s) => s.team === 'civ').map((s, i) => (
                      <span key={i} style={{ fontSize: 13 }}>{subLabel(s)}{s.minute ? ` · ${s.minute}'` : ''}</span>
                    ))}
                  </div>
                </div>
                <div className="info-tile">
                  <strong>{fixture.opponent}</strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                    {result.substitutions.filter((s) => s.team === 'opponent').map((s, i) => (
                      <span key={i} style={{ fontSize: 13 }}>{subLabel(s)}{s.minute ? ` · ${s.minute}'` : ''}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        <>
          <section className="page-section tight">
            <p className="section-tag">Billetterie</p>
            <div className="dashboard-panel" style={{ maxWidth: 560 }}>
              <h3>Réserver des billets</h3>
              <TicketPurchase categories={fixture.ticketCategories} matchLabel={matchLabel} />
            </div>
          </section>

          <section className="page-section tight dark-section">
            <p className="section-tag" style={{ color: 'var(--orange)' }}>Suivre le match</p>
            <div style={{ marginTop: 16, maxWidth: 640 }}>
              <LivePreview isUpcoming />
            </div>
          </section>

          <section className="page-section tight">
            <p className="section-tag">Feuille de match</p>
            <div style={{ marginTop: 16, maxWidth: 640 }}>
              <MatchSheetBanner
                matchId={fixture.slug}
                homeName={fixture.home ? 'Côte d’Ivoire' : fixture.opponent}
                awayName={fixture.home ? fixture.opponent : 'Côte d’Ivoire'}
                editHref={`/admin/feuille-de-match/elephants/${fixture.slug}`}
              />
            </div>
          </section>
        </>
      )}

      <section className="page-section tight">
        <div className="page-section-head">
          <div><p className="section-tag">Sélection Éléphants</p><h2 style={{ fontSize: 24 }}>Joueurs disponibles pour cette fenêtre</h2></div>
          <Link href="/equipes-nationales/elephants" className="text-link">Effectif complet</Link>
        </div>
        <div className="card-grid" style={{ marginTop: 16 }}>
          {elephantsCallUp.slice(0, 8).map((p) => (
            <Link key={p.slug} href={`/equipes-nationales/elephants/${p.slug}`} className="entity-card player-card">
              <span className="avatar-wrap"><PlayerPhoto name={p.name} photoUrl={p.photoUrl} size={44} background="var(--forest)" /></span>
              <div><strong>{p.name}</strong><span>{p.position} · {p.club}</span></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
