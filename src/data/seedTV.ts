// data/seedTV.ts (V11.0 - Preços e Regras Mantidas)

const beneficiosTVComboCompleto = [
    "Netflix Padrão com Anúncios (2 acessos, Full HD)",
    "Globoplay Premium (canais ao vivo, 5 acessos)",
    "HBO Max Básico com Anúncios (2 acessos, Full HD)",
    "Apple TV+ (5 acessos, 4K HDR, sem anúncios)",
    "Disney+ Padrão com Anúncios (2 acessos, Full HD)",
    "Amazon Prime Video Padrão com Anúncios (3 acessos, Full HD)",
    "Amazon Music, Prime Gaming, Prime Reading e Frete Grátis",
    "Controle com Comando de Voz",
    "Gravador Virtual com 400 horas"
];

const beneficiosTVComboUpgrade = [
    "Netflix Padrão com Anúncios",
    "Apple TV+",
    "HBO Max Básico com Anúncios",
    "Globoplay Canais Incluso",
    "Controle com Comando de Voz",
    "Gravador Virtual com 400 horas"
];

export const produtosTV = [
    // TV Padrão (p.65) - Região 'padrao' e 'especial'
    ...['padrao', 'especial'].flatMap(regiao => [
        {
            regiaoId: regiao, tipo: "TV", nome: "CTV+ TOP HD 4K SOUND MULTI", precoMensal: 154.90, precoAnual: null,
            beneficios: [...beneficiosTVComboCompleto, "Equipamento: Soundbox (Áudio Dolby Atmos)", "Benefício Multi: ChatGPT Plus (se Multi)"],
            observacoes: "Pacote Soundbox Cabo. Preço COM BL E MÓVEL (p.65). Desconto de R$ 5,00 no DCC+Fatura Digital."
        },
        {
            regiaoId: regiao, tipo: "TV", nome: "CTV+ TOP HD 4K SOUND", precoMensal: 164.90, precoAnual: null,
            beneficios: [...beneficiosTVComboCompleto, "Equipamento: Soundbox (Áudio Dolby Atmos)"],
            observacoes: "Pacote Soundbox Cabo. Preço COM BL OU MÓVEL ou SINGLE COM FONE (p.65). Desconto de R$ 5,00 no DCC+Fatura Digital."
        },
        {
            regiaoId: regiao, tipo: "TV", nome: "CTV+ TOP HD 4K MULTI", precoMensal: 124.90, precoAnual: null,
            beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box Cabo (Qualidade 4K)", "Benefício Multi: ChatGPT Plus (se Multi)"],
            observacoes: "Pacote Box Cabo. Preço COM BL E MÓVEL (p.65). Desconto de R$ 5,00 no DCC+Fatura Digital."
        },
        {
            regiaoId: regiao, tipo: "TV", nome: "CTV+ TOP HD 4K", precoMensal: 134.90, precoAnual: null,
            beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box Cabo (Qualidade 4K)"],
            observacoes: "Pacote Box Cabo. Preço SINGLE COM FONE (p.65). Desconto de R$ 5,00 no DCC+Fatura Digital."
        }
    ]),

    // TV Fibra Pura (p.66) - Região 'fibra-pura'
    {
        regiaoId: "fibra-pura", tipo: "TV", nome: "CLARO STREAMING HD TOP SOUND MULTI", precoMensal: 154.90, precoAnual: null,
        beneficios: [...beneficiosTVComboCompleto, "Equipamento: Soundbox (Áudio Dolby Atmos)", "Benefício Multi: ChatGPT Plus (se Multi)"],
        observacoes: "Pacote Soundbox Streaming. Preço COM BL E MÓVEL (p.66). Desconto de R$ 5,00 no DCC+Fatura Digital."
    },
    {
        regiaoId: "fibra-pura", tipo: "TV", nome: "CLARO STREAMING HD TOP MULTI", precoMensal: 124.90, precoAnual: null,
        beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box Streaming", "Benefício Multi: ChatGPT Plus (se Multi)"],
        observacoes: "Pacote Box Streaming. Preço COM BL E MÓVEL (p.66). Desconto de R$ 5,00 no DCC+Fatura Digital."
    },
    {
        regiaoId: "fibra-pura", tipo: "TV", nome: "CLARO STREAMING HD TOP", precoMensal: 134.90, precoAnual: null,
        beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box Streaming"],
        observacoes: "Pacote Box Streaming. Preço SINGLE COM FONE (p.66). Desconto de R$ 5,00 no DCC+Fatura Digital."
    },

    // TV MED (p.67) - Todas as outras regiões
    ...['med-01', 'med-02', 'med-03', 'especial-promo-6m', 'especial-promo-3m', 'especial-plus', 'especial-plus-promo-6m', 'especial-plus-promo-3-6m', 'especial-plus-promo-3m', 'especial-plus-promo-3m-b', 'med-redes-neutras-02'].flatMap(regiao => [
        {
            regiaoId: regiao, tipo: "TV", nome: "CTV+ TOP HD 4K SOUND MULTI", precoMensal: 154.90, precoAnual: null,
            beneficios: [...beneficiosTVComboCompleto, "Equipamento: Soundbox (Áudio Dolby Atmos)", "Benefício Multi: ChatGPT Plus (se Multi)"],
            observacoes: "Pacote Soundbox Cabo. Preço MED (p.67). Desconto R$ 5,00 DCC."
        },
        {
            regiaoId: regiao, tipo: "TV", nome: "CTV+ TOP HD 4K SOUND", precoMensal: 164.90, precoAnual: null,
            beneficios: [...beneficiosTVComboCompleto, "Equipamento: Soundbox (Áudio Dolby Atmos)"],
            observacoes: "Pacote Soundbox Cabo. Preço MED (p.67). Desconto R$ 5,00 DCC."
        },
        {
            regiaoId: regiao, tipo: "TV", nome: "CLARO STREAMING HD TOP SOUND MULTI", precoMensal: 154.90, precoAnual: null,
            beneficios: [...beneficiosTVComboCompleto, "Equipamento: Soundbox (Áudio Dolby Atmos)", "Benefício Multi: ChatGPT Plus (se Multi)"],
            observacoes: "Pacote Soundbox Streaming. Preço MED (p.67). Desconto R$ 5,00 DCC."
        },
        {
            regiaoId: regiao, tipo: "TV", nome: "CTV+ TOP HD 4K MULTI", precoMensal: 104.90, precoAnual: null,
            beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box Cabo (Qualidade 4K)", "Benefício Multi: ChatGPT Plus (se Multi)"],
            observacoes: "Pacote Box Cabo. Preço MED (p.67). Desconto R$ 5,00 DCC."
        },
        {
            regiaoId: regiao, tipo: "TV", nome: "CTV+ TOP HD 4K", precoMensal: 134.90, precoAnual: null,
            beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box Cabo (Qualidade 4K)"],
            observacoes: "Pacote Box Cabo. Preço MED (p.67). Desconto R$ 5,00 DCC."
        },
        {
            regiaoId: regiao, tipo: "TV", nome: "CLARO STREAMING HD TOP MULTI", precoMensal: 104.90, precoAnual: null,
            beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box Streaming", "Benefício Multi: ChatGPT Plus (se Multi)"],
            observacoes: "Pacote Box Streaming. Preço MED (p.67). Desconto R$ 5,00 DCC."
        },
        {
            regiaoId: regiao, tipo: "TV", nome: "CLARO STREAMING HD TOP", precoMensal: 134.90, precoAnual: null,
            beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box Streaming"],
            observacoes: "Pacote Box Streaming. Preço MED (p.67). Desconto R$ 5,00 DCC."
        }
    ]),

    // TV Área Não Cabeada (p.68)
    {
        regiaoId: "nacional", tipo: "TV", nome: "CLARO TV BOX ANUNCIO (Não Cabeada) MULTI", precoMensal: 124.90, precoAnual: null,
        beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box Streaming", "Benefício Multi: ChatGPT Plus (se Multi)"],
        observacoes: "Preço para ÁREA NÃO CABEADA COM MÓVEL (p.68). Desconto R$ 5,00 DCC."
    },
    {
        regiaoId: "nacional", tipo: "TV", nome: "CLARO TV BOX ANUNCIO (Não Cabeada) SINGLE", precoMensal: 134.90, precoAnual: null,
        beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box Streaming"],
        observacoes: "Preço para ÁREA NÃO CABEADA SINGLE COM FONE (p.68). Desconto R$ 5,00 DCC."
    },

    // TV App/Streamings (p.70)
    {
        regiaoId: "nacional", tipo: "TV", nome: "CLARO TV+ APP ANUAL", precoMensal: 99.90, precoAnual: 1198.80,
        beneficios: ["Mais de 120 canais ao vivo", "Netflix (Padrão com Anúncios)", "HBO Max (Básico com Anúncios)", "Apple TV+", "Disney+ (Padrão com Anúncios)", "Amazon Prime Video", "Amazon Music, Prime Gaming, Prime Reading e Frete Grátis", "Acesso por App (sem equipamento)", "Contratação 100% Digital (Cartão de Crédito)"],
        observacoes: "Pagamento anual (12x R$ 99,90). Não possui benefícios Multi."
    },
    {
        regiaoId: "nacional", tipo: "TV", nome: "CLARO TV+ APP MENSAL", precoMensal: 109.90, precoAnual: null,
        beneficios: ["Mais de 120 canais ao vivo", "Netflix (Padrão com Anúncios)", "HBO Max (Básico com Anúncios)", "Apple TV+", "Disney+ (Padrão com Anúncios)", "Amazon Prime Video", "Amazon Music, Prime Gaming, Prime Reading e Frete Grátis", "Acesso por App (sem equipamento)", "Contratação 100% Digital (Cartão de Crédito)"],
        observacoes: "Preço promocional R$ 65,40 por 2 meses. Não possui benefícios Multi."
    },
    {
        regiaoId: "nacional", tipo: "TV", nome: "CLARO TV+ STREAMINGS ANUAL", precoMensal: 69.90, precoAnual: 838.80,
        beneficios: ["NÃO inclui canais ao vivo", "Netflix (Padrão com Anúncios)", "HBO Max (Básico com Anúncios)", "Apple TV+", "Disney+ (Padrão com Anúncios)", "Amazon Prime Video", "Amazon Music, Prime Gaming, Prime Reading e Frete Grátis", "Acesso por App (sem equipamento)", "Contratação 100% Digital (Cartão de Crédito)"],
        observacoes: "Pagamento anual (12x R$ 69,90). Não possui benefícios Multi."
    },
    {
        regiaoId: "nacional", tipo: "TV", nome: "CLARO TV+ STREAMINGS MENSAL", precoMensal: 79.90, precoAnual: null,
        beneficios: ["NÃO inclui canais ao vivo", "Netflix (Padrão com Anúncios)", "HBO Max (Básico com Anúncios)", "Apple TV+", "Disney+ (Padrão com Anúncios)", "Amazon Prime Video", "Amazon Music, Prime Gaming, Prime Reading e Frete Grátis", "Acesso por App (sem equipamento)", "Contratação 100% Digital (Cartão de Crédito)"],
        observacoes: "Não possui benefícios Multi."
    },

    // TV Upgrade (p.71) - SEM DISNEY/AMAZON
    {
        regiaoId: "nacional", tipo: "TV", nome: "CLARO TV+ SOUNDBOX RENT ANUNCIO FID", precoMensal: 154.90, precoAnual: null,
        beneficios: [...beneficiosTVComboUpgrade, "Equipamento: Soundbox (Áudio Dolby Atmos)"],
        observacoes: "Preço de UPGRADE (p.71). SEM Disney/Amazon. Desconto R$ 5,00 DCC. Fidelidade 12m."
    },
    {
        regiaoId: "nacional", tipo: "TV", nome: "CTV+TOP HD 4K RENT ANUNCIO FID", precoMensal: 144.90, precoAnual: null,
        beneficios: [...beneficiosTVComboUpgrade, "Equipamento: Box Cabo (Qualidade 4K)"],
        observacoes: "Preço de UPGRADE (p.71). SEM Disney/Amazon. Desconto R$ 5,00 DCC. Fidelidade 12m."
    },
    {
        regiaoId: "nacional", tipo: "TV", nome: "CLARO STREAMING HD TOP RENT ANUNCIO FID", precoMensal: 104.90, precoAnual: null,
        beneficios: [...beneficiosTVComboUpgrade, "Equipamento: Box Streaming"],
        observacoes: "Preço de UPGRADE (p.71). SEM Disney/Amazon. Desconto R$ 5,00 DCC. Fidelidade 12m."
    },
    {
        regiaoId: "nacional", tipo: "TV", nome: "CTV+ TOP HD RET ANUNCIO FID", precoMensal: 124.90, precoAnual: null,
        beneficios: [...beneficiosTVComboUpgrade, "Equipamento: Decodificador HD"],
        observacoes: "Preço de UPGRADE (p.71). SEM Disney/Amazon. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: CTV+ TOP HD RET ANUNCIO FID"
    },
    // NOVOS PLANOS HD (RENTABILIZAÇÃO)
    {
        regiaoId: "nacional", tipo: "TV", nome: "INICIAL HD RET ANUNCIO FID (R$ 69,90)", precoMensal: 69.90, precoAnual: null,
        beneficios: ["Pacote Inicial HD (Canais Abertos/Cortesia)", "Globoplay Canais Incluso"],
        observacoes: "Preço de UPGRADE (p.71). SEM Disney/Amazon. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: INICIAL HD RET ANUNCIO FID"
    },
    {
        regiaoId: "nacional", tipo: "TV", nome: "INICIAL HD RET ANUNCIO TELECINE FID", precoMensal: 79.90, precoAnual: null,
        beneficios: ["Pacote Inicial HD", "Acesso aos canais Telecine", "Globoplay Canais Incluso"],
        observacoes: "Preço de UPGRADE (p.71). SEM Disney/Amazon. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: INICIAL HD RET ANUNCIO TELECINE FID"
    },
];

export default produtosTV;
