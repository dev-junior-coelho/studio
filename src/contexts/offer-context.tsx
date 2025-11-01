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
  removeProduct: (productId: string) => void;
  clearOffer: () => void;
  gastos: Gastos;
  setGastos: React.Dispatch<React.SetStateAction<Gastos>>;
}

const OfferContext = createContext<OfferContextType | undefined>(undefined);

export function OfferProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Produto[]>([]);
  const [gastos, setGastos] = useState<Gastos>(initialGastos);
  const { toast } = useToast();

  const addProduct = useCallback((product: Produto) => {
    setProducts((prevProducts) => {
      if (prevProducts.find((p) => p.id === product.id)) {
        toast({
          title: "Produto já adicionado",
          description: `${product.nome} já está na oferta.`,
          variant: 'destructive',
        });
        return prevProducts;
      }
      toast({
        title: "Produto Adicionado!",
        description: `${product.nome} foi adicionado à oferta.`,
      });
      return [...prevProducts, product];
    });
  }, [toast]);

  const removeProduct = useCallback((productId: string) => {
    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId));
  }, []);

  const clearOffer = useCallback(() => {
    setProducts([]);
    setGastos(initialGastos);
    toast({
        title: "Oferta Limpa",
        description: "A oferta foi reiniciada.",
      });
  }, [toast]);

  const value = { products, addProduct, removeProduct, clearOffer, gastos, setGastos };

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
