export type ProductType = "Movel" | "Banda Larga" | "TV Cabeada" | "TV Box" | "Claro TV APP" | "Fixo" | "Opcional" | "Ponto Adicional" | "Dependente Móvel";

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
}

export interface Regiao {
    id: string;
    nome: string;
    cidades: string[];
}
