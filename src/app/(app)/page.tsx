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
  Plus
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/auth-context';
import { useFirebase } from '@/firebase/provider';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { DependentesDescontoInfo } from '@/components/dependentes-desconto-info';
import { useToast } from '@/hooks/use-toast';
import type { ProductType, Produto } from '@/lib/types';
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
    setIsSaving(true);
    try {
      const offerData = {
        usuarioId: user.uid,
        email: user.email,
        nome: user.nome || '',
        supervisor: user.supervisor || 'N/A',
        zLogin: user.email?.split('@')[0].replace('z', '') || 'Desconhecido',
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
      <main className="max-w-7xl mx-auto px-4 space-y-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Coluna Esquerda: Gastos Atuais */}
          <div className="space-y-6">
            <Card className="border-t-4 border-t-gray-400 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="h-5 w-5 text-gray-500" />
                  <CardTitle className="text-xl">Gastos Atuais</CardTitle>
                </div>
                <CardDescription>Quanto o cliente paga hoje no plano atual.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="border-t bg-gray-50/50 p-5 space-y-4">
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
                    *Isso adiciona um item personalizado na lista de produtos da oferta.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Coluna Direita: Nova Oferta */}
          <div className="space-y-6">
            <Card className="border-t-4 border-t-primary shadow-md h-full flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">Nova Oferta Claro</CardTitle>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border">
                    <Switch
                      id="debitoConta"
                      checked={debitoEmConta}
                      onCheckedChange={setDebitoEmConta}
                      className="data-[state=checked]:bg-green-600"
                    />
                    <Label htmlFor="debitoConta" className="text-xs font-medium cursor-pointer select-none grid">
                      <span>Débito em Conta</span>
                      <span className="text-[10px] text-muted-foreground">+ Fatura Digital</span>
                    </Label>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 min-h-[300px] flex flex-col">
                {products.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed rounded-lg m-2">
                    <ShoppingCart className="h-10 w-10 mb-2 opacity-20" />
                    <p>Nenhum produto selecionado.</p>
                    <p className="text-sm">Utilize o Montador para adicionar itens.</p>
                  </div>
                ) : (
                  <ScrollArea className="flex-1 h-[300px] pr-4 -mr-4">
                    <ul className="space-y-3 pb-4">
                      {products.map(product => (
                        <Fragment key={product.id}>
                          <li className="group bg-white border rounded-lg p-3 hover:shadow-sm transition-shadow relative">
                            <div className="flex justify-between items-start gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <div className={cn("p-1.5 rounded-md",
                                    product.tipo === 'Movel' ? 'bg-purple-100 text-purple-700' :
                                      product.tipo === 'Banda Larga' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'
                                  )}>
                                    {getIconForType(product.tipo)}
                                  </div>
                                  <span className="font-semibold text-sm">{product.nome}</span>
                                </div>
                                <div className="text-xs text-muted-foreground pl-9">
                                  {product.fidelidade && product.fidelidade !== 'Sem fidelidade' && (
                                    <span className="inline-block mr-2 text-orange-600">• {product.fidelidade}</span>
                                  )}
                                  {product.tipo}
                                </div>
                              </div>

                              <div className="text-right">
                                <span className="font-bold text-primary block">
                                  {formatCurrency(product.precoMensal)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 mt-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
                                  onClick={() => removeProduct(product.id)}
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </li>
                        </Fragment>
                      ))}
                    </ul>
                  </ScrollArea>
                )}

                {/* Desconto DCC Info */}
                {debitoEmConta && descontoDCC > 0 && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-green-200 p-1.5 rounded-full mt-0.5">
                      <CreditCard className="h-4 w-4 text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-green-800">Desconto aplicado!</p>
                      <p className="text-xs text-green-700">
                        O cliente economiza <span className="font-bold">{formatCurrency(descontoDCC)}</span> mensais optando por Débito em Conta.
                      </p>
                    </div>
                  </div>
                )}

                <DependentesDescontoInfo />
              </CardContent>

              <CardFooter className="bg-gray-50 border-t p-4 rounded-b-lg flex flex-col gap-2">
                {debitoEmConta && descontoDCC > 0 && (
                  <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
                    <span>Valor sem desconto</span>
                    <span className="line-through">{formatCurrency(totalMensal)}</span>
                  </div>
                )}
                <div className="flex justify-between items-end w-full">
                  <span className="font-semibold text-gray-700">Total Mensal</span>
                  <div className="text-right leading-none">
                    <span className="text-2xl font-bold text-primary">{formatCurrency(totalComDesconto)}</span>
                    <p className="text-[10px] text-muted-foreground mt-1">valor final com descontos</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Argumento de Venda - Full Width */}
        {products.length > 0 && (
          <Card className={cn(
            "border overflow-hidden shadow-lg transition-all",
            economiaMensal >= 0 ? "border-green-500 shadow-green-100" : "border-red-500 shadow-red-100"
          )}>
            <div className={cn(
              "p-1 w-full",
              economiaMensal >= 0 ? "bg-green-500" : "bg-red-500"
            )} />

            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-6 w-6 text-primary" />
                Argumento de Venda
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Summary Block */}
                <div className="bg-gray-50 rounded-xl p-6 text-center flex flex-col items-center justify-center border">
                  {economiaMensal >= 0 ? (
                    <>
                      <div className="bg-green-100 p-3 rounded-full mb-3">
                        <TrendingDown className="h-8 w-8 text-green-600" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Economia Mensal para o Cliente</p>
                      <p className="text-3xl font-bold text-green-600 my-2">{formatCurrency(economiaMensal)}</p>
                      <p className="text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200 font-semibold">
                        Economia Anual: {formatCurrency(economiaMensal * 12)}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="bg-red-100 p-3 rounded-full mb-3">
                        <TrendingUp className="h-8 w-8 text-red-600" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Investimento Mensal Adicional</p>
                      <p className="text-3xl font-bold text-red-600 my-2">{formatCurrency(Math.abs(economiaMensal))}</p>
                      <p className="text-xs text-muted-foreground italic max-w-[240px]">
                        "Por apenas {formatCurrency(Math.abs(economiaMensal))} mensais a mais, o cliente leva todos estes benefícios."
                      </p>
                    </>
                  )}
                </div>

                {/* Benefits List */}
                <div className="md:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    {Object.entries(beneficiosAgrupados).map(([tipo, beneficios]) => {
                      const beneficiosUnicos = [...new Set(beneficios)];
                      if (beneficiosUnicos.length === 0) return null;

                      return (
                        <div key={tipo} className="space-y-3">
                          <h4 className="font-bold flex items-center gap-2 text-primary border-b pb-1">
                            {getIconForType(tipo)}
                            {tipo}
                          </h4>
                          <ul className="space-y-2">
                            {beneficiosUnicos.map((b, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>

                  {allFidelidade.length > 0 && (
                    <div className="mt-4 pt-4 border-t flex flex-wrap gap-2 items-center">
                      <span className="text-sm font-bold text-muted-foreground">Fidelidade:</span>
                      {allFidelidade.map((fid, idx) => (
                        <Badge key={idx} variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                          {fid}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-gray-50 p-6 flex flex-col sm:flex-row gap-4 justify-end border-t">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                onClick={handleRecuseOffer}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <X className="mr-2 h-4 w-4" />}
                Cliente Recusou
              </Button>
              <Button
                size="lg"
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200"
                onClick={handleAcceptOffer}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
                Cliente Aceitou Oferta
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Modal de Contrato */}
        <Dialog open={showContractModal} onOpenChange={setShowContractModal}>
          <DialogContent className="sm:max-w-md">
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
          <DialogContent className="sm:max-w-lg border-2 border-emerald-500">
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