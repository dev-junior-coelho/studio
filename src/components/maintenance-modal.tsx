"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, Zap } from "lucide-react";
import { MAINTENANCE_CONFIG } from "@/lib/maintenance";

export function MaintenanceModal() {
  const isOpen = MAINTENANCE_CONFIG.enabled;

  // Previne fechar o modal se a manutenção estiver ativa
  const handleOpenChange = (open: boolean) => {
    if (!open && MAINTENANCE_CONFIG.enabled) {
      // Impede que o usuário feche o modal durante a manutenção
      return;
    }
  };

  useEffect(() => {
    // Se estamos em manutenção, redireciona para a página de login
    // para impedir que usuários já logados continuem usando o app
    if (MAINTENANCE_CONFIG.enabled && typeof window !== "undefined") {
      // Remove qualquer cache local de autenticação
      localStorage.clear();
      sessionStorage.clear();
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-md border-2 border-yellow-400 bg-gradient-to-b from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950"
        onPointerDownOutside={(e) => {
          if (MAINTENANCE_CONFIG.enabled) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (MAINTENANCE_CONFIG.enabled) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-yellow-100 p-4 dark:bg-yellow-900">
            <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <DialogTitle className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
            {MAINTENANCE_CONFIG.message}
          </DialogTitle>
          <DialogDescription className="pt-4 text-base text-yellow-800 dark:text-yellow-200">
            {MAINTENANCE_CONFIG.subtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4 rounded-lg bg-white/50 p-4 dark:bg-black/20">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
            <p>Não feche esta janela</p>
          </div>
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p>Sistema em atualização</p>
            <p className="mt-1">Voltaremos em breve com melhorias</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
