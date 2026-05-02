"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HistoryList } from "@/components/history-list";
import { ShieldCheck, User as UserIcon, LogOut, Key, Loader2, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useFirebase } from "@/firebase/provider";
import { doc, updateDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";

export default function ProfilePage() {
    const { user, logout } = useAuth();

    if (!user) return null;

    const zLogin = user.email ? user.email.split('@')[0].replace('z', '') : '???';
    const isSupervisor = user.role === 'supervisor';

    return (
        <PageShell
            title="Perfil"
            description="Conta, histórico e configurações."
            className="max-w-4xl"
            contentClassName="space-y-6"
        >
            <Card className="border border-slate-800 hover:border-slate-700 shadow-sm bg-gradient-to-br from-slate-900 to-black text-white overflow-hidden rounded-3xl relative animate-in fade-in duration-500 select-none">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <UserIcon className="w-32 h-32" />
                </div>
                <CardContent className="p-6 relative z-10">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <Avatar className="h-24 w-24 border-4 border-white/10 bg-slate-800 shadow-xl rounded-2xl select-none">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${zLogin}`} />
                            <AvatarFallback className="bg-slate-800 text-slate-100 text-2xl font-black">
                                {zLogin.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="text-center sm:text-left space-y-2 flex-1">
                            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2">
                                <h1 className="text-3xl font-black tracking-tight font-mono select-all">Z{zLogin}</h1>
                                {isSupervisor && (
                                    <Badge className="bg-red-500 hover:bg-red-600 border-none text-white px-2.5 py-1 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 rounded-xl">
                                        <ShieldCheck className="w-3 h-3" />
                                        Supervisor
                                    </Badge>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-slate-400 text-xs font-bold tracking-wide uppercase">
                                    {isSupervisor ? "Gestão e Acompanhamento" : "Consultor de Vendas"}
                                </p>
                                {user.supervisor && !isSupervisor && (
                                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[10px] font-black text-red-400 uppercase tracking-wider mt-0.5">
                                        <ShieldCheck className="w-3 h-3" />
                                        Sup: {user.supervisor}
                                    </div>
                                )}
                            </div>

                            <Button
                                variant="destructive"
                                size="sm"
                                className="mt-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 border border-red-500/30 rounded-xl text-xs font-bold px-4"
                                onClick={logout}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sair da Conta
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="history" className="w-full animate-in fade-in duration-500">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px] bg-slate-50/50 p-1 border border-slate-200 rounded-2xl h-11">
                    <TabsTrigger value="history" className="text-xs font-black uppercase tracking-wide rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">Histórico de Ofertas</TabsTrigger>
                    <TabsTrigger value="settings" className="text-xs font-black uppercase tracking-wide rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">Configurações</TabsTrigger>
                </TabsList>

                <TabsContent value="history" className="mt-6 space-y-4">
                    <HistoryList />
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {!isSupervisor && (
                            <Card className="border border-slate-200 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden">
                                <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-transparent border-b border-slate-50/50">
                                    <CardTitle className="text-base font-black text-slate-800 tracking-tight leading-tight select-none">Supervisor Responsável</CardTitle>
                                    <CardDescription className="text-xs font-semibold select-none">Altere seu supervisor vinculado.</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <SupervisorSelector />
                                </CardContent>
                            </Card>
                        )}

                        <ChangePasswordSection />
                    </div>
                </TabsContent>
            </Tabs>
        </PageShell>
    );
}

function ChangePasswordSection() {
    const { user } = useAuth();
    const { auth } = useFirebase();
    const { toast } = useToast();

    const [currentPin, setCurrentPin] = useState("");
    const [newPin, setNewPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrentPin, setShowCurrentPin] = useState(false);
    const [showNewPin, setShowNewPin] = useState(false);

    const handlePinInput = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
        setter(value);
    };

    const isValid = currentPin.length === 4 && newPin.length === 4 && confirmPin.length === 4 && newPin === confirmPin;

    const handleChangePassword = async () => {
        if (!auth || !user?.email) return;

        if (newPin !== confirmPin) {
            toast({ title: "Erro", description: "Os novos PINs não coincidem.", variant: "destructive" });
            return;
        }

        if (newPin === currentPin) {
            toast({ title: "Erro", description: "O novo PIN deve ser diferente do atual.", variant: "destructive" });
            return;
        }

        setIsLoading(true);

        try {
            const currentPassword = `SCApp-${currentPin}`;
            try {
                await signInWithEmailAndPassword(auth, user.email, currentPassword);
            } catch {
                toast({ title: "PIN atual incorreto", description: "Verifique o PIN atual e tente novamente.", variant: "destructive" });
                setIsLoading(false);
                return;
            }

            const idToken = await auth.currentUser?.getIdToken();
            const response = await fetch('/api/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ newPin })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Falha ao alterar a senha");
            }

            toast({ title: "Senha alterada", description: "Seu novo PIN de 4 dígitos está ativo." });
            setCurrentPin("");
            setNewPin("");
            setConfirmPin("");
        } catch (error: any) {
            console.error("Change password error:", error);
            toast({
                title: "Erro ao alterar senha",
                description: error.message || "Tente novamente mais tarde.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border border-slate-200 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-transparent border-b border-slate-50/50">
                <div className="flex items-center gap-2 select-none">
                    <Key className="w-4 h-4 text-slate-800" />
                    <CardTitle className="text-base font-black text-slate-800 tracking-tight leading-tight">Alterar Senha</CardTitle>
                </div>
                <CardDescription className="text-xs font-semibold select-none">Troque seu PIN de 4 dígitos.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
                <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 select-none">PIN Atual</label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                            type={showCurrentPin ? "text" : "password"}
                            placeholder="••••"
                            className="pl-10 pr-10 font-mono tracking-[0.5em] text-center h-11 border-slate-200 rounded-xl bg-slate-50/40 focus:border-red-500 focus:ring-red-500/10 transition-all font-black text-sm"
                            value={currentPin}
                            onChange={handlePinInput(setCurrentPin)}
                            maxLength={4}
                            inputMode="numeric"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPin(!showCurrentPin)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showCurrentPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 select-none">Novo PIN</label>
                    <div className="relative">
                        <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                            type={showNewPin ? "text" : "password"}
                            placeholder="••••"
                            className="pl-10 pr-10 font-mono tracking-[0.5em] text-center h-11 border-slate-200 rounded-xl bg-slate-50/40 focus:border-red-500 focus:ring-red-500/10 transition-all font-black text-sm"
                            value={newPin}
                            onChange={handlePinInput(setNewPin)}
                            maxLength={4}
                            inputMode="numeric"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPin(!showNewPin)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showNewPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 select-none">Confirmar Novo PIN</label>
                    <div className="relative">
                        <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                            type="password"
                            placeholder="••••"
                            className={`pl-10 font-mono tracking-[0.5em] text-center h-11 border-slate-200 bg-slate-50/40 focus:border-red-500 focus:ring-red-500/10 transition-all font-black text-sm ${confirmPin.length === 4 && confirmPin !== newPin ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                            value={confirmPin}
                            onChange={handlePinInput(setConfirmPin)}
                            maxLength={4}
                            inputMode="numeric"
                        />
                    </div>
                    {confirmPin.length === 4 && confirmPin !== newPin && (
                        <p className="text-xs text-red-500 font-black uppercase tracking-wider mt-1 select-none">Os PINs não coincidem.</p>
                    )}
                </div>

                <Button
                    onClick={handleChangePassword}
                    disabled={!isValid || isLoading}
                    className="w-full h-11 font-black uppercase tracking-wide bg-slate-900 hover:bg-black text-white rounded-2xl shadow-md transition-all mt-2 select-none"
                >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Key className="mr-2 h-4 w-4" />}
                    Alterar Senha
                </Button>
            </CardContent>
        </Card>
    );
}

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
                <SelectTrigger className="h-11 bg-slate-50/40 border-slate-200 hover:border-slate-300 font-bold text-xs rounded-xl transition-all select-none">
                    <SelectValue placeholder="Selecione um supervisor" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 overflow-hidden shadow-xl">
                    <SelectItem value="GILVAN" className="text-xs font-bold">GILVAN</SelectItem>
                    <SelectItem value="HELIO" className="text-xs font-bold">HELIO</SelectItem>
                    <SelectItem value="MARIANA PAIXÃO" className="text-xs font-bold">MARIANA PAIXÃO</SelectItem>
                </SelectContent>
            </Select>
            {isUpdating && (
                <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                </div>
            )}
        </div>
    );
}
