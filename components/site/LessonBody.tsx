import { Lightbulb, ListChecks, MapPin, Monitor, Target } from 'lucide-react'
import { readingMinutes, type LessonContent } from '@/lib/data/academy-content'

/** Affichage du contenu d'une leçon (utilisable côté serveur ou client). */
/** `bare` masque l'en-tête quand le titre est déjà affiché (ex. accordéon du programme). */
export function LessonBody({ content, title, kicker, bare }: { content: LessonContent; title: string; kicker?: string; bare?: boolean }) {
  return (
    <article className="lesson-body">
      {!bare && <header>
        {kicker && <span className="lesson-kicker">{kicker}</span>}
        <h2>{title}</h2>
        <div className="lesson-tags">
          {content.inPerson
            ? <span className="lesson-tag is-onsite"><MapPin size={12} /> En présentiel</span>
            : <span className="lesson-tag"><Monitor size={12} /> En ligne · {readingMinutes(content)} min</span>}
        </div>
      </header>}
      <p className="lesson-intro">{content.intro}</p>
      <section>
        <h3><ListChecks size={16} /> {content.inPerson ? 'Déroulement' : 'Points clés'}</h3>
        <ol className="lesson-points">{content.points.map((p) => <li key={p}>{p}</li>)}</ol>
      </section>
      <section className="lesson-practice">
        <h3><Target size={16} /> {content.inPerson ? 'Modalités' : 'Mise en pratique'}</h3>
        <p>{content.practice}</p>
      </section>
      {content.takeaway && (
        <section className="lesson-takeaway">
          <h3><Lightbulb size={16} /> À retenir</h3>
          <p>{content.takeaway}</p>
        </section>
      )}
    </article>
  )
}
