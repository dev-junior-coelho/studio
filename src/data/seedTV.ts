// data/seedTV.ts (Claro TV+ - vigente a partir de 23/04/2026)
// TIPOS CORRETOS: "TV Cabeada" para Cabo, "TV Box" para Streaming, "Claro TV APP" para App

const beneficiosSuperbundle = [
    "Netflix Padrão com Anúncios (2 acessos, Full HD)",
    "Globoplay Premium com canais ao vivo (5 acessos)",
    "HBO Max Básico com Anúncios (2 acessos, Full HD)",
    "Apple TV+ (5 acessos, 4K HDR, sem anúncios)",
    "Disney+ Padrão com Anúncios (2 acessos, Full HD)",
    "Amazon Prime Video com anúncios (3 acessos)",
    "Amazon Music, Prime Gaming, Prime Reading e frete grátis",
    "Replay TV e gravação na nuvem"
];

const beneficiosSoundbox = [
    ...beneficiosSuperbundle,
    "Equipamento Soundbox com áudio Bang & Olufsen e Dolby Atmos",
    "Comando de voz"
];

const beneficiosBox = [
    ...beneficiosSuperbundle,
    "Box 4K",
    "Controle com comando de voz"
];

// Helper para extrair procedimento S/ APA e adicionar CADASTRO NETSALES
function addCadastroNetsalesToBenefits(beneficios: string[], observacoes: string) {
    if (!observacoes || typeof observacoes !== 'string') {
        return [...beneficios, `CADASTRO NETSALES: S/ APA (procedimento não encontrado)`];
    }
    const procedimentoMatch = observacoes.match(/procedimento:\s*([^\.]+)/i);
    let procedimento = 'S/ APA (procedimento não encontrado)';
    if (procedimentoMatch) {
        const procedimentos = procedimentoMatch[1].split('/').map(s => s.trim()).filter(Boolean);
        const sApa = procedimentos.find(p => /s\/?\s*apa/i.test(p));
        procedimento = sApa || procedimentos[0] || procedimento;
    }
    return [...beneficios, `CADASTRO NETSALES: ${procedimento}`];
}

const tv = (
    regiaoId: string,
    tipo: "TV Cabeada" | "TV Box" | "Claro TV APP",
    nome: string,
    precoMensal: number,
    beneficios: string[],
    observacoes: string,
    precoAnual: number | null = null
) => ({
    regiaoId,
    tipo,
    nome,
    precoMensal,
    precoAnual,
    beneficios: addCadastroNetsalesToBenefits(beneficios, observacoes),
    observacoes
});

const tvPadrao = [
    tv("padrao", "TV Cabeada", "Claro TV+ Soundbox (Cabo) Multi", 174.90, beneficiosSoundbox, "Padrão p.8. Modalidade No Multi com 5G e Fibra ou No Multi com 5G ou Fibra. Procedimento: CTV+ TOP HD 4K SOUND MULTI FID / 4K SOUND TOP NETFLIX ANUNCIO."),
    tv("padrao", "TV Cabeada", "Claro TV+ Soundbox (Cabo) Single", 164.90, beneficiosSoundbox, "Padrão p.8. Modalidade Single. Para pagamentos DCC + Fatura Digital, aplicar desconto de R$ 5,00."),
    tv("padrao", "TV Cabeada", "Claro TV+ Box (Cabo) Multi 5G e Fibra", 154.90, beneficiosBox, "Padrão p.8. Modalidade No Multi com 5G e Fibra. Procedimento: CTV+ TOP HD 4K MULTI FID."),
    tv("padrao", "TV Cabeada", "Claro TV+ Box (Cabo) Multi 5G ou Fibra", 154.90, beneficiosBox, "Padrão p.8. Modalidade No Multi com 5G ou Fibra. Procedimento: CTV+ TOP HD 4K MULTI FID."),
    tv("padrao", "TV Cabeada", "Claro TV+ Box (Cabo) Single", 164.90, beneficiosBox, "Padrão p.8. Modalidade Single. Procedimento: CTV+ TOP HD 4K FID."),
    tv("padrao", "TV Box", "Claro TV+ Soundbox (Streaming) Multi", 174.90, beneficiosSoundbox, "Padrão p.8. Modalidade No Multi com 5G e Fibra ou No Multi com 5G ou Fibra. Procedimento: CLARO STREAMING HD TOP SOUND MULTI FID."),
    tv("padrao", "TV Box", "Claro TV+ Box (Streaming) Multi 5G e Fibra", 99.90, beneficiosBox, "Padrão p.8. Modalidade No Multi com 5G e Fibra. Valor válido em boleto e DCC. Procedimento: STREAMING HD TOP 6S 3P FID."),
    tv("padrao", "TV Box", "Claro TV+ Box (Streaming) Multi 5G ou Fibra", 124.90, beneficiosBox, "Padrão p.8. Modalidade No Multi com 5G ou Fibra. Procedimento: CLARO STREAMING HD TOP FID."),
    tv("padrao", "TV Box", "Claro TV+ Box (Streaming) Multi 5G Área Não Cabeada", 109.90, beneficiosBox, "Padrão p.8. Área não cabeada. Modalidade No Multi com 5G. Procedimento: CLARO STREAMING HD TOP MULTI FID."),
    tv("padrao", "TV Box", "Claro TV+ Box (Streaming) Single", 134.90, beneficiosBox, "Padrão p.8. Modalidade Single ou Área não cabeada com Fone Fixo. Procedimento: CLARO STREAMING HD TOP FID.")
];

