"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HistoryList } from "@/components/history-list";
import { ShieldCheck, User as UserIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
    const { user, logout } = useAuth();

    if (!user) return null;

    const zLogin = user.email ? user.email.split('@')[0].replace('z', '') : '???';
    const isSupervisor = user.role === 'supervisor';

    return (
        <div className="container max-w-3xl mx-auto p-4 space-y-6 pb-24">
            <Card className="border-none shadow-md bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <UserIcon className="w-32 h-32" />
                </div>
                <CardContent className="pt-6 relative z-10">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <Avatar className="h-24 w-24 border-4 border-white/20 shadow-xl">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${zLogin}`} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                {zLogin.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="text-center sm:text-left space-y-2 flex-1">
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                                <h1 className="text-3xl font-bold tracking-tight">Z{zLogin}</h1>
                                {isSupervisor && (
                                    <Badge className="bg-purple-500 hover:bg-purple-600 border-none text-white px-3 py-1 text-xs uppercase tracking-wider font-semibold flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" />
                                        Supervisor
                                    </Badge>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-gray-300">
                                    {isSupervisor ? "Gestão e Acompanhamento" : "Consultor de Vendas"}
                                </p>
                                {user.supervisor && !isSupervisor && (
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                                        <ShieldCheck className="w-3 h-3" />
                                        Sup: {user.supervisor}
                                    </div>
                                )}
                            </div>

                            <Button
                                variant="destructive"
                                size="sm"
                                className="mt-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 border border-red-500/30"
                                onClick={logout}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sair da Conta
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="history" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="history">Histórico de Ofertas</TabsTrigger>
                    <TabsTrigger value="settings">Configurações</TabsTrigger>
                </TabsList>

                <TabsContent value="history" className="mt-6 space-y-4">
                    <HistoryList />
                </TabsContent>

                <TabsContent value="settings">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Configurações do Perfil</CardTitle>
                            <CardDescription>Gerencie suas informações básicas.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {!isSupervisor && (
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700">Alterar Supervisor Responsável</label>
                                    <SupervisorSelector />
                                </div>
                            )}
                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-xs text-slate-400 font-medium italic">Mais configurações estarão disponíveis em breve.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useFirebase } from "@/firebase/provider";
import { doc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";

function SupervisorSelector() {
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async (value: string) => {
        if (!firestore || !user) return;
        setIsUpdating(true);
        try {
            await updateDoc(doc(firestore, "usuarios", user.uid), {
                supervisor: value
            });
            toast({
                title: "Supervisor Alterado",
                description: `Sua conta agora está vinculada ao supervisor ${value}.`,
            });
        } catch (error) {
            toast({
                title: "Erro ao atualizar",
                description: "Tente novamente mais tarde.",
                variant: "destructive"
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="relative">
            <Select defaultValue={user?.supervisor} onValueChange={handleUpdate} disabled={isUpdating}>
                <SelectTrigger className="h-12 bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Selecione um supervisor" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="GILVAN">GILVAN</SelectItem>
                    <SelectItem value="HELIO">HELIO</SelectItem>
                    <SelectItem value="MARIANA PAIXÃO">MARIANA PAIXÃO</SelectItem>
                </SelectContent>
            </Select>
            {isUpdating && (
                <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
            )}
        </div>
    );
}
