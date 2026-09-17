import { notFound } from 'next/navigation'
import Link from 'next/link'
import { clubs, competitions, getCompetition } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { ClubCard, CompetitionCard } from '@/components/site/cards'
import { DemoBadge } from '@/components/site/DemoBadge'

interface PracticeConfig {
  title: string
  eyebrow: string
  subtitle: string
  clubFilter?: (c: (typeof clubs)[number]) => boolean
  competitionIds?: string[]
  highlights: string[]
}

const PRACTICES: Record<string, PracticeConfig> = {
  amateur: {
    title: 'Football amateur',
    eyebrow: 'Univers Football',
    subtitle: 'Clubs, compétitions régionales, jeunes et initiatives locales : le socle du football ivoirien.',
    highlights: ['Trouver un club amateur près de chez vous', 'S’engager dans une compétition de district ou de ligue régionale', 'Accéder aux formations d’éducateurs de proximité'],
  },
  feminin: {
    title: 'Football féminin',
    eyebrow: 'Univers Football',
    subtitle: 'Éléphantes, championnat national féminin, clubs, joueuses, jeunes filles et arbitrage féminin.',
    clubFilter: (c) => c.category === 'Féminin',
    competitionIds: ['comp-fem', 'comp-coupe-fem'],
    highlights: ['Suivre les Éléphantes et la sélection A', 'Le championnat national féminin, club par club', 'Programmes de développement du football féminin'],
  },
  jeunes: {
    title: 'Football des jeunes',
    eyebrow: 'Univers Football',
    subtitle: 'De U6 à U23 : détection, académies, compétitions, stages et sélections.',
    clubFilter: (c) => c.category === 'Jeunes',
    competitionIds: ['comp-u20', 'comp-u17'],
    highlights: ['Championnats U20 et U17', 'Académies et centres de formation agréés', 'Talent Hub — portail de détection'],
  },
  futsal: {
    title: 'Futsal',
    eyebrow: 'Univers Football',
    subtitle: 'Équipes nationales, championnat Futsal Élite, clubs, joueurs et résultats.',
    clubFilter: (c) => c.category === 'Futsal',
    competitionIds: ['comp-futsal'],
    highlights: ['Futsal Élite : classement et calendrier', 'Éléphants Futsal — actualités et sélection', 'Clubs et salles homologuées'],
  },
  'beach-soccer': {
    title: 'Beach Soccer',
    eyebrow: 'Univers Football',
    subtitle: 'Beach Soccer National, sélection nationale et calendrier des tournois.',
    competitionIds: ['comp-beach'],
    highlights: ['Beach Soccer National — tournoi et classement', 'Éléphants Beach Soccer', 'Calendrier des plages homologuées'],
  },
  loisir: {
    title: 'Football loisir',
    eyebrow: 'Univers Football',
    subtitle: 'Pratiquer sans contrainte de compétition : sections loisir intégrées aux clubs ou dédiées.',
    highlights: ['Trouver une section loisir', 'Créer une section au sein d’un club existant', 'Tournois et rencontres amicales inter-entreprises'],
  },
  scolaire: {
    title: 'Football scolaire',
    eyebrow: 'Univers Football',
    subtitle: 'Écoles, tournois inter-établissements, programmes éducatifs et inscriptions.',
    highlights: ['Tournois scolaires régionaux et nationaux', 'Programmes éducatifs fédéraux pour les établissements', 'Inscription des écoles partenaires'],
  },
  efootball: {
    title: 'E-football',
    eyebrow: 'Nouvelles pratiques',
    subtitle: 'Compétitions e-football, joueurs, clubs et tournois officiels FIF.',
    highlights: ['Circuit de tournois e-football officiels', 'Classement des joueurs et clubs e-football', 'Inscriptions aux prochaines compétitions'],
  },
}

export function generateStaticParams() {
  return Object.keys(PRACTICES).map((pratique) => ({ pratique }))
}

export async function generateMetadata({ params }: { params: Promise<{ pratique: string }> }) {
  const { pratique } = await params
  const config = PRACTICES[pratique]
  return { title: config ? `${config.title} — FIF Digital` : 'Football' }
}

export default async function PracticePage({ params }: { params: Promise<{ pratique: string }> }) {
  const { pratique } = await params
  const config = PRACTICES[pratique]
  if (!config) notFound()

  const relatedClubs = config.clubFilter ? clubs.filter(config.clubFilter).slice(0, 8) : []
  const relatedCompetitions = (config.competitionIds ?? []).map((id) => getCompetition(competitions.find((c) => c.id === id)?.slug ?? '')).filter(Boolean)

  return (
    <main>
      <PageHero
        eyebrow={config.eyebrow}
        title={config.title}
        subtitle={config.subtitle}
        breadcrumb={[{ label: 'Football' }, { label: config.title }]}
      />

      <section className="page-section tight">
        <div className="info-tiles">
          {config.highlights.map((h) => <div className="info-tile" key={h}><strong>{h}</strong></div>)}
        </div>
      </section>

      {relatedCompetitions.length > 0 && (
        <section className="page-section tight">
          <p className="section-tag">Compétitions</p>
          <div className="card-grid" style={{ marginTop: 16 }}>
            {relatedCompetitions.map((c) => c && <CompetitionCard key={c.id} competition={c} clubCount={c.clubIds.length} />)}
          </div>
        </section>
      )}

      {relatedClubs.length > 0 && (
        <section className="page-section tight">
          <p className="section-tag">Clubs</p>
          <div className="card-grid" style={{ marginTop: 16 }}>
            {relatedClubs.map((c) => <ClubCard key={c.id} club={c} />)}
          </div>
          <Link href="/clubs" className="text-link" style={{ marginTop: 16, display: 'inline-flex' }}>Voir tous les clubs →</Link>
        </section>
      )}

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
