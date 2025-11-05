
"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { Produto } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type Gastos = {
  tv: number;
  internet: number;
  fixo: number;
  movel: number;
  outros: number;
};

const initialGastos: Gastos = { tv: 0, internet: 0, fixo: 0, movel: 0, outros: 0 };

interface OfferContextType {
  products: Produto[];
  addProduct: (product: Produto) => void;
  addProductWithExtras: (mainProduct: Produto, extraProduct: Produto, quantity: number) => void;
  removeProduct: (productId: string) => void;
  clearOffer: () => void;
  gastos: Gastos;
  setGastos: React.Dispatch<React.SetStateAction<Gastos>>;
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
}

const OfferContext = createContext<OfferContextType | undefined>(undefined);

export function OfferProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Produto[]>([]);
  const [gastos, setGastos] = useState<Gastos>(initialGastos);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const { toast } = useToast();

  const addProduct = useCallback((product: Produto) => {
    setProducts((prevProducts) => {
      // Verificar se é TV - TV não pode ser adicionada múltiplas vezes
      if (product.tipo === 'TV') {
        if (prevProducts.find((p) => p.tipo === 'TV')) {
          setTimeout(() => {
            toast({
              title: "TV já adicionada",
              description: `Você já possui um produto de TV na oferta. Remova-o para adicionar outro.`,
              variant: 'destructive',
            });
          }, 0);
          return prevProducts;
        }
      }
      
      // Para outros produtos (Ponto Adicional, Fixo, Móvel, Banda Larga, Opcional),
      // criar um ID único para permitir múltiplas adições do mesmo produto
      const newProduct = product.tipo === 'TV' 
        ? product 
        : { ...product, id: `${product.id}-${Date.now()}-${Math.random()}` };
      
      setTimeout(() => {
        toast({
          title: "Produto Adicionado!",
          description: `${product.nome} foi adicionado à oferta.`,
        });
      }, 0);
      return [...prevProducts, newProduct];
    });
  }, [toast]);

  const addProductWithExtras = useCallback((mainProduct: Produto, extraProduct: Produto, quantity: number) => {
    setProducts(prevProducts => {
      const newProducts = [...prevProducts];
      
      let extrasAdded = 0;
      // Add extra products with unique IDs
      for (let i = 0; i < quantity; i++) {
        const uniqueId = `${extraProduct.id}-${Date.now()}-${i}`;
        newProducts.push({ ...extraProduct, id: uniqueId });
        extrasAdded++;
      }

      setTimeout(() => {
          toast({
            title: "Pontos Adicionais!",
            description: `${extrasAdded} Ponto(s) Adicional(is) de ${extraProduct.nome.replace('Ponto Adicional - ', '')} foram adicionados.`,
          });
        }, 0);

      return newProducts;
    });
  }, [toast]);


  const removeProduct = useCallback((productId: string) => {
    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId));
  }, []);

  const clearOffer = useCallback(() => {
    setProducts([]);
    setGastos(initialGastos);
    setSelectedCity(null); // Also clear city on full clear
    setTimeout(() => {
      toast({
          title: "Oferta Limpa",
          description: "A oferta e a cidade foram reiniciadas.",
        });
    }, 0);
  }, [toast]);

  const value = { 
    products, 
    addProduct,
    addProductWithExtras, 
    removeProduct, 
    clearOffer, 
    gastos, 
    setGastos, 
    selectedCity, 
    setSelectedCity 
  };

  return (
    <OfferContext.Provider value={value}>
      {children}
    </OfferContext.Provider>
  );
}

export function useOffer() {
  const context = useContext(OfferContext);
  if (context === undefined) {
    throw new Error('useOffer must be used within an OfferProvider');
  }
  return context;
}

    