const tvMercadoDesenvolvimento = [
    tv("mercado-desenvolvimento-1", "TV Cabeada", "Claro TV+ Soundbox (Cabo) MD", 174.90, beneficiosSoundbox, "Mercado em Desenvolvimento p.20. Modalidade No Multi com 5G e Fibra ou No Multi com 5G ou Fibra."),
    tv("mercado-desenvolvimento-2", "TV Cabeada", "Claro TV+ Soundbox (Cabo) MD", 174.90, beneficiosSoundbox, "Mercado em Desenvolvimento p.20. Modalidade No Multi com 5G e Fibra ou No Multi com 5G ou Fibra."),
    tv("mercado-desenvolvimento-3", "TV Cabeada", "Claro TV+ Soundbox (Cabo) MD", 174.90, beneficiosSoundbox, "Mercado em Desenvolvimento p.20. Modalidade No Multi com 5G e Fibra ou No Multi com 5G ou Fibra."),
    tv("mercado-desenvolvimento-1", "TV Cabeada", "Claro TV+ Box (Cabo) MD", 154.90, beneficiosBox, "Mercado em Desenvolvimento p.20. Modalidade No Multi com 5G e Fibra ou No Multi com 5G ou Fibra."),
    tv("mercado-desenvolvimento-2", "TV Cabeada", "Claro TV+ Box (Cabo) MD", 154.90, beneficiosBox, "Mercado em Desenvolvimento p.20. Modalidade No Multi com 5G e Fibra ou No Multi com 5G ou Fibra."),
    tv("mercado-desenvolvimento-3", "TV Cabeada", "Claro TV+ Box (Cabo) MD", 154.90, beneficiosBox, "Mercado em Desenvolvimento p.20. Modalidade No Multi com 5G e Fibra ou No Multi com 5G ou Fibra."),
    tv("mercado-desenvolvimento-1", "TV Cabeada", "Claro TV+ Box (Cabo) MD Single", 164.90, beneficiosBox, "Mercado em Desenvolvimento p.20. Modalidade Single."),
    tv("mercado-desenvolvimento-2", "TV Cabeada", "Claro TV+ Box (Cabo) MD Single", 164.90, beneficiosBox, "Mercado em Desenvolvimento p.20. Modalidade Single."),
    tv("mercado-desenvolvimento-3", "TV Cabeada", "Claro TV+ Box (Cabo) MD Single", 164.90, beneficiosBox, "Mercado em Desenvolvimento p.20. Modalidade Single."),
    tv("mercado-desenvolvimento-1", "TV Box", "Claro TV+ Soundbox (Streaming) MD", 174.90, beneficiosSoundbox, "Mercado em Desenvolvimento p.20. Modalidade No Multi com 5G e Fibra ou No Multi com 5G ou Fibra."),
    tv("mercado-desenvolvimento-2", "TV Box", "Claro TV+ Soundbox (Streaming) MD", 174.90, beneficiosSoundbox, "Mercado em Desenvolvimento p.20. Modalidade No Multi com 5G e Fibra ou No Multi com 5G ou Fibra."),
    tv("mercado-desenvolvimento-3", "TV Box", "Claro TV+ Soundbox (Streaming) MD", 174.90, beneficiosSoundbox, "Mercado em Desenvolvimento p.20. Modalidade No Multi com 5G e Fibra ou No Multi com 5G ou Fibra."),
    tv("mercado-desenvolvimento-1", "TV Box", "Claro TV+ Box (Streaming) MD Multi 5G e Fibra", 99.90, beneficiosBox, "Mercado em Desenvolvimento p.20. Modalidade No Multi com 5G e Fibra. Procedimento: STREAMING HD TOP 6S 3P FID."),
    tv("mercado-desenvolvimento-2", "TV Box", "Claro TV+ Box (Streaming) MD Multi 5G e Fibra", 99.90, beneficiosBox, "Mercado em Desenvolvimento p.20. Modalidade No Multi com 5G e Fibra. Procedimento: STREAMING HD TOP 6S 3P FID."),
    tv("mercado-desenvolvimento-3", "TV Box", "Claro TV+ Box (Streaming) MD Multi 5G e Fibra", 99.90, beneficiosBox, "Mercado em Desenvolvimento p.20. Modalidade No Multi com 5G e Fibra. Procedimento: STREAMING HD TOP 6S 3P FID."),
    tv("mercado-desenvolvimento-1", "TV Box", "Claro TV+ Box (Streaming) MD Multi 5G ou Fibra", 114.90, beneficiosBox, "Mercado em Desenvolvimento p.20. Modalidade No Multi com 5G ou Fibra."),
    tv("mercado-desenvolvimento-2", "TV Box", "Claro TV+ Box (Streaming) MD Multi 5G ou Fibra", 114.90, beneficiosBox, "Mercado em Desenvolvimento p.20. Modalidade No Multi com 5G ou Fibra."),
    tv("mercado-desenvolvimento-3", "TV Box", "Claro TV+ Box (Streaming) MD Multi 5G ou Fibra", 114.90, beneficiosBox, "Mercado em Desenvolvimento p.20. Modalidade No Multi com 5G ou Fibra."),
    tv("mercado-desenvolvimento-1", "TV Box", "Claro TV+ Box (Streaming) MD Single", 134.90, beneficiosBox, "Mercado em Desenvolvimento p.20. Modalidade Single."),
    tv("mercado-desenvolvimento-2", "TV Box", "Claro TV+ Box (Streaming) MD Single", 134.90, beneficiosBox, "Mercado em Desenvolvimento p.20. Modalidade Single."),
    tv("mercado-desenvolvimento-3", "TV Box", "Claro TV+ Box (Streaming) MD Single", 134.90, beneficiosBox, "Mercado em Desenvolvimento p.20. Modalidade Single.")
];

