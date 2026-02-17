'use client';

import { useState, useMemo, Fragment, useCallback } from 'react';
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
  Users,
  Search,
  Filter,
  MapPin,
  MoreVertical,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  FileText,
  ClipboardList,
  Wallet,
  TrendingDown,
  AlertTriangle,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Loader2,
  ArrowRight,
  Tv,
  Wifi,
  Phone,
  Smartphone,
  Zap,
  ShoppingBag,
  LayoutGrid,
  TrendingUp,
  CreditCard,
  RotateCcw,
  Archive,
  ArrowRightLeft,
  Calculator
} from 'lucide-react';
// import { BuilderView } from "@/components/app/builder-view"; // REMOVED
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/auth-context';
import { useFirebase } from '@/firebase/provider';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { DependentesDescontoInfo } from '@/components/dependentes-desconto-info';
import { useToast } from '@/hooks/use-toast';
import type { ProductType, Produto, Gastos } from '@/lib/types';
import { NovaOfertaCard } from '@/components/nova-oferta-card';
import { cn, normalizeText } from '@/lib/utils';
import Link from 'next/link'; // ADDED
import { produtosOpcionais } from '@/data/seedOpcionais'; // Import optional products data
import { generateAutoOffer } from '@/lib/auto-offer-generator'; // Import auto-offer generator
import { regioes } from '@/data/seedRegioes'; // Import regions data



import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check as CheckIcon, ChevronsUpDown } from "lucide-react"

