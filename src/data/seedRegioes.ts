// data/seedRegioes.ts (V11.0 - Regiões Claro)

export interface Regiao {
    id: string;
    nome: string;
    descricao: string;
    cidades: string[];
}

export const regioes: Regiao[] = [
    // Região Nacional (produtos disponíveis em todo Brasil - usada como fallback)
    {
        id: "nacional",
        nome: "Nacional",
        descricao: "Produtos disponíveis em todo o Brasil.",
        cidades: [] // Não tem cidades, é usada como fallback
    },
    // Região Padrão (p.18) - Principais capitais
    {
        id: "padrao",
        nome: "Brasil (Tabela Padrão)",
        descricao: "Tabela de preços padrão para as principais capitais.",
        cidades: [
            "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Brasília", "Curitiba",
            "Porto Alegre", "Salvador", "Fortaleza", "Recife", "Goiânia",
            "Manaus", "Belém", "Campinas", "São Bernardo do Campo", "Guarulhos",
            "Santo André", "Osasco", "Sorocaba", "Santos", "São José dos Campos",
            "São José do Rio Preto", "Vitória da Conquista", "Campina Grande", "Caruaru",
            "Petrolina", "Juazeiro do Norte", "Mossoró", "Imperatriz", "Anápolis",
            "Campos dos Goytacazes", "Volta Redonda", "Petrópolis"
        ]
    },
    // Região Especial (p.19)
    {
        id: "especial",
        nome: "Especial",
        descricao: "Regiões com tabela de preços especial.",
        cidades: [
            "Niterói", "Florianópolis", "Vitória", "Joinville", "Londrina",
            "Maringá", "Blumenau", "Caxias do Sul", "Pelotas", "Canoas"
        ]
    },
    // Região Especial Promo 6M (p.20)
    {
        id: "especial-promo-6m",
        nome: "Especial Promo 6M",
        descricao: "Regiões com promoção de 6 meses no combo.",
        cidades: [
            "Uberlândia", "Juiz de Fora", "Ribeirão Preto", "Aracaju", "Natal",
            "João Pessoa", "Maceió", "Teresina", "São Luís", "Feira de Santana"
        ]
    },
    // Região Especial Promo 3M (p.21)
    {
        id: "especial-promo-3m",
        nome: "Especial Promo 3M",
        descricao: "Regiões com promoção de 3 meses no combo.",
        cidades: [
            "Cuiabá", "Campo Grande", "Porto Velho", "Rio Branco", "Macapá",
            "Boa Vista", "Palmas"
        ]
    },
    // Região Especial Plus (p.22)
    {
        id: "especial-plus",
        nome: "Especial Plus",
        descricao: "Regiões com tabela especial plus (preços reduzidos).",
        cidades: [
            "Piracicaba", "Bauru", "Taubaté", "Limeira", "Franca", "Marília",
            "Araraquara", "Presidente Prudente", "São Carlos"
        ]
    },
    // Região Especial Plus Promo 6M (p.23)
    {
        id: "especial-plus-promo-6m",
        nome: "Especial Plus Promo 6M",
        descricao: "Regiões especial plus com promoção de 6 meses.",
        cidades: [
            "Jundiaí", "Mogi das Cruzes", "Suzano", "Itaquaquecetuba", "Diadema"
        ]
    },
    // Região Especial Plus Promo 3-6M (p.24)
    {
        id: "especial-plus-promo-3-6m",
        nome: "Especial Plus Promo 3-6M",
        descricao: "Regiões especial plus com promoções mistas (3 e 6 meses).",
        cidades: [
            "Carapicuíba", "Taboão da Serra", "Embu das Artes", "Cotia", "Barueri"
        ]
    },
    // Região Especial Plus Promo 3M (p.25)
    {
        id: "especial-plus-promo-3m",
        nome: "Especial Plus Promo 3M",
        descricao: "Regiões especial plus com promoção de 3 meses.",
        cidades: [
            "Mauá", "São Caetano do Sul", "Ribeirão Pires", "Rio Grande da Serra"
        ]
    },
    // Região Especial Plus Promo 3M-B (p.26)
    {
        id: "especial-plus-promo-3m-b",
        nome: "Especial Plus Promo 3M-B",
        descricao: "Regiões especial plus com promoção de 3 meses (variante B).",
        cidades: [
            "Ferraz de Vasconcelos", "Poá", "Itapevi", "Jandira", "Santana de Parnaíba"
        ]
    },
    // Região MED-01 (p.27)
    {
        id: "med-01",
        nome: "MED-01",
        descricao: "Regiões metropolitanas tipo 01.",
        cidades: [
            "Americana", "Santa Bárbara d'Oeste", "Sumaré", "Nova Odessa", "Hortolândia",
            "Paulínia", "Valinhos", "Vinhedo", "Indaiatuba"
        ]
    },
    // Região MED-02 (p.28)
    {
        id: "med-02",
        nome: "MED-02",
        descricao: "Regiões metropolitanas tipo 02.",
        cidades: [
            "São Roque", "Ibiúna", "Votorantim", "Salto", "Itu",
            "Cabreúva", "Porto Feliz", "Boituva"
        ]
    },
    // Região MED Redes Neutras 02 (p.29)
    {
        id: "med-redes-neutras-02",
        nome: "MED Redes Neutras 02",
        descricao: "Regiões atendidas por redes neutras parceiras.",
        cidades: [
            "Atibaia", "Bragança Paulista", "Itatiba", "Jarinu", "Morungaba"
        ]
    },
    // Região MED-03 (p.30)
    {
        id: "med-03",
        nome: "MED-03",
        descricao: "Regiões metropolitanas tipo 03.",
        cidades: [
            "Registro", "Itanhaém", "Peruíbe", "Mongaguá", "Praia Grande",
            "São Vicente", "Cubatão", "Guarujá", "Bertioga"
        ]
    },
    // Região Fibra Pura (p.66)
    {
        id: "fibra-pura",
        nome: "Fibra Pura",
        descricao: "Regiões com cobertura exclusiva de fibra óptica (sem cabo).",
        cidades: [
            "Caraguatatuba", "Ubatuba", "São Sebastião", "Ilhabela",
            "Campos do Jordão", "São Bento do Sapucaí", "Santo Antônio do Pinhal"
        ]
    }
];

export default regioes;
