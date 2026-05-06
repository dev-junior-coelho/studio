// data/seedMovel.ts (Tabela Claro 5G - vigente a partir de 23/04/2026)

const beneficiosPosBase = [
    "WhatsApp ilimitado",
    "Ligações e SMS ilimitados para qualquer operadora do Brasil usando 021",
    "Internet suspensa ao término da franquia, com opção de contratação de pacote adicional",
    "Fidelidade de 12 meses sem aparelho; multa fixa de R$ 240,00"
];

const beneficiosControleBase = [
    "WhatsApp ilimitado",
    "Apps selecionados inclusos conforme franquia do plano",
    "Ligações e SMS ilimitados para qualquer operadora do Brasil usando 021",
    "Ao fim da franquia, todos os bônus são bloqueados até a renovação",
    "Fidelidade de 12 meses sem aparelho; multa fixa de R$ 120,00"
];


const movel = (
    nome: string,
    precoMensal: number,
    beneficios: string[],
    observacoes: string,
    dependentesGratis = 0
) => {
    // Detectar dependentes pagos nas observações
    let dependentesPagos = 0;
    const obsLower = observacoes.toLowerCase();
    // Exemplo: "Permite 1 linha adicional paga." ou "Permite 2 linhas adicionais pagas."
    const match = obsLower.match(/permite\s*(\d+)\s*linha[s]? adicional[\w\s]*paga[s]?/);
    if (match) {
        dependentesPagos = parseInt(match[1], 10);
    }

    // Montar info de dependentes

    // Novo formato solicitado: DEPENDENTE INCLUSO: 01, DEPENDENTE PAGO: 02
    const dependenteInclusoTxt = `DEPENDENTE INCLUSO: ${String(dependentesGratis).padStart(2, '0')}`;
    const dependentePagoTxt = `DEPENDENTE PAGO: ${String(dependentesPagos).padStart(2, '0')}`;
    beneficios = [
        ...beneficios,
        dependenteInclusoTxt,
        dependentePagoTxt
    ];

    // Extrair procedimento S/ APA caso exista
    const procedimentoMatch = observacoes.match(/procedimento:\s*([^\.]+)/i);
    let procedimento = 'S/ APA (procedimento não encontrado)';
    if (procedimentoMatch) {
        const procedimentos = procedimentoMatch[1].split('/').map(s => s.trim());
        // Preferir variante que contenha 'S/ APA' ou 'S/ APA' similar
        const found = procedimentos.find(p => /s\/?\s*apa/i.test(p) || /s\/apa/i.test(p));
        if (found) procedimento = found.replace(/\s+/g, ' ');
        else procedimento = procedimentos[0];
    }

    beneficios = [...beneficios, `CADASTRO NETSALES: ${procedimento}`];

    return {
        regiaoId: "nacional",
        tipo: "Movel",
        nome,
        dependentesGratis,
        precoMensal,
        precoAnual: null,
        beneficios,
        observacoes
    };
};

