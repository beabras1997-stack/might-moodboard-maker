import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { Download, Share2 } from "lucide-react";
import { Shell, Btn, NextLink, Logo } from "@/components/might/ui";
import { MightFigure } from "@/components/might/MightFigure";
import { DIMS, tagline, type Triple } from "@/lib/might/data";
import { aggregate, UNLOCK } from "@/lib/might/logic";
import { useStore } from "@/lib/might/store";
import { meta } from "@/lib/might/meta";

export const Route = createFileRoute("/card")({
  head: () => meta("MighT Card — MighT", "O teu cartão MighT para partilhar com o mundo."),
  component: CardPage,
});

function CardPage() {
  const s = useStore();
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const accepted = s.received.filter((r) => r.status === "accepted");
  const agg = aggregate(accepted);
  const unlocked = accepted.length >= UNLOCK;
  const top: Triple | null = unlocked ? { pers: agg.pers[0]!.tag, power: agg.power[0]!.tag, char: agg.char[0]!.tag } : s.self;

  const render = async () => toPng(ref.current!, { pixelRatio: 3, cacheBust: true });
  const download = async () => {
    setBusy(true);
    try {
      const url = await render();
      const a = document.createElement("a"); a.href = url; a.download = "o-meu-might-card.png"; a.click();
      toast.success("MighT Card descarregado!");
    } catch { toast.error("Não foi possível gerar a imagem."); } finally { setBusy(false); }
  };
  const share = async () => {
    setBusy(true);
    try {
      const blob = await (await fetch(await render())).blob();
      const file = new File([blob], "might-card.png", { type: "image/png" });
      const text = `O meu MighT: ${top ? tagline(top) : ""}`;
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title: "O meu MighT Card", text });
      else { await navigator.clipboard.writeText(text); toast.success("Texto copiado — cola onde quiseres partilhar!"); }
    } catch { /* cancelled */ } finally { setBusy(false); }
  };

  if (!top) {
    return (
      <Shell step="4 · MighT Card" title="O teu MighT Card" intro="Primeiro cria o teu Self MighT para gerares o cartão.">
        <NextLink to="/">Fazer o meu MighT</NextLink>
      </Shell>
    );
  }

  return (
    <Shell step="4 · MighT Card" title="O teu MighT Card" intro="Agora já te podes apresentar ao mundo, falando do teu talento mais do que da tua experiência.">
      <div ref={ref} className="relative mx-auto w-full max-w-[22rem] overflow-hidden rounded-[1.75rem] p-6 text-primary-foreground" style={{ background: "var(--gradient-card)" }}>
        <div className="flex items-start justify-between">
          <Logo light className="h-5" />
        </div>
        <MightFigure tags={s.self ?? top} className="mx-auto mt-2 h-60 w-60 drop-shadow-2xl" />
        <p className="mt-3 text-center text-3xl font-extrabold tracking-tight">{s.name || "O teu nome"}</p>
        <div className="mt-5 flex items-center justify-around border-y border-primary-foreground/25 py-3 text-sm font-medium">
          {DIMS.map((d) => (
            <span key={d.key} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${d.key === "pers" ? "bg-pers" : d.key === "power" ? "bg-sun" : "bg-char"}`} />
              {top[d.key]}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-foreground/20 text-xs font-bold">{unlocked ? accepted.length : "S"}</span>
          <p className="text-right text-sm leading-snug opacity-90">{tagline(top)}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Btn onClick={download} disabled={busy}><Download className="mr-1.5 inline h-4 w-4" />PNG</Btn>
        <Btn variant="light" onClick={share} disabled={busy}><Share2 className="mr-1.5 inline h-4 w-4" />Partilhar</Btn>
      </div>
      {!unlocked && <p className="text-center text-sm text-muted-foreground">Desbloqueia o All MighT para o cartão usar as palavras dos outros.</p>}
      <NextLink to="/descobrir">Descobrir pessoas semelhantes</NextLink>
    </Shell>
  );
}
