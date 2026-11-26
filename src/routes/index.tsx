import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Shell, Card, Tag, Btn, NextLink, dimText } from "@/components/might/ui";
import { Avatar, AVATARS } from "@/components/might/Avatar";
import { DIMS, TAGS, tagline, type Dim } from "@/lib/might/data";
import { setState, useStore } from "@/lib/might/store";
import { meta } from "@/lib/might/meta";

export const Route = createFileRoute("/")({
  head: () => meta("O meu MighT — MighT", "Escolhe 3 palavras e cria o teu Self MighT."),
  component: SelfPage,
});

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
        <div className="flex w-full items-center justify-between">
          <button aria-label="Figura anterior" onClick={() => setAvatar((avatar + AVATARS.length - 1) % AVATARS.length)} className="rounded-full bg-card p-2 shadow"><ChevronLeft /></button>
          <motion.div key={avatar} initial={{ scale: 0.8, rotate: -6, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }}>
            <Avatar i={avatar} className="h-44 w-44" />
          </motion.div>
          <button aria-label="Figura seguinte" onClick={() => setAvatar((avatar + 1) % AVATARS.length)} className="rounded-full bg-card p-2 shadow"><ChevronRight /></button>
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
          <h2 className={`text-sm font-bold uppercase tracking-wide ${dimText[key]}`}>{label} <span className="font-medium normal-case text-muted-foreground">— {HINTS[key]}</span></h2>
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