export default function DashboardPage() {
  const { products, clearOffer, removeProduct, gastos, setGastos, totalMensal, addProduct, debitoEmConta, setDebitoEmConta, totalComDesconto, descontoDCC, selectedCity, setSelectedCity } = useOffer();
  const { user } = useAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cityOpen, setCityOpen] = useState(false); // State for city selector popover
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

  // Handle changes for standard numeric fields
  const handleGastoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Ensure we are only updating numeric fields, not 'outros' array
    if (name !== 'outros') {
      setGastos((prev) => ({ ...prev, [name]: Number(value) || 0 }));
    }
  };

  // Handle changes for dynamic AlaCarte fields
  const handleAlaCarteChange = (id: string, field: 'name' | 'value', value: string | number) => {
    setGastos((prev) => ({
      ...prev,
      outros: prev.outros.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addAlaCarteItem = () => {
    setGastos((prev) => ({
      ...prev,
      outros: [...prev.outros, { id: `ala-${Date.now()}`, name: '', value: 0 }]
    }));
  };

  const removeAlaCarteItem = (id: string) => {
    setGastos((prev) => ({
      ...prev,
      outros: prev.outros.filter(item => item.id !== id)
    }));
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
    let valorAtual = 0;

    if (chave === 'outros') {
      // Se for AlaCarte (outros), somar os valores do array
      valorAtual = gastos.outros.reduce((acc, item) => acc + (Number(item.value) || 0), 0);
    } else {
      // Para outros tipos, pegar o valor direto
      valorAtual = gastos[chave as keyof Omit<Gastos, 'outros'>] || 0;
    }

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

  // Handler for auto-generating offer
  const handleGerarOferta = useCallback(() => {
    // Validation 1: Check if city is selected
    if (!selectedCity) {
      toast({
        title: "Cidade não selecionada",
        description: "Selecione uma cidade antes de gerar a oferta automaticamente.",
        variant: "destructive"
      });
      return;
    }

    // Validation 2: Block if products already exist (per user request)
    if (products.length > 0) {
      toast({
        title: "Oferta já existe",
        description: "Você já possui produtos na oferta. Limpe a oferta antes de gerar automaticamente.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    const result = generateAutoOffer(gastos, selectedCity);

    if (!result.success) {
      toast({
        title: "Erro ao gerar oferta",
        description: result.errors.join(', '),
        variant: "destructive"
      });
      setIsGenerating(false);
      return;
    }

    // Add products automatically
    result.products.forEach(product => {
      // Add missing fields to match Produto type
      const productWithFields: Produto = {
        ...product,
        id: product.id || `auto-${Date.now()}-${Math.random()}`,
        fidelidade: product.fidelidade || product.observacoes?.includes('Fidelidade 12m') ? '12 meses' : 'Sem fidelidade',
        tipo: product.tipo
      };
      addProduct(productWithFields);
    });

    toast({
      title: "Oferta Gerada com Sucesso! 🎉",
      description: `${result.products.length} produto(s) adicionado(s) automaticamente. Adicione o plano Móvel manualmente se necessário.`,
      duration: 5000
    });

    if (result.warnings.length > 0) {
      // Show warnings in a separate toast
      setTimeout(() => {
        toast({
          title: "Avisos",
          description: result.warnings.join(' | '),
          variant: "default"
        });
      }, 500);
    }

    setIsGenerating(false);
  }, [gastos, selectedCity, products, addProduct, toast]);

  // Calcular desconto de débito em conta


  const alaCarteTotal = useMemo(() => gastos.outros.reduce((acc, item) => acc + (Number(item.value) || 0), 0), [gastos.outros]);

  const totalGastoAtual = useMemo(() => {
    const fixedGastos = gastos.tv + gastos.internet + gastos.fixo + gastos.movel + gastos.wifiMesh;
    return fixedGastos + alaCarteTotal;
  }, [gastos, alaCarteTotal]);
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
          <div className="col-span-12 xl:col-span-8 space-y-6">

            {/* Portability Incentive Banner */}
            <div className="relative group overflow-hidden rounded-xl p-[3px] shadow-xl">
              <div className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#ffffff_50%,transparent_100%)] opacity-80" />

              <div className="relative h-full w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 lg:py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl opacity-50 pointer-events-none"></div>

                <div className="relative flex flex-col sm:flex-row items-center gap-5 z-10">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.3)] ring-1 ring-white/30 backdrop-blur-sm">
                    <ArrowRightLeft className="h-8 w-8 text-white drop-shadow-md" />
                  </div>
                  <div className="space-y-1.5 text-center sm:text-left">
                    <h3 className="text-xl lg:text-2xl font-black text-white leading-tight drop-shadow-sm">
                      O cliente possui outra operadora?
                    </h3>
                    <p className="text-sm lg:text-base font-medium text-blue-50 max-w-2xl text-shadow-sm leading-relaxed">
                      Oferte a <span className="font-bold text-white bg-white/10 px-1.5 py-0.5 rounded border border-white/20">Portabilidade</span> e garanta <span className="font-black text-yellow-300">SUA COMISSÃO</span> E UMA <span className="font-black text-green-300">BAIXA TAXA DE SILENTE!</span>
                    </p>
                  </div>
                </div>

                <Badge className="relative z-10 bg-white text-blue-600 hover:bg-blue-50 border-0 px-6 py-3 text-xs lg:text-sm font-black uppercase tracking-widest shadow-lg transform transition-transform group-hover:scale-105 whitespace-normal sm:whitespace-nowrap text-center">
                  PORTABILIDADE É GARANTIA DE DINHEIRO NO SEU BOLSO 🚀
                </Badge>
              </div>
            </div>

            {/* City Selector - Destacado no topo */}
            <Card className="shadow-md border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-transparent">
              <CardContent className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-700">Cidade do Cliente</Label>
                      <p className="text-xs text-muted-foreground">Selecione a cidade para gerar ofertas</p>
                    </div>
                  </div>

                  <Popover open={cityOpen} onOpenChange={setCityOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={cityOpen}
                        className="w-[280px] justify-between font-medium"
                      >
                        {selectedCity || "Selecione a cidade..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-0">
                      <Command
                        filter={(value, search) => {
                          const normalizedValue = normalizeText(value);
                          const normalizedSearch = normalizeText(search);
                          return normalizedValue.includes(normalizedSearch) ? 1 : 0;
                        }}
                      >
                        <CommandInput placeholder="Buscar cidade..." />
                        <CommandList>
                          <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
                          <CommandGroup>
                            {regioes.flatMap(regiao => regiao.cidades).sort().map((cidade) => (
                              <CommandItem
                                key={cidade}
                                value={cidade}
                                onSelect={(currentValue) => {
                                  setSelectedCity(currentValue === selectedCity ? null : currentValue);
                                  setCityOpen(false);
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedCity === cidade ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {cidade}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>

            {/* Desktop Top Row: Gastos + Carrinho (Side by Side) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 1. Gastos Atuais */}
              <Card className="shadow-sm border-slate-200 h-full flex flex-col border-t-4 border-t-slate-500">
                <CardHeader className="pb-3 pt-4">
                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-gray-500" />
                        <CardTitle className="text-xl">Gastos Atuais</CardTitle>
                      </div>
                      <CardDescription>Quanto o cliente paga hoje.</CardDescription>
                    </div>
                    <div className="text-right bg-yellow-400/10 px-3 py-1 rounded-lg border border-yellow-400/20">
                      <span className="text-[10px] text-yellow-700/80 font-bold uppercase tracking-wider block">Total Atual</span>
                      <span className="text-lg font-black text-yellow-900">{formatCurrency(totalGastoAtual)}</span>
                    </div>
                  </div>
                </CardHeader>

                {/* Auto-Generate Offer Button */}
                <div className="px-4 pb-4">
                  <Button
                    onClick={handleGerarOferta}
                    disabled={isGenerating || !selectedCity || products.length > 0}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold shadow-lg transform transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Gerando Oferta...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-5 w-5" />
                        Gerar Oferta Automaticamente
                      </>
                    )}
                  </Button>
                  {!selectedCity && (
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      Selecione uma cidade primeiro
                    </p>
                  )}
                  {products.length > 0 && selectedCity && (
                    <p className="text-xs text-center text-orange-600 mt-2 font-medium">
                      Limpe a oferta para gerar automaticamente
                    </p>
                  )}
                </div>

                <CardContent className="space-y-6 flex-1">
                  <div className="flex flex-col gap-4">
                    {/* TV - 3 colunas (Valor | Pacote | Pontos Adicionais) */}
                    <div className="space-y-1.5 group">
                      <Label className="text-muted-foreground text-xs uppercase font-semibold flex items-center gap-1.5">
                        <Tv className="h-3.5 w-3.5" /> TV
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                          <Input
                            type="number"
                            value={gastos.tv === 0 ? '' : gastos.tv}
                            onChange={(e) => setGastos({ ...gastos, tv: Number(e.target.value) || 0 })}
                            placeholder="0,00"
                            className="pl-8 text-right font-medium transition-all focus:border-primary"
                          />
                        </div>
                        <Input
                          type="text"
                          value={gastos.tvPacote || ''}
                          onChange={(e) => setGastos({ ...gastos, tvPacote: e.target.value })}
                          placeholder="ex: MIX HD"
                          className="text-sm"
                        />
                        <Input
                          type="number"
                          value={gastos.tvPontosAdicionais || ''}
                          onChange={(e) => setGastos({ ...gastos, tvPontosAdicionais: Number(e.target.value) || 0 })}
                          placeholder="Pontos Adic."
                          className="text-sm text-center"
                        />
                      </div>
                    </div>

                    {/* Internet - 2 colunas */}
                    <div className="space-y-1.5 group">
                      <Label className="text-muted-foreground text-xs uppercase font-semibold flex items-center gap-1.5">
                        <Wifi className="h-3.5 w-3.5" /> Internet
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                          <Input
                            type="number"
                            value={gastos.internet === 0 ? '' : gastos.internet}
                            onChange={(e) => setGastos({ ...gastos, internet: Number(e.target.value) || 0 })}
                            placeholder="0,00"
                            className="pl-8 text-right font-medium transition-all focus:border-primary"
                          />
                        </div>
                        <Input
                          type="text"
                          value={gastos.internetPacote || ''}
                          onChange={(e) => setGastos({ ...gastos, internetPacote: e.target.value })}
                          placeholder="ex: 350 Megas"
                          className="text-sm"
                        />
                      </div>
                    </div>

                    {/* Fixo - 2 colunas */}
                    <div className="space-y-1.5 group">
                      <Label className="text-muted-foreground text-xs uppercase font-semibold flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" /> Fixo
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                          <Input
                            type="number"
                            value={gastos.fixo === 0 ? '' : gastos.fixo}
                            onChange={(e) => setGastos({ ...gastos, fixo: Number(e.target.value) || 0 })}
                            placeholder="0,00"
                            className="pl-8 text-right font-medium transition-all focus:border-primary"
                          />
                        </div>
                        <Input
                          type="text"
                          value={gastos.fixoPacote || ''}
                          onChange={(e) => setGastos({ ...gastos, fixoPacote: e.target.value })}
                          placeholder="ex: Brasil"
                          className="text-sm"
                        />
                      </div>
                    </div>

                    {/* Móvel - 1 coluna */}
                    <div className="space-y-1.5 group">
                      <Label className="text-muted-foreground text-xs uppercase font-semibold flex items-center gap-1.5">
                        <Smartphone className="h-3.5 w-3.5" /> Móvel
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                        <Input
                          type="number"
                          value={gastos.movel === 0 ? '' : gastos.movel}
                          onChange={(e) => setGastos({ ...gastos, movel: Number(e.target.value) || 0 })}
                          placeholder="0,00"
                          className="pl-8 text-right font-medium transition-all focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* WiFi Mesh - 1 coluna */}
                    <div className="space-y-1.5 group">
                      <Label className="text-muted-foreground text-xs uppercase font-semibold flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5" /> WiFi Mesh
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                        <Input
                          type="number"
                          value={gastos.wifiMesh === 0 ? '' : gastos.wifiMesh}
                          onChange={(e) => setGastos({ ...gastos, wifiMesh: Number(e.target.value) || 0 })}
                          placeholder="0,00"
                          className="pl-8 text-right font-medium transition-all focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Dynamic Ala Carte Fields */}
                    <div className="space-y-3 pt-2 border-t border-dashed">
                      <div className="flex items-center justify-between">
                        <Label className="text-muted-foreground text-xs uppercase font-semibold flex items-center gap-1.5">
                          {getIconForType('AlaCarte')} A la carte (Outros)
                        </Label>
                        <Button variant="ghost" size="sm" onClick={addAlaCarteItem} className="h-7 px-2.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Plus className="h-3 w-3 mr-1" /> Adicionar
                        </Button>
                      </div>

                      {gastos.outros.map((item, index) => (
                        <AlaCarteRow
                          key={item.id}
                          item={item}
                          onChange={handleAlaCarteChange}
                          onRemove={removeAlaCarteItem}
                        />
                      ))}


                      {/* Discrete Total for A la carte */}
                      {gastos.outros.length > 0 && (
                        <div className="flex justify-end items-center pt-2 border-t border-dashed mt-1">
                          <span className="text-[10px] text-muted-foreground mr-2">Total A la carte:</span>
                          <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{formatCurrency(alaCarteTotal)}</span>
                        </div>
                      )}
                    </div>
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
              <div className="hidden lg:flex flex-col h-full">
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

            {/* 3. CTA do Builder (REPLACES BuilderView) */}
            <div className="hidden lg:block space-y-4">
              <Card className="bg-gradient-to-tr from-primary/10 to-transparent border-primary/20">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    <LayoutGrid className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-900">Catálogo de Produtos</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Acesse o Montador de Ofertas para visualizar todos os produtos disponíveis e montar propostas personalizadas.
                    </p>
                  </div>
                  <Link href="/builder">
                    <Button size="lg" className="gap-2 font-semibold shadow-lg shadow-primary/25">
                      <ShoppingBag className="h-5 w-5" />
                      Ir para o Montador
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

          </div>

          {/* Coluna Direita: Sidebar (Mobile: Cart + Argumento / Desktop: Argumento) */}
          <div className="col-span-12 xl:col-span-4">

            {/* Mobile Cart (Hidden on Desktop) */}
            <div className="lg:hidden mb-6">
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
                "shadow-md border-t-4 transition-all bg-white",
                economiaMensal >= 0 ? "border-t-emerald-500 border-emerald-100" : "border-t-orange-500 border-orange-100"
              )}>
                <CardHeader className="pb-3 pt-4">
                  <div className="flex items-center gap-2">
                    <div className={cn("p-2 rounded-lg", economiaMensal >= 0 ? "bg-emerald-100" : "bg-orange-100")}>
                      {economiaMensal >= 0 ? (
                        <TrendingDown className={cn("h-5 w-5", economiaMensal >= 0 ? "text-emerald-600" : "text-orange-600")} />
                      ) : (
                        <TrendingUp className="h-5 w-5 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-800">
                        Argumento Final
                      </CardTitle>
                      <CardDescription>Resumo financeiro e benefícios.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 pb-6">
                  {/* Monthly Highlight */}
                  <div className="flex flex-col gap-1 mb-6">
                    <div className="flex items-end justify-between px-1">
                      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {economiaMensal >= 0 ? "Economia Mensal" : "Diferença Mensal"}
                      </span>
                      <span className={cn(
                        "text-3xl font-black leading-none",
                        economiaMensal >= 0 ? "text-emerald-600" : "text-orange-600"
                      )}>
                        {formatCurrency(Math.abs(economiaMensal))}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
                      <div className={cn("h-full rounded-full w-full", economiaMensal >= 0 ? "bg-emerald-500" : "bg-orange-500")} />
                    </div>
                  </div>

                  {/* Annual Savings Hero */}
                  {economiaMensal > 0 && (
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 p-6 text-white shadow-lg shadow-emerald-200 mb-8 transform transition-all hover:scale-[1.02]">
                      <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Wallet className="w-24 h-24 rotate-12" />
                      </div>
                      <div className="relative z-10 flex flex-col items-center text-center gap-0">
                        <span className="text-emerald-50 font-semibold text-xs uppercase tracking-[0.2em] mb-1">Economia Anual</span>
                        <span className="text-4xl font-black tracking-tighter drop-shadow-sm">{formatCurrency(economiaMensal * 12)}</span>
                        <span className="text-emerald-100 text-[10px] mt-1 bg-white/20 px-2 py-0.5 rounded-full">Garantida em 12 meses</span>
                      </div>
                    </div>
                  )}

                  <Separator className="my-6" />

                  {/* Benefits List (Detailed) */}
                  <div className="space-y-8">
                    {Object.entries(beneficiosAgrupados).map(([tipo, beneficios]) => {
                      const beneficiosUnicos = [...new Set(beneficios)];
                      if (beneficiosUnicos.length === 0) return null;
                      return (
                        <div key={tipo} className="relative">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                              {tipo}
                            </span>
                            <div className="h-px bg-gray-100 flex-1" />
                          </div>

                          <ul className="space-y-3 pl-1">
                            {beneficiosUnicos.map((b, i) => (
                              <li key={i} className="flex items-start gap-3 group">
                                <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                  <Check className="h-3 w-3 text-primary" />
                                </div>
                                <span className="text-sm text-gray-700 leading-relaxed font-medium group-hover:text-gray-900 transition-colors">
                                  {b}
                                </span>
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

function AlaCarteRow({ item, onChange, onRemove }: {
  item: { id: string, name: string, value: number },
  onChange: (id: string, field: 'name' | 'value', value: string | number) => void,
  onRemove: (id: string) => void
}) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="flex gap-2 items-center animate-in fade-in slide-in-from-top-1">
      <div className="flex-1 min-w-0">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full justify-between h-9 text-xs font-normal",
                !item.name && "text-muted-foreground"
              )}
            >
              {item.name || "Selecionar ou digitar..."}
              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command
              filter={(value, search) => {
                const normalizedValue = normalizeText(value);
                const normalizedSearch = normalizeText(search);
                return normalizedValue.includes(normalizedSearch) ? 1 : 0;
              }}
            >
              <CommandInput
                placeholder="Buscar serviço..."
                className="h-9 text-xs"
                value={searchValue}
                onValueChange={setSearchValue}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchValue) {
                    onChange(item.id, 'name', searchValue);
                    setOpen(false);
                  }
                }}
              />
              <CommandList>
                <CommandEmpty>
                  <div className="p-2 text-xs">
                    <p className="text-muted-foreground">Não encontrado.</p>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-xs h-8 px-2 mt-1 font-bold text-primary truncate"
                      onClick={() => {
                        onChange(item.id, 'name', searchValue);
                        setOpen(false);
                      }}
                    >
                      Usar "{searchValue}"
                    </Button>
                  </div>
                </CommandEmpty>
                <CommandGroup heading="Sugestões" className="max-h-[200px] overflow-auto">
                  {produtosOpcionais
                    .filter(p => !searchValue || p.nome.toLowerCase().includes(searchValue.toLowerCase()))
                    .map((prod) => (
                      <CommandItem
                        key={`${prod.nome}-${prod.precoMensal}`}
                        value={prod.nome}
                        onSelect={(currentValue) => {
                          onChange(item.id, 'name', prod.nome);
                          // User requested NOT TO set the value automatically
                          // if (prod.precoMensal) { onChange(item.id, 'value', prod.precoMensal); }
                          setOpen(false);
                          setSearchValue("");
                        }}
                        className="text-xs"
                      >
                        <div className="flex justify-between w-full items-center gap-2">
                          <span className="truncate">{prod.nome}</span>
                          <span className="text-muted-foreground font-mono shrink-0">
                            {prod.precoMensal ? `R$ ${prod.precoMensal.toFixed(2)}` : 'R$ --'}
                          </span>
                        </div>
                        <CheckIcon
                          className={cn(
                            "ml-auto h-3 w-3 shrink-0",
                            item.name === prod.nome ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="relative w-24 shrink-0">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">R$</span>
        <Input
          type="number"
          placeholder="0,00"
          className="h-9 pl-6 text-right text-xs font-medium"
          value={item.value === 0 ? '' : item.value}
          onChange={(e) => onChange(item.id, 'value', Number(e.target.value))}
        />
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50"
        onClick={() => onRemove(item.id)}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}