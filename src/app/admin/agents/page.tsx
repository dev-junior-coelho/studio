"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    Zap,
    ChevronLeft,
    Search
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFirebase } from "@/firebase/provider";
import { collection, onSnapshot, query } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function AdminAgentsPage() {
    const { firestore } = useFirebase();
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState({
        agents: [] as any[],
        activeCount: 0,
        isLoading: true
    });

    useEffect(() => {
        if (!firestore) return;

        const q = query(collection(firestore, 'usuarios'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const users = snapshot.docs.map(doc => doc.data() as any);

            // FILTRO: Apenas agentes com Z-Login válido e que não sejam a conta genérica 'agente'
            const validAgents = users.filter((u: any) =>
                u.role === 'agente' &&
                u.zLogin &&
                u.zLogin.toLowerCase() !== 'agente' &&
                !u.nome?.toLowerCase().includes('agente')
            ).sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));

            // DINÂMICO: Agentes em Campo (Ativos na última 1 hora)
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            const activeNowCount = validAgents.filter(u => {
                if (!u.lastSeen) return false;
                const lastSeenDate = new Date(u.lastSeen);
                return lastSeenDate > oneHourAgo;
            }).length;

            setData({
                agents: validAgents,
                activeCount: activeNowCount,
                isLoading: false
            });
        });

        return () => unsubscribe();
    }, [firestore]);

    const filteredAgents = data.agents.filter(agent =>
        (agent.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (agent.zLogin || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (data.isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header com Navegação */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Link href="/admin" className="flex items-center gap-1 text-slate-500 hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider mb-2">
                        <ChevronLeft className="h-4 w-4" /> Voltar ao Dashboard
                    </Link>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-3">
                        <Users className="h-8 w-8 text-indigo-600" /> Gestão de Equipe
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">Monitoramento detalhado e controle de acesso dos agentes.</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                    <div className="text-right px-3 border-r border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Total</p>
                        <p className="text-xl font-black text-slate-700 leading-none">{data.agents.length}</p>
                    </div>
                    <div className="text-right px-3">
                        <p className="text-[10px] font-black text-emerald-500 uppercase leading-none mb-1">Online</p>
                        <p className="text-xl font-black text-emerald-600 leading-none">{data.activeCount}</p>
                    </div>
                </div>
            </div>

            {/* Barra de Busca e Filtros */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input
                    placeholder="Buscar por nome ou Z-Login..."
                    className="pl-12 h-14 bg-white border-none shadow-sm text-lg font-medium focus-visible:ring-2 focus-visible:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Lista de Agentes */}
            <Card className="border-none shadow-xl overflow-hidden bg-white">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Agente</th>
                                    <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Identificação</th>
                                    <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Monitoramento</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredAgents.length > 0 ? filteredAgents.map((agent, idx) => {
                                    const isOnline = agent.lastSeen && new Date(agent.lastSeen) > new Date(Date.now() - 60 * 60 * 1000);
                                    return (
                                        <tr key={idx} className="hover:bg-slate-50/80 transition-all group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm border-2 transition-all",
                                                        isOnline ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-slate-50 border-slate-100 text-slate-400"
                                                    )}>
                                                        {agent.nome?.substring(0, 2).toUpperCase() || '??'}
                                                    </div>
                                                    <div>
                                                        <p className="text-base font-bold text-slate-800">{agent.nome || 'Sem Nome'}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{agent.email || '---'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <Badge variant="outline" className="font-mono text-sm px-3 py-1 bg-slate-50 border-slate-200 text-slate-600 font-black">
                                                    Z{agent.zLogin}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-2.5 w-2.5 rounded-full ring-4",
                                                        isOnline ? "bg-emerald-500 ring-emerald-500/20 animate-pulse" : "bg-slate-300 ring-slate-300/10"
                                                    )} />
                                                    <span className={cn(
                                                        "text-xs font-black uppercase tracking-tighter",
                                                        isOnline ? "text-emerald-600" : "text-slate-400"
                                                    )}>
                                                        {isOnline ? "Conectado" : "Offline"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm font-black text-slate-700">
                                                        {agent.lastSeen ? new Date(agent.lastSeen).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '---'}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Último Sinal</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <Users className="h-12 w-12 text-slate-200 mx-auto mb-4 opacity-50" />
                                            <p className="text-slate-400 font-bold">Nenhum agente encontrado na busca.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
