import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Shell, Card, Tag, Btn, NextLink, dimBg, dimText } from "@/components/might/ui";
import { Avatar } from "@/components/might/Avatar";
import { DIMS, PEOPLE } from "@/lib/might/data";
import { aggregate, UNLOCK } from "@/lib/might/logic";
import { setState, useStore, type Status } from "@/lib/might/store";
import { meta } from "@/lib/might/meta";

export const Route = createFileRoute("/all")({
  head: () => meta("All MighT — MighT", "O resultado agregado das palavras que recebeste."),
  component: AllPage,
});



function AllPage() {
  const s = useStore();
  const accepted = s.received.filter((r) => r.status === "accepted");
  const pending = s.received.filter((r) => r.status === "pending");
  const unlocked = accepted.length >= UNLOCK;
  const agg = aggregate(accepted);
  const setStatus = (id: string, status: Status) => setState((st) => ({ ...st, received: st.received.map((r) => (r.id === id ? { ...r, status } : r)) }));

  return (
    <Shell step="3 · All MighT" title="O teu All MighT" intro="O resultado agregado das palavras que recebeste de quem te conhece.">
      <Card className="bg-primary text-primary-foreground">
        <div className="flex items-center justify-between">
          <p className="font-bold">{unlocked ? "All MighT desbloqueado 🎉" : `Faltam ${UNLOCK - accepted.length} MighTs`}</p>
          <span className="text-sm opacity-70">{Math.min(accepted.length, UNLOCK)}/{UNLOCK}</span>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-primary-foreground/20">
          <motion.div className="h-full rounded-full bg-accent" initial={{ width: 0 }} animate={{ width: `${Math.min(100, (accepted.length / UNLOCK) * 100)}%` }} />
        </div>
      </Card>

      {pending.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Por aceitar ({pending.length})</h2>
          {pending.map((r) => {
            const who = PEOPLE.find((p) => p.id === r.from)!;
            return (
              <Card key={r.id}>
                <div className="flex items-center gap-3">
                  <Avatar i={who.avatar} className="h-12 w-12" />
                  <div><p className="font-bold">{who.name}</p><p className="text-xs text-muted-foreground">{r.circle}</p></div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">{DIMS.map((d) => <Tag key={d.key} dim={d.key}>{r.tags[d.key]}</Tag>)}</div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Btn variant="light" onClick={() => setStatus(r.id, "declined")}>Recusar</Btn>
                  <Btn onClick={() => setStatus(r.id, "accepted")}>Aceitar</Btn>
                </div>
              </Card>
            );
          })}
        </section>
      )}

      {unlocked ? (
        <>
          {DIMS.map(({ key, label }) => (
            <Card key={key}>
              <h2 className={`text-sm font-bold uppercase tracking-wide ${dimText[key]}`}>{label}</h2>
              <ul className="mt-3 space-y-2.5">
                {agg[key].map((w) => (
                  <li key={w.tag}>
                    <div className="flex justify-between text-sm font-semibold">
                      <span>{w.tag}{s.self?.[key] === w.tag && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[10px] text-accent-foreground">= Self</span>}</span>
                      <span className="text-muted-foreground">{w.pct}%</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-secondary">
                      <motion.div className={`h-full rounded-full ${dimBg[key]}`} initial={{ width: 0 }} animate={{ width: `${w.pct}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                {s.self ? (agg[key].some((w) => w.tag === s.self![key]) ? `Os outros também te vêem como "${s.self[key]}".` : `Tu escolheste "${s.self[key]}" — os outros destacam "${agg[key][0]?.tag}".`) : "Cria o teu Self MighT para comparares."}
              </p>
            </Card>
          ))}
          <NextLink to="/card">Criar o meu MighT Card</NextLink>
        </>
      ) : (
        <Card className="flex flex-col items-center py-10 text-center">
          <Lock className="h-10 w-10 text-muted-foreground" />
          <p className="mt-3 font-bold">Aceita {UNLOCK} MighTs para desbloquear</p>
          <p className="text-sm text-muted-foreground">Pede mais MighTs a quem te conhece.</p>
          <div className="mt-4 w-full"><NextLink to="/enviar">Pedir MighTs</NextLink></div>
        </Card>
      )}

      {s.received.some((r) => r.status === "declined") && (
        <p className="text-center text-xs text-muted-foreground">{s.received.filter((r) => r.status === "declined").length} MighT(s) recusado(s)</p>
      )}
    </Shell>
  );
}
