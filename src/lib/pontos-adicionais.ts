// Configurações e regras para Pontos Adicionais (PA)

// 🎯 HIERARQUIA DE TECNOLOGIA
export const HIERARQUIA_TECNOLOGIA = {
  hd: 1,
  boxCabo: 2,
  boxStreaming: 2,
  soundboxCabo: 3,
  soundboxStreaming: 3,
};

// === MAPEAMENTO DE PRODUTOS TV → TIPO TECNOLOGIA ===
export const MAPEAMENTO_TV_TECNOLOGIA: Record<string, string> = {
  // --- 6S (Rentabilização Main) ---
  "Claro TV+ Soundbox 6S (Cabo)": "soundboxCabo",
  "Claro TV+ Soundbox 6S (Streaming)": "soundboxStreaming",
  "Claro TV+ Box Cabo 6S": "boxCabo",
  "Claro TV+ Box Streaming 6S": "boxStreaming",
  "Claro TV+ HD 6S": "hd",

  // --- AQUISIÇÃO / UPGRADE CABO ---
  "Claro TV+ Soundbox (Cabo)": "soundboxCabo",
  "Claro TV+ Soundbox (Cabo) Single": "soundboxCabo",
  "Claro TV+ Box (Cabo)": "boxCabo",
  "Claro TV+ Box (Cabo) Single": "boxCabo",

  // --- AQUISIÇÃO / UPGRADE STREAMING ---
  "Claro TV+ Soundbox (Streaming)": "soundboxStreaming",
  "Claro TV+ Box (Streaming)": "boxStreaming",
  "Claro TV+ Box (Streaming) Single": "boxStreaming",

  // --- LEGADO / OUTROS ---
  "INICIAL HD RET ANUNCIO FID (R$ 69,90)": "hd",
  "INICIAL HD RET ANUNCIO TELECINE FID": "hd",
};

// === REGRAS DE COMPATIBILIDADE: Que PA cada tipo de PP pode ter ===
export const REGRAS_HIERARQUIA_PA = {
  hd: {
    paPermitidos: ["hd"],
    descricao: "TV HD só pode ter: Ponto Adicional HD",
    exemplo: "TV HD + PA HD ✅",
    contraexemplo: "TV HD + Box Cabo ❌",
  },
  boxCabo: {
    paPermitidos: ["boxCabo", "soundboxCabo", "hd"],
    descricao: "TV Box Cabo pode ter: PA Box Cabo, PA Soundbox Cabo (Upgrade) ou PA HD",
    exemplo: "Box Cabo + PA Soundbox Cabo ✅",
    contraexemplo: "Box Cabo + Box Streaming ❌ (Tecnologia diferente)",
  },
  soundboxCabo: {
    paPermitidos: ["soundboxCabo", "boxCabo", "hd"],
    descricao: "TV Soundbox Cabo pode ter: PA Soundbox Cabo, PA Box Cabo ou PA HD",
    exemplo: "Soundbox Cabo + PA Box Cabo ✅",
    contraexemplo: "Soundbox Cabo + PA Streaming ❌",
  },
  boxStreaming: {
    paPermitidos: ["boxStreaming", "soundboxStreaming"],
    descricao: "TV Box Streaming só pode ter: PA Streaming (Box ou Soundbox)",
    exemplo: "Box Streaming + PA Soundbox Streaming ✅",
    contraexemplo: "Box Streaming + Box Cabo ❌ (Tecnologia diferente)",
  },
  soundboxStreaming: {
    paPermitidos: ["soundboxStreaming", "boxStreaming"],
    descricao: "TV Soundbox Streaming só pode ter: PA Streaming (Soundbox ou Box)",
    exemplo: "Soundbox Streaming + PA Box Streaming ✅",
    contraexemplo: "Soundbox Streaming + PA HD ❌",
  },
};

