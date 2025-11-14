
'use client';

import { useState, useMemo, Fragment } from 'react';
import { useOffer } from '@/contexts/offer-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { TrendingDown, TrendingUp, X, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/auth-context';
import { useFirebase } from '@/firebase/provider';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { DependentesDescontoInfo } from '@/components/dependentes-desconto-info';
import type { ProductType } from '@/lib/types';

type Gastos = {
  tv: number;
  internet: number;
  fixo: number;
  movel: number;
  outros: number;
};

export default function ComparadorOfertaPage() {
  const { products, clearOffer, removeProduct, gastos, setGastos, totalMensal, addProduct } = useOffer();
  const { user } = useAuth();
  const { firestore } = useFirebase();
  const [isSaving, setIsSaving] = useState(false);
  const [debitoEmConta, setDebitoEmConta] = useState(false);
  const [calculadoraValor, setCalculadoraValor] = useState('');
  const [calculadoraTipo, setCalculadoraTipo] = useState<'TV' | 'Internet' | 'Fixo' | 'Movel' | null>(null);

  const handleGastoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGastos((prev) => ({ ...prev, [name]: Number(value) || 0 }));
  };

  const handleAdicionarCalculadora = () => {
    const valor = Number(calculadoraValor);
    if (valor > 0 && calculadoraTipo) {
      // Mapa de tipo para nome legível
      const tipoMap: Record<string, string> = {
        'TV': 'TV',
        'Internet': 'Internet',
        'Fixo': 'Fixo',
        'Movel': 'Móvel'
      };
      
      // Criar produto customizado
      const produtoCustomizado: any = {
        id: `custom-${Date.now()}`,
        nome: `${tipoMap[calculadoraTipo]} (Mantém como está)`,
        tipo: 'Opcional',
        precoMensal: valor,
        beneficios: ['Valor mantido conforme informado pelo cliente'],
        fidelidade: 'Sem fidelidade',
        observacoes: `Produto customizado - ${tipoMap[calculadoraTipo]} adicionado via calculadora`
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

  const handleSaveOffer = async (status: 'Aceitou' | 'Recusou') => {
    if (!user || !firestore) return;
    setIsSaving(true);
    try {
      const offerData = {
        usuarioId: user.uid,
        produtoIds: products.map(p => p.id),
        produtos: products, // Saving full product info for easier display later
        status,
        timestamp: serverTimestamp(),
        totalOferta: totalComDesconto,
        economia: economiaMensal,
        debitoEmConta,
        descontoDCC,
      };
      const collectionPath = `users/${user.uid}/ofertas_salvas`;
      await addDoc(collection(firestore, collectionPath), offerData);
      clearOffer(); // This now clears products and gastos from context
    } catch (error) {
      console.error("Erro ao salvar oferta:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Comparador de Ofertas</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gastos Atuais do Cliente</CardTitle>
          <CardDescription>Informe os valores que o cliente paga atualmente.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {Object.keys(gastos).map((key) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="capitalize">{key}</Label>
              <Input
                type="number"
                id={key}
                name={key}
                value={gastos[key as keyof Gastos] === 0 ? '' : gastos[key as keyof Gastos]}
                onChange={handleGastoChange}
                placeholder="R$ 0,00"
                className="text-right"
              />
            </div>
          ))}
        </CardContent>
        
        {/* Calculadora */}
        <div className="px-4 py-3 bg-blue-50 border-t border-blue-200 space-y-3">
          <label className="text-sm font-medium">Calculadora - Adicionar Valor à Oferta</label>
          
          <div className="space-y-2">
            <Label className="text-xs">Selecione o tipo de serviço</Label>
            <div className="grid grid-cols-4 gap-2">
              {['TV', 'Internet', 'Fixo', 'Movel'].map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setCalculadoraTipo(tipo as any)}
                  className={`px-3 py-2 rounded border-2 font-medium text-sm transition-all ${
                    calculadoraTipo === tipo
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-blue-300 bg-white text-blue-700 hover:border-blue-500'
                  }`}
                >
                  {tipo === 'Movel' ? 'Móvel' : tipo}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="calc-valor" className="text-xs">Valor em Reais</Label>
            <div className="flex gap-2">
              <Input
                id="calc-valor"
                type="number"
                value={calculadoraValor}
                onChange={(e) => setCalculadoraValor(e.target.value)}
                placeholder="Ex: 50,00"
                className="text-right"
              />
              <Button 
                onClick={handleAdicionarCalculadora}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 min-w-fit"
                disabled={!calculadoraValor || Number(calculadoraValor) <= 0 || !calculadoraTipo}
              >
                Adicionar
              </Button>
            </div>
          </div>
          <p className="text-xs text-blue-600">✓ O valor será adicionado como um item na Nova Oferta</p>
        </div>
        
        <CardFooter className="bg-muted p-4 rounded-b-lg">
          <div className="flex justify-between items-center w-full">
            <span className="font-semibold">Total Gasto Atual</span>
            <span className="text-lg font-bold">{formatCurrency(totalGastoAtual)}</span>
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Nova Oferta Claro</CardTitle>
          <CardDescription>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm">Adicione produtos no Montador</span>
              <div className="flex items-center gap-2">
                <Switch
                  id="debitoConta"
                  checked={debitoEmConta}
                  onCheckedChange={setDebitoEmConta}
                />
                <Label htmlFor="debitoConta" className="text-sm font-normal cursor-pointer">
                  Débito em Conta + Fatura Digital
                </Label>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {products.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Nenhum produto na oferta. Adicione no Montador.</p>
          ) : (
            <ScrollArea className="h-48">
              <ul className="space-y-3">
                {products.map(product => (
                    <Fragment key={product.id}>
                      <li className="flex justify-between items-center text-sm pr-1">
                        <span>{product.nome}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{formatCurrency(product.precoMensal)}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeProduct(product.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    </Fragment>
                ))}
              </ul>
            </ScrollArea>
          )}
          
          {debitoEmConta && descontoDCC > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
              <p className="text-sm font-semibold text-green-700">💰 Desconto Débito em Conta</p>
              <p className="text-xs text-green-600 mt-1">
                Economia de {formatCurrency(descontoDCC)} com DCC + Fatura Digital
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-primary text-primary-foreground p-4 rounded-b-lg flex-col gap-2">
          {debitoEmConta && descontoDCC > 0 && (
            <div className="flex justify-between items-center w-full text-sm opacity-75">
              <span>Subtotal</span>
              <span className="line-through">{formatCurrency(totalMensal)}</span>
            </div>
          )}
          <div className="flex justify-between items-center w-full">
            <span className="font-semibold">Novo Total Claro</span>
            <span className="text-lg font-bold">{formatCurrency(totalComDesconto)}</span>
          </div>
        </CardFooter>
      </Card>

      {/* Mostrar desconto de dependentes se houver */}
      <DependentesDescontoInfo />

      {products.length > 0 && (
        <Card className={economiaMensal >= 0 ? "border-green-500" : "border-red-500"}>
          <CardHeader>
            <CardTitle>Argumento de Venda</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {economiaMensal >= 0 ? (
              <div className="space-y-2">
                <TrendingDown className="h-12 w-12 text-green-500 mx-auto" />
                <p className="text-lg font-semibold text-green-600">Economia Mensal: {formatCurrency(economiaMensal)}</p>
                <p className="text-xl font-bold text-green-700">Economia Anual: {formatCurrency(economiaMensal * 12)}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <TrendingUp className="h-12 w-12 text-red-500 mx-auto" />
                <p className="text-lg font-semibold text-red-600">Aumento Mensal: {formatCurrency(Math.abs(economiaMensal))}</p>
                <p className="text-muted-foreground">"Por apenas {formatCurrency(Math.abs(economiaMensal))} a mais, o cliente leva todos estes benefícios:"</p>
              </div>
            )}
            
            <Separator />
            
            <ScrollArea className="max-h-[600px] pr-4 w-full">
              <div className="space-y-4 text-left w-full">
                {Object.entries(beneficiosAgrupados).map(([tipo, beneficios]) => {
                  const beneficiosUnicos = [...new Set(beneficios)];
                  return (
                    <div key={tipo} className="w-full">
                      <h4 className="font-bold mb-3 text-primary text-lg">{`Benefícios ${tipo}`}</h4>
                      <ul className="space-y-2 w-full">
                        {beneficiosUnicos.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-primary font-bold min-w-fit">•</span>
                            <span className="text-foreground">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {allFidelidade.length > 0 && (
              <div className="text-left pt-4">
                  <Separator className="mb-4"/>
                  <h4 className="font-bold mb-2">Fidelidade:</h4>
                  <p className="text-sm">{allFidelidade.join(', ')}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={() => handleSaveOffer('Recusou')}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="animate-spin" /> : 'Cliente Recusou'}
            </Button>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white" 
              onClick={() => handleSaveOffer('Aceitou')}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="animate-spin" /> : 'Cliente Aceitou'}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

    