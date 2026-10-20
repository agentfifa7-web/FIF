/** Étapes numérotées d'une démarche. */
export function ServiceSteps({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <ol className="svc-steps">
      {steps.map((s, i) => (
        <li key={s.title}><span aria-hidden>{i + 1}</span><div><strong>{s.title}</strong><p>{s.text}</p></div></li>
      ))}
    </ol>
  )
}
