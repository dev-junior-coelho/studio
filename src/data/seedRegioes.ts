// data/seedRegioes.ts (V11.0 - Regiões Claro)

export interface Regiao {
    id: string;
    nome: string;
    descricao: string;
    cidades: string[];
}

export const regioes: Regiao[] = [
    // Região Padrão (p.18)
    {
        id: "padrao",
        nome: "Brasil (Tabela Padrão)",
        descricao: "Tabela de preços padrão para a maioria das cidades do Brasil.",
        cidades: ["Cobertura Nacional (exceto cidades listadas em outras regiões)"]
    },
    // Região Especial (p.19)
    {
        id: "especial",
        nome: "Especial",
        descricao: "Regiões com tabela de preços especial.",
        cidades: ["Consulte lista completa no Guia de Ofertas"]
    },
    // Região Especial Promo 6M (p.20)
    {
        id: "especial-promo-6m",
        nome: "Especial Promo 6M",
        descricao: "Regiões com promoção de 6 meses no combo.",
        cidades: ["Consulte lista completa no Guia de Ofertas"]
    },
    // Região Especial Promo 3M (p.21)
    {
        id: "especial-promo-3m",
        nome: "Especial Promo 3M",
        descricao: "Regiões com promoção de 3 meses no combo.",
        cidades: ["Consulte lista completa no Guia de Ofertas"]
    },
    // Região Especial Plus (p.22)
    {
        id: "especial-plus",
        nome: "Especial Plus",
        descricao: "Regiões com tabela especial plus (preços reduzidos).",
        cidades: ["Consulte lista completa no Guia de Ofertas"]
    },
    // Região Especial Plus Promo 6M (p.23)
    {
        id: "especial-plus-promo-6m",
        nome: "Especial Plus Promo 6M",
        descricao: "Regiões especial plus com promoção de 6 meses.",
        cidades: ["Consulte lista completa no Guia de Ofertas"]
    },
    // Região Especial Plus Promo 3-6M (p.24)
    {
        id: "especial-plus-promo-3-6m",
        nome: "Especial Plus Promo 3-6M",
        descricao: "Regiões especial plus com promoções mistas (3 e 6 meses).",
        cidades: ["Consulte lista completa no Guia de Ofertas"]
    },
    // Região Especial Plus Promo 3M (p.25)
    {
        id: "especial-plus-promo-3m",
        nome: "Especial Plus Promo 3M",
        descricao: "Regiões especial plus com promoção de 3 meses.",
        cidades: ["Consulte lista completa no Guia de Ofertas"]
    },
    // Região Especial Plus Promo 3M-B (p.26)
    {
        id: "especial-plus-promo-3m-b",
        nome: "Especial Plus Promo 3M-B",
        descricao: "Regiões especial plus com promoção de 3 meses (variante B).",
        cidades: ["Consulte lista completa no Guia de Ofertas"]
    },
    // Região MED-01 (p.27)
    {
        id: "med-01",
        nome: "MED-01",
        descricao: "Regiões metropolitanas tipo 01.",
        cidades: ["Consulte lista completa no Guia de Ofertas"]
    },
    // Região MED-02 (p.28)
    {
        id: "med-02",
        nome: "MED-02",
        descricao: "Regiões metropolitanas tipo 02.",
        cidades: ["Consulte lista completa no Guia de Ofertas"]
    },
    // Região MED Redes Neutras 02 (p.29)
    {
        id: "med-redes-neutras-02",
        nome: "MED Redes Neutras 02",
        descricao: "Regiões atendidas por redes neutras parceiras.",
        cidades: ["Consulte lista completa no Guia de Ofertas"]
    },
    // Região MED-03 (p.30)
    {
        id: "med-03",
        nome: "MED-03",
        descricao: "Regiões metropolitanas tipo 03.",
        cidades: ["Consulte lista completa no Guia de Ofertas"]
    },
    // Região Fibra Pura (p.66)
    {
        id: "fibra-pura",
        nome: "Fibra Pura",
        descricao: "Regiões com cobertura exclusiva de fibra óptica (sem cabo).",
        cidades: ["Consulte lista completa no Guia de Ofertas"]
    },
    // Região Nacional (para produtos disponíveis em todo Brasil)
    {
        id: "nacional",
        nome: "Nacional",
        descricao: "Produtos disponíveis em todo o Brasil, independente da região de banda larga/TV.",
        cidades: ["Todo o Brasil"]
    }
];

export default regioes;
