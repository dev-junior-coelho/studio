// data/seedOpcionais.ts (V11.0 - Preços e Regras Mantidas)

export const produtosOpcionais = [
    // --- PONTOS ADICIONAIS ---
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Ponto Ultra (Cabeado)",
        precoMensal: 150.00, precoAnual: null,
        beneficios: ["Cabo de rede passado pela tubulação interna", "Garante máxima velocidade no cômodo"],
        observacoes: "(p.72) Valor único de instalação (em 12x R$ 12,50 ou à vista)"
    },
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Ponto Adicional 4K",
        precoMensal: 34.90, precoAnual: null,
        beneficios: ["Ponto extra de TV 4K", "Acesso a todos os canais do pacote"],
        observacoes: "(p.76) Mensalidade"
    },
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Ponto Adicional Gravação",
        precoMensal: 24.90, precoAnual: null,
        beneficios: ["Ponto extra com Gravação", "Acesso ao DVR do pacote"],
        observacoes: "(p.76) Mensalidade"
    },
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Ponto Adicional HD",
        precoMensal: 19.90, precoAnual: null,
        beneficios: ["Ponto extra HD", "Acesso a todos os canais do pacote"],
        observacoes: "Mensalidade"
    },

    // --- SVAs DE STREAMING ---
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Netflix Padrão (Avulso)",
        precoMensal: 44.90, precoAnual: null,
        beneficios: ["Acesso ao Netflix Padrão", "2 telas simultâneas", "Sem anúncios"],
        observacoes: "SVA Avulso"
    },
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Netflix Premium (Avulso)",
        precoMensal: 59.90, precoAnual: null,
        beneficios: ["Acesso ao Netflix Premium", "4 telas simultâneas", "Qualidade 4K HDR", "Sem anúncios"],
        observacoes: "SVA Avulso"
    },
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Globoplay (Avulso)",
        precoMensal: 24.90, precoAnual: null,
        beneficios: ["Conteúdo Globo", "Canais ao vivo", "Séries e novelas"],
        observacoes: "SVA Avulso"
    },
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "HBO Max (Avulso)",
        precoMensal: 34.90, precoAnual: null,
        beneficios: ["Catálogo HBO", "Séries e filmes exclusivos", "2 telas simultâneas"],
        observacoes: "SVA Avulso"
    },
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Disney+ (Avulso)",
        precoMensal: 33.90, precoAnual: null,
        beneficios: ["Catálogo Disney, Marvel, Star Wars, Pixar", "4 telas simultâneas"],
        observacoes: "SVA Avulso"
    },
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Amazon Prime Video (Avulso)",
        precoMensal: 19.90, precoAnual: null,
        beneficios: ["Catálogo Amazon Prime Video", "Amazon Music incluso", "Frete grátis Amazon"],
        observacoes: "SVA Avulso"
    },

    // --- CANAIS E PACOTES DE TV ---
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Telecine (Mensal)",
        precoMensal: 29.90, precoAnual: null,
        beneficios: ["Catálogo Telecine", "6 canais de filmes", "Lançamentos de cinema"],
        observacoes: "SVA Avulso"
    },
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Telecine (Anual)",
        precoMensal: 19.90, precoAnual: 238.80,
        beneficios: ["Catálogo Telecine", "6 canais de filmes", "Lançamentos de cinema", "Pagamento anual em 12x"],
        observacoes: "Valor total R$ 238,80 (12x R$ 19,90)"
    },
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Premiere (Mensal)",
        precoMensal: 89.90, precoAnual: null,
        beneficios: ["Todos os jogos do Brasileirão", "Copa do Brasil", "Campeonatos Estaduais"],
        observacoes: "SVA Avulso"
    },
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Combate",
        precoMensal: 49.90, precoAnual: null,
        beneficios: ["UFC ao vivo", "Lutas exclusivas", "Eventos de MMA"],
        observacoes: "SVA Avulso"
    },
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Paramount+",
        precoMensal: 19.90, precoAnual: null,
        beneficios: ["Catálogo Paramount", "Séries e filmes exclusivos"],
        observacoes: "SVA Avulso"
    },
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Starzplay",
        precoMensal: 14.90, precoAnual: null,
        beneficios: ["Catálogo Starz", "Séries originais"],
        observacoes: "SVA Avulso"
    },

    // --- COMBO DE SVAs ---
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Combo Telecine + Universal+ (Mensal)",
        precoMensal: 34.90, precoAnual: null,
        beneficios: ["Catálogo Telecine", "Catálogo Universal+", "Economia no combo"],
        observacoes: "SVA Avulso"
    },
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Combo Telecine + Universal+ (Anual)",
        precoMensal: 24.90, precoAnual: 298.80,
        beneficios: ["Catálogo Telecine", "Catálogo Universal+", "Pagamento anual em 12x"],
        observacoes: "Valor total R$ 298,80"
    },

    // --- OUTROS SVAs ---
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Belas Artes",
        precoMensal: 12.90, precoAnual: null,
        beneficios: ["Catálogo Belas Artes", "Cinema de arte"],
        observacoes: "SVA Avulso"
    },
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Stingray Karaoke",
        precoMensal: 9.90, precoAnual: null,
        beneficios: ["Catálogo Stingray Karaoke", "Milhares de músicas"],
        observacoes: "SVA Avulso"
    },
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Adrenalina Pura",
        precoMensal: 14.90, precoAnual: null,
        beneficios: ["Catálogo Adrenalina Pura", "Filmes de Ação e Aventura"],
        observacoes: "SVA Avulso"
    },
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Claro Shows",
        precoMensal: 14.90, precoAnual: null,
        beneficios: ["Catálogo Claro Shows", "Shows e apresentações"],
        observacoes: "SVA Avulso"
    },

    // --- TELEFONE FIXO ---
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Fone Ilimitado Local",
        precoMensal: 49.90, precoAnual: null,
        beneficios: ["Ligações ilimitadas para fixos locais", "Identificador de chamadas"],
        observacoes: "Telefone fixo residencial"
    },
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Fone Ilimitado Brasil",
        precoMensal: 59.90, precoAnual: null,
        beneficios: ["Ligações ilimitadas para fixos e celulares do Brasil", "Identificador de chamadas"],
        observacoes: "Telefone fixo residencial"
    },

    // --- PROTEÇÃO E SEGURANÇA ---
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "McAfee Multi Access (5 dispositivos)",
        precoMensal: 14.90, precoAnual: null,
        beneficios: ["Antivírus para 5 dispositivos", "Proteção em tempo real", "VPN inclusa"],
        observacoes: "SVA Segurança"
    },
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Seguro Residencial Básico",
        precoMensal: 19.90, precoAnual: null,
        beneficios: ["Cobertura contra roubo", "Assistência 24h", "Chaveiro e eletricista"],
        observacoes: "Seguro"
    },

    // --- CANAIS ADULTOS ---
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Playboy TV",
        precoMensal: 19.90, precoAnual: null,
        beneficios: ["Canal Adulto"],
        observacoes: "Canal adulto. Verificação de idade necessária."
    },
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "For Man",
        precoMensal: 19.90, precoAnual: null,
        beneficios: ["Canal Adulto"],
        observacoes: "Canal adulto. Verificação de idade necessária."
    },
    {
        regiaoId: "nacional", tipo: "Opcional", nome: "Sexy Hot",
        precoMensal: 35.90, precoAnual: null,
        beneficios: ["Canal Adulto Premium"],
        observacoes: "Canal adulto. Verificação de idade necessária."
    },
];

export default produtosOpcionais;
