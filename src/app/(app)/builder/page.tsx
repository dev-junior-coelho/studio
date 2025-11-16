
"use client";

import { useState, useMemo } from 'react';
import { useOffer } from '@/contexts/offer-context';
import type { ProductType, Produto, Regiao } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlusCircle, Loader2, XCircle, ChevronsUpDown, Check, Search } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, CollectionReference } from 'firebase/firestore';
import { useFirebase, useMemoFirebase } from '@/firebase/provider';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const { addProduct } = useOffer();
  const [dependentesQty, setDependentesQty] = useState(1);
  
  const price = product.precoMensal;
  const isPriceValid = typeof price === 'number' && price > 0;
  
  // Extrair preço pós-promoção das observações
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

  const handleAddClick = () => {
    if (product.tipo === 'Dependente Móvel') {
      // Adicionar múltiplos dependentes
      for (let i = 0; i < dependentesQty; i++) {
        addProduct(product);
      }
    } else {
      addProduct(product);
    }
  };

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="p-4">
          {placeholder && (
            <div className="relative aspect-video w-full overflow-hidden rounded-md mb-4">
              <Image 
                  src={placeholder.imageUrl}
                  alt={product.nome}
                  fill
                  className="object-cover"
                  data-ai-hint={placeholder.imageHint}
              />
            </div>
          )}
          <CardTitle className="text-base font-bold leading-snug">{product.nome}</CardTitle>
          <CardDescription>{product.tipo}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 flex-grow space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Preço mensal</p>
            <p className="text-2xl font-bold">
              {isPriceValid ? (
                <>
                  {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </>
              ) : (
                <span className="text-base text-muted-foreground">Preço indisponível</span>
              )}
            </p>
            {precoAposPromoFormatted && product.tipo === 'Banda Larga' && (
              <p className="text-sm text-muted-foreground mt-1">
                Após promoção: {precoAposPromoFormatted.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            )}
            {product.tipo === 'Serviços Avançados' && product.nome === 'Ponto Ultra' && (
              <p className="text-sm text-orange-600 font-semibold mt-2 bg-orange-50 p-2 rounded">
                Taxa única: R$ 150,00 ou 3x R$ 50,00
              </p>
            )}
          </div>
          
          {product.tipo === 'Dependente Móvel' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantidade de Dependentes</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDependentesQty(Math.max(1, dependentesQty - 1))}
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                >
                  −
                </button>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={dependentesQty}
                  onChange={(e) => setDependentesQty(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
                  className="text-center w-16"
                />
                <button
                  onClick={() => setDependentesQty(Math.min(5, dependentesQty + 1))}
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Total: {(dependentesQty * price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} ({dependentesQty}x R$ {price.toFixed(2).replace('.', ',')})
              </p>
            </div>
          )}
          
          {product.beneficios?.length > 0 && (
            <div>
              <p className="text-sm font-medium">Benefícios:</p>
              <ScrollArea className="max-h-36 mt-1 pr-2">
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  {product.beneficios.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </ScrollArea>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 mt-auto">
          <Button className="w-full" onClick={handleAddClick} disabled={!isPriceValid}>
            <PlusCircle className="mr-2 h-4 w-4" /> 
            {product.tipo === 'Dependente Móvel' ? `Adicionar ${dependentesQty} à Oferta` : 'Adicionar à Oferta'}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default function MontadorPortfolioPage() {
  const [selectedType, setSelectedType] = useState<ProductType | 'Todos'>('Todos');
  const [isComboboxOpen, setComboboxOpen] = useState(false);
  const [searchAlaCarte, setSearchAlaCarte] = useState('');
  const { selectedCity, setSelectedCity, clearOffer } = useOffer();
  
  const { firestore } = useFirebase();

  // 1. Fetch all regions
  const regioesRef = useMemoFirebase(() => firestore ? collection(firestore, 'regioes') : null, [firestore]);
  const { data: regioes, isLoading: isLoadingRegioes } = useCollection<Regiao>(regioesRef);

  // 2. Create a flat, sorted list of all cities with their region ID
  const allCities = useMemo(() => {
    if (!regioes) return [];
    
    const allCitiesMap = new Map<string, { value: string; label: string; regiaoId: string }>();

    regioes.forEach(regiao => {
        (regiao.cidades || []).forEach(cidade => {
            const lowerCaseCidade = cidade.toLowerCase();
            if (!allCitiesMap.has(lowerCaseCidade)) {
                allCitiesMap.set(lowerCaseCidade, { value: lowerCaseCidade, label: cidade, regiaoId: regiao.id });
            }
        });
    });

    return Array.from(allCitiesMap.values())
      .sort((a, b) => a.label.localeCompare(b.label));
      
  }, [regioes]);

  // 3. Find the selected region ID based on the selected city from context
  const selectedRegiaoId = useMemo(() => {
    if (!selectedCity || !allCities) return null;
    return allCities.find(c => c.label === selectedCity)?.regiaoId ?? null;
  }, [selectedCity, allCities]);

  // 4. Fetch products based on the selected region ID and national products
  const productsQuery = useMemoFirebase(() => {
    if (!firestore || !selectedRegiaoId) {
      console.log('Query não criada. Firestore:', !!firestore, 'RegiaoId:', selectedRegiaoId);
      return null;
    }
    console.log('Criando query para regiaoId:', selectedRegiaoId);
    return query(
      collection(firestore, 'produtos') as CollectionReference<Produto>,
      where('regiaoId', 'in', [selectedRegiaoId, 'nacional'])
    );
  }, [firestore, selectedRegiaoId]);
  
  const { data: productsData, isLoading: isLoadingProducts } = useCollection<Produto>(productsQuery);
  
  console.log('productsData:', productsData ? `${productsData.length} produtos` : 'null', 'isLoading:', isLoadingProducts);

  const filteredAndSortedProducts = useMemo(() => {
    if (!productsData) return [];
    
    // Debug: log dos produtos
    console.log('Total de produtos carregados:', productsData.length);
    console.log('Tipos únicos:', [...new Set(productsData.map(p => p.tipo))]);
    console.log('Produtos do tipo "Ponto Adicional":', productsData.filter(p => p.tipo === 'Ponto Adicional').length);
    
    // Filter by type
    let filtered = selectedType === 'Todos' 
      ? productsData 
      : productsData.filter(p => p.tipo === selectedType);
    
    // Se estiver na categoria Opcional (A La Carte) e houver texto de busca, filtrar
    if (selectedType === 'Opcional' && searchAlaCarte.trim() !== '') {
      const searchLower = searchAlaCarte.toLowerCase();
      filtered = filtered.filter(p => 
        p.nome.toLowerCase().includes(searchLower) ||
        p.beneficios?.some(b => b.toLowerCase().includes(searchLower)) ||
        p.observacoes?.toLowerCase().includes(searchLower)
      );
    }
      
    // Sort by tipo (category), then by price (ascending - menor para maior)
    return filtered.sort((a, b) => {
        // Primeiro, ordena por tipo (categoria)
        const typeOrder = productTypes.indexOf(a.tipo) - productTypes.indexOf(b.tipo);
        if (typeOrder !== 0) return typeOrder;
        
        // Função para extrair preço pós-promoção
        const getPostPromoPrice = (produto: Produto) => {
          if (produto.tipo === 'Banda Larga' && produto.observacoes) {
            const match = produto.observacoes.match(/após R\$\s*([0-9]+[,.]?[0-9]*)/i);
            if (match) {
              return parseFloat(match[1].replace(',', '.'));
            }
          }
          return null;
        };
        
        // Para produtos de Banda Larga, usar preço pós-promoção se existir
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
        
        // Se os preços forem iguais, ordena por nome
        return a.nome.localeCompare(b.nome);
    });

  }, [productsData, selectedType, searchAlaCarte]);

  const handleCityChange = (cityLabel: string) => {
    setSelectedCity(cityLabel);
    setSelectedType('Todos'); // Reset filter when city changes
    setSearchAlaCarte(''); // Limpar busca ao mudar de cidade
  }
  
  const clearSelection = () => {
    clearOffer(); // This now clears city, products, and gastos from context
    setSearchAlaCarte(''); // Limpar busca ao limpar seleção
  }

  // Limpar busca ao mudar de categoria
  const handleTypeChange = (type: ProductType | 'Todos') => {
    setSelectedType(type);
    if (type !== 'Opcional') {
      setSearchAlaCarte('');
    }
  };

  const isLoading = isLoadingRegioes || (selectedCity && isLoadingProducts);

  // Group products by type/category
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

  // Get types that have products to display
  const typesWithProducts = useMemo(() => {
    if (selectedType === 'Todos') {
      return productTypes.filter(type => groupedByType[type].length > 0);
    }
    return groupedByType[selectedType].length > 0 ? [selectedType] : [];
  }, [selectedType, groupedByType]);

  return (
    <main className="min-h-screen pb-20">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="mb-6 pt-4">
          <h1 className="text-3xl font-bold mb-2">Montador de Portfólio</h1>
          <p className="text-muted-foreground">
            Crie sua oferta personalizada e acompanhe todos os benefícios
          </p>
        </div>

        {/* City Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Selecione a Cidade</label>
          {isLoadingRegioes ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Carregando cidades...</span>
            </div>
          ) : (
            <Popover open={isComboboxOpen} onOpenChange={setComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isComboboxOpen}
                  className="w-full justify-between"
                >
                  {selectedCity || "Selecione uma cidade..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Buscar cidade..." />
                  <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
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
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
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

        {selectedCity && (
          <>
            <Button onClick={clearSelection} variant="outline" size="sm" className="w-full">
              <XCircle className="mr-2 h-4 w-4" />
              Limpar Seleção ({selectedCity})
            </Button>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={selectedType === 'Todos' ? 'default' : 'outline'}
                onClick={() => handleTypeChange('Todos')}
                size="sm"
              >
                Todos
              </Button>
              {productTypes.map(type => (
                <Button 
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  onClick={() => handleTypeChange(type)}
                  size="sm"
                >
                  {typeDisplayNames[type]}
                </Button>
              ))}
            </div>

            {/* Search for A La Carte */}
            {selectedType === 'Opcional' && (
              <Card>
                <CardContent className="pt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Buscar em A La Carte..."
                      value={searchAlaCarte}
                      onChange={(e) => setSearchAlaCarte(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {searchAlaCarte && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {filteredAndSortedProducts.length} produto(s) encontrado(s)
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
            
            {isLoading && (
              <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Carregando produtos...</span>
              </div>
            )}

            {!isLoading && filteredAndSortedProducts.length === 0 && (
              <Card>
                <CardContent className="pt-8 pb-8 text-center">
                  <PlusCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Nenhum produto encontrado para esta seleção.
                  </p>
                </CardContent>
              </Card>
            )}
            
            {/* Products by Category */}
            {!isLoading && filteredAndSortedProducts.length > 0 && (
              <div className="space-y-4">
                {typesWithProducts.map((type) => (
                  <Card key={type} className="overflow-hidden">
                    <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-primary/5">
                      <CardTitle className="text-lg">{typeDisplayNames[type]}</CardTitle>
                      <CardDescription>
                        {groupedByType[type].length} produto(s)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {groupedByType[type].map(product => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
    
