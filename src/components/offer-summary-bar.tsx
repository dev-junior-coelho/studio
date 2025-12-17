"use client";

import { useOffer } from '@/contexts/offer-context';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Zap, TrendingDown, TrendingUp, LogOut, Wallet, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OfferSummaryBar() {
    const { products, gastos, totalMensal } = useOffer();
    const { logout } = useAuth();

    const totalGastoAtual = Object.values(gastos).reduce((acc, val) => acc + val, 0);
    const novaOfertaTotal = totalMensal;
    const economiaMensal = totalGastoAtual - novaOfertaTotal;

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // Só mostrar economia se houver gastos informados
    const showEconomia = totalGastoAtual > 0;

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-3 py-2.5">
                {/* Logo e Logout */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                            <Zap className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">Studio</span>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={logout}
                        className="text-white/80 hover:text-white hover:bg-white/10 h-8 px-2"
                        title="Sair"
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>

                {/* Valores - Layout Compacto */}
                <div className="flex items-center justify-between mt-2 gap-2">
                    {/* Valor Atual */}
                    <div className="flex-1 bg-white/10 rounded-lg px-3 py-1.5 backdrop-blur-sm">
                        <div className="flex items-center gap-1.5">
                            <Wallet className="h-3.5 w-3.5 text-white/70" />
                            <span className="text-[10px] uppercase tracking-wider text-white/70 font-medium">Atual</span>
                        </div>
                        <p className="text-lg font-bold leading-none mt-0.5">
                            {totalGastoAtual > 0 ? formatCurrency(totalGastoAtual) : '—'}
                        </p>
                    </div>

                    {/* Nova Oferta */}
                    <div className="flex-1 bg-white/20 rounded-lg px-3 py-1.5 backdrop-blur-sm border border-white/30">
                        <div className="flex items-center gap-1.5">
                            <ShoppingBag className="h-3.5 w-3.5 text-white" />
                            <span className="text-[10px] uppercase tracking-wider text-white font-medium">Nova</span>
                        </div>
                        <p className="text-lg font-bold text-white leading-none mt-0.5">
                            {novaOfertaTotal > 0 ? formatCurrency(novaOfertaTotal) : '—'}
                        </p>
                    </div>

                    {/* Economia/Diferença */}
                    {showEconomia && (
                        <div className={cn(
                            "flex-1 rounded-lg px-3 py-1.5 text-center",
                            economiaMensal >= 0
                                ? "bg-green-500 text-white"
                                : "bg-yellow-500 text-yellow-900"
                        )}>
                            <div className="flex items-center justify-center gap-1">
                                {economiaMensal >= 0 ? (
                                    <TrendingDown className="h-3.5 w-3.5" />
                                ) : (
                                    <TrendingUp className="h-3.5 w-3.5" />
                                )}
                                <span className="text-[10px] uppercase tracking-wider font-medium">
                                    {economiaMensal >= 0 ? 'Economia' : 'Aumento'}
                                </span>
                            </div>
                            <p className="text-lg font-bold leading-none mt-0.5">
                                {formatCurrency(Math.abs(economiaMensal))}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
