import Link from 'next/link'
import { Award, BookOpenCheck, CreditCard, GraduationCap, Info, Landmark, QrCode, ShieldCheck, UserRound } from 'lucide-react'
import { academyPrograms, ACADEMY_TRACKS } from '@/lib/data/academy'
import { PageHero } from '@/components/site/PageHero'
import { AcademyCatalog, ProgramCard } from '@/components/site/AcademyCatalog'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'FIF Academy — Formations diplômantes du football' }

const FAQ = [
  ['Qui délivre les diplômes ?', 'Les licences CAF D, C, B et A sont délivrées par la FIF, via sa Direction technique nationale, dans le cadre de la Convention CAF des entraîneurs. Les certificats et licences fédérales sont délivrés par la FIF. Les diplômes universitaires seront co-délivrés avec une université partenaire. Pour l’examen d’agent, la FIF prépare et la FIFA délivre la licence.'],
  ['Comment se déroule une formation ?', 'Inscription et paiement en ligne avec votre FIF ID, cours en ligne et/ou en présentiel selon le format, évaluation pratique par un instructeur pour les métiers de terrain, examen final, puis diplôme numéroté et vérifiable par QR code.'],
  ['Peut-on payer en plusieurs fois ?', 'Oui, les formations longues peuvent être réglées en 3 versements sans frais. Le diplôme est délivré une fois la formation entièrement réglée.'],
  ['Comment vérifier un diplôme ?', 'Chaque diplôme porte un numéro unique et un QR code. Un club ou un employeur peut le vérifier en ligne sur la page « Vérifier un diplôme ».'],
  ['Les tarifs et dates sont-ils définitifs ?', 'Les tarifs sont indicatifs et le calendrier est prévisionnel : ils sont validés et publiés par la FIF pour chaque session.'],
]

export default function AcademyPage() {
  const highlights = academyPrograms.filter((p) => p.highlight)
  return (
    <main>
      <PageHero
        eyebrow="FIF Academy"
        title="Former tous les métiers du football"
        subtitle="Entraîneurs, éducateurs, arbitres, dirigeants, recruteurs, préparateurs, médecins, commissaires, agents : des formations payantes et diplômantes, reconnues par la FIF, conformes à la Convention CAF des entraîneurs, et des diplômes universitaires en partenariat."
        breadcrumb={[{ label: 'FIF Academy' }]}
        meta={[
          { value: String(academyPrograms.length), label: 'Formations diplômantes' },
          { value: String(ACADEMY_TRACKS.length), label: 'Filières métiers' },
          { value: '4', label: 'Niveaux de licence CAF' },
        ]}
      />

      <section className="page-section tight">
        <div className="acc-grid">
          <div className="acc-tile"><span className="acc-badge acc-caf is-large">Licence CAF</span><p>Licences D, C, B et A de la Convention CAF des entraîneurs, délivrées par la FIF via sa Direction technique nationale. La Licence Pro est organisée par la CAF.</p></div>
          <div className="acc-tile"><span className="acc-badge acc-fif is-large">Certifié FIF</span><p>Licences fédérales et certificats FIF : arbitrage, éducateurs, dirigeants, recrutement, santé, sécurité, commissaires.</p></div>
          <div className="acc-tile"><span className="acc-badge acc-uni is-large">Diplôme universitaire</span><p>Management du football, préparation physique, médecine du football : DU co-délivrés avec une université ivoirienne (convention à conclure).</p></div>
          <div className="acc-tile"><span className="acc-badge acc-fifa is-large">Prépa FIFA</span><p>Préparation à l’examen FIFA d’agent de football. La FIF prépare, la FIFA organise l’examen et délivre la licence.</p></div>
        </div>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Formations phares</p>
        <div className="card-grid" style={{ marginTop: 16 }}>{highlights.map((p) => <ProgramCard key={p.slug} p={p} />)}</div>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Catalogue complet</p>
        <div style={{ marginTop: 16 }}><AcademyCatalog programs={academyPrograms} /></div>
      </section>

      <section className="page-section tight">
        <div className="ev-mytickets">
          <GraduationCap size={22} />
          <div><strong>Déjà inscrit(e) ?</strong><span>Suivez vos cours, passez votre examen et téléchargez vos diplômes.</span></div>
          <Link href="/formation/mes-formations" className="button-outline">Mes formations</Link>
          <Link href="/formation/diplome" className="button-outline">Vérifier un diplôme</Link>
        </div>
      </section>

      <section className="page-section tight dark-section">
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Votre parcours</p>
        <div className="info-tiles" style={{ marginTop: 16 }}>
          <div className="info-tile"><UserRound /><strong>1. FIF ID</strong><p>Inscription avec votre FIF ID : votre diplôme porte votre identité vérifiée.</p></div>
          <div className="info-tile"><CreditCard /><strong>2. Paiement</strong><p>Mobile Money ou carte, comptant ou en 3 fois pour les formations longues.</p></div>
          <div className="info-tile"><BookOpenCheck /><strong>3. Formation</strong><p>Cours en ligne et présentiel, évaluations pratiques avec un instructeur.</p></div>
          <div className="info-tile"><Award /><strong>4. Examen et diplôme</strong><p>Examen final, diplôme numéroté avec QR code, vérifiable par les clubs.</p></div>
        </div>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Questions fréquentes</p>
        <div className="faq-list">{FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
        <p className="press-source-note" style={{ marginTop: 18 }}><Info size={13} /> La FIF organise déjà, via sa Direction technique nationale, les licences CAF D, C et A (22 entraîneurs admis à la Licence A CAF en août 2026) et les licences fédérales A, B et C. Sources : <a href="https://www.koaci.com/article/2026/08/29/cote-divoire/sport/cote-divoire-formation-des-entraineurs-22-stagiaires-dont-ndri-koffi-romaric-admis-a-la-licence-a-caf_199982.html" target="_blank" rel="noopener noreferrer">Koaci</a> · <a href="https://www.aip.ci/cote-divoire-aip-trente-deux-techniciens-decrochent-la-licence-d-de-la-caf-pour-renforcer-lencadrement-du-football-a-abengourou/" target="_blank" rel="noopener noreferrer">AIP</a> · <a href="https://mondialsport.ci/la-fif-relance-les-licences-a-b-et-c-federales-19440.sport" target="_blank" rel="noopener noreferrer">Mondial Sport</a>.</p>
        <p className="press-source-note"><Landmark size={13} /> Tarifs indicatifs, calendrier prévisionnel et partenariats universitaires à valider par la FIF. <ShieldCheck size={13} /> <QrCode size={13} /> Diplômes vérifiables en ligne.</p>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
