// components/dependentes-desconto-info.tsx
// Componente para exibir informações de desconto de dependentes

"use client";

import { useOffer } from '@/contexts/offer-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function DependentesDescontoInfo() {
  const { products, dependentesInfo, totalMensal } = useOffer();

  const movelPrincipal = products.find(p => p.tipo === 'Movel');
  const dependentes = products.filter(p => p.tipo === 'Dependente Móvel');

  if (!movelPrincipal || dependentes.length === 0) {
    return null;
  }

  const totalDesconto = dependentes.reduce((sum, dep) => sum + dep.precoMensal, 0) - dependentesInfo.reduce((sum, info) => sum + info.precoAplicado, 0);
  const dependentesGratis = dependentesInfo.filter(d => d.isGratis).length;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              Desconto de Dependentes
            </CardTitle>
            <CardDescription>
              {movelPrincipal.nome}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Resumo de desconto */}
        <Alert className="border-green-200 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="font-semibold">
              {dependentesGratis > 0 
                ? `${dependentesGratis} dependente(s) GRÁTIS + ${dependentes.length - dependentesGratis} pago(s)` 
                : `Todos os ${dependentes.length} dependente(s) serão pagos`}
            </div>
            {totalDesconto > 0 && (
              <div className="text-sm mt-1">
                Economia: <span className="font-bold">-R$ {totalDesconto.toFixed(2).replace('.', ',')}</span>
              </div>
            )}
          </AlertDescription>
        </Alert>

        {/* Lista de dependentes */}
        <div className="space-y-2">
          {dependentesInfo.map((info) => (
            <div
              key={`${info.dependente.id}-${info.index}`}
              className={`p-2 rounded-md text-sm flex items-start justify-between ${
                info.isGratis
                  ? 'bg-green-100 border border-green-300'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-start gap-2">
                {info.isGratis ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                )}
                <span className={info.isGratis ? 'font-semibold text-green-900' : 'text-gray-900'}>
                  {info.descricao}
                </span>
              </div>
              <span className={`font-semibold ${info.isGratis ? 'text-green-600' : 'text-gray-900'}`}>
                {info.precoAplicado === 0 ? 'GRÁTIS' : `R$ ${info.precoAplicado.toFixed(2).replace('.', ',')}`}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="pt-2 border-t border-blue-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-blue-900">Total da Oferta:</span>
            <span className="text-lg font-bold text-blue-900">
              R$ {totalMensal.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
