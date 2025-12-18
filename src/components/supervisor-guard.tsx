"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useFirebase } from "@/firebase/provider";
import { doc, updateDoc } from "firebase/firestore";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SupervisorGuard({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [selectedSupervisor, setSelectedSupervisor] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    // Se não for agente ou já tiver supervisor, deixa passar
    if (!user || user.role !== "agente" || user.supervisor) {
        return <>{children}</>;
    }

    const handleUpdate = async () => {
        if (!selectedSupervisor || !firestore || !user) return;

        setIsUpdating(true);
        try {
            await updateDoc(doc(firestore, "usuarios", user.uid), {
                supervisor: selectedSupervisor,
            });
            toast({
                title: "Hierarquia Definida!",
                description: `Você agora está vinculado à equipe de ${selectedSupervisor}.`,
            });
        } catch (error) {
            console.error("Error updating supervisor:", error);
            toast({
                title: "Erro ao atualizar",
                description: "Tente novamente em instantes.",
                variant: "destructive",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="relative min-h-screen">
            <Dialog open={true}>
                <DialogContent
                    className="sm:max-w-md border-t-8 border-t-primary shadow-2xl p-0 overflow-hidden"
                    onPointerDownOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <div className="bg-gradient-to-b from-primary/5 to-transparent p-6 pt-8 text-center">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <ShieldCheck className="h-8 w-8 text-primary animate-pulse" />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tight text-slate-800">
                                Configuração de Hierarquia
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium">
                                Para liberar seu acesso ao Studio Claro, precisamos saber quem é seu supervisor imediato.
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="px-8 pb-8 space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Diretoria / Supervisão</label>
                            <Select value={selectedSupervisor} onValueChange={setSelectedSupervisor}>
                                <SelectTrigger className="h-14 text-lg border-2 focus:ring-primary/20 bg-slate-50/50">
                                    <SelectValue placeholder="Selecione um supervisor" />
                                </SelectTrigger>
                                <SelectContent className="border-2 shadow-xl">
                                    <SelectItem value="GILVAN" className="h-12 font-bold focus:bg-primary/10">GILVAN</SelectItem>
                                    <SelectItem value="HELIO" className="h-12 font-bold focus:bg-primary/10">HELIO</SelectItem>
                                    <SelectItem value="MARIANA PAIXÃO" className="h-12 font-bold focus:bg-primary/10">MARIANA PAIXÃO</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-[10px] text-slate-400 font-bold leading-tight italic">
                                * Se você não encontrar seu supervisor na lista, entre em contato com o suporte administrativo.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                className="w-full h-14 text-lg font-black shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95"
                                disabled={!selectedSupervisor || isUpdating}
                                onClick={handleUpdate}
                            >
                                {isUpdating ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                    "Vincular e Acessar App"
                                )}
                            </Button>

                            <Button
                                variant="ghost"
                                className="text-slate-400 hover:text-red-500 hover:bg-red-50 text-xs font-bold font-mono"
                                onClick={logout}
                            >
                                Sair e Entrar com outro Z-Login
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <div className="blur-xl grayscale opacity-30 select-none pointer-events-none fixed inset-0">
                {children}
            </div>
        </div>
    );
}
