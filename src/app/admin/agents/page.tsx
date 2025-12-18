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
import { useAuth } from "@/contexts/auth-context";
import { useFirebase } from "@/firebase/provider";
import { collection, onSnapshot, query } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { doc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert, ShieldCheck as ShieldIcon } from "lucide-react";

export default function AdminAgentsPage() {
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [promoteTarget, setPromoteTarget] = useState<any>(null);
    const [demoteTarget, setDemoteTarget] = useState<any>(null);
    const [isUpdatingRole, setIsUpdatingRole] = useState(false);
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

            // FILTRO: Agentes e Supervisores com Z-Login válido e que não sejam a conta genérica 'agente'
            const validAgents = users.filter((u: any) =>
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
        (agent.zLogin || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (agent.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (agent.supervisor || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePromoteAgent = async () => {
        if (!promoteTarget || !firestore || !user) return;
        setIsUpdatingRole(true);
        try {
            await updateDoc(doc(firestore, "usuarios", promoteTarget.uid), {
                role: 'supervisor',
                promotedBy: user.nome || user.email,
                promotedAt: new Date().toISOString()
            });
            toast({
                title: "🛡️ Promoção Realizada!",
                description: `${promoteTarget.nome} agora é Supervisor.`,
            });
            setPromoteTarget(null);
        } catch (error) {
            console.error("Error promoting agent:", error);
            toast({
                title: "Erro ao promover",
                description: "Não foi possível alterar as permissões.",
                variant: "destructive"
            });
        } finally {
            setIsUpdatingRole(false);
        }
    };

    const handleDemoteAgent = async () => {
        if (!demoteTarget || !firestore || !user) return;
        setIsUpdatingRole(true);
        try {
            await updateDoc(doc(firestore, "usuarios", demoteTarget.uid), {
                role: 'agente',
                demotedBy: user.nome || user.email,
                demotedAt: new Date().toISOString()
            });
            toast({
                title: "⚠️ Permissão Removida",
                description: `${demoteTarget.nome} agora é novamente um Agente.`,
            });
            setDemoteTarget(null);
        } catch (error) {
            console.error("Error demoting supervisor:", error);
            toast({
                title: "Erro ao aplicar",
                description: "Não foi possível alterar as permissões.",
                variant: "destructive"
            });
        } finally {
            setIsUpdatingRole(false);
        }
    };

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
                                    <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Supervisor</th>
                                    <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Monitoramento</th>
                                    <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Ações</th>
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
                                                <div className="flex flex-col gap-1">
                                                    <Badge variant="outline" className="w-fit font-mono text-xs px-2 py-0.5 bg-slate-50 border-slate-200 text-slate-600 font-black">
                                                        Z{agent.zLogin}
                                                    </Badge>
                                                    {agent.role === 'supervisor' && (
                                                        <Badge className="w-fit bg-purple-500 text-[9px] h-4 px-1 uppercase font-black border-none">
                                                            Super
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                {agent.role === 'supervisor' ? (
                                                    <span className="text-xs font-bold text-slate-300 italic">Próprio</span>
                                                ) : (
                                                    <Badge variant="secondary" className={cn(
                                                        "font-black text-[10px] px-2 py-0.5 border-none",
                                                        agent.supervisor ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                                                    )}>
                                                        {agent.supervisor || "NÃO DEFINIDO"}
                                                    </Badge>
                                                )}
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
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col items-start">
                                                    <span className="text-sm font-black text-slate-700">
                                                        {agent.lastSeen ? new Date(agent.lastSeen).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '---'}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Último Sinal</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                {agent.role !== 'supervisor' ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg group-hover:visible"
                                                        onClick={() => setPromoteTarget(agent)}
                                                        title="Promover a Supervisor"
                                                    >
                                                        <ShieldIcon className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg group-hover:visible"
                                                        onClick={() => setDemoteTarget(agent)}
                                                        title="Remover Permissão de Supervisor"
                                                    >
                                                        <ShieldAlert className="h-4 w-4" />
                                                    </Button>
                                                )}
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

            {/* Modal de Promoção */}
            <Dialog open={!!promoteTarget} onOpenChange={(open) => !open && setPromoteTarget(null)}>
                <DialogContent className="sm:max-w-md border-t-4 border-t-purple-600" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-black text-slate-800">
                            <ShieldAlert className="h-6 w-6 text-purple-600" /> Confirmar Promoção
                        </DialogTitle>
                        <DialogDescription className="py-4 text-slate-600 space-y-4">
                            <p className="font-bold">
                                Você está prestes a promover <span className="text-slate-900 underline">{promoteTarget?.nome}</span> (Z{promoteTarget?.zLogin}) ao cargo de <span className="text-purple-600">Supervisor</span>.
                            </p>
                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-xs leading-relaxed text-amber-800">
                                <strong>Aviso:</strong> Esta ação concederá acesso total ao painel administrativo, controle de produtos e monitoramento de equipe para este usuário.
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex sm:justify-between gap-3">
                        <Button variant="secondary" onClick={() => setPromoteTarget(null)} disabled={isUpdatingRole}>
                            Cancelar
                        </Button>
                        <Button onClick={handlePromoteAgent} className="bg-purple-600 hover:bg-purple-700 text-white font-bold" disabled={isUpdatingRole}>
                            {isUpdatingRole && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirmar Promoção
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de Confirmação de Rebaixamento */}
            <Dialog open={!!demoteTarget} onOpenChange={(open) => !open && setDemoteTarget(null)}>
                <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <ShieldAlert className="h-5 w-5" /> Remover Permissão
                        </DialogTitle>
                        <DialogDescription>
                            Você tem certeza que deseja remover as permissões de supervisor de <strong>{demoteTarget?.nome}</strong>?
                            Ele voltará a ter acesso limitado como agente.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDemoteTarget(null)} disabled={isUpdatingRole}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDemoteAgent} disabled={isUpdatingRole}>
                            {isUpdatingRole && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirmar Rebaixamento
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
