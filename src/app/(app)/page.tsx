'use client';

import { useState, useMemo } from 'react';
import { useOffer } from '@/contexts/offer-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { TrendingDown, TrendingUp, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/auth-context';
import { useFirebase } from '@/firebase/provider';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

type Gastos = {
  tv: number;
  internet: number;
  fixo: number;
  movel: number;
  outros: number;
};

export default function ComparadorOfertaPage() {
  const { products, clearOffer, removeProduct, gastos, setGastos } = useOffer();
  const { user } = useAuth();
  const { firestore } = useFirebase();
  const [isSaving, setIsSaving] = useState(false);

  const handleGastoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGastos((prev) => ({ ...prev, [name]: Number(value) || 0 }));
  };
  
  const totalGastoAtual = useMemo(() => Object.values(gastos).reduce((acc, val) => acc + val, 0), [gastos]);
  const novoTotalClaro = useMemo(() => products.reduce((acc, p) => acc + p.precoMensal, 0), [products]);
  const economiaMensal = useMemo(() => totalGastoAtual - novoTotalClaro, [totalGastoAtual, novoTotalClaro]);

  const allBeneficios = useMemo(() => products.flatMap(p => p.beneficios), [products]);
  const allFidelidade = useMemo(() => [...new Set(products.map(p => p.fidelidade).filter(f => f !== 'Sem fidelidade'))], [products]);

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
        totalOferta: novoTotalClaro,
        economia: economiaMensal,
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
        </CardHeader>
        <CardContent className="space-y-4">
          {products.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Nenhum produto na oferta. Adicione no Montador.</p>
          ) : (
            <ScrollArea className="h-48">
              <ul className="space-y-3">
                {products.map(product => (
                  <li key={product.id} className="flex justify-between items-center text-sm">
                    <span>{product.nome}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{formatCurrency(product.precoMensal)}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeProduct(product.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </CardContent>
        <CardFooter className="bg-primary text-primary-foreground p-4 rounded-b-lg">
          <div className="flex justify-between items-center w-full">
            <span className="font-semibold">Novo Total Claro</span>
            <span className="text-lg font-bold">{formatCurrency(novoTotalClaro)}</span>
          </div>
        </CardFooter>
      </Card>

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
            {(allBeneficios.length > 0 || allFidelidade.length > 0) && <Separator />}
            {allBeneficios.length > 0 && (
              <div>
                  <h4 className="font-bold mb-2">Benefícios Inclusos:</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                      {allBeneficios.map((b, i) => <div key={i} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">{b}</div>)}
                  </div>
              </div>
            )}
            {allFidelidade.length > 0 && (
              <div>
                  <h4 className="font-bold mb-2 mt-4">Fidelidade:</h4>
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
              {isSaving ? 'Salvando...' : 'Cliente Recusou'}
            </Button>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white" 
              onClick={() => handleSaveOffer('Aceitou')}
              disabled={isSaving}
            >
              {isSaving ? 'Salvando...' : 'Cliente Aceitou'}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
