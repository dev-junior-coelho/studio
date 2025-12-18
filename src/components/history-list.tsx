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

    useEffect(() => {
        async function fetchHistory() {
            if (!user || !firestore) return;

            setLoading(true);
            try {
                let q;
                let historyData: SavedOffer[] = [];

                if (user.role === 'supervisor') {
                    // Supervisor sees all offers via collectionGroup
                    try {
                        q = query(collectionGroup(firestore, 'ofertas_salvas'), orderBy("timestamp", "desc"));
                        const snapshot = await getDocs(q);
                        historyData = snapshot.docs.map(doc => ({
                            id: doc.id,
                            usuarioId: doc.ref.parent.parent?.id,
                            ...doc.data()
                        })) as SavedOffer[];
                    } catch (indexError: any) {
                        // If collectionGroup index is missing, fallback to fetching from each user
                        console.warn("CollectionGroup index not available, using fallback:", indexError.message);

                        // Fetch all users from 'usuarios' collection
                        const usersSnapshot = await getDocs(collection(firestore, 'usuarios'));
                        const allOffers: SavedOffer[] = [];

                        for (const userDoc of usersSnapshot.docs) {
                            // Fetch offers from subcollection of EACH user
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

                        // Sort by timestamp descending
                        historyData = allOffers.sort((a, b) => {
                            const timeA = a.timestamp?.toMillis() || 0;
                            const timeB = b.timestamp?.toMillis() || 0;
                            return timeB - timeA;
                        });
                    }
                } else {
                    // Agent sees only their own offers
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
                if (error.code === 'failed-precondition') {
                    console.log("⚠️ Índice ausente! Verifique o console para o link de criação.");
                }
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
        // Status filter
        if (statusFilter !== "all" && offer.status !== statusFilter) return false;

        // Date filter
        if (dateFilter) {
            const offerDate = offer.timestamp?.toDate() || new Date();
            const filterDateKey = dateFilter; // format is yyyy-mm-dd from input
            const offerDateKey = format(offerDate, 'yyyy-MM-dd');
            if (offerDateKey !== filterDateKey) return false;
        }

        // Search term filter
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        const zLogin = offer.zLogin?.toLowerCase() || '';
        const contrato = offer.contrato?.toLowerCase() || '';
        const email = offer.email?.toLowerCase() || '';
        const nome = offer.nome?.toLowerCase() || '';

        return zLogin.includes(term) || contrato.includes(term) || email.includes(term) || nome.includes(term);
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Carregando histórico...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-2 rounded-lg transition-colors",
                            user?.role === 'supervisor' ? "bg-purple-100 text-purple-600" : "bg-primary/10 text-primary"
                        )}>
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">
                                {user?.role === 'supervisor' ? "Visão Geral de Vendas" : "Histórico de Vendas"}
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                {user?.role === 'supervisor' ? "Acompanhe o desempenho de todos os agentes" : "Acompanhe suas últimas negociações"}
                            </p>
                        </div>
                    </div>

                    <div className="relative w-full sm:w-[250px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por Z, Nome, Contrato..."
                            className="pl-9 pr-8 bg-white shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                                title="Limpar busca"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <Filter className="h-3.5 w-3.5" />
                        Filtros:
                    </div>

                    <div className="flex flex-1 flex-wrap gap-3">
                        {/* Filtro de Status */}
                        <div className="min-w-[140px]">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-9 bg-white text-xs">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os Status</SelectItem>
                                    <SelectItem value="Aceitou">Vendas Realizadas</SelectItem>
                                    <SelectItem value="Recusou">Ofertas Recusadas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Filtro de Data */}
                        <div className="relative min-w-[160px]">
                            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                            <Input
                                type="date"
                                className="h-9 pl-8 bg-white text-xs"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>

                        {(statusFilter !== "all" || dateFilter !== "") && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setStatusFilter("all");
                                    setDateFilter("");
                                }}
                                className="h-9 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 px-2"
                            >
                                <FilterX className="h-3.5 w-3.5 mr-1" />
                                Limpar
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {filteredOffers.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 p-4 text-center border-2 border-dashed rounded-2xl bg-gray-50/50">
                    <div className="bg-white p-6 rounded-full shadow-sm border border-gray-100">
                        <CalendarDays className="h-10 w-10 text-gray-300" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-lg font-bold text-gray-700">Nenhum registro</h2>
                        <p className="text-sm text-gray-400">Não encontramos nenhuma oferta com estes filtros.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-10 pb-20">
                    {(() => {
                        // Agrupar ofertas por data
                        const grouped = filteredOffers.reduce((acc, offer) => {
                            const date = offer.timestamp?.toDate() || new Date();
                            const dateKey = format(date, 'yyyy-MM-dd');
                            if (!acc[dateKey]) acc[dateKey] = [];
                            acc[dateKey].push(offer);
                            return acc;
                        }, {} as Record<string, SavedOffer[]>);

                        // Ordenar chaves das datas (mais recente primeiro)
                        const sortedKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

                        return sortedKeys.map(dateKey => {
                            const offersInDay = grouped[dateKey];
                            const dateObj = new Date(dateKey + 'T12:00:00');

                            let dateLabel = format(dateObj, "d 'de' MMMM", { locale: ptBR });
                            if (isToday(dateObj)) dateLabel = "Hoje";
                            else if (isYesterday(dateObj)) dateLabel = "Ontem";

                            return (
                                <div key={dateKey} className="space-y-4">
                                    <div className="flex items-center gap-4 sticky top-0 z-10 bg-inherit py-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">{dateLabel}</span>
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                {offersInDay.length} {offersInDay.length === 1 ? 'REGISTRO' : 'REGISTROS'}
                                            </span>
                                        </div>
                                        <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
                                    </div>

                                    <div className="grid gap-4">
                                        {offersInDay.map((offer) => (
                                            <Card key={offer.id} className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white overflow-hidden relative border-l-4 border-l-transparent">
                                                {/* Status left border indicator */}
                                                <div className={cn(
                                                    "absolute left-0 top-0 bottom-0 w-1",
                                                    offer.status === 'Aceitou' ? "bg-emerald-500" : "bg-slate-300"
                                                )} />

                                                <CardContent className="p-0">
                                                    <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                                        {/* Main Info Column */}
                                                        <div className="flex-1 p-5 space-y-4">
                                                            <div className="flex items-start justify-between">
                                                                <div className="space-y-2">
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        <Badge className={cn(
                                                                            "text-[10px] font-black uppercase tracking-tighter border-none",
                                                                            offer.status === 'Aceitou' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                                                                        )}>
                                                                            {offer.status === 'Aceitou' ? 'Venda Confirmada' : 'Cliente Recusou'}
                                                                        </Badge>
                                                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                                            <Clock className="h-3 w-3" />
                                                                            {offer.timestamp ? format(offer.timestamp.toDate(), "HH:mm") : '--:--'}
                                                                        </span>
                                                                    </div>

                                                                    {user?.role === 'supervisor' && (
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                                                                                {(offer.nome || 'A').charAt(0)}
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-sm font-bold text-slate-800 leading-tight">{offer.nome || 'Agente'}</p>
                                                                                <p className="text-[10px] font-medium text-slate-500">Log: <span className="font-bold text-primary">Z{offer.zLogin || '---'}</span></p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="text-right">
                                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Mensal</p>
                                                                    <p className="text-2xl font-black text-slate-900 tracking-tighter">
                                                                        {formatCurrency(offer.totalOferta)}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Configuração da Oferta</p>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {offer.produtos && offer.produtos.map((prod: any, idx: number) => (
                                                                        <span key={idx} className="inline-flex items-center px-2 py-1 rounded bg-slate-50 border border-slate-100 text-[11px] font-medium text-slate-700">
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

                                                        {/* Details Column */}
                                                        <div className="w-full md:w-[240px] bg-slate-50/50 p-5 flex flex-col justify-between gap-4">
                                                            <div className="space-y-4">
                                                                {offer.status === 'Aceitou' && (
                                                                    <div className="space-y-1">
                                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocolo/Contrato</p>
                                                                        <div className="flex items-center gap-2 text-sm font-mono font-bold text-slate-700">
                                                                            <FileText className="h-3.5 w-3.5 text-primary" />
                                                                            {offer.contrato}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <div className="space-y-1">
                                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Impacto da Negociação</p>
                                                                    <div className={cn(
                                                                        "flex items-center gap-1.5 font-bold text-sm",
                                                                        offer.economia >= 0 ? "text-emerald-600" : "text-amber-600"
                                                                    )}>
                                                                        {offer.economia >= 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                                                                        {offer.economia >= 0 ? 'Economia: ' : 'Investimento: '}
                                                                        {formatCurrency(Math.abs(offer.economia))}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200/50">
                                                                {offer.debitoEmConta ? (
                                                                    <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700 border-emerald-100 flex gap-1 items-center font-bold">
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
