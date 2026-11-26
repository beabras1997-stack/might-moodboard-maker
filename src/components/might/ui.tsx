import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Send, Layers, IdCard, Users, Compass } from "lucide-react";
import type { Dim } from "@/lib/might/data";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "O meu", icon: Sparkles },
  { to: "/enviar", label: "Enviar", icon: Send },
  { to: "/all", label: "All", icon: Layers },
  { to: "/card", label: "Card", icon: IdCard },
  { to: "/descobrir", label: "Pessoas", icon: Users },
  { to: "/funcoes", label: "Funções", icon: Compass },
] as const;

export const dimBg: Record<Dim, string> = { pers: "bg-pers text-primary-foreground", power: "bg-power text-primary-foreground", char: "bg-char text-primary-foreground" };
export const dimSoft: Record<Dim, string> = { pers: "bg-pers-soft text-pers", power: "bg-power-soft text-power", char: "bg-char-soft text-char" };
export const dimText: Record<Dim, string> = { pers: "text-pers", power: "text-power", char: "text-char" };

export function Logo() {
  return (
    <span className="text-2xl font-extrabold tracking-tight">
      Migh<span className="text-pers">T</span>
    </span>
  );
}

export function Shell({ step, title, intro, children }: { step: string; title: string; intro?: string; children: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="mx-auto min-h-screen max-w-md pb-28">
      <header className="flex items-center justify-between px-5 pt-5">
        <Link to="/"><Logo /></Link>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">{step}</span>
      </header>
      <motion.main key={pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="px-5 pt-4">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight">{title}</h1>
        {intro && <p className="mt-2 text-muted-foreground">{intro}</p>}
        <div className="mt-6 space-y-5">{children}</div>
      </motion.main>
      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-3 pb-3">
        <div className="grid grid-cols-6 rounded-3xl border bg-card/95 p-1.5 shadow-lg backdrop-blur">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link key={to} to={to} className={cn("flex flex-col items-center gap-0.5 rounded-2xl py-2 text-[11px] font-semibold transition", active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-3xl border bg-card p-5 shadow-sm", className)}>{children}</div>;
}

export function Tag({ dim, children, active, onClick, soft }: { dim: Dim; children: React.ReactNode; active?: boolean; onClick?: () => void; soft?: boolean }) {
  const cls = cn("rounded-full px-3.5 py-1.5 text-sm font-semibold transition", active || (!onClick && !soft) ? dimBg[dim] : dimSoft[dim], onClick && "active:scale-95");
  return onClick ? <button type="button" onClick={onClick} className={cls}>{children}</button> : <span className={cls}>{children}</span>;
}

export function Btn({ className, variant = "dark", ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "dark" | "light" }) {
  return <button {...p} className={cn("w-full rounded-2xl px-5 py-3.5 font-bold transition active:scale-[0.98] disabled:opacity-40", variant === "dark" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground", className)} />;
}

export function NextLink({ to, children }: { to: (typeof NAV)[number]["to"]; children: React.ReactNode }) {
  return <Link to={to} className="block w-full rounded-2xl bg-accent px-5 py-3.5 text-center font-bold text-accent-foreground">{children} →</Link>;
}
