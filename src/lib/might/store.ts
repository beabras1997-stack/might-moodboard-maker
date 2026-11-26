import { useSyncExternalStore } from "react";
import type { Triple } from "./data";

export type Status = "pending" | "accepted" | "declined";
export interface Received { id: string; from: string; circle: string; tags: Triple; status: Status }
export interface Sent { id: string; to: string; circle: string; tags: Triple }
export interface Request { id: string; to: string; circle: string; answered: boolean }
export interface State {
  self: Triple | null;
  avatar: number;
  received: Received[];
  sent: Sent[];
  requests: Request[];
}

const KEY = "might-state-v1";
export const initialState = (): State => ({
  self: null,
  avatar: 0,
  received: [
    { id: "r1", from: "ana", circle: "Trabalho", tags: { pers: "Criativa", power: "Comunicar", char: "Honesta" }, status: "accepted" },
    { id: "r2", from: "joao", circle: "Amigos", tags: { pers: "Divertida", power: "Inspirar", char: "Leal" }, status: "accepted" },
    { id: "r3", from: "ines", circle: "Família", tags: { pers: "Criativa", power: "Comunicar", char: "Generosa" }, status: "accepted" },
    { id: "r4", from: "marta", circle: "Escola", tags: { pers: "Curiosa", power: "Criar", char: "Honesta" }, status: "pending" },
  ],
  sent: [],
  requests: [],
});
const SERVER = initialState();
let state: State = SERVER;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

export function hydrateStore() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { state = { ...initialState(), ...JSON.parse(raw) }; emit(); }
  } catch { /* ignore */ }
}
export function setState(fn: (s: State) => State) {
  state = fn(state);
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  emit();
}
export function resetStore() { setState(() => initialState()); }
export function useStore(): State {
  return useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => state, () => SERVER);
}
export const uid = () => Math.random().toString(36).slice(2, 10);
