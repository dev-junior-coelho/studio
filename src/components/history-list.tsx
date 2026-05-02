"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useFirebase } from "@/firebase/provider";
import { collection, query, orderBy, getDocs, Timestamp, collectionGroup, where } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    User,
    Filter,
    FilterX,
    Calendar,
    Loader2,
    Clock,
    Search,
    Check,
    X,
    TrendingDown,
    TrendingUp,
    FileText,
    CalendarDays
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface SavedOffer {
    id: string;
    status: 'Aceitou' | 'Recusou';
    contrato: string;
    totalOferta: number;
    economia: number;
    timestamp: Timestamp;
    produtoIds: string[];
    produtos: any[];
    debitoEmConta: boolean;
    zLogin?: string; // Optional for backward compatibility
    nome?: string; // Nome do agente
    supervisor?: string; // Supervisor do agente no momento da venda
    email?: string;
    usuarioId?: string;
}

export function HistoryList() {
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const [offers, setOffers] = useState<SavedOffer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [dateFilter, setDateFilter] = useState<string>("");
    const [supervisorFilter, setSupervisorFilter] = useState<string>("all");

    useEffect(() => {
        async function fetchHistory() {
            if (!user || !firestore) return;

            setLoading(true);
            try {
                let q;
                let historyData: SavedOffer[] = [];

                if (user.role === 'supervisor') {
                    try {
                        q = query(collectionGroup(firestore, 'ofertas_salvas'), orderBy("timestamp", "desc"));
                        const snapshot = await getDocs(q);
                        historyData = snapshot.docs.map(doc => ({
                            id: doc.id,
                            usuarioId: doc.ref.parent.parent?.id,
                            ...doc.data()
                        })) as SavedOffer[];
                    } catch (indexError: any) {
                        console.warn("CollectionGroup index not available, using fallback:", indexError.message);

                        const usersSnapshot = await getDocs(collection(firestore, 'usuarios'));
                        const allOffers: SavedOffer[] = [];

                        for (const userDoc of usersSnapshot.docs) {
                            const offersRef = collection(firestore, `usuarios/${userDoc.id}/ofertas_salvas`);
                            try {
                                const offersSnapshot = await getDocs(query(offersRef, orderBy("timestamp", "desc")));
                                offersSnapshot.docs.forEach(offerDoc => {
                                    allOffers.push({
                                        id: offerDoc.id,
                                        usuarioId: userDoc.id,
                                        ...offerDoc.data()
                                    } as SavedOffer);
                                });
                            } catch (e) {
                                console.warn(`Could not fetch offers for user ${userDoc.id}:`, e);
                            }
                        }

                        historyData = allOffers.sort((a, b) => {
                            const timeA = a.timestamp?.toMillis() || 0;
                            const timeB = b.timestamp?.toMillis() || 0;
                            return timeB - timeA;
                        });
                    }
                } else {
                    const historyRef = collection(firestore, `usuarios/${user.uid}/ofertas_salvas`);
                    q = query(historyRef, orderBy("timestamp", "desc"));
                    const snapshot = await getDocs(q);
                    historyData = snapshot.docs.map(doc => ({
                        id: doc.id,
                        usuarioId: doc.ref.parent.parent?.id,
                        ...doc.data()
                    })) as SavedOffer[];
                }

                setOffers(historyData);
            } catch (error: any) {
                console.error("Erro ao buscar histórico:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchHistory();
    }, [user, firestore]);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const filteredOffers = offers.filter(offer => {
        const offerZ = (offer.zLogin || '').replace(/^z/i, '');
        if (offerZ === "000000" || offerZ === "000001") return false;
        const offerEmail = (offer.email || '').toLowerCase();
        if (offerEmail.startsWith("z000000@") || offerEmail.startsWith("z000001@")) return false;

        if (statusFilter !== "all" && offer.status !== statusFilter) return false;
        if (supervisorFilter !== "all" && offer.supervisor !== supervisorFilter) return false;

        if (dateFilter) {
            const offerDate = offer.timestamp?.toDate() || new Date();
            const filterDateKey = dateFilter;
            const offerDateKey = format(offerDate, 'yyyy-MM-dd');
            if (offerDateKey !== filterDateKey) return false;
        }

        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        const zLogin = offer.zLogin?.toLowerCase() || '';
        const contrato = offer.contrato?.toLowerCase() || '';
        const email = offer.email?.toLowerCase() || '';
        const nome = offer.nome?.toLowerCase() || '';
        const supervisor = offer.supervisor?.toLowerCase() || '';

        return zLogin.includes(term) || contrato.includes(term) || email.includes(term) || nome.includes(term) || supervisor.includes(term);
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-red-500" />
                <p className="text-xs font-bold text-slate-500 animate-pulse">Carregando histórico...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-2.5 rounded-2xl bg-red-50 border border-red-100/50 text-red-500 shadow-sm"
                        )}>
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight leading-tight">
                                {user?.role === 'supervisor' ? "Visão Geral de Vendas" : "Histórico de Vendas"}
                            </h2>
                            <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">
                                {user?.role === 'supervisor' ? "Acompanhe o desempenho de todos os agentes" : "Acompanhe suas últimas negociações"}
                            </p>
                        </div>
                    </div>

                    <div className="relative w-full sm:w-[260px]">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Buscar por Z, Nome, Contrato..."
                            className="pl-10 pr-9 bg-white border-slate-200 focus:border-red-500 focus:ring-red-500/10 rounded-2xl h-11 text-xs font-bold transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                title="Limpar busca"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-200 animate-in fade-in duration-300">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 select-none">
                        <Filter className="h-3.5 w-3.5" />
                        Filtros:
                    </div>

                    <div className="flex flex-1 flex-wrap gap-3">
                        <div className="min-w-[140px]">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-9 bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl text-xs font-black uppercase tracking-wide transition-all select-none">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-200 overflow-hidden shadow-xl">
                                    <SelectItem value="all" className="text-xs font-bold">Todos os Status</SelectItem>
                                    <SelectItem value="Aceitou" className="text-xs font-bold">Vendas Realizadas</SelectItem>
                                    <SelectItem value="Recusou" className="text-xs font-bold">Ofertas Recusadas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="relative min-w-[160px]">
                            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                            <Input
                                type="date"
                                className="h-9 pl-8 bg-white border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold transition-all"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>

                        {user?.role === 'supervisor' && (
                            <div className="min-w-[140px]">
                                <Select value={supervisorFilter} onValueChange={setSupervisorFilter}>
                                    <SelectTrigger className="h-9 bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl text-xs font-black uppercase tracking-wide transition-all select-none">
                                        <SelectValue placeholder="Supervisor" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-200 overflow-hidden shadow-xl">
                                        <SelectItem value="all" className="text-xs font-bold">Todas as Equipes</SelectItem>
                                        <SelectItem value="GILVAN" className="text-xs font-bold">Equipe GILVAN</SelectItem>
                                        <SelectItem value="HELIO" className="text-xs font-bold">Equipe HELIO</SelectItem>
                                        <SelectItem value="MARIANA PAIXÃO" className="text-xs font-bold">Equipe MARIANA</SelectItem>
                                        <SelectItem value="N/A" className="text-xs font-bold">Sem Supervisor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {(statusFilter !== "all" || dateFilter !== "" || supervisorFilter !== "all") && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setStatusFilter("all");
                                    setDateFilter("");
                                    setSupervisorFilter("all");
                                }}
                                className="h-9 text-[10px] font-black uppercase tracking-wider text-red-500 hover:text-red-600 hover:bg-red-50 px-2 rounded-xl"
                            >
                                <FilterX className="h-3.5 w-3.5 mr-1" />
                                Limpar
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {filteredOffers.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 p-4 text-center border border-dashed border-slate-200 rounded-3xl bg-slate-50/20">
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
                        <CalendarDays className="h-8 w-8 text-slate-300" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-sm font-black text-slate-700">Nenhum registro</h2>
                        <p className="text-xs text-slate-400 font-semibold">Não encontramos nenhuma oferta com estes filtros.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-10 pb-20">
                    {(() => {
                        const grouped = filteredOffers.reduce((acc, offer) => {
                            const date = offer.timestamp?.toDate() || new Date();
                            const dateKey = format(date, 'yyyy-MM-dd');
                            if (!acc[dateKey]) acc[dateKey] = [];
                            acc[dateKey].push(offer);
                            return acc;
                        }, {} as Record<string, SavedOffer[]>);

                        const sortedKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

                        return sortedKeys.map(dateKey => {
                            const offersInDay = grouped[dateKey];
                            const dateObj = new Date(dateKey + 'T12:00:00');

                            let dateLabel = format(dateObj, "d 'de' MMMM", { locale: ptBR });
                            if (isToday(dateObj)) dateLabel = "Hoje";
                            else if (isYesterday(dateObj)) dateLabel = "Ontem";

                            return (
                                <div key={dateKey} className="space-y-4">
                                    <div className="flex items-center gap-4 sticky top-0 z-10 py-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black text-slate-800 uppercase tracking-wide">{dateLabel}</span>
                                            <span className="h-1 w-1 rounded-full bg-red-500/40" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                {offersInDay.length} {offersInDay.length === 1 ? 'REGISTRO' : 'REGISTROS'}
                                            </span>
                                        </div>
                                        <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
                                    </div>

                                    <div className="grid gap-4">
                                        {offersInDay.map((offer) => (
                                            <Card key={offer.id} className="group border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-lg transition-all duration-300 bg-white rounded-3xl overflow-hidden relative">
                                                <div className={cn(
                                                    "absolute left-0 top-0 bottom-0 w-1",
                                                    offer.status === 'Aceitou' ? "bg-red-500" : "bg-slate-300"
                                                )} />

                                                <CardContent className="p-0">
                                                    <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100/60">
                                                        <div className="flex-1 p-5 space-y-4">
                                                            <div className="flex items-start justify-between">
                                                                <div className="space-y-2">
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        <Badge className={cn(
                                                                            "text-[10px] font-black uppercase tracking-wider border-none rounded-xl px-2.5 py-0.5 select-none",
                                                                            offer.status === 'Aceitou' ? "bg-red-50 text-red-600 hover:bg-red-50" : "bg-slate-50 text-slate-600 hover:bg-slate-50"
                                                                        )}>
                                                                            {offer.status === 'Aceitou' ? 'Venda Confirmada' : 'Cliente Recusou'}
                                                                        </Badge>
                                                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 select-none">
                                                                            <Clock className="h-3 w-3" />
                                                                            {offer.timestamp ? format(offer.timestamp.toDate(), "HH:mm") : '--:--'}
                                                                        </span>
                                                                    </div>

                                                                    {user?.role === 'supervisor' && (
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="h-7 w-7 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                                                                                {(offer.nome || 'A').charAt(0)}
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-sm font-bold text-slate-800 leading-tight">{offer.nome || 'Agente'}</p>
                                                                                <p className="text-[10px] font-medium text-slate-500">Log: <span className="font-bold text-red-500">Z{offer.zLogin || '---'}</span></p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="text-right">
                                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 select-none">Total Mensal</p>
                                                                    <p className="text-xl font-black text-slate-800 tracking-tight font-mono">
                                                                        {formatCurrency(offer.totalOferta)}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">Configuração da Oferta</p>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {offer.produtos && offer.produtos.map((prod: any, idx: number) => (
                                                                        <span key={idx} className="inline-flex items-center px-2 py-1 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-black text-slate-600 transition-colors hover:border-slate-300 select-none">
                                                                            <span className="mr-1 opacity-70">
                                                                                {prod.tipo === 'Movel' ? '📱' :
                                                                                    prod.tipo === 'Internet' || prod.tipo === 'Banda Larga' ? '🌐' :
                                                                                        prod.tipo === 'Fixo' ? '📞' : '📺'}
                                                                            </span>
                                                                            {prod.nome}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="w-full md:w-[240px] bg-slate-50/40 p-5 flex flex-col justify-between gap-4">
                                                            <div className="space-y-4">
                                                                {offer.status === 'Aceitou' && (
                                                                    <div className="space-y-1">
                                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">Protocolo/Contrato</p>
                                                                        <div className="flex items-center gap-2 text-xs font-mono font-black text-slate-700">
                                                                            <FileText className="h-3.5 w-3.5 text-red-500" />
                                                                            {offer.contrato}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <div className="space-y-1">
                                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">Impacto da Negociação</p>
                                                                    <div className={cn(
                                                                        "flex items-center gap-1.5 font-black text-xs font-mono tracking-tight",
                                                                        offer.economia >= 0 ? "text-emerald-600" : "text-amber-600"
                                                                    )}>
                                                                        {offer.economia >= 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                                                                        {offer.economia >= 0 ? 'Economia: ' : 'Investimento: '}
                                                                        {formatCurrency(Math.abs(offer.economia))}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-200/50">
                                                                {offer.debitoEmConta ? (
                                                                    <Badge variant="outline" className="text-[9px] bg-red-50/50 text-red-600 border-red-100 flex gap-1 items-center font-black uppercase tracking-wide select-none">
                                                                        <Check className="h-2.5 w-2.5" /> DÉBITO CONFIRMADO
                                                                    </Badge>
                                                                ) : (
                                                                    <div />
                                                                )}
                                                                <span className="text-[9px] font-bold text-slate-300">ID: {offer.id.slice(-6).toUpperCase()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            );
                        });
                    })()}
                </div>
            )}
        </div>
    );
}
