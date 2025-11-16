// Configurações e regras para Pontos Adicionais (PA)

// 🎯 HIERARQUIA DE TECNOLOGIA (REGRA CRÍTICA)
// PA não pode ter tecnologia superior ao PP
// Ordem: HD (1) < Box Cabo/Streaming (2) < Soundbox (3)
export const HIERARQUIA_TECNOLOGIA = {
  hd: 1,           // HD é a tecnologia mais básica
  boxCabo: 2,      // Box Cabo é intermediário
  boxStreaming: 2, // Box Streaming é intermediário (mesma qualidade que Box Cabo)
  soundbox: 3,     // Soundbox é a tecnologia superior (Dolby Atmos)
};

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
  hierarquiaTecnologia: HIERARQUIA_TECNOLOGIA,
};

// === MAPEAMENTO DE PRODUTOS TV → TIPO TECNOLOGIA ===
// Classifica cada TV pelo seu nível de tecnologia
export const MAPEAMENTO_TV_TECNOLOGIA = {
  // AQUISIÇÃO - Produtos 4K (Cabo de alta qualidade)
  "CTV+ TOP HD 4K": "boxCabo",
  "CTV+ TOP HD 4K MULTI": "boxCabo",
  "CTV+ TOP HD 4K SOUND": "boxCabo",
  "CTV+ TOP HD 4K SOUND MULTI": "boxCabo",

  // AQUISIÇÃO - Produtos Streaming
  "CLARO STREAMING HD TOP": "boxStreaming",

  // RENTABILIZAÇÃO - Produtos 4K Rental (Cabo)
  "CTV+TOP HD 4K RENT ANUNCIO FID": "boxCabo",
  "CTV+TOP HD 4K SOUND RENT ANUNCIO FID": "boxCabo",

  // RENTABILIZAÇÃO - Produtos Streaming Rental
  "CLARO STREAMING HD TOP RENT ANUNCIO FID": "boxStreaming",
  "CLARO STREAMING HD TOP SOUND RENT AN FID": "boxStreaming",

  // RENTABILIZAÇÃO - Produtos HD Rental (mais básicos)
  "CTV+ TOP HD RENT ANUNCIO FID": "hd",
};

// === REGRAS DE COMPATIBILIDADE: Que PA cada tipo de PP pode ter ===
// REGRA CRÍTICA: PA não pode ter tecnologia superior ao PP
export const REGRAS_HIERARQUIA_PA = {
  // Se PP é HD (nível 1), só pode ter PA HD (nível 1)
  // ✅ Exemplos: CTV+ TOP HD RENT ANUNCIO FID pode ter PA - HD RENT
  // ❌ Não pode ter Box Cabo ou Soundbox
  hd: {
    paPermitidos: ["hd"],
    descricao: "PP HD pode ter: PA HD",
    exemplo: "CTV+ TOP HD RENT + PA HD RENT ✅",
    contraexemplo: "CTV+ TOP HD RENT + PA Box Cabo ❌ (tecnologia superior)",
  },

  // Se PP é Box Cabo (nível 2), pode ter Box Cabo (2) ou Soundbox (3)?
  // SIM! Pode ter ambas, pois Soundbox é compatível e não superior
  boxCabo: {
    paPermitidos: ["boxCabo", "soundbox"],
    descricao: "PP Box Cabo pode ter: PA Box Cabo ou PA Soundbox",
    exemplo: "CTV+ TOP 4K + PA Box Cabo ✅ ou PA Soundbox ✅",
    contraexemplo: "CTV+ TOP 4K + PA HD ❌ (tecnologia inferior)",
  },

  // Se PP é Box Streaming (nível 2), mesma lógica
  boxStreaming: {
    paPermitidos: ["boxStreaming", "soundbox"],
    descricao: "PP Box Streaming pode ter: PA Box Streaming ou PA Soundbox",
    exemplo: "CLARO STREAMING + PA Box Streaming ✅ ou PA Soundbox ✅",
    contraexemplo: "CLARO STREAMING + PA HD ❌ (tecnologia inferior)",
  },

  // Se PP é Soundbox (nível 3), só pode ter Soundbox (não pode rebaixar)
  soundbox: {
    paPermitidos: ["soundbox"],
    descricao: "PP Soundbox pode ter: PA Soundbox",
    exemplo: "PP Soundbox + PA Soundbox ✅",
    contraexemplo: "PP Soundbox + PA Box Cabo ❌ (tecnologia inferior)",
  },
};

