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
    // Supervisor não é mais obrigatório - permite acesso direto
    return <>{children}</>;
}