const tvMedTemplate = tvMercadoDesenvolvimento.filter(produto => produto.regiaoId === "mercado-desenvolvimento-2");

const regioesTvMedPdf = [
    "especial-promo-6m",
    "especial-promo-3m",
    "especial-plus-promo-6m",
    "especial-plus-promo-3-6m",
    "especial-plus-promo-3m",
    "especial-plus-promo-3m-b",
    "med-01",
    "med-02",
    "med-redes-neutras-02",
    "med-03"
];

const tvMedPdf = regioesTvMedPdf.flatMap(regiaoId =>
    tvMedTemplate.map(produto => ({
        ...produto,
        regiaoId,
        observacoes: produto.observacoes.replace("Mercado em Desenvolvimento p.20", `${regiaoId} - TV MED p.67`)
    }))
);

const tvFibraPura = [
    tv("fibra-pura", "TV Box", "Claro TV+ Soundbox (Streaming) Fibra Pura Multi", 154.90, beneficiosSoundbox, "Fibra Pura p.66. Modalidade No Multi com 5G e Fibra. Procedimento: CLARO STREAMING HD TOP SOUND MULTI FID."),
    tv("fibra-pura", "TV Box", "Claro TV+ Box (Streaming) Fibra Pura Multi", 124.90, beneficiosBox, "Fibra Pura p.66. Modalidade No Multi com 5G e Fibra. Procedimento: CLARO STREAMING HD TOP MULTI FID."),
    tv("fibra-pura", "TV Box", "Claro TV+ Box (Streaming) Fibra Pura Single", 134.90, beneficiosBox, "Fibra Pura p.66. Modalidade Single com Fone. Procedimento: CLARO STREAMING HD TOP FID.")
];

