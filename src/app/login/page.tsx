"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Loader2, Lock, User, AlertCircle, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function LoginPage() {
  const { loginWithZ, login, loading } = useAuth(); // login is legacy/test
  const [zNumber, setZNumber] = useState("");
  const [pin, setPin] = useState("");
  const [nome, setNome] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [userRole, setUserRole] = useState<'agente' | 'supervisor'>('agente');

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
    if (mode === 'register' && userRole === 'agente') {
      if (nome.trim().length < 3) {
        setError("Informe seu nome completo (mínimo 3 caracteres).");
        return;
      }
      // Supervisor não é mais obrigatório
    }

    try {
      await loginWithZ(zNumber, pin, mode, userRole, nome.trim(), supervisor);
    } catch (err: any) {
      if (mode === 'register' && (err.code === 'auth/email-already-in-use' || err.code === 'auth/credential-already-in-use')) {
        setError("Este login Z já possui cadastro. Tente fazer login.");
      } else if (mode === 'login' && (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential')) {
        setError("Usuário não encontrado. Crie sua conta.");
      } else if (mode === 'login' && err.code === 'auth/wrong-password') {
        setError("Senha incorreta.");
      } else {
        console.error("Login failed with error:", err);
        setError(`Erro: ${err.code || "Desconhecido"} - ${err.message}`);
      }
    }
  };

  const toggleRole = () => {
    const newRole = userRole === 'agente' ? 'supervisor' : 'agente';
    setUserRole(newRole);
    // If switching to supervisor, force login mode. If switching back to agent, defaults to login too.
    setMode('login');
    setError(null);
    setZNumber("");
    setPin("");
    setNome("");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Card className={cn(
        "w-full max-w-sm shadow-xl border-t-4 transition-colors duration-500",
        userRole === 'supervisor' ? "border-t-purple-600" : "border-t-primary"
      )}>
        <CardHeader className="text-center pb-2">
          <div className={cn(
            "mx-auto rounded-full p-4 w-fit mb-4 animate-in zoom-in duration-500 transition-colors",
            userRole === 'supervisor' ? "bg-purple-100 text-purple-600" : "bg-primary/10 text-primary"
          )}>
            {userRole === 'supervisor' ? <ShieldCheck className="h-8 w-8" /> : <Zap className="h-8 w-8" />}
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {userRole === 'supervisor' ? "Studio Claro - Supervisor" : "Studio Claro"}
          </CardTitle>
          <CardDescription>
            {userRole === 'supervisor' ? "Bem vindo Super, acesse sua conta" : "Acesse sua conta para continuar"}
          </CardDescription>
        </CardHeader>

        <Tabs
          value={mode} // Controlado pelo estado + lógica
          onValueChange={(v) => {
            // Se for supervisor, não permite mudar para register
            if (userRole === 'supervisor' && v === 'register') return;
            setMode(v as any);
            setError(null);
          }}
          className="w-full"
        >
          <div className="px-6">
            {userRole === 'agente' ? (
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Criar Conta</TabsTrigger>
              </TabsList>
            ) : (
              <div className="mb-4 text-center pb-2 border-b">
                <p className="text-sm font-medium text-purple-700">Acesso Administrativo</p>
              </div>
            )}
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

              {mode === 'register' && userRole === 'agente' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-sm font-medium">Seu Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="nome"
                        type="text"
                        placeholder="Inclua seu nome com sobrenome"
                        className="pl-10 h-12"
                        value={nome}
                        onChange={(e) => { setNome(e.target.value); setError(null); }}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Seu Supervisor Responsável (Opcional)</Label>
                    <Select value={supervisor} onValueChange={(v) => { setSupervisor(v); setError(null); }}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Selecione seu supervisor (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GILVAN">GILVAN</SelectItem>
                        <SelectItem value="HELIO">HELIO</SelectItem>
                        <SelectItem value="MARIANA PAIXÃO">MARIANA PAIXÃO</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-muted-foreground ml-1">
                      Pode ser definido posteriormente pelo administrador.
                    </p>
                  </div>
                </>
              )}

              <Button
                type="submit"
                className={cn(
                  "w-full text-base font-semibold h-11 mt-2 transition-colors",
                  userRole === 'supervisor' ? "bg-purple-600 hover:bg-purple-700" : ""
                )}
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'login'
                  ? (userRole === 'supervisor' ? 'Acessar como Super' : 'Acessar Sistema')
                  : 'Cadastrar e Entrar'
                }
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t py-4 bg-gray-50/50">
            <p className="text-xs text-muted-foreground text-center">
              {userRole === 'supervisor' ? (
                <span className="text-purple-600/70">Cadastro de supervisor apenas por convite.</span>
              ) : (
                mode === 'login'
                  ? "Primeira vez aqui? Selecione 'Criar Conta' acima."
                  : "Já possui cadastro? Volte para a aba 'Entrar'."
              )}
            </p>
          </CardFooter>
        </Tabs>
      </Card>

      <div className="mt-8 text-center text-xs text-gray-400">
        <p>Studio Claro &copy; 2025</p>
        <p>Ambiente Seguro • Acesso Restrito</p>
      </div>

      <div className="mt-6 w-full max-w-sm">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-xs font-medium uppercase tracking-wider py-6 border-2 transition-all hover:bg-transparent",
            userRole === 'agente'
              ? "text-purple-600 border-purple-100 hover:border-purple-300 bg-purple-50/50"
              : "text-primary border-blue-100 hover:border-blue-300 bg-blue-50/50"
          )}
          onClick={toggleRole}
        >
          {userRole === 'agente' ? "Login Supervisor" : "Voltar para Login Agente"}
        </Button>
      </div>
    </main>
  );
}