// === COMPATIBILIDADE DE PA: Detalhamento por tipo de PP ===
// Agora respeitando a hierarquia de tecnologia
export const COMPATIBILIDADE_PA = {
  // === AQUISIÇÃO - NÍVEL 2 (BOX CABO) ===
  "Claro TV+ BOX CABO": {
    categoria: "Aquisição",
    tipoEquipamento: "boxCabo",
    tecnologiaNivel: HIERARQUIA_TECNOLOGIA.boxCabo,
    paCompativel: [
      {
        id: "pa-box-cabo-69",
        nome: "PA - Box Cabo (R$ 69,90)",
        tipo: "boxCabo",
        tecnologiaNivel: HIERARQUIA_TECNOLOGIA.boxCabo,
        preco: 69.9,
      },
      // Soundbox é permitido pois tem tecnologia ≥ Box Cabo
      {
        id: "pa-soundbox-cabo-99",
        nome: "PA - Soundbox Cabo (R$ 99,90)",
        tipo: "soundbox",
        tecnologiaNivel: HIERARQUIA_TECNOLOGIA.soundbox,
        preco: 99.9,
      },
    ],
    procedimento: "Mesmo procedimento do PP",
    limite: 4,
  },

  // === AQUISIÇÃO - NÍVEL 2 (BOX STREAMING) ===
  "Claro TV+ BOX STREAMING": {
    categoria: "Aquisição",
    tipoEquipamento: "boxStreaming",
    tecnologiaNivel: HIERARQUIA_TECNOLOGIA.boxStreaming,
    paCompativel: [
      {
        id: "pa-box-streaming-69",
        nome: "PA - Box Streaming (R$ 69,90)",
        tipo: "boxStreaming",
        tecnologiaNivel: HIERARQUIA_TECNOLOGIA.boxStreaming,
        preco: 69.9,
      },
      // Soundbox é permitido pois tem tecnologia ≥ Box Streaming
      {
        id: "pa-soundbox-streaming-99",
        nome: "PA - Soundbox Streaming (R$ 99,90)",
        tipo: "soundbox",
        tecnologiaNivel: HIERARQUIA_TECNOLOGIA.soundbox,
        preco: 99.9,
      },
    ],
    procedimento: "Mesmo procedimento do PP",
    limite: 2,
  },

  // === AQUISIÇÃO - NÍVEL 3 (SOUNDBOX) ===
  "Claro TV+ SOUNDBOX": {
    categoria: "Aquisição",
    tipoEquipamento: "soundbox",
    tecnologiaNivel: HIERARQUIA_TECNOLOGIA.soundbox,
    paCompativel: [
      // Soundbox só pode ter Soundbox (mesma tecnologia ou não pode rebaixar)
      {
        id: "pa-soundbox-99",
        nome: "PA - Soundbox (R$ 99,90)",
        tipo: "soundbox",
        tecnologiaNivel: HIERARQUIA_TECNOLOGIA.soundbox,
        preco: 99.9,
      },
    ],
    procedimento: "Mesmo procedimento do PP",
    limite: 2,
  },

  // === RENTABILIZAÇÃO - NÍVEL 2 (BOX CABO RENT) ===
  "Claro TV+ BOX CABO RENT": {
    categoria: "Rentabilização",
    tipoEquipamento: "boxCabo",
    tecnologiaNivel: HIERARQUIA_TECNOLOGIA.boxCabo,
    paCompativel: [
      {
        id: "pa-box-cabo-rent-39",
        nome: "PA - Box Cabo RENT (R$ 39,90)",
        tipo: "boxCabo",
        tecnologiaNivel: HIERARQUIA_TECNOLOGIA.boxCabo,
        preco: 39.9,
      },
      // Soundbox RENT também é permitido
      {
        id: "pa-soundbox-rent-cable-69",
        nome: "PA - Soundbox RENT Cabo (R$ 69,90)",
        tipo: "soundbox",
        tecnologiaNivel: HIERARQUIA_TECNOLOGIA.soundbox,
        preco: 69.9,
      },
    ],
    procedimento: "CTV+TOP HD 4K RENT ANUNCIO FID",
    limite: 4,
  },

  // === RENTABILIZAÇÃO - NÍVEL 2 (BOX STREAMING RENT) ===
  "Claro TV+ BOX STREAMING RENT": {
    categoria: "Rentabilização",
    tipoEquipamento: "boxStreaming",
    tecnologiaNivel: HIERARQUIA_TECNOLOGIA.boxStreaming,
    paCompativel: [
      {
        id: "pa-box-streaming-rent-39",
        nome: "PA - Box Streaming RENT (R$ 39,90)",
        tipo: "boxStreaming",
        tecnologiaNivel: HIERARQUIA_TECNOLOGIA.boxStreaming,
        preco: 39.9,
      },
      // Soundbox RENT também é permitido
      {
        id: "pa-soundbox-rent-fiber-69",
        nome: "PA - Soundbox RENT Fibra (R$ 69,90)",
        tipo: "soundbox",
        tecnologiaNivel: HIERARQUIA_TECNOLOGIA.soundbox,
        preco: 69.9,
      },
    ],
    procedimento: "CLARO STREAMING HD TOP RENT ANUNCIO FID",
    limite: 2,
  },

  // === RENTABILIZAÇÃO - NÍVEL 1 (HD RENT) ===
  // ⚠️ IMPORTANTE: HD RENT é a tecnologia mais básica
  // Só pode ter PA de mesma tecnologia (HD RENT)
  // ❌ NÃO pode ter Box Cabo RENT ou Soundbox RENT (tecnologia superior)
  "Claro TV+ HD RENT": {
    categoria: "Rentabilização",
    tipoEquipamento: "hd",
    tecnologiaNivel: HIERARQUIA_TECNOLOGIA.hd,
    paCompativel: [
      {
        id: "pa-hd-rent-29",
        nome: "PA - HD RENT (R$ 29,90)",
        tipo: "hd",
        tecnologiaNivel: HIERARQUIA_TECNOLOGIA.hd,
        preco: 29.9,
      },
      // ❌ BLOQUEADO: Não incluir Box Cabo RENT ou Soundbox RENT
      // Razão: CTV+ TOP HD RENT é nível 1, essas são nível 2 e 3
    ],
    procedimento: "CTV+ TOP HD RENT ANUNCIO FID",
    limite: 999,
  },

  // === RENTABILIZAÇÃO - NÍVEL 3 (SOUNDBOX RENT CABO) ===
  "Claro TV+ SOUNDBOX RENT CABO": {
    categoria: "Rentabilização",
    tipoEquipamento: "soundbox",
    tecnologiaNivel: HIERARQUIA_TECNOLOGIA.soundbox,
    paCompativel: [
      // Soundbox RENT só pode ter Soundbox RENT (mesma tecnologia)
      {
        id: "pa-soundbox-rent-cable-69",
        nome: "PA - Soundbox RENT Cabo (R$ 69,90)",
        tipo: "soundbox",
        tecnologiaNivel: HIERARQUIA_TECNOLOGIA.soundbox,
        preco: 69.9,
      },
    ],
    procedimento: "CTV+TOP HD 4K SOUND RENT ANUNCIO FID",
    limite: 2,
  },

  // === RENTABILIZAÇÃO - NÍVEL 3 (SOUNDBOX RENT FIBRA) ===
  "Claro TV+ SOUNDBOX RENT FIBRA": {
    categoria: "Rentabilização",
    tipoEquipamento: "soundbox",
    tecnologiaNivel: HIERARQUIA_TECNOLOGIA.soundbox,
    paCompativel: [
      // Soundbox RENT só pode ter Soundbox RENT (mesma tecnologia)
      {
        id: "pa-soundbox-rent-fiber-69",
        nome: "PA - Soundbox RENT Fibra (R$ 69,90)",
        tipo: "soundbox",
        tecnologiaNivel: HIERARQUIA_TECNOLOGIA.soundbox,
        preco: 69.9,
      },
    ],
    procedimento: "CLARO STREAMING HD TOP SOUND RENT AN FID",
    limite: 2,
  },
};

/**
 * Obtém a configuração de PA compatível baseado no nome do produto TV
 * @param nomeTV - Nome do produto de TV Cabeada
 * @returns Configuração de PA ou undefined se não encontrado
 */
export function getConfigPorNomeTV(nomeTV: string) {
  // Primeiro, tenta encontrar o tipo de tecnologia da TV
  const tipoTecnologia = MAPEAMENTO_TV_TECNOLOGIA[nomeTV as keyof typeof MAPEAMENTO_TV_TECNOLOGIA];
  if (!tipoTecnologia) return undefined;

  // Depois, encontra a configuração de PA para esse tipo
  // Procura pela primeira chave que tem esse tipo de equipamento
  for (const [nomePP, config] of Object.entries(COMPATIBILIDADE_PA)) {
    if (config.tipoEquipamento === tipoTecnologia && !nomePP.includes("SOUNDBOX")) {
      return config;
    }
  }

  return undefined;
}

/**
 * Verifica se um PA é compatível com um PP
 * Respeita a hierarquia de tecnologia
 * @param nomePP - Nome do Ponto Principal
 * @param nomePA - Nome do Ponto Adicional
 * @returns boolean - true se compatível
 */
export function ehCompativel(nomePP: string, nomePA: string): boolean {
  const config = COMPATIBILIDADE_PA[nomePP as keyof typeof COMPATIBILIDADE_PA];
  if (!config) return false;

  return config.paCompativel.some((pa: any) => pa.nome === nomePA);
}

