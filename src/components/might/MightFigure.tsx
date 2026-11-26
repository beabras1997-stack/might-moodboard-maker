import { useId } from "react";
import { motion } from "framer-motion";
import { ARMS, HANDS, HEAD, NEUTRAL, type HandShape, type HeadShape, type Pattern } from "@/lib/might/figure";
import type { Triple } from "@/lib/might/data";

const INK = "oklch(0.2 0.03 280)";
const CREAM = "oklch(0.97 0.02 85)";

function polar(cx: number, cy: number, rx: number, ry: number, r: (t: number) => number, n = 120) {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2, k = r(t);
    d += `${i ? "L" : "M"}${(cx + Math.cos(t) * rx * k).toFixed(1)} ${(cy + Math.sin(t) * ry * k).toFixed(1)}`;
  }
  return d + "Z";
}
function headPath(s: HeadShape) {
  const cx = 100, cy = 66;
  switch (s) {
    case "cloud": return polar(cx, cy, 58, 48, (t) => 0.86 + 0.14 * Math.abs(Math.sin(t * 2.5)));
    case "flower": return polar(cx, cy, 58, 50, (t) => 0.84 + 0.16 * Math.cos(t * 8));
    case "smooth": return polar(cx, cy, 56, 48, () => 1);
    case "spiky": return polar(cx, cy, 60, 52, (t) => 0.78 + 0.22 * Math.abs(((t * 9) / Math.PI) % 2 - 1), 180);
    case "blob": return polar(cx, cy, 58, 50, (t) => 0.86 + 0.09 * Math.sin(t * 3 + 1) + 0.06 * Math.cos(t * 5));
    case "sun": return polar(cx, cy, 50, 46, (t) => 0.88 + 0.12 * Math.max(0, Math.cos(t * 12)) ** 3, 240);
    case "square": return "M52 30 Q48 22 58 20 L142 20 Q152 22 150 30 L150 104 Q150 114 140 114 L60 114 Q50 114 50 104 Z";
    case "heart": return "M100 112 C60 90 40 66 46 42 C52 18 86 14 100 38 C114 14 148 18 154 42 C160 66 140 90 100 112 Z";
  }
}

function PatternDef({ id, p, color }: { id: string; p: Pattern; color: string }) {
  const c = { stroke: color, fill: "none", strokeWidth: 3, strokeLinecap: "round" as const };
  return (
    <pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform={p === "stripes" ? "rotate(35)" : undefined}>
      {p === "dots" && <circle cx="8" cy="8" r="2.4" fill={color} />}
      {p === "waves" && <path d="M0 8 Q4 3 8 8 T16 8" {...c} />}
      {p === "zigzag" && <path d="M0 11 L4 5 L8 11 L12 5 L16 11" {...c} />}
      {p === "stripes" && <rect width="6" height="16" fill={color} />}
      {p === "rings" && <circle cx="8" cy="8" r="5" {...c} strokeWidth={2} />}
      {p === "checks" && <><rect width="8" height="8" fill={color} /><rect x="8" y="8" width="8" height="8" fill={color} /></>}
    </pattern>
  );
}

function Hand({ shape, size, fill }: { shape: HandShape; size: number; fill: string }) {
  const s = size;
  switch (shape) {
    case "heart": return <path d={`M0 ${s} C${-s * 1.4} ${s * 0.1} ${-s * 0.9} ${-s} 0 ${-s * 0.35} C${s * 0.9} ${-s} ${s * 1.4} ${s * 0.1} 0 ${s}Z`} fill={fill} />;
    case "fist": return <rect x={-s} y={-s} width={s * 2} height={s * 2} rx={s * 0.45} fill={fill} />;
    case "open": return <g fill={fill}>{[-60, -30, 0, 30, 60].map((a) => <ellipse key={a} cx="0" cy={s * 0.9} rx={s * 0.22} ry={s * 0.55} transform={`rotate(${a})`} />)}<circle r={s * 0.75} /></g>;
    case "diamond": return <path d={`M0 ${-s * 1.2} L${s} 0 L0 ${s * 1.2} L${-s} 0Z`} fill={fill} />;
    case "star": return <path d={polar(0, 0, s * 1.2, s * 1.2, (t) => (Math.round((t / Math.PI) * 5) % 2 ? 0.5 : 1), 10)} fill={fill} />;
    case "shield": return <path d={`M${-s} ${-s} L${s} ${-s} L${s} ${s * 0.2} Q${s} ${s} 0 ${s * 1.3} Q${-s} ${s} ${-s} ${s * 0.2}Z`} fill={fill} />;
    case "small": return <circle r={s} fill={fill} />;
    default: return <circle r={s} fill={fill} stroke={CREAM} strokeWidth={3} />;
  }
}

