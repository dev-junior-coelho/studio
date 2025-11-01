"use client";

import { useState, useMemo } from 'react';
import { useOffer } from '@/contexts/offer-context';
import type { ProductType, Produto, Regiao } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, CollectionReference } from 'firebase/firestore';
import { useFirebase, useMemoFirebase } from '@/firebase/provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const productTypes: ProductType[] = ["Movel", "Banda Larga", "TV", "Fixo", "Opcional"];

function ProductCard({ product }: { product: Produto & { preco_mensal?: number } }) {
  const { addProduct } = useOffer();

  // Garante que o preço seja pego de qualquer uma das variações de nome
  const price = product.precoMensal ?? (product as any).preco_mensal;
  
  // Se não houver preço, não renderiza o card
  if (typeof price !== 'number') {
    return null;
  }

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
      <CardHeader>
        {placeholder && (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md mb-4">
             <Image 
                src={placeholder.imageUrl}
                alt={product.nome}
                fill
                className="object-cover"
                data-ai-hint={placeholder.imageHint}
             />
          </div>
        )}
        <CardTitle className="text-lg">{product.nome}</CardTitle>
        <CardDescription>{product.tipo}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <p className="text-2xl font-bold">
          {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          <span className="text-sm font-normal text-muted-foreground">/mês</span>
        </p>
        <ul className="text-sm text-muted-foreground list-disc pl-5">
            {product.beneficios?.slice(0, 2).map((b, i) => <li key={i}>{b}</li>)}
            {(product.beneficios?.length || 0) > 2 && <li>e mais...</li>}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => addProduct({ ...product, precoMensal: price })}>
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar à Oferta
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function MontadorPortfolioPage() {
  const [selectedType, setSelectedType] = useState<ProductType | 'Todos'>('Todos');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
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

  const filteredProducts = useMemo(() => {
    if (!productsData) return [];
    if (selectedType === 'Todos') return productsData;
    return productsData.filter(p => p.tipo === selectedType);
  }, [productsData, selectedType]);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedType('Todos'); // Reset filter when city changes
  }

  const isLoading = isLoadingRegioes || isLoadingProducts;

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

          {!isLoading && filteredProducts.length === 0 && (
             <div className="text-center py-10">
              <p className="text-muted-foreground">Nenhum produto encontrado para esta seleção.</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!isLoading && filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
