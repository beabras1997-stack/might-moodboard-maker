import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { Download, Share2 } from "lucide-react";
import { Shell, Btn, NextLink, Logo } from "@/components/might/ui";
import { Avatar } from "@/components/might/Avatar";
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
      <div ref={ref} className="relative overflow-hidden rounded-[2rem] bg-primary p-6 text-primary-foreground">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-pers opacity-80" />
        <div className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-power opacity-80" />
        <div className="absolute right-6 bottom-24 h-16 w-16 rounded-full bg-sun opacity-90" />
        <div className="relative flex items-center justify-between">
          <Logo />
          <span className="rounded-full bg-primary-foreground/15 px-3 py-1 text-[11px] font-semibold">{unlocked ? `All MighT · ${accepted.length} vozes` : "Self MighT"}</span>
        </div>
        <Avatar i={s.avatar} className="relative mx-auto mt-4 h-48 w-48" />
        <p className="relative mt-4 text-center text-xl font-extrabold leading-snug">{tagline(top)}</p>
        <div className="relative mt-5 grid grid-cols-3 gap-2">
          {DIMS.map((d) => (
            <div key={d.key} className={`rounded-2xl p-2.5 text-center ${d.key === "pers" ? "bg-pers" : d.key === "power" ? "bg-power" : "bg-char"}`}>
              <p className="text-[10px] font-semibold uppercase opacity-80">{d.label}</p>
              <p className="text-sm font-extrabold">{top[d.key]}</p>
            </div>
          ))}
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
