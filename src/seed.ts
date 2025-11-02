
// seed.ts
// Script para popular (semear) o banco de dados do Firestore com os produtos da Claro.
// Rode este script para garantir que os dados mais recentes estejam no banco de dados.

import { initializeApp } from 'firebase/app';
import { getFirestore, writeBatch, doc, collection, getDocs, deleteDoc } from 'firebase/firestore';

// =============================================================================
// 1. CONFIGURE O SEU FIREBASE AQUI
// =============================================================================
// Cole as credenciais do seu projeto Firebase aqui
const firebaseConfig = {

  apiKey: "AIzaSyD_IW8CfZMseq-LsWkQoZnzEobByPywbss",

  authDomain: "studio-878079588-1d0ae.firebaseapp.com",

  projectId: "studio-878079588-1d0ae",

  storageBucket: "studio-878079588-1d0ae.appspot.com",

  messagingSenderId: "486175528141",

  appId: "1:486175528141:web:4e4d4d291cd8e099c28584"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =============================================================================
// 2. DADOS DAS REGIÕES (Extraído dos PDFs, p. 18-30)
// =============================================================================
const regioesParaCadastrar = [
  // Regiões de BL "Padrão" (p.18) e TV "Cabo" (p.65)
  {
    id: "padrao",
    nome: "Padrão (Cabo/Fibra)",
    cidades: ["Almirante Tamandare-PR", "Araucaria-PR", "Campo Largo-PR", "Colombo-PR", "Pinhais-PR", "Itapevi-SP", "Jandira-SP", "Tiete-SP", "Vargem Grande Paulista-SP", "Canoas-RS", "Caxias Do Sul-RS", "Esteio-RS", "Farroupilha-RS", "Florianopolis-SC", "Joinville-SC", "Londrina-PR", "Porto Alegre-RS", "Sao Jose Dos Pinhais-PR", "Sao Jose-SC", "Sapucaia Do Sul-RS", "Americana-SP", "Araras-SP", "Atibaia-SP", "Barueri-SP", "Belo Horizonte-MG", "Braganca Paulista-SP", "Campinas-SP", "Contagem-MG", "Cotia-SP", "Cubatao-SP", "Diadema-SP", "Elias Fausto-SP", "Guarulhos-SP", "Itu-SP", "Jundiai-SP", "Mogi Mirim-SP", "Monte Mor-SP", "Osasco-SP", "Piracicaba-SP", "Poa-SP", "Porto Feliz-SP", "Rafard-SP", "Rio Claro-SP", "Rio De Janeiro-RJ", "Sabara-MG", "Salto-SP", "Santa Barbara DOeste-SP", "Santana De Parnaiba-SP", "Santo Andre-SP", "Sao Bernardo Do Campo-SP", "Sao Caetano Do Sul-SP", "Sao Goncalo-RJ", "Sao Paulo-SP", "Sertaozinho-SP", "Suzano-SP", "Taboao Da Serra-SP", "Brasilia-DF", "Manaus-AM", "Lauro De Freitas-BA", "Salvador-BA"]
  },
  // Regiões de BL "Especial" (p.19) e TV "Cabo" (p.65)
  {
    id: "especial",
    nome: "Especial (Cabo/Fibra)",
    cidades: ["Arapongas-PR", "Curitiba-PR", "Gravatai-RS", "Novo Hamburgo-RS", "Palhoca-SC", "Alvorada-RS", "Cachoeirinha-RS", "Viamao-RS", "Cacapava-SP", "Capivari-SP", "Carapicuiba-SP", "Cariacica-ES", "Cosmopolis-SP", "Embu Das Artes-SP", "Guaruja-SP", "Indaiatuba-SP", "Maua-SP", "Mogi Guacu-SP", "Paulinia-SP", "Valinhos-SP", "Vila Velha-ES", "Araraquara-SP", "Bauru-SP", "Franca-SP", "Jacarei-SP", "Mogi Das Cruzes-SP", "Praia Grande-SP", "Ribeirao Preto-SP", "Santos-SP", "Sao Carlos-SP", "Sao Jose Do Rio Preto-SP", "Sao Jose Dos Campos-SP", "Sao Vicente-SP", "Serra-ES", "Sorocaba-SP", "Taubate-SP", "Vinhedo-SP", "Vitoria-ES", "Votorantim-SP", "Cuiaba-MT", "Varzea Grande-MT", "Ananindeua-PA", "Palmas-TO", "Belem-PA", "Porto Velho-RO", "Rio Branco-AC", "Recife-PE", "Sao Luis-MA"]
  },
  // Regiões de BL "Especial Promo 6M" (p.20) e TV "MED" (p.67)
  {
    id: "especial-promo-6m",
    nome: "Especial Promo 6M (Cabo/Fibra)",
    cidades: ["Cabedelo-PB", "Jaboatao Dos Guararapes-PE", "Joao Pessoa-PB", "Natal-RN", "Parnamirim-RN", "Maceio-AL", "Olinda-PE", "Paulista-PE"]
  },
  // Regiões de BL "Especial Promo 3M" (p.21) e TV "MED" (p.67)
  {
    id: "especial-promo-3m",
    nome: "Especial Promo 3M (Cabo/Fibra)",
    cidades: ["Campo Grande-MS"]
  },
  // Regiões de BL "Especial+" (p.22) e TV "MED" (p.67)
  {
    id: "especial-plus",
    nome: "Especial+ (Cabo/Fibra)",
    cidades: ["Rio Grande-RS", "Maringa-PR", "Pelotas-RS", "Jau-SP", "Mesquita-RJ", "Biguacu-SC", "Aluminio-SP", "Caraguatatuba-SP", "Itanhaem-SP", "Itatiba-SP", "Jaguariuna-SP", "Mirassol-SP", "Morungaba-SP", "Sao Sebastiao-SP", "Ubatuba-SP", "Mongagua-SP", "Santana-AP"]
  },
  // Regiões de BL "Especial+ Promo 6M" (p.23) e TV "MED" (p.67)
  {
    id: "especial-plus-promo-6m",
    nome: "Especial+ Promo 6M (Cabo/Fibra)",
    cidades: ["Fortaleza-CE", "Teresina-PI", "Lagoa Santa-MG", "Santa Luzia-MG", "Macapa-AP"]
  },
  // Regiões de BL "Especial+ Promo 3/6M" (p.24) e TV "MED" (p.67)
  {
    id: "especial-plus-promo-3-6m",
    nome: "Especial+ Promo 3/6M (Cabo/Fibra)",
    cidades: ["Aracaju-SE", "Aquiraz-CE", "Eusebio-CE"]
  },
  // Regiões de BL "Especial+ Promo 3M" (p.25) e TV "MED" (p.67)
  {
    id: "especial-plus-promo-3m",
    nome: "Especial+ Promo 3M (Cabo/Fibra)",
    cidades: ["Aparecida De Goiania-GO", "Goiania-GO"]
  },
  // Regiões de BL "Especial+ Promo 3M (B)" (p.26) e TV "Cabo" (p.65) ou "MED" (p.67)
  {
    id: "especial-plus-promo-3m-b",
    nome: "Especial+ Promo 3M (B) (Cabo/Fibra)",
    cidades: ["Belford Roxo-RJ", "Betim-MG", "Duque De Caxias-RJ", "Nova Odessa-SP", "Sao Joao De Meriti-RJ", "Sao Leopoldo-RS", "Niteroi-RJ", "Artur Nogueira-SP", "Bertioga-SP", "Hortolandia-SP", "Limeira-SP", "Nilopolis-RJ", "Nova Iguacu-RJ", "Nova Lima-MG", "Sumare-SP", "Sao Francisco Do Sul-SC", "Americo Brasiliense-SP", "Cabreuva-SP", "Cajamar-SP", "Campo Limpo Paulista-SP", "Cordeiropolis-SP", "Itaguai-RJ", "Itaquaquecetuba-SP", "Jarinu-SP", "Piracaia-SP", "Santa Gertrudes-SP", "Santa Isabel-SP", "Varzea Paulista-SP"]
  },
  // Regiões de BL "MED 01" (p.27) e TV "MED" (p.67)
  {
    id: "med-01",
    nome: "MED 01 (Cabo/Fibra)",
    cidades: ["Campina Grande-PB", "Balneario Camboriu-SC", "Cachoeira Paulista-SP", "Cruzeiro-SP", "Rio Das Ostras-RJ", "Dourados-MS", "Caruaru-PE", "Vitoria Da Conquista-BA", "Cacador-SC", "Camboriu-SC", "Eldorado Do Sul-RS", "Guaiba-RS", "Lages-SC", "Montenegro-RS", "Paranagua-PR", "Rio Negrinho-SC", "Sao Borja-RS", "Amparo-SP", "Barrinha-SP", "Boituva-SP", "Cabo Frio-RJ", "Guaira-SP", "Nova Friburgo-RJ", "Orlandia-SP", "Piedade-SP", "Pocos De Caldas-MG", "Pouso Alegre-MG", "Sao Joao Da Boa Vista-SP", "Sao Joaquim Da Barra-SP", "Serrana-SP", "Tremembe-SP", "Rio Verde-GO", "Senador Canedo-GO", "Sinop-MT", "Valparaiso De Goias-GO", "Ariquemes-RO", "Itabuna-BA", "Toledo-PR"]
  },
  // Regiões de BL "MED 02" (p.28) e TV "MED" (p.67)
  {
    id: "med-02",
    nome: "MED 02 (Cabo/Fibra)",
    cidades: ["Cianorte-PR", "Estancia Velha-RS", "Navegantes-SC", "Campos Dos Goytacazes-RJ", "Potim-SP", "Presidente Prudente-SP", "Teresopolis-RJ", "Bage-RS", "Bento Goncalves-RS", "Blumenau-SC", "Brusque-SC", "Campo Bom-RS", "Capao Da Canoa-RS", "Cascavel-PR", "Chapeco-SC", "Criciuma-SC", "Cruz Alta-RS", "Erechim-RS", "Guarapuava-PR", "Itajai-SC", "Itapema-SC", "Lajeado-RS", "Passo Fundo-RS", "Ponta Grossa-PR", "Santa Cruz Do Sul-RS", "Santa Maria-RS", "Sapiranga-RS", "Uruguaiana-RS", "Xangri-La-RS", "Aparecida-SP", "Aracatuba-SP", "Barra Mansa-RJ", "Botucatu-SP", "Governador Valadares-MG", "Guaratingueta-SP", "Ipatinga-MG", "Itapetininga-SP", "Juiz De Fora-MG", "Lorena-SP", "Macae-RJ", "Marilia-SP", "Petropolis-RJ", "Pindamonhangaba-SP", "Resende-RJ", "Sete Lagoas-MG", "Teofilo Otoni-MG", "Uberaba-MG", "Uberlandia-MG", "Varginha-MG", "Volta Redonda-RJ", "Anapolis-GO", "Rondonopolis-MT", "Alegrete-RS", "Ararangua-SC", "Arroio Do Meio-RS", "Cachoeira Do Sul-RS", "Camaqua-RS", "Canela-RS", "Carazinho-RS", "Carlos Barbosa-RS", "Charqueadas-RS", "Concordia-SC", "Dois Irmaos-RS", "Encantado-RS", "Estrela-RS", "Frederico Westphalen-RS", "Garibaldi-RS", "Gaspar-SC", "Gramado-RS", "Herval DOeste-SC", "Icara-SC", "Igrejinha-RS", "Imbe-RS", "Indaial-SC", "Itaqui-RS", "Ivoti-RS", "Joacaba-SC", "Mafra-SC", "Marau-RS", "Nova Petropolis-RS", "Osorio-RS", "Palmeira Das Missoes-RS", "Panambi-RS", "Parobe-RS", "Rio Pardo-RS", "Rosario Do Sul-RS", "Santa Rosa-RS", "Santana Do Livramento-RS", "Santo Angelo-RS", "Sao Bento Do Sul-SC", "Sao Gabriel-RS", "Sao Lourenco Do Sul-RS", "Sao Luiz Gonzaga-RS", "Taquara-RS", "Teutonia-RS", "Timbo-SC", "Torres-RS", "Tramandai-RS", "Tres Coroas-RS", "Tubarao-SC", "Vacaria-RS", "Venancio Aires-RS", "Vera Cruz-RS", "Veranopolis-RS", "Videira-SC", "Xanxere-SC", "Xaxim-SC", "Agudos-SP", "Alvares Machado-SP", "Andradina-SP", "Araguari-MG", "Araxa-MG", "Armacao Dos Buzios-RJ", "Avare-SP", "Bady Bassitt-SP", "Barbacena-MG", "Barretos-SP", "Batatais-SP", "Bebedouro-SP", "Birigui-SP", "Campos Do Jordao-SP", "Casa Branca-SP", "Cataguases-MG", "Catanduva-SP", "Cerquilho-SP", "Conselheiro Lafaiete-MG", "Coronel Fabriciano-MG", "Cravinhos-SP", "Descalvado-SP", "Divinopolis-MG", "Espirito Santo Do Pinhal-SP", "Fernandopolis-SP", "Garca-SP", "Guapiacu-SP", "Guararapes-SP", "Ibate-SP", "Ipero-SP", "Itabira-MG", "Itajuba-MG", "Itapira-SP", "Itauna-MG", "Ituiutaba-MG", "Ituverava-SP", "Jaboticabal-SP", "Jardinopolis-SP", "Jose Bonifacio-SP", "Laranjal Paulista-SP", "Lavras-MG", "Leme-SP", "Lencois Paulista-SP", "Lins-SP", "Louveira-SP", "Manhuacu-MG", "Matao-SP", "Miguel Pereira-RJ", "Mirandopolis-SP", "Mococa-SP", "Monte Alto-SP", "Montes Claros-MG", "Olimpia-SP", "Ourinhos-SP", "Para De Minas-MG", "Paraiba Do Sul-RJ", "Passos-MG", "Patos De Minas-MG", "Pedreira-SP", "Penapolis-SP", "Pirassununga-SP", "Pontal-SP", "Porto Ferreira-SP", "Potirendaba-SP", "Presidente Bernardes-SP", "Promissao-SP", "Santa Cruz das Palmeiras-SP", "Santa Rosa De Viterbo-SP", "Sao Joao Del Rei-MG", "Sao Jose Do Rio Pardo-SP", "Sao Pedro Da Aldeia-RJ", "Serra Negra-SP", "Tambau-SP", "Tatui-SP", "Timoteo-MG", "Tres Coracoes-MG", "Tres Rios-RJ", "Uba-MG", "Valenca-RJ", "Valparaiso-SP", "Vassouras-RJ", "Vicosa-MG", "Votuporanga-SP", "Caldas Novas-GO", "Formosa-GO", "Itumbiara-GO", "Jatai-GO", "Lucas Do Rio Verde-MT", "Navirai-MS", "Nova Mutum-MT", "Ponta Pora-MS", "Santa Helena De Goias-GO", "Sorriso-MT", "Tres Lagoas-MS", "Trindade-GO", "Araguaina-TO", "Cacoal-RO", "Castanhal-PA", "Gurupi-TO", "Ji-Parana-RO", "Maraba-PA", "Paragominas-PA", "Paraiso Do Tocantins-TO", "Parauapebas-PA", "Vilhena-RO", "Alagoinhas-BA", "Arapiraca-AL", "Barreiras-BA", "Caxias-MA", "Eunapolis-BA", "Feira De Santana-BA", "Ilheus-BA", "Imperatriz-MA", "Jequie-BA", "Juazeiro-BA", "Parnaiba-PI", "Petrolina-PE", "Porto Seguro-BA", "Teixeira De Freitas-BA", "Timon-MA", "Campina Grande do Sul-PR", "Campo Mourao-PR", "Castro-PR", "Cornelio Procopio-PR", "Fazenda Rio Grande-PR", "Foz Do Iguacu-PR", "Francisco Beltrao-PR", "Guaratuba-PR", "Ibipora-PR", "Ijui-RS", "Marechal Candido Rondon-PR", "Matinhos-PR", "Medianeira-PR", "Paicandu-PR", "Palmas-PR", "Pato Branco-PR", "Piraquara-PR", "Quatro Barras-PR", "Sarandi-PR", "Telemaco Borba-PR", "Umuarama-PR", "Uniao Da Vitoria-PR", "Luziania-GO", "Paulo Afonso-BA"]
  },
  // Regiões de BL "Redes Neutras MED 02" (p.29) e TV "MED" (p.67)
  {
    id: "med-redes-neutras-02",
    nome: "Redes Neutras MED 02 (Fibra)",
    cidades: ["Alfenas-MG", "Arcos-MG", "Formiga-MG", "Guaxupe-MG", "Joao Monlevade-MG", "Lagoa da Prata-MG", "Leopoldina-MG", "Mariana-MG", "Matozinhos-MG", "Monte Carmelo-MG", "Muriae-MG", "Nova Serrana-MG", "Ouro Preto-MG", "Patrocinio-MG", "Pedro Leopoldo-MG", "Piumhi-MG", "Ponte Nova-MG", "Sacramento-MG", "Santa Cruz de Minas-MG", "Santa Rita Do Sapucai-MG", "Sao Sebastiao do Paraiso-MG"]
  },
  // Regiões de BL "MED 03" (p.30) e TV "MED" (p.67)
  {
    id: "med-03",
    nome: "MED 03 (Cabo/Fibra)",
    cidades: ["Cachoeiro De Itapemirim-ES", "Fraiburgo-SC", "Rio Do Sul-SC", "Adamantina-SP", "Aracruz-ES", "Colatina-ES", "Dracena-SP", "Ibiuna-SP", "Itapeva-SP", "Jales-SP", "Registro-SP", "Santa Cruz Do Rio Pardo-SP", "Juazeiro Do Norte-CE", "Mossoro-RN", "Sobral-CE"]
  },
  // Regiões de TV "Fibra Pura" (p.66)
  {
    id: "fibra-pura",
    nome: "Fibra Pura (TV p.66)",
    cidades: ["Apucarana-PR", "Cambe-PR", "Guaramirim-SC", "Jaragua Do Sul-SC", "Rolandia-PR", "Aruja-SP", "Caieiras-SP", "Itupeva-SP", "Mairinque-SP", "Perube-SP", "Ribeirao Pires-SP", "Sao Roque-SP", "Vespasiano-MG", "Camacari-BA", "Mata De Sao Joao-BA"]
  },
  // Região Nacional para produtos que não dependem de geografia (Móvel, Opcionais, Upgrade)
  {
    id: "nacional",
    nome: "Nacional (Móvel/Opcional)",
    cidades: [] // Usado para produtos nacionais
  }
];

// =============================================================================
// 3. DADOS DOS PRODUTOS (V9.0 - 100% GRANULAR E CORRETA)
// =============================================================================

// Benefícios Padrão de BL: Globoplay Padrão (sem anúncios, 3 acessos), Proteção Digital McAfee (3 dispositivos), Skeelo Audiobooks (1 licença), ChatGPT Plus (se Multi).
const beneficiosBaseBL = ["Globoplay Padrão (sem anúncios, 3 acessos)", "Proteção Digital McAfee (3 dispositivos)", "Skeelo Audiobooks (1 licença)", "ChatGPT Plus (se Multi)"];
// Benefícios Padrão 500M+: Todos acima + Minha Banca Residencial.
const beneficios500MBL = [...beneficiosBaseBL, "Minha Banca Residencial"];
// Benefícios Padrão 1G: Todos acima + Busuu (2 licenças) + 1 Ponto Ultra Gratuito.
const beneficios1GBL = [...beneficios500MBL, "Busuu (2 licenças)", "1 Ponto Ultra Gratuito"];
// Benefícios TV (Aquisição Combo Completo - COM Disney/Amazon):
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
// Benefícios TV (Upgrade Combo - SEM Disney/Amazon - p.71):
const beneficiosTVComboUpgrade = [
      "Netflix Padrão com Anúncios",
      "Apple TV+",
      "HBO Max Básico com Anúncios",
      "Globoplay Canais Incluso",
      "Controle com Comando de Voz",
      "Gravador Virtual com 400 horas"
    ];


const produtosParaCadastrar = [
  // --- 1. PRODUTOS MÓVEIS (PÓS - MULTI) (PDF 2, p.51) ---
  {
    regiaoId: "nacional", tipo: "Movel", nome: "Claro Pós 300GB (Multi)", precoMensal: 319.90, precoAnual: null,
    beneficios: [
      "Franquia Total: 610 GB", "Detalhe da Franquia: 300 GB (uso livre) + 300 GB (Redes Sociais)", "Bônus: 10 GB (bônus promocional por 12 meses)",
      "Passaporte: Passaporte Mundo (uso do plano em 80 países)", "Dependentes: 3 dependentes grátis",
      "Apps Inclusos (GB Extra): TikTok, Instagram, Facebook, X (Twitter), WhatsApp",
      "SVAs Inclusos: Skeelo Premium, Truecaller, Claro Banca Premium, StbFit, Starbeme Zen App", "Benefício Multi: 4 meses de ChatGPT Plus",
      "Ligações Ilimitadas: Fixo e Celular de qualquer operadora do Brasil (usando 21)"
    ],
    observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  {
    regiaoId: "nacional", tipo: "Movel", nome: "Claro Pós 150GB (Multi)", precoMensal: 219.90, precoAnual: null,
    beneficios: [
      "Franquia Total: 310 GB", "Detalhe da Franquia: 150 GB (uso livre) + 150 GB (Redes Sociais)", "Bônus: 10 GB (bônus promocional por 12 meses)",
      "Passaporte: Passaporte Américas (uso do plano nas Américas)", "Dependentes: 2 dependentes grátis",
      "Apps Inclusos (GB Extra): TikTok, Instagram, Facebook, X (Twitter), WhatsApp",
      "SVAs Inclusos: Skeelo Premium, Truecaller, Claro Banca Premium, StbFit, Starbeme Zen App", "Benefício Multi: 4 meses de ChatGPT Plus",
      "Ligações Ilimitadas: Fixo e Celular de qualquer operadora do Brasil (usando 21)"
    ],
    observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  {
    regiaoId: "nacional", tipo: "Movel", nome: "Claro Pós 100GB (Multi)", precoMensal: 169.90, precoAnual: null,
    beneficios: [
      "Franquia Total: 210 GB", "Detalhe da Franquia: 100 GB (uso livre) + 100 GB (Redes Sociais)", "Bônus: 10 GB (bônus promocional por 12 meses)",
      "Dependentes: 1 dependente grátis", "Apps Inclusos (GB Extra): TikTok, Instagram, Facebook, X (Twitter), WhatsApp",
      "SVAs Inclusos: Skeelo Premium, Truecaller, Claro Banca Premium", "Benefício Multi: 4 meses de ChatGPT Plus",
      "Ligações Ilimitadas: Fixo e Celular de qualquer operadora do Brasil (usando 21)"
    ],
    observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  {
    regiaoId: "nacional", tipo: "Movel", nome: "Claro Pós 60GB Gaming (Multi)", precoMensal: 149.90, precoAnual: null,
    beneficios: [
      "Franquia Total: 130 GB", "Detalhe da Franquia: 60 GB (uso livre) + 60 GB (Redes Sociais)", "Bônus: 10 GB (bônus promocional por 12 meses)",
      "Streaming de Jogos: Geforce NOW incluso", "Dependentes: 0 dependentes inclusos", "Apps Inclusos (GB Extra): TikTok, Instagram, Facebook, X (Twitter), WhatsApp",
      "SVAs Inclusos: Skeelo Premium, Truecaller, Claro Banca Premium", "Benefício Multi: 4 meses de ChatGPT Plus",
      "Ligações Ilimitadas: Fixo e Celular de qualquer operadora do Brasil (usando 21)"
    ],
    observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  {
    regiaoId: "nacional", tipo: "Movel", nome: "Claro Pós 50GB (Multi)", precoMensal: 119.90, precoAnual: null,
    beneficios: [
      "Franquia Total: 110 GB", "Detalhe da Franquia: 50 GB (uso livre) + 50 GB (Redes Sociais)", "Bônus: 10 GB (bônus promocional por 12 meses)",
      "Dependentes: 0 dependentes inclusos", "Apps Inclusos (GB Extra): TikTok, Instagram, Facebook, X (Twitter), WhatsApp",
      "SVAs Inclusos: Skeelo Padrão, Truecaller, Claro Banca Premium", "Benefício Multi: 4 meses de ChatGPT Plus",
      "Ligações Ilimitadas: Fixo e Celular de qualquer operadora do Brasil (usando 21)"
    ],
    observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  {
    regiaoId: "nacional", tipo: "Movel", nome: "Claro Pós 25GB (Multi)", precoMensal: 59.90, precoAnual: null,
    beneficios: [
      "Franquia Total: 60 GB", "Detalhe da Franquia: 25 GB (uso livre) + 25 GB (Redes Sociais)", "Bônus: 10 GB (bônus promocional por 12 meses)",
      "Dependentes: 0 dependentes inclusos", "Apps Inclusos (GB Extra): TikTok, Instagram, Facebook, X (Twitter), WhatsApp",
      "Benefício Multi: 4 meses de ChatGPT Plus", "Ligações Ilimitadas: Fixo e Celular de qualquer operadora do Brasil (usando 21)"
    ],
    observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },

  // --- 2. PRODUTOS MÓVEIS (CONTROLE - MULTI) (PDF 2, p.52) ---
  {
    regiaoId: "nacional", tipo: "Movel", nome: "Claro Controle 25GB Gamer (Multi)", precoMensal: 99.90, precoAnual: null,
    beneficios: [
      "Franquia Total: 35 GB", "Detalhe da Franquia: 25 GB (uso livre) + 5 GB (Redes Sociais)", "Bônus: 5 GB (bônus promocional por 12 meses)",
      "Streaming de Jogos: Geforce NOW incluso", "Apps Inclusos (GB Extra): TikTok, Instagram, Facebook, X (Twitter), WhatsApp",
      "SVAs Inclusos: Skeelo Padrão, Claro Banca Padrão", "Benefício Multi: 2 meses de ChatGPT Plus",
      "Ligações Ilimitadas: Fixo e Celular de qualquer operadora do Brasil (usando 21)"
    ],
    observacoes: "Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  {
    regiaoId: "nacional", tipo: "Movel", nome: "Claro Controle 25GB (Multi)", precoMensal: 69.90, precoAnual: null,
    beneficios: [
      "Franquia Total: 35 GB", "Detalhe da Franquia: 25 GB (uso livre) + 5 GB (Redes Sociais)", "Bônus: 5 GB (bônus promocional por 12 meses)",
      "Apps Inclusos (GB Extra): TikTok, Instagram, Facebook, X (Twitter), WhatsApp",
      "SVAs Inclusos: Skeelo Padrão, Claro Banca Padrão", "Benefício Multi: 2 meses de ChatGPT Plus",
      "Ligações Ilimitadas: Fixo e Celular de qualquer operadora do Brasil (usando 21)"
    ],
    observacoes: "Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  {
    regiaoId: "nacional", tipo: "Movel", nome: "Claro Controle 20GB (Multi)", precoMensal: 44.90, precoAnual: null,
    beneficios: [
      "Franquia Total: 30 GB", "Detalhe da Franquia: 20 GB (uso livre) + 5 GB (Redes Sociais)", "Bônus: 5 GB (bônus promocional por 12 meses)",
      "Apps Inclusos (GB Extra): TikTok, Instagram, Facebook, X (Twitter), WhatsApp",
      "SVAs Inclusos: Skeelo Light, Claro Banca Padrão", "Benefício Multi: 2 meses de ChatGPT Plus",
      "Ligações Ilimitadas: Fixo e Celular de qualquer operadora do Brasil (usando 21)"
    ],
    observacoes: "Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  
  // --- 3. PRODUTOS BANDA LARGA (GRANULAR POR REGIÃO E COMBO) ---

  // Região: padrao (p.18)
  { regiaoId: "padrao", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 299.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "padrao", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fixo: R$ 149,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "padrao", tipo: "Banda Larga", nome: "BL 750 Mega (Single/Fixo)", precoMensal: 149.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "padrao", tipo: "Banda Larga", nome: "BL 600 Mega (Combo)", precoMensal: 99.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fixo: R$ 119,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "padrao", tipo: "Banda Larga", nome: "BL 600 Mega (Single/Fixo)", precoMensal: 119.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "padrao", tipo: "Banda Larga", nome: "BL 350 Mega (Combo)", precoMensal: 79.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fixo: R$ 99,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "padrao", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fixo)", precoMensal: 99.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },

  // Região: especial (p.19)
  { regiaoId: "especial", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 199.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fixo: R$ 149,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial", tipo: "Banda Larga", nome: "BL 750 Mega (Single/Fixo)", precoMensal: 149.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial", tipo: "Banda Larga", nome: "BL 600 Mega (Combo)", precoMensal: 99.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fixo: R$ 119,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial", tipo: "Banda Larga", nome: "BL 600 Mega (Single/Fixo)", precoMensal: 119.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial", tipo: "Banda Larga", nome: "BL 350 Mega (Combo)", precoMensal: 79.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fixo: R$ 99,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fixo)", precoMensal: 99.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  
  // Região: especial-promo-6m (p.20)
  { regiaoId: "especial-promo-6m", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 199.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-promo-6m", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fixo: R$ 149,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-promo-6m", tipo: "Banda Larga", nome: "BL 750 Mega (Single/Fixo)", precoMensal: 149.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-promo-6m", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Combo R$ 49,90/6M)", precoMensal: 49.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM MÓVEL por 6 meses, após R$ 79,90. Preço Single/Fixo: R$ 119,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-promo-6m", tipo: "Banda Larga", nome: "BL 600 Mega (Single/Fixo)", precoMensal: 119.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-promo-6m", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fixo)", precoMensal: 89.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  
  // Região: especial-promo-3m (p.21)
  { regiaoId: "especial-promo-3m", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 199.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-promo-3m", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fixo: R$ 149,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-promo-3m", tipo: "Banda Larga", nome: "BL 750 Mega (Single/Fixo)", precoMensal: 149.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-promo-3m", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Combo R$ 59,90/3M)", precoMensal: 59.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM MÓVEL por 3 meses, após R$ 99,90. Preço Single/Fixo: R$ 119,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-promo-3m", tipo: "Banda Larga", nome: "BL 600 Mega (Single/Fixo)", precoMensal: 119.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-promo-3m", tipo: "Banda Larga", nome: "BL 350 Mega (Combo)", precoMensal: 79.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fixo: R$ 99,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-promo-3m", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fixo)", precoMensal: 99.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },

  // Região: especial-plus (p.22)
  { regiaoId: "especial-plus", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 199.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fixo: R$ 129,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus", tipo: "Banda Larga", nome: "BL 750 Mega (Single/Fixo)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus", tipo: "Banda Larga", nome: "BL 600 Mega (Combo)", precoMensal: 99.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus", tipo: "Banda Larga", nome: "BL 350 Mega (Combo)", precoMensal: 79.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fixo: R$ 89,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fixo)", precoMensal: 89.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },

  // Região: especial-plus-promo-6m (p.23)
  { regiaoId: "especial-plus-promo-6m", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 199.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus-promo-6m", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fixo: N/A. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus-promo-6m", tipo: "Banda Larga", nome: "BL 750 Mega (Single/Fixo)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus-promo-6m", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Combo R$ 49,90/6M)", precoMensal: 49.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM MÓVEL por 6 meses, após R$ 79,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus-promo-6m", tipo: "Banda Larga", nome: "BL 600 Mega (Single/Fixo)", precoMensal: 99.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus-promo-6m", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fixo)", precoMensal: 89.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },

  // Região: especial-plus-promo-3-6m (p.24)
  { regiaoId: "especial-plus-promo-3-6m", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 199.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus-promo-3-6m", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus-promo-3-6m", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Combo R$ 49,90/6M)", precoMensal: 49.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM MÓVEL por 6 meses, após R$ 79,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus-promo-3-6m", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Single R$ 59,90/3M)", precoMensal: 59.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single/Fixo por 3 meses, após R$ 99,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus-promo-3-6m", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fixo)", precoMensal: 89.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  
  // Região: especial-plus-promo-3m (p.25)
  { regiaoId: "especial-plus-promo-3m", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 199.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus-promo-3m", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus-promo-3m", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Combo R$ 59,90/3M)", precoMensal: 59.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM MÓVEL por 3 meses, após R$ 99,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus-promo-3m", tipo: "Banda Larga", nome: "BL 600 Mega (Single/Fixo)", precoMensal: 99.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus-promo-3m", tipo: "Banda Larga", nome: "BL 350 Mega (Combo)", precoMensal: 79.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus-promo-3m", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fixo)", precoMensal: 89.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  
  // Região: especial-plus-promo-3m-b (p.26)
  { regiaoId: "especial-plus-promo-3m-b", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 199.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus-promo-3m-b", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus-promo-3m-b", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Combo R$ 59,90/3M)", precoMensal: 59.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM MÓVEL por 3 meses, após R$ 99,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus-promo-3m-b", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Single R$ 59,90/3M)", precoMensal: 59.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single/Fixo por 3 meses, após R$ 119,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus-promo-3m-b", tipo: "Banda Larga", nome: "BL 350 Mega (Combo)", precoMensal: 79.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "especial-plus-promo-3m-b", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fixo)", precoMensal: 89.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },

  // Região: med-01 (p.27)
  { regiaoId: "med-01", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 204.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "med-01", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 134.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fixo: R$ 134,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "med-01", tipo: "Banda Larga", nome: "BL 750 Mega (Single/Fixo)", precoMensal: 134.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "med-01", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Combo R$ 64,90/6M)", precoMensal: 64.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM MÓVEL por 6 meses, após R$ 84,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "med-01", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Single R$ 74,90/6M)", precoMensal: 74.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single/Fixo por 6 meses, após R$ 104,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "med-01", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fixo)", precoMensal: 94.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },

  // Região: med-02 (p.28)
  { regiaoId: "med-02", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 204.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "med-02", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 134.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fixo: R$ 134,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "med-02", tipo: "Banda Larga", nome: "BL 750 Mega (Single/Fixo)", precoMensal: 134.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "med-02", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Combo R$ 54,90/6M)", precoMensal: 54.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM MÓVEL por 6 meses, após R$ 84,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "med-02", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Single R$ 64,90/6M)", precoMensal: 64.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single/Fixo por 6 meses, após R$ 104,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "med-02", tipo: "Banda Larga", nome: "BL 350 Mega (Combo)", precoMensal: 74.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fixo: R$ 84,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "med-02", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fixo)", precoMensal: 84.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },

  // Região: med-redes-neutras-02 (p.29)
  { regiaoId: "med-redes-neutras-02", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Combo R$ 54,90/6M)", precoMensal: 54.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM MÓVEL por 6 meses, após R$ 84,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "med-redes-neutras-02", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Single R$ 64,90/6M)", precoMensal: 64.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single/Fixo por 6 meses, após R$ 104,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "med-redes-neutras-02", tipo: "Banda Larga", nome: "BL 350 Mega (Combo)", precoMensal: 74.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "med-redes-neutras-02", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fixo)", precoMensal: 84.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  
  // Região: med-03 (p.30)
  { regiaoId: "med-03", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 204.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "med-03", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 134.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fixo: R$ 134,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "med-03", tipo: "Banda Larga", nome: "BL 750 Mega (Single/Fixo)", precoMensal: 134.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "med-03", tipo: "Banda Larga", nome: "BL 600 Mega (Combo)", precoMensal: 54.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM MÓVEL. Preço Single/Fixo: R$ 64,90 (6M) -> R$ 104,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "med-03", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Single R$ 64,90/6M)", precoMensal: 64.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single/Fixo por 6 meses, após R$ 104,90. Desconto R$ 5,00 DCC. Fidelidade 12m." },
  { regiaoId: "med-03", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fixo)", precoMensal: 84.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM Fixo/APP. Desconto R$ 5,00 DCC. Fidelidade 12m." },

  // --- 4. PRODUTOS DE TV (AQUISIÇÃO - p.65-68) ---
  
  // TV Padrão (p.65) - Região 'padrao' e 'especial'
  ...['padrao', 'especial'].flatMap(regiao => [
    {
      regiaoId: regiao, tipo: "TV", nome: "Claro TV+ Soundbox (Cabo) (Combo BL+Móvel)", precoMensal: 154.90, precoAnual: null,
      beneficios: [...beneficiosTVComboCompleto, "Equipamento: Soundbox (Áudio Dolby Atmos)", "Benefício Multi: ChatGPT Plus (se Multi)"],
      observacoes: "Preço COM BL E MÓVEL (p.65). Desconto de R$ 5,00 no DCC+Fatura Digital."
    },
    {
      regiaoId: regiao, tipo: "TV", nome: "Claro TV+ Soundbox (Cabo) (Single/BL/Móvel)", precoMensal: 164.90, precoAnual: null,
      beneficios: [...beneficiosTVComboCompleto, "Equipamento: Soundbox (Áudio Dolby Atmos)"],
      observacoes: "Preço COM BL OU MÓVEL ou SINGLE COM Fixo (p.65). Desconto de R$ 5,00 no DCC+Fatura Digital."
    },
    {
      regiaoId: regiao, tipo: "TV", nome: "Claro TV+ Box Cabo (Combo BL+Móvel)", precoMensal: 124.90, precoAnual: null,
      beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box Cabo (Qualidade 4K)", "Benefício Multi: ChatGPT Plus (se Multi)"],
      observacoes: "Preço COM BL E MÓVEL (p.65). Desconto de R$ 5,00 no DCC+Fatura Digital."
    },
    {
      regiaoId: regiao, tipo: "TV", nome: "Claro TV+ Box Cabo (Single/Combo Fixo)", precoMensal: 134.90, precoAnual: null,
      beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box Cabo (Qualidade 4K)"],
      observacoes: "Preço SINGLE COM Fixo (p.65). Desconto de R$ 5,00 no DCC+Fatura Digital."
    }
  ]),

  // TV Fibra Pura (p.66) - Região 'fibra-pura'
  {
    regiaoId: "fibra-pura", tipo: "TV", nome: "Claro TV+ Soundbox (Streaming) (Combo BL+Móvel)", precoMensal: 154.90, precoAnual: null,
    beneficios: [...beneficiosTVComboCompleto, "Equipamento: Soundbox (Áudio Dolby Atmos)", "Benefício Multi: ChatGPT Plus (se Multi)"],
    observacoes: "Preço COM BL E MÓVEL (p.66). Desconto de R$ 5,00 no DCC+Fatura Digital."
  },
  {
    regiaoId: "fibra-pura", tipo: "TV", nome: "Claro TV+ Box (Streaming) (Combo BL+Móvel)", precoMensal: 124.90, precoAnual: null,
    beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box Streaming", "Benefício Multi: ChatGPT Plus (se Multi)"],
    observacoes: "Preço COM BL E MÓVEL (p.66). Desconto de R$ 5,00 no DCC+Fatura Digital."
  },
  {
    regiaoId: "fibra-pura", tipo: "TV", nome: "Claro TV+ Box (Streaming) (Single/Combo Fixo)", precoMensal: 134.90, precoAnual: null,
    beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box Streaming"],
    observacoes: "Preço SINGLE COM Fixo (p.66). Desconto de R$ 5,00 no DCC+Fatura Digital."
  },
  
  // TV MED (p.67) - Todas as outras regiões
  ...['med-01', 'med-02', 'med-03', 'especial-promo-6m', 'especial-promo-3m', 'especial-plus', 'especial-plus-promo-6m', 'especial-plus-promo-3-6m', 'especial-plus-promo-3m', 'especial-plus-promo-3m-b', 'med-redes-neutras-02'].flatMap(regiao => [
    {
      regiaoId: regiao, tipo: "TV", nome: "Claro TV+ Soundbox (Cabo) (Combo BL+Móvel)", precoMensal: 154.90, precoAnual: null,
      beneficios: [...beneficiosTVComboCompleto, "Equipamento: Soundbox (Áudio Dolby Atmos)", "Benefício Multi: ChatGPT Plus (se Multi)"],
      observacoes: "Preço MED (p.67). Desconto R$ 5,00 DCC."
    },
    {
      regiaoId: regiao, tipo: "TV", nome: "Claro TV+ Soundbox (Cabo) (Single/BL/Móvel)", precoMensal: 164.90, precoAnual: null,
      beneficios: [...beneficiosTVComboCompleto, "Equipamento: Soundbox (Áudio Dolby Atmos)"],
      observacoes: "Preço MED (p.67). Desconto R$ 5,00 DCC."
    },
    {
      regiaoId: regiao, tipo: "TV", nome: "Claro TV+ Soundbox (Streaming) (Combo BL+Móvel)", precoMensal: 154.90, precoAnual: null,
      beneficios: [...beneficiosTVComboCompleto, "Equipamento: Soundbox (Áudio Dolby Atmos)", "Benefício Multi: ChatGPT Plus (se Multi)"],
      observacoes: "Preço MED (p.67). Desconto R$ 5,00 DCC."
    },
    {
      regiaoId: regiao, tipo: "TV", nome: "Claro TV+ Soundbox (Streaming) (Single/BL/Móvel)", precoMensal: 164.90, precoAnual: null,
      beneficios: [...beneficiosTVComboCompleto, "Equipamento: Soundbox (Áudio Dolby Atmos)"],
      observacoes: "Preço MED (p.67). Desconto R$ 5,00 DCC."
    },
    {
      regiaoId: regiao, tipo: "TV", nome: "Claro TV+ Box Cabo (Combo BL+Móvel)", precoMensal: 104.90, precoAnual: null,
      beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box Cabo (Qualidade 4K)", "Benefício Multi: ChatGPT Plus (se Multi)"],
      observacoes: "Preço MED (p.67). Desconto R$ 5,00 DCC."
    },
    {
      regiaoId: regiao, tipo: "TV", nome: "Claro TV+ Box Cabo (Single/Combo Fixo)", precoMensal: 134.90, precoAnual: null,
      beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box Cabo (Qualidade 4K)"],
      observacoes: "Preço MED (p.67). Desconto R$ 5,00 DCC."
    },
    {
      regiaoId: regiao, tipo: "TV", nome: "Claro TV+ Box (Streaming) (Combo BL+Móvel)", precoMensal: 104.90, precoAnual: null,
      beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box Streaming", "Benefício Multi: ChatGPT Plus (se Multi)"],
      observacoes: "Preço MED (p.67). Desconto R$ 5,00 DCC."
    },
    {
      regiaoId: regiao, tipo: "TV", nome: "Claro TV+ Box (Streaming) (Single/Combo Fixo)", precoMensal: 134.90, precoAnual: null,
      beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box Streaming"],
      observacoes: "Preço MED (p.67). Desconto R$ 5,00 DCC."
    }
  ]),

  // TV Área Não Cabeada (p.68)
  {
    regiaoId: "nacional", tipo: "TV", nome: "Claro TV+ Box (Não Cabeada) (Combo Móvel)", precoMensal: 124.90, precoAnual: null,
    beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box Streaming", "Benefício Multi: ChatGPT Plus (se Multi)"],
    observacoes: "Preço para ÁREA NÃO CABEADA (p.68). Desconto R$ 5,00 DCC."
  },
  {
    regiaoId: "nacional", tipo: "TV", nome: "Claro TV+ Box (Não Cabeada) (Single/Fixo)", precoMensal: 134.90, precoAnual: null,
    beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box Streaming"],
    observacoes: "Preço para ÁREA NÃO CABEADA (p.68). Desconto R$ 5,00 DCC."
  },
  
  // TV App/Streamings (p.70)
  {
    regiaoId: "nacional", tipo: "TV", nome: "Claro TV+ App (Anual)", precoMensal: 99.90, precoAnual: 1198.90,
    beneficios: ["Mais de 120 canais ao vivo", "Netflix (Padrão com Anúncios)", "HBO Max (Básico com Anúncios)", "Apple TV+", "Disney+ (Padrão com Anúncios)", "Amazon Prime Video", "Amazon Music, Prime Gaming, Prime Reading e Frete Grátis", "Acesso por App (sem equipamento)", "Contratação 100% Digital (Cartão de Crédito)"],
    observacoes: "Pagamento anual (12x R$ 99,90). Não possui benefícios Multi."
  },
  {
    regiaoId: "nacional", tipo: "TV", nome: "Claro TV+ App (Mensal)", precoMensal: 109.90, precoAnual: null,
    beneficios: ["Mais de 120 canais ao vivo", "Netflix (Padrão com Anúncios)", "HBO Max (Básico com Anúncios)", "Apple TV+", "Disney+ (Padrão com Anúncios)", "Amazon Prime Video", "Amazon Music, Prime Gaming, Prime Reading e Frete Grátis", "Acesso por App (sem equipamento)", "Contratação 100% Digital (Cartão de Crédito)"],
    observacoes: "Preço promocional R$ 65,40 por 2 meses. Não possui benefícios Multi."
  },
  {
    regiaoId: "nacional", tipo: "TV", nome: "Claro TV+ Streamings (Anual)", precoMensal: 69.90, precoAnual: 838.80,
    beneficios: ["NÃO inclui canais ao vivo", "Netflix (Padrão com Anúncios)", "HBO Max (Básico com Anúncios)", "Apple TV+", "Disney+ (Padrão com Anúncios)", "Amazon Prime Video", "Amazon Music, Prime Gaming, Prime Reading e Frete Grátis", "Acesso por App (sem equipamento)", "Contratação 100% Digital (Cartão de Crédito)"],
    observacoes: "Pagamento anual (12x R$ 69,90). Não possui benefícios Multi."
  },
  {
    regiaoId: "nacional", tipo: "TV", nome: "Claro TV+ Streamings (Mensal)", precoMensal: 79.90, precoAnual: null,
    beneficios: ["NÃO inclui canais ao vivo", "Netflix (Padrão com Anúncios)", "HBO Max (Básico com Anúncios)", "Apple TV+", "Disney+ (Padrão com Anúncios)", "Amazon Prime Video", "Amazon Music, Prime Gaming, Prime Reading e Frete Grátis", "Acesso por App (sem equipamento)", "Contratação 100% Digital (Cartão de Crédito)"],
    observacoes: "Não possui benefícios Multi."
  },

  // TV Upgrade (p.71) - SEM DISNEY/AMAZON
  {
    regiaoId: "nacional", tipo: "TV", nome: "Claro TV+ Soundbox (Upgrade)", precoMensal: 154.90, precoAnual: null,
    beneficios: [...beneficiosTVComboUpgrade, "Equipamento: Soundbox (Áudio Dolby Atmos)"],
    observacoes: "Preço de UPGRADE (p.71). SEM Disney/Amazon. Desconto R$ 5,00 DCC. Fidelidade 12m."
  },
  {
    regiaoId: "nacional", tipo: "TV", nome: "Claro TV+ Box Cabo (Upgrade)", precoMensal: 144.90, precoAnual: null,
    beneficios: [...beneficiosTVComboUpgrade, "Equipamento: Box Cabo (Qualidade 4K)"],
    observacoes: "Preço de UPGRADE (p.71). SEM Disney/Amazon. Desconto R$ 5,00 DCC. Fidelidade 12m."
  },
  {
    regiaoId: "nacional", tipo: "TV", nome: "Claro TV+ Box (Streaming) (Upgrade)", precoMensal: 104.90, precoAnual: null,
    beneficios: [...beneficiosTVComboUpgrade, "Equipamento: Box Streaming"],
    observacoes: "Preço de UPGRADE (p.71). SEM Disney/Amazon. Desconto R$ 5,00 DCC. Fidelidade 12m."
  },
  {
    regiaoId: "nacional", tipo: "TV", nome: "Claro TV+ HD (Upgrade TOP HD)", precoMensal: 124.90, precoAnual: null,
    beneficios: [...beneficiosTVComboUpgrade, "Equipamento: Decodificador HD"],
    observacoes: "Preço de UPGRADE (p.71). SEM Disney/Amazon. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: CTV+ TOP HD RET ANUNCIO FID"
  },
  // NOVOS PLANOS HD (RENTABILIZAÇÃO)
  {
    regiaoId: "nacional", tipo: "TV", nome: "Claro TV+ HD (Upgrade INICIAL HD)", precoMensal: 69.90, precoAnual: null,
    beneficios: ["Pacote Inicial HD (Canais Abertos/Cortesia)", "Globoplay Canais Incluso"],
    observacoes: "Preço de UPGRADE (p.71). SEM Disney/Amazon. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: INICIAL HD RET ANUNCIO FID"
  },
  {
    regiaoId: "nacional", tipo: "TV", nome: "Claro TV+ HD (Upgrade INICIAL TELECINE)", precoMensal: 79.90, precoAnual: null,
    beneficios: ["Pacote Inicial HD", "Acesso aos canais Telecine", "Globoplay Canais Incluso"],
    observacoes: "Preço de UPGRADE (p.71). SEM Disney/Amazon. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: INICIAL HD RET ANUNCIO TELECINE FID"
  },

  // --- 5. Fixo (PDF 2, p.81) ---
  {
    regiaoId: "nacional", tipo: "Fixo", nome: "Fixo Ilimitado Mundo Total (Combo 3P)", precoMensal: 35.00, precoAnual: null,
    beneficios: [
      "Ligações Nacionais Ilimitadas (Fixo e Celular de qualquer operadora)",
      "Ligações Ilimitadas para Celulares dos EUA",
      "Ligações Ilimitadas para Fixos de 35 países:",
      "Alemanha, Argentina, Austrália, Áustria, Bélgica, Bolívia, Canadá",
      "Chile, Cingapura, China, Coreia do Sul, Dinamarca, Espanha, EUA (Havaí/Alasca)",
      "França, Grécia, Holanda, Hungria, Hong Kong, Irlanda, Itália, Israel",
      "Japão, México, Noruega, Nova Zelândia, Porto Rico, Portugal (Açores/Madeira)",
      "Peru, Polônia, Reino Unido, Rep. Tcheca, Suécia, Suíça e Venezuela"
    ],
    observacoes: "Preço na combinação Fixo+BL+TV ou Fixo+BL+MOVEL."
  },
  {
    regiaoId: "nacional", tipo: "Fixo", nome: "Fixo Ilimitado Mundo Total (Single/Combo 2P)", precoMensal: 65.00, precoAnual: null,
    beneficios: [
      "Ligações Nacionais Ilimitadas (Fixo e Celular de qualquer operadora)",
      "Ligações Ilimitadas para Celulares dos EUA",
      "Ligações Ilimitadas para Fixos de 35 países (lista completa acima)"
    ],
    observacoes: "Preço Single ou em combos 2P (ex: Fixo+TV)."
  },
  {
    regiaoId: "nacional", tipo: "Fixo", nome: "Fixo Ilimitado Brasil Total (Combo 4P)", precoMensal: 5.00, precoAnual: null,
    beneficios: [
      "Ligações Nacionais Ilimitadas (Fixo e Celular de qualquer operadora)"
    ],
    observacoes: "Preço na combinação Fixo+BL+MOVEL+TV."
  },
  {
    regiaoId: "nacional", tipo: "Fixo", nome: "Fixo Ilimitado Brasil Total (Single/Combo 2P/3P)", precoMensal: 35.00, precoAnual: null,
    beneficios: [
      "Ligações Nacionais Ilimitadas (Fixo e Celular de qualquer operadora)"
    ],
    observacoes: "Preço em qualquer combinação que não seja 4P."
  },

  // --- 6. PONTOS ADICIONAIS ---
  { regiaoId: "nacional", tipo: "Ponto Adicional", nome: "Ponto Adicional - Claro TV+ Soundbox (Aquisição)", precoMensal: 99.90, precoAnual: null, beneficios: ["Aluguel de 1 equipamento Soundbox (Cabo ou Streaming) adicional"], observacoes: "Valor de aluguel mensal." },
  { regiaoId: "nacional", tipo: "Ponto Adicional", nome: "Ponto Adicional - Claro TV+ Soundbox (Upgrade)", precoMensal: 69.90, precoAnual: null, beneficios: ["Aluguel de 1 equipamento Soundbox (Cabo ou Streaming) adicional"], observacoes: "Valor de aluguel mensal para clientes de upgrade." },
  { regiaoId: "nacional", tipo: "Ponto Adicional", nome: "Ponto Adicional - Claro TV+ Box (Aquisição)", precoMensal: 69.90, precoAnual: null, beneficios: ["Aluguel de 1 equipamento Box (Cabo ou Streaming) adicional"], observacoes: "Valor de aluguel mensal." },
  { regiaoId: "nacional", tipo: "Ponto Adicional", nome: "Ponto Adicional - Claro TV+ Box (Upgrade)", precoMensal: 39.90, precoAnual: null, beneficios: ["Aluguel de 1 equipamento Box (Cabo ou Streaming) adicional"], observacoes: "Valor de aluguel mensal para clientes de upgrade." },
  { regiaoId: "nacional", tipo: "Ponto Adicional", nome: "Ponto Adicional - Claro TV+ HD (Aquisição)", precoMensal: 39.90, precoAnual: null, beneficios: ["Aluguel de 1 equipamento Decodificador HD adicional"], observacoes: "Valor de aluguel mensal." },
  { regiaoId: "nacional", tipo: "Ponto Adicional", nome: "Ponto Adicional - Claro TV+ HD (RET)", precoMensal: 10.00, precoAnual: null, beneficios: ["Aluguel de 1 equipamento HD adicional para planos de Rentabilização (RET)."], observacoes: "Valor de aluguel mensal para planos INICIAL HD RET." },

  // --- 7. OPCIONAIS (CONECTIVIDADE E GAMING - p.46) ---
  { regiaoId: "nacional", tipo: "Opcional", nome: "Ponto Ultra", precoMensal: null, precoAnual: null, beneficios: ["Solução de conectividade Wi-Fi", "Melhora alcance do sinal"], observacoes: "Taxa única de R$ 150,00 (em até 3x)." },
  { regiaoId: "nacional", tipo: "Opcional", nome: "Claro Geek", precoMensal: 9.90, precoAnual: 118.80, beneficios: ["Suporte técnico especializado para dispositivos"], observacoes: "Fidelidade 12 meses. Multa R$ 59,40 proporcional." },
  { regiaoId: "nacional", tipo: "Opcional", nome: "Geforce NOW (Avulso)", precoMensal: 63.90, precoAnual: null, beneficios: ["Plataforma de streaming de jogos na nuvem"], observacoes: "" },
  { regiaoId: "nacional", tipo: "Opcional", nome: "Abya Go", precoMensal: 25.90, precoAnual: null, beneficios: ["Plataforma de streaming de jogos"], observacoes: "" },
  { regiaoId: "nacional", tipo: "Opcional", nome: "No Ping", precoMensal: 10.00, precoAnual: null, beneficios: ["Redutor de latência (ping) para jogos online"], observacoes: "" },
  { regiaoId: "nacional", tipo: "Opcional", nome: "Claro SmartHome (1 Câmera)", precoMensal: 29.90, precoAnual: 358.80, beneficios: ["Monitoramento com 1 Câmera HD Wi-Fi (interna)", "Equipamento em comodato"], observacoes: "Fidelidade 12 meses. Multa R$ 500,00 proporcional." },
  { regiaoId: "nacional", tipo: "Opcional", nome: "Extensor Wi-Fi Mesh (Comodato)", precoMensal: 30.00, precoAnual: 360.00, beneficios: ["Kit com 2 extensores para melhorar o sinal Wi-Fi"], observacoes: "Fidelidade 12 meses. Multa R$ 300,00 por extensor." },

  // --- 8. OPCIONAIS (A LA CARTE - STREAMING - p.47-48, 73-78) ---
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

  // --- 10. OPCIONAIS (ADULTOS) ---
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


