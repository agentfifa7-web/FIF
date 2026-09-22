const SIZE = 340
const CENTER = SIZE / 2
const RADIUS = 100
const MAX = 20
const RINGS = [0.25, 0.5, 0.75, 1]
const LABEL_FRACTION = 1.28

function pointAt(index: number, total: number, fraction: number) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / total
  return { x: CENTER + RADIUS * fraction * Math.cos(angle), y: CENTER + RADIUS * fraction * Math.sin(angle) }
}

export function PlayerRadar({ axes }: { axes: { axis: string; value: number }[] }) {
  const total = axes.length
  const polygon = axes.map((a, i) => pointAt(i, total, Math.min(1, a.value / MAX))).map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Profil de performance du joueur, huit axes" style={{ width: '100%', maxWidth: 340, height: 'auto' }}>
      {RINGS.map((r, i) => (
        <polygon
          key={i}
          points={axes.map((_, ai) => { const p = pointAt(ai, total, r); return `${p.x},${p.y}` }).join(' ')}
          fill="none"
          stroke="var(--line)"
          strokeWidth={1}
        />
      ))}
      {axes.map((a, i) => {
        const outer = pointAt(i, total, 1)
        return <line key={i} x1={CENTER} y1={CENTER} x2={outer.x} y2={outer.y} stroke="var(--line)" strokeWidth={1} />
      })}
      <polygon points={polygon} fill="var(--green)" fillOpacity={0.28} stroke="var(--green)" strokeWidth={2} strokeLinejoin="round" />
      {axes.map((a, i) => {
        const p = pointAt(i, total, Math.min(1, a.value / MAX))
        return (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill="var(--green)" stroke="#fff" strokeWidth={1.5}>
            <title>{`${a.axis} : ${a.value.toFixed(1)} / 20`}</title>
          </circle>
        )
      })}
      {axes.map((a, i) => {
        const label = pointAt(i, total, LABEL_FRACTION)
        const anchor = Math.abs(label.x - CENTER) < 8 ? 'middle' : label.x > CENTER ? 'start' : 'end'
        return (
          <text key={i} x={label.x} y={label.y} textAnchor={anchor} dominantBaseline="middle" fontSize={11} fill="var(--muted)" fontWeight={600}>
            {a.axis}
          </text>
        )
      })}
    </svg>
  )
}
