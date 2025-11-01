"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
            <Zap className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">SAA Claro Mobile</CardTitle>
          <CardDescription>Selecione seu perfil para continuar</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button onClick={() => login('agente')} className="w-full" size="lg">
            Entrar como Agente
          </Button>
          <Button onClick={() => login('supervisor')} variant="secondary" className="w-full" size="lg">
            Entrar como Supervisor
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
