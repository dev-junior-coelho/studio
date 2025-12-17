// data/seedOpcionais.ts (V11.0 - Preços e Regras Mantidas)
// TIPOS CORRETOS: "Fixo", "Ponto Adicional", "Opcional"

export const produtosOpcionais = [
    // ==========================================
    // FONE FIXO (p.81)
    // ==========================================
    {
        regiaoId: "nacional", tipo: "Fixo", nome: "FIXO ILIMITADO MUNDO FIBRA COM VAS", precoMensal: 35.00, precoAnual: null,
        beneficios: [
            "Ligações Nacionais Ilimitadas (Fixo e Celular de qualquer operadora)",
            "Ligações Ilimitadas para Celulares dos EUA",
            "Ligações Ilimitadas para Fixos de 35 países (lista completa de países)"
        ],
        observacoes: "Preço na combinação FONE+BL+TV ou FONE+BL+MOVEL. Equivalente ao 'FIXO ILIMITADO MUNDO CABO COM VAS'. Procedimento: FIXO ILIMITADO MUNDO FIBRA COM VAS"
    },
    {
        regiaoId: "nacional", tipo: "Fixo", nome: "FIXO ILIMITADO MUNDO FIBRA SEM VAS", precoMensal: 65.00, precoAnual: null,
        beneficios: [
            "Ligações Nacionais Ilimitadas (Fixo e Celular de qualquer operadora)",
            "Ligações Ilimitadas para Celulares dos EUA",
            "Ligações Ilimitadas para Fixos de 35 países (lista completa de países)"
        ],
        observacoes: "Preço Single ou em combos 2P (ex: Fone+TV). Equivalente ao 'FIXO ILIMITADO MUNDO CABO SEM VAS'. Procedimento: FIXO ILIMITADO MUNDO CABO SEM VAS"
    },
    {
        regiaoId: "nacional", tipo: "Fixo", nome: "FIXO ILIMITADO BRASIL FIBRA MULTI", precoMensal: 5.00, precoAnual: null,
        beneficios: ["Ligações Nacionais Ilimitadas (Fixo e Celular de qualquer operadora)"],
        observacoes: "Preço na combinação FONE+BL+MOVEL+TV. Procedimento: FIXO ILIMITADO BRASIL FIBRA MULTI"
    },
    {
        regiaoId: "nacional", tipo: "Fixo", nome: "FIXO ILIMITADO BRASIL FIBRA COM VAS", precoMensal: 35.00, precoAnual: null,
        beneficios: ["Ligações Nacionais Ilimitadas (Fixo e Celular de qualquer operadora)"],
        observacoes: "Preço em qualquer combinação que não seja 4P. Procedimento: FIXO ILIMITADO BRASIL FIBRA COM VAS"
    },

    // ==========================================
    // PONTOS ADICIONAIS - AQUISIÇÃO (p.72)
    // ==========================================
    {
        regiaoId: "nacional", tipo: "Ponto Adicional", nome: "Ponto Adicional - Soundbox Cabo (R$ 99,90)",
        precoMensal: 99.90, precoAnual: null,
        beneficios: ["Aluguel de 1 equipamento Soundbox (Cabo) adicional", "Máximo de 2 pontos por contrato"],
        observacoes: "Valor de aluguel mensal. Para planos de Aquisição (p.72)."
    },
    {
        regiaoId: "nacional", tipo: "Ponto Adicional", nome: "Ponto Adicional - Soundbox Streaming (R$ 99,90)",
        precoMensal: 99.90, precoAnual: null,
        beneficios: ["Aluguel de 1 equipamento Soundbox (Streaming) adicional", "Máximo de 2 pontos por contrato"],
        observacoes: "Valor de aluguel mensal. Para planos de Aquisição (p.72)."
    },
    {
        regiaoId: "nacional", tipo: "Ponto Adicional", nome: "Ponto Adicional - Box Cabo (R$ 69,90)",
        precoMensal: 69.90, precoAnual: null,
        beneficios: ["Aluguel de 1 equipamento Box Cabo adicional", "Máximo de 4 pontos por contrato"],
        observacoes: "Valor de aluguel mensal. Para planos de Aquisição (p.72)."
    },
    {
        regiaoId: "nacional", tipo: "Ponto Adicional", nome: "Ponto Adicional - Box Streaming (R$ 69,90)",
        precoMensal: 69.90, precoAnual: null,
        beneficios: ["Aluguel de 1 equipamento Box (Streaming) adicional", "Máximo de 2 pontos por contrato"],
        observacoes: "Valor de aluguel mensal. Para planos de Aquisição (p.72)."
    },

    // ==========================================
    // PONTOS ADICIONAIS - UPGRADE/RENTABILIZAÇÃO (p.71)
    // ==========================================
    {
        regiaoId: "nacional", tipo: "Ponto Adicional", nome: "Ponto Adicional - Soundbox (Upgrade R$ 69,90)",
        precoMensal: 69.90, precoAnual: null,
        beneficios: ["Aluguel de 1 equipamento Soundbox adicional"],
        observacoes: "Valor de aluguel mensal. Para planos de Upgrade (p.71)."
    },
    {
        regiaoId: "nacional", tipo: "Ponto Adicional", nome: "Ponto Adicional - Box Cabo (Upgrade R$ 39,90)",
        precoMensal: 39.90, precoAnual: null,
        beneficios: ["Aluguel de 1 equipamento Box Cabo adicional"],
        observacoes: "Valor de aluguel mensal. Para planos de Upgrade (p.71)."
    },
    {
        regiaoId: "nacional", tipo: "Ponto Adicional", nome: "Ponto Adicional - Box Streaming (Upgrade R$ 39,90)",
        precoMensal: 39.90, precoAnual: null,
        beneficios: ["Aluguel de 1 equipamento Box (Streaming) adicional"],
        observacoes: "Valor de aluguel mensal. Para planos de Upgrade (p.71)."
    },
    {
        regiaoId: "nacional", tipo: "Ponto Adicional", nome: "Ponto Adicional - HD (Upgrade TOP HD R$ 25,00)",
        precoMensal: 25.00, precoAnual: null,
        beneficios: ["Aluguel de 1 equipamento HD adicional"],
        observacoes: "Valor de aluguel mensal. Para plano Upgrade TOP HD (p.71)."
    },
    {
        regiaoId: "nacional", tipo: "Ponto Adicional", nome: "Ponto Adicional - HD (Upgrade INICIAL R$ 10,00)",
        precoMensal: 10.00, precoAnual: null,
        beneficios: ["Aluguel de 1 equipamento HD adicional"],
        observacoes: "Valor de aluguel mensal. Para plano Upgrade INICIAL HD."
    },
    {
        regiaoId: "nacional", tipo: "Ponto Adicional", nome: "Ponto Adicional - HD (Upgrade INICIAL TELECINE R$ 25,00)",
        precoMensal: 25.00, precoAnual: null,
        beneficios: ["Aluguel de 1 equipamento HD adicional"],
        observacoes: "Valor de aluguel mensal. Para plano Upgrade INICIAL TELECINE."
    },

    // ==========================================
    // CONECTIVIDADE E GAMING (p.46)
    // ==========================================
    { regiaoId: "nacional", tipo: "Opcional", nome: "Ponto Ultra", precoMensal: null, precoAnual: null, beneficios: ["Solução de conectividade Wi-Fi", "Melhora alcance do sinal"], observacoes: "Taxa única de R$ 150,00 (em até 3x)." },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Claro Geek", precoMensal: 9.90, precoAnual: 118.80, beneficios: ["Suporte técnico especializado para dispositivos"], observacoes: "Fidelidade 12 meses. Multa R$ 59,40 proporcional." },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Geforce NOW (Avulso)", precoMensal: 63.90, precoAnual: null, beneficios: ["Plataforma de streaming de jogos na nuvem"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Abya Go", precoMensal: 25.90, precoAnual: null, beneficios: ["Plataforma de streaming de jogos"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "No Ping", precoMensal: 10.00, precoAnual: null, beneficios: ["Redutor de latência (ping) para jogos online"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Claro SmartHome (1 Câmera)", precoMensal: 29.90, precoAnual: 358.80, beneficios: ["Monitoramento com 1 Câmera HD Wi-Fi (interna)", "Equipamento em comodato"], observacoes: "Fidelidade 12 meses. Multa R$ 500,00 proporcional." },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Extensor Wi-Fi Mesh (Comodato)", precoMensal: 30.00, precoAnual: 360.00, beneficios: ["Kit com 2 extensores para melhorar o sinal Wi-Fi"], observacoes: "Fidelidade 12 meses. Multa R$ 300,00 por extensor." },

    // ==========================================
    // A LA CARTE - STREAMING (p.47-48, 73-78)
    // ==========================================
    { regiaoId: "nacional", tipo: "Opcional", nome: "Amazon Prime (Mensal)", precoMensal: 19.90, precoAnual: null, beneficios: ["Amazon Prime Video", "Amazon Music", "Prime Gaming", "Prime Reading", "Frete Grátis Amazon"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Apple TV+ (Mensal)", precoMensal: 21.90, precoAnual: null, beneficios: ["Catálogo Apple TV+", "5 acessos", "4K HDR", "Sem anúncios"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Crunchyroll Fan (Mensal)", precoMensal: 14.99, precoAnual: null, beneficios: ["Catálogo de animes Crunchyroll"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Disney+ Padrão (Mensal)", precoMensal: 46.90, precoAnual: null, beneficios: ["Catálogo Disney+ Padrão com anúncios"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Disney+ Premium (Mensal)", precoMensal: 66.90, precoAnual: null, beneficios: ["Catálogo Disney+ Premium sem anúncios"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Disney+ Premium (Anual)", precoMensal: 46.91, precoAnual: 562.90, beneficios: ["Catálogo Disney+ Premium sem anúncios", "Pagamento anual em 12x"], observacoes: "Valor total R$ 562,90" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Max (HBO) com Anúncios (Mensal)", precoMensal: 29.90, precoAnual: null, beneficios: ["Catálogo HBO Max com anúncios"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Max (HBO) com Anúncios (Anual)", precoMensal: 18.90, precoAnual: 226.80, beneficios: ["Catálogo HBO Max com anúncios", "Pagamento anual em 12x"], observacoes: "Valor total R$ 226,80" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Max (HBO) Sem Anúncios (Mensal)", precoMensal: 39.90, precoAnual: null, beneficios: ["Catálogo HBO Max sem anúncios"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Max (HBO) Sem Anúncios (Anual)", precoMensal: 29.90, precoAnual: 358.80, beneficios: ["Catálogo HBO Max sem anúncios", "Pagamento anual em 12x"], observacoes: "Valor total R$ 358,80" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Paramount+ (Mensal)", precoMensal: 27.90, precoAnual: null, beneficios: ["Catálogo Paramount+"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Paramount+ (Anual)", precoMensal: 20.83, precoAnual: 249.90, beneficios: ["Catálogo Paramount+", "Pagamento anual em 12x"], observacoes: "Valor total R$ 249,90" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Premiere Futebol (Mensal)", precoMensal: 59.90, precoAnual: null, beneficios: ["Acesso aos canais Premiere"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Premiere Futebol (Anual)", precoMensal: 29.90, precoAnual: 358.80, beneficios: ["Acesso aos canais Premiere", "Pagamento anual em 12x"], observacoes: "Valor total R$ 358,80" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Combo Telecine e Universal+ (Mensal)", precoMensal: 34.90, precoAnual: null, beneficios: ["Catálogo Telecine", "Catálogo Universal+"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Combo Telecine e Universal+ (Anual)", precoMensal: 24.90, precoAnual: 298.80, beneficios: ["Catálogo Telecine", "Catálogo Universal+", "Pagamento anual em 12x"], observacoes: "Valor total R$ 298,80" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Telecine (Mensal)", precoMensal: 29.90, precoAnual: null, beneficios: ["Catálogo Telecine"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Telecine (Anual)", precoMensal: 19.90, precoAnual: 238.80, beneficios: ["Catálogo Telecine", "Pagamento anual em 12x"], observacoes: "Valor total R$ 238,80" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Netflix com Anúncios (Avulso)", precoMensal: 20.90, precoAnual: null, beneficios: ["Acesso ao Netflix com anúncios"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Netflix Padrão (Avulso)", precoMensal: 44.90, precoAnual: null, beneficios: ["Acesso ao Netflix Padrão", "2 telas simultâneas", "Sem anúncios"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Netflix Premium (Avulso)", precoMensal: 59.90, precoAnual: null, beneficios: ["Acesso ao Netflix Premium", "4 telas simultâneas", "Qualidade 4K HDR", "Sem anúncios"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Belas Artes", precoMensal: 12.90, precoAnual: null, beneficios: ["Catálogo Belas Artes"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Brasiliana", precoMensal: 9.90, precoAnual: null, beneficios: ["Catálogo Brasiliana"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Darkflix", precoMensal: 9.90, precoAnual: null, beneficios: ["Catálogo Darkflix (Foco em terror)"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Edye", precoMensal: 10.90, precoAnual: null, beneficios: ["Catálogo Edye (Infantil)"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Eduk", precoMensal: 14.90, precoAnual: null, beneficios: ["Catálogo Eduk (Cursos)"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Fi TV", precoMensal: 29.00, precoAnual: null, beneficios: ["Catálogo Fi TV"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Porta Curtas", precoMensal: 6.90, precoAnual: null, beneficios: ["Catálogo Porta Curtas"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Reaw Play", precoMensal: 19.90, precoAnual: null, beneficios: ["Catálogo Reaw Play"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Universal Plus", precoMensal: 29.90, precoAnual: null, beneficios: ["Catálogo Universal+"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Box Brazil Play", precoMensal: 14.90, precoAnual: null, beneficios: ["Catálogo Box Brazil Play"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Cine Brasil", precoMensal: 6.90, precoAnual: null, beneficios: ["Catálogo Cine Brasil"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Cindie", precoMensal: 12.90, precoAnual: null, beneficios: ["Catálogo Cindie"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Looke", precoMensal: 16.90, precoAnual: null, beneficios: ["Catálogo Looke"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Looke Kids", precoMensal: 12.90, precoAnual: null, beneficios: ["Catálogo Looke Kids"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Lumine", precoMensal: 32.90, precoAnual: null, beneficios: ["Catálogo Lumine (Conteúdo Católico)"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Medialand Play", precoMensal: 7.90, precoAnual: null, beneficios: ["Catálogo Medialand Play"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Mundus Play", precoMensal: 18.90, precoAnual: null, beneficios: ["Catálogo Mundus Play"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Sportynet+", precoMensal: 29.90, precoAnual: null, beneficios: ["Copa Nordeste", "Brasileirão Série C"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Combate HD (Avulso)", precoMensal: 34.90, precoAnual: null, beneficios: ["Acesso ao canal Combate"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "UFC Fight Pass", precoMensal: 29.90, precoAnual: null, beneficios: ["Acesso ao UFC Fight Pass"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Canal Dog TV", precoMensal: 19.90, precoAnual: null, beneficios: ["Canal com programação para cães"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Claro Música Ilimitado (Avulso)", precoMensal: 12.90, precoAnual: null, beneficios: ["Acesso ao Claro Música"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Curta On", precoMensal: 14.90, precoAnual: null, beneficios: ["Catálogo Curta On"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Mezzo Live HD", precoMensal: 16.00, precoAnual: null, beneficios: ["Canal de música clássica e jazz"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "SIC Internacional", precoMensal: 6.90, precoAnual: null, beneficios: ["Canal de variedades de Portugal"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Stingray Classica", precoMensal: 14.90, precoAnual: null, beneficios: ["Catálogo Stingray Classica"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Stingray Karaoke", precoMensal: 9.90, precoAnual: null, beneficios: ["Catálogo Stingray Karaoke"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Adrenalina Pura", precoMensal: 14.90, precoAnual: null, beneficios: ["Catálogo Adrenalina Pura (Filmes de Ação)"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Claro Shows", precoMensal: 14.90, precoAnual: null, beneficios: ["Catálogo Claro Shows"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Only TV", precoMensal: 29.90, precoAnual: null, beneficios: ["Conteúdo Árabe"], observacoes: "" },

    // ==========================================
    // ADULTOS
    // ==========================================
    { regiaoId: "nacional", tipo: "Opcional", nome: "Brasileirinhas", precoMensal: 24.90, precoAnual: null, beneficios: ["Canal Adulto"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "For Man", precoMensal: 19.90, precoAnual: null, beneficios: ["Canal Adulto"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Playboy HD", precoMensal: 19.90, precoAnual: null, beneficios: ["Canal Adulto"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "PPV Adultos (por Evento)", precoMensal: 13.90, precoAnual: null, beneficios: ["Canal Adulto (Pay-per-view)"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Sexy Play", precoMensal: 24.90, precoAnual: null, beneficios: ["Canal Adulto"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Sex Prive", precoMensal: 24.90, precoAnual: null, beneficios: ["Canal Adulto"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Sextreme Digital", precoMensal: 19.90, precoAnual: null, beneficios: ["Canal Adulto"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Sexy Hot Digital", precoMensal: 19.90, precoAnual: null, beneficios: ["Canal Adulto"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Venus Digital", precoMensal: 19.90, precoAnual: null, beneficios: ["Canal Adulto"], observacoes: "" },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Combo Adulto (5 Canais)", precoMensal: 43.90, precoAnual: null, beneficios: ["Sexy Hot", "Playboy", "Venus", "Sextreme", "For Man HD"], observacoes: "Promoção R$ 21,95 por 2 meses." },
    { regiaoId: "nacional", tipo: "Opcional", nome: "Combo Adulto (4 Canais)", precoMensal: 39.90, precoAnual: null, beneficios: ["Sexy Hot", "Playboy", "Venus", "Sextreme HD"], observacoes: "Promoção R$ 19,95 por 2 meses." },
];

export default produtosOpcionais;
