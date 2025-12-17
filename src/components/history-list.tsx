"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useFirebase } from "@/firebase/provider";
import { collection, query, orderBy, getDocs, Timestamp, collectionGroup, where } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    CalendarDays,
    Check,
    X,
    TrendingDown,
    TrendingUp,
    FileText,
    Clock,
    Loader2,
    Search,
    User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
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

                        // Fetch all users and their offers
                        const usersSnapshot = await getDocs(collection(firestore, 'users'));
                        const allOffers: SavedOffer[] = [];

                        for (const userDoc of usersSnapshot.docs) {
                            const offersRef = collection(firestore, `users/${userDoc.id}/ofertas_salvas`);
                            const offersSnapshot = await getDocs(query(offersRef, orderBy("timestamp", "desc")));

                            offersSnapshot.docs.forEach(offerDoc => {
                                allOffers.push({
                                    id: offerDoc.id,
                                    usuarioId: userDoc.id,
                                    ...offerDoc.data()
                                } as SavedOffer);
                            });
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
                    const historyRef = collection(firestore, `users/${user.uid}/ofertas_salvas`);
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
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        // Check zLogin, contract number, or email
        const zLogin = offer.zLogin?.toLowerCase() || '';
        const contrato = offer.contrato?.toLowerCase() || '';
        const email = offer.email?.toLowerCase() || '';

        return zLogin.includes(term) || contrato.includes(term) || email.includes(term);
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

                {user?.role === 'supervisor' && (
                    <div className="relative w-full sm:w-[250px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filtrar por Z, Contrato..."
                            className="pl-9 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {filteredOffers.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 p-4 text-center border-2 border-dashed rounded-xl bg-gray-50/50">
                    <div className="bg-gray-100 p-6 rounded-full">
                        <CalendarDays className="h-10 w-10 text-gray-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-700">Nenhum registro encontrado</h2>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOffers.map((offer) => (
                        <Card key={offer.id} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                            <div className={cn(
                                "h-1.5 w-full",
                                offer.status === 'Aceitou' ? "bg-green-500" : "bg-red-400"
                            )} />

                            <CardHeader className="pb-3 pt-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge variant={offer.status === 'Aceitou' ? "default" : "secondary"}
                                                className={cn(
                                                    offer.status === 'Aceitou' ? "bg-green-600 hover:bg-green-700" : "bg-red-100 text-red-700 hover:bg-red-200"
                                                )}>
                                                {offer.status === 'Aceitou' ? (
                                                    <span className="flex items-center gap-1"><Check className="h-3 w-3" /> Venda Realizada</span>
                                                ) : (
                                                    <span className="flex items-center gap-1"><X className="h-3 w-3" /> Recusada</span>
                                                )}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <CalendarDays className="h-3 w-3" />
                                                {offer.timestamp ? format(offer.timestamp.toDate(), "d/MM 'às' HH:mm", { locale: ptBR }) : 'Data desconhecida'}
                                            </span>
                                            {user?.role === 'supervisor' && (offer.zLogin || offer.nome) && (
                                                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 flex gap-1">
                                                    <User className="h-3 w-3" />
                                                    {offer.zLogin && `Z${offer.zLogin}`}{offer.nome && ` - ${offer.nome}`}
                                                </Badge>
                                            )}
                                        </div>

                                        {offer.status === 'Aceitou' && (
                                            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mt-1">
                                                <FileText className="h-4 w-4 text-gray-400" />
                                                Contrato: <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-900">{offer.contrato}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground font-semibold uppercase">Valor Mensal</p>
                                        <p className="text-xl font-bold text-primary">{formatCurrency(offer.totalOferta)}</p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pb-3 border-t bg-gray-50/50 pt-3">
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Produtos Ofertados</p>
                                    <div className="flex flex-wrap gap-2">
                                        {offer.produtos && offer.produtos.length > 0 ? (
                                            offer.produtos.map((prod: any, idx: number) => (
                                                <Badge key={idx} variant="outline" className="bg-white text-gray-600 font-normal">
                                                    {prod.tipo === 'Movel' ? '📱' :
                                                        prod.tipo === 'Banda Larga' || prod.tipo === 'Internet' ? '🌐' :
                                                            prod.tipo === 'TV Cabeada' || prod.tipo === 'TV Box' ? '📺' :
                                                                prod.tipo === 'Fixo' ? '📞' : '📦'} {prod.nome}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">Detalhes dos produtos não disponíveis</span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="bg-white pt-3 pb-4 border-t flex justify-between items-center group">
                                <div className="flex items-center gap-2">
                                    {offer.economia >= 0 ? (
                                        <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2 py-1 rounded text-sm font-semibold">
                                            <TrendingDown className="h-4 w-4" />
                                            Economia: {formatCurrency(offer.economia)}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-red-700 bg-red-50 px-2 py-1 rounded text-sm font-semibold">
                                            <TrendingUp className="h-4 w-4" />
                                            Investimento: {formatCurrency(Math.abs(offer.economia))}
                                        </div>
                                    )}
                                </div>

                                {offer.debitoEmConta && (
                                    <div className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-full border">
                                        Débito em Conta Recebido
                                    </div>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
