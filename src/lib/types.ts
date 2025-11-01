export type ProductType = "Móvel" | "Banda Larga" | "TV" | "Fixo";

export interface Produto {
  id: string;
  nome: string;
  tipo: ProductType;
  preco_mensal: number;
  beneficios: string[];
  fidelidade: string;
  observacoes?: string;
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
