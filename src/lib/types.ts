export type ProductType = "Movel" | "Banda Larga" | "TV Cabeada" | "TV Box" | "Claro TV APP" | "Fixo" | "Opcional" | "Ponto Adicional" | "Dependente Móvel" | "Serviços Avançados";

export interface Produto {
  id: string;
  nome: string;
  tipo: ProductType;
  precoMensal: number;
  beneficios: string[];
  fidelidade: string;
  observacoes?: string;
  regiaoId?: string; // Adicionado para filtro
  dependentesGratis?: number; // Número de dependentes grátis (apenas para Móvel)
  precoAplicado?: number; // Preço final com descontos aplicados
  precoAnual?: number | null; // Preço anual (se houver)
  ordem?: number; // Ordem de exibição
}

// === Tipos para Pontos Adicionais ===
export interface InfoPontoAdicional {
  id: string;
  nomePP: string; // Nome do Ponto Principal compatível
  tipoPP: string; // Tipo do Ponto Principal (Box Cabo, Box Streaming, Soundbox, HD)
  tipoCategoriaPA: "Aquisição" | "Rentabilização";
  procedimentoPA: string; // Procedimento para cadastro do PA
  limiteMaximo: number; // Limite de PA para este PP
  paCompativel: string[]; // Array de tipos de PA compatíveis
  regras?: string[]; // Regras adicionais
}

export interface PontoAdicionalConfig {
  // Configurações de Pontos Adicionais
  maxPontosBoxCabo: number; // 4
  maxPontosBoxStreaming: number; // 2
  maxPontosSoundbox: number; // 2
  precoBoxCaboAquisicao: number; // 69.90
  precoBoxCaboRentabilizacao: number; // 39.90
  precoSoundboxAquisicao: number; // 99.90
  precoSoundboxRentabilizacao: number; // 69.90
  precoBoxStreamingAquisicao: number; // 69.90
  precoBoxStreamingRentabilizacao: number; // 39.90
  precoHDRentabilizacao: number; // 29.90
}

export type ProcedureCategory = "Financeiro" | "Técnico" | "Cadastro";

export interface Procedimento {
  id: string;
  titulo: string;
  categoria: ProcedureCategory;
  tags: string[];
  conteudo: string;
}

export type UserRole = "agente" | "supervisor";

export interface Usuario {
  uid: string;
  email: string;
  role: UserRole;
  nome?: string; // Nome completo do agente
  zLogin?: string; // Número do Z (sem o prefixo)
}

export interface Regiao {
  id: string;
  nome: string;
  cidades: string[];
}
