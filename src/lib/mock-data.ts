import type { Procedimento, Produto } from './types';

export const mockProdutos: Produto[] = [
  {
    id: 'prod1',
    nome: 'Claro Pós 50GB (Multi)',
    tipo: 'Movel',
    precoMensal: 99.90,
    beneficios: ['100GB Total (50GB+50GB)', 'Ligações ilimitadas', 'Skeelo Padrão'],
    fidelidade: '12 meses',
    observacoes: 'Inclui roaming nacional.',
  },
  {
    id: 'prod2',
    nome: 'Claro Pós 100GB (Multi)',
    tipo: 'Movel',
    precoMensal: 169.90,
    beneficios: ['200GB Total (100GB+100GB)', 'Passaporte Américas', '1 Dependente Grátis'],
    fidelidade: '12 meses',
  },
  {
    id: 'prod3',
    nome: 'BL 600 Mega (Combo)',
    tipo: 'Banda Larga',
    precoMensal: 99.90,
    beneficios: ['Wi-Fi 6', 'Proteção Digital McAfee', 'Globoplay Padrão'],
    fidelidade: '12 meses',
  },
  {
    id: 'prod4',
    nome: 'TV+ App',
    tipo: 'Claro TV APP',
    precoMensal: 59.9,
    beneficios: ['+100 canais ao vivo', 'Conteúdo On Demand', 'Acesso em 2 telas simultâneas'],
    fidelidade: 'Sem fidelidade',
  },
  {
    id: 'prod5',
    nome: 'Box Claro TV+',
    tipo: 'TV Box',
    precoMensal: 89.9,
    beneficios: ['+100 canais ao vivo', 'Replay TV', 'Assinatura Globoplay inclusa'],
    fidelidade: '12 meses',
  },
  {
    id: 'prod6',
    nome: 'Fixo Ilimitado Brasil',
    tipo: 'Fixo',
    precoMensal: 30.0,
    beneficios: ['Ligações ilimitadas para fixos e celulares do Brasil'],
    fidelidade: '12 meses',
    observacoes: 'Uso do código 21 da Embratel.',
  },
];

export const mockProcedimentos: Procedimento[] = [
  {
    id: 'proc1',
    titulo: 'Como contestar fatura',
    categoria: 'Financeiro',
    tags: ['fatura', 'cobrança', 'erro', 'conta'],
    conteudo: '1. Abra o sistema de faturamento.\n2. Busque pelo CPF do cliente.\n3. Selecione a fatura em questão.\n4. Clique em "Abrir contestação".\n5. Preencha o motivo e anexe os documentos necessários.\n6. Informe ao cliente o prazo de 5 dias úteis para a resposta.',
  },
  {
    id: 'proc2',
    titulo: 'Alteração de endereço',
    categoria: 'Cadastro',
    tags: ['endereço', 'mudança', 'cadastro'],
    conteudo: '1. Valide os dados do titular com confirmação positiva.\n2. Pergunte o CEP do novo endereço para verificar a viabilidade técnica.\n3. Se houver viabilidade, prossiga com a alteração no sistema CRM.\n4. Agende a visita técnica, se necessário.\n5. Confirme o novo endereço com o cliente.',
  },
  {
    id: 'proc3',
    titulo: 'Internet lenta ou sem sinal',
    categoria: 'Técnico',
    tags: ['internet', 'sinal', 'lenta', 'sem conexão'],
    conteudo: '1. Peça ao cliente para reiniciar o modem (tirar da tomada por 30 segundos).\n2. Verifique o status do sinal no sistema de diagnóstico.\n3. Se o sinal estiver normal, oriente o cliente a verificar os cabos e a conectar diretamente no modem.\n4. Se o problema persistir, abra um chamado técnico para visita.\n5. Informe o número de protocolo e o prazo da visita.',
  },
  {
    id: 'proc4',
    titulo: 'Segunda via de fatura',
    categoria: 'Financeiro',
    tags: ['fatura', '2ª via', 'boleto', 'pagamento'],
    conteudo: '1. Acesse o perfil do cliente no sistema.\n2. Vá para a seção "Faturas e Pagamentos".\n3. Selecione a fatura desejada.\n4. Envie a segunda via para o e-mail cadastrado ou forneça o código de barras para pagamento.',
  },
];
