import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarDays, MapPin } from 'lucide-react'
import type { RealFixtureEvent, RealFixtureSubstitution } from '@/lib/data/mock'
import { elephantsFixtures, getElephantsFixture, elephantsFlag, elephantsCallUp } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { PlayerPhoto } from '@/components/site/PlayerPhoto'
import { LivePreview } from '@/components/site/ElephantsMatchTools'
import { ticketEvents } from '@/lib/data/tickets'
import { MatchSheetBanner } from '@/components/site/MatchSheetBanner'
import { formatDate, formatDateLong } from '@/lib/format'
import { loadCms } from '@/lib/cms/server'

export async function generateStaticParams() {
  await loadCms()
  return elephantsFixtures.map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  await loadCms()
  const { slug } = await params
  const fixture = getElephantsFixture(slug)
  return { title: fixture ? `Côte d'Ivoire — ${fixture.opponent} — FIF` : 'Match' }
}

const eventLabel: Record<RealFixtureEvent['type'], string> = {
  goal: 'BUT', penalty: 'BUT (PENALTY)', yellow: 'CARTON JAUNE', red: 'CARTON ROUGE',
}

function subLabel(s: RealFixtureSubstitution) {
  return s.playerOut ? `${s.playerOut} ➜ ${s.playerIn}` : `${s.playerIn} (entrée en jeu)`
}

export default async function ElephantsMatchPage({ params }: { params: Promise<{ slug: string }> }) {
  await loadCms()
  const { slug } = await params
  const fixture = getElephantsFixture(slug)
  if (!fixture) notFound()
  const matchLabel = `Côte d'Ivoire vs ${fixture.opponent}`
  const result = fixture.result

  return (
    <main>
      <div className="container" style={{ paddingTop: 20 }}>
        <Breadcrumb items={[{ label: 'Équipes nationales', href: '/equipes-nationales' }, { label: 'Éléphants', href: '/equipes-nationales/elephants' }, { label: matchLabel }]} />
      </div>
      <section className="sb" aria-label="Tableau de score">
        <p className="sb-comp">{fixture.competition}</p>
        <div className="sb-teams">
          <div className="sb-team"><span className="sb-flag">{elephantsFlag}</span><strong>Côte d’Ivoire</strong></div>
          <div className="sb-score">
            {result ? <b>{result.civScore} – {result.opponentScore}</b> : <b className="sb-vs">{fixture.time}</b>}
            <span>{result ? 'Terminé' : 'Coup d’envoi'}</span>
          </div>
          <div className="sb-team"><span className="sb-flag">{fixture.opponentFlag}</span><strong>{fixture.opponent}</strong></div>
        </div>
        <h1 className="sr-only">{matchLabel}</h1>
        <div className="sb-meta">
          <span><CalendarDays size={16} aria-hidden /> {formatDateLong(fixture.date)}</span>
          <span><MapPin size={16} aria-hidden /> {fixture.venue} · {fixture.home ? 'Domicile' : 'Extérieur'}</span>
        </div>
      </section>

      {result ? (
        <>
          <section className="page-section tight dark-section">
            <h2>Faits de match</h2>
            <div className="timeline" style={{ marginTop: 16, maxWidth: 640 }}>
              {result.events.map((e, i) => (
                <div key={i}>
                  <b>{e.minute}{e.stoppage ? `+${e.stoppage}` : ''}&apos;</b>
                  <div>
                    <strong>{eventLabel[e.type]}</strong>
                    <span>{e.team === 'civ' ? 'Côte d’Ivoire' : fixture.opponent}{e.scorer ? ` · ${e.scorer}` : ''}</span>
                  </div>
                </div>
              ))}
              {!result.events.length && <p className="lede">Aucun but ni carton recensé pour ce match.</p>}
            </div>
            {result.cards && result.cards.length > 0 && (
              <div style={{ marginTop: 24, maxWidth: 640 }}>
                <h3 style={{ fontSize: 18, margin: 0 }}>Cartons</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                  {result.cards.map((c, i) => (
                    <span key={i} className={`card-chip ${c.type}`}>
                      {c.type === 'yellow' ? '🟨' : '🟥'} {c.player} · {c.team === 'civ' ? 'CIV' : fixture.opponent}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {result.referee && (
              <p className="muted" style={{ marginTop: 24, fontSize: 14 }}>
                Arbitre : {result.referee.name}{result.referee.assistants.length ? ` · Assistants : ${result.referee.assistants.join(', ')}` : ''}{result.referee.fourthOfficial ? ` · 4e arbitre : ${result.referee.fourthOfficial}` : ''}
              </p>
            )}
          </section>

          {result.lineups && (
            <section className="page-section tight">
              <h2>Compositions de départ</h2>
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
              <h3>Acheter des billets</h3>
              {(() => {
                const ev = ticketEvents.find((e) => e.matchHref?.endsWith(`/${fixture.slug}`))
                if (!ev) return <p className="lede" style={{ fontSize: 14 }}>La billetterie de ce match n’est pas encore ouverte.</p>
                const min = Math.min(...ev.tiers.map((t) => t.price))
                return (
                  <>
                    <p className="lede" style={{ fontSize: 14 }}>Billets officiels dès {min.toLocaleString('fr-FR')} FCFA : plan du stade, paiement Mobile Money ou carte, billet électronique avec QR code.</p>
                    <Link href={`/billetterie/${ev.slug}`} className="button button-primary">Choisir mes places — {matchLabel}</Link>
                  </>
                )
              })()}
            </div>
          </section>

          <section className="page-section tight dark-section">
            <p className="section-tag" style={{ color: 'var(--fif-orange-text)' }}>Suivre le match</p>
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
    </main>
  )
}
