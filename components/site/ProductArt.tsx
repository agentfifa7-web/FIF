import type { Product } from '@/lib/data/types'

const PALETTE: Record<string, string> = {
  Orange: '#ff7a00',
  Vert: '#087443',
  Blanc: '#ffffff',
  Anthracite: '#232b27',
}
const DARK = '#041b12'

function colorOf(name: string | undefined, fallback: string) {
  return (name && PALETTE[name]) || fallback
}

function Tusks({ x = 100, y = 100, scale = 1, color = DARK }: { x?: number; y?: number; scale?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={color} strokeWidth="2.4" strokeLinecap="round" fill="none">
      <path d="M-9,-2 C-14,4 -13,12 -6,14" />
      <path d="M9,-2 C14,4 13,12 6,14" />
    </g>
  )
}

function Emblem({ cx, cy, r = 20, ring, text }: { cx: number; cy: number; r?: number; ring: string; text: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke={ring} strokeWidth="2.5" />
      <Tusks x={cx} y={cy - 6} scale={0.85} color={ring} />
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="9" fontWeight="800" fill={ring} fontFamily="Arial, sans-serif">{text}</text>
    </g>
  )
}

function Jersey({ primary, secondary, trim, label }: { primary: string; secondary: string; trim: string; label: string }) {
  return (
    <>
      <rect x="0" y="0" width="200" height="200" fill="#f2f4f1" />
      <path
        d="M60,40 L30,55 L40,92 L60,81 L60,178 L140,178 L140,81 L160,92 L170,55 L140,40 L124,53 Q100,68 76,53 Z"
        fill={primary}
        stroke={DARK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M76,53 Q100,68 124,53" fill="none" stroke={trim} strokeWidth="3" />
      <rect x="58" y="81" width="5" height="97" fill={secondary} />
      <rect x="137" y="81" width="5" height="97" fill={secondary} />
      <rect x="30" y="53" width="10" height="10" fill={secondary} />
      <rect x="160" y="53" width="10" height="10" fill={secondary} />
      <Emblem cx={100} cy={112} r={21} ring={primary === trim ? DARK : primary} text={label} />
    </>
  )
}

function Scarf({ primary, secondary, trim }: { primary: string; secondary: string; trim: string }) {
  const bands = [primary, trim, secondary, trim, primary]
  return (
    <>
      <rect x="0" y="0" width="200" height="200" fill="#f2f4f1" />
      <g stroke={DARK} strokeWidth="1">
        {bands.map((c, i) => (
          <rect key={i} x={26 + i * 30} y="82" width="30" height="40" fill={c} />
        ))}
      </g>
      <rect x="26" y="82" width="150" height="40" fill="none" stroke={DARK} strokeWidth="2.5" rx="4" />
      {Array.from({ length: 7 }, (_, i) => (
        <line key={`l${i}`} x1={20 - 2} y1={90 + i * 3.5} x2="14" y2={90 + i * 3.5} stroke={DARK} strokeWidth="1.4" />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <line key={`r${i}`} x1="182" y1={90 + i * 3.5} x2="188" y2={90 + i * 3.5} stroke={DARK} strokeWidth="1.4" />
      ))}
      <Tusks x={100} y={102} scale={1.3} color="#fff" />
    </>
  )
}

function Cap({ primary, secondary, trim }: { primary: string; secondary: string; trim: string }) {
  return (
    <>
      <rect x="0" y="0" width="200" height="200" fill="#f2f4f1" />
      <path d="M42,112 Q42,54 102,50 Q160,54 162,112 Z" fill={primary} stroke={DARK} strokeWidth="2" />
      <path d="M38,110 Q100,98 188,118 Q158,136 96,132 Q58,130 38,110 Z" fill={secondary} stroke={DARK} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="102" cy="52" r="5" fill={trim} stroke={DARK} strokeWidth="1.5" />
      <path d="M42,112 Q102,124 162,112" fill="none" stroke={trim} strokeWidth="2.5" />
      <Emblem cx={92} cy={90} r={16} ring={primary === '#ffffff' ? DARK : primary} text="FIF" />
    </>
  )
}

function Wristband({ primary, secondary, trim }: { primary: string; secondary: string; trim: string }) {
  return (
    <>
      <rect x="0" y="0" width="200" height="200" fill="#f2f4f1" />
      <g transform="rotate(-18 100 100)">
        <rect x="28" y="84" width="144" height="32" rx="16" fill={primary} stroke={DARK} strokeWidth="2" />
        <rect x="28" y="84" width="46" height="32" rx="16" fill={trim} stroke={DARK} strokeWidth="2" />
        <rect x="126" y="84" width="46" height="32" rx="16" fill={secondary} stroke={DARK} strokeWidth="2" />
      </g>
      <Emblem cx={100} cy={100} r={19} ring={DARK} text="CI" />
    </>
  )
}

function Ball({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <>
      <rect x="0" y="0" width="200" height="200" fill="#f2f4f1" />
      <circle cx="100" cy="100" r="68" fill="#fff" stroke={DARK} strokeWidth="2.5" />
      <g fill={primary} stroke={DARK} strokeWidth="1.5" strokeLinejoin="round">
        <polygon points="100,68 118,81 111,102 89,102 82,81" />
        <polygon points="100,32 121,46 114,68 86,68 79,46" opacity="0.92" />
      </g>
      <g fill={secondary} stroke={DARK} strokeWidth="1.5" strokeLinejoin="round" opacity="0.9">
        <polygon points="45,80 66,74 82,88 68,108 47,104" />
        <polygon points="155,80 134,74 118,88 132,108 153,104" />
        <polygon points="72,145 100,132 128,145 118,166 82,166" />
      </g>
      <circle cx="100" cy="100" r="68" fill="none" stroke={DARK} strokeWidth="2.5" />
    </>
  )
}

export function ProductArt({ product }: { product: Product }) {
  const primary = colorOf(product.colors[0], '#ff7a00')
  const secondary = colorOf(product.colors[1], '#087443')
  const trim = colorOf(product.colors[2], '#ffffff')

  let content: React.ReactNode
  switch (product.category) {
    case 'Écharpes':
      content = <Scarf primary={primary} secondary={secondary} trim={trim} />
      break
    case 'Casquettes':
      content = <Cap primary={primary} secondary={secondary} trim={trim} />
      break
    case 'Accessoires':
      content = <Wristband primary={primary} secondary={secondary} trim={trim} />
      break
    case 'Ballons':
      content = <Ball primary={primary} secondary={secondary} />
      break
    default:
      content = <Jersey primary={primary} secondary={secondary} trim={trim} label={product.category === 'Femmes' ? 'CI' : 'FIF'} />
  }

  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" role="img" aria-label={product.name}>
      {content}
    </svg>
  )
}
