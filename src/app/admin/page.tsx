"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Package,
    FileText,
    ArrowRight,
    TrendingUp,
    Users,
    Target,
    Zap,
    ChevronRight,
    PlusCircle,
    History as HistoryIcon
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFirebase } from "@/firebase/provider";
import { collection, collectionGroup, getDocs, onSnapshot, query } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboardPage() {
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOffers: 0,
        activeAgents: 0, // Agora representará agentes únicos que ofertaram
        totalRegisteredAgents: 0, // Novo: Total de agentes no banco
        conversionRate: 0,
        totalEconomy: 0,
        minEconomy: 0,
        todaySales: 0,
        topAgents: [] as { nome: string; zLogin: string; vendas: number; conversao: number }[],
        allAgentsList: [] as any[], // Nova lista de agentes
        isLoading: true
    });

    // Listener para Agentes Cadastrados e Notificações (DINÂMICO)
    useEffect(() => {
        if (!firestore) return;

        let isInitialLoad = true;
        const q = query(collection(firestore, 'usuarios'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const users = snapshot.docs.map(doc => doc.data() as any);

            // FILTRO: Apenas agentes com Z-Login válido e que não sejam a conta genérica 'agente'
            const validAgents = users.filter((u: any) =>
                u.role === 'agente' &&
                u.zLogin &&
                u.zLogin.toLowerCase() !== 'agente' &&
                !u.nome?.toLowerCase().includes('agente')
            );

            // DINÂMICO: Agentes em Campo (Ativos na última 1 hora)
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            const activeNowCount = validAgents.filter(u => {
                if (!u.lastSeen) return false;
                const lastSeenDate = new Date(u.lastSeen);
                return lastSeenDate > oneHourAgo;
            }).length;

            setStats(prev => ({
                ...prev,
                totalRegisteredAgents: validAgents.length,
                activeAgents: activeNowCount,
                allAgentsList: validAgents.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''))
            }));

            // Notificar sobre novos usuários
            if (!isInitialLoad) {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const newUser = change.doc.data() as any;
                        if (newUser.role === 'agente' && newUser.zLogin && newUser.zLogin.toLowerCase() !== 'agente') {
                            toast({
                                title: "🚀 Novo Agente Registrado",
                                description: `${newUser.nome || 'Um novo agente'} (Z${newUser.zLogin || '---'}) acabou de entrar no time.`,
                                duration: 5000,
                            });
                        }
                    }
                });
            }
            isInitialLoad = false;
        });

        return () => unsubscribe();
    }, [firestore, toast]);

    useEffect(() => {
        if (!firestore) return;

        const q = query(collectionGroup(firestore, 'ofertas_salvas'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            try {
                const allDocs = snapshot.docs.map(doc => {
                    const data = doc.data() as any;
                    return {
                        ...data,
                        createdAt: data.timestamp?.toDate() || new Date()
                    };
                });

                const totalOffersCount = allDocs.length;
                const successfulSalesDocs = allDocs.filter(d => d.status === 'Aceitou');
                const totalSalesCount = successfulSalesDocs.length;

                // Economia e Melhor Margem (Menor Desconto)
                let minEco = successfulSalesDocs.length > 0 ? Infinity : 0;
                const economy = successfulSalesDocs.reduce((acc, curr) => {
                    const valorEco = curr.economia || 0;
                    if (valorEco < minEco && valorEco > 0) minEco = valorEco;
                    return acc + (valorEco > 0 ? valorEco : 0);
                }, 0);
                if (minEco === Infinity) minEco = 0;

                // Ranking - Mapeando apenas REAIS (com Z-Login)
                const agentMap = new Map<string, { nome: string; zLogin: string; total: number; aceitou: number }>();
                allDocs.forEach(doc => {
                    if (!doc.zLogin || doc.zLogin.toLowerCase() === 'agente') return;

                    const id = doc.usuarioId || doc.zLogin;
                    const data = agentMap.get(id) || {
                        nome: doc.nome || 'Agente',
                        zLogin: doc.zLogin || '---',
                        total: 0,
                        aceitou: 0
                    };
                    data.total++;
                    if (doc.status === 'Aceitou') data.aceitou++;
                    agentMap.set(id, data);
                });

                const topThree = Array.from(agentMap.values())
                    .filter(a => a.aceitou > 0)
                    .sort((a, b) => b.aceitou - a.aceitou)
                    .slice(0, 3)
                    .map(a => ({
                        nome: a.nome,
                        zLogin: a.zLogin,
                        vendas: a.aceitou,
                        conversao: a.total > 0 ? (a.aceitou / a.total) * 100 : 0
                    }));

                // Vendas de Hoje
                const hoje = new Date();
                const todaySalesVal = successfulSalesDocs.filter(d => {
                    const dt = d.createdAt;
                    return dt.getDate() === hoje.getDate() &&
                        dt.getMonth() === hoje.getMonth() &&
                        dt.getFullYear() === hoje.getFullYear();
                }).length;

                setStats(prev => ({
                    ...prev,
                    totalSales: totalSalesCount,
                    totalOffers: totalOffersCount,
                    conversionRate: totalOffersCount > 0 ? (totalSalesCount / totalOffersCount) * 100 : 0,
                    totalEconomy: economy,
                    minEconomy: minEco,
                    todaySales: todaySalesVal,
                    topAgents: topThree,
                    isLoading: false
                }));
            } catch (error) {
                console.error("Error processing admin stats:", error);
                setStats(s => ({ ...s, isLoading: false }));
            }
        });

        return () => unsubscribe();
    }, [firestore]);

    if (stats.isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Boas vindas e Título */}
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">Centro de Comando Real-Time</h2>
                <p className="text-slate-500 font-medium font-mono text-[11px] uppercase tracking-widest bg-slate-100 w-fit px-2 py-1 rounded">Atividade e Inteligência de Vendas</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Vendas de Hoje"
                    value={stats.todaySales.toString()}
                    change="Volume atual"
                    isPositive={true}
                    icon={Zap}
                    color="text-amber-600"
                    bg="bg-amber-50"
                />
                <StatCard
                    title="Vendas Acumuladas"
                    value={stats.totalSales.toString()}
                    change="Convertidas"
                    isPositive={true}
                    icon={TrendingUp}
                    color="text-emerald-600"
                    bg="bg-emerald-50"
                />
                <StatCard
                    title="Abordagens Totais"
                    value={stats.totalOffers.toString()}
                    change="Ofertas realizadas"
                    isPositive={true}
                    icon={FileText}
                    color="text-blue-600"
                    bg="bg-blue-50"
                />
                <StatCard
                    title="Taxa de Conversão"
                    value={`${stats.conversionRate.toFixed(1)}%`}
                    change={`${stats.totalSales} vendas`}
                    isPositive={stats.conversionRate > 25}
                    icon={Target}
                    color="text-emerald-600"
                    bg="bg-emerald-50"
                />
            </div>

            {/* Ações Principais e Resumo de Equipe */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total de Agentes"
                    value={stats.totalRegisteredAgents.toString()}
                    change="Time cadastrado"
                    isPositive={true}
                    icon={Users}
                    color="text-indigo-600"
                    bg="bg-indigo-50"
                />
                <StatCard
                    title="Agentes em Campo"
                    value={stats.activeAgents.toString()}
                    change="Ativos (1h)"
                    isPositive={true}
                    icon={Zap}
                    color="text-emerald-600"
                    bg="bg-emerald-50"
                />
                <div className="md:col-span-2 flex items-center justify-center p-6 bg-white rounded-xl border border-dashed border-slate-200">
                    <div className="flex items-center gap-3 text-slate-400">
                        <Users className="h-5 w-5 opacity-50" />
                        <p className="text-sm font-medium">Monitoramento de equipe em tempo real ativado.</p>
                    </div>
                </div>
            </div>

            {/* Impacto e Ranking */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Impacto Financeiro Destacado */}
                <Card className="border-none shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Zap className="w-32 h-32" />
                    </div>
                    <CardContent className="p-8">
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Target className="h-4 w-4 text-emerald-400" /> Impacto Financeiro
                                </h3>
                                <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full uppercase tracking-tighter border border-emerald-500/20">
                                    Real-Time
                                </span>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-baseline border-b border-white/5 pb-3">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Impacto Acumulado</span>
                                    <span className="text-4xl font-black text-white tracking-tighter">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalEconomy)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline border-b border-white/5 pb-3">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Melhor Margem</span>
                                    <span className="text-2xl font-black text-emerald-400 tracking-tighter">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.minEconomy)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline pt-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Custo de Retenção</span>
                                    <span className="text-2xl font-black text-white tracking-tighter">
                                        R$ {(stats.totalEconomy / (stats.totalSales || 1)).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <p className="text-[10px] text-slate-500 font-medium uppercase mt-8 text-center tracking-[0.2em] opacity-50">
                                Métricas de eficiência de negociação
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Ranking de Performance */}
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <PlusCircle className="h-4 w-4 text-primary" /> Ranking de Agentes
                        </CardTitle>
                        <CardDescription>Top 3 maior volume de conversão</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.topAgents.length > 0 ? stats.topAgents.map((agent, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs",
                                            i === 0 ? "bg-amber-100 text-amber-700 border border-amber-200" :
                                                i === 1 ? "bg-slate-200 text-slate-700 border border-slate-300" :
                                                    "bg-orange-100 text-orange-700 border border-orange-200"
                                        )}>
                                            {i + 1}º
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold text-slate-800">{agent.nome}</p>
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-bold uppercase">
                                                    Z{agent.zLogin}
                                                </span>
                                            </div>
                                            <p className="text-[10px] font-medium text-slate-500 uppercase">{agent.vendas} vendas fechadas</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-emerald-600">{agent.conversao.toFixed(0)}%</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Conversão</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-slate-400 text-sm italic">
                                    Aguardando as primeiras vendas de hoje...
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>


            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <ActionCard
                    title="Gestão de Produtos"
                    description="Controle o catálogo de ofertas e preços."
                    href="/admin/products"
                    icon={Package}
                    color="bg-blue-600"
                    buttonLabel="Gerenciar Inventário"
                />
                <ActionCard
                    title="Scripts de Vendas"
                    description="Configure os guias rápidos e scripts."
                    href="/admin/procedures"
                    icon={FileText}
                    color="bg-indigo-600"
                    buttonLabel="Editar Procedimentos"
                />
                <ActionCard
                    title="Gestão de Equipe"
                    description="Monitore logins, atividade e status dos agentes."
                    href="/admin/agents"
                    icon={Users}
                    color="bg-emerald-600"
                    buttonLabel="Lista de Agentes"
                />
                <ActionCard
                    title="Relatório de Vendas"
                    description="Acompanhe o histórico de vendas detalhado."
                    href="/admin/history"
                    icon={HistoryIcon}
                    color="bg-slate-800"
                    buttonLabel="Ver Histórico"
                    variant="secondary"
                />
            </div>
        </div>
    );
}

