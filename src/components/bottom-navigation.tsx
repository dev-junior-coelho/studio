"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, Search, ShoppingBasket, Tv, History, User, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Início", icon: LayoutDashboard },
  { href: "/builder", label: "Montador", icon: ShoppingBasket },
  { href: "/historico", label: "Histórico", icon: History },
  { href: "/channels", label: "Canais", icon: Tv },
  { href: "/perfil", label: "Perfil", icon: User },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 border-t border-slate-200 bg-white text-slate-800 shadow-lg md:left-auto md:right-auto md:w-full md:max-w-lg md:mx-auto select-none">
      <div className="grid h-full grid-cols-5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-[10px] font-black uppercase tracking-wider transition-all duration-300",
                isActive ? "text-red-500" : "text-slate-400 hover:text-slate-800"
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
