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
    handleRecuseOffer: () => void;
    handleAcceptOffer: () => void;
    isSaving: boolean;
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
    isSaving,
    formatCurrency,
    getIconForType
}: NovaOfertaCardProps) {
    return (
        <Card className="border-t-4 border-t-primary shadow-md flex flex-col shrink-0 h-full">
            <CardHeader className="pb-3 pt-4">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">Nova Oferta</CardTitle>
                        </div>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border">
                        <Label htmlFor="debitoConta" className="text-xs font-medium cursor-pointer select-none leading-tight">
                            DCC + Fatura Digital
                        </Label>
                        <Switch
                            id="debitoConta"
                            checked={debitoEmConta}
                            onCheckedChange={setDebitoEmConta}
                            className="h-4 w-8"
                        />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-4 pt-0">
                {products.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed rounded-lg p-6 my-2">
                        <ShoppingCart className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-sm">Carrinho vazio</p>
                        <p className="text-xs">Adicione itens ao lado.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 -mx-2 px-2">
                            <ul className="space-y-2 pb-2">
                                {products.map(product => (
                                    <li key={product.id} className="group bg-white border rounded-lg p-2 hover:shadow-sm transition-shadow relative">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="space-y-0.5 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={cn("p-1 rounded-md shrink-0",
                                                        product.tipo === 'Movel' ? 'bg-purple-100 text-purple-700' :
                                                            product.tipo === 'Banda Larga' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-gray-100 text-gray-700'
                                                    )}>
                                                        {getIconForType(product.tipo)}
                                                    </div>
                                                    <span className="font-semibold text-xs truncate block max-w-[140px]" title={product.nome}>{product.nome}</span>
                                                </div>
                                                <div className="text-[10px] text-muted-foreground pl-7 flex gap-1 items-center">
                                                    {product.fidelidade && product.fidelidade !== 'Sem fidelidade' && (
                                                        <span className="text-orange-600 font-medium text-[9px] border border-orange-200 px-1 rounded-sm">{product.fidelidade}</span>
                                                    )}
                                                    <span className="truncate">{product.tipo}</span>
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0 flex flex-col items-end gap-1">
                                                <span className="font-bold text-primary block text-sm">
                                                    {formatCurrency(product.precoMensal)}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-red-50"
                                                    onClick={() => removeProduct(product.id)}
                                                    title="Remover item"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* DCC Info */}
                        {debitoEmConta && descontoDCC > 0 && (
                            <div className="mt-2 text-xs bg-green-50 border border-green-200 rounded p-1.5 text-green-800 flex items-center justify-center gap-1.5">
                                <CreditCard className="h-3 w-3" />
                                <span>Desconto de {formatCurrency(descontoDCC)} aplicado.</span>
                            </div>
                        )}

                        <div className="mt-2">
                            <DependentesDescontoInfo />
                        </div>
                    </>
                )}
            </CardContent>

            <CardFooter className="bg-gray-50 border-t p-4 rounded-b-lg flex flex-col gap-3 mt-auto">
                {/* Totals Section */}
                <div className="w-full space-y-1">
                    {debitoEmConta && descontoDCC > 0 && (
                        <div className="flex justify-between items-center w-full text-xs text-muted-foreground">
                            <span>Original</span>
                            <span className="line-through">{formatCurrency(totalMensal)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-end w-full">
                        <span className="font-semibold text-gray-700">Total Mensal</span>
                        <div className="text-right leading-none">
                            <span className="text-2xl font-bold text-primary">{formatCurrency(totalComDesconto)}</span>
                        </div>
                    </div>
                </div>

                {/* Universal Actions */}
                {products.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 w-full pt-2 mt-1 border-t border-gray-200">
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-white border-red-200 text-red-700 hover:bg-red-50 h-8 text-xs"
                            onClick={handleRecuseOffer}
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3 mr-1" />}
                            Recusar
                        </Button>
                        <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs"
                            onClick={handleAcceptOffer}
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3 mr-1" />}
                            Aceitar
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
