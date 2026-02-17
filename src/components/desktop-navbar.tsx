"use client";

import { useOffer } from '@/contexts/offer-context';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Zap, TrendingDown, TrendingUp, LogOut, Wallet, ShoppingBag, LayoutDashboard, History, Tv, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function DesktopNavbar() {
    const { products, gastos, totalMensal, totalComDesconto } = useOffer();
    const { logout } = useAuth();
    const pathname = usePathname();

    const alaCarteTotal = gastos.outros.reduce((acc, item) => acc + (Number(item.value) || 0), 0);
    const totalGastoAtual = gastos.tv + gastos.internet + gastos.fixo + gastos.movel + gastos.wifiMesh + alaCarteTotal;
    const novaOfertaTotal = totalComDesconto;
    const economiaMensal = totalGastoAtual - novaOfertaTotal;

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const showEconomia = totalGastoAtual > 0;

    const navItems = [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/builder", label: "Montador", icon: ShoppingBag },
        { href: "/historico", label: "Histórico", icon: History },
        { href: "/channels", label: "Canais", icon: Tv },
        { href: "/perfil", label: "Perfil", icon: User },
    ];

    return (
        <header className="hidden lg:block sticky top-0 z-50 bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white shadow-md h-16 border-b border-red-700">
            <div className="w-full h-full px-8 flex items-center justify-between gap-8">

                {/* 1. Left Section: Logo & Navigation */}
                <div className="flex items-center gap-8 flex-1">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
                        <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm group-hover:bg-white/30 transition-all">
                            <Zap className="h-5 w-5 text-white fill-white" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">
                            Studio
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-white/20 text-white"
                                            : "text-white/70 hover:bg-white/10 hover:text-white"
                                    )}
                                >
                                    <item.icon className={cn("h-4 w-4", isActive && "fill-current")} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* 2. Middle Section: Values Summary */}
                <div className="flex items-center gap-4 bg-black/20 px-4 py-2 rounded-full border border-white/10 flex-shrink-0 backdrop-blur-sm">
                    {/* Atual */}
                    <div className="flex items-center gap-2 px-2 border-r border-white/20">
                        <span className="text-xs uppercase font-semibold text-white/70">Atual</span>
                        <span className="font-bold text-white">
                            {totalGastoAtual > 0 ? formatCurrency(totalGastoAtual) : 'R$ 0,00'}
                        </span>
                    </div>

                    {/* Nova */}
                    <div className="flex items-center gap-2 px-2">
                        <span className="text-xs uppercase font-semibold text-white/90">Nova</span>
                        <span className="font-bold text-white text-lg">
                            {novaOfertaTotal > 0 ? formatCurrency(novaOfertaTotal) : 'R$ 0,00'}
                        </span>
                    </div>

                    {/* Economia Pill */}
                    {showEconomia && (
                        <div className={cn(
                            "flex items-center gap-1.5 px-3 py-0.5 rounded-full text-sm font-bold ml-2",
                            economiaMensal >= 0
                                ? "bg-emerald-500 text-white"
                                : "bg-yellow-500 text-yellow-900"
                        )}>
                            {economiaMensal >= 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                            {formatCurrency(Math.abs(economiaMensal))}
                        </div>
                    )}
                </div>

                {/* 3. Right Section: Logout */}
                <div className="flex-shrink-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => logout()}
                        className="text-white/80 hover:text-white hover:bg-white/20 gap-2"
                    >
                        <span className="text-sm font-medium">Sair</span>
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>

            </div>
        </header>
    );
}
