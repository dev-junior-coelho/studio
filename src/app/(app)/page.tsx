'use client';

import { useState, useMemo, Fragment, useCallback } from 'react';
import { useOffer } from '@/contexts/offer-context';
import { useAuth } from '@/contexts/auth-context';
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
  Calculator,
  Lock
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useFirebase } from '@/firebase/provider';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { DependentesDescontoInfo } from '@/components/dependentes-desconto-info';
import { useToast } from '@/hooks/use-toast';
import type { ProductType, Produto, Gastos } from '@/lib/types';
import { NovaOfertaCard } from '@/components/nova-oferta-card';
import { cn, normalizeText } from '@/lib/utils';
import Link from 'next/link';
import { produtosOpcionais } from '@/data/seedOpcionais';
import { generateAutoOffer } from '@/lib/auto-offer-generator';
import { regioes } from '@/data/seedRegioes';
import { LIMITE_PONTOS_ADICIONAIS } from '@/lib/pontos-adicionais';
import { PageShell } from '@/components/layout/page-shell';

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
  const { user } = useAuth();
  const { products, clearOffer, removeProduct, gastos, setGastos, totalMensal, addProduct, debitoEmConta, setDebitoEmConta, totalComDesconto, descontoDCC, selectedCity, setSelectedCity } = useOffer();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [cityOpen, setCityOpen] = useState(false);
  const [calculadoraValor, setCalculadoraValor] = useState('');
  const [calculadoraTipo, setCalculadoraTipo] = useState<'TV' | 'Internet' | 'Fixo' | 'Mesh' | 'AlaCarte' | null>(null);
  const allCities = useMemo(() => {
    const cities = new Map<string, string>();
    regioes.forEach(regiao => {
      regiao.cidades.forEach(cidade => {
        const key = normalizeText(cidade);
        if (!cities.has(key)) cities.set(key, cidade);
      });
    });
    return Array.from(cities.values()).sort((a, b) => a.localeCompare(b));
  }, []);

  const [showContractModal, setShowContractModal] = useState(false);
  const [showActivationInfo, setShowActivationInfo] = useState(false);
  const [contractNumber, setContractNumber] = useState('');
  const [contractError, setContractError] = useState('');

  const handleContractChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 12) value = value.slice(0, 12);

    if (value.length > 3) {
      value = value.slice(0, 3) + '/' + value.slice(3);
    }

    setContractNumber(value);
    setContractError('');
  };

  const validateContract = () => {
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

    const currentZLogin = user.email?.split('@')[0].replace('z', '') || '';
    if (currentZLogin === '000000' || currentZLogin === '000001') {
      setIsSaving(true);
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
        contrato: contrato || 'N/A',
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
    if (name !== 'outros') {
      setGastos((prev) => ({ ...prev, [name]: Number(value) || 0 }));
    }
  };

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

    const tipoMap = {
      TV: 'tv',
      Internet: 'internet',
      Fixo: 'fixo',
      Mesh: 'wifiMesh',
      AlaCarte: 'outros'
    } as const;

    const chave = tipoMap[tipo];
    let valorAtual = 0;

    if (chave === 'outros') {
      valorAtual = gastos.outros.reduce((acc, item) => acc + (Number(item.value) || 0), 0);
    } else {
      valorAtual = gastos[chave] || 0;
    }

    setCalculadoraValor(valorAtual > 0 ? valorAtual.toString() : '');
  };

  const handleAdicionarCalculadora = () => {
    const valor = Number(calculadoraValor);
    if (valor > 0 && calculadoraTipo) {
      const tipoMap: Record<string, string> = {
        'TV': 'TV',
        'Internet': 'Internet',
        'Fixo': 'Fixo',
        'Mesh': 'WiFi Mesh',
        'AlaCarte': 'A la carte'
      };

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

  const handleGerarOferta = useCallback(() => {
    if (!selectedCity) {
      toast({
        title: "Cidade não selecionada",
        description: "Selecione uma cidade antes de gerar a oferta automaticamente.",
        variant: "destructive"
      });
      return;
    }

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

    result.products.forEach(product => {
      const productWithFields: Produto = {
        ...product,
        id: product.id || `auto-${Date.now()}-${Math.random()}`,
        fidelidade: product.fidelidade || product.observacoes?.includes('Fidelidade 12m') ? '12 meses' : 'Sem fidelidade',
        tipo: product.tipo
      };
      addProduct(productWithFields);
    });

    toast({
      title: "Oferta gerada com sucesso",
      description: `${result.products.length} produto(s) adicionado(s) automaticamente. Adicione o plano Móvel manualmente se necessário.`,
      duration: 5000
    });

    if (result.warnings.length > 0) {
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
      const sanitized = (beneficios || []).filter((b) => !b.toLowerCase().includes("chatgpt"));
      acc[tipo].push(...sanitized);
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
    <PageShell
      title={user && 'nome' in user ? `Olá, ${(user as any).nome.split(' ')[0]}` : 'Início'}
      description="Monte ofertas com rapidez e clareza."
      actions={
        <Badge variant="secondary" className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 hover:bg-red-50">
          <Check className="mr-1 h-3 w-3 text-red-500" />
          Sistema ativo
        </Badge>
      }
      className="pb-24 animate-in fade-in duration-500"
      contentClassName="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start"
    >
      {/* Coluna Esquerda: Principal (Gastos + Builder + Argumento) */}
      <div className="col-span-12 xl:col-span-8 space-y-6">

        {/* Card Portabilidade - Nova Paleta */}
        <Card className="border border-amber-200/60 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-amber-50 p-3 border border-amber-100/50">
                  <ArrowRightLeft className="h-6 w-6 text-amber-600" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-800">
                      Portabilidade é garantia de dinheiro no seu bolso
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600/90 leading-relaxed font-bold">
                    Cada ligação é uma oportunidade real - Acredite no que você oferece — isso faz toda diferença. Não fechou? Próximo.<br />
                    Porque o “sim” sempre chega pra quem não para.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-500 font-medium">
                    <span className="rounded-md bg-amber-100/30 px-3 py-1.5 border border-amber-200/40 text-amber-800 font-black uppercase tracking-wide">
                      Foco, energia e atitude. Bora vender portabilidade! 🚀
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-auto">
                <Badge className="w-full lg:w-auto justify-center bg-purple-600 hover:bg-purple-700 text-white border-0 px-4 py-2 text-[11px] font-black uppercase tracking-wider shadow-sm rounded-xl select-none">
                  Portabilidade aumenta sua comissão
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* City Selector - Destacado */}
        <Card className="border border-slate-200 bg-white/80 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-red-50 border border-red-100/50">
                  <MapPin className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <Label className="text-sm font-black text-slate-800 tracking-tight">Cidade do Cliente</Label>
                  <p className="text-xs text-muted-foreground">Usada para filtrar catálogo e gerar sugestão.</p>
                </div>
              </div>

              <Popover open={cityOpen} onOpenChange={setCityOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={cityOpen}
                    className="w-full sm:w-[320px] justify-between font-bold text-xs bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700 rounded-2xl h-11 transition-all"
                  >
                    {selectedCity || "Selecione a cidade..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[320px] p-0 rounded-2xl overflow-hidden border-slate-200 shadow-xl">
                  <Command
                    filter={(value, search) => {
                      const normalizedValue = normalizeText(value);
                      const normalizedSearch = normalizeText(search);
                      return normalizedValue.includes(normalizedSearch) ? 1 : 0;
                    }}
                  >
                    <CommandInput placeholder="Buscar cidade..." className="h-10 text-xs font-semibold" />
                    <CommandList>
                      <CommandEmpty className="text-xs p-3">Nenhuma cidade encontrada.</CommandEmpty>
                      <CommandGroup>
                        {allCities.map((cidade) => (
                          <CommandItem
                            key={cidade}
                            value={cidade}
                            onSelect={(currentValue) => {
                              setSelectedCity(currentValue === selectedCity ? null : currentValue);
                              setCityOpen(false);
                            }}
                            className="text-xs font-bold text-slate-700 cursor-pointer"
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4 text-red-500",
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

        {/* Desktop Top Row: Gastos + Carrinho */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* 1. Gastos Atuais */}
          <Card className="border border-slate-200 bg-white shadow-sm rounded-3xl flex flex-col h-full overflow-hidden hover:shadow-md transition-all duration-300">
            <CardHeader className="p-5 pb-3 bg-slate-50/50 border-b border-slate-50">
              <div className="flex flex-row items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-red-500" />
                    <CardTitle className="text-base font-black tracking-tight text-slate-800">Gastos Atuais</CardTitle>
                  </div>
                  <CardDescription className="text-xs text-slate-500 font-semibold">Quanto o cliente paga hoje.</CardDescription>
                </div>
                <div className="text-right bg-slate-50 px-3.5 py-1.5 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block leading-tight">Total Atual</span>
                  <span className="text-xl font-black text-slate-800 font-mono tracking-tight">{formatCurrency(totalGastoAtual)}</span>
                </div>
              </div>
            </CardHeader>

            {/* Auto-Generate Offer Button - Super Premium Tone */}
            <div className="px-5 pt-4">
              <Button
                onClick={() => {
                  handleGerarOferta();
                }}
                disabled={isGenerating || !selectedCity || products.length > 0}
                className="w-full font-black text-xs tracking-wider uppercase bg-gradient-to-r from-red-600 via-red-500 to-red-400 hover:brightness-110 text-white rounded-full h-11 shadow-lg transform active:scale-95 transition-all flex items-center justify-center border-0 select-none cursor-pointer"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando sugestão...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Gerar Sugestão Automática
                  </>
                )}
              </Button>
              {!selectedCity && (
                <p className="text-[10px] text-center text-muted-foreground mt-2 font-bold uppercase tracking-wide">
                  Selecione uma cidade primeiro
                </p>
              )}
              {products.length > 0 && selectedCity && (
                <p className="text-[10px] text-center text-red-500 mt-2 font-bold uppercase tracking-wide">
                  Limpe a oferta para gerar automaticamente
                </p>
              )}
            </div>

            <CardContent className="p-5 space-y-5 flex-1 overflow-auto">
              <div className="flex flex-col gap-3.5">
                {/* TV */}
                <div className="space-y-1 group">
                  <Label className="text-slate-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 leading-none select-none">
                    <Tv className="h-3.5 w-3.5 text-red-500" /> TV
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">R$</span>
                      <Input
                        type="number"
                        value={gastos.tv === 0 ? '' : gastos.tv}
                        onChange={(e) => setGastos({ ...gastos, tv: Number(e.target.value) || 0 })}
                        placeholder="0,00"
                        className="pl-8 text-right font-black font-mono transition-all bg-slate-50 border-slate-200 hover:bg-slate-100/50 focus:border-red-500 focus:ring-red-500/10 rounded-2xl h-10 text-xs text-slate-800"
                      />
                    </div>
                    <Input
                      type="text"
                      value={gastos.tvPacote || ''}
                      onChange={(e) => setGastos({ ...gastos, tvPacote: e.target.value })}
                      placeholder="ex: MIX HD"
                      className="text-xs bg-slate-50 border-slate-200 hover:bg-slate-100/50 focus:border-red-500 focus:ring-red-500/10 rounded-2xl h-10 font-semibold"
                    />
                    <Input
                      type="number"
                      value={gastos.tvPontosAdicionais || ''}
                      max={LIMITE_PONTOS_ADICIONAIS}
                      onChange={(e) => {
                        const quantity = Math.max(0, Math.min(LIMITE_PONTOS_ADICIONAIS, Number(e.target.value) || 0));
                        setGastos({ ...gastos, tvPontosAdicionais: quantity });
                      }}
                      placeholder="Pontos"
                      className="text-xs bg-slate-50 border-slate-200 hover:bg-slate-100/50 focus:border-red-500 focus:ring-red-500/10 rounded-2xl h-10 text-center font-semibold"
                    />
                  </div>
                </div>

                {/* Internet */}
                <div className="space-y-1 group">
                  <Label className="text-slate-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 leading-none select-none">
                    <Wifi className="h-3.5 w-3.5 text-red-500" /> Internet
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">R$</span>
                      <Input
                        type="number"
                        value={gastos.internet === 0 ? '' : gastos.internet}
                        onChange={(e) => setGastos({ ...gastos, internet: Number(e.target.value) || 0 })}
                        placeholder="0,00"
                        className="pl-8 text-right font-black font-mono transition-all bg-slate-50 border-slate-200 hover:bg-slate-100/50 focus:border-red-500 focus:ring-red-500/10 rounded-2xl h-10 text-xs text-slate-800"
                      />
                    </div>
                    <Input
                      type="text"
                      value={gastos.internetPacote || ''}
                      onChange={(e) => setGastos({ ...gastos, internetPacote: e.target.value })}
                      placeholder="ex: 350 Megas"
                      className="text-xs bg-slate-50 border-slate-200 hover:bg-slate-100/50 focus:border-red-500 focus:ring-red-500/10 rounded-2xl h-10 font-semibold"
                    />
                  </div>
                </div>

                {/* Fixo */}
                <div className="space-y-1 group">
                  <Label className="text-slate-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 leading-none select-none">
                    <Phone className="h-3.5 w-3.5 text-red-500" /> Fixo
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">R$</span>
                      <Input
                        type="number"
                        value={gastos.fixo === 0 ? '' : gastos.fixo}
                        onChange={(e) => setGastos({ ...gastos, fixo: Number(e.target.value) || 0 })}
                        placeholder="0,00"
                        className="pl-8 text-right font-black font-mono transition-all bg-slate-50 border-slate-200 hover:bg-slate-100/50 focus:border-red-500 focus:ring-red-500/10 rounded-2xl h-10 text-xs text-slate-800"
                      />
                    </div>
                    <Input
                      type="text"
                      value={gastos.fixoPacote || ''}
                      onChange={(e) => setGastos({ ...gastos, fixoPacote: e.target.value })}
                      placeholder="ex: Brasil"
                      className="text-xs bg-slate-50 border-slate-200 hover:bg-slate-100/50 focus:border-red-500 focus:ring-red-500/10 rounded-2xl h-10 font-semibold"
                    />
                  </div>
                </div>

                {/* Móvel */}
                <div className="space-y-1 group">
                  <Label className="text-slate-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 leading-none select-none">
                    <Smartphone className="h-3.5 w-3.5 text-red-500" /> Móvel
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">R$</span>
                    <Input
                      type="number"
                      value={gastos.movel === 0 ? '' : gastos.movel}
                      onChange={(e) => setGastos({ ...gastos, movel: Number(e.target.value) || 0 })}
                      placeholder="0,00"
                      className="pl-8 text-right font-black font-mono transition-all bg-slate-50 border-slate-200 hover:bg-slate-100/50 focus:border-red-500 focus:ring-red-500/10 rounded-2xl h-10 text-xs text-slate-800"
                    />
                  </div>
                </div>

                {/* WiFi Mesh */}
                <div className="space-y-1 group">
                  <Label className="text-slate-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 leading-none select-none">
                    <Zap className="h-3.5 w-3.5 text-red-500" /> WiFi Mesh
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">R$</span>
                    <Input
                      type="number"
                      value={gastos.wifiMesh === 0 ? '' : gastos.wifiMesh}
                      onChange={(e) => setGastos({ ...gastos, wifiMesh: Number(e.target.value) || 0 })}
                      placeholder="0,00"
                      className="pl-8 text-right font-black font-mono transition-all bg-slate-50 border-slate-200 hover:bg-slate-100/50 focus:border-red-500 focus:ring-red-500/10 rounded-2xl h-10 text-xs text-slate-800"
                    />
                  </div>
                </div>

                {/* Dynamic Ala Carte Fields */}
                <div className="space-y-3 pt-2 border-t border-dashed">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 leading-none select-none">
                      {getIconForType('AlaCarte')} A la carte (Outros)
                    </Label>
                    <Button variant="ghost" size="sm" onClick={addAlaCarteItem} className="h-7 px-2.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all">
                      <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar
                    </Button>
                  </div>

                  {gastos.outros.map((item) => (
                    <AlaCarteRow
                      key={item.id}
                      item={item}
                      onChange={handleAlaCarteChange}
                      onRemove={removeAlaCarteItem}
                    />
                  ))}

                  {gastos.outros.length > 0 && (
                    <div className="flex justify-end items-center pt-2 border-t border-dashed mt-1">
                      <span className="text-[10px] text-muted-foreground mr-2 font-bold uppercase tracking-wider">Total A la carte:</span>
                      <span className="text-xs font-black text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200/50 font-mono">{formatCurrency(alaCarteTotal)}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>

            {/* Calculadora Integration */}
            <div className="border-t bg-slate-50/40 p-4 space-y-4 rounded-b-3xl">
              <div className="flex items-center gap-2 text-red-500 font-bold select-none">
                <Calculator className="h-4 w-4" />
                <span className="text-xs tracking-tight">Manter valor atual na oferta</span>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {['TV', 'Internet', 'Fixo', 'Mesh', 'AlaCarte'].map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => handleSelecionarTipo(tipo as any)}
                      className={cn(
                        "px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wide border transition-all flex items-center gap-1.5",
                        calculadoraTipo === tipo
                          ? 'border-red-500 bg-red-500 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      )}
                    >
                      {getIconForType(tipo)}
                      {tipo === 'Mesh' ? 'WiFi Mesh' : (tipo === 'AlaCarte' ? 'A la carte' : tipo)}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    <Label className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider leading-none">Valor a manter</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">R$</span>
                      <Input
                        type="number"
                        value={calculadoraValor}
                        onChange={(e) => setCalculadoraValor(e.target.value)}
                        placeholder="0,00"
                        className="h-10 pl-8 bg-white border-slate-200 focus:border-red-500 focus:ring-red-500/10 rounded-2xl font-black font-mono text-xs"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleAdicionarCalculadora}
                    className="h-10 px-4 shrink-0 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wide rounded-2xl shadow-md transition-all active:scale-95"
                    disabled={!calculadoraValor || Number(calculadoraValor) <= 0 || !calculadoraTipo}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1.5" /> Adicionar
                  </Button>
                </div>
                <p className="text-[10px] text-slate-400/80 font-medium">
                  *Isso adiciona um item personalizado na lista de produtos.
                </p>
              </div>
            </div>
          </Card>

          {/* 2. Desktop Cart */}
          <div className="hidden lg:flex flex-col h-fit">
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

        {/* 3. CTA do Builder */}
        <div className="hidden lg:block space-y-4">
          <Card className="border border-slate-200 bg-white/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center gap-4">
              <div className="bg-red-50 p-3 rounded-full border border-red-100/50">
                <LayoutGrid className="h-7 w-7 text-red-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Catálogo de Produtos</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto font-medium">
                  Acesse o Montador de Ofertas para visualizar todos os produtos disponíveis e montar propostas personalizadas.
                </p>
              </div>
              <Link href="/builder">
                <Button size="lg" className="bg-gradient-to-r from-red-600 via-red-500 to-red-400 hover:brightness-110 text-white rounded-full h-11 px-6 text-xs font-black shadow-md transform active:scale-95 transition-all gap-2 border-0 select-none cursor-pointer">
                  <ShoppingBag className="h-4 w-4" />
                  Ir para o Montador
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Coluna Direita: Sidebar */}
      <div className="col-span-12 xl:col-span-4 xl:sticky xl:top-24 self-start space-y-6">

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

        {/* CARD: Argumento de Venda (Full Benefits) - Nova Paleta */}
        {products.length > 0 && (
          <Card className={cn(
            "border border-slate-200 bg-white shadow-xl rounded-3xl flex flex-col h-full overflow-hidden hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-right-1",
            economiaMensal >= 0 ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-amber-500"
          )}>
            <CardHeader className="p-5 pb-3 border-b border-slate-50 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className={cn("p-2.5 rounded-2xl bg-slate-50 border border-slate-200", economiaMensal >= 0 ? "text-emerald-600" : "text-amber-600")}>
                  {economiaMensal >= 0 ? (
                    <TrendingDown className="h-5 w-5" />
                  ) : (
                    <TrendingUp className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-base font-black text-slate-800 tracking-tight leading-tight">
                    Argumento Final
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400 font-semibold mt-0.5">Resumo financeiro e benefícios.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              {/* Monthly Highlight */}
              <div className="flex flex-col gap-1">
                <div className="flex items-end justify-between px-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {economiaMensal >= 0 ? "Economia Mensal" : "Acréscimo Mensal"}
                  </span>
                  <span className={cn(
                    "text-3xl font-black leading-none font-mono tracking-tight",
                    economiaMensal >= 0 ? "text-emerald-600" : "text-amber-600"
                  )}>
                    {formatCurrency(Math.abs(economiaMensal))}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-500", economiaMensal >= 0 ? "bg-emerald-500 w-full" : "bg-amber-500 w-full")} />
                </div>
              </div>

              {/* Annual Savings Hero */}
              {economiaMensal !== 0 && (
                <div className={cn(
                  "relative overflow-hidden rounded-2xl p-6 text-white shadow-lg mb-4 transform transition-all duration-300 hover:scale-[1.02] flex flex-col items-center text-center",
                  economiaMensal > 0
                    ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-200/50"
                    : "bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-200/50"
                )}>
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Wallet className="w-24 h-24 rotate-12" />
                  </div>
                  <div className="relative z-10 flex flex-col items-center text-center gap-1">
                    <span className="text-white/90 font-black text-[10px] uppercase tracking-wider select-none">
                      {economiaMensal > 0 ? "Economia Anual" : "Acréscimo Anual"}
                    </span>
                    <span className="text-4xl font-black tracking-tighter drop-shadow-sm font-mono leading-none">
                      {formatCurrency(Math.abs(economiaMensal * 12))}
                    </span>
                    <span className="text-white/80 text-[10px] font-bold mt-1.5 bg-white/10 px-2.5 py-1 rounded-xl">
                      {economiaMensal > 0 ? "Garantida em 12 meses" : "Calculado em 12 meses"}
                    </span>
                  </div>
                </div>
              )}

              <Separator className="my-1 border-slate-50" />

              {/* Benefits List (Detailed) */}
              <div className="space-y-6">
                {Object.entries(beneficiosAgrupados).map(([tipo, beneficios]) => {
                  const beneficiosUnicos = [...new Set(beneficios)];
                  if (beneficiosUnicos.length === 0) return null;
                  return (
                    <div key={tipo} className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-slate-50 border border-slate-200/60 text-slate-400 text-[10px] font-black px-2.5 py-1 rounded-xl uppercase tracking-wider select-none leading-none">
                          {tipo}
                        </span>
                        <div className="h-px bg-slate-50 flex-1" />
                      </div>

                      <ul className="space-y-2.5 pl-1">
                        {beneficiosUnicos.map((b, i) => (
                          <li key={i} className="flex items-start gap-2.5 group">
                            <div className="mt-0.5 h-4.5 w-4.5 rounded-full bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-all duration-300">
                              <Check className="h-3 w-3 text-red-500" />
                            </div>
                            <span className="text-xs text-slate-600 leading-relaxed font-bold group-hover:text-red-600 transition-colors">
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

      {/* Modal de Contrato */}
      <Dialog open={showContractModal} onOpenChange={setShowContractModal}>
        <DialogContent className="sm:max-w-md rounded-3xl border-slate-200 shadow-2xl p-6" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader className="gap-1 text-center sm:text-left">
            <DialogTitle className="text-lg font-black tracking-tight text-slate-800">Finalizar Venda</DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-semibold leading-relaxed">
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
                className={cn("text-center text-lg tracking-widest bg-slate-50 border-slate-200 hover:bg-slate-100/50 focus:border-red-500 focus:ring-red-500/10 rounded-2xl h-12 font-black font-mono", contractError && "border-red-500 focus-visible:ring-red-500")}
              />
              {contractError && <p className="text-xs text-red-500 text-center font-bold">{contractError}</p>}
            </div>
          </div>
          <DialogFooter className="sm:justify-between flex-row gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowContractModal(false)} className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 h-11 text-xs font-black tracking-wide w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" onClick={confirmAcceptOffer} disabled={isSaving} className="rounded-full bg-gradient-to-r from-red-600 via-red-500 to-red-400 hover:brightness-110 text-white h-11 text-xs font-black tracking-wide w-full sm:w-auto shadow-md transform active:scale-95 transition-all border-0 select-none cursor-pointer">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar Venda
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Instruções de Ativação */}
      <Dialog open={showActivationInfo} onOpenChange={setShowActivationInfo}>
        <DialogContent className="sm:max-w-lg border-2 border-emerald-500 rounded-3xl shadow-2xl p-6" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600 text-xl font-black tracking-tight select-none">
              <Check className="h-6 w-6 text-emerald-600" /> VENDA FINALIZADA COM SUCESSO!
            </DialogTitle>
            <DialogDescription className="text-slate-700 font-semibold text-sm bg-slate-50 p-4 rounded-2xl border border-slate-200 mt-4 leading-relaxed">
              Repasse as seguintes orientações ao cliente:
              <br /><br />
              "Senhor, assim que o seu novo chip chegar, é necessário entrar em contato com o número <span className="text-emerald-700 font-black">0800 723 6626</span> para realizar a ativação. Este número agora também será sua nova central de atendimento, mais exclusiva e rápida para o seu perfil, que agora é <span className="text-emerald-700 font-black">Claro Multi</span>.
              <br /><br />
              Após ativar o chip, recomendamos que teste a internet do celular para garantir que esteja tudo ok. Esse teste pode ser feito em sites como o YouTube, por exemplo; de 1 a 2 minutos de navegação já são suficientes para garantir o pleno funcionamento dos dados móveis com qualidade."
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-sm font-black tracking-wide uppercase rounded-2xl shadow-md transition-all active:scale-95" onClick={() => setShowActivationInfo(false)}>
              Entendido, Finalizar Atendimento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
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
    <div className="flex gap-2 items-center animate-in fade-in slide-in-from-top-1 duration-300">
      <div className="flex-1 min-w-0">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full justify-between h-10 text-xs font-semibold bg-slate-50 border-slate-200 hover:bg-slate-100/50 focus:border-red-500 focus:ring-red-500/10 rounded-2xl",
                !item.name && "text-muted-foreground"
              )}
            >
              <span className="truncate">{item.name || "Selecionar ou digitar..."}</span>
              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0 border-slate-200 rounded-2xl overflow-hidden shadow-xl" align="start">
            <Command
              filter={(value, search) => {
                const normalizedValue = normalizeText(value);
                const normalizedSearch = normalizeText(search);
                return normalizedValue.includes(normalizedSearch) ? 1 : 0;
              }}
            >
              <CommandInput
                placeholder="Buscar serviço..."
                className="h-10 text-xs font-semibold"
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
                      className="w-full justify-start text-xs h-8 px-2 mt-1 font-black text-red-500 hover:text-red-600 truncate"
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
                          setOpen(false);
                          setSearchValue("");
                        }}
                        className="text-xs font-bold text-slate-700 cursor-pointer"
                      >
                        <div className="flex justify-between w-full items-center gap-2">
                          <span className="truncate">{prod.nome}</span>
                          <span className="text-muted-foreground font-mono font-bold shrink-0">
                            {prod.precoMensal ? `R$ ${prod.precoMensal.toFixed(2)}` : 'R$ --'}
                          </span>
                        </div>
                        <CheckIcon
                          className={cn(
                            "ml-auto h-3 w-3 shrink-0 text-red-500",
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
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">R$</span>
        <Input
          type="number"
          placeholder="0,00"
          className="h-10 pl-7 text-right text-xs font-black font-mono bg-slate-50 border-slate-200 hover:bg-slate-100/50 focus:border-red-500 focus:ring-red-500/10 rounded-2xl text-slate-800"
          value={item.value === 0 ? '' : item.value}
          onChange={(e) => onChange(item.id, 'value', Number(e.target.value))}
        />
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all shrink-0"
        onClick={() => onRemove(item.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
