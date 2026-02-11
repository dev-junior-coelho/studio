"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, Search, ShoppingBasket, Tv, History, User, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/builder", label: "Montador", icon: ShoppingBasket },
  { href: "/historico", label: "Histórico", icon: History },
  { href: "/channels", label: "Canais", icon: Tv },
  { href: "/perfil", label: "Perfil", icon: User },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 border-t bg-card text-card-foreground shadow-t-lg md:left-auto md:right-auto md:w-full md:max-w-lg md:mx-auto">
      <div className="grid h-full grid-cols-5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
