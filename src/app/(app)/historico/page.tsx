"use client";

import { HistoryList } from "@/components/history-list";
import { PageShell } from "@/components/layout/page-shell";

export default function HistoricoPage() {
    return (
        <PageShell
            title="Histórico"
            description="Acompanhe suas ofertas registradas."
            className="pb-24"
            contentClassName="max-w-6xl"
        >
            <HistoryList />
        </PageShell>
    );
}
