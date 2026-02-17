// data/seedTV.ts (V11.0 - Preços e Regras Mantidas)
// TIPOS CORRETOS: "TV Cabeada" para Cabo, "TV Box" para Streaming, "Claro TV APP" para App

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
    // ==========================================
    // TV CABEADA (p.65) - Região 'padrao' e 'especial'
    // ==========================================
    ...['padrao', 'especial'].flatMap(regiao => [
        {
            regiaoId: regiao, tipo: "TV Cabeada", nome: "Claro TV+ Soundbox (Cabo)", precoMensal: 154.90, precoAnual: null,
            beneficios: [
                "Assinatura inclusa: Netflix Padrão com Anúncios",
                "Assinatura inclusa: Globoplay Premium (Canais ao Vivo)",
                "Assinatura inclusa: HBO Max Básico com Anúncios",
                "Assinatura inclusa: Apple TV+",
                "Assinatura inclusa: Disney+ Padrão com Anúncios",
                "Assinatura inclusa: Amazon Prime",
                "Benefício Extra: 4 meses de ChatGPT Plus",
                "Equipamento Soundbox: Áudio Bang & Olufsen com Dolby Atmos",
                "Comando de voz com Alexa integrada",
                "Mais de 100 canais ao vivo",
                "Replay TV e Gravador na Nuvem"
            ],
            observacoes: "Pacote Soundbox Cabo. Preço COM BL E MÓVEL (p.65). Desconto de R$ 5,00 no DCC+Fatura Digital."
        },
        {
            regiaoId: regiao, tipo: "TV Cabeada", nome: "Claro TV+ Soundbox (Cabo) Single", precoMensal: 164.90, precoAnual: null,
            beneficios: [
                "Assinatura inclusa: Netflix Padrão com Anúncios",
                "Assinatura inclusa: Globoplay Premium (Canais ao Vivo)",
                "Assinatura inclusa: HBO Max Básico com Anúncios",
                "Assinatura inclusa: Apple TV+",
                "Assinatura inclusa: Disney+ Padrão com Anúncios",
                "Assinatura inclusa: Amazon Prime",
                "Equipamento Soundbox: Áudio Bang & Olufsen com Dolby Atmos",
                "Comando de voz com Alexa integrada",
                "Mais de 100 canais ao vivo",
                "Replay TV e Gravador na Nuvem"
            ],
            observacoes: "Pacote Soundbox Cabo. Preço COM BL OU MÓVEL ou SINGLE COM FONE (p.65). Desconto de R$ 5,00 no DCC+Fatura Digital."
        },
        {
            regiaoId: regiao, tipo: "TV Cabeada", nome: "Claro TV+ Box (Cabo)", precoMensal: 124.90, precoAnual: null,
            beneficios: [
                "Netflix: Plano Padrão com Anúncios (2 telas Full HD)",
                "Globoplay: Premium com Canais ao Vivo (5 telas simultâneas)",
                "Max (HBO): Plano Básico com Anúncios (2 telas Full HD)",
                "Apple TV+: Experiência Premium 4K HDR sem anúncios (5 telas)",
                "Disney+: Plano Padrão com Anúncios (2 telas Full HD)",
                "Amazon Prime: Vídeo, Música e Frete Grátis na Amazon",
                "Bônus Exclusivo: 4 meses de ChatGPT Plus incluso",
                "Imagem de Cinema: Tecnologia 4K HDR Ultra Definição",
                "Estabilidade Total: Conexão via Cabo (Não depende do Wi-Fi)",
                "Comando de Voz: Google Assistant no controle remoto",
                "Replay TV: Volte a programação em até 7 dias quando quiser"
            ],
            observacoes: "Pacote Box Cabo. Preço COM BL E MÓVEL (p.65). Desconto de R$ 5,00 no DCC+Fatura Digital."
        },
        {
            regiaoId: regiao, tipo: "TV Cabeada", nome: "Claro TV+ Box (Cabo) Single", precoMensal: 134.90, precoAnual: null,
            beneficios: [
                "Netflix: Plano Padrão com Anúncios (2 telas Full HD)",
                "Globoplay: Premium com Canais ao Vivo (5 telas simultâneas)",
                "Max (HBO): Plano Básico com Anúncios (2 telas Full HD)",
                "Apple TV+: Experiência Premium 4K HDR sem anúncios (5 telas)",
                "Disney+: Plano Padrão com Anúncios (2 telas Full HD)",
                "Amazon Prime: Vídeo, Música e Frete Grátis na Amazon",
                "Imagem de Cinema: Tecnologia 4K HDR Ultra Definição",
                "Estabilidade Total: Conexão via Cabo (Não depende do Wi-Fi)",
                "Comando de Voz: Google Assistant no controle remoto",
                "Replay TV: Volte a programação em até 7 dias quando quiser"
            ],
            observacoes: "Pacote Box Cabo. Preço SINGLE COM FONE (p.65). Desconto de R$ 5,00 no DCC+Fatura Digital."
        }
    ]),

    // ==========================================
    // TV BOX / STREAMING (p.66) - Região 'fibra-pura'
    // ==========================================
    {
        regiaoId: "fibra-pura", tipo: "TV Box", nome: "Claro TV+ Soundbox (Streaming)", precoMensal: 154.90, precoAnual: null,
        beneficios: [
            "Assinatura inclusa: Netflix Padrão com Anúncios",
            "Assinatura inclusa: Globoplay Premium (Canais ao Vivo)",
            "Assinatura inclusa: HBO Max Básico com Anúncios",
            "Assinatura inclusa: Apple TV+",
            "Assinatura inclusa: Disney+ Padrão com Anúncios",
            "Assinatura inclusa: Amazon Prime",
            "Benefício Extra: 4 meses de ChatGPT Plus",
            "Equipamento Soundbox: Áudio Bang & Olufsen com Dolby Atmos",
            "Comando de voz com Alexa integrada",
            "Mais de 100 canais ao vivo",
            "Replay TV e Gravador na Nuvem"
        ],
        observacoes: "Pacote Soundbox Streaming. Preço COM BL E MÓVEL (p.66). Desconto de R$ 5,00 no DCC+Fatura Digital."
    },
    {
        regiaoId: "fibra-pura", tipo: "TV Box", nome: "Claro TV+ Box (Streaming)", precoMensal: 124.90, precoAnual: null,
        beneficios: [
            "Assinatura inclusa: Netflix Padrão com Anúncios",
            "Assinatura inclusa: Globoplay Premium (Canais ao Vivo)",
            "Assinatura inclusa: HBO Max Básico com Anúncios",
            "Assinatura inclusa: Apple TV+",
            "Assinatura inclusa: Disney+ Padrão com Anúncios",
            "Assinatura inclusa: Amazon Prime",
            "Benefício Extra: 4 meses de ChatGPT Plus",
            "Box TV via Streaming (Auto instalação)",
            "Controle com comando de voz",
            "Mais de 100 canais ao vivo",
            "Replay TV e Gravador na Nuvem"
        ],
        observacoes: "Pacote Box Streaming. Preço COM BL E MÓVEL (p.66). Desconto de R$ 5,00 no DCC+Fatura Digital."
    },
    {
        regiaoId: "fibra-pura", tipo: "TV Box", nome: "Claro TV+ Box (Streaming) Single", precoMensal: 134.90, precoAnual: null,
        beneficios: [
            "Assinatura inclusa: Netflix Padrão com Anúncios",
            "Assinatura inclusa: Globoplay Premium (Canais ao Vivo)",
            "Assinatura inclusa: HBO Max Básico com Anúncios",
            "Assinatura inclusa: Apple TV+",
            "Assinatura inclusa: Disney+ Padrão com Anúncios",
            "Assinatura inclusa: Amazon Prime",
            "Box TV via Streaming (Auto instalação)",
            "Controle com comando de voz",
            "Mais de 100 canais ao vivo",
            "Replay TV e Gravador na Nuvem"
        ],
        observacoes: "Pacote Box Streaming. Preço SINGLE COM FONE (p.66). Desconto de R$ 5,00 no DCC+Fatura Digital."
    },

    // ==========================================
    // TV MED (p.67) - Todas as outras regiões (Cabeada e Streaming)
    // ==========================================
    ...['med-01', 'med-02', 'med-03', 'especial-promo-6m', 'especial-promo-3m', 'especial-plus', 'especial-plus-promo-6m', 'especial-plus-promo-3-6m', 'especial-plus-promo-3m', 'especial-plus-promo-3m-b', 'med-redes-neutras-02'].flatMap(regiao => [
        // TV Cabeada
        {
            regiaoId: regiao, tipo: "TV Cabeada", nome: "Claro TV+ Soundbox (Cabo)", precoMensal: 154.90, precoAnual: null,
            beneficios: [
                "Assinatura inclusa: Netflix Padrão com Anúncios",
                "Assinatura inclusa: Globoplay Premium (Canais ao Vivo)",
                "Assinatura inclusa: HBO Max Básico com Anúncios",
                "Assinatura inclusa: Apple TV+",
                "Assinatura inclusa: Disney+ Padrão com Anúncios",
                "Assinatura inclusa: Amazon Prime",
                "Benefício Extra: 4 meses de ChatGPT Plus",
                "Equipamento Soundbox: Áudio Bang & Olufsen com Dolby Atmos",
                "Comando de voz com Alexa integrada",
                "Mais de 100 canais ao vivo",
                "Replay TV e Gravador na Nuvem"
            ],
            observacoes: "Pacote Soundbox Cabo. Preço MED (p.67). Desconto R$ 5,00 DCC."
        },
        {
            regiaoId: regiao, tipo: "TV Cabeada", nome: "Claro TV+ Soundbox (Cabo) Single", precoMensal: 164.90, precoAnual: null,
            beneficios: [
                "Assinatura inclusa: Netflix Padrão com Anúncios",
                "Assinatura inclusa: Globoplay Premium (Canais ao Vivo)",
                "Assinatura inclusa: HBO Max Básico com Anúncios",
                "Assinatura inclusa: Apple TV+",
                "Assinatura inclusa: Disney+ Padrão com Anúncios",
                "Assinatura inclusa: Amazon Prime",
                "Equipamento Soundbox: Áudio Bang & Olufsen com Dolby Atmos",
                "Comando de voz com Alexa integrada",
                "Mais de 100 canais ao vivo",
                "Replay TV e Gravador na Nuvem"
            ],
            observacoes: "Pacote Soundbox Cabo. Preço MED (p.67). Desconto R$ 5,00 DCC."
        },
        {
            regiaoId: regiao, tipo: "TV Cabeada", nome: "Claro TV+ Box (Cabo)", precoMensal: 124.90, precoAnual: null,
            beneficios: [
                "Assinatura inclusa: Netflix Padrão com Anúncios",
                "Assinatura inclusa: Globoplay Premium (Canais ao Vivo)",
                "Assinatura inclusa: HBO Max Básico com Anúncios",
                "Assinatura inclusa: Apple TV+",
                "Assinatura inclusa: Disney+ Padrão com Anúncios",
                "Assinatura inclusa: Amazon Prime",
                "Benefício Extra: 4 meses de ChatGPT Plus",
                "Qualidade 4K HDR",
                "Controle com comando de voz",
                "Mais de 100 canais ao vivo",
                "Replay TV e Gravador na Nuvem"
            ],
            observacoes: "Pacote Box Cabo. Preço MED (p.67). Desconto R$ 5,00 DCC."
        },
        {
            regiaoId: regiao, tipo: "TV Cabeada", nome: "Claro TV+ Box (Cabo) Single", precoMensal: 134.90, precoAnual: null,
            beneficios: [
                "Assinatura inclusa: Netflix Padrão com Anúncios",
                "Assinatura inclusa: Globoplay Premium (Canais ao Vivo)",
                "Assinatura inclusa: HBO Max Básico com Anúncios",
                "Assinatura inclusa: Apple TV+",
                "Assinatura inclusa: Disney+ Padrão com Anúncios",
                "Assinatura inclusa: Amazon Prime",
                "Qualidade 4K HDR",
                "Controle com comando de voz",
                "Mais de 100 canais ao vivo",
                "Replay TV e Gravador na Nuvem"
            ],
            observacoes: "Pacote Box Cabo. Preço MED (p.67). Desconto R$ 5,00 DCC."
        },
        // TV Box / Streaming
        {
            regiaoId: regiao, tipo: "TV Box", nome: "Claro TV+ Soundbox (Streaming)", precoMensal: 154.90, precoAnual: null,
            beneficios: [
                "Assinatura inclusa: Netflix Padrão com Anúncios",
                "Assinatura inclusa: Globoplay Premium (Canais ao Vivo)",
                "Assinatura inclusa: HBO Max Básico com Anúncios",
                "Assinatura inclusa: Apple TV+",
                "Assinatura inclusa: Disney+ Padrão com Anúncios",
                "Assinatura inclusa: Amazon Prime",
                "Benefício Extra: 4 meses de ChatGPT Plus",
                "Equipamento Soundbox: Áudio Bang & Olufsen com Dolby Atmos",
                "Comando de voz com Alexa integrada",
                "Mais de 100 canais ao vivo",
                "Replay TV e Gravador na Nuvem"
            ],
            observacoes: "Pacote Soundbox Streaming. Preço MED (p.67). Desconto R$ 5,00 DCC."
        },
        {
            regiaoId: regiao, tipo: "TV Box", nome: "Claro TV+ Box (Streaming)", precoMensal: 124.90, precoAnual: null,
            beneficios: [
                "Netflix: Plano Padrão com Anúncios (2 telas Full HD)",
                "Globoplay: Premium com Canais ao Vivo (5 telas simultâneas)",
                "Max (HBO): Plano Básico com Anúncios (2 telas Full HD)",
                "Apple TV+: Experiência Premium 4K HDR sem anúncios (5 telas)",
                "Disney+: Plano Padrão com Anúncios (2 telas Full HD)",
                "Amazon Prime: Vídeo, Música e Frete Grátis na Amazon",
                "Bônus Exclusivo: 4 meses de ChatGPT Plus incluso",
                "Liberdade Total: Leve seu Box para qualquer lugar ou viagem",
                "Praticidade: Instalação Plug & Play (Só ligar e usar)",
                "Smart TV: Transforme sua TV antiga em uma Android TV moderna",
                "Comando de Voz: Google Assistant no controle remoto"
            ],
            observacoes: "Pacote Box Streaming. Preço MED (p.67). Desconto R$ 5,00 DCC."
        },
        {
            regiaoId: regiao, tipo: "TV Box", nome: "Claro TV+ Box (Streaming) Single", precoMensal: 134.90, precoAnual: null,
            beneficios: [
                "Netflix: Plano Padrão com Anúncios (2 telas Full HD)",
                "Globoplay: Premium com Canais ao Vivo (5 telas simultâneas)",
                "Max (HBO): Plano Básico com Anúncios (2 telas Full HD)",
                "Apple TV+: Experiência Premium 4K HDR sem anúncios (5 telas)",
                "Disney+: Plano Padrão com Anúncios (2 telas Full HD)",
                "Amazon Prime: Vídeo, Música e Frete Grátis na Amazon",
                "Liberdade Total: Leve seu Box para qualquer lugar ou viagem",
                "Praticidade: Instalação Plug & Play (Só ligar e usar)",
                "Smart TV: Transforme sua TV antiga em uma Android TV moderna",
                "Comando de Voz: Google Assistant no controle remoto"
            ],
            observacoes: "Pacote Box Streaming. Preço MED (p.67). Desconto R$ 5,00 DCC."
        }
    ]),

    // ==========================================
    // TV BOX - Área Não Cabeada (p.68)
    // ==========================================
    {
        regiaoId: "nacional", tipo: "TV Box", nome: "Claro TV+ Box (Streaming)", precoMensal: 124.90, precoAnual: null,
        beneficios: [
            "Assinatura inclusa: Netflix Padrão com Anúncios",
            "Assinatura inclusa: Globoplay Premium (Canais ao Vivo)",
            "Assinatura inclusa: HBO Max Básico com Anúncios",
            "Assinatura inclusa: Apple TV+",
            "Assinatura inclusa: Disney+ Padrão com Anúncios",
            "Assinatura inclusa: Amazon Prime",
            "Benefício Extra: 4 meses de ChatGPT Plus",
            "Box TV via Streaming (Auto instalação)",
            "Controle com comando de voz",
            "Mais de 100 canais ao vivo",
            "Replay TV e Gravador na Nuvem"
        ],
        observacoes: "Preço para ÁREA NÃO CABEADA COM MÓVEL (p.68). Desconto R$ 5,00 DCC."
    },
    {
        regiaoId: "nacional", tipo: "TV Box", nome: "Claro TV+ Box (Streaming) Single", precoMensal: 134.90, precoAnual: null,
        beneficios: [
            "Assinatura inclusa: Netflix Padrão com Anúncios",
            "Assinatura inclusa: Globoplay Premium (Canais ao Vivo)",
            "Assinatura inclusa: HBO Max Básico com Anúncios",
            "Assinatura inclusa: Apple TV+",
            "Assinatura inclusa: Disney+ Padrão com Anúncios",
            "Assinatura inclusa: Amazon Prime",
            "Box TV via Streaming (Auto instalação)",
            "Controle com comando de voz",
            "Mais de 100 canais ao vivo",
            "Replay TV e Gravador na Nuvem"
        ],
        observacoes: "Preço para ÁREA NÃO CABEADA SINGLE COM FONE (p.68). Desconto R$ 5,00 DCC."
    },

    // ==========================================
    // CLARO TV APP (p.70)
    // ==========================================
    {
        regiaoId: "nacional", tipo: "Claro TV APP", nome: "CLARO TV+ APP ANUAL", precoMensal: 99.90, precoAnual: 1198.80,
        beneficios: [
            "Mais de 120 canais ao vivo",
            "Netflix: Plano Padrão com Anúncios (2 telas Full HD)",
            "Max (HBO): Plano Básico com Anúncios (2 telas Full HD)",
            "Apple TV+: Experiência Premium 4K HDR sem anúncios (5 telas)",
            "Disney+: Plano Padrão com Anúncios (2 telas Full HD)",
            "Amazon Prime: Vídeo, Música e Frete Grátis na Amazon",
            "Acesso por App (sem equipamento)",
            "Contratação 100% Digital (Cartão de Crédito)"
        ],
        observacoes: "Pagamento anual (12x R$ 99,90). Não possui benefícios Multi."
    },
    {
        regiaoId: "nacional", tipo: "Claro TV APP", nome: "CLARO TV+ APP MENSAL", precoMensal: 109.90, precoAnual: null,
        beneficios: [
            "Mais de 120 canais ao vivo",
            "Netflix: Plano Padrão com Anúncios (2 telas Full HD)",
            "Max (HBO): Plano Básico com Anúncios (2 telas Full HD)",
            "Apple TV+: Experiência Premium 4K HDR sem anúncios (5 telas)",
            "Disney+: Plano Padrão com Anúncios (2 telas Full HD)",
            "Amazon Prime: Vídeo, Música e Frete Grátis na Amazon",
            "Acesso por App (sem equipamento)",
            "Contratação 100% Digital (Cartão de Crédito)"
        ],
        observacoes: "Preço promocional R$ 65,40 por 2 meses. Não possui benefícios Multi."
    },
    {
        regiaoId: "nacional", tipo: "Claro TV APP", nome: "CLARO TV+ STREAMINGS ANUAL", precoMensal: 69.90, precoAnual: 838.80,
        beneficios: [
            "NÃO inclui canais ao vivo",
            "Netflix: Plano Padrão com Anúncios (2 telas Full HD)",
            "Max (HBO): Plano Básico com Anúncios (2 telas Full HD)",
            "Apple TV+: Experiência Premium 4K HDR sem anúncios (5 telas)",
            "Disney+: Plano Padrão com Anúncios (2 telas Full HD)",
            "Amazon Prime: Vídeo, Música e Frete Grátis na Amazon",
            "Acesso por App (sem equipamento)",
            "Contratação 100% Digital (Cartão de Crédito)"
        ],
        observacoes: "Pagamento anual (12x R$ 69,90). Não possui benefícios Multi."
    },
    {
        regiaoId: "nacional", tipo: "Claro TV APP", nome: "CLARO TV+ STREAMINGS MENSAL", precoMensal: 79.90, precoAnual: null,
        beneficios: [
            "NÃO inclui canais ao vivo",
            "Netflix: Plano Padrão com Anúncios (2 telas Full HD)",
            "Max (HBO): Plano Básico com Anúncios (2 telas Full HD)",
            "Apple TV+: Experiência Premium 4K HDR sem anúncios (5 telas)",
            "Disney+: Plano Padrão com Anúncios (2 telas Full HD)",
            "Amazon Prime: Vídeo, Música e Frete Grátis na Amazon",
            "Acesso por App (sem equipamento)",
            "Contratação 100% Digital (Cartão de Crédito)"
        ],
        observacoes: "Não possui benefícios Multi."
    },

    // ==========================================
    // TV CABEADA - Upgrade/Rentabilização Antigos (REMOVIDOS PARA FOCAR NO 6S)
    // ==========================================
    // (Planos removidos: Clientes devem migrar para 6S ou Inicial HD)

    // ==========================================
    // TV CABEADA - Upgrade/Rentabilização - Opções de Entrada
    // ==========================================
    {
        regiaoId: "nacional", tipo: "TV Cabeada", nome: "INICIAL HD RET Claro TV+ HD 6S", precoMensal: 79.90, precoAnual: null,
        beneficios: [
            "Pacote Claro TV+ HD 6S",
            "6 Streamings inclusos",
            "Globoplay Canais Incluso",
            "Mais de 100 canais HD"
        ],
        observacoes: "Preço de UPGRADE (p.71). Desconto R$ 5,00 DCC. Fidelidade 12m."
    },

    // ==========================================
    // RENTABILIZAÇÃO - UPGRADE DE TV (6S) - 6 STREAMINGS
    // (Reclassificados para TV Cabeada e TV Box)
    // ==========================================
    {
        regiaoId: "nacional", tipo: "TV Cabeada", nome: "Claro TV+ Soundbox 6S (Cabo)", precoMensal: 149.90, precoAnual: null,
        beneficios: [
            "Netflix: Plano Padrão com Anúncios (2 telas Full HD)",
            "Globoplay: Premium com Canais ao Vivo (5 telas simultâneas)",
            "Max (HBO): Plano Básico com Anúncios (2 telas Full HD)",
            "Apple TV+: Experiência Premium 4K HDR sem anúncios (5 telas)",
            "Disney+: Plano Padrão com Anúncios (2 telas Full HD)",
            "Amazon Prime: Vídeo, Música e Frete Grátis na Amazon",
            "Equipamento Soundbox: Áudio com Dolby Atmos",
            "Estabilidade Master: Sinal via Cabo 100% livre de delay",
            "Comando de voz com Alexa",
            "Canais ao vivo inclusos"
        ],
        observacoes: "Proc: CTV+ TOP HD 4K SOUND 6S RENT FID. Desc R$ 5,00 DCC."
    },
    {
        regiaoId: "nacional", tipo: "TV Box", nome: "Claro TV+ Soundbox 6S (Streaming)", precoMensal: 149.90, precoAnual: null,
        beneficios: [
            "Netflix: Plano Padrão com Anúncios (2 telas Full HD)",
            "Globoplay: Premium com Canais ao Vivo (5 telas simultâneas)",
            "Max (HBO): Plano Básico com Anúncios (2 telas Full HD)",
            "Apple TV+: Experiência Premium 4K HDR sem anúncios (5 telas)",
            "Disney+: Plano Padrão com Anúncios (2 telas Full HD)",
            "Amazon Prime: Vídeo, Música e Frete Grátis na Amazon",
            "Equipamento Soundbox: Áudio com Dolby Atmos",
            "Comando de voz com Alexa",
            "Canais ao vivo inclusos"
        ],
        observacoes: "Proc: CLARO STREAMING HD TOP SOUND 6S RENT FID. Desc R$ 5,00 DCC."
    },
    {
        regiaoId: "nacional", tipo: "TV Cabeada", nome: "Claro TV+ Box Cabo 6S", precoMensal: 129.90, precoAnual: null,
        beneficios: [
            "Netflix: Plano Padrão com Anúncios (2 telas Full HD)",
            "Globoplay: Premium com Canais ao Vivo (5 telas simultâneas)",
            "Max (HBO): Plano Básico com Anúncios (2 telas Full HD)",
            "Apple TV+: Experiência Premium 4K HDR sem anúncios (5 telas)",
            "Disney+: Plano Padrão com Anúncios (2 telas Full HD)",
            "Amazon Prime: Vídeo, Música e Frete Grátis na Amazon",
            "Box 4K Cabo: Qualidade de Cinema com Instalação Especializada",
            "Estabilidade Master: Sinal via Cabo 100% livre de delay",
            "Comando de Voz Completo: Alexa e Google Assistant no controle"
        ],
        observacoes: "Proc: CTV+ TOP HD 4K 6S RENT FID. Desc R$ 5,00 DCC."
    },
    {
        regiaoId: "nacional", tipo: "TV Box", nome: "Claro TV+ Box Streaming 6S", precoMensal: 124.90, precoAnual: null,
        beneficios: [
            "Netflix: Plano Padrão com Anúncios (2 telas Full HD)",
            "Globoplay: Premium com Canais ao Vivo (5 telas simultâneas)",
            "Max (HBO): Plano Básico com Anúncios (2 telas Full HD)",
            "Apple TV+: Experiência Premium 4K HDR sem anúncios (5 telas)",
            "Disney+: Plano Padrão com Anúncios (2 telas Full HD)",
            "Amazon Prime: Vídeo, Música e Frete Grátis na Amazon",
            "Liberdade 6S: Box Streaming Portátil para levar onde quiser",
            "Instalação Instantânea: Plug & Play via Wi-Fi",
            "Comando de Voz Completo: Alexa e Google Assistant no controle"
        ],
        observacoes: "Proc: CLARO STREAMING HD TOP 6S RENT FID. Desc R$ 5,00 DCC."
    },
    {
        regiaoId: "nacional", tipo: "TV Cabeada", nome: "Claro TV+ HD 6S", precoMensal: 114.90, precoAnual: null,
        beneficios: [
            "Netflix: Plano Padrão com Anúncios (2 telas Full HD)",
            "Globoplay: Premium com Canais ao Vivo (5 telas simultâneas)",
            "Max (HBO): Plano Básico com Anúncios (2 telas Full HD)",
            "Apple TV+: Experiência Premium 4K HDR sem anúncios (5 telas)",
            "Disney+: Plano Padrão com Anúncios (2 telas Full HD)",
            "Amazon Prime: Vídeo, Música e Frete Grátis na Amazon",
            "Equipamento HD Convencional",
            "Estabilidade Total: Conexão via Cabo sem delay",
            "Canais ao vivo inclusos"
        ],
        observacoes: "Proc: CTV+ TOP HD 6S RENT FID. Desc R$ 5,00 DCC."
    },
];

export default produtosTV;
