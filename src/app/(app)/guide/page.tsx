"use client";

import { useState, useMemo } from 'react';
import type { ProcedureCategory } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, Loader2 } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection } from 'firebase/firestore';
import { useFirebase, useMemoFirebase } from '@/firebase/provider';

interface Procedimento {
  id: string;
  titulo: string;
  categoria: string;
  tags: string[];
  conteudo: string;
}

export default function GuiaRapidoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { firestore } = useFirebase();

  // Buscar procedimentos do Firestore
  const procedimentosRef = useMemoFirebase(() => 
    firestore ? collection(firestore, 'procedimentos') : null, 
    [firestore]
  );
  
  const { data: procedimentos, isLoading } = useCollection<Procedimento>(procedimentosRef);

  const filteredProcedimentos = useMemo(() => {
    if (!procedimentos) {
      return [];
    }
    if (!searchTerm) {
      return procedimentos;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return procedimentos.filter(
      (proc) =>
        proc.titulo.toLowerCase().includes(lowercasedTerm) ||
        proc.tags.some((tag) => tag.toLowerCase().includes(lowercasedTerm))
    );
  }, [searchTerm, procedimentos]);

  const groupedProcedimentos = useMemo(() => {
    return filteredProcedimentos.reduce((acc, proc) => {
      const category = proc.categoria as ProcedureCategory;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(proc);
      return acc;
    }, {} as Record<ProcedureCategory, Procedimento[]>);
  }, [filteredProcedimentos]);

  const categories = Object.keys(groupedProcedimentos) as ProcedureCategory[];

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center h-[50vh]">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando procedimentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Guia Rápido</h1>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por título ou tag..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProcedimentos.length > 0 ? (
        <Accordion type="single" collapsible className="w-full">
          {categories.map((category) => (
            <AccordionItem value={category} key={category}>
              <AccordionTrigger className="text-lg font-semibold">{category}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {groupedProcedimentos[category].map((proc) => (
                    <div key={proc.id} className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-2">{proc.titulo}</h4>
                      <p className="whitespace-pre-wrap text-sm text-foreground/80">{proc.conteudo}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {proc.tags.map(tag => (
                          <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Nenhum procedimento encontrado.</p>
        </div>
      )}
    </div>
  );
}
