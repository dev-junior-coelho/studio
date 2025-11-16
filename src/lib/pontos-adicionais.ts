// Configurações e regras para Pontos Adicionais (PA)

export const PONTOS_ADICIONAIS_CONFIG = {
  // Limites de pontos por tipo de equipamento
  limites: {
    boxCabo: 4, // 4 PA + 1 PP = 5 total
    boxStreaming: 2, // 2 PA + 1 PP = 3 total
    soundbox: 2, // 2 PA + 1 PP = 3 total
    hd: 999, // sem limite específico
  },

  // Preços por categoria e tipo
  precos: {
    aquisicao: {
      boxCabo: 69.9,
      soundboxCabo: 99.9,
      soundboxStreaming: 99.9,
      boxStreaming: 69.9,
    },
    rentabilizacao: {
      boxCabo: 39.9,
      boxStreaming: 39.9,
      soundbox: 69.9,
      hd: 29.9,
    },
  },

  // Hierarquia de tecnologia (quanto maior, melhor qualidade)
  hierarquiaTecnologia: {
    hd: 1,
    boxCabo: 2,
    boxStreaming: 2,
    soundbox: 3, // Soundbox > Box em qualidade (Dolby Atmos)
  },
};

// Compatibilidade entre Pontos Principais (PP) e Pontos Adicionais (PA)
export const COMPATIBILIDADE_PA = {
  "Claro TV+ BOX CABO": {
    categoria: "Aquisição",
    tipoEquipamento: "boxCabo",
    paCompativel: [
      {
        id: "pa-box-cabo-69",
        nome: "PA - Box Cabo (R$ 69,90)",
        tipo: "boxCabo",
        preco: 69.9,
      },
      {
        id: "pa-soundbox-cabo-99",
        nome: "PA - Soundbox Cabo (R$ 99,90)",
        tipo: "soundbox",
        preco: 99.9,
      },
    ],
    procedimento: "Mesmo procedimento do PP",
    limite: 4,
  },

  "Claro TV+ BOX STREAMING": {
    categoria: "Aquisição",
    tipoEquipamento: "boxStreaming",
    paCompativel: [
      {
        id: "pa-box-streaming-69",
        nome: "PA - Box Streaming (R$ 69,90)",
        tipo: "boxStreaming",
        preco: 69.9,
      },
    ],
    procedimento: "Mesmo procedimento do PP",
    limite: 2,
  },

  "Claro TV+ SOUNDBOX": {
    categoria: "Aquisição",
    tipoEquipamento: "soundbox",
    paCompativel: [
      {
        id: "pa-soundbox-99",
        nome: "PA - Soundbox (R$ 99,90)",
        tipo: "soundbox",
        preco: 99.9,
      },
    ],
    procedimento: "Mesmo procedimento do PP",
    limite: 2,
  },

  "Claro TV+ BOX CABO RENT": {
    categoria: "Rentabilização",
    tipoEquipamento: "boxCabo",
    paCompativel: [
      {
        id: "pa-box-cabo-rent-39",
        nome: "PA - Box Cabo RENT (R$ 39,90)",
        tipo: "boxCabo",
        preco: 39.9,
      },
    ],
    procedimento: "CTV+TOP HD 4K RENT ANUNCIO FID",
    limite: 4,
  },

  "Claro TV+ BOX STREAMING RENT": {
    categoria: "Rentabilização",
    tipoEquipamento: "boxStreaming",
    paCompativel: [
      {
        id: "pa-box-streaming-rent-39",
        nome: "PA - Box Streaming RENT (R$ 39,90)",
        tipo: "boxStreaming",
        preco: 39.9,
      },
    ],
    procedimento: "CLARO STREAMING HD TOP RENT ANUNCIO FID",
    limite: 2,
  },

  "Claro TV+ HD RENT": {
    categoria: "Rentabilização",
    tipoEquipamento: "hd",
    paCompativel: [
      {
        id: "pa-hd-rent-29",
        nome: "PA - HD RENT (R$ 29,90)",
        tipo: "hd",
        preco: 29.9,
      },
    ],
    procedimento: "CTV+ TOP HD RENT ANUNCIO FID",
    limite: 999,
  },

  "Claro TV+ SOUNDBOX RENT CABO": {
    categoria: "Rentabilização",
    tipoEquipamento: "soundbox",
    paCompativel: [
      {
        id: "pa-soundbox-rent-cable-69",
        nome: "PA - Soundbox RENT Cabo (R$ 69,90)",
        tipo: "soundbox",
        preco: 69.9,
      },
    ],
    procedimento: "CTV+TOP HD 4K SOUND RENT ANUNCIO FID",
    limite: 2,
  },

  "Claro TV+ SOUNDBOX RENT FIBRA": {
    categoria: "Rentabilização",
    tipoEquipamento: "soundbox",
    paCompativel: [
      {
        id: "pa-soundbox-rent-fiber-69",
        nome: "PA - Soundbox RENT Fibra (R$ 69,90)",
        tipo: "soundbox",
        preco: 69.9,
      },
    ],
    procedimento: "CLARO STREAMING HD TOP SOUND RENT AN FID",
    limite: 2,
  },
};

/**
 * Verifica se um PA é compatível com um PP
 * @param nomePP - Nome do Ponto Principal
 * @param nomePa - Nome do Ponto Adicional
 * @returns boolean - true se compatível
 */
export function ehCompativel(nomePP: string, nomePa: string): boolean {
  const config = COMPATIBILIDADE_PA[nomePP];
  if (!config) return false;

  return config.paCompativel.some((pa) => pa.nome === nomePa);
}

/**
 * Obtém o limite máximo de PA para um PP
 * @param nomePP - Nome do Ponto Principal
 * @returns number - Limite máximo de PA
 */
export function getLimitePa(nomePP: string): number {
  const config = COMPATIBILIDADE_PA[nomePP];
  return config?.limite ?? 0;
}

/**
 * Obtém o procedimento de cadastro para um PA
 * @param nomePP - Nome do Ponto Principal
 * @returns string - Procedimento de cadastro
 */
export function getProcedimentoPa(nomePP: string): string {
  const config = COMPATIBILIDADE_PA[nomePP];
  return config?.procedimento ?? "Procedimento padrão";
}

/**
 * Valida se adicionar um PA não ultrapassa o limite
 * @param nomePP - Nome do Ponto Principal
 * @param quantidadeAtual - Quantidade de PA já adicionados
 * @returns boolean - true se pode adicionar mais
 */
export function podeAdicionarMaisPa(
  nomePP: string,
  quantidadeAtual: number
): boolean {
  const limite = getLimitePa(nomePP);
  return quantidadeAtual < limite;
}

/**
 * Formata uma mensagem de alerta com a regra de hierarquia
 * @returns string - Mensagem formatada
 */
export function getAlertaHierarquia(): string {
  return `⚠️ Atenção: A tecnologia do PA não pode ser SUPERIOR à do PP. Exemplo: PP Box Cabo pode ter PA Box Cabo ou Soundbox, mas não o contrário.`;
}
