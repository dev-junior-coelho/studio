"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { canais, categorias } from "@/lib/canais-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tv, Search } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";

export default function CanalPage() {
  const [busca, setBusca] = useState("");

  const canalsFiltrados = useMemo(() => {
    if (!busca.trim()) return canais;
    const buscaLower = busca.toLowerCase();
    return canais.filter(
      (canal) =>
        canal.nome.toLowerCase().includes(buscaLower) ||
        canal.categoria.toLowerCase().includes(buscaLower)
    );
  }, [busca]);

  const canaisPorCategoria = useMemo(() => {
    const agrupados: Record<string, typeof canais> = {};
    canalsFiltrados.forEach((canal) => {
      if (!agrupados[canal.categoria]) {
        agrupados[canal.categoria] = [];
      }
      agrupados[canal.categoria].push(canal);
    });
    return agrupados;
  }, [canalsFiltrados]);

  const categoriasOrdenadas = categorias.filter(
    (cat) => canaisPorCategoria[cat]?.length > 0
  );

  return (
    <PageShell
      title="Grade de Canais"
      description={`Explore todos os ${canais.length} canais disponíveis.`}
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="border border-red-200 bg-red-50 text-red-600 rounded-xl font-black uppercase tracking-wider text-[10px] select-none">
            {canais.length} Canais
          </Badge>
        </div>
      }
    >
        <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-5 mb-6 animate-in fade-in duration-500">
          <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 select-none">Buscar Canal ou Categoria</label>
          <div className="relative mt-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar canal ou categoria..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 bg-white border-slate-200 focus:border-red-500 focus:ring-red-500/10 rounded-2xl h-11 text-xs font-bold transition-all shadow-sm focus:shadow-md"
            />
          </div>
          {busca && (
            <p className="text-[11px] font-black uppercase tracking-wider text-red-500 mt-2 select-none">
              {canalsFiltrados.length} canal(is) encontrado(s)
            </p>
          )}
        </div>

        <div className="space-y-6 animate-in fade-in duration-500">
          {categoriasOrdenadas.length > 0 ? (
            categoriasOrdenadas.map((categoria) => (
              <Card
                key={categoria}
                className="overflow-hidden bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-lg rounded-3xl transition-all duration-300"
              >
                <CardHeader className="pb-3 border-b border-slate-200 bg-gradient-to-r from-red-50/20 to-transparent">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base font-black text-slate-800 tracking-tight">
                      {categoria}
                    </CardTitle>
                    <Badge className="text-[10px] font-black uppercase tracking-wider border-none rounded-xl px-2.5 py-0.5 select-none bg-red-50 text-red-600">
                      {canaisPorCategoria[categoria].length} Canais
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {canaisPorCategoria[categoria].map((canal) => (
                      <div
                        key={canal.id}
                        className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-all border border-slate-200 hover:border-slate-300 select-none hover:shadow-sm"
                      >
                        <Tv className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <span className="text-xs font-bold text-slate-700 flex-1 truncate leading-tight">
                          {canal.nome}
                        </span>
                        {canal.cortesia && (
                          <Badge
                            variant="secondary"
                            className="text-[9px] font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 rounded-xl"
                          >
                            Cortesia
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border border-slate-200 bg-white/80 rounded-3xl p-8 text-center animate-in fade-in duration-500">
              <CardContent className="p-0">
                <Tv className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-black text-slate-700 tracking-tight">Nenhum canal encontrado</p>
                <p className="text-xs text-muted-foreground mt-0.5">Tente usar outros termos de busca.</p>
              </CardContent>
            </Card>
          )}
        </div>
    </PageShell>
  );
}
