"use client";

import { useState, useMemo } from 'react';
import { useOffer } from '@/contexts/offer-context';
import type { ProductType, Produto, Regiao } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlusCircle, Loader2, XCircle, ChevronsUpDown, Check, Search, ChevronDown, ChevronUp, Smartphone, Wifi, Tv2, Phone, Boxes, Sparkles } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, CollectionReference } from 'firebase/firestore';
import { useFirebase, useMemoFirebase } from '@/firebase/provider';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn, normalizeText } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InfoPontosAdicionais } from '@/components/info-pontos-adicionais';
import { MAPEAMENTO_TV_TECNOLOGIA, HIERARQUIA_TECNOLOGIA, REGRAS_HIERARQUIA_PA } from '@/lib/pontos-adicionais';

const productTypes: ProductType[] = ["Movel", "Dependente Móvel", "Banda Larga", "TV Cabeada", "TV Box", "Claro TV APP", "Fixo", "Serviços Avançados", "Ponto Adicional", "Opcional"];
const typeDisplayNames: Record<ProductType, string> = {
    "Movel": "Móvel",
    "Dependente Móvel": "Dependente Móvel",
    "Banda Larga": "Banda Larga",
    "TV Cabeada": "TV Cabeada",
    "TV Box": "TV Box",
    "Claro TV APP": "Claro TV APP",
    "Fixo": "Fixo",
    "Serviços Avançados": "Serviços Avançados",
    "Ponto Adicional": "Ponto Adicional",
    "Opcional": "A La Carte"
};

