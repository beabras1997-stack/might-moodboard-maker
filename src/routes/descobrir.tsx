import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, Card, Tag, NextLink } from "@/components/might/ui";
import { Avatar } from "@/components/might/Avatar";
import { DIMS, PROFILES, type Dim } from "@/lib/might/data";
import { aggregate, dimOf, myWords, similarity } from "@/lib/might/logic";
import { useStore } from "@/lib/might/store";
import { meta } from "@/lib/might/meta";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/descobrir")({
  head: () => meta("Descobrir pessoas — MighT", "Pessoas com um potencial semelhante ao teu."),
  component: DiscoverPage,
});

function DiscoverPage() {
  const s = useStore();
  const [filter, setFilter] = useState<Dim | "all">("all");
  const mine = myWords(s.self, aggregate(s.received.filter((r) => r.status === "accepted")));
  const dims: Dim[] = filter === "all" ? DIMS.map((d) => d.key) : [filter];
  const list = PROFILES.map((p) => ({ p, ...similarity(mine, p, dims) })).sort((a, b) => b.pct - a.pct);

  return (
    <Shell step="5 · Pessoas" title="Pessoas como tu" intro="Perfis fictícios com potencial semelhante ao teu, ordenados por semelhança.">
      <div className="flex flex-wrap gap-2">
        {[{ key: "all" as const, label: "Tudo" }, ...DIMS].map((d) => (
          <button key={d.key} onClick={() => setFilter(d.key)} className={cn("rounded-full px-3.5 py-1.5 text-sm font-semibold", filter === d.key ? "bg-primary text-primary-foreground" : "bg-secondary")}>{d.label}</button>
        ))}
      </div>
      {list.map(({ p, pct, common, diff }) => (
        <Card key={p.id}>
          <div className="flex items-center gap-3">
            <Avatar i={p.avatar} className="h-14 w-14" />
            <div className="flex-1"><p className="font-bold">{p.name}</p><p className="text-sm text-muted-foreground">{p.job}</p></div>
            <div className="text-right"><p className="text-2xl font-extrabold">{pct}%</p><p className="text-[10px] text-muted-foreground">semelhança</p></div>
          </div>
          {common.length > 0 && (<><p className="mt-3 text-xs font-bold text-muted-foreground">Em comum</p><div className="mt-1 flex flex-wrap gap-1.5">{common.map((t) => <Tag key={t} dim={dimOf(t)!}>{t}</Tag>)}</div></>)}
          {diff.length > 0 && (<><p className="mt-3 text-xs font-bold text-muted-foreground">Diferente</p><div className="mt-1 flex flex-wrap gap-1.5">{diff.map((t) => <Tag key={t} dim={dimOf(t)!} soft>{t}</Tag>)}</div></>)}
        </Card>
      ))}
      <NextLink to="/funcoes">Ver funções ideais</NextLink>
    </Shell>
  );
}