export const produtosMovel = [
    // Pós pago com WhatsApp ilimitado - Padrão (p.5)
    movel(
        "Claro Pós 500GB (Multi)",
        800.00,
        [...beneficiosPosBase, "Franquia: 500 GB", "Passaporte Mundo", "iCloud+ 2TB ou Google One 2TB", "5 linhas adicionais inclusas"],
        "Modalidade No Multi. Procedimento: POS MULTI 500GB S/ APA / POS MULTI 500GB C/ APA. Valores em boleto e DCC.",
        5
    ),
    movel(
        "Claro Pós 200GB (Multi)",
        240.00,
        [...beneficiosPosBase, "Franquia: 200 GB", "Passaporte Mundo", "iCloud+ 2TB ou Google One 2TB", "2 linhas adicionais inclusas"],
        "Modalidade No Multi. Procedimento: POS MULTI 200GB S/ APA / POS MULTI 200GB C/ APA.",
        2
    ),
    movel(
        "Claro Pós 150GB (Multi)",
        180.00,
        [...beneficiosPosBase, "Franquia: 150 GB", "Passaporte Américas e Europa", "iCloud+ 2TB ou Google One 2TB", "1 linha adicional inclusa"],
        "Modalidade No Multi. Procedimento: POS MULTI 150GB S/ APA / POS MULTI 150GB C/ APA.",
        1
    ),
    movel(
        "Claro Pós 100GB (Multi)",
        125.00,
        [...beneficiosPosBase, "Franquia: 100 GB", "Passaporte Américas", "iCloud+ 50GB ou Google One 100GB"],
        "Modalidade No Multi. Procedimento: POS MULTI 100GB S/ APA / POS MULTI 100GB C/ APA. Permite 1 linha adicional paga."
    ),
    movel(
        "Claro Pós 50GB + GeForce NOW (Multi)",
        120.00,
        [...beneficiosPosBase, "Franquia: 50 GB", "Assinatura GeForce NOW", "Passaporte Américas", "iCloud+ 200GB ou Google One 200GB"],
        "Modalidade No Multi. Procedimento: POS 50GB GEFORCE NOW MULTI S/ APA / C/ APA. Permite 1 linha adicional paga."
    ),
    movel(
        "Claro Pós 50GB (Multi)",
        80.00,
        [...beneficiosPosBase, "Franquia: 50 GB", "Passaporte Américas", "iCloud+ 50GB ou Google One 100GB"],
        "Modalidade No Multi. Procedimento: POS MULTI 50GB S/ APA / POS MULTI 50GB C/ APA. Permite 1 linha adicional paga."
    ),

    // Mercado em Desenvolvimento (p.19)
    movel(
        "Claro Pós 50GB + 10GB Bônus (Multi MD)",
        60.00,
        [...beneficiosPosBase, "Franquia total: 60 GB (50 GB + 10 GB bônus)", "Passaporte Américas", "iCloud+ 50GB ou Google One 100GB"],
        "Mercado em Desenvolvimento. Modalidade No Multi. Procedimento: POS MULTI 50GB+10GB S/ APA MD / C/ APA MD."
    ),

    // Controle com WhatsApp ilimitado - Padrão (p.6)
    movel(
        "Claro Controle 40GB GeForce (Multi)",
        99.90,
        [...beneficiosControleBase, "Franquia total: 40 GB", "25 GB uso livre + 5 GB apps selecionados + 10 GB bônus", "GeForce NOW incluso"],
        "Modalidade No Multi. Procedimento: CONTROLE GEFORCE MULTI 25GB + 5GB / C/APA."
    ),
    movel(
        "Claro Controle 35GB (Multi)",
        69.90,
        [...beneficiosControleBase, "Franquia total: 35 GB", "25 GB uso livre + 5 GB apps selecionados + 5 GB bônus"],
        "Modalidade No Multi. Procedimento: CONTROLE MULTI 25GB + 5GB REDES / C/APA."
    ),
    movel(
        "Claro Controle 30GB (Multi)",
        49.90,
        [...beneficiosControleBase, "Franquia total: 30 GB", "20 GB uso livre + 5 GB apps selecionados + 5 GB bônus"],
        "Modalidade No Multi. Procedimento: CONTROLE MULTI 20GB + 5GB REDES / C/APA."
    ),

    {
        regiaoId: "nacional",
        tipo: "Dependente Móvel",
        nome: "Linha Adicional Voz + Dados",
        dependentesGratis: 0,
        precoMensal: 55.00,
        precoAnual: null,
        beneficios: ["Dados e voz", "Linha adicional para planos pós-pago elegíveis"],
        observacoes: "Página 46. Para planos com linhas adicionais Multi sem custo, cadastrar o procedimento de linha adicional avulsa com desconto."
    }
];

export default produtosMovel;