function ProductCard({ product }: { product: Produto }) {
    const { products, addProduct, removeProduct } = useOffer();
    const [dependentesQty, setDependentesQty] = useState(1);
    const [isExpanded, setIsExpanded] = useState(false);

    const price = product.precoMensal;
    const isPriceValid = typeof price === 'number' && price > 0;
    const sanitizedBenefits = (product.beneficios || []).filter((b) => !b.toLowerCase().includes("chatgpt"));

    const precoAposPromo = product.observacoes?.match(/após R\$\s*([0-9]+[,.]?[0-9]*)/i)?.[1];
    const precoAposPromoFormatted = precoAposPromo ? parseFloat(precoAposPromo.replace(',', '.')) : null;

    const imageMap: { [key: string]: string } = {
        'Movel': 'movel',
        'Banda Larga': 'banda-larga',
        'TV': 'tv',
        'Fixo': 'fixo',
        'Opcional': 'fixo',
        'Ponto Adicional': 'tv',
        'Dependente Móvel': 'movel',
        'Serviços Avançados': 'banda-larga'
    }
    const placeholder = PlaceHolderImages.find(p => p.id === imageMap[product.tipo]);

    const isAdded = products.some(p => p.id === product.id || p.id.startsWith(`${product.id}-`));

    const handleAddClick = () => {
        const addedItem = products.find(p => p.id === product.id || p.id.startsWith(`${product.id}-`));
        if (addedItem) {
            removeProduct(addedItem.id);
        } else {
            if (product.tipo === 'Dependente Móvel') {
                for (let i = 0; i < dependentesQty; i++) {
                    addProduct(product);
                }
            } else {
                addProduct(product);
            }
        }
    };

    // Desabilitar botão para o produto específico
    const isDisabledSpecial = product.nome.trim().toLowerCase() === "claro pós 50gb + 10gb bônus (multi md)".toLowerCase();

    return (
        <Card className="flex flex-col h-full border border-slate-200/80 hover:border-red-300 hover:shadow-xl bg-white rounded-3xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-gradient-to-br from-red-50 via-white to-red-50/70 p-4 pb-2 relative flex flex-col justify-between min-h-[140px]">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-black bg-white border border-slate-100 rounded-xl px-2.5 py-1 select-none">
                        {typeDisplayNames[product.tipo]}
                    </span>
                </div>
                {placeholder && (
                    <div className="h-20 w-full flex items-center justify-center select-none py-1">
                        <Image
                            src={placeholder.imageUrl}
                            alt={product.nome}
                            width={56}
                            height={56}
                            className="opacity-95 transition-transform hover:scale-110 duration-300 select-none object-contain"
                        />
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow bg-white">
                <CardTitle className="text-base font-black text-black leading-snug min-h-[44px] mb-2 line-clamp-2 select-none">
                    {product.nome}
                </CardTitle>

                <div className="mb-4">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 select-none">Preço mensal</p>
                    <p className="text-2xl font-black text-[#e60012] font-mono tracking-tight">
                        {isPriceValid ? (
                            <>
                                {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </>
                        ) : (
                            <span className="text-sm text-slate-400 font-bold uppercase tracking-wide">Preço indisponível</span>
                        )}
                    </p>
                    {precoAposPromoFormatted && product.tipo === 'Banda Larga' && (
                        <p className="text-xs text-muted-foreground font-semibold mt-1">
                            Após promoção: {precoAposPromoFormatted.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                    )}
                    {product.tipo === 'Serviços Avançados' && product.nome === 'Ponto Ultra' && (
                        <p className="text-xs text-yellow-900 font-semibold mt-2 bg-yellow-500/10 border border-yellow-500/30 p-2 rounded-lg">
                            Taxa única: R$ 150,00 ou 3x R$ 50,00
                        </p>
                    )}
                </div>

                {product.tipo === 'Dependente Móvel' && (
                    <div className="space-y-2 mb-4 bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100">
                        <label className="text-xs font-black text-black select-none">Quantidade de Dependentes</label>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setDependentesQty(Math.max(1, dependentesQty - 1))}
                                className="h-8 w-8 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center font-bold text-sm shadow-sm transition-all"
                            >
                                −
                            </button>
                            <Input
                                type="number"
                                min="1"
                                max="5"
                                value={dependentesQty}
                                onChange={(e) => setDependentesQty(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
                                className="text-center w-14 h-8 bg-white border-slate-200 rounded-xl font-black font-mono text-xs"
                            />
                            <button
                                onClick={() => setDependentesQty(Math.min(5, dependentesQty + 1))}
                                className="h-8 w-8 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center font-bold text-sm shadow-sm transition-all"
                            >
                                +
                            </button>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-semibold">
                            Total: {(dependentesQty * price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} ({dependentesQty}x R$ {price.toFixed(2).replace('.', ',')})
                        </p>
                    </div>
                )}

                {sanitizedBenefits.length > 0 && (
                    <div className="mb-4 flex-grow">
                        <p className="text-xs font-black text-black select-none">Benefícios</p>
                        <ul className="text-xs text-neutral-700 font-semibold space-y-1.5 mt-2 transition-all duration-300">
                            {(isExpanded ? sanitizedBenefits : sanitizedBenefits.slice(0, 3)).map((b, i) => {
                                const parts = b.split(': ');
                                if (parts.length > 1 && parts[0].length < 60) {
                                    return (
                                        <li key={i} className="flex gap-2 group/benefit">
                                            <span className="mt-1 h-3.5 w-3.5 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                                                <Check className="h-2 w-2 text-[#e60012]" />
                                            </span>
                                            <span className="min-w-0 text-[11px]">
                                                <span className="font-black text-black group-hover/benefit:text-[#e60012] transition-colors">{parts[0]}:</span> {parts.slice(1).join(': ')}
                                            </span>
                                        </li>
                                    );
                                }
                                return (
                                    <li key={i} className="flex gap-2 group/benefit">
                                        <span className="mt-1 h-3.5 w-3.5 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                                            <Check className="h-2 w-2 text-[#e60012]" />
                                        </span>
                                        <span className="min-w-0 text-[11px] group-hover/benefit:text-[#e60012] transition-colors">{b}</span>
                                    </li>
                                );
                            })}
                        </ul>

                        {sanitizedBenefits.length > 3 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="w-full mt-2 h-auto py-1 text-[11px] font-black tracking-wide text-[#e60012] hover:text-[#c90010] hover:bg-transparent p-0 justify-start"
                            >
                                {isExpanded ? (
                                    <span className="flex items-center gap-1 uppercase select-none">Ver menos <ChevronUp className="h-3 w-3" /></span>
                                ) : (
                                    <span className="flex items-center gap-1 uppercase select-none">Ver mais ({sanitizedBenefits.length - 3}) <ChevronDown className="h-3 w-3" /></span>
                                )}
                            </Button>
                        )}
                    </div>
                )}

                <div className="mt-auto pt-2">
                    {isAdded ? (
                        <Button className="w-full rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 h-11 text-xs font-black uppercase tracking-wider transition-all select-none border border-slate-200/60" onClick={handleAddClick} disabled={!isPriceValid || isDisabledSpecial}>
                            <Check className="mr-2 h-4 w-4 text-emerald-600" />
                            ✓ Adicionado
                        </Button>
                    ) : (
                        <Button className="w-full rounded-full bg-gradient-to-r from-[#d00010] via-[#f00018] to-[#ff4545] hover:brightness-110 text-white h-11 text-xs font-black uppercase tracking-wider shadow-md transform active:scale-95 transition-all select-none border-0 cursor-pointer flex items-center justify-center" onClick={handleAddClick} disabled={!isPriceValid || isDisabledSpecial}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {product.tipo === 'Dependente Móvel' ? `Adicionar ${dependentesQty}` : 'Adicionar à Oferta'}
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}

interface BuilderViewProps {
    className?: string;
    hideHeader?: boolean;
}

export function BuilderView({ className, hideHeader = false }: BuilderViewProps) {
    const [selectedType, setSelectedType] = useState<ProductType | 'Todos'>('Todos');
    const [isComboboxOpen, setComboboxOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { selectedCity, setSelectedCity, clearOffer, selectedTV } = useOffer();

    const { firestore } = useFirebase();

    const regioesRef = useMemoFirebase(() => firestore ? collection(firestore, 'regioes') : null, [firestore]);
    const { data: regioes, isLoading: isLoadingRegioes } = useCollection<Regiao>(regioesRef);

    const allCities = useMemo(() => {
        if (!regioes) return [];

        const allCitiesMap = new Map<string, { value: string; label: string; regiaoIds: string[] }>();

        regioes.forEach(regiao => {
            (regiao.cidades || []).forEach(cidade => {
                const lowerCaseCidade = cidade.toLowerCase();
                const existing = allCitiesMap.get(lowerCaseCidade);

                if (!existing) {
                    allCitiesMap.set(lowerCaseCidade, { value: lowerCaseCidade, label: cidade, regiaoIds: [regiao.id] });
                    return;
                }

                if (!existing.regiaoIds.includes(regiao.id)) {
                    existing.regiaoIds.push(regiao.id);
                }
            });
        });

        return Array.from(allCitiesMap.values()).sort((a, b) => a.label.localeCompare(b.label));

    }, [regioes]);

    const selectedRegiaoIds = useMemo(() => {
        if (!selectedCity || !allCities) return [];
        return allCities.find(c => c.label === selectedCity)?.regiaoIds ?? [];
    }, [selectedCity, allCities]);

    const productsQuery = useMemoFirebase(() => {
        if (!firestore || selectedRegiaoIds.length === 0) return null;
        return query(
            collection(firestore, 'produtos') as CollectionReference<Produto>,
            where('regiaoId', 'in', [...selectedRegiaoIds, 'nacional'].slice(0, 30))
        );
    }, [firestore, selectedRegiaoIds]);

    const { data: productsData, isLoading: isLoadingProducts } = useCollection<Produto>(productsQuery);

    const filteredAndSortedProducts = useMemo(() => {
        if (!productsData) return [];

        let filtered = selectedType === 'Todos'
            ? productsData
            : productsData.filter(p => p.tipo === selectedType);

        if (selectedType === 'Ponto Adicional' && selectedTV) {
            const tvNome = selectedTV.nome as keyof typeof MAPEAMENTO_TV_TECNOLOGIA;
            const tipoTecnologiaTV = MAPEAMENTO_TV_TECNOLOGIA[tvNome];

            if (tipoTecnologiaTV) {
                const regraPA = REGRAS_HIERARQUIA_PA[tipoTecnologiaTV as keyof typeof REGRAS_HIERARQUIA_PA];

                if (regraPA) {
                    const tiposPermitidos = regraPA.paPermitidos;

                    filtered = filtered.filter(p => {
                        const nomePA = p.nome;

                        if (tiposPermitidos.includes("boxCabo") && nomePA.includes("4K") && nomePA.includes("Cabo")) return true;
                        if (tiposPermitidos.includes("boxStreaming") && nomePA.includes("Box") && nomePA.includes("Streaming")) return true;
                        if (tiposPermitidos.includes("soundboxCabo") && nomePA.includes("Soundbox") && nomePA.includes("Cabo")) return true;
                        if (tiposPermitidos.includes("soundboxStreaming") && nomePA.includes("Soundbox") && nomePA.includes("Streaming")) return true;
                        if (tiposPermitidos.includes("hd") && nomePA.includes("HD")) return true;

                        return false;
                    });
                }
            }
        }

        if (searchQuery.trim() !== '') {
            const searchLower = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.nome.toLowerCase().includes(searchLower) ||
                p.beneficios?.some(b => b.toLowerCase().includes(searchLower)) ||
                p.observacoes?.toLowerCase().includes(searchLower)
            );
        }

        return filtered.sort((a, b) => {
            const typeOrder = productTypes.indexOf(a.tipo) - productTypes.indexOf(b.tipo);
            if (typeOrder !== 0) return typeOrder;

            const getPostPromoPrice = (produto: Produto) => {
                if (produto.tipo === 'Banda Larga' && produto.observacoes) {
                    const match = produto.observacoes.match(/após R\$\s*([0-9]+[,.]?[0-9]*)/i);
                    if (match) {
                        return parseFloat(match[1].replace(',', '.'));
                    }
                }
                return null;
            };

            let priceA = typeof a.precoMensal === 'number' ? a.precoMensal : Infinity;
            let priceB = typeof b.precoMensal === 'number' ? b.precoMensal : Infinity;

            if (a.tipo === 'Banda Larga') {
                const postPromoA = getPostPromoPrice(a);
                if (postPromoA !== null) priceA = postPromoA;
            }

            if (b.tipo === 'Banda Larga') {
                const postPromoB = getPostPromoPrice(b);
                if (postPromoB !== null) priceB = postPromoB;
            }

            if (priceA !== priceB) {
                return priceA - priceB;
            }

            return a.nome.localeCompare(b.nome);
        });

    }, [productsData, selectedType, searchQuery, selectedTV]);

    const handleCityChange = (cityLabel: string) => {
        setSelectedCity(cityLabel);
        setSelectedType('Todos');
        setSearchQuery('');
    }

    const clearSelection = () => {
        clearOffer();
        setSearchQuery('');
    }

    const handleTypeChange = (type: ProductType | 'Todos') => {
        setSelectedType(type);
    };

    const isLoading = isLoadingRegioes || (selectedCity && isLoadingProducts);

    const groupedByType = useMemo(() => {
        const grouped: Record<ProductType, Produto[]> = {} as Record<ProductType, Produto[]>;
        productTypes.forEach(type => {
            grouped[type] = [];
        });
        filteredAndSortedProducts.forEach(product => {
            if (grouped[product.tipo]) {
                grouped[product.tipo].push(product);
            }
        });
        return grouped;
    }, [filteredAndSortedProducts]);

    const availableTypes = useMemo(() => {
        if (!productsData) return [];
        const types = new Set<ProductType>();
        productsData.forEach(p => types.add(p.tipo));
        return productTypes.filter(t => types.has(t));
    }, [productsData]);

    const typesWithProducts = useMemo(() => {
        if (selectedType === 'Todos') {
            return availableTypes;
        }
        return [selectedType];
    }, [selectedType, availableTypes]);

    const typeIcon = (type: ProductType) => {
        switch (type) {
            case "Movel":
            case "Dependente Móvel":
                return <Smartphone className="h-4 w-4 text-red-500" />;
            case "Banda Larga":
                return <Wifi className="h-4 w-4 text-red-500" />;
            case "TV Cabeada":
            case "TV Box":
            case "Claro TV APP":
            case "Ponto Adicional":
                return <Tv2 className="h-4 w-4 text-red-500" />;
            case "Fixo":
                return <Phone className="h-4 w-4 text-red-500" />;
            case "Serviços Avançados":
                return <Sparkles className="h-4 w-4 text-red-500" />;
            case "Opcional":
            default:
                return <Boxes className="h-4 w-4 text-red-500" />;
        }
    };

    return (
        <div className={cn("space-y-4", className)}>
            {!hideHeader && (
                <div className="mb-6 pt-4 animate-in fade-in duration-500">
                    <h1 className="text-3xl font-black text-black tracking-tight">Montador de Portfólio</h1>
                    <p className="text-xs text-muted-foreground font-semibold">
                        Crie sua oferta personalizada e acompanhe todos os benefícios
                    </p>
                </div>
            )}

            <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-5 space-y-4 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                    <div className="sm:col-span-5 space-y-1 min-w-0">
                        <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 select-none">Cidade</label>
                        {isLoadingRegioes ? (
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span>Carregando cidades...</span>
                            </div>
                        ) : (
                            <Popover open={isComboboxOpen} onOpenChange={setComboboxOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={isComboboxOpen}
                                        className="w-full justify-between bg-white border-slate-200 hover:bg-slate-50/80 hover:border-slate-300 font-black text-xs h-11 rounded-2xl transition-all"
                                    >
                                        <span className="truncate">{selectedCity || "Selecione uma cidade..."}</span>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0 border-slate-200 rounded-2xl overflow-hidden shadow-xl">
                                    <Command filter={(value, search) => {
                                        const normalizedValue = normalizeText(value);
                                        const normalizedSearch = normalizeText(search);
                                        return normalizedValue.includes(normalizedSearch) ? 1 : 0;
                                    }}>
                                        <CommandInput placeholder="Buscar cidade..." className="h-10 text-xs font-semibold" />
                                        <CommandEmpty className="text-xs p-3">Nenhuma cidade encontrada.</CommandEmpty>
                                        <CommandGroup>
                                            <ScrollArea className="h-72">
                                                {allCities.map((city) => (
                                                    <CommandItem
                                                        key={city.value}
                                                        value={city.value}
                                                        onSelect={(currentValue) => {
                                                            const selected = allCities.find(c => c.value === currentValue);
                                                            if (selected) {
                                                                handleCityChange(selected.label);
                                                            }
                                                            setComboboxOpen(false);
                                                        }}
                                                        className="text-xs font-bold text-slate-700 cursor-pointer"
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4 text-red-500",
                                                                selectedCity === city.label ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {city.label}
                                                    </CommandItem>
                                                ))}
                                            </ScrollArea>
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>

                    <div className="sm:col-span-5 space-y-1">
                        <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 select-none">Buscar</label>
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Buscar produto..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-white border-slate-200 focus:border-red-500 focus:ring-red-500/10 rounded-2xl h-11 text-xs font-bold transition-all"
                                disabled={!selectedCity}
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <Button
                            onClick={clearSelection}
                            variant="outline"
                            className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-800 rounded-2xl h-11 w-full text-xs font-black uppercase tracking-wider shadow-sm transform active:scale-95 transition-all"
                            disabled={!selectedCity}
                        >
                            <XCircle className="mr-1.5 h-4 w-4" />
                            Limpar
                        </Button>
                    </div>
                </div>

                {selectedCity && (
                    <div className="mt-4 space-y-2 pt-2 border-t border-slate-200/40">
                        <div className="flex items-center justify-between gap-3">
                            <div className="text-[10px] uppercase font-black tracking-wider text-slate-400 select-none">Categorias</div>
                            {selectedType !== "Todos" ? (
                                <Button variant="ghost" size="sm" className="h-7 px-2.5 text-[10px] font-black uppercase tracking-wider text-[#e60012] hover:text-[#c90010] hover:bg-red-50 rounded-xl" onClick={() => handleTypeChange("Todos")}>
                                    Limpar filtro
                                </Button>
                            ) : null}
                        </div>

                        <div className="flex gap-1.5 overflow-x-auto pb-1.5">
                            <Button
                                variant={selectedType === "Todos" ? "default" : "secondary"}
                                onClick={() => handleTypeChange("Todos")}
                                size="sm"
                                className={cn("shrink-0 rounded-2xl h-8 px-3.5 text-xs font-black uppercase tracking-wide transition-all", selectedType === "Todos" ? "bg-gradient-to-r from-[#d00010] via-[#f00018] to-[#ff4545] text-white shadow-md shadow-red-200/50 hover:brightness-110" : "bg-white border border-slate-200 hover:border-slate-300 text-neutral-700")}
                            >
                                Todos
                            </Button>
                            {availableTypes.map((type) => (
                                <Button
                                    key={type}
                                    variant={selectedType === type ? "default" : "secondary"}
                                    onClick={() => handleTypeChange(type)}
                                    size="sm"
                                    className={cn("shrink-0 rounded-2xl h-8 px-3.5 text-xs font-black uppercase tracking-wide transition-all", selectedType === type ? "bg-gradient-to-r from-[#d00010] via-[#f00018] to-[#ff4545] text-white shadow-md shadow-red-200/50 hover:brightness-110" : "bg-white border border-slate-200 hover:border-slate-300 text-neutral-700")}
                                >
                                    {typeDisplayNames[type]}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {selectedCity && (
                <>
                    {isLoading && (
                        <div className="flex items-center justify-center py-12 gap-2.5 text-slate-500 font-bold text-sm animate-in fade-in duration-500">
                            <Loader2 className="h-5 w-5 animate-spin text-red-500" />
                            <span>Carregando produtos...</span>
                        </div>
                    )}

                    {!isLoading && filteredAndSortedProducts.length === 0 && (
                        <Card className="border border-slate-200 bg-white/80 rounded-3xl p-8 text-center animate-in fade-in duration-500">
                            <CardContent className="p-0">
                                <PlusCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-sm font-black text-slate-700 tracking-tight">Nenhum produto encontrado</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Tente usar outros filtros ou termos de busca.</p>
                            </CardContent>
                        </Card>
                    )}

                    {!isLoading && filteredAndSortedProducts.length > 0 && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            {typesWithProducts.map((type) => (
                                <div key={type} className="animate-in fade-in duration-300">
                                    <div className="rounded-3xl border border-red-100/70 bg-gradient-to-r from-red-50 via-white to-white p-5 shadow-sm">
                                        <div className="flex items-center justify-between gap-3 mb-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="h-10 w-10 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                                                    {typeIcon(type)}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-base font-black text-black tracking-tight truncate leading-tight">{typeDisplayNames[type]}</div>
                                                    <div className="text-xs text-neutral-600 font-bold">{groupedByType[type].length} produto(s)</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {groupedByType[type].map(product => (
                                                <ProductCard key={product.id} product={product} />
                                            ))}
                                        </div>
                                    </div>

                                    {type === "TV Cabeada" && selectedTV && (
                                        <Card className="mt-4 border border-red-100 bg-red-50/50 rounded-2xl">
                                            <CardContent className="p-4">
                                                <InfoPontosAdicionais
                                                    nomeTV={selectedTV.nome}
                                                    mostrarAlerta={true}
                                                />
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
