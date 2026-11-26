import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Shell, Card, Tag, Btn, NextLink, dimText } from "@/components/might/ui";
import { MightFigure } from "@/components/might/MightFigure";
import { ARMS, HANDS, HEAD } from "@/lib/might/figure";
import { DIMS, TAGS, tagline, type Dim } from "@/lib/might/data";
import { setState, useStore } from "@/lib/might/store";
import { meta } from "@/lib/might/meta";

export const Route = createFileRoute("/")({
  head: () => meta("O meu MighT — MighT", "Escolhe 3 palavras e cria o teu Self MighT."),
  component: SelfPage,
});

const ZONE: Record<Dim, string> = { pers: "Cabeça", power: "Braços", char: "Mãos" };
const DESC: Record<Dim, (t: string) => string> = { pers: (t) => HEAD[t]!.desc, power: (t) => ARMS[t]!.desc, char: (t) => HANDS[t]!.desc };
const HINTS: Record<Dim, string> = { pers: "um adjetivo", power: "um verbo de ação", char: "um valor" };

function SelfPage() {
  const s = useStore();
  const [pick, setPick] = useState<Partial<Record<Dim, string>>>({});
  const [avatar, setAvatar] = useState(0);
  const [name, setName] = useState("");
  useEffect(() => { if (s.self) setPick(s.self); setAvatar(s.avatar); setName(s.name); }, [s.self, s.avatar, s.name]);
  const done = !!(pick.pers && pick.power && pick.char && name.trim());
  const saved = s.self && s.self.pers === pick.pers && s.self.power === pick.power && s.self.char === pick.char && s.avatar === avatar && s.name === name;

  return (
    <Shell step="1 · Self MighT" title="Faz o teu MighT" intro="Pensa nas 3 palavras que melhor te retratam: a tua personalidade, o teu talento e o teu carácter.">
      <Card className="flex flex-col items-center bg-gradient-to-b from-secondary to-card">
        <MightFigure tags={pick} className="h-64 w-64" />
        <div className="mt-2 grid w-full grid-cols-3 gap-2 text-center text-[11px]">
          {DIMS.map(({ key }) => (
            <div key={key} className="rounded-2xl bg-card p-2">
              <p className={`font-bold uppercase ${dimText[key]}`}>{ZONE[key]}</p>
              <p className="leading-tight text-muted-foreground">{pick[key] ? DESC[key](pick[key]!) : "Por escolher"}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 min-h-12 text-center text-lg font-bold leading-snug">
          {done ? tagline(pick as never) : "A tua tagline aparece aqui ✨"}
        </p>
      </Card>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">O teu nome</h2>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Tiago Forjaz" className="mt-2 w-full rounded-2xl border bg-card px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-ring" />
      </section>

      {DIMS.map(({ key, label }) => (
        <section key={key}>
          <h2 className={`text-sm font-bold uppercase tracking-wide ${dimText[key]}`}>{label} <span className="font-medium normal-case text-muted-foreground">· {ZONE[key].toLowerCase()} — {HINTS[key]}</span></h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {TAGS[key].map((t) => (
              <Tag key={t} dim={key} active={pick[key] === t} onClick={() => setPick({ ...pick, [key]: t })}>{t}</Tag>
            ))}
          </div>
        </section>
      ))}

      <Btn disabled={!done || !!saved} onClick={() => {
        setState((st) => ({ ...st, self: pick as never, avatar, name: name.trim() }));
        toast.success("Boa! Já conseguiste!", { description: "Não seria bestial descobrires o que os outros vêem em ti?" });
      }}>{saved ? "Self MighT guardado ✓" : "Guardar o meu Self MighT"}</Btn>
      {s.self && <NextLink to="/enviar">Manda e pede MighTs</NextLink>}
    </Shell>
  );
}
