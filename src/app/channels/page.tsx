"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { canais, categorias } from "@/lib/canais-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tv } from "lucide-react";

export default function CanalPage() {
  const [busca, setBusca] = useState("");

  // Filtrar canais por busca
  const canalsFiltrados = useMemo(() => {
    if (!busca.trim()) return canais;
    const buscaLower = busca.toLowerCase();
    return canais.filter(
      (canal) =>
        canal.nome.toLowerCase().includes(buscaLower) ||
        canal.categoria.toLowerCase().includes(buscaLower)
    );
  }, [busca]);

  // Agrupar canais por categoria
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

  // Ordem das categorias
  const categoriasOrdenadas = categorias.filter(
    (cat) => canaisPorCategoria[cat]?.length > 0
  );

  return (
    <main className="pb-20">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        {/* Header */}
        <div className="mb-6 pt-4">
          <div className="flex items-center gap-2 mb-4">
            <Tv className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-white">Grade de Canais</h1>
          </div>
          <p className="text-slate-400">
            Explore todos os {canais.length} canais disponíveis na sua oferta
          </p>
        </div>

        {/* Busca */}
        <Card className="mb-6 bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="relative">
              <Input
                placeholder="Buscar canal ou categoria..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-4 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            {busca && (
              <p className="text-sm text-slate-400 mt-2">
                {canalsFiltrados.length} canal(is) encontrado(s)
              </p>
            )}
          </CardContent>
        </Card>

        {/* Categorias e Canais */}
        <div className="space-y-6">
          {categoriasOrdenadas.length > 0 ? (
            categoriasOrdenadas.map((categoria) => (
              <Card
                key={categoria}
                className="bg-slate-800 border-slate-700 overflow-hidden"
              >
                <CardHeader className="pb-3 bg-gradient-to-r from-primary/20 to-primary/10">
                  <CardTitle className="text-lg text-white">
                    {categoria}
                  </CardTitle>
                  <CardDescription>
                    {canaisPorCategoria[categoria].length} canal(is)
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {canaisPorCategoria[categoria].map((canal) => (
                      <div
                        key={canal.id}
                        className="flex items-center gap-2 p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors border border-slate-600"
                      >
                        <Tv className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-white flex-1 truncate">
                          {canal.nome}
                        </span>
                        {canal.cortesia && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-amber-500/20 text-amber-300 border-amber-500/30"
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
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-8 pb-8 text-center">
                <Tv className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-400">
                  Nenhum canal encontrado para "{busca}"
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
