const TONES = ['#087443', '#c85a00', '#0b1110', '#1c4587', '#7a4706', '#6d2d6d', '#0a5c33', '#a4501f']

function hashString(value: string) {
  let h = 0
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}

function toneFor(seed: string) {
  return TONES[hashString(seed) % TONES.length]
}

/**
 * Generated institutional-portrait placeholder (silhouette bust on a brand
 * tone) — used wherever the platform needs a "photo" for a real named role
 * (president, executive committee, coaches, referees, officials, agents)
 * without claiming to hold an actual photograph of that person.
 */
export function PersonPortrait({ seed, size = 96, rounded = true }: { seed: string; size?: number; rounded?: boolean }) {
  const tone = toneFor(seed)
  return (
    <svg
      viewBox="0 0 200 240"
      width={size}
      height={size * 1.2}
      role="img"
      aria-label={`Portrait — ${seed}`}
      style={{ borderRadius: rounded ? 'var(--radius-md)' : 0, display: 'block', flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={`pg-${hashString(seed)}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={tone} />
          <stop offset="1" stopColor="#041b12" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="200" height="240" fill={`url(#pg-${hashString(seed)})`} />
      <circle cx="100" cy="96" r="42" fill="#fff" opacity="0.92" />
      <path d="M28,238 C28,178 56,150 100,150 C144,150 172,178 172,238 Z" fill="#fff" opacity="0.92" />
    </svg>
  )
}
