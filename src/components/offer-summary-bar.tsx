"use client";

import { useOffer } from '@/contexts/offer-context';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Zap, TrendingDown, TrendingUp, LogOut, Wallet, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OfferSummaryBar() {
    const { products, gastos, totalMensal, totalComDesconto } = useOffer();
    const { logout } = useAuth();

    const alaCarteTotal = gastos.outros.reduce((acc, item) => acc + (Number(item.value) || 0), 0);
    const totalGastoAtual = gastos.tv + gastos.internet + gastos.fixo + gastos.movel + gastos.wifiMesh + alaCarteTotal;
    const novaOfertaTotal = totalComDesconto;
    const economiaMensal = totalGastoAtual - novaOfertaTotal;
    const economiaAnual = economiaMensal * 12;

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const showEconomia = totalGastoAtual > 0;

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm select-none animate-in fade-in duration-300">
            <div className="max-w-none mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-red-500 p-1.5 rounded-xl shadow-sm">
                            <Zap className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-base font-black tracking-tight leading-tight text-slate-800">Studio</span>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={logout}
                        className="text-slate-400 hover:text-slate-800 hover:bg-slate-50 h-9 w-9 rounded-xl p-0 transition-all duration-300"
                        title="Sair"
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center justify-between mt-3 gap-2 select-all">
                    {/* ATUAL Pill */}
                    <div className="bg-white px-3 py-1.5 rounded-full border border-slate-200/80 shadow-sm flex items-center justify-center gap-1.5 select-none h-9 flex-1 transition-all">
                        <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase select-none">Atual</span>
                        <span className="font-extrabold text-slate-700 tabular-nums text-xs">
                            {totalGastoAtual > 0 ? formatCurrency(totalGastoAtual) : 'R$ 0,00'}
                        </span>
                    </div>

                    {/* NOVA Pill - Light Salmon/Pink */}
                    <div className="bg-red-50 border border-red-100 px-3 py-1.5 rounded-full shadow-sm flex items-center justify-center gap-1.5 h-9 flex-1 transition-all select-none">
                        <span className="text-[9px] font-black tracking-wider text-red-400 uppercase select-none">Nova</span>
                        <span className="font-extrabold text-red-500 tabular-nums text-xs">
                            {novaOfertaTotal > 0 ? formatCurrency(novaOfertaTotal) : 'R$ 0,00'}
                        </span>
                    </div>

                    {/* ECONOMIA Pill - Gradient Red */}
                    {showEconomia && (
                        <div className={cn(
                            "flex items-center justify-center gap-1 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider h-9 select-none shadow-sm transition-all duration-300 border border-red-500/10 cursor-default flex-1",
                            economiaMensal >= 0
                                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-500/10"
                                : "bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-500/10"
                        )}>
                            {economiaMensal >= 0 ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
                            <span className="tabular-nums font-black text-xs">
                                {formatCurrency(Math.abs(economiaMensal))}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
