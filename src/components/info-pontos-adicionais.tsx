import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, AlertTriangle } from 'lucide-react';
import { COMPATIBILIDADE_PA, getProcedimentoPa, getLimitePa } from '@/lib/pontos-adicionais';

interface InfoPontosAdicionaisProps {
  nomePP?: string;
  mostrarAlerta?: boolean;
}

export function InfoPontosAdicionais({
  nomePP,
  mostrarAlerta = true,
}: InfoPontosAdicionaisProps) {
  if (!nomePP) return null;

  const config = COMPATIBILIDADE_PA[nomePP as keyof typeof COMPATIBILIDADE_PA];

  if (!config) {
    return (
      <Alert className="bg-amber-50 border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle>Informação não disponível</AlertTitle>
        <AlertDescription>
          Não há informações de Pontos Adicionais para "{nomePP}".
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            Pontos Adicionais (PA) Compatíveis
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {config.categoria}
          </Badge>
        </div>
        <CardDescription>
          Equipamentos extras disponíveis para este plano
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Limite de Pontos */}
        <div className="rounded-lg bg-white p-3 space-y-2">
          <p className="text-sm font-semibold text-gray-700">Limite Máximo:</p>
          <p className="text-lg font-bold text-blue-600">
            {config.limite === 999
              ? "Sem limite específico"
              : `${config.limite} Ponto${config.limite !== 1 ? "s" : ""} Adicional${config.limite !== 1 ? "is" : ""}`}
          </p>
        </div>

        {/* Equipamentos Compatíveis */}
        <div className="rounded-lg bg-white p-3 space-y-2">
          <p className="text-sm font-semibold text-gray-700">
            Equipamentos Compatíveis:
          </p>
          <div className="space-y-2">
            {config.paCompativel.map((pa) => (
              <div
                key={pa.id}
                className="flex items-center justify-between rounded border border-gray-200 bg-gray-50 p-2"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{pa.nome}</p>
                  <p className="text-xs text-gray-500">Tipo: {pa.tipo}</p>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  R$ {pa.preco.toFixed(2).replace(".", ",")}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Procedimento de Cadastro */}
        <div className="rounded-lg bg-white p-3 space-y-2">
          <p className="text-sm font-semibold text-gray-700">
            Procedimento de Cadastro:
          </p>
          <p className="text-sm text-gray-600 italic border-l-4 border-blue-400 pl-3">
            {getProcedimentoPa(nomePP)}
          </p>
        </div>

        {/* Alerta de Hierarquia */}
        {mostrarAlerta && (
          <Alert className="bg-amber-50 border-amber-200 mt-3">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle>Hierarquia de Tecnologia</AlertTitle>
            <AlertDescription className="text-xs">
              A tecnologia do PA não pode ser SUPERIOR à do PP. Ex: PP Box Cabo pode ter
              PA Box Cabo ou Soundbox, mas não o contrário.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
