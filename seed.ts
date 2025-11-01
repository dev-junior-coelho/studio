
// seed.ts
// Script para popular (semear) o banco de dados do Firestore com os produtos da Claro.
// Rode este script APENAS UMA VEZ.

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';

// =============================================================================
// 1. CONFIGURE O SEU FIREBASE AQUI
// =============================================================================
// Cole as credenciais do seu projeto Firebase aqui.
// Você encontra isso no Console do Firebase > Configurações do Projeto
const firebaseConfig = {
  apiKey: "AIzaSyD_IW8CfZMseq-LsWkQoZnzEobByPywbss",
  authDomain: "studio-878079588-1d0ae.firebaseapp.com",
  projectId: "studio-878079588-1d0ae",
  storageBucket: "studio-878079588-1d0ae.appspot.com",
  messagingSenderId: "486175528141",
  appId: "1:486175528141:web:4e4d4d291cd8e099c28584"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =============================================================================
// 2. DADOS DAS REGIÕES (Extraído dos PDFs)
// =============================================================================
// Primeiro, definimos as regiões comerciais e suas cidades.
const regioesParaCadastrar = [
  {
    id: "padrao",
    nome: "Padrão",
    cidades: ["Almirante Tamandare-PR", "Araucaria-PR", "Campo Largo-PR", "Colombo-PR", "Pinhais-PR", "Itapevi-SP", "Jandira-SP", "Tiete-SP", "Vargem Grande Paulista-SP", "Canoas-RS", "Caxias Do Sul-RS", "Esteio-RS", "Farroupilha-RS", "Florianopolis-SC", "Joinville-SC", "Londrina-PR", "Porto Alegre-RS", "Sao Jose Dos Pinhais-PR", "Sao Jose-SC", "Sapucaia Do Sul-RS", "Americana-SP", "Araras-SP", "Atibaia-SP", "Barueri-SP", "Belo Horizonte-MG", "Braganca Paulista-SP", "Campinas-SP", "Contagem-MG", "Cotia-SP", "Cubatao-SP", "Diadema-SP", "Elias Fausto-SP", "Guarulhos-SP", "Itu-SP", "Jundiai-SP", "Mogi Mirim-SP", "Monte Mor-SP", "Osasco-SP", "Piracicaba-SP", "Poa-SP", "Porto Feliz-SP", "Rafard-SP", "Rio Claro-SP", "Rio De Janeiro-RJ", "Sabara-MG", "Salto-SP", "Santa Barbara DOeste-SP", "Santana De Parnaiba-SP", "Santo Andre-SP", "Sao Bernardo Do Campo-SP", "Sao Caetano Do Sul-SP", "Sao Goncalo-RJ", "Sao Paulo-SP", "Sertaozinho-SP", "Suzano-SP", "Taboao Da Serra-SP", "Brasilia-DF", "Manaus-AM", "Lauro De Freitas-BA", "Salvador-BA"]
  },
  {
    id: "especial",
    nome: "Especial",
    cidades: ["Arapongas-PR", "Curitiba-PR", "Gravatai-RS", "Novo Hamburgo-RS", "Palhoca-SC", "Alvorada-RS", "Cachoeirinha-RS", "Viamao-RS", "Cacapava-SP", "Capivari-SP", "Carapicuiba-SP", "Cariacica-ES", "Cosmopolis-SP", "Embu Das Artes-SP", "Guaruja-SP", "Indaiatuba-SP", "Maua-SP", "Mogi Guacu-SP", "Paulinia-SP", "Valinhos-SP", "Vila Velha-ES", "Araraquara-SP", "Bauru-SP", "Franca-SP", "Jacarei-SP", "Mogi Das Cruzes-SP", "Praia Grande-SP", "Ribeirao Preto-SP", "Santos-SP", "Sao Carlos-SP", "Sao Jose Do Rio Preto-SP", "Sao Jose Dos Campos-SP", "Sao Vicente-SP", "Serra-ES", "Sorocaba-SP", "Taubate-SP", "Vinhedo-SP", "Vitoria-ES", "Votorantim-SP", "Cuiaba-MT", "Varzea Grande-MT", "Ananindeua-PA", "Palmas-TO", "Belem-PA", "Porto Velho-RO", "Rio Branco-AC", "Recife-PE", "Sao Luis-MA"]
  },
  {
    id: "especial-promo-6m",
    nome: "Especial (Promo 6 Meses)",
    cidades: ["Cabedelo-PB", "Jaboatao Dos Guararapes-PE", "Joao Pessoa-PB", "Natal-RN", "Parnamirim-RN", "Maceio-AL", "Olinda-PE", "Paulista-PE"]
  },
  {
    id: "especial-promo-3m",
    nome: "Especial (Promo 3 Meses)",
    cidades: ["Campo Grande-MS"]
  },
  {
    id: "especial-plus",
    nome: "Especial+",
    cidades: ["Rio Grande-RS", "Maringa-PR", "Pelotas-RS", "Jau-SP", "Mesquita-RJ", "Biguacu-SC", "Aluminio-SP", "Caraguatatuba-SP", "Itanhaem-SP", "Itatiba-SP", "Jaguariuna-SP", "Mirassol-SP", "Morungaba-SP", "Sao Sebastiao-SP", "Ubatuba-SP", "Mongagua-SP", "Santana-AP"]
  },
  {
    id: "especial-plus-promo-6m",
    nome: "Especial+ (Promo 6 Meses)",
    cidades: ["Fortaleza-CE", "Teresina-PI", "Lagoa Santa-MG", "Santa Luzia-MG", "Vespasiano-MG", "Macapa-AP"]
  },
  {
    id: "especial-plus-promo-3-6m",
    nome: "Especial+ (Promo 3/6 Meses)",
    cidades: ["Aracaju-SE", "Aquiraz-CE", "Eusebio-CE"]
  },
  {
    id: "especial-plus-promo-3m",
    nome: "Especial+ (Promo 3 Meses)",
    cidades: ["Aparecida De Goiania-GO", "Goiania-GO"]
  },
  {
    id: "especial-plus-promo-3m-b",
    nome: "Especial+ (Promo 3 Meses B)",
    cidades: ["Belford Roxo-RJ", "Betim-MG", "Duque De Caxias-RJ", "Nova Odessa-SP", "Sao Joao De Meriti-RJ", "Sao Leopoldo-RS", "Niteroi-RJ", "Artur Nogueira-SP", "Bertioga-SP", "Hortolandia-SP", "Limeira-SP", "Nilopolis-RJ", "Nova Iguacu-RJ", "Nova Lima-MG", "Sumare-SP", "Sao Francisco Do Sul-SC", "Americo Brasiliense-SP", "Cabreuva-SP", "Cajamar-SP", "Campo Limpo Paulista-SP", "Cordeiropolis-SP", "Itaguai-RJ", "Itaquaquecetuba-SP", "Jarinu-SP", "Piracaia-SP", "Santa Gertrudes-SP", "Santa Isabel-SP", "Varzea Paulista-SP"]
  },
  {
    id: "med-01",
    nome: "Mercados em Desenvolvimento 01",
    cidades: ["Campina Grande-PB", "Balneario Camboriu-SC", "Cachoeira Paulista-SP", "Cruzeiro-SP", "Rio Das Ostras-RJ", "Dourados-MS", "Caruaru-PE", "Vitoria Da Conquista-BA", "Cacador-SC", "Camboriu-SC", "Eldorado Do Sul-RS", "Guaiba-RS", "Lages-SC", "Montenegro-RS", "Paranagua-PR", "Rio Negrinho-SC", "Sao Borja-RS", "Amparo-SP", "Barrinha-SP", "Boituva-SP", "Cabo Frio-RJ", "Guaira-SP", "Nova Friburgo-RJ", "Orlandia-SP", "Piedade-SP", "Pocos De Caldas-MG", "Pouso Alegre-MG", "Sao Joao Da Boa Vista-SP", "Sao Joaquim Da Barra-SP", "Serrana-SP", "Tremembe-SP", "Rio Verde-GO", "Senador Canedo-GO", "Sinop-MT", "Valparaiso De Goias-GO", "Ariquemes-RO", "Itabuna-BA", "Toledo-PR"]
  },
  {
    id: "med-02",
    nome: "Mercados em Desenvolvimento 02",
    cidades: ["Cianorte-PR", "Estancia Velha-RS", "Navegantes-SC", "Campos Dos Goytacazes-RJ", "Potim-SP", "Presidente Prudente-SP", "Teresopolis-RJ", "Bage-RS", "Bento Goncalves-RS", "Blumenau-SC", "Brusque-SC", "Campo Bom-RS", "Capao Da Canoa-RS", "Cascavel-PR", "Chapeco-SC", "Criciuma-SC", "Cruz Alta-RS", "Erechim-RS", "Guarapuava-PR", "Itajai-SC", "Itapema-SC", "Lajeado-RS", "Passo Fundo-RS", "Ponta Grossa-PR", "Santa Cruz Do Sul-RS", "Santa Maria-RS", "Sapiranga-RS", "Uruguaiana-RS", "Xangri-La-RS", "Aparecida-SP", "Aracatuba-SP", "Barra Mansa-RJ", "Botucatu-SP", "Governador Valadares-MG", "Guaratingueta-SP", "Ipatinga-MG", "Itapetininga-SP", "Juiz De Fora-MG", "Lorena-SP", "Macae-RJ", "Marilia-SP", "Petropolis-RJ", "Pindamonhangaba-SP", "Resende-RJ", "Sete Lagoas-MG", "Teofilo Otoni-MG", "Uberaba-MG", "Uberlandia-MG", "Varginha-MG", "Volta Redonda-RJ", "Anapolis-GO", "Rondonopolis-MT", "Alegrete-RS", "Ararangua-SC", "Arroio Do Meio-RS", "Cachoeira Do Sul-RS", "Camaqua-RS", "Canela-RS", "Carazinho-RS", "Carlos Barbosa-RS", "Charqueadas-RS", "Concordia-SC", "Dois Irmaos-RS", "Encantado-RS", "Estrela-RS", "Frederico Westphalen-RS", "Garibaldi-RS", "Gaspar-SC", "Gramado-RS", "Herval DOeste-SC", "Icara-SC", "Igrejinha-RS", "Imbe-RS", "Indaial-SC", "Itaqui-RS", "Ivoti-RS", "Joacaba-SC", "Mafra-SC", "Marau-RS", "Nova Petropolis-RS", "Osorio-RS", "Palmeira Das Missoes-RS", "Panambi-RS", "Parobe-RS", "Rio Pardo-RS", "Rosario Do Sul-RS", "Santa Rosa-RS", "Santana Do Livramento-RS", "Santo Angelo-RS", "Sao Bento Do Sul-SC", "Sao Gabriel-RS", "Sao Lourenco Do Sul-RS", "Sao Luiz Gonzaga-RS", "Taquara-RS", "Teutonia-RS", "Timbo-SC", "Torres-RS", "Tramandai-RS", "Tres Coroas-RS", "Tubarao-SC", "Vacaria-RS", "Venancio Aires-RS", "Vera Cruz-RS", "Veranopolis-RS", "Videira-SC", "Xanxere-SC", "Xaxim-SC", "Agudos-SP", "Alvares Machado-SP", "Andradina-SP", "Araguari-MG", "Araxa-MG", "Armacao Dos Buzios-RJ", "Avare-SP", "Bady Bassitt-SP", "Barbacena-MG", "Barretos-SP", "Batatais-SP", "Bebedouro-SP", "Birigui-SP", "Campos Do Jordao-SP", "Casa Branca-SP", "Cataguases-MG", "Catanduva-SP", "Cerquilho-SP", "Conselheiro Lafaiete-MG", "Coronel Fabriciano-MG", "Cravinhos-SP", "Descalvado-SP", "Divinopolis-MG", "Espirito Santo Do Pinhal-SP", "Fernandopolis-SP", "Garca-SP", "Guapiacu-SP", "Guararapes-SP", "Ibate-SP", "Ipero-SP", "Itabira-MG", "Itajuba-MG", "Itapira-SP", "Itauna-MG", "Ituiutaba-MG", "Ituverava-SP", "Jaboticabal-SP", "Jardinopolis-SP", "Jose Bonifacio-SP", "Laranjal Paulista-SP", "Lavras-MG", "Leme-SP", "Lencois Paulista-SP", "Lins-SP", "Louveira-SP", "Manhuacu-MG", "Matao-SP", "Miguel Pereira-RJ", "Mirandopolis-SP", "Mococa-SP", "Monte Alto-SP", "Montes Claros-MG", "Olimpia-SP", "Ourinhos-SP", "Para De Minas-MG", "Paraiba Do Sul-RJ", "Passos-MG", "Patos De Minas-MG", "Pedreira-SP", "Penapolis-SP", "Pirassununga-SP", "Pontal-SP", "Porto Ferreira-SP", "Potirendaba-SP", "Presidente Bernardes-SP", "Promissao-SP", "Santa Cruz das Palmeiras-SP", "Santa Rosa De Viterbo-SP", "Sao Joao Del Rei-MG", "Sao Jose Do Rio Pardo-SP", "Sao Pedro Da Aldeia-RJ", "Serra Negra-SP", "Tambau-SP", "Tatui-SP", "Timoteo-MG", "Tres Coracoes-MG", "Tres Rios-RJ", "Uba-MG", "Valenca-RJ", "Valparaiso-SP", "Vassouras-RJ", "Vicosa-MG", "Votuporanga-SP", "Caldas Novas-GO", "Formosa-GO", "Itumbiara-GO", "Jatai-GO", "Lucas Do Rio Verde-MT", "Navirai-MS", "Nova Mutum-MT", "Ponta Pora-MS", "Santa Helena De Goias-GO", "Sorriso-MT", "Tres Lagoas-MS", "Trindade-GO", "Araguaina-TO", "Cacoal-RO", "Castanhal-PA", "Gurupi-TO", "Ji-Parana-RO", "Maraba-PA", "Paragominas-PA", "Paraiso Do Tocantins-TO", "Parauapebas-PA", "Vilhena-RO", "Alagoinhas-BA", "Arapiraca-AL", "Barreiras-BA", "Caxias-MA", "Eunapolis-BA", "Feira De Santana-BA", "Ilheus-BA", "Imperatriz-MA", "Jequie-BA", "Juazeiro-BA", "Parnaiba-PI", "Petrolina-PE", "Porto Seguro-BA", "Teixeira De Freitas-BA", "Timon-MA", "Campina Grande do Sul-PR", "Campo Mourao-PR", "Castro-PR", "Cornelio Procopio-PR", "Fazenda Rio Grande-PR", "Foz Do Iguacu-PR", "Francisco Beltrao-PR", "Guaratuba-PR", "Ibipora-PR", "Ijui-RS", "Marechal Candido Rondon-PR", "Matinhos-PR", "Medianeira-PR", "Paicandu-PR", "Palmas-PR", "Pato Branco-PR", "Piraquara-PR", "Quatro Barras-PR", "Sarandi-PR", "Telemaco Borba-PR", "Umuarama-PR", "Uniao Da Vitoria-PR", "Luziania-GO", "Paulo Afonso-BA"]
  },
  {
    id: "med-redes-neutras-02",
    nome: "Redes Neutras MED 02",
    cidades: ["Alfenas-MG", "Arcos-MG", "Formiga-MG", "Guaxupe-MG", "Joao Monlevade-MG", "Lagoa da Prata-MG", "Leopoldina-MG", "Mariana-MG", "Matozinhos-MG", "Monte Carmelo-MG", "Muriae-MG", "Nova Serrana-MG", "Ouro Preto-MG", "Patrocinio-MG", "Pedro Leopoldo-MG", "Piumhi-MG", "Ponte Nova-MG", "Sacramento-MG", "Santa Cruz de Minas-MG", "Santa Rita Do Sapucai-MG", "Sao Sebastiao do Paraiso-MG"]
  },
  {
    id: "med-03",
    nome: "Mercados em Desenvolvimento 03",
    cidades: ["Cachoeiro De Itapemirim-ES", "Fraiburgo-SC", "Rio Do Sul-SC", "Adamantina-SP", "Aracruz-ES", "Colatina-ES", "Dracena-SP", "Ibiuna-SP", "Itapeva-SP", "Jales-SP", "Registro-SP", "Santa Cruz Do Rio Pardo-SP", "Juazeiro Do Norte-CE", "Mossoro-RN", "Sobral-CE"]
  },
  {
    id: "nacional",
    nome: "Nacional (Móvel)",
    cidades: [] // Usado para produtos móveis que são nacionais
  }
];

// =============================================================================
// 3. DADOS DOS PRODUTOS (Extraído dos PDFs)
// =============================================================================
// Agora, definimos os produtos e os vinculamos às regiões.

const produtosParaCadastrar = [
  // --- PRODUTOS MÓVEIS (PÓS - MULTI) ---
  {
    regiaoId: "nacional",
    tipo: "Movel",
    nome: "Claro Pós 60GB (Multi)",
    preco: 59.90,
    beneficios: ["25GB (plano) + 25GB (redes) + 10GB (bônus)", "Apps (TikTok, Insta, etc.)", "0 dependentes", "ChatGPT Plus (4 Meses)"],
    observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital."
  },
  {
    regiaoId: "nacional",
    tipo: "Movel",
    nome: "Claro Pós 110GB (Multi)",
    preco: 119.90,
    beneficios: ["50GB (plano) + 50GB (redes) + 10GB (bônus)", "Apps (TikTok, Insta, etc.)", "0 dependentes", "Passaporte Américas", "ChatGPT Plus (4 Meses)"],
    observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital."
  },
  {
    regiaoId: "nacional",
    tipo: "Movel",
    nome: "Claro Pós 210GB (Multi)",
    preco: 169.90,
    beneficios: ["100GB (plano) + 100GB (redes) + 10GB (bônus)", "Apps (TikTok, Insta, etc.)", "1 dependente grátis", "ChatGPT Plus (4 Meses)"],
    observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital."
  },
  {
    regiaoId: "nacional",
    tipo: "Movel",
    nome: "Claro Pós 310GB (Multi)",
    preco: 219.90,
    beneficios: ["150GB (plano) + 150GB (redes) + 10GB (bônus)", "Apps (TikTok, Insta, etc.)", "2 dependentes grátis", "Passaporte Américas", "ChatGPT Plus (4 Meses)"],
    observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital."
  },
  {
    regiaoId: "nacional",
    tipo: "Movel",
    nome: "Claro Pós 610GB (Multi)",
    preco: 319.90,
    beneficios: ["300GB (plano) + 300GB (redes) + 10GB (bônus)", "Apps (TikTok, Insta, etc.)", "3 dependentes grátis", "Passaporte Mundo", "ChatGPT Plus (4 Meses)"],
    observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital."
  },

  // --- PRODUTOS MÓVEIS (CONTROLE - MULTI) ---
  {
    regiaoId: "nacional",
    tipo: "Movel",
    nome: "Claro Controle 30GB (Multi)",
    preco: 44.90,
    beneficios: ["20GB (plano) + 5GB (redes) + 5GB (bônus)", "Apps (TikTok, Insta, etc.)", "ChatGPT Plus (2 Meses)"],
    observacoes: "Desconto de R$ 5,00 no DCC+Fatura Digital."
  },
  {
    regiaoId: "nacional",
    tipo: "Movel",
    nome: "Claro Controle 35GB (Multi)",
    preco: 69.90,
    beneficios: ["25GB (plano) + 5GB (redes) + 5GB (bônus)", "Apps (TikTok, Insta, etc.)", "ChatGPT Plus (2 Meses)"],
    observacoes: "Desconto de R$ 5,00 no DCC+Fatura Digital."
  },
  {
    regiaoId: "nacional",
    tipo: "Movel",
    nome: "Claro Controle 35GB Gamer (Multi)",
    preco: 99.90,
    beneficios: ["25GB (plano) + 5GB (redes) + 5GB (bônus)", "Geforce NOW", "Apps (TikTok, Insta, etc.)", "ChatGPT Plus (2 Meses)"],
    observacoes: "Desconto de R$ 5,00 no DCC+Fatura Digital."
  },

  // --- PRODUTOS BANDA LARGA (Separados por Região) ---
  // PADRÃO (p. 18)
  {
    regiaoId: "padrao",
    tipo: "Banda Larga",
    nome: "BL 350 Mega",
    preco: 79.90, // Preço COM TV OU MÓVEL
    preco_single: 99.90, // Preço COM FONE OU APP
    beneficios: ["Globoplay"],
    observacoes: "Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  {
    regiaoId: "padrao",
    tipo: "Banda Larga",
    nome: "BL 600 Mega",
    preco: 99.90,
    preco_single: 119.90,
    beneficios: ["Globoplay"],
    observacoes: "Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  {
    regiaoId: "padrao",
    tipo: "Banda Larga",
    nome: "BL 750 Mega",
    preco: 129.90,
    preco_single: 149.90,
    beneficios: ["Globoplay"],
    observacoes: "Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  
  // ESPECIAL (p. 19)
  {
    regiaoId: "especial",
    tipo: "Banda Larga",
    nome: "BL 350 Mega",
    preco: 79.90,
    preco_single: 99.90,
    beneficios: ["Globoplay"],
    observacoes: "Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  {
    regiaoId: "especial",
    tipo: "Banda Larga",
    nome: "BL 600 Mega",
    preco: 99.90,
    preco_single: 119.90,
    beneficios: ["Globoplay"],
    observacoes: "Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  {
    regiaoId: "especial",
    tipo: "Banda Larga",
    nome: "BL 750 Mega",
    preco: 129.90,
    preco_single: 149.90,
    beneficios: ["Globoplay"],
    observacoes: "Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },

  // ESPECIAL COM PROMO 6M (p. 20)
  {
    regiaoId: "especial-promo-6m",
    tipo: "Banda Larga",
    nome: "BL 600 Mega (Promo 6M)",
    preco: 49.90,
    preco_single: 119.90, // Promoção parece ser só para combo
    beneficios: ["Globoplay"],
    observacoes: "Preço COM MÓVEL por 6 meses, após R$ 79,90. Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  
  // ... (Repetir para TODAS as regiões. Vou focar na MED-02 que é a sua) ...
  
  // MERCADOS EM DESENVOLVIMENTO 02 (p. 28) - (Sua Região, Feira de Santana)
  {
    regiaoId: "med-02",
    tipo: "Banda Larga",
    nome: "BL 350 Mega",
    preco: 74.90,
    preco_single: 84.90,
    beneficios: ["Globoplay"],
    observacoes: "Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  {
    regiaoId: "med-02",
    tipo: "Banda Larga",
    nome: "BL 600 Mega (Promo 6M)",
    preco: 54.90,
    preco_single: 64.90,
    beneficios: ["Globoplay"],
    observacoes: "Preço por 6 meses, após R$ 84,90 (combo) ou R$ 104,90 (single). Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  {
    regiaoId: "med-02",
    tipo: "Banda Larga",
    nome: "BL 750 Mega",
    preco: 134.90,
    preco_single: 134.90, // Preço parece ser o mesmo
    beneficios: ["Globoplay"],
    observacoes: "Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },

  // --- PRODUTOS DE TV (Extraído do PDF 1, p. 3 e 12) ---
  // Estes também são regionais (Cabo vs Streaming)
  {
    regiaoId: "padrao", // Cidades com CABO/FIBRA
    tipo: "TV",
    nome: "Claro TV+ Box Cabo (Combo BL+Móvel)",
    preco: 124.90,
    beneficios: ["Netflix (Anúncios)", "HBO Max (Anúncios)", "Apple TV+", "Globoplay Premium", "Disney+ (Anúncios)", "Amazon Prime"],
    observacoes: "Desconto de R$ 5,00 no DCC+Fatura Digital."
  },
  {
    regiaoId: "padrao", // Cidades com CABO/FIBRA
    tipo: "TV",
    nome: "Claro TV+ Soundbox Cabo (Combo BL+Móvel)",
    preco: 154.90,
    beneficios: ["Netflix (Anúncios)", "HBO Max (Anúncios)", "Apple TV+", "Globoplay Premium", "Disney+ (Anúncios)", "Amazon Prime"],
    observacoes: "Desconto de R$ 5,00 no DCC+Fatura Digital."
  },
  {
    regiaoId: "padrao", // Cidades com CABO/FIBRA
    tipo: "TV",
    nome: "Claro TV+ Box (Streaming) (Combo BL+Móvel)",
    preco: 124.90,
    beneficios: ["Netflix (Anúncios)", "HBO Max (Anúncios)", "Apple TV+", "Globoplay Premium", "Disney+ (Anúncios)", "Amazon Prime"],
    observacoes: "Desconto de R$ 5,00 no DCC+Fatura Digital."
  },

  // --- PRODUTOS OPCIONAIS (UPSELL - PDF 2, p. 47) ---
  {
    regiaoId: "nacional",
    tipo: "Opcional",
    nome: "Netflix Padrão (Avulso)",
    preco: 44.90,
    beneficios: ["Netflix sem anúncios, 2 telas"],
    observacoes: ""
  },
  {
    regiaoId: "nacional",
    tipo: "Opcional",
    nome: "Netflix Premium (Avulso)",
    preco: 59.90,
    beneficios: ["Netflix sem anúncios, 4 telas, 4K"],
    observacoes: ""
  },
  {
    regiaoId: "nacional",
    tipo: "Opcional",
    nome: "Max Mensal (Avulso)",
    preco: 39.90,
    beneficios: ["Acesso ao catálogo HBO Max sem anúncios"],
    observacoes: ""
  },
  {
    regiaoId: "nacional",
    tipo: "Opcional",
    nome: "Disney+ Padrão Mensal (Avulso)",
    preco: 46.90,
    beneficios: ["Acesso ao catálogo Disney+"],
    observacoes: ""
  },
  {
    regiaoId: "nacional",
    tipo: "Opcional",
    nome: "Premiere Futebol Mensal (Avulso)",
    preco: 59.90,
    beneficios: ["Acesso aos jogos do Premiere"],
    observacoes: ""
  },
  {
    regiaoId: "nacional",
    tipo: "Opcional",
    nome: "Combate HD Mensal (Avulso)",
    preco: 34.90,
    beneficios: ["Acesso ao canal Combate"],
    observacoes: ""
  },
  {
    regiaoId: "nacional",
    tipo: "Opcional",
    nome: "Extensor Wi-Fi Mesh (Comodato)",
    preco: 30.00,
    beneficios: ["Kit com 2 extensores para melhorar o sinal"],
    observacoes: "Fidelidade de 12 meses."
  },
];


// =============================================================================
// 4. O SCRIPT DE UPLOAD (NÃO MEXA AQUI)
// =============================================================================

/**
 * Função principal para semear o banco de dados.
 */
async function seedDatabase() {
  console.log('Iniciando o script de semeadura...');

  try {
    // --- UPLOAD DAS REGIÕES ---
    console.log(`Iniciando upload de ${regioesParaCadastrar.length} regiões...`);
    const regioesBatch = writeBatch(db);
    
    regioesParaCadastrar.forEach((regiao) => {
      // Cria uma referência de documento usando o ID personalizado (ex: "padrao")
      const regiaoRef = doc(db, 'regioes', regiao.id);
      regioesBatch.set(regiaoRef, {
        nome: regiao.nome,
        cidades: regiao.cidades
      });
    });

    await regioesBatch.commit();
    console.log('✅ Regiões cadastradas com sucesso!');

    // --- UPLOAD DOS PRODUTOS ---
    console.log(`Iniciando upload de ${produtosParaCadastrar.length} produtos...`);
    const produtosBatch = writeBatch(db);

    produtosParaCadastrar.forEach((produto) => {
      // Cria uma referência de documento automática (ID aleatório)
      const produtoRef = doc(collection(db, 'produtos'));
      produtosBatch.set(produtoRef, produto);
    });

    await produtosBatch.commit();
    console.log('✅ Produtos cadastrados com sucesso!');
    
    console.log('🚀 Semeadura do banco de dados concluída!');

  } catch (error) {
    console.error('❌ Erro durante a semeadura do banco de dados:', error);
  }
}

// Roda a função
seedDatabase();

    