
"use client";

import { useState, useMemo } from 'react';
import { useOffer } from '@/contexts/offer-context';
import type { ProductType, Produto, Regiao } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Loader2, XCircle } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, CollectionReference } from 'firebase/firestore';
import { useFirebase, useMemoFirebase } from '@/firebase/provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const productTypes: ProductType[] = ["Movel", "Banda Larga", "TV", "Fixo", "Opcional"];

function ProductCard({ product }: { product: Produto }) {
  const { addProduct } = useOffer();

  const price = product.precoMensal;
  const isPriceValid = typeof price === 'number' && price > 0;

  const imageMap: { [key: string]: string } = {
    'Movel': 'movel',
    'Banda Larga': 'banda-larga',
    'TV': 'tv',
    'Fixo': 'fixo',
    'Opcional': 'fixo'
  }
  const placeholder = PlaceHolderImages.find(p => p.id === imageMap[product.tipo]);

  return (
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
        </div>
        
        {product.beneficios?.length > 0 && (
          <div>
            <p className="text-sm font-medium">Benefícios:</p>
            <ul className="text-sm text-muted-foreground list-disc pl-5 mt-1 space-y-1">
                {product.beneficios.slice(0, 3).map((b, i) => <li key={i}>{b}</li>)}
                {product.beneficios.length > 3 && <li className="font-medium">e mais...</li>}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 mt-auto">
        <Button className="w-full" onClick={() => addProduct(product)} disabled={!isPriceValid}>
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar à Oferta
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function MontadorPortfolioPage() {
  const [selectedType, setSelectedType] = useState<ProductType | 'Todos'>('Todos');
  const { selectedCity, setSelectedCity } = useOffer();
  
  const { firestore } = useFirebase();

  // 1. Fetch all regions
  const regioesRef = useMemoFirebase(() => firestore ? collection(firestore, 'regioes') : null, [firestore]);
  const { data: regioes, isLoading: isLoadingRegioes } = useCollection<Regiao>(regioesRef);

  // 2. Create a flat, sorted list of all cities with their region ID
  const allCities = useMemo(() => {
    if (!regioes) return [];
    return regioes
      .flatMap(regiao => regiao.cidades.map(cidade => ({ name: cidade, regiaoId: regiao.id })))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [regioes]);

  // 3. Find the selected region ID based on the selected city
  const selectedRegiaoId = useMemo(() => {
    if (!selectedCity || !allCities) return null;
    return allCities.find(c => c.name === selectedCity)?.regiaoId ?? null;
  }, [selectedCity, allCities]);

  // 4. Fetch products based on the selected region ID and national products
  const productsQuery = useMemoFirebase(() => {
    if (!firestore || !selectedRegiaoId) return null;
    return query(
      collection(firestore, 'produtos') as CollectionReference<Produto>,
      where('regiaoId', 'in', [selectedRegiaoId, 'nacional'])
    );
  }, [firestore, selectedRegiaoId]);
  
  const { data: productsData, isLoading: isLoadingProducts } = useCollection<Produto>(productsQuery);

  const filteredAndSortedProducts = useMemo(() => {
    if (!productsData) return [];
    
    // Filter by type
    const filtered = selectedType === 'Todos' 
      ? productsData 
      : productsData.filter(p => p.tipo === selectedType);
      
    // Sort by tipo (category), then by nome (name)
    return filtered.sort((a, b) => {
        if (a.tipo < b.tipo) return -1;
        if (a.tipo > b.tipo) return 1;
        return a.nome.localeCompare(b.nome);
    });

  }, [productsData, selectedType]);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedType('Todos'); // Reset filter when city changes
  }
  
  const clearSelection = () => {
    setSelectedCity(null);
    setSelectedType('Todos');
  }

  const isLoading = isLoadingRegioes || (selectedCity && isLoadingProducts);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Montador de Portfólio</h1>

      <div className="space-y-2">
        <label className="text-sm font-medium">Selecione a Cidade</label>
        {isLoadingRegioes ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Carregando cidades...</span>
          </div>
        ) : (
          <Select onValueChange={handleCityChange} value={selectedCity ?? ""}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma cidade para ver os produtos" />
            </SelectTrigger>
            <SelectContent>
              {allCities.map(city => (
                <SelectItem key={city.name} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedCity && (
        <>
          <Button onClick={clearSelection} variant="outline" size="sm" className="w-full">
            <XCircle className="mr-2 h-4 w-4" />
            Limpar Seleção ({selectedCity})
          </Button>

          <div className="flex flex-wrap gap-2">
            <Button 
              variant={selectedType === 'Todos' ? 'default' : 'outline'}
              onClick={() => setSelectedType('Todos')}
              size="sm"
            >
              Todos
            </Button>
            {productTypes.map(type => (
              <Button 
                key={type}
                variant={selectedType === type ? 'default' : 'outline'}
                onClick={() => setSelectedType(type)}
                size="sm"
              >
                {type}
              </Button>
            ))}
          </div>
          
          {isLoading && (
             <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Carregando produtos...</span>
            </div>
          )}

          {!isLoading && filteredAndSortedProducts.length === 0 && (
             <div className="text-center py-10">
              <p className="text-muted-foreground">Nenhum produto encontrado para esta seleção.</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {!isLoading && filteredAndSortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
