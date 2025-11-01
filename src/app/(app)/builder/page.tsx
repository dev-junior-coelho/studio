"use client";

import { useState } from 'react';
import { useOffer } from '@/contexts/offer-context';
import { mockProdutos } from '@/lib/mock-data';
import type { ProductType, Produto } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

const productTypes: ProductType[] = ["Móvel", "Banda Larga", "TV", "Fixo"];

function ProductCard({ product }: { product: Produto }) {
  const { addProduct } = useOffer();
  const imageMap = {
    'Móvel': 'movel',
    'Banda Larga': 'banda-larga',
    'TV': 'tv',
    'Fixo': 'fixo'
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
          {product.preco_mensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          <span className="text-sm font-normal text-muted-foreground">/mês</span>
        </p>
        <ul className="text-sm text-muted-foreground list-disc pl-5">
            {product.beneficios.slice(0, 2).map((b, i) => <li key={i}>{b}</li>)}
            {product.beneficios.length > 2 && <li>e mais...</li>}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => addProduct(product)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar à Oferta
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function MontadorPortfolioPage() {
  const [selectedType, setSelectedType] = useState<ProductType | 'Todos'>('Todos');

  const filteredProducts = selectedType === 'Todos' 
    ? mockProdutos
    : mockProdutos.filter(p => p.tipo === selectedType);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Montador de Portfólio</h1>
      
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