const tvRetencaoCallCenterCabo = [
    tv("nacional", "TV Cabeada", "Claro TV+ Soundbox (Retenção)", 144.90, beneficiosSoundbox, "Retenção Call Center | TV Cabo - Áreas Cabeadas - Grupo G1. Ponto Adicional: R$ 59,90. Procedimento: S/ APA. Fidelidade: desde 23/07 o Box é comercializado prioritariamente com fidelidade."),
    tv("nacional", "TV Cabeada", "Claro TV+ Box (Cabo) (Retenção)", 124.90, beneficiosBox, "Retenção Call Center | TV Cabo - Áreas Cabeadas - Grupo G1. Ponto Adicional: R$ 20,00. Procedimento: S/ APA. Controle por voz incluso."),
    tv("nacional", "TV Box", "Claro TV+ Box (Retenção)", 114.90, beneficiosBox, "Retenção Call Center | TV Cabo - Áreas Cabeadas - Grupo G1. Procedimento: S/ APA. Controle por voz incluso."),
    tv("nacional", "TV Cabeada", "Claro TV+ Top HD (Retenção)", 109.90, beneficiosSuperbundle, "Retenção Call Center | TV Cabo - Áreas Cabeadas - Grupo G1. Procedimento: S/ APA."),
    tv("nacional", "TV Cabeada", "Claro TV+ Inicial HD (Retenção)", 79.90, beneficiosSuperbundle, "Retenção Call Center | TV Cabo - Áreas Cabeadas - Grupo G1. Procedimento: S/ APA.")
];

export const produtosTV = [
    ...tvPadrao,
    // Grupos Especial/Especial+ usam a grade massiva de TV padrão (p.8).
    ...tvPadrao.map(produto => ({ ...produto, regiaoId: "especial", observacoes: produto.observacoes.replace("Padrão p.8", "Especial p.12 com grade de TV padrão p.8") })),
    ...tvPadrao.map(produto => ({ ...produto, regiaoId: "especial-plus", observacoes: produto.observacoes.replace("Padrão p.8", "Especial+ p.14 com grade de TV padrão p.8") })),
    ...tvMercadoDesenvolvimento,
    ...tvMedPdf,
    ...tvFibraPura,
    ...tvRetencaoCallCenterCabo,
    tv("exclusivo-canal", "TV Cabeada", "Claro TV+ Soundbox (Cabo) Single Canal", 194.90, beneficiosSoundbox, "Exclusivo por canal p.27. Modalidade Single. Canais elegíveis: agente autorizado, lojas próprias, PAP condomínio e PAP premium."),
    tv("exclusivo-canal", "Claro TV APP", "Claro TV+ APP Mensal", 99.90, ["Claro TV+ APP", "Até 5 dispositivos cadastrados", "2 acessos simultâneos"], "Exclusivo por canal p.28. Produto APP sem ponto adicional.", null),
    tv("exclusivo-canal", "Claro TV APP", "Claro TV+ Streamings Mensal", 79.90, ["Pacote Claro TV+ Streamings", "Contratação via canais digitais/cartão conforme política"], "Exclusivo por canal p.28. Produto Streaming & APP.", null)
];

export default produtosTV;
