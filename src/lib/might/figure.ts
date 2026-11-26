// Visual recipe for each tag. Head = Personalidade, Braços = Poder, Mãos = Carácter.
export type Pattern = "dots" | "waves" | "zigzag" | "stripes" | "rings" | "checks" | "plain";
export type HeadShape = "cloud" | "flower" | "smooth" | "spiky" | "heart" | "blob" | "square" | "sun";
export type HandShape = "round" | "heart" | "fist" | "open" | "diamond" | "small" | "star" | "shield";

const C = {
  coral: "oklch(0.66 0.16 10)", blue: "oklch(0.5 0.15 255)", sky: "oklch(0.7 0.11 235)", purple: "oklch(0.48 0.17 320)",
  gold: "oklch(0.76 0.13 80)", teal: "oklch(0.62 0.1 190)", orange: "oklch(0.7 0.16 50)", pink: "oklch(0.78 0.1 350)",
  navy: "oklch(0.32 0.1 262)", green: "oklch(0.64 0.13 150)",
};

export const HEAD: Record<string, { shape: HeadShape; color: string; pattern: Pattern; accent: string; desc: string }> = {
  Curiosa: { shape: "cloud", color: C.sky, pattern: "dots", accent: C.navy, desc: "Cabeça em nuvem, cheia de pontos de interrogação" },
  Divertida: { shape: "flower", color: C.orange, pattern: "checks", accent: C.pink, desc: "Cabeça em flor, com padrão festivo" },
  Calma: { shape: "smooth", color: C.teal, pattern: "waves", accent: C.sky, desc: "Cabeça lisa e redonda, com ondas suaves" },
  Ousada: { shape: "spiky", color: C.coral, pattern: "zigzag", accent: C.gold, desc: "Cabeça com picos e ziguezagues" },
  Empática: { shape: "heart", color: C.pink, pattern: "rings", accent: C.coral, desc: "Cabeça em coração, com anéis acolhedores" },
  Criativa: { shape: "blob", color: C.purple, pattern: "stripes", accent: C.gold, desc: "Cabeça orgânica, com riscas de tinta" },
  Determinada: { shape: "square", color: C.navy, pattern: "stripes", accent: C.coral, desc: "Cabeça firme e quadrada, com riscas diagonais" },
  Otimista: { shape: "sun", color: C.gold, pattern: "rings", accent: C.orange, desc: "Cabeça-sol, a irradiar raios" },
};

export const ARMS: Record<string, { color: string; width: number; angle: number; pattern: Pattern; decor: "sound" | "crown" | "grid" | "paint" | "blocks" | "bolt" | "stars" | "point"; desc: string }> = {
  Comunicar: { color: C.sky, width: 16, angle: 35, pattern: "waves", decor: "sound", desc: "Braços abertos com ondas de som" },
  Liderar: { color: C.coral, width: 20, angle: 150, pattern: "stripes", decor: "crown", desc: "Braços erguidos ao alto" },
  Analisar: { color: C.teal, width: 11, angle: 20, pattern: "checks", decor: "grid", desc: "Braços finos e precisos, quadriculados" },
  Criar: { color: C.purple, width: 24, angle: 45, pattern: "stripes", decor: "paint", desc: "Braços grossos, com salpicos de tinta" },
  Organizar: { color: C.navy, width: 18, angle: 25, pattern: "checks", decor: "blocks", desc: "Braços segmentados em blocos" },
  Resolver: { color: C.orange, width: 17, angle: 60, pattern: "zigzag", decor: "bolt", desc: "Braços em ação, com raios de energia" },
  Inspirar: { color: C.gold, width: 15, angle: 130, pattern: "dots", decor: "stars", desc: "Braços para cima, a espalhar estrelas" },
  Ensinar: { color: C.green, width: 16, angle: 90, pattern: "rings", decor: "point", desc: "Braços estendidos, a mostrar o caminho" },
};

export const HANDS: Record<string, { shape: HandShape; color: string; size: number; desc: string }> = {
  Honesta: { shape: "round", color: C.sky, size: 13, desc: "Mãos redondas e transparentes" },
  Leal: { shape: "heart", color: C.coral, size: 14, desc: "Mãos em coração" },
  Resiliente: { shape: "fist", color: C.navy, size: 14, desc: "Mãos fortes e compactas" },
  Generosa: { shape: "open", color: C.gold, size: 17, desc: "Mãos grandes e abertas" },
  Justa: { shape: "diamond", color: C.teal, size: 14, desc: "Mãos equilibradas em losango" },
  Humilde: { shape: "small", color: C.green, size: 9, desc: "Mãos pequenas e discretas" },
  Corajosa: { shape: "star", color: C.orange, size: 16, desc: "Mãos em estrela" },
  Responsável: { shape: "shield", color: C.purple, size: 14, desc: "Mãos em escudo protetor" },
};

export const NEUTRAL = "oklch(0.86 0.02 85)";
