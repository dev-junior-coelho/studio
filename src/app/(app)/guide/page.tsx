"use client";

import { useState, useMemo } from 'react';
import { mockProcedimentos } from '@/lib/mock-data';
import type { ProcedureCategory } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search } from 'lucide-react';

export default function GuiaRapidoPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProcedimentos = useMemo(() => {
    if (!searchTerm) {
      return mockProcedimentos;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return mockProcedimentos.filter(
      (proc) =>
        proc.titulo.toLowerCase().includes(lowercasedTerm) ||
        proc.tags.some((tag) => tag.toLowerCase().includes(lowercasedTerm))
    );
  }, [searchTerm]);

  const groupedProcedimentos = useMemo(() => {
    return filteredProcedimentos.reduce((acc, proc) => {
      const category = proc.categoria;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(proc);
      return acc;
    }, {} as Record<ProcedureCategory, typeof mockProcedimentos>);
  }, [filteredProcedimentos]);

  const categories = Object.keys(groupedProcedimentos) as ProcedureCategory[];

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
