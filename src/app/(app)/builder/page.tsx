"use client";

import { BuilderView } from "@/components/app/builder-view";
import { PageShell } from "@/components/layout/page-shell";
import { NovaOfertaCard } from "@/components/nova-oferta-card";
import { useOffer } from "@/contexts/offer-context";
import { Plus, Tv, Wifi, Phone, Smartphone, Zap } from "lucide-react";

export default function MontadorPage() {
  const { products, debitoEmConta, setDebitoEmConta, descontoDCC, totalMensal, totalComDesconto, removeProduct } = useOffer();

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const getIconForType = (type: string) => {
    switch (type.toLowerCase()) {
      case "tv":
        return <Tv className="h-4 w-4" />;
      case "internet":
        return <Wifi className="h-4 w-4" />;
      case "fixo":
        return <Phone className="h-4 w-4" />;
      case "movel":
        return <Smartphone className="h-4 w-4" />;
      case "wifimesh":
      case "mesh":
        return <Zap className="h-4 w-4" />;
      default:
        return <Plus className="h-4 w-4" />;
    }
  };

  return (
    <PageShell
      title="Catálogo de Produtos"
      description="Pesquise e adicione itens na oferta."
      contentClassName="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
    >
      <div className="lg:col-span-8 xl:col-span-9">
        <BuilderView hideHeader className="rounded-xl border bg-card shadow-sm p-4 sm:p-6" />
      </div>
      <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 h-[calc(100vh-7rem)]">
        <NovaOfertaCard
          products={products}
          debitoEmConta={debitoEmConta}
          setDebitoEmConta={setDebitoEmConta}
          descontoDCC={descontoDCC}
          totalMensal={totalMensal}
          totalComDesconto={totalComDesconto}
          removeProduct={removeProduct}
          formatCurrency={formatCurrency}
          getIconForType={getIconForType}
        />
      </div>
    </PageShell>
  );
}
