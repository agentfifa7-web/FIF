// Real, live press-review aggregation via Google News RSS — a stable,
// documented public endpoint that surfaces genuine Ivorian sports media
// (Fraternité Matin, Koaci, Abidjan.net, RTI, Linfodrome, Afrik-Foot…) and
// international coverage of Ivorian professionals abroad, without us having
// to guess or hard-code individual outlets' feed paths.
//
// This performs a real network fetch at request/ISR time. It cannot be
// exercised from a sandboxed dev session with restricted egress, so it is
// built to degrade gracefully: any failure (network, parse, empty) yields
// ok:false and an empty list, and callers must show a "revue de presse
// indisponible" state rather than fabricate results.

export interface PressItem {
  title: string
  link: string
  source: string
  pubDate: string | null
}

const PRESS_QUERIES = [
  { label: 'Football ivoirien', query: '"football ivoirien" OR "Éléphants de Côte d\'Ivoire" OR "Fédération Ivoirienne de Football"' },
  { label: 'Ivoiriens à l’international', query: 'footballeur ivoirien (transfert OR sélection OR championnat) international' },
]

function googleNewsUrl(query: string) {
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=fr&gl=CI&ceid=CI:fr`
}

function decodeEntities(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, '’')
    .replace(/<[^>]+>/g, '')
    .trim()
}

function extractTag(block: string, name: string) {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, 'i'))
  return m ? decodeEntities(m[1]) : ''
}

function splitTitleSource(rawTitle: string, taggedSource: string) {
  // Google News formats titles as "Headline - Source Name"
  const idx = rawTitle.lastIndexOf(' - ')
  if (idx > 10) {
    const head = rawTitle.slice(0, idx).trim()
    const tail = rawTitle.slice(idx + 3).trim()
    if (!taggedSource || tail.toLowerCase() === taggedSource.toLowerCase()) {
      return { title: head, source: taggedSource || tail }
    }
  }
  return { title: rawTitle, source: taggedSource || 'Presse' }
}

function parseRssItems(xml: string): PressItem[] {
  const items: PressItem[] = []
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? []
  for (const block of blocks) {
    const rawTitle = extractTag(block, 'title')
    const link = extractTag(block, 'link')
    const pubDate = extractTag(block, 'pubDate') || null
    const source = extractTag(block, 'source')
    if (!rawTitle || !link) continue
    const { title, source: resolvedSource } = splitTitleSource(rawTitle, source)
    items.push({ title, link, source: resolvedSource, pubDate })
  }
  return items
}

async function fetchFeed(url: string, timeoutMs = 6000): Promise<PressItem[]> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 1800 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FIFDigitalUniverse/1.0; +https://fif.ci)' },
    })
    clearTimeout(timer)
    if (!res.ok) return []
    const xml = await res.text()
    return parseRssItems(xml)
  } catch {
    return []
  }
}

export async function getPressReview(limit = 9): Promise<{ items: PressItem[]; ok: boolean }> {
  const settled = await Promise.allSettled(PRESS_QUERIES.map((q) => fetchFeed(googleNewsUrl(q.query))))
  const items = settled.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))

  const seen = new Set<string>()
  const deduped = items.filter((item) => {
    const key = item.title.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  deduped.sort((a, b) => {
    const ta = a.pubDate ? +new Date(a.pubDate) : 0
    const tb = b.pubDate ? +new Date(b.pubDate) : 0
    return tb - ta
  })

  return { items: deduped.slice(0, limit), ok: deduped.length > 0 }
}