function ArmDecor({ kind, color }: { kind: string; color: string }) {
  const st = { stroke: color, strokeWidth: 3, fill: "none", strokeLinecap: "round" as const };
  switch (kind) {
    case "sound": return <g {...st}><path d="M-14 0 A14 14 0 0 1 14 0" /><path d="M-22 -6 A22 22 0 0 1 22 -6" /></g>;
    case "crown": return <path d="M-14 0 L-14 -14 L-7 -6 L0 -18 L7 -6 L14 -14 L14 0Z" fill={color} />;
    case "grid": return <g {...st} strokeWidth={2}><path d="M-12 -12 H12 M-12 0 H12 M-12 12 H12 M-12 -12 V12 M0 -12 V12 M12 -12 V12" /></g>;
    case "paint": return <g fill={color}><circle cx="-12" cy="-4" r="5" /><circle cx="8" cy="-10" r="3.5" /><circle cx="12" cy="6" r="4.5" /></g>;
    case "blocks": return <g fill={color}><rect x="-14" y="-8" width="10" height="10" rx="2" /><rect x="0" y="-16" width="10" height="10" rx="2" /><rect x="0" y="0" width="10" height="10" rx="2" /></g>;
    case "bolt": return <path d="M2 -18 L-10 2 L0 2 L-4 18 L10 -4 L0 -4Z" fill={color} />;
    case "stars": return <g fill={color}><path d={polar(-8, -6, 8, 8, (t) => (Math.round((t / Math.PI) * 5) % 2 ? 0.45 : 1), 10)} /><path d={polar(10, 6, 5, 5, (t) => (Math.round((t / Math.PI) * 5) % 2 ? 0.45 : 1), 10)} /></g>;
    case "point": return <path d="M-14 0 H10 M2 -8 L12 0 L2 8" {...st} />;
    default: return null;
  }
}

const spring = { type: "spring", stiffness: 220, damping: 16 } as const;

export function MightFigure({ tags, className }: { tags: Partial<Triple>; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const head = tags.pers ? HEAD[tags.pers] : undefined;
  const arms = tags.power ? ARMS[tags.power] : undefined;
  const hands = tags.char ? HANDS[tags.char] : undefined;
  const headColor = head?.color ?? NEUTRAL, armColor = arms?.color ?? NEUTRAL, handColor = hands?.color ?? NEUTRAL;
  const angle = arms?.angle ?? 25, width = arms?.width ?? 15, L = 58;

  const arm = (side: 1 | -1) => (
    <g transform={`translate(${100 + side * 44} 132)`}>
      <motion.g initial={false} animate={{ rotate: -side * angle }} transition={spring}>
        <g key={tags.power ?? "n"}>
          <rect x={-width / 2} y={0} width={width} height={L} rx={width / 2} fill={armColor} />
          {arms && <rect x={-width / 2} y={0} width={width} height={L} rx={width / 2} fill={`url(#arm-${uid})`} opacity={0.35} />}
          {arms && (side === 1 || arms.decor !== "point") && (
            <g transform={`translate(${side * (width / 2 + 14)} ${L * 0.45}) rotate(${side * angle})`}><ArmDecor kind={arms.decor} color={arms.color} /></g>
          )}
        </g>
        <g transform={`translate(0 ${L + 4})`}>
          <motion.g key={tags.char ?? "n"} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring}>
            <Hand shape={hands?.shape ?? "round"} size={hands?.size ?? 12} fill={handColor} />
          </motion.g>
        </g>
      </motion.g>
    </g>
  );

  return (
    <svg viewBox="0 0 200 250" className={className} role="img" aria-label={`MighT: cabeça ${tags.pers ?? "por escolher"}, braços ${tags.power ?? "por escolher"}, mãos ${tags.char ?? "por escolher"}`}>
      <defs>
        {head && <PatternDef id={`head-${uid}`} p={head.pattern} color={head.accent} />}
        {arms && <PatternDef id={`arm-${uid}`} p={arms.pattern} color={CREAM} />}
        <pattern id={`body-${uid}`} width="20" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 7 Q5 2 10 7 T20 7" stroke={INK} strokeOpacity={0.18} strokeWidth="3" fill="none" />
        </pattern>
      </defs>
      <ellipse cx="100" cy="242" rx="54" ry="6" fill={INK} opacity={0.1} />
      {arm(-1)}
      {arm(1)}
      {/* body + legs */}
      <path d="M62 128 Q60 118 72 116 L128 116 Q140 118 138 128 L142 214 Q142 236 124 236 Q110 236 108 222 L106 208 Q100 202 94 208 L92 222 Q90 236 76 236 Q58 236 58 214Z" fill={CREAM} stroke={INK} strokeOpacity={0.12} strokeWidth="2" />
      <path d="M62 128 Q60 118 72 116 L128 116 Q140 118 138 128 L142 214 Q142 236 124 236 Q110 236 108 222 L106 208 Q100 202 94 208 L92 222 Q90 236 76 236 Q58 236 58 214Z" fill={`url(#body-${uid})`} />
      {/* head */}
      <motion.g key={tags.pers ?? "n"} initial={{ scale: 0.6, rotate: -8, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={spring} style={{ originX: "100px", originY: "70px" }}>
        {head?.shape === "sun" && (
          <g stroke={head.accent} strokeWidth="5" strokeLinecap="round">
            {Array.from({ length: 12 }).map((_, i) => { const t = (i / 12) * Math.PI * 2; return <line key={i} x1={100 + Math.cos(t) * 56} y1={66 + Math.sin(t) * 52} x2={100 + Math.cos(t) * 66} y2={66 + Math.sin(t) * 61} />; })}
          </g>
        )}
        <path d={headPath(head?.shape ?? "smooth")} fill={headColor} />
        {head && <path d={headPath(head.shape)} fill={`url(#head-${uid})`} opacity={0.45} />}
        <path d={headPath(head?.shape ?? "smooth")} fill="none" stroke={INK} strokeOpacity={0.12} strokeWidth="2" />
        {!head && <text x="100" y="74" textAnchor="middle" fontSize="22" fontWeight="800" fill={INK} opacity={0.25}>?</text>}
      </motion.g>
    </svg>
  );
}
