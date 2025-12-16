"use client";

import { useOffer } from '@/contexts/offer-context';
import { Zap, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo, useState, useEffect } from 'react';

export function OfferSummaryBar() {
    const { products, gastos, totalMensal } = useOffer();

    // Need to get this state here or from context if propagated... 
    // IMPORTANT: For simplicity and since we can't easily share the "debitoEmConta" state globally 
    // without moving it to context, we will compute values based on what we have in context (products, gastos).
    // Ideally, 'debitoEmConta' should be in the context if it affects global price.
    // For now, let's assume standard pricing in the header to avoid complexity or update context later.

    // Actually, the prompt implies "Current Values, New Claro, Economy".
    // The 'totalMensal' from context is sum of products prices.
    // The 'gastos' from context are the current customer spendings.

    const totalGastoAtual = Object.values(gastos).reduce((acc, val) => acc + val, 0);

    // We don't have access to 'debitoEmConta' state here unless we move it to context.
    // We'll use the base totalMensal for now, which is safer than guessing.
    const novaOfertaTotal = totalMensal;

    const economiaMensal = totalGastoAtual - novaOfertaTotal;

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // Hide if no products and no expenses set, maybe? Or always show? 
    // User asked for "fixed in all screens", so likely always show.

    return (
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm mb-6 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full hidden sm:block">
                        <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <h1 className="text-xl font-bold text-foreground">Studio Claro</h1>
                </div>

                <div className="flex items-center gap-3 sm:gap-8 text-xs sm:text-base">
                    <div className="text-right">
                        <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide font-semibold">Atual</p>
                        <p className="font-bold text-gray-600">{formatCurrency(totalGastoAtual)}</p>
                    </div>

                    <div className="h-6 sm:h-8 w-px bg-gray-200" />

                    <div className="text-right">
                        <p className="text-[10px] sm:text-xs text-primary uppercase tracking-wide font-semibold">Nova</p>
                        <p className="font-bold text-primary text-lg leading-tight">{formatCurrency(novaOfertaTotal)}</p>
                    </div>

                    <div className={cn(
                        "px-2 sm:px-3 py-1 rounded-md font-bold flex items-center gap-1",
                        economiaMensal >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                        {economiaMensal >= 0 ? <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" /> : <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />}
                        {formatCurrency(Math.abs(economiaMensal))}
                    </div>
                </div>
            </div>
        </div>
    );
}