// =============================================================================
// 4. O SCRIPT DE UPLOAD (NÃO MEXA AQUI)
// =============================================================================

function createProductId(produto: Omit<typeof produtosParaCadastrar[0], 'id'>): string {
    const name = produto.nome.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const type = produto.tipo.toLowerCase().replace(/\s/g, '');
    const region = produto.regiaoId;
    return `${region}-${type}-${name}-${produto.precoMensal}`;
}

/**
 * Função principal para semear o banco de dados.
 */
async function seedDatabase() {
  console.log('Iniciando o script de semeadura (V9.0 - 100% GRANULAR)...');

  try {
    // --- LIMPEZA DE PRODUTOS ANTIGOS ---
    console.log('Limpando a coleção de produtos existente...');
    const produtosCollection = collection(db, 'produtos');
    const produtosSnapshot = await getDocs(produtosCollection);
    const deleteBatch = writeBatch(db);
    produtosSnapshot.docs.forEach((doc) => {
      deleteBatch.delete(doc.ref);
    });
    await deleteBatch.commit();
    console.log(`✅ ${produtosSnapshot.size} produtos antigos foram removidos.`);


    // --- UPLOAD DAS REGIÕES ---
    console.log(`Iniciando upload de ${regioesParaCadastrar.length} regiões...`);
    const regioesBatch = writeBatch(db);
    
    regioesParaCadastrar.forEach((regiao) => {
      const regiaoRef = doc(db, 'regioes', regiao.id);
      regioesBatch.set(regiaoRef, {
        nome: regiao.nome,
        cidades: regiao.cidades
      });
    });

    await regioesBatch.commit();
    console.log(`✅ ${regioesParaCadastrar.length} Regiões cadastradas/sobrescritas com sucesso!`);

    // --- UPLOAD DOS PRODUTOS ---
    console.log(`Iniciando upload de ${produtosParaCadastrar.length} produtos...`);
    // O Firestore limita as operações de batch a 500.
    const CHUNK_SIZE = 499;
    const productChunks = [];
    for (let i = 0; i < produtosParaCadastrar.length; i += CHUNK_SIZE) {
        productChunks.push(produtosParaCadastrar.slice(i, i + CHUNK_SIZE));
    }

    for (let i = 0; i < productChunks.length; i++) {
        console.log(`Processando lote de produtos ${i + 1} de ${productChunks.length}...`);
        const batch = writeBatch(db);
        const chunk = productChunks[i];
        
        chunk.forEach((produtoData) => {
            const produtoId = createProductId(produtoData as any);
            const produtoRef = doc(db, 'produtos', produtoId);
            const dataToSet = {
                ...produtoData,
                id: produtoId, // Garante que o ID está no documento
                precoMensal: produtoData.precoMensal ?? 0,
                precoAnual: (produtoData as any).precoAnual || null, // Garante que o campo exista
                fidelidade: (produtoData as any).fidelidade || 'Não informado',
                observacoes: (produtoData as any).observacoes || ''
            };
            batch.set(produtoRef, dataToSet);
        });
        
        await batch.commit();
        console.log(`✅ Lote ${i + 1} cadastrado com sucesso!`);
    }
    
    console.log(`✅ TOTAL de ${produtosParaCadastrar.length} Produtos cadastrados/sobrescritos com sucesso!`);
    console.log('🚀 Semeadura do banco de dados concluída!');

  } catch (error) {
    console.error('❌ Erro durante a semeadura do banco de dados:', error);
  }
}

// Roda a função
seedDatabase();
    


    