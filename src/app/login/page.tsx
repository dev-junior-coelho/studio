"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Loader2, Lock, User, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const { loginWithZ, loading } = useAuth();
  const [zNumber, setZNumber] = useState("");
  const [pin, setPin] = useState("");
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);

  const handleZChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Apenas números, máximo 6 dígitos
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setZNumber(value);
    setError(null);
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Apenas números, máximo 4 dígitos
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações básicas
    if (zNumber.length !== 6) {
      setError("O login deve ter 6 dígitos numéricos após o Z.");
      return;
    }
    if (pin.length !== 4) {
      setError("A senha deve ter exatamente 4 dígitos.");
      return;
    }

    try {
      await loginWithZ(zNumber, pin, mode);
    } catch (err: any) {
      if (mode === 'register' && err.code === 'auth/email-already-in-use') {
        setError("Este login Z já está cadastrado. Tente fazer login.");
      } else if (mode === 'login' && (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential')) {
        setError("Login ou senha incorretos.");
      } else if (mode === 'login' && err.code === 'auth/wrong-password') { // Firebase sometimes returns generic invalid-credential
        setError("Senha incorreta.");
      } else {
        console.error(err);
        setError("Ocorreu um erro. Tente novamente." + (err.message ? ` (${err.message})` : ""));
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-sm shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4 animate-in zoom-in duration-500">
            <Zap className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Studio Claro</CardTitle>
          <CardDescription>Acesse sua conta para continuar</CardDescription>
        </CardHeader>

        <Tabs defaultValue="login" onValueChange={(v) => { setMode(v as any); setError(null); }} className="w-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Criar Conta</TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="space-y-4 pt-2">
            {error && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs ml-2">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="z-login" className="text-sm font-medium">Seu Login Z</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded text-sm border border-gray-200">
                    Z
                  </div>
                  <Input
                    id="z-login"
                    placeholder="123456"
                    className="pl-12 font-mono tracking-widest text-lg h-12"
                    value={zNumber}
                    onChange={handleZChange}
                    type="tel" // Opens numeric keypad on mobile
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-[10px] text-muted-foreground ml-1">
                  Digite apenas os 6 números do seu login.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pin" className="text-sm font-medium">Senha Numérica</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="pin"
                    type={showPin ? "text" : "password"}
                    placeholder="••••"
                    className="pl-10 pr-10 font-mono tracking-[0.5em] text-lg h-12 text-center"
                    value={pin}
                    onChange={handlePinChange}
                    maxLength={4}
                    required
                    inputMode="numeric"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground ml-1">
                  Senha de 4 dígitos para acesso rápido.
                </p>
              </div>

              <Button type="submit" className="w-full text-base font-semibold h-11 mt-2" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'login' ? 'Acessar Sistema' : 'Cadastrar e Entrar'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t py-4 bg-gray-50/50">
            <p className="text-xs text-muted-foreground text-center">
              {mode === 'login'
                ? "Primeira vez aqui? Selecione 'Criar Conta' acima."
                : "Já possui cadastro? Volte para a aba 'Entrar'."}
            </p>
          </CardFooter>
        </Tabs>
      </Card>

      <div className="mt-8 text-center text-xs text-gray-400">
        <p>Studio Claro &copy; 2025</p>
        <p>Ambiente Seguro • Acesso Restrito</p>
      </div>
    </main>
  );
}
