import { createFileRoute } from "@tanstack/react-router";
import { Shell, Card, Tag, NextLink } from "@/components/might/ui";
import { aggregate, dimOf, myWords, recommendRoles } from "@/lib/might/logic";
import { useStore } from "@/lib/might/store";
import { meta } from "@/lib/might/meta";

export const Route = createFileRoute("/funcoes")({
  head: () => meta("Funções ideais — MighT", "Funções e carreiras que podem encaixar no teu perfil."),
  component: RolesPage,
});

function RolesPage() {
  const s = useStore();
  const words = myWords(s.self, aggregate(s.received.filter((r) => r.status === "accepted")));
  const roles = recommendRoles(words);
  return (
    <Shell step="6 · Funções" title="Funções ideais" intro="Hipóteses para explorar com base nas tuas palavras — não são certezas, são pontos de partida.">
      {roles.length === 0 && <NextLink to="/">Cria o teu MighT primeiro</NextLink>}
      {roles.map((r, i) => (
        <Card key={r.name}>
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Hipótese {i + 1}</p>
          <h2 className="text-xl font-extrabold">{r.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">Pode encaixar porque: {r.why}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">{r.matched.map((t) => <Tag key={t} dim={dimOf(t)!}>{t}</Tag>)}</div>
          <ol className="mt-4 space-y-2 border-l-2 border-dashed pl-4">
            {(["Agora", "Próximo", "Desafio"] as const).map((step, j) => (
              <li key={step} className="relative">
                <span className={`absolute -left-[1.4rem] top-1 h-3 w-3 rounded-full ${j === 0 ? "bg-pers" : j === 1 ? "bg-power" : "bg-char"}`} />
                <p className="text-xs font-bold uppercase">{step}</p>
                <p className="text-sm">{r.path[j]}</p>
              </li>
            ))}
          </ol>
        </Card>
      ))}
      <NextLink to="/">Voltar ao meu MighT</NextLink>
    </Shell>
  );
}
