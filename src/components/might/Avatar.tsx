import a1 from "@/assets/avatars/avatar_01.png.asset.json";
import a2 from "@/assets/avatars/avatar_02.png.asset.json";
import a3 from "@/assets/avatars/avatar_03.png.asset.json";
import a4 from "@/assets/avatars/avatar_04.png.asset.json";
import a5 from "@/assets/avatars/avatar_05.png.asset.json";
import a6 from "@/assets/avatars/avatar_06.png.asset.json";
import a7 from "@/assets/avatars/avatar_07.png.asset.json";
import a8 from "@/assets/avatars/avatar_08.png.asset.json";
import a9 from "@/assets/avatars/avatar_09.png.asset.json";
import { cn } from "@/lib/utils";

export const AVATARS = [a1, a2, a3, a4, a5, a6, a7, a8, a9].map((a) => a.url);

export function Avatar({ i, className }: { i: number; className?: string }) {
  return <img src={AVATARS[i % AVATARS.length]} alt="Figura MighT" className={cn("object-contain", className)} />;
}
