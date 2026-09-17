'use client'

import { Mail, MapPin, Phone } from 'lucide-react'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

const faqs = [
  { q: 'Comment obtenir une licence ?', a: 'Rendez-vous sur la page Licences, ou passez par votre club qui initie la demande depuis son Portail Clubs. Le suivi se fait ensuite dans votre espace Mon FIF.' },
  { q: 'Comment trouver un club près de chez moi ?', a: 'Utilisez la page Clubs avec les filtres ville, catégorie et genre, ou la vue Carte pour un repérage géographique.' },
  { q: 'Comment vérifier un FIF ID ?', a: 'Rendez-vous sur /verifier, saisissez l’identifiant : nom, type et statut s’affichent sans donnée privée.' },
  { q: 'Comment acheter un billet de match ?', a: 'La page Billetterie liste les événements ouverts à la vente avec leurs catégories de places et tarifs.' },
  { q: 'Comment devenir arbitre ?', a: 'Consultez la page Arbitrage puis inscrivez-vous à une session de formation initiale sur la page Formation.' },
]

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact Center"
        title="Contact & FAQ"
        subtitle="Une question sur les licences, les compétitions, la billetterie ou vos accès ? Notre centre de support est là pour vous aider."
        breadcrumb={[{ label: 'Contact' }]}
      />

      <section className="page-section tight">
        <div className="card-grid cols-2">
          <div>
            <p className="section-tag">Questions fréquentes</p>
            <div className="faq-list">
              {faqs.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
          <div>
            <p className="section-tag">Nous contacter</p>
            <form className="form-card" style={{ marginTop: 16, marginLeft: 0, maxWidth: 460 }} onSubmit={(e) => e.preventDefault()}>
              <div className="text-field"><label htmlFor="subject">Sujet</label><input id="subject" required /></div>
              <div className="text-field"><label htmlFor="email2">Email</label><input id="email2" type="email" required /></div>
              <div className="text-field"><label htmlFor="message">Message</label><textarea id="message" rows={4} required /></div>
              <div className="form-actions"><button type="submit" className="button button-primary" style={{ justifyContent: 'center' }}>Envoyer un ticket de support</button></div>
            </form>
            <div className="chip-row" style={{ marginTop: 24 }}>
              <span className="chip"><Mail size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />contact@fif.ci</span>
              <span className="chip"><Phone size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />+225 27 20 00 00 00</span>
              <span className="chip"><MapPin size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />Abidjan, Côte d’Ivoire</span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}
