// seed-procedures.ts (VERSÃO 2.0 - COM CREDENCIAIS)
// Script para popular a coleção 'procedimentos' para o Guia Rápido.
// Rode este script APENAS UMA VEZ.

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';

// =============================================================================
// 1. CREDENCIAIS DO PROJETO (INSERIDAS)
// =============================================================================
const firebaseConfig = {
  apiKey: "AIzaSyD_IW8CfZMseq-LsWkQoZnzEobByPywbss",
  authDomain: "studio-878079588-1d0ae.firebaseapp.com",
  projectId: "studio-878079588-1d0ae",
  storageBucket: "studio-878079588-1d0ae.appspot.com",
  messagingSenderId: "486175528141",
  appId: "1:486175528141:web:4e4d4d291cd8e099c28584"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =============================================================================
// 3. DADOS DOS PROCEDIMENTOS (Extraído de PROCESSOS.txt)
// =============================================================================

const procedimentosParaCadastrar = [
  {
    titulo: "Chamado TI - CA3R-CA5 (Erros de Acesso)",
    categoria: "Sistemas",
    tags: ["chamado", "ti", "ca3r-ca5", "erro", "acesso", "site", "minha claro", "claro tv+", "senha", "reset"],
    conteudo: `**Motivo:** Tratamento de chamados TI para erros de acesso (Site Claro, app Minha Claro, app Claro tv+, etc.).

**Exemplos:** Reset de senha, segunda via de senha.

**Como Gerar:**
1. Jornada Atendimento
2. Selecione o tipo: Reclamação
3. Selecione o motivo do contato: "Erro de acesso Minha Claro Residencial"`
  },
  {
    titulo: "CA3R-CA4 (Falhas Sistêmicas)",
    categoria: "Sistemas",
    tags: ["chamado", "ti", "ca3r-ca4", "erro", "sistêmico", "falha", "divergência", "contrato"],
    conteudo: `**Motivo:** Tratamento de chamados TI referentes a outras falhas que impedem a execução de solicitações.

**Exemplo:** Contratos com Claro net fone/Claro fone com divergência entre os contratos.

**Como Gerar:**
1. Jornada Técnica -> Dificuldade sistemica
2. Classifique o atendimento como Solicitação >> Atendimento >> Erro sistêmico >> e o Motivo de saída mais adequado ao atendimento`
  },
  {
    titulo: "Cancelamento Total de Contrato",
    categoria: "Cancelamento",
    tags: ["cancelamento", "total", "cancelar", "retenção", "contrato"],
    conteudo: `**Como Gerar:**
1. JORNADA RETENÇÃO
2. SELECIONE O CONTRATO -> SELECIONE OS PRODUTOS
3. MOTIVO DO CONTATO -> SALVAR
4. VER OFERTAS -> CANCELAMENTO TOTAL
5. CONFIRME -> AGENDE E FINALIZE`
  },
  {
    titulo: "Cancelamento Parcial de Produto",
    categoria: "Cancelamento",
    tags: ["cancelamento", "parcial", "produto", "retenção"],
    conteudo: `**Como Gerar:**
1. JORNADA RETENÇÃO -> SELECIONE O CONTRATO -> SELECIONE OS PRODUTOS
2. MOTIVO DO CONTATO -> SALVAR
3. VER OFERTAS -> TODAS AS OFERTAS -> CANCELAMENTO PARCIAL
4. FILTRE O PRODUTO que o cliente quer cancelar para "SEM PLANO"
5. CONFIRME -> AGENDE E FINALIZE`
  },
  {
    titulo: "Troca de Senha de Wi-Fi (Via Solar)",
    categoria: "Técnico",
    tags: ["troca", "senha", "wifi", "wi-fi", "solar", "sem navegação", "não lembra"],
    conteudo: `**Como Gerar:**
1. JORNADA TECNICA -> STATUS DO CONTRATO -> SELECIONE O CONTRATO -> SELECIONE O PRODUTO
2. MOTIVO DO CONTATO -> DESCRIÇÃO DO ATENDIMENTO -> CRIAR ATENDIMENTO
3. CRIAR NOVO PROTOCOLO -> SELECIONE A OPÇÃO TECNICO
4. SELECIONE O PONTO DE INTERNET (ou PONTO)
5. SELECIONE O MOTIVO: SUPORTE TÉCNICO -> SELECIONE O ASSUNTO: SEM NAVEGAÇÃO
6. SELECIONE A SITUAÇÃO: NÃO LEMBRA
7. INICIAR SEM DIAGNÓSTICO -> PRODUTOS E EQUIPAMENTOS`
  },
  {
    titulo: "Promessa de Pagamento",
    categoria: "Financeiro",
    tags: ["promessa", "pagamento", "fatura", "financeiro", "negociar", "acordo"],
    conteudo: `**Como Gerar:**
1. JORNADA FINANCEIRA -> STATUS DO CONTRATO -> SELECIONE O CONTRATO -> SELECIONE O PRODUTO
2. MOTIVO DO CONTATO: FATURA -> DESCRIÇÃO DO ATENDIMENTO
3. CRIAR NOVO PROTOCOLO -> SELECIONE FINANCEIRO
4. IR PARA FICHA FINANCEIRA -> STATUS DA PROMESSA DE PAGAMENTO`
  },
  {
    titulo: "Contestação de Fatura",
    categoria: "Financeiro",
    tags: ["contestação", "fatura", "cobrança", "valor", "errado", "financeiro"],
    conteudo: `**Como Gerar:**
1. JORNADA FINANCEIRA -> STATUS DO CONTRATO -> SELECIONE O CONTRATO -> SELECIONE O PRODUTO
2. MOTIVO DO CONTATO: FATURA -> DESCRIÇÃO DO ATENDIMENTO
3. CRIAR NOVO PROTOCOLO -> SELECIONE FINANCEIRO
4. IR PARA FICHA FINANCEIRA
5. SELECIONE A FATURA -> VER ITENS DA FATURA
6. SELECIONE O PRODUTO que terá o valor contestado
7. SELECIONE O ITEM que será contestado
8. CLIQUE EM CONTESTAR -> SELECIONE O VALOR -> O MOTIVO
9. EMITIR BOLETO -> CONFIRME O E-MAIL -> CONTESTAR`
  },
  {
    titulo: "Segunda Via de Fatura",
    categoria: "Financeiro",
    tags: ["segunda", "via", "2a", "fatura", "boleto", "código de barras"],
    conteudo: `**Como Gerar:**
1. TELA PRINCIPAL -> PRODUTOS -> FINANCEIRO
2. SELECIONE A FATURA -> ENVIAR SEGUNDA VIA`
  },
  {
    titulo: "Mudança de Endereço",
    categoria: "Cadastro",
    tags: ["mudança", "endereço", "mudar", "casa", "instalação", "transferência"],
    conteudo: `**Como Gerar:**
1. JORNADA MUDANÇA DE ENDEREÇO -> Status do Contrato
2. Selecione Contrato -> Produto
3. CRIAR ATENDIMENTO -> PREENCHA O QUESTIONARIO`
  },
  {
    titulo: "Baixa de OS (Ordem de Serviço)",
    categoria: "Técnico",
    tags: ["baixa", "os", "ordem de serviço", "erro", "técnico", "protocolo"],
    conteudo: `**Como Gerar:**
1. JORNADA TECNICA -> STATUS DO CONTRATO -> SELECIONE O CONTRATO -> SELECIONE O PRODUTO
2. MOTIVO DO CONTATO -> DESCRIÇÃO DO ATENDIMENTO -> CRIAR ATENDIMENTO
3. CRIAR PROTOCOLO -> TRATATIVA DE PROTOCOLO
4. PREENCHA OS CAMPOS: CATEGORIA - MODALIDADE - MOTIVO DA ENTRADA
5. MOTIVO DA SAÍDA: BAIXAR OS COM ERRO -> DESCRIÇÃO`
  },
  {
    titulo: "Baixa de OC (Ordem de Campo)",
    categoria: "Técnico",
    tags: ["baixa", "oc", "ordem de campo", "aberta", "técnico", "protocolo"],
    conteudo: `**Como Gerar:**
1. JORNADA TECNICA -> STATUS DO CONTRATO -> SELECIONE O CONTRATO -> SELECIONE O PRODUTO
2. MOTIVO DO CONTATO -> DESCRIÇÃO DO ATENDIMENTO -> CRIAR ATENDIMENTO
3. CRIAR PROTOCOLO -> TRATATIVA DE PROTOCOLO
4. PREENCHA OS CAMPOS: CATEGORIA - MODALIDADE - MOTIVO DA ENTRADA
5. MOTIVO DA SAÍDA: BAIXAR OC ABERTA -> DESCRIÇÃO`
  },
  {
    titulo: "Cancelamento de Canal A La Carte",
    categoria: "Técnico",
    tags: ["cancelar", "a la carte", "canal", "premiere", "combate", "hbo", "telecine"],
    conteudo: `**Como Gerar:**
1. JORNADA TECNICA -> STATUS DO CONTRATO -> SELECIONE O CONTRATO -> SELECIONE O PRODUTO
2. MOTIVO DO CONTATO -> DESCRIÇÃO DO ATENDIMENTO -> CRIAR ATENDIMENTO
3. CRIAR NOVO PROTOCOLO -> CLIQUE EM TECNICO
4. SELECIONE O PONTO PRINCIPAL -> INICIAR SEM DIAGNOSTICO
5. Ao lado de "Abertura de Solicitação" (topo da tela), clique na seta para baixo
6. CANCELAMENTO DE A LA CARTE -> SELECIONE O A LA CARTE que vai cancelar
7. RESPONDA OS CAMPOS OBRIGATÓRIOS -> FINALIZE`
  },
  {
    titulo: "Reset de Controle Parental (Bloqueio de Canais)",
    categoria: "Técnico",
    tags: ["reset", "controle parental", "bloqueio", "senha", "canais", "adulto"],
    conteudo: `**Como Gerar:**
1. JORNADA TECNICA -> STATUS DO CONTRATO -> SELECIONE O CONTRATO -> SELECIONE O PRODUTO
2. MOTIVO DO CONTATO -> DESCRIÇÃO DO ATENDIMENTO -> CRIAR ATENDIMENTO
3. CRIAR NOVO PROTOCOLO -> CLIQUE EM TECNICO
4. SELECIONE O PONTO PRINCIPAL -> INICIAR SEM DIAGNOSTICO
5. Ao lado de "Abertura de Solicitação" (topo da tela), clique na seta para baixo
6. RESET CONTROL PARENTAL
7. RESPONDA OS CAMPOS OBRIGATÓRIOS -> FINALIZE`
  }
];


// =============================================================================
// 4. O SCRIPT DE UPLOAD (NÃO MEXA AQUI)
// =============================================================================

/**
 * Função principal para semear a coleção de procedimentos.
 */
async function seedProcedures() {
  console.log('Iniciando o script de semeadura de PROCEDIMENTOS...');

  try {
    const batch = writeBatch(db);
    
    procedimentosParaCadastrar.forEach((procedimento) => {
      // Cria uma referência de documento automática
      const procRef = doc(collection(db, 'procedimentos'));
      batch.set(procRef, {
        titulo: procedimento.titulo,
        categoria: procedimento.categoria,
        tags: procedimento.tags,
        conteudo: procedimento.conteudo
      });
    });

    await batch.commit();
    console.log(`✅ ${procedimentosParaCadastrar.length} Procedimentos cadastrados com sucesso!`);
    console.log('🚀 Semeadura de procedimentos concluída!');

  } catch (error) {
    console.error('❌ Erro durante a semeadura de procedimentos:', error);
  }
}

// Roda a função
seedProcedures();
