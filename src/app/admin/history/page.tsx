"use client";

import { HistoryList } from "@/components/history-list";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminHistoryPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h2 className="text-2xl font-bold tracking-tight">Histórico de Vendas Geral</h2>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <HistoryList />
            </div>
        </div>
    );
}
