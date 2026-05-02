"use client";

import { useState, useMemo } from 'react';
import type { ProcedureCategory } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, Loader2 } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection } from 'firebase/firestore';
import { useFirebase, useMemoFirebase } from '@/firebase/provider';
import { PageShell } from '@/components/layout/page-shell';

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
        <div className="text-center space-y-2 select-none">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-red-500" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Carregando procedimentos...</p>
        </div>
      </div>
    );
  }

  return (
    <PageShell
      title="Guia Rápido"
      description="Consulte os procedimentos e orientações do sistema."
      contentClassName="space-y-6 max-w-4xl"
    >
      <div className="relative select-none">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="search"
          placeholder="Buscar por título ou tag..."
          className="pl-10 h-12 border-slate-200 rounded-2xl bg-white shadow-sm focus:border-red-500 focus:ring-red-500/10 transition-all font-bold text-xs select-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProcedimentos.length > 0 ? (
        <Accordion type="single" collapsible className="w-full space-y-3">
          {categories.map((category) => (
            <AccordionItem value={category} key={category} className="border border-slate-200 bg-white hover:border-slate-300 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden px-1">
              <AccordionTrigger className="text-sm font-black text-slate-800 tracking-tight leading-tight px-5 py-4 hover:no-underline select-none">
                {category}
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <div className="space-y-4 pt-1">
                  {groupedProcedimentos[category].map((proc) => (
                    <div key={proc.id} className="p-4 rounded-2xl bg-slate-50/50 border border-slate-200 hover:border-slate-300 transition-all select-none">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 select-all">{proc.titulo}</h4>
                      <p className="whitespace-pre-wrap text-xs text-slate-600 font-medium select-all">{proc.conteudo}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3 select-all">
                        {proc.tags.map(tag => (
                          <span key={tag} className="text-[10px] bg-white text-slate-500 font-bold border border-slate-200 px-2.5 py-1 rounded-xl">
                            {tag}
                          </span>
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
        <div className="text-center py-12 bg-white border border-slate-200 rounded-3xl shadow-sm select-none">
          <p className="text-xs font-black text-slate-400 tracking-wider uppercase">Nenhum procedimento encontrado.</p>
        </div>
      )}
    </PageShell>
  );
}
