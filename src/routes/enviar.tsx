import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Clock } from "lucide-react";
import { Shell, Card, Tag, Btn, NextLink, dimText } from "@/components/might/ui";
import { Avatar } from "@/components/might/Avatar";
import { CIRCLES, DIMS, PEOPLE, TAGS, type Dim, type Triple } from "@/lib/might/data";
import { setState, uid, useStore } from "@/lib/might/store";
import { meta } from "@/lib/might/meta";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/enviar")({
  head: () => meta("Enviar e pedir MighTs — MighT", "Reconhece quem te é próximo e pede-lhes um MighT."),
  component: SendPage,
});

const pickRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]!;

function SendPage() {
  const s = useStore();
  const [mode, setMode] = useState<"send" | "ask">("send");
  const [person, setPerson] = useState<string | null>(null);
  const [circle, setCircle] = useState<string | null>(null);
  const [words, setWords] = useState<Partial<Record<Dim, string>>>({});
  const p = PEOPLE.find((x) => x.id === person);
  const ready = person && circle && (mode === "ask" || (words.pers && words.power && words.char));

  const submit = () => {
    if (!p || !circle) return;
    if (mode === "send") {
      setState((st) => ({ ...st, sent: [{ id: uid(), to: p.id, circle, tags: words as Triple }, ...st.sent] }));
      toast.success(`MighT enviado a ${p.name.split(" ")[0]}!`, { description: "Vais ver que essa pessoa vai retribuir!" });
    } else {
      const reqId = uid();
      setState((st) => ({ ...st, requests: [{ id: reqId, to: p.id, circle, answered: false }, ...st.requests] }));
      toast(`Pedido enviado a ${p.name.split(" ")[0]}`, { description: "Agora é uma questão de tempo…" });
      const who = p, c = circle;
      setTimeout(() => {
        const tags = { pers: pickRandom(TAGS.pers), power: pickRandom(TAGS.power), char: pickRandom(TAGS.char) };
        setState((st) => ({
          ...st,
          requests: st.requests.map((r) => (r.id === reqId ? { ...r, answered: true } : r)),
          received: [{ id: uid(), from: who.id, circle: c, tags, status: "pending" }, ...st.received],
        }));
        toast.success(`${who.name.split(" ")[0]} enviou-te um MighT!`, { description: "Vai ao All MighT para aceitar." });
      }, 3000);
    }
    setPerson(null); setCircle(null); setWords({});
  };

  const activity = [
    ...s.sent.map((x) => ({ id: x.id, who: x.to, text: `Enviaste: ${x.tags.pers}, ${x.tags.power}, ${x.tags.char}`, done: true })),
    ...s.requests.map((x) => ({ id: x.id, who: x.to, text: x.answered ? "Respondeu ao teu pedido" : "Pedido à espera de resposta", done: x.answered })),
  ];

  return (
    <Shell step="2 · Manda & Pede" title={mode === "send" ? "Manda um MighT" : "Pede um MighT"} intro={mode === "send" ? "Para receberes é melhor começares por dar. Escolhe alguém com muito potencial." : "Impaciente? Pede a quem te conhece melhor para te reconhecer."}>
      <div className="grid grid-cols-2 rounded-2xl bg-secondary p-1">
        {(["send", "ask"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={cn("rounded-xl py-2.5 font-bold transition", mode === m ? "bg-card shadow" : "text-muted-foreground")}>{m === "send" ? "Enviar" : "Pedir"}</button>
        ))}
      </div>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Pessoa</h2>
        <div className="-mx-5 mt-2 flex gap-3 overflow-x-auto px-5 pb-2">
          {PEOPLE.map((x) => (
            <button key={x.id} onClick={() => setPerson(x.id)} className={cn("flex w-24 shrink-0 flex-col items-center rounded-3xl border-2 bg-card p-2 transition", person === x.id ? "border-primary" : "border-transparent")}>
              <Avatar i={x.avatar} className="h-16 w-16" />
              <span className="mt-1 text-center text-xs font-bold leading-tight">{x.name}</span>
              <span className="text-[10px] text-muted-foreground">{x.role}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Círculo social</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {CIRCLES.map((c) => (
            <button key={c} onClick={() => setCircle(c)} className={cn("rounded-full px-3.5 py-1.5 text-sm font-semibold", circle === c ? "bg-primary text-primary-foreground" : "bg-secondary")}>{c}</button>
          ))}
        </div>
      </section>

      {mode === "send" && DIMS.map(({ key, label }) => (
        <section key={key}>
          <h2 className={`text-sm font-bold uppercase tracking-wide ${dimText[key]}`}>{label}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {TAGS[key].map((t) => <Tag key={t} dim={key} active={words[key] === t} onClick={() => setWords({ ...words, [key]: t })}>{t}</Tag>)}
          </div>
        </section>
      ))}

      <Btn disabled={!ready} onClick={submit}>{mode === "send" ? `Enviar MighT${p ? ` a ${p.name.split(" ")[0]}` : ""}` : `Pedir MighT${p ? ` a ${p.name.split(" ")[0]}` : ""}`}</Btn>

      {activity.length > 0 && (
        <Card>
          <h2 className="font-bold">Atividade</h2>
          <ul className="mt-3 space-y-3">
            {activity.map((a) => {
              const who = PEOPLE.find((x) => x.id === a.who)!;
              return (
                <li key={a.id} className="flex items-center gap-3">
                  <Avatar i={who.avatar} className="h-10 w-10" />
                  <div className="flex-1 text-sm"><p className="font-bold">{who.name}</p><p className="text-muted-foreground">{a.text}</p></div>
                  {a.done ? <Check className="h-5 w-5 text-char" /> : <Clock className="h-5 w-5 animate-pulse text-sun" />}
                </li>
              );
            })}
          </ul>
        </Card>
      )}
      <NextLink to="/all">Ver os MighTs recebidos</NextLink>
    </Shell>
  );
}
