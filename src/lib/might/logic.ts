import { DIMS, ROLES, TAGS, type Dim, type Profile, type Triple } from "./data";
import type { Received } from "./store";

export interface Weighted { tag: string; count: number; pct: number }
export function aggregate(accepted: Received[]): Record<Dim, Weighted[]> {
  const out = {} as Record<Dim, Weighted[]>;
  for (const { key } of DIMS) {
    const counts = new Map<string, number>();
    accepted.forEach((r) => counts.set(r.tags[key], (counts.get(r.tags[key]) ?? 0) + 1));
    const total = accepted.length || 1;
    out[key] = [...counts.entries()]
      .map(([tag, count]) => ({ tag, count, pct: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  }
  return out;
}

/** My words per dimension: self tag + top All MighT tags. */
export function myWords(self: Triple | null, agg: Record<Dim, Weighted[]>): Record<Dim, string[]> {
  const out = {} as Record<Dim, string[]>;
  for (const { key } of DIMS) {
    const set = new Set<string>();
    if (self) set.add(self[key]);
    agg[key].slice(0, 2).forEach((w) => set.add(w.tag));
    out[key] = [...set];
  }
  return out;
}

export function similarity(mine: Record<Dim, string[]>, p: Profile, dims: Dim[]) {
  let inter = 0, uni = 0;
  const common: string[] = [], diff: string[] = [];
  for (const d of dims) {
    const a = new Set(mine[d]), b = new Set(p.tags[d]);
    const u = new Set([...a, ...b]);
    uni += u.size;
    b.forEach((t) => (a.has(t) ? (inter++, common.push(t)) : diff.push(t)));
  }
  return { pct: uni ? Math.round((inter / uni) * 100) : 0, common, diff };
}

export function recommendRoles(words: Record<Dim, string[]>) {
  const all = new Set(DIMS.flatMap((d) => words[d.key]));
  return ROLES.map((r) => {
    const matched = r.tags.filter((t) => all.has(t));
    return { ...r, matched, score: matched.length / Math.min(all.size || 1, r.tags.length) };
  })
    .filter((r) => r.matched.length > 0)
    .sort((a, b) => b.matched.length - a.matched.length)
    .slice(0, 4);
}

export const dimOf = (tag: string): Dim | undefined => DIMS.find((d) => TAGS[d.key].includes(tag))?.key;
export const UNLOCK = 3;
