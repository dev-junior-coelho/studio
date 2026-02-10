"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, ShoppingBasket, Tv, History, User, LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/historico", label: "Histórico", icon: History },
    { href: "/channels", label: "Grade de Canais", icon: Tv },
    { href: "/perfil", label: "Meu Perfil", icon: User },
];

export function DesktopSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className="hidden lg:flex w-64 flex-col border-r bg-card h-screen sticky top-0 left-0 shadow-sm">
            <div className="h-16 flex items-center px-6 border-b">
                <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                    Studio App
                </span>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-accent/50 group",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-gray-500 group-hover:text-foreground")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t bg-gray-50/50">
                <Button
                    variant="outline"
                    className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-red-50 border-gray-200"
                    onClick={() => logout()}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair do Sistema
                </Button>
            </div>
        </aside>
    );
}