/**
 * Verifica se um PA pode ser adicionado a um PP respeitando hierarquia
 * @param tipoEquipamentoPP - Tipo do PP (ex: "hd", "boxCabo", "soundbox")
 * @param tipoEquipamentoPA - Tipo do PA (ex: "hd", "boxCabo", "soundbox")
 * @returns boolean - true se PA é compatível
 */
export function respeiteHierarquiaPA(
  tipoEquipamentoPP: string,
  tipoEquipamentoPA: string
): boolean {
  const regra = REGRAS_HIERARQUIA_PA[tipoEquipamentoPP as keyof typeof REGRAS_HIERARQUIA_PA];
  if (!regra) return false;

  return regra.paPermitidos.includes(tipoEquipamentoPA);
}

/**
 * Obtém o limite máximo de PA para um PP
 * @param nomePP - Nome do Ponto Principal
 * @returns number - Limite máximo de PA
 */
export function getLimitePa(nomePP: string): number {
  const config = COMPATIBILIDADE_PA[nomePP as keyof typeof COMPATIBILIDADE_PA];
  return config?.limite ?? 0;
}

/**
 * Obtém o procedimento de cadastro para um PA
 * @param nomePP - Nome do Ponto Principal
 * @returns string - Procedimento de cadastro
 */
export function getProcedimentoPa(nomePP: string): string {
  const config = COMPATIBILIDADE_PA[nomePP as keyof typeof COMPATIBILIDADE_PA];
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
  return `⚠️ REGRA DE HIERARQUIA CRÍTICA: A tecnologia do PA não pode ser SUPERIOR à do PP.\n\nExemplos CORRETOS:\n✅ PP CTV+ TOP HD 4K → PA Box Cabo ou PA Soundbox\n✅ PP CLARO STREAMING → PA Box Streaming ou PA Soundbox\n✅ PP CTV+ TOP HD RENT → PA HD RENT apenas\n\nExemplos INCORRETOS:\n❌ PP CTV+ TOP HD RENT → PA Box Cabo (tecnologia superior)\n❌ PP CLARO STREAMING → PA HD (tecnologia inferior)`;
}

/**
 * Obtém mensagem descritiva da regra para um tipo específico de PP
 * @param tipoEquipamentoPP - Tipo do PP
 * @returns string - Descrição da regra
 */
export function getDescricaoRegraPA(tipoEquipamentoPP: string): string {
  const regra = REGRAS_HIERARQUIA_PA[tipoEquipamentoPP as keyof typeof REGRAS_HIERARQUIA_PA];
  if (!regra) return "Tipo de equipamento desconhecido";

  return `
${regra.descricao}
✅ ${regra.exemplo}
❌ ${regra.contraexemplo}
  `;
}
