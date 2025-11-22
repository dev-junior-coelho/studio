
"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import type { Produto } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { calcularTotalComDescontos, calcularDescontoDependentes } from '@/lib/discount-utils';

type Gastos = {
  tv: number;
  internet: number;
  fixo: number;
  movel: number;
  outros: number;
  wifiMesh: number;
};

const initialGastos: Gastos = { tv: 0, internet: 0, fixo: 0, movel: 0, outros: 0, wifiMesh: 0 };

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
  totalMensal: number;
  dependentesInfo: Array<{ index: number; dependente: Produto; precoAplicado: number; isGratis: boolean; descricao: string }>;
  selectedTV: Produto | null; // TV selecionada para filtrar PA compatíveis
  setSelectedTV: (tv: Produto | null) => void;
}

const OfferContext = createContext<OfferContextType | undefined>(undefined);

export function OfferProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Produto[]>([]);
  const [gastos, setGastos] = useState<Gastos>(initialGastos);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedTV, setSelectedTV] = useState<Produto | null>(null);
  const { toast } = useToast();

  const addProduct = useCallback((product: Produto) => {
    setProducts((prevProducts) => {
      // Verificar se é algum tipo de TV (TV Cabeada, TV Box, Claro TV APP)
      // Apenas um tipo de TV pode ser adicionado por oferta
      const isTV = product.tipo === 'TV Cabeada' || product.tipo === 'TV Box' || product.tipo === 'Claro TV APP';
      const hasTV = prevProducts.some(p => 
        p.tipo === 'TV Cabeada' || p.tipo === 'TV Box' || p.tipo === 'Claro TV APP'
      );
      
      if (isTV && hasTV) {
        setTimeout(() => {
          toast({
            title: "TV já adicionada",
            description: `Você já possui um produto de TV na oferta. Remova-o para adicionar outro.`,
            variant: 'destructive',
          });
        }, 0);
        return prevProducts;
      }
      
      // Se é TV, rastrear como selecionada
      if (isTV) {
        setSelectedTV(product);
      }
      
      // Para outros produtos (Ponto Adicional, Fixo, Móvel, Banda Larga, Opcional),
      // criar um ID único para permitir múltiplas adições do mesmo produto
      const newProduct = isTV 
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
    setProducts((prevProducts) => {
      const productToRemove = prevProducts.find(p => p.id === productId);
      
      // ✅ Sincronizar: Se removendo uma TV, limpar selectedTV
      if (productToRemove && 
          (productToRemove.tipo === 'TV Cabeada' || productToRemove.tipo === 'TV Box' || productToRemove.tipo === 'Claro TV APP')) {
        setSelectedTV(null);
      }
      
      return prevProducts.filter((p) => p.id !== productId);
    });
  }, []);

  const clearOffer = useCallback(() => {
    setProducts([]);
    setGastos(initialGastos);
    setSelectedCity(null);
    setSelectedTV(null); // Limpar TV selecionada
    setTimeout(() => {
      toast({
          title: "Oferta Limpa",
          description: "A oferta e a cidade foram reiniciadas.",
        });
    }, 0);
  }, [toast]);

  // Calcular informações de dependentes com desconto
  const movelPrincipal = useMemo(() => products.find(p => p.tipo === 'Movel'), [products]);
  const dependentesAdicionados = useMemo(() => products.filter(p => p.tipo === 'Dependente Móvel'), [products]);
  
  const dependentesInfo = useMemo(
    () => calcularDescontoDependentes(movelPrincipal, dependentesAdicionados),
    [movelPrincipal, dependentesAdicionados]
  );

  const totalMensal = useMemo(() => calcularTotalComDescontos(products), [products]);

  const value = { 
    products, 
    addProduct,
    addProductWithExtras, 
    removeProduct, 
    clearOffer, 
    gastos, 
    setGastos, 
    selectedCity, 
    setSelectedCity,
    totalMensal,
    dependentesInfo,
    selectedTV,
    setSelectedTV
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

    
