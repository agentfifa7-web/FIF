import Link from 'next/link'
import { ArrowRight, Download } from 'lucide-react'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Design system — FIF', robots: { index: false } }

const colors = [
  { name: 'Vert profond', token: '--fif-green-900', hex: '#0b3d2a', use: 'Zones institutionnelles, pied de page, boutons secondaires' },
  { name: 'Vert FIF', token: '--fif-green-600', hex: '#087443', use: 'Liens, étiquettes, indicateurs' },
  { name: 'Vert clair', token: '--fif-green-50', hex: '#f1f8f4', use: 'Survols, encarts' },
  { name: 'Orange ivoirien', token: '--fif-orange', hex: '#f77f00', use: 'Actions principales (texte foncé, contraste 6,4:1)' },
  { name: 'Orange texte', token: '--fif-orange-text', hex: '#c25400', use: 'Texte orange sur fond blanc (4,6:1)' },
  { name: 'Blanc', token: '--gray-0', hex: '#ffffff', use: 'Fond dominant des pages de lecture' },
  { name: 'Gris très clair', token: '--gray-50', hex: '#f5f7f6', use: 'Fonds secondaires, en-têtes de page' },
  { name: 'Gris bordure', token: '--gray-200', hex: '#e2e7e4', use: 'Bordures et séparateurs' },
  { name: 'Gris texte', token: '--gray-500', hex: '#5f6b64', use: 'Texte secondaire (5,6:1)' },
  { name: 'Gris foncé', token: '--gray-900', hex: '#16201a', use: 'Texte principal' },
]

export default function DesignSystemPage() {
  return (
    <main>
      <PageHero eyebrow="Référence" title="Design system FIF" subtitle="Jetons, typographie, grille et composants partagés par toutes les pages du site. Fichier source : app/ds.css." breadcrumb={[{ label: 'Design system' }]} noPhotos />

      <section className="page-section">
        <h2>Couleurs</h2>
        <div className="card-grid cols-4" style={{ marginTop: 24 }}>
          {colors.map((c) => (
            <div key={c.token} className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ background: c.hex, height: 72, borderBottom: '1px solid var(--gray-200)' }} />
              <div style={{ padding: 16 }}>
                <strong style={{ display: 'block' }}>{c.name}</strong>
                <code style={{ fontSize: 13 }}>{c.token} · {c.hex}</code>
                <p className="muted" style={{ fontSize: 14, margin: '6px 0 0' }}>{c.use}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section section-alt">
        <h2>Typographie</h2>
        <p className="lede">Titres : Barlow Condensed 700. Texte : Barlow 400–600, 16 px minimum. Libellés : 12 px, capitales espacées.</p>
        <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-display)', lineHeight: 1 }}>Display</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-h1)', lineHeight: 1 }}>Titre 1</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-h2)' }}>Titre 2</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-h3)' }}>Titre 3</span>
          <span style={{ fontSize: 16 }}>Texte courant — le football ivoirien, du quartier à l’élite.</span>
          <span className="section-tag">Libellé de section</span>
        </div>
      </section>

      <section className="page-section">
        <h2>Boutons, liens et étiquettes</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 24, alignItems: 'center' }}>
          <button type="button" className="button button-primary">Action principale <ArrowRight /></button>
          <button type="button" className="button button-secondary">Action secondaire</button>
          <button type="button" className="button-outline"><Download size={16} /> Contour</button>
          <Link className="text-link" href="/design-system">Lien texte</Link>
          <span className="badge badge-green">Confirmé</span>
          <span className="badge badge-orange">Score à confirmer</span>
          <span className="badge badge-gray">À venir</span>
          <DemoBadge />
        </div>
      </section>

      <section className="page-section section-alt">
        <h2>Formulaires</h2>
        <form className="form-card" style={{ maxWidth: 520, marginTop: 24 }}>
          <div className="text-field"><label htmlFor="ds-name">Nom complet</label><input id="ds-name" placeholder="Prénom Nom" /></div>
          <div className="text-field"><label htmlFor="ds-sel">Compétition</label><select id="ds-sel"><option>Ligue 1</option><option>Ligue 2</option></select></div>
        </form>
      </section>

      <section className="page-section">
        <h2>Principes</h2>
        <div className="card-grid cols-2" style={{ marginTop: 24 }}>
          <div className="info-tile"><strong>Lisibilité</strong><p>Texte 16 px minimum, contraste AA, focus visible orange sur tous les éléments interactifs.</p></div>
          <div className="info-tile"><strong>Sobriété</strong><p>Fonds blancs, gris très clair en alternance, vert profond réservé aux zones institutionnelles.</p></div>
          <div className="info-tile"><strong>Données fiables</strong><p>Toute donnée non officielle porte l’étiquette « Données de démonstration » ; un score d’une seule source porte « Score à confirmer ».</p></div>
          <div className="info-tile"><strong>Mouvement</strong><p>Apparitions douces au défilement, désactivées si l’utilisateur préfère réduire les animations.</p></div>
        </div>
      </section>
    </main>
  )
}
