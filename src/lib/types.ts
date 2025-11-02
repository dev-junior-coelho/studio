export type ProductType = "Movel" | "Banda Larga" | "TV" | "Fixo" | "Opcional" | "Ponto Adicional";

export interface Produto {
  id: string;
  nome: string;
  tipo: ProductType;
  precoMensal: number;
  beneficios: string[];
  fidelidade: string;
  observacoes?: string;
  regiaoId?: string; // Adicionado para filtro
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
