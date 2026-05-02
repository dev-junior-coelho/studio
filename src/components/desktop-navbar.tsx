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
    const economiaAnual = economiaMensal * 12;

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const showEconomia = totalGastoAtual > 0;

    const navItems = [
        { href: "/", label: "Início", icon: LayoutDashboard },
        { href: "/builder", label: "Montador", icon: ShoppingBag },
        { href: "/historico", label: "Histórico", icon: History },
        { href: "/channels", label: "Canais", icon: Tv },
        { href: "/perfil", label: "Perfil", icon: User },
    ];

    return (
        <header className="hidden lg:block sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm h-16 select-none animate-in fade-in duration-300">
            <div className="w-full h-full px-8 flex items-center justify-between gap-8">

                {/* 1. Left Section: Logo & Navigation */}
                <div className="flex items-center gap-8 flex-1">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
                        <div className="bg-red-500 p-2 rounded-2xl shadow-sm group-hover:bg-red-600 transition-all duration-300">
                            <Zap className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-base font-black text-slate-800 tracking-tight leading-tight select-none">
                            Studio
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-1.5">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 select-none",
                                        isActive
                                            ? "bg-red-50 text-red-500 font-black"
                                            : "text-slate-400 hover:bg-slate-50 hover:text-slate-800"
                                    )}
                                >
                                    <item.icon className="h-3.5 w-3.5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* 2. Middle Section: Values Summary */}
                <div className="flex items-center gap-3 flex-shrink-0 select-all">
                    {/* ATUAL Pill */}
                    <div className="bg-white px-4 py-2 rounded-full border border-slate-200/80 shadow-sm flex items-center gap-2 select-none h-10 transition-all">
                        <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase select-none">Atual</span>
                        <span className="font-extrabold text-slate-700 tabular-nums text-sm">
                            {totalGastoAtual > 0 ? formatCurrency(totalGastoAtual) : 'R$ 0,00'}
                        </span>
                    </div>

                    {/* NOVA Pill - Light Salmon/Pink */}
                    <div className="bg-red-50 border border-red-100 px-4 py-2 rounded-full shadow-sm flex items-center gap-2 h-10 transition-all select-none">
                        <span className="text-[10px] font-black tracking-wider text-red-400 uppercase select-none">Nova</span>
                        <span className="font-extrabold text-red-500 tabular-nums text-sm">
                            {novaOfertaTotal > 0 ? formatCurrency(novaOfertaTotal) : 'R$ 0,00'}
                        </span>
                    </div>

                    {/* Economia Pill */}
                    {showEconomia && (
                        <div className={cn(
                            "flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-black uppercase tracking-wider h-10 select-none shadow-sm transition-all duration-300 border border-red-500/10 cursor-default",
                            economiaMensal >= 0
                                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-500/10"
                                : "bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-500/10"
                        )}>
                            {economiaMensal >= 0 ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
                            <span className="tabular-nums font-black">
                                {formatCurrency(Math.abs(economiaMensal))}
                            </span>
                        </div>
                    )}
                </div>

                {/* 3. Right Section: Logout */}
                <div className="flex-shrink-0 select-none">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => logout()}
                        className="text-slate-400 hover:text-slate-800 hover:bg-slate-50 gap-2 rounded-2xl text-xs font-black uppercase tracking-wider h-10 px-4 transition-all duration-300"
                    >
                        <span>Sair</span>
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>

            </div>
        </header>
    );
}
