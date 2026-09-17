// Deterministic pseudo-random generator so mock data is identical on
// server render and client hydration (no Math.random / Date.now).
export function mulberry32(seed: number) {
  let a = seed
  return function rand() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function makeRng(seed = 42) {
  const rand = mulberry32(seed)
  return {
    float: () => rand(),
    int: (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min,
    bool: (p = 0.5) => rand() < p,
    pick<T>(arr: readonly T[]): T {
      return arr[Math.floor(rand() * arr.length)]
    },
    pickN<T>(arr: readonly T[], n: number): T[] {
      const pool = [...arr]
      const out: T[] = []
      for (let i = 0; i < n && pool.length; i++) {
        const idx = Math.floor(rand() * pool.length)
        out.push(pool[idx])
        pool.splice(idx, 1)
      }
      return out
    },
    shuffle<T>(arr: readonly T[]): T[] {
      const pool = [...arr]
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1))
        ;[pool[i], pool[j]] = [pool[j], pool[i]]
      }
      return pool
    },
  }
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
