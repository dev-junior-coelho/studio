"use client";

import { BuilderView } from "@/components/app/builder-view";

export default function MontadorPage() {
  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-6 mb-20">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Catálogo de Produtos</h1>
      </div>
      <BuilderView />
    </div>
  );
}