function StatCard({ title, value, change, isPositive, icon: Icon, color, bg }: any) {
    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 group">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-2 rounded-lg", bg)}>
                        <Icon className={cn("h-5 w-5", color)} />
                    </div>
                    <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        isPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    )}>
                        {change}
                    </span>
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-500 mb-1">{title}</p>
                    <h4 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h4>
                </div>
            </CardContent>
        </Card>
    );
}

function ActionCard({ title, description, href, icon: Icon, color, buttonLabel, variant = "default" }: any) {
    return (
        <Card className="border-none shadow-sm group hover:ring-2 hover:ring-primary/20 transition-all overflow-hidden">
            <div className={cn("h-1 w-full", color)} />
            <CardHeader>
                <div className="flex items-center justify-between mb-2">
                    <div className={cn("p-2 rounded-lg bg-slate-100 group-hover:scale-110 transition-transform")}>
                        <Icon className="h-5 w-5 text-slate-600" />
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                </div>
                <CardTitle className="text-lg font-bold">{title}</CardTitle>
                <CardDescription className="text-slate-500 font-medium leading-relaxed">{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Link href={href} passHref>
                    <Button className="w-full text-xs font-bold tracking-wide transition-all" variant={variant}>
                        {buttonLabel}
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}

import { cn } from "@/lib/utils";