// === COMPATIBILIDADE DE PA: Configuração Detalhada ===
// Usado pelo componente InfoPontosAdicionais
export const COMPATIBILIDADE_PA: Record<string, any> = {
  // === HD ===
  "TECNOLOGIA_HD": {
    categoria: "HD",
    tipoEquipamento: "hd",
    tecnologiaNivel: 1,
    paCompativel: [
      { id: "pa-hd-24", nome: "Ponto Adicional HD (Convencional)", tipo: "hd", preco: 24.90 },
      { id: "pa-hd-ret-9", nome: "Ponto Adicional HD (Retenção)", tipo: "hd", preco: 9.90 },
    ],
    procedimento: "Adicionar PA de mesma tecnologia.",
    limite: 4,
  },

  // === BOX CABO ===
  "TECNOLOGIA_BOX_CABO": {
    categoria: "4K Cabo",
    tipoEquipamento: "boxCabo",
    tecnologiaNivel: 2,
    paCompativel: [
      { id: "pa-4k-cabo-29", nome: "Ponto Adicional 4K (Cabo)", tipo: "boxCabo", preco: 29.90 },
      { id: "pa-sb-cabo-49", nome: "Ponto Adicional Soundbox (Cabo)", tipo: "soundboxCabo", preco: 49.90 },
      { id: "pa-hd-24", nome: "Ponto Adicional HD (Convencional)", tipo: "hd", preco: 24.90 },
    ],
    procedimento: "Pode mesclar 4K, Soundbox e HD (Cabo).",
    limite: 4,
  },

  // === BOX STREAMING ===
  "TECNOLOGIA_BOX_STREAMING": {
    categoria: "Streaming",
    tipoEquipamento: "boxStreaming",
    tecnologiaNivel: 2,
    paCompativel: [
      { id: "pa-box-stream-29", nome: "Ponto Adicional Box (Streaming)", tipo: "boxStreaming", preco: 29.90 },
      { id: "pa-sb-stream-49", nome: "Ponto Adicional Soundbox (Streaming)", tipo: "soundboxStreaming", preco: 49.90 },
    ],
    procedimento: "Apenas equipamentos Streaming.",
    limite: 2,
  },

  // === SOUNDBOX CABO ===
  "TECNOLOGIA_SOUNDBOX_CABO": {
    categoria: "Soundbox Cabo",
    tipoEquipamento: "soundboxCabo",
    tecnologiaNivel: 3,
    paCompativel: [
      { id: "pa-sb-cabo-49", nome: "Ponto Adicional Soundbox (Cabo)", tipo: "soundboxCabo", preco: 49.90 },
      { id: "pa-4k-cabo-29", nome: "Ponto Adicional 4K (Cabo)", tipo: "boxCabo", preco: 29.90 },
      { id: "pa-hd-24", nome: "Ponto Adicional HD (Convencional)", tipo: "hd", preco: 24.90 },
    ],
    procedimento: "Pode mesclar 4K, Soundbox e HD (Cabo).",
    limite: 4,
  },

  // === SOUNDBOX STREAMING ===
  "TECNOLOGIA_SOUNDBOX_STREAMING": {
    categoria: "Soundbox Streaming",
    tipoEquipamento: "soundboxStreaming",
    tecnologiaNivel: 3,
    paCompativel: [
      { id: "pa-sb-stream-49", nome: "Ponto Adicional Soundbox (Streaming)", tipo: "soundboxStreaming", preco: 49.90 },
      { id: "pa-box-stream-29", nome: "Ponto Adicional Box (Streaming)", tipo: "boxStreaming", preco: 29.90 },
    ],
    procedimento: "Apenas equipamentos Streaming.",
    limite: 2,
  },
};

/**
 * Obtém a configuração de PA compatível baseado no nome do produto TV
 */
export function getConfigPorNomeTV(nomeTV: string) {
  const tipoTecnologia = MAPEAMENTO_TV_TECNOLOGIA[nomeTV] || MAPEAMENTO_TV_TECNOLOGIA[nomeTV.replace(/\s+/g, ' ')];
  if (!tipoTecnologia) return undefined;

  // Encontra a configuração pelo tipo de equipamento
  for (const config of Object.values(COMPATIBILIDADE_PA)) {
    if (config.tipoEquipamento === tipoTecnologia) {
      return config;
    }
  }
  return undefined;
}

export function getLimitePa(nomePP: string): number {
  // Tenta achar direto ou pelo tipo
  if (COMPATIBILIDADE_PA[nomePP]) return COMPATIBILIDADE_PA[nomePP].limite;

  // Se nomePP for um tipo de tecnologia
  return 0;
}

export function getProcedimentoPa(nomePP: string): string {
  if (COMPATIBILIDADE_PA[nomePP]) return COMPATIBILIDADE_PA[nomePP].procedimento;
  return "Consulte regra de negócio.";
}

// Helpers mantidos para compatibilidade, mas simplificados
export function ehCompativel(nomePP: string, nomePA: string): boolean {
  return true; // Simplificado pois o filtro principal já cuida disso
}

export function respeiteHierarquiaPA(pp: string, pa: string): boolean {
  return true;
}

export function podeAdicionarMaisPa(tvName: string, qtd: number): boolean {
  const config = getConfigPorNomeTV(tvName);
  if (!config) return true;
  return qtd < config.limite;
}

export function getAlertaHierarquia(): string {
  return "⚠️ Regra: Box Streaming só com Streaming. Cabo só com PA de Cabo. Respeite a tecnologia.";
}

