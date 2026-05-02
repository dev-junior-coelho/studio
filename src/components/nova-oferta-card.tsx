'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart, X, CreditCard, Loader2, Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DependentesDescontoInfo } from '@/components/dependentes-desconto-info';
import type { ProductType, Produto } from '@/lib/types';

interface NovaOfertaCardProps {
    products: Produto[];
    debitoEmConta: boolean;
    setDebitoEmConta: (val: boolean) => void;
    descontoDCC: number;
    totalMensal: number;
    totalComDesconto: number;
    removeProduct: (id: string) => void;
    handleRecuseOffer?: () => void;
    handleAcceptOffer?: () => void;
    isSaving?: boolean;
    formatCurrency: (val: number) => string;
    getIconForType: (type: string) => React.ReactNode;
}

export function NovaOfertaCard({
    products,
    debitoEmConta,
    setDebitoEmConta,
    descontoDCC,
    totalMensal,
    totalComDesconto,
    removeProduct,
    handleRecuseOffer,
    handleAcceptOffer,
    isSaving = false,
    formatCurrency,
    getIconForType
}: NovaOfertaCardProps) {
    const showActions = !!handleRecuseOffer && !!handleAcceptOffer;
    return (
        <Card className="border border-slate-200 bg-white shadow-xl hover:shadow-2xl rounded-3xl flex flex-col shrink-0 h-fit min-h-[420px] max-h-[85vh] overflow-hidden animate-in fade-in duration-500 transition-all">
            <CardHeader className="p-5 pb-4 bg-red-500 text-white flex flex-col gap-3 rounded-t-3xl">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                            <ShoppingCart className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-lg font-black tracking-tight truncate">Nova Oferta</CardTitle>
                    </div>
                    <span className="text-xs font-bold rounded-full bg-white/20 border border-white/20 px-3 py-1">
                        {products.length} item(ns)
                    </span>
                </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-5">
                <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100/80 mb-4 transition-all duration-300">
                    <Label htmlFor="debitoConta" className="text-xs font-bold text-gray-800 cursor-pointer select-none leading-tight">
                        DCC + Fatura Digital
                    </Label>
                    <Switch
                        id="debitoConta"
                        checked={debitoEmConta}
                        onCheckedChange={setDebitoEmConta}
                        className="data-[state=checked]:bg-red-500"
                    />
                </div>
                {products.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed border-slate-200 rounded-3xl p-6">
                        <ShoppingCart className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-sm font-semibold">Sua oferta está vazia</p>
                        <p className="text-xs">Selecione produtos para começar.</p>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 -mx-1 px-1">
                            <ul className="space-y-3 pb-2">
                                {products.map(product => (
                                    <li key={product.id} className="group bg-white border border-slate-200 p-3 rounded-2xl hover:shadow-md hover:border-red-100/50 transition-all duration-300 transform hover:-translate-y-0.5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex items-start gap-2.5">
                                                <div className="mt-0.5 h-10 w-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center border border-red-50/50 shrink-0 group-hover:bg-red-100 group-hover:text-red-600 transition-colors duration-300">
                                                    {getIconForType(product.tipo)}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-xs font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300 truncate" title={product.nome}>
                                                        {product.nome}
                                                    </div>
                                                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
                                                        <span className="truncate font-medium">{product.tipo}</span>
                                                        {product.fidelidade && product.fidelidade !== "Sem fidelidade" ? (
                                                            <span className="rounded-md border border-red-200/50 bg-red-50 px-1.5 py-0.5 text-red-700 font-semibold">
                                                                {product.fidelidade}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="shrink-0 flex flex-col items-end gap-1 min-w-[96px]">
                                                <div className="text-sm font-black text-red-500 leading-none font-mono tabular-nums whitespace-nowrap">
                                                    {formatCurrency(product.precoMensal)}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
                                                    onClick={() => removeProduct(product.id)}
                                                    title="Remover item"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </ScrollArea>

                        {/* DCC Info */}
                        {debitoEmConta && descontoDCC > 0 && (
                            <div className="mt-3 text-xs bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-emerald-900 flex items-center justify-center gap-2 animate-in slide-in-from-bottom duration-300">
                                <CreditCard className="h-3.5 w-3.5" />
                                <span className="font-medium">Desconto de <strong className="font-black">{formatCurrency(descontoDCC)}</strong> aplicado.</span>
                            </div>
                        )}

                        <div className="mt-2">
                            <DependentesDescontoInfo />
                        </div>
                    </>
                )}
            </CardContent>

            <CardFooter className="bg-gray-50/50 border-t border-slate-200 p-5 flex flex-col gap-4 mt-auto rounded-b-3xl">
                {/* Totals Section */}
                <div className="w-full space-y-1">
                    {debitoEmConta && descontoDCC > 0 && (
                        <div className="flex justify-between items-center w-full text-xs text-muted-foreground">
                            <span className="font-medium">Subtotal</span>
                            <span className="line-through font-mono">{formatCurrency(totalMensal)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-end w-full">
                        <span className="font-bold text-gray-800 text-sm">Total mensal</span>
                        <div className="text-right leading-none">
                            <span className="text-3xl font-black text-red-500 tracking-tight font-mono">{formatCurrency(totalComDesconto)}</span>
                        </div>
                    </div>
                </div>

                {/* Universal Actions */}
                {showActions && products.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 w-full pt-1">
                        <Button
                            variant="outline"
                            size="lg"
                            className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-800 rounded-full h-11 text-xs font-black shadow-sm transform active:scale-95 transition-all select-none cursor-pointer flex items-center justify-center"
                            onClick={handleRecuseOffer}
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 mr-1.5" />}
                            Recusar
                        </Button>
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-red-600 via-red-500 to-red-400 hover:brightness-110 text-white rounded-full h-11 text-xs font-black shadow-md transform active:scale-95 transition-all select-none border-0 cursor-pointer flex items-center justify-center"
                            onClick={handleAcceptOffer}
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1.5" />}
                            Aceitar
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
