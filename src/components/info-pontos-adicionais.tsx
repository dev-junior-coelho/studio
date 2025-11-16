import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, AlertTriangle, Filter } from 'lucide-react';
import { COMPATIBILIDADE_PA, getProcedimentoPa, getLimitePa, getConfigPorNomeTV } from '@/lib/pontos-adicionais';

interface InfoPontosAdicionaisProps {
  nomePP?: string;
  nomeTV?: string; // Nome do produto TV para filtro automático
  mostrarAlerta?: boolean;
}

export function InfoPontosAdicionais({
  nomePP,
  nomeTV,
  mostrarAlerta = true,
}: InfoPontosAdicionaisProps) {
  // Se houver nomeTV, usar o mapeamento automático
  let config = undefined;
  let configKey = nomePP;

  if (nomeTV) {
    const autoConfig = getConfigPorNomeTV(nomeTV);
    if (autoConfig) {
      config = autoConfig;
      // Encontrar a chave do COMPATIBILIDADE_PA para este config
      configKey = Object.entries(COMPATIBILIDADE_PA).find(
        ([_, c]) => c === autoConfig
      )?.[0];
    }
  } else if (nomePP) {
    config = COMPATIBILIDADE_PA[nomePP as keyof typeof COMPATIBILIDADE_PA];
    configKey = nomePP;
  }

  if (!config || !configKey) {
    return (
      <Alert className="bg-amber-50 border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle>Informação não disponível</AlertTitle>
        <AlertDescription>
          {nomeTV 
            ? `Não há Pontos Adicionais para "${nomeTV}".`
            : nomePP
            ? `Não há informações de Pontos Adicionais para "${nomePP}".`
            : "Selecione um produto de TV para visualizar Pontos Adicionais compatíveis."
          }
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            Pontos Adicionais Compatíveis
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {config.categoria}
          </Badge>
        </div>
        <CardDescription>
          {nomeTV 
            ? `Equipamentos extras disponíveis para "${nomeTV}"`
            : "Equipamentos extras disponíveis para este plano"
          }
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
            {config.paCompativel.map((pa: any) => (
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
            {getProcedimentoPa(configKey)}
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

        {/* Badge informativo */}
        {nomeTV && (
          <div className="rounded-lg bg-blue-100 p-3 flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              ✅ Filtro ativado automaticamente para este produto de TV. Apenas os Pontos Adicionais 
              compatíveis são exibidos.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
