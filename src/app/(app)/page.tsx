'use client';

import { useState, useMemo, Fragment } from 'react';
import { useOffer } from '@/contexts/offer-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingDown,
  TrendingUp,
  X,
  Loader2,
  Wallet,
  ShoppingCart,
  Calculator,
  ArrowRight,
  Check,
  Zap,
  CreditCard,
  Tv,
  Wifi,
  Phone,
  Smartphone,
  Plus,
  LayoutGrid
} from 'lucide-react';
import { BuilderView } from "@/components/app/builder-view";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/auth-context';
import { useFirebase } from '@/firebase/provider';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { DependentesDescontoInfo } from '@/components/dependentes-desconto-info';
import { useToast } from '@/hooks/use-toast';
import type { ProductType, Produto } from '@/lib/types';
import { NovaOfertaCard } from '@/components/nova-oferta-card';
import { cn } from '@/lib/utils';

type Gastos = {
  tv: number;
  internet: number;
  fixo: number;
  movel: number;
  outros: number;
  wifiMesh: number;
};

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ComparadorOfertaPage() {
  const { products, clearOffer, removeProduct, gastos, setGastos, totalMensal, addProduct } = useOffer();
  const { user } = useAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [debitoEmConta, setDebitoEmConta] = useState(false);
  const [calculadoraValor, setCalculadoraValor] = useState('');
  const [calculadoraTipo, setCalculadoraTipo] = useState<'TV' | 'Internet' | 'Fixo' | 'Mesh' | 'AlaCarte' | null>(null);

  // === Modal and Contract State ===
  const [showContractModal, setShowContractModal] = useState(false);
  const [showActivationInfo, setShowActivationInfo] = useState(false);
  const [contractNumber, setContractNumber] = useState('');
  const [contractError, setContractError] = useState('');

  // Format contract number as 000/123456789
  const handleContractChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

    if (value.length > 12) value = value.slice(0, 12); // Max length

    if (value.length > 3) {
      value = value.slice(0, 3) + '/' + value.slice(3);
    }

    setContractNumber(value);
    setContractError('');
  };

  const validateContract = () => {
    // Regex for 000/123456789 (3 digits, slash, 9 digits)
    const regex = /^\d{3}\/\d{9}$/;
    if (!regex.test(contractNumber)) {
      setContractError('Formato inválido. Use: 000/123456789');
      return false;
    }
    return true;
  };

  const handleRecuseOffer = async () => {
    await saveOfferToFirebase('Recusou', null);
  };

  const handleAcceptOffer = () => {
    setShowContractModal(true);
  };

  const confirmAcceptOffer = async () => {
    if (!validateContract()) return;
    const success = await saveOfferToFirebase('Aceitou', contractNumber);
    if (success) {
      setShowContractModal(false);
      setShowActivationInfo(true);
    }
  };

  const saveOfferToFirebase = async (status: 'Aceitou' | 'Recusou', contrato: string | null) => {
    if (!user || !firestore) return;

    // SIMULAÇÃO PARA AGENTE DE TESTE (Z000001)
    const currentZLogin = user.email?.split('@')[0].replace('z', '') || '';
    if (currentZLogin === '000001') {
      setIsSaving(true);
      // Simula um delay de rede
      await new Promise(resolve => setTimeout(resolve, 800));

      clearOffer();
      toast({
        title: "Modo Simulação",
        description: "Venda simulada com sucesso! Nada foi salvo no banco.",
        className: "bg-blue-50 border-blue-200 text-blue-800",
      });
      setIsSaving(false);
      return true;
    }

    setIsSaving(true);
    try {
      const offerData = {
        usuarioId: user.uid,
        email: user.email,
        nome: user.nome || '',
        supervisor: user.supervisor || 'N/A',
        zLogin: currentZLogin || 'Desconhecido',
        produtoIds: products.map(p => p.id),
        produtos: products,
        status,
        contrato: contrato || 'N/A', // Save contract number
        timestamp: serverTimestamp(),
        totalOferta: totalComDesconto,
        economia: economiaMensal,
        debitoEmConta,
        descontoDCC,
      };
      const collectionPath = `usuarios/${user.uid}/ofertas_salvas`;
      await addDoc(collection(firestore, collectionPath), offerData);

      clearOffer();
      toast({
        title: status === 'Aceitou' ? "Venda Registrada!" : "Oferta Recusada Salva",
        description: status === 'Aceitou' ? `Contrato ${contrato} salvo com sucesso.` : "Registro salvo no histórico.",
        variant: 'default',
        ...(status !== 'Aceitou' && { className: 'bg-blue-50 border-blue-200 text-blue-800' })
      });
      setContractNumber('');
      return true;
    } catch (error) {
      console.error("Erro ao salvar oferta:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a oferta. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleGastoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGastos((prev) => ({ ...prev, [name]: Number(value) || 0 }));
  };

  const handleSelecionarTipo = (tipo: 'TV' | 'Internet' | 'Fixo' | 'Mesh' | 'AlaCarte') => {
    setCalculadoraTipo(tipo);

    // Mapa de tipo para chave de gastos
    const tipoMap: Record<string, keyof Gastos> = {
      'TV': 'tv',
      'Internet': 'internet',
      'Fixo': 'fixo',
      'Mesh': 'wifiMesh',
      'AlaCarte': 'outros'
    };

    // Auto-preencher com o valor atual de gastos
    const chave = tipoMap[tipo];
    const valorAtual = gastos[chave];
    setCalculadoraValor(valorAtual > 0 ? valorAtual.toString() : '');
  };

  const handleAdicionarCalculadora = () => {
    const valor = Number(calculadoraValor);
    if (valor > 0 && calculadoraTipo) {
      // Mapa de tipo para nome legível
      const tipoMap: Record<string, string> = {
        'TV': 'TV',
        'Internet': 'Internet',
        'Fixo': 'Fixo',
        'Mesh': 'WiFi Mesh',
        'AlaCarte': 'A la carte'
      };

      // ✅ Criar produto customizado com tipos corretos
      const produtoCustomizado: Produto = {
        id: `custom-${Date.now()}`,
        nome: `${tipoMap[calculadoraTipo]} (Mantém como está)`,
        tipo: 'Opcional',
        precoMensal: valor,
        precoAnual: null,
        beneficios: ['Valor mantido conforme informado pelo cliente'],
        fidelidade: 'Sem fidelidade',
        observacoes: `Produto customizado - ${tipoMap[calculadoraTipo]} adicionado via calculadora`,
        regiaoId: 'nacional'
      };
      addProduct(produtoCustomizado);
      setCalculadoraValor('');
      setCalculadoraTipo(null);
    }
  };

  // Calcular desconto de débito em conta
  const descontoDCC = useMemo(() => {
    if (!debitoEmConta) return 0;

    let desconto = 0;
    products.forEach(product => {
      // Móvel Pós-Pago: R$ 10,00 de desconto
      if (product.tipo === 'Movel' && product.nome.includes('Pós')) {
        desconto += 10;
      }
      // Móvel Controle: R$ 5,00 de desconto
      else if (product.tipo === 'Movel' && product.nome.includes('Controle')) {
        desconto += 5;
      }
      // Banda Larga: R$ 5,00 de desconto
      else if (product.tipo === 'Banda Larga') {
        desconto += 5;
      }
      // TV: R$ 5,00 de desconto
      else if (product.tipo === 'TV Cabeada' || product.tipo === 'TV Box' || product.tipo === 'Claro TV APP') {
        desconto += 5;
      }
    });

    return desconto;
  }, [debitoEmConta, products]);

  const totalComDesconto = useMemo(() => totalMensal - descontoDCC, [totalMensal, descontoDCC]);

  const totalGastoAtual = useMemo(() => Object.values(gastos).reduce((acc, val) => acc + val, 0), [gastos]);
  const economiaMensal = useMemo(() => totalGastoAtual - totalComDesconto, [totalGastoAtual, totalComDesconto]);

  const beneficiosAgrupados = useMemo(() => {
    return products.reduce((acc, product) => {
      const { tipo, beneficios } = product;
      if (!acc[tipo]) {
        acc[tipo] = [];
      }
      acc[tipo].push(...beneficios);
      return acc;
    }, {} as Record<ProductType, string[]>);
  }, [products]);

  const allFidelidade = useMemo(() => [...new Set(products.map(p => p.fidelidade).filter(f => f && f !== 'Sem fidelidade'))], [products]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };



  const getIconForType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'tv': return <Tv className="h-4 w-4" />;
      case 'internet': return <Wifi className="h-4 w-4" />;
      case 'fixo': return <Phone className="h-4 w-4" />;
      case 'movel': return <Smartphone className="h-4 w-4" />;
      case 'wifimesh':
      case 'mesh': return <Zap className="h-4 w-4" />;
      default: return <Plus className="h-4 w-4" />;
    }
  }

  return (
    <div className="min-h-screen bg-transparent pb-4">
      <main className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 space-y-6 pt-6" style={{ maxWidth: '1920px', width: '100%' }}>
        {/* Header da Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              {user && 'nome' in user ? `Olá, ${(user as any).nome.split(' ')[0]}` : 'Olá, Agente'}
              <span className="text-xl">👋</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Vamos superar as metas hoje?
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              <Check className="mr-1 h-3 w-3" />
              Sistema Ativo
            </Badge>
          </div>
        </div>

        {/* Layout Principal Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

          {/* Coluna Esquerda: Principal (Gastos + Builder + Argumento) */}
          <div className="col-span-12 xl:col-span-9 space-y-6">

            {/* Desktop Top Row: Gastos + Carrinho (Side by Side) */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* 1. Gastos Atuais */}
              <Card className="shadow-sm border-slate-200 h-full flex flex-col lg:col-span-3">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Wallet className="h-5 w-5 text-gray-500" />
                    <CardTitle className="text-xl">Gastos Atuais</CardTitle>
                  </div>
                  <CardDescription>Quanto o cliente paga hoje no plano atual.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 flex-1">
                  <div className="flex flex-col gap-4">
                    {Object.keys(gastos).map((key) => {
                      const labelMap: Record<string, string> = {
                        'tv': 'TV',
                        'internet': 'Internet',
                        'fixo': 'Fixo',
                        'movel': 'Móvel',
                        'outros': 'A la carte',
                        'wifiMesh': 'WiFi Mesh'
                      };
                      const label = labelMap[key] || key;
                      const icon = getIconForType(key);

                      return (
                        <div key={key} className="space-y-1.5 group">
                          <Label htmlFor={key} className="text-muted-foreground text-xs uppercase font-semibold flex items-center gap-1.5">
                            {icon} {label}
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                            <Input
                              type="number"
                              id={key}
                              name={key}
                              value={gastos[key as keyof Gastos] === 0 ? '' : gastos[key as keyof Gastos]}
                              onChange={handleGastoChange}
                              placeholder="0,00"
                              className="pl-8 text-right font-medium transition-all focus:border-primary"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>

                {/* Seção Calculadora Integration */}
                <div className="border-t bg-gray-50/50 p-5 space-y-4 rounded-b-lg">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <Calculator className="h-4 w-4" />
                    <span className="text-sm">Manter valor atual na oferta</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {['TV', 'Internet', 'Fixo', 'Mesh', 'AlaCarte'].map((tipo) => (
                        <button
                          key={tipo}
                          onClick={() => handleSelecionarTipo(tipo as any)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1",
                            calculadoraTipo === tipo
                              ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-primary/50'
                          )}
                        >
                          {getIconForType(tipo)}
                          {tipo === 'Mesh' ? 'WiFi Mesh' : (tipo === 'AlaCarte' ? 'A la carte' : tipo)}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2 items-end">
                      <div className="flex-1 space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Valor a manter (R$)</Label>
                        <Input
                          type="number"
                          value={calculadoraValor}
                          onChange={(e) => setCalculadoraValor(e.target.value)}
                          placeholder="0,00"
                          className="h-9"
                        />
                      </div>
                      <Button
                        onClick={handleAdicionarCalculadora}
                        className="h-9 px-4 shrink-0 bg-primary hover:bg-primary/90"
                        disabled={!calculadoraValor || Number(calculadoraValor) <= 0 || !calculadoraTipo}
                        size="sm"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" /> Adicionar
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      *Isso adiciona um item personalizado na lista de produtos.
                    </p>
                  </div>
                </div>
              </Card>

              {/* 2. Desktop Cart (Placed here to sit next to Expenses) */}
              <div className="hidden lg:flex flex-col h-full lg:col-span-2">
                <NovaOfertaCard
                  products={products}
                  debitoEmConta={debitoEmConta}
                  setDebitoEmConta={setDebitoEmConta}
                  descontoDCC={descontoDCC}
                  totalMensal={totalMensal}
                  totalComDesconto={totalComDesconto}
                  removeProduct={removeProduct}
                  handleRecuseOffer={handleRecuseOffer}
                  handleAcceptOffer={handleAcceptOffer}
                  isSaving={isSaving}
                  formatCurrency={formatCurrency}
                  getIconForType={getIconForType}
                />
              </div>
            </div>

            {/* 3. Builder View (Desktop Only) */}
            <div className="hidden lg:block space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <LayoutGrid className="h-5 w-5 text-primary" />
                  Catálogo de Produtos
                </h2>
              </div>
              <BuilderView hideHeader className="bg-transparent" />
            </div>

          </div>

          {/* Coluna Direita: Sidebar (Mobile: Cart + Argumento / Desktop: Argumento) */}
          <div className="space-y-6 col-span-12 xl:col-span-3 xl:sticky xl:top-[6.5rem] max-h-[calc(100vh-7rem)] overflow-y-auto pb-4 pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 transition-colors">

            {/* Mobile Cart (Hidden on Desktop) */}
            <div className="lg:hidden">
              <NovaOfertaCard
                products={products}
                debitoEmConta={debitoEmConta}
                setDebitoEmConta={setDebitoEmConta}
                descontoDCC={descontoDCC}
                totalMensal={totalMensal}
                totalComDesconto={totalComDesconto}
                removeProduct={removeProduct}
                handleRecuseOffer={handleRecuseOffer}
                handleAcceptOffer={handleAcceptOffer}
                isSaving={isSaving}
                formatCurrency={formatCurrency}
                getIconForType={getIconForType}
              />
            </div>

            {/* CARD: Argumento de Venda (Full Benefits) */}
            {products.length > 0 && (
              <Card className={cn(
                "shadow-sm shrink-0 border transition-all",
                economiaMensal >= 0 ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"
              )}>
                <CardHeader className="pb-4 pt-6">
                  <CardTitle className="text-xl font-bold uppercase tracking-wider flex items-center gap-3 text-muted-foreground">
                    <Check className="h-6 w-6" /> Argumento Final
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  {/* Economy Highlight */}
                  <div className="mb-6">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="font-semibold text-base text-muted-foreground">
                        {economiaMensal >= 0 ? "Economia Mensal" : "Diferença Mensal"}
                      </span>
                      <span className={cn(
                        "font-black text-4xl",
                        economiaMensal >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {formatCurrency(Math.abs(economiaMensal))}
                      </span>
                    </div>
                    {economiaMensal >= 0 && (
                      <div className="text-base bg-white/60 rounded-md px-4 py-3 text-green-700 border border-green-100 flex justify-between items-center shadow-sm">
                        <span className="font-medium">Economia Anual</span>
                        <strong className="text-xl">{formatCurrency(economiaMensal * 12)}</strong>
                      </div>
                    )}
                  </div>

                  <Separator className="my-6 bg-black/5" />

                  {/* Benefits List (Detailed) */}
                  <div className="space-y-6">
                    {Object.entries(beneficiosAgrupados).map(([tipo, beneficios]) => {
                      const beneficiosUnicos = [...new Set(beneficios)];
                      if (beneficiosUnicos.length === 0) return null;
                      return (
                        <div key={tipo}>
                          <h5 className="font-bold text-sm text-gray-500 uppercase mb-3 bg-white/50 p-2 rounded w-fit">
                            {tipo}
                          </h5>
                          <ul className="space-y-3">
                            {/* SHOW ALL BENEFITS - NO SLICE */}
                            {beneficiosUnicos.map((b, i) => (
                              <li key={i} className="flex items-start gap-3 text-base text-gray-800 leading-relaxed">
                                <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Modal de Contrato */}
        <Dialog open={showContractModal} onOpenChange={setShowContractModal}>
          <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Finalizar Venda</DialogTitle>
              <DialogDescription>
                Insira o número de contrato gerado para o cliente para concluir o registro.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2 py-4">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="contrato" className="sr-only">
                  Número do Contrato
                </Label>
                <Input
                  id="contrato"
                  placeholder="000/123456789"
                  value={contractNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleContractChange(e)}
                  maxLength={13}
                  className={cn("text-center text-lg tracking-widest", contractError && "border-red-500 focus-visible:ring-red-500")}
                />
                {contractError && <p className="text-xs text-red-500 text-center">{contractError}</p>}
              </div>
            </div>
            <DialogFooter className="sm:justify-between">
              <Button variant="secondary" onClick={() => setShowContractModal(false)}>
                Cancelar
              </Button>
              <Button type="submit" onClick={confirmAcceptOffer} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar Venda
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Instruções de Ativação */}
        <Dialog open={showActivationInfo} onOpenChange={setShowActivationInfo}>
          <DialogContent className="sm:max-w-lg border-2 border-emerald-500" onOpenAutoFocus={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-emerald-600 text-xl font-black">
                <Check className="h-6 w-6" /> VENDA FINALIZADA COM SUCESSO!
              </DialogTitle>
              <DialogDescription className="text-slate-900 font-bold text-base bg-slate-50 p-4 rounded-lg border border-slate-200 mt-4 leading-relaxed">
                Repasse as seguintes orientações ao cliente:
                <br /><br />
                "Senhor, assim que o seu novo chip chegar, é necessário entrar em contato com o número <span className="text-emerald-700">0800 723 6626</span> para realizar a ativação. Este número agora também será sua nova central de atendimento, mais exclusiva e rápida para o seu perfil, que agora é <span className="text-emerald-700 font-black">Claro Multi</span>.
                <br /><br />
                Após ativar o chip, recomendamos que teste a internet do celular para garantir que esteja tudo ok. Esse teste pode ser feito em sites como o YouTube, por exemplo; de 1 a 2 minutos de navegação já são suficientes para garantir o pleno funcionamento dos dados móveis com qualidade."
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg font-bold" onClick={() => setShowActivationInfo(false)}>
                Entendido, Finalizar Atendimento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}