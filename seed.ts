
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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =============================================================================
// 2. DADOS DAS REGIÕES (Extraído dos PDFs, p. 18-30)
// =============================================================================
const regioesParaCadastrar = [
  {
    id: "padrao",
    nome: "Padrão (p.18)",
    cidades: ["Almirante Tamandare-PR", "Araucaria-PR", "Campo Largo-PR", "Colombo-PR", "Pinhais-PR", "Itapevi-SP", "Jandira-SP", "Tiete-SP", "Vargem Grande Paulista-SP", "Canoas-RS", "Caxias Do Sul-RS", "Esteio-RS", "Farroupilha-RS", "Florianopolis-SC", "Joinville-SC", "Londrina-PR", "Porto Alegre-RS", "Sao Jose Dos Pinhais-PR", "Sao Jose-SC", "Sapucaia Do Sul-RS", "Americana-SP", "Araras-SP", "Atibaia-SP", "Barueri-SP", "Belo Horizonte-MG", "Braganca Paulista-SP", "Campinas-SP", "Contagem-MG", "Cotia-SP", "Cubatao-SP", "Diadema-SP", "Elias Fausto-SP", "Guarulhos-SP", "Itu-SP", "Jundiai-SP", "Mogi Mirim-SP", "Monte Mor-SP", "Osasco-SP", "Piracicaba-SP", "Poa-SP", "Porto Feliz-SP", "Rafard-SP", "Rio Claro-SP", "Rio De Janeiro-RJ", "Sabara-MG", "Salto-SP", "Santa Barbara DOeste-SP", "Santana De Parnaiba-SP", "Santo Andre-SP", "Sao Bernardo Do Campo-SP", "Sao Caetano Do Sul-SP", "Sao Goncalo-RJ", "Sao Paulo-SP", "Sertaozinho-SP", "Suzano-SP", "Taboao Da Serra-SP", "Brasilia-DF", "Manaus-AM", "Lauro De Freitas-BA", "Salvador-BA"]
  },
  {
    id: "especial",
    nome: "Especial (p.19)",
    cidades: ["Arapongas-PR", "Curitiba-PR", "Gravatai-RS", "Novo Hamburgo-RS", "Palhoca-SC", "Alvorada-RS", "Cachoeirinha-RS", "Viamao-RS", "Cacapava-SP", "Capivari-SP", "Carapicuiba-SP", "Cariacica-ES", "Cosmopolis-SP", "Embu Das Artes-SP", "Guaruja-SP", "Indaiatuba-SP", "Maua-SP", "Mogi Guacu-SP", "Paulinia-SP", "Valinhos-SP", "Vila Velha-ES", "Araraquara-SP", "Bauru-SP", "Franca-SP", "Jacarei-SP", "Mogi Das Cruzes-SP", "Praia Grande-SP", "Ribeirao Preto-SP", "Santos-SP", "Sao Carlos-SP", "Sao Jose Do Rio Preto-SP", "Sao Jose Dos Campos-SP", "Sao Vicente-SP", "Serra-ES", "Sorocaba-SP", "Taubate-SP", "Vinhedo-SP", "Vitoria-ES", "Votorantim-SP", "Cuiaba-MT", "Varzea Grande-MT", "Ananindeua-PA", "Palmas-TO", "Belem-PA", "Porto Velho-RO", "Rio Branco-AC", "Recife-PE", "Sao Luis-MA"]
  },
  {
    id: "especial-promo-6m",
    nome: "Especial Promo 6M (p.20)",
    cidades: ["Cabedelo-PB", "Jaboatao Dos Guararapes-PE", "Joao Pessoa-PB", "Natal-RN", "Parnamirim-RN", "Maceio-AL", "Olinda-PE", "Paulista-PE"]
  },
  {
    id: "especial-promo-3m",
    nome: "Especial Promo 3M (p.21)",
    cidades: ["Campo Grande-MS"]
  },
  {
    id: "especial-plus",
    nome: "Especial+ (p.22)",
    cidades: ["Rio Grande-RS", "Maringa-PR", "Pelotas-RS", "Jau-SP", "Mesquita-RJ", "Biguacu-SC", "Aluminio-SP", "Caraguatatuba-SP", "Itanhaem-SP", "Itatiba-SP", "Jaguariuna-SP", "Mirassol-SP", "Morungaba-SP", "Sao Sebastiao-SP", "Ubatuba-SP", "Mongagua-SP", "Santana-AP"]
  },
  {
    id: "especial-plus-promo-6m",
    nome: "Especial+ Promo 6M (p.23)",
    cidades: ["Fortaleza-CE", "Teresina-PI", "Lagoa Santa-MG", "Santa Luzia-MG", "Vespasiano-MG", "Macapa-AP"]
  },
  {
    id: "especial-plus-promo-3-6m",
    nome: "Especial+ Promo 3/6M (p.24)",
    cidades: ["Aracaju-SE", "Aquiraz-CE", "Eusebio-CE"]
  },
  {
    id: "especial-plus-promo-3m",
    nome: "Especial+ Promo 3M (p.25)",
    cidades: ["Aparecida De Goiania-GO", "Goiania-GO"]
  },
  {
    id: "especial-plus-promo-3m-b",
    nome: "Especial+ Promo 3M (B) (p.26)",
    cidades: ["Belford Roxo-RJ", "Betim-MG", "Duque De Caxias-RJ", "Nova Odessa-SP", "Sao Joao De Meriti-RJ", "Sao Leopoldo-RS", "Niteroi-RJ", "Artur Nogueira-SP", "Bertioga-SP", "Hortolandia-SP", "Limeira-SP", "Nilopolis-RJ", "Nova Iguacu-RJ", "Nova Lima-MG", "Sumare-SP", "Sao Francisco Do Sul-SC", "Americo Brasiliense-SP", "Cabreuva-SP", "Cajamar-SP", "Campo Limpo Paulista-SP", "Cordeiropolis-SP", "Itaguai-RJ", "Itaquaquecetuba-SP", "Jarinu-SP", "Piracaia-SP", "Santa Gertrudes-SP", "Santa Isabel-SP", "Varzea Paulista-SP"]
  },
  {
    id: "med-01",
    nome: "MED 01 (p.27)",
    cidades: ["Campina Grande-PB", "Balneario Camboriu-SC", "Cachoeira Paulista-SP", "Cruzeiro-SP", "Rio Das Ostras-RJ", "Dourados-MS", "Caruaru-PE", "Vitoria Da Conquista-BA", "Cacador-SC", "Camboriu-SC", "Eldorado Do Sul-RS", "Guaiba-RS", "Lages-SC", "Montenegro-RS", "Paranagua-PR", "Rio Negrinho-SC", "Sao Borja-RS", "Amparo-SP", "Barrinha-SP", "Boituva-SP", "Cabo Frio-RJ", "Guaira-SP", "Nova Friburgo-RJ", "Orlandia-SP", "Piedade-SP", "Pocos De Caldas-MG", "Pouso Alegre-MG", "Sao Joao Da Boa Vista-SP", "Sao Joaquim Da Barra-SP", "Serrana-SP", "Tremembe-SP", "Rio Verde-GO", "Senador Canedo-GO", "Sinop-MT", "Valparaiso De Goias-GO", "Ariquemes-RO", "Itabuna-BA", "Toledo-PR"]
  },
  {
    id: "med-02",
    nome: "MED 02 (p.28)",
    cidades: ["Cianorte-PR", "Estancia Velha-RS", "Navegantes-SC", "Campos Dos Goytacazes-RJ", "Potim-SP", "Presidente Prudente-SP", "Teresopolis-RJ", "Bage-RS", "Bento Goncalves-RS", "Blumenau-SC", "Brusque-SC", "Campo Bom-RS", "Capao Da Canoa-RS", "Cascavel-PR", "Chapeco-SC", "Criciuma-SC", "Cruz Alta-RS", "Erechim-RS", "Guarapuava-PR", "Itajai-SC", "Itapema-SC", "Lajeado-RS", "Passo Fundo-RS", "Ponta Grossa-PR", "Santa Cruz Do Sul-RS", "Santa Maria-RS", "Sapiranga-RS", "Uruguaiana-RS", "Xangri-La-RS", "Aparecida-SP", "Aracatuba-SP", "Barra Mansa-RJ", "Botucatu-SP", "Governador Valadares-MG", "Guaratingueta-SP", "Ipatinga-MG", "Itapetininga-SP", "Juiz De Fora-MG", "Lorena-SP", "Macae-RJ", "Marilia-SP", "Petropolis-RJ", "Pindamonhangaba-SP", "Resende-RJ", "Sete Lagoas-MG", "Teofilo Otoni-MG", "Uberaba-MG", "Uberlandia-MG", "Varginha-MG", "Volta Redonda-RJ", "Anapolis-GO", "Rondonopolis-MT", "Alegrete-RS", "Ararangua-SC", "Arroio Do Meio-RS", "Cachoeira Do Sul-RS", "Camaqua-RS", "Canela-RS", "Carazinho-RS", "Carlos Barbosa-RS", "Charqueadas-RS", "Concordia-SC", "Dois Irmaos-RS", "Encantado-RS", "Estrela-RS", "Frederico Westphalen-RS", "Garibaldi-RS", "Gaspar-SC", "Gramado-RS", "Herval DOeste-SC", "Icara-SC", "Igrejinha-RS", "Imbe-RS", "Indaial-SC", "Itaqui-RS", "Ivoti-RS", "Joacaba-SC", "Mafra-SC", "Marau-RS", "Nova Petropolis-RS", "Osorio-RS", "Palmeira Das Missoes-RS", "Panambi-RS", "Parobe-RS", "Rio Pardo-RS", "Rosario Do Sul-RS", "Santa Rosa-RS", "Santana Do Livramento-RS", "Santo Angelo-RS", "Sao Bento Do Sul-SC", "Sao Gabriel-RS", "Sao Lourenco Do Sul-RS", "Sao Luiz Gonzaga-RS", "Taquara-RS", "Teutonia-RS", "Timbo-SC", "Torres-RS", "Tramandai-RS", "Tres Coroas-RS", "Tubarao-SC", "Vacaria-RS", "Venancio Aires-RS", "Vera Cruz-RS", "Veranopolis-RS", "Videira-SC", "Xanxere-SC", "Xaxim-SC", "Agudos-SP", "Alvares Machado-SP", "Andradina-SP", "Araguari-MG", "Araxa-MG", "Armacao Dos Buzios-RJ", "Avare-SP", "Bady Bassitt-SP", "Barbacena-MG", "Barretos-SP", "Batatais-SP", "Bebedouro-SP", "Birigui-SP", "Campos Do Jordao-SP", "Casa Branca-SP", "Cataguases-MG", "Catanduva-SP", "Cerquilho-SP", "Conselheiro Lafaiete-MG", "Coronel Fabriciano-MG", "Cravinhos-SP", "Descalvado-SP", "Divinopolis-MG", "Espirito Santo Do Pinhal-SP", "Fernandopolis-SP", "Garca-SP", "Guapiacu-SP", "Guararapes-SP", "Ibate-SP", "Ipero-SP", "Itabira-MG", "Itajuba-MG", "Itapira-SP", "Itauna-MG", "Ituiutaba-MG", "Ituverava-SP", "Jaboticabal-SP", "Jardinopolis-SP", "Jose Bonifacio-SP", "Laranjal Paulista-SP", "Lavras-MG", "Leme-SP", "Lencois Paulista-SP", "Lins-SP", "Louveira-SP", "Manhuacu-MG", "Matao-SP", "Miguel Pereira-RJ", "Mirandopolis-SP", "Mococa-SP", "Monte Alto-SP", "Montes Claros-MG", "Olimpia-SP", "Ourinhos-SP", "Para De Minas-MG", "Paraiba Do Sul-RJ", "Passos-MG", "Patos De Minas-MG", "Pedreira-SP", "Penapolis-SP", "Pirassununga-SP", "Pontal-SP", "Porto Ferreira-SP", "Potirendaba-SP", "Presidente Bernardes-SP", "Promissao-SP", "Santa Cruz das Palmeiras-SP", "Santa Rosa De Viterbo-SP", "Sao Joao Del Rei-MG", "Sao Jose Do Rio Pardo-SP", "Sao Pedro Da Aldeia-RJ", "Serra Negra-SP", "Tambau-SP", "Tatui-SP", "Timoteo-MG", "Tres Coracoes-MG", "Tres Rios-RJ", "Uba-MG", "Valenca-RJ", "Valparaiso-SP", "Vassouras-RJ", "Vicosa-MG", "Votuporanga-SP", "Caldas Novas-GO", "Formosa-GO", "Itumbiara-GO", "Jatai-GO", "Lucas Do Rio Verde-MT", "Navirai-MS", "Nova Mutum-MT", "Ponta Pora-MS", "Santa Helena De Goias-GO", "Sorriso-MT", "Tres Lagoas-MS", "Trindade-GO", "Araguaina-TO", "Cacoal-RO", "Castanhal-PA", "Gurupi-TO", "Ji-Parana-RO", "Maraba-PA", "Paragominas-PA", "Paraiso Do Tocantins-TO", "Parauapebas-PA", "Vilhena-RO", "Alagoinhas-BA", "Arapiraca-AL", "Barreiras-BA", "Caxias-MA", "Eunapolis-BA", "Feira De Santana-BA", "Ilheus-BA", "Imperatriz-MA", "Jequie-BA", "Juazeiro-BA", "Parnaiba-PI", "Petrolina-PE", "Porto Seguro-BA", "Teixeira De Freitas-BA", "Timon-MA", "Campina Grande do Sul-PR", "Campo Mourao-PR", "Castro-PR", "Cornelio Procopio-PR", "Fazenda Rio Grande-PR", "Foz Do Iguacu-PR", "Francisco Beltrao-PR", "Guaratuba-PR", "Ibipora-PR", "Ijui-RS", "Marechal Candido Rondon-PR", "Matinhos-PR", "Medianeira-PR", "Paicandu-PR", "Palmas-PR", "Pato Branco-PR", "Piraquara-PR", "Quatro Barras-PR", "Sarandi-PR", "Telemaco Borba-PR", "Umuarama-PR", "Uniao Da Vitoria-PR", "Luziania-GO", "Paulo Afonso-BA"]
  },
  {
    id: "med-redes-neutras-02",
    nome: "Redes Neutras MED 02 (p.29)",
    cidades: ["Alfenas-MG", "Arcos-MG", "Formiga-MG", "Guaxupe-MG", "Joao Monlevade-MG", "Lagoa da Prata-MG", "Leopoldina-MG", "Mariana-MG", "Matozinhos-MG", "Monte Carmelo-MG", "Muriae-MG", "Nova Serrana-MG", "Ouro Preto-MG", "Patrocinio-MG", "Pedro Leopoldo-MG", "Piumhi-MG", "Ponte Nova-MG", "Sacramento-MG", "Santa Cruz de Minas-MG", "Santa Rita Do Sapucai-MG", "Sao Sebastiao do Paraiso-MG"]
  },
  {
    id: "med-03",
    nome: "MED 03 (p.30)",
    cidades: ["Cachoeiro De Itapemirim-ES", "Fraiburgo-SC", "Rio Do Sul-SC", "Adamantina-SP", "Aracruz-ES", "Colatina-ES", "Dracena-SP", "Ibiuna-SP", "Itapeva-SP", "Jales-SP", "Registro-SP", "Santa Cruz Do Rio Pardo-SP", "Juazeiro Do Norte-CE", "Mossoro-RN", "Sobral-CE"]
  },
  {
    id: "nacional",
    nome: "Nacional (Móvel/Opcional)",
    cidades: [] // Usado para produtos nacionais
  }
];

// =============================================================================
// 3. DADOS DOS PRODUTOS (V5.0 - 100% COMPLETA + PONTOS ADICIONAIS)
// =============================================================================

const produtosParaCadastrar = [
  // --- 1. PRODUTOS MÓVEIS (PÓS - MULTI) ---
  {
    id: "movel-pos-25gb",
    regiaoId: "nacional",
    tipo: "Movel",
    nome: "Claro Pós 25GB (Multi)",
    precoMensal: 59.90,
    beneficios: ["25GB (plano) + 25GB (redes) + 10GB (bônus)", "Apps (TikTok, Insta, etc.)", "0 dependentes", "ChatGPT Plus (4 Meses)"],
    observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital."
  },
  {
    id: "movel-pos-50gb",
    regiaoId: "nacional",
    tipo: "Movel",
    nome: "Claro Pós 50GB (Multi)",
    precoMensal: 119.90,
    beneficios: ["50GB (plano) + 50GB (redes) + 10GB (bônus)", "Apps (TikTok, Insta, etc.)", "0 dependentes", "Passaporte Américas", "ChatGPT Plus (4 Meses)"],
    observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital."
  },
  {
    id: "movel-pos-100gb",
    regiaoId: "nacional",
    tipo: "Movel",
    nome: "Claro Pós 100GB (Multi)",
    precoMensal: 169.90,
    beneficios: ["100GB (plano) + 100GB (redes) + 10GB (bônus)", "Apps (TikTok, Insta, etc.)", "1 dependente grátis", "ChatGPT Plus (4 Meses)"],
    observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital."
  },
  {
    id: "movel-pos-150gb",
    regiaoId: "nacional",
    tipo: "Movel",
    nome: "Claro Pós 150GB (Multi)",
    precoMensal: 219.90,
    beneficios: ["150GB (plano) + 150GB (redes) + 10GB (bônus)", "Apps (TikTok, Insta, etc.)", "2 dependentes grátis", "Passaporte Américas", "ChatGPT Plus (4 Meses)"],
    observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital."
  },
  {
    id: "movel-pos-300gb",
    regiaoId: "nacional",
    tipo: "Movel",
    nome: "Claro Pós 300GB (Multi)",
    precoMensal: 319.90,
    beneficios: ["300GB (plano) + 300GB (redes) + 10GB (bônus)", "Apps (TikTok, Insta, etc.)", "3 dependentes grátis", "Passaporte Mundo", "ChatGPT Plus (4 Meses)"],
    observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital."
  },

  // --- 2. PRODUTOS MÓVEIS (CONTROLE - MULTI) ---
  {
    id: "movel-controle-20gb",
    regiaoId: "nacional",
    tipo: "Movel",
    nome: "Claro Controle 20GB (Multi)",
    precoMensal: 44.90,
    beneficios: ["20GB (plano) + 5GB (redes) + 5GB (bônus)", "Apps (TikTok, Insta, etc.)", "ChatGPT Plus (2 Meses)"],
    observacoes: "Desconto de R$ 5,00 no DCC+Fatura Digital."
  },
  {
    id: "movel-controle-25gb",
    regiaoId: "nacional",
    tipo: "Movel",
    nome: "Claro Controle 25GB (Multi)",
    precoMensal: 69.90,
    beneficios: ["25GB (plano) + 5GB (redes) + 5GB (bônus)", "Apps (TikTok, Insta, etc.)", "ChatGPT Plus (2 Meses)"],
    observacoes: "Desconto de R$ 5,00 no DCC+Fatura Digital."
  },
  {
    id: "movel-controle-25gb-gamer",
    regiaoId: "nacional",
    tipo: "Movel",
    nome: "Claro Controle 25GB Gamer (Multi)",
    precoMensal: 99.90,
    beneficios: ["25GB (plano) + 5GB (redes) + 5GB (bônus)", "Geforce NOW", "Apps (TikTok, Insta, etc.)", "ChatGPT Plus (2 Meses)"],
    observacoes: "Desconto de R$ 5,00 no DCC+Fatura Digital."
  },

  // --- 3. PRODUTOS BANDA LARGA (POR REGIÃO) ---
  // Benefícios Padrão de BL: Globoplay Padrão (sem anúncios, 3 acessos), Proteção Digital McAfee (3 dispositivos), Skeelo Audiobooks (1 licença), ChatGPT Plus (se Multi).
  // Benefícios Padrão 500M+: Todos acima + Minha Banca Residencial.
  // Benefícios Padrão 1G: Todos acima + Busuu (2 licenças) + 1 Ponto Ultra Gratuito.
  
  // Região: padrao
  {
    id: "bl-padrao-1g", regiaoId: "padrao", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 299.90, precoAnual: null,
    beneficios: ["Globoplay Padrão (sem anúncios, 3 acessos)", "Proteção Digital McAfee (3 dispositivos)", "Skeelo Audiobooks (1 licença)", "Minha Banca Residencial", "Busuu (2 licenças)", "1 Ponto Ultra Gratuito", "ChatGPT Plus (se Multi)"],
    observacoes: "Preço COM TV OU MÓVEL. Preço avulso: N/A. Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  {
    id: "bl-padrao-750m", regiaoId: "padrao", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 129.90, precoAnual: null,
    beneficios: ["Globoplay Padrão (sem anúncios, 3 acessos)", "Proteção Digital McAfee (3 dispositivos)", "Skeelo Audiobooks (1 licença)", "Minha Banca Residencial", "ChatGPT Plus (se Multi)"],
    observacoes: "Preço COM TV OU MÓVEL. Preço avulso: R$ 149,90. Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  {
    id: "bl-padrao-600m", regiaoId: "padrao", tipo: "Banda Larga", nome: "BL 600 Mega (Combo)", precoMensal: 99.90, precoAnual: null,
    beneficios: ["Globoplay Padrão (sem anúncios, 3 acessos)", "Proteção Digital McAfee (3 dispositivos)", "Skeelo Audiobooks (1 licença)", "Minha Banca Residencial", "ChatGPT Plus (se Multi)"],
    observacoes: "Preço COM TV OU MÓVEL. Preço avulso: R$ 119,90. Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  {
    id: "bl-padrao-350m", regiaoId: "padrao", tipo: "Banda Larga", nome: "BL 350 Mega (Combo)", precoMensal: 79.90, precoAnual: null,
    beneficios: ["Globoplay Padrão (sem anúncios, 3 acessos)", "Proteção Digital McAfee (3 dispositivos)", "Skeelo Audiobooks (1 licença)", "ChatGPT Plus (se Multi)"],
    observacoes: "Preço COM TV OU MÓVEL. Preço avulso: R$ 99,90. Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },

  // Região: especial
  {
    id: "bl-especial-1g", regiaoId: "especial", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 199.90, precoAnual: null,
    beneficios: ["Globoplay Padrão (sem anúncios, 3 acessos)", "Proteção Digital McAfee (3 dispositivos)", "Skeelo Audiobooks (1 licença)", "Minha Banca Residencial", "Busuu (2 licenças)", "1 Ponto Ultra Gratuito", "ChatGPT Plus (se Multi)"],
    observacoes: "Preço COM TV OU MÓVEL. Preço avulso: N/A. Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  {
    id: "bl-especial-750m", regiaoId: "especial", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 129.90, precoAnual: null,
    beneficios: ["Globoplay Padrão (sem anúncios, 3 acessos)", "Proteção Digital McAfee (3 dispositivos)", "Skeelo Audiobooks (1 licença)", "Minha Banca Residencial", "ChatGPT Plus (se Multi)"],
    observacoes: "Preço COM TV OU MÓVEL. Preço avulso: R$ 149,90. Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  {
    id: "bl-especial-600m", regiaoId: "especial", tipo: "Banda Larga", nome: "BL 600 Mega (Combo)", precoMensal: 99.90, precoAnual: null,
    beneficios: ["Globoplay Padrão (sem anúncios, 3 acessos)", "Proteção Digital McAfee (3 dispositivos)", "Skeelo Audiobooks (1 licença)", "Minha Banca Residencial", "ChatGPT Plus (se Multi)"],
    observacoes: "Preço COM TV OU MÓVEL. Preço avulso: R$ 119,90. Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  {
    id: "bl-especial-350m", regiaoId: "especial", tipo: "Banda Larga", nome: "BL 350 Mega (Combo)", precoMensal: 79.90, precoAnual: null,
    beneficios: ["Globoplay Padrão (sem anúncios, 3 acessos)", "Proteção Digital McAfee (3 dispositivos)", "Skeelo Audiobooks (1 licença)", "ChatGPT Plus (se Multi)"],
    observacoes: "Preço COM TV OU MÓVEL. Preço avulso: R$ 99,90. Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  
  // Região: especial-promo-6m
  {
    id: "bl-especial-promo-6m-600m", regiaoId: "especial-promo-6m", tipo: "Banda Larga", nome: "BL 600 Mega (Promo 6M)", precoMensal: 49.90, precoAnual: null,
    beneficios: ["Globoplay Padrão (sem anúncios, 3 acessos)", "Proteção Digital McAfee (3 dispositivos)", "Skeelo Audiobooks (1 licença)", "Minha Banca Residencial", "ChatGPT Plus (se Multi)"],
    observacoes: "Preço COM MÓVEL por 6 meses, após R$ 79,90. Preço avulso: R$ 119,90. Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  
  // Região: especial-promo-3m
  {
    id: "bl-especial-promo-3m-600m", regiaoId: "especial-promo-3m", tipo: "Banda Larga", nome: "BL 600 Mega (Promo 3M)", precoMensal: 59.90, precoAnual: null,
    beneficios: ["Globoplay Padrão (sem anúncios, 3 acessos)", "Proteção Digital McAfee (3 dispositivos)", "Skeelo Audiobooks (1 licença)", "Minha Banca Residencial", "ChatGPT Plus (se Multi)"],
    observacoes: "Preço COM MÓVEL por 3 meses, após R$ 99,90. Preço avulso: R$ 119,90. Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  
  // Região: especial-plus
  {
    id: "bl-especial-plus-600m", regiaoId: "especial-plus", tipo: "Banda Larga", nome: "BL 600 Mega (Combo)", precoMensal: 99.90, precoAnual: null,
    beneficios: ["Globoplay Padrão (sem anúncios, 3 acessos)", "Proteção Digital McAfee (3 dispositivos)", "Skeelo Audiobooks (1 licença)", "Minha Banca Residencial", "ChatGPT Plus (se Multi)"],
    observacoes: "Preço COM TV OU MÓVEL. Preço avulso: R$ 119,90. Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },

  // Região: especial-plus-promo-6m
  {
    id: "bl-especial-plus-promo-6m-600m", regiaoId: "especial-plus-promo-6m", tipo: "Banda Larga", nome: "BL 600 Mega (Promo 6M)", precoMensal: 49.90, precoAnual: null,
    beneficios: ["Globoplay Padrão (sem anúncios, 3 acessos)", "Proteção Digital McAfee (3 dispositivos)", "Skeelo Audiobooks (1 licença)", "Minha Banca Residencial", "ChatGPT Plus (se Multi)"],
    observacoes: "Preço COM MÓVEL por 6 meses, após R$ 79,90. Preço avulso: R$ 99,90. Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },

  // Região: especial-plus-promo-3-6m
  {
    id: "bl-especial-plus-promo-3-6m-600m", regiaoId: "especial-plus-promo-3-6m", tipo: "Banda Larga", nome: "BL 600 Mega (Promo 3M/6M)", precoMensal: 49.90, precoAnual: null,
    beneficios: ["Globoplay Padrão (sem anúncios, 3 acessos)", "Proteção Digital McAfee (3 dispositivos)", "Skeelo Audiobooks (1 licença)", "Minha Banca Residencial", "ChatGPT Plus (se Multi)"],
    observacoes: "Preço COM MÓVEL (R$ 49,90/6M, após R$ 79,90). Preço avulso: R$ 59,90/3M (após R$ 99,90). Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },

  // Região: especial-plus-promo-3m
  {
    id: "bl-especial-plus-promo-3m-600m", regiaoId: "especial-plus-promo-3m", tipo: "Banda Larga", nome: "BL 600 Mega (Promo 3M)", precoMensal: 59.90, precoAnual: null,
    beneficios: ["Globoplay Padrão (sem anúncios, 3 acessos)", "Proteção Digital McAfee (3 dispositivos)", "Skeelo Audiobooks (1 licença)", "Minha Banca Residencial", "ChatGPT Plus (se Multi)"],
    observacoes: "Preço COM MÓVEL por 3 meses, após R$ 99,90. Preço avulso: R$ 99,90. Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  
  // Região: especial-plus-promo-3m-b
  {
    id: "bl-especial-plus-promo-3m-b-600m", regiaoId: "especial-plus-promo-3m-b", tipo: "Banda Larga", nome: "BL 600 Mega (Promo 3M)", precoMensal: 59.90, precoAnual: null,
    beneficios: ["Globoplay Padrão (sem anúncios, 3 acessos)", "Proteção Digital McAfee (3 dispositivos)", "Skeelo Audiobooks (1 licença)", "Minha Banca Residencial", "ChatGPT Plus (se Multi)"],
    observacoes: "Preço COM MÓVEL por 3 meses, após R$ 99,90. Preço avulso: R$ 119,90 (com promo de 3M). Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },

  // Região: med-01
  {
    id: "bl-med-01-600m", regiaoId: "med-01", tipo: "Banda Larga", nome: "BL 600 Mega (Promo 6M)", precoMensal: 64.90, precoAnual: null,
    beneficios: ["Globoplay Padrão (sem anúncios, 3 acessos)", "Proteção Digital McAfee (3 dispositivos)", "Skeelo Audiobooks (1 licença)", "Minha Banca Residencial", "ChatGPT Plus (se Multi)"],
    observacoes: "Preço COM MÓVEL por 6 meses, após R$ 84,90. Preço avulso: R$ 74,90 (6M) -> R$ 104,90. Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  {
    id: "bl-med-01-350m", regiaoId: "med-01", tipo: "Banda Larga", nome: "BL 350 Mega (Combo)", precoMensal: 94.90, precoAnual: null,
    beneficios: ["Globoplay Padrão (sem anúncios, 3 acessos)", "Proteção Digital McAfee (3 dispositivos)", "Skeelo Audiobooks (1 licença)", "ChatGPT Plus (se Multi)"],
    observacoes: "Preço COM MÓVEL. Preço avulso: R$ 94,90. Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },

  // Região: med-02 (Feira de Santana)
  {
    id: "bl-med-02-600m", regiaoId: "med-02", tipo: "Banda Larga", nome: "BL 600 Mega (Promo 6M)", precoMensal: 54.90, precoAnual: null,
    beneficios: ["Globoplay Padrão (sem anúncios, 3 acessos)", "Proteção Digital McAfee (3 dispositivos)", "Skeelo Audiobooks (1 licença)", "Minha Banca Residencial", "ChatGPT Plus (se Multi)"],
    observacoes: "Preço COM MÓVEL por 6 meses, após R$ 84,90. Preço avulso: R$ 64,90 (6M) -> R$ 104,90. Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  {
    id: "bl-med-02-350m", regiaoId: "med-02", tipo: "Banda Larga", nome: "BL 350 Mega (Combo)", precoMensal: 74.90, precoAnual: null,
    beneficios: ["Globoplay Padrão (sem anúncios, 3 acessos)", "Proteção Digital McAfee (3 dispositivos)", "Skeelo Audiobooks (1 licença)", "ChatGPT Plus (se Multi)"],
    observacoes: "Preço COM TV OU MÓVEL. Preço avulso: R$ 84,90. Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },

  // Região: med-redes-neutras-02
  {
    id: "bl-med-redes-neutras-02-600m", regiaoId: "med-redes-neutras-02", tipo: "Banda Larga", nome: "BL 600 Mega (Promo 6M)", precoMensal: 54.90, precoAnual: null,
    beneficios: ["Globoplay Padrão (sem anúncios, 3 acessos)", "Proteção Digital McAfee (3 dispositivos)", "Skeelo Audiobooks (1 licença)", "Minha Banca Residencial", "ChatGPT Plus (se Multi)"],
    observacoes: "Preço COM MÓVEL por 6 meses, após R$ 84,90. Preço avulso: R$ 64,90 (6M) -> R$ 104,90. Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },
  
  // Região: med-03
  {
    id: "bl-med-03-600m", regiaoId: "med-03", tipo: "Banda Larga", nome: "BL 600 Mega (Promo 6M)", precoMensal: 54.90, precoAnual: null,
    beneficios: ["Globoplay Padrão (sem anúncios, 3 acessos)", "Proteção Digital McAfee (3 dispositivos)", "Skeelo Audiobooks (1 licença)", "Minha Banca Residencial", "ChatGPT Plus (se Multi)"],
    observacoes: "Preço COM MÓVEL (valor único). Preço avulso: R$ 64,90 (6M) -> R$ 104,90. Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses."
  },

  // --- 4. PRODUTOS DE TV (HARDWARE) ---
  {
    id: "tv-soundbox-combo-bl-movel",
    regiaoId: "padrao", // Cidades com CABO/FIBRA (PDF 1, p.3)
    tipo: "TV",
    nome: "Claro TV+ Soundbox (Combo BL+Móvel)",
    precoMensal: 154.90,
    precoAnual: null,
    beneficios: [
      "Netflix Padrão com Anúncios (2 acessos, Full HD)",
      "Globoplay Premium (canais ao vivo, 5 acessos)",
      "HBO Max Básico com Anúncios (2 acessos, Full HD)",
      "Apple TV+ (5 acessos, 4K HDR, sem anúncios)",
      "Disney+ Padrão com Anúncios (2 acessos, Full HD)",
      "Amazon Prime Video Padrão com Anúncios (3 acessos, Full HD)",
      "Amazon Music, Prime Gaming, Prime Reading e Frete Grátis",
      "Equipamento: Soundbox (Áudio Dolby Atmos)",
      "Controle com Comando de Voz",
      "Gravador Virtual com 400 horas",
      "Benefício Multi: ChatGPT Plus (se Multi)"
    ],
    observacoes: "Preço COM BL E MÓVEL. Desconto de R$ 5,00 no DCC+Fatura Digital."
  },
  {
    id: "tv-soundbox-combo-bl-ou-movel",
    regiaoId: "padrao", // Cidades com CABO/FIBRA (PDF 1, p.3)
    tipo: "TV",
    nome: "Claro TV+ Soundbox (Combo BL ou Móvel)",
    precoMensal: 164.90,
    precoAnual: null,
    beneficios: [
      "Netflix Padrão com Anúncios (2 acessos, Full HD)",
      "Globoplay Premium (canais ao vivo, 5 acessos)",
      "HBO Max Básico com Anúncios (2 acessos, Full HD)",
      "Apple TV+ (5 acessos, 4K HDR, sem anúncios)",
      "Disney+ Padrão com Anúncios (2 acessos, Full HD)",
      "Amazon Prime Video Padrão com Anúncios (3 acessos, Full HD)",
      "Amazon Music, Prime Gaming, Prime Reading e Frete Grátis",
      "Equipamento: Soundbox (Áudio Dolby Atmos)",
      "Controle com Comando de Voz",
      "Gravador Virtual com 400 horas"
    ],
    observacoes: "Preço COM BL OU MÓVEL. Desconto de R$ 5,00 no DCC+Fatura Digital."
  },
  {
    id: "tv-box-cabo-combo-bl-movel",
    regiaoId: "padrao", // Cidades com CABO/FIBRA (PDF 1, p.3)
    tipo: "TV",
    nome: "Claro TV+ Box Cabo (Combo BL+Móvel)",
    precoMensal: 124.90,
    precoAnual: null,
    beneficios: [
      "Netflix Padrão com Anúncios (2 acessos, Full HD)",
      "Globoplay Premium (canais ao vivo, 5 acessos)",
      "HBO Max Básico com Anúncios (2 acessos, Full HD)",
      "Apple TV+ (5 acessos, 4K HDR, sem anúncios)",
      "Disney+ Padrão com Anúncios (2 acessos, Full HD)",
      "Amazon Prime Video Padrão com Anúncios (3 acessos, Full HD)",
      "Amazon Music, Prime Gaming, Prime Reading e Frete Grátis",
      "Equipamento: Box Cabo (Qualidade 4K)",
      "Controle com Comando de Voz",
      "Gravador Virtual com 400 horas",
      "Benefício Multi: ChatGPT Plus (se Multi)"
    ],
    observacoes: "Preço COM BL E MÓVEL. Desconto de R$ 5,00 no DCC+Fatura Digital."
  },
  {
    id: "tv-box-cabo-combo-bl-ou-movel",
    regiaoId: "padrao", // Cidades com CABO/FIBRA (PDF 1, p.3)
    tipo: "TV",
    nome: "Claro TV+ Box Cabo (Combo BL ou Móvel)",
    precoMensal: 134.90,
    precoAnual: null,
    beneficios: [
      "Netflix Padrão com Anúncios (2 acessos, Full HD)",
      "Globoplay Premium (canais ao vivo, 5 acessos)",
      "HBO Max Básico com Anúncios (2 acessos, Full HD)",
      "Apple TV+ (5 acessos, 4K HDR, sem anúncios)",
      "Disney+ Padrão com Anúncios (2 acessos, Full HD)",
      "Amazon Prime Video Padrão com Anúncios (3 acessos, Full HD)",
      "Amazon Music, Prime Gaming, Prime Reading e Frete Grátis",
      "Equipamento: Box Cabo (Qualidade 4K)",
      "Controle com Comando de Voz",
      "Gravador Virtual com 400 horas"
    ],
    observacoes: "Preço COM BL OU MÓVEL. Desconto de R$ 5,00 no DCC+Fatura Digital."
  },
  {
    id: "tv-box-streaming-combo-movel",
    regiaoId: "nacional", // Cidades Não Cabeadas (PDF 2, p.68)
    tipo: "TV",
    nome: "Claro TV+ Box (Streaming) (Combo Móvel)",
    precoMensal: 124.90,
    precoAnual: null,
    beneficios: [
      "Netflix Padrão com Anúncios (2 acessos, Full HD)",
      "Globoplay Premium (canais ao vivo, 5 acessos)",
      "HBO Max Básico com Anúncios (2 acessos, Full HD)",
      "Apple TV+ (5 acessos, 4K HDR, sem anúncios)",
      "Disney+ Padrão com Anúncios (2 acessos, Full HD)",
      "Amazon Prime Video Padrão com Anúncios (3 acessos, Full HD)",
      "Amazon Music, Prime Gaming, Prime Reading e Frete Grátis",
      "Equipamento: Box Streaming",
      "Controle com Comando de Voz",
      "Gravador Virtual com 400 horas"
    ],
    observacoes: "Preço COM MÓVEL. Desconto de R$ 5,00 no DCC+Fatura Digital."
  },
  {
    id: "tv-box-streaming-single-fone",
    regiaoId: "nacional", // Cidades Não Cabeadas (PDF 2, p.68)
    tipo: "TV",
    nome: "Claro TV+ Box (Streaming) (Single/Fone)",
    precoMensal: 134.90,
    precoAnual: null,
    beneficios: [
      "Netflix Padrão com Anúncios (2 acessos, Full HD)",
      "Globoplay Premium (canais ao vivo, 5 acessos)",
      "HBO Max Básico com Anúncios (2 acessos, Full HD)",
      "Apple TV+ (5 acessos, 4K HDR, sem anúncios)",
      "Disney+ Padrão com Anúncios (2 acessos, Full HD)",
      "Amazon Prime Video Padrão com Anúncios (3 acessos, Full HD)",
      "Amazon Music, Prime Gaming, Prime Reading e Frete Grátis",
      "Equipamento: Box Streaming",
      "Controle com Comando de Voz",
      "Gravador Virtual com 400 horas"
    ],
    observacoes: "Preço SINGLE COM FONE. Desconto de R$ 5,00 no DCC+Fatura Digital."
  },

  // --- 5. PRODUTOS DE TV (APP) ---
  {
    id: "tv-app-anual",
    regiaoId: "nacional",
    tipo: "TV",
    nome: "Claro TV+ App (Anual)",
    precoMensal: 99.90, // (R$ 1.198,90 / 12)
    precoAnual: 1198.90,
    beneficios: [
      "Mais de 120 canais ao vivo",
      "Netflix (Padrão com Anúncios)",
      "HBO Max (Básico com Anúncios)",
      "Apple TV+",
      "Disney+ (Padrão com Anúncios)",
      "Amazon Prime Video",
      "Amazon Music, Prime Gaming, Prime Reading e Frete Grátis",
      "Acesso por App (sem equipamento)",
      "Contratação 100% Digital (Cartão de Crédito)"
    ],
    observacoes: "Pagamento anual (12x R$ 99,90). Não possui benefícios Multi."
  },
  {
    id: "tv-app-mensal",
    regiaoId: "nacional",
    tipo: "TV",
    nome: "Claro TV+ App (Mensal)",
    precoMensal: 109.90,
    precoAnual: null,
    beneficios: [
      "Mais de 120 canais ao vivo",
      "Netflix (Padrão com Anúncios)",
      "HBO Max (Básico com Anúncios)",
      "Apple TV+",
      "Disney+ (Padrão com Anúncios)",
      "Amazon Prime Video",
      "Amazon Music, Prime Gaming, Prime Reading e Frete Grátis",
      "Acesso por App (sem equipamento)",
      "Contratação 100% Digital (Cartão de Crédito)"
    ],
    observacoes: "Preço promocional R$ 65,40 por 2 meses. Não possui benefícios Multi."
  },
  {
    id: "tv-streamings-anual",
    regiaoId: "nacional",
    tipo: "TV",
    nome: "Claro TV+ Streamings (Anual)",
    precoMensal: 69.90, // (R$ 838,80 / 12)
    precoAnual: 838.80,
    beneficios: [
      "NÃO inclui canais ao vivo",
      "Netflix (Padrão com Anúncios)",
      "HBO Max (Básico com Anúncios)",
      "Apple TV+",
      "Disney+ (Padrão com Anúncios)",
      "Amazon Prime Video",
      "Amazon Music, Prime Gaming, Prime Reading e Frete Grátis",
      "Acesso por App (sem equipamento)",
      "Contratação 100% Digital (Cartão de Crédito)"
    ],
    observacoes: "Pagamento anual (12x R$ 69,90). Não possui benefícios Multi."
  },

  // --- 6. FONE FIXO ---
  {
    id: "fixo-mundo-total-3p",
    regiaoId: "nacional",
    tipo: "Fixo",
    nome: "Ilimitado Mundo Total (Combo 3P)",
    precoMensal: 35.00,
    precoAnual: null,
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
    observacoes: "Preço na combinação FONE+BL+TV ou FONE+BL+MOVEL."
  },
  {
    id: "fixo-mundo-total-single-2p",
    regiaoId: "nacional",
    tipo: "Fixo",
    nome: "Ilimitado Mundo Total (Single/Combo 2P)",
    precoMensal: 65.00,
    precoAnual: null,
    beneficios: [
      "Ligações Nacionais Ilimitadas (Fixo e Celular de qualquer operadora)",
      "Ligações Ilimitadas para Celulares dos EUA",
      "Ligações Ilimitadas para Fixos de 35 países (lista completa acima)"
    ],
    observacoes: "Preço Single ou em combos 2P (ex: Fone+TV)."
  },
  {
    id: "fixo-brasil-total-4p",
    regiaoId: "nacional",
    tipo: "Fixo",
    nome: "Ilimitado Brasil Total (Combo 4P)",
    precoMensal: 5.00,
    precoAnual: null,
    beneficios: [
      "Ligações Nacionais Ilimitadas (Fixo e Celular de qualquer operadora)"
    ],
    observacoes: "Preço na combinação FONE+BL+MOVEL+TV."
  },
  {
    id: "fixo-brasil-total-single-2p-3p",
    regiaoId: "nacional",
    tipo: "Fixo",
    nome: "Ilimitado Brasil Total (Single/Combo 2P/3P)",
    precoMensal: 35.00,
    precoAnual: null,
    beneficios: [
      "Ligações Nacionais Ilimitadas (Fixo e Celular de qualquer operadora)"
    ],
    observacoes: "Preço em qualquer combinação que não seja 4P."
  },

  // --- 7. OPCIONAIS (CONECTIVIDADE E GAMING) ---
  { id: "opcional-ponto-soundbox", regiaoId: "nacional", tipo: "Opcional", nome: "Ponto Adicional - Claro TV+ Soundbox", precoMensal: 99.90, precoAnual: null, beneficios: ["Aluguel de 1 equipamento Soundbox adicional", "Requer ponto principal Soundbox"], observacoes: "Valor de aluguel mensal." },
  { id: "opcional-ponto-box-cabo", regiaoId: "nacional", tipo: "Opcional", nome: "Ponto Adicional - Claro TV+ Box Cabo", precoMensal: 69.90, precoAnual: null, beneficios: ["Aluguel de 1 equipamento Box Cabo adicional", "Requer ponto principal Box Cabo"], observacoes: "Valor de aluguel mensal." },
  { id: "opcional-ponto-box-streaming", regiaoId: "nacional", tipo: "Opcional", nome: "Ponto Adicional - Claro TV+ Box (Streaming)", precoMensal: 69.90, precoAnual: null, beneficios: ["Aluguel de 1 equipamento Box (Streaming) adicional", "Requer ponto principal Box (Streaming)"], observacoes: "Valor de aluguel mensal." },
  { id: "opcional-ponto-ultra", regiaoId: "nacional", tipo: "Opcional", nome: "Ponto Ultra", precoMensal: null, precoAnual: null, beneficios: ["Solução de conectividade Wi-Fi", "Melhora alcance do sinal"], observacoes: "Taxa única de R$ 150,00 (em até 3x)." },
  { id: "opcional-claro-geek", regiaoId: "nacional", tipo: "Opcional", nome: "Claro Geek", precoMensal: 9.90, precoAnual: 118.80, beneficios: ["Suporte técnico especializado para dispositivos"], observacoes: "Fidelidade 12 meses. Multa R$ 59,40 proporcional." },
  { id: "opcional-geforce-now", regiaoId: "nacional", tipo: "Opcional", nome: "Geforce NOW (Avulso)", precoMensal: 63.90, precoAnual: null, beneficios: ["Plataforma de streaming de jogos na nuvem"], observacoes: "" },
  { id: "opcional-abya-go", regiaoId: "nacional", tipo: "Opcional", nome: "Abya Go", precoMensal: 25.90, precoAnual: null, beneficios: ["Plataforma de streaming de jogos"], observacoes: "" },
  { id: "opcional-no-ping", regiaoId: "nacional", tipo: "Opcional", nome: "No Ping", precoMensal: 10.00, precoAnual: null, beneficios: ["Redutor de latência (ping) para jogos online"], observacoes: "" },
  { id: "opcional-smarthome-1-cam", regiaoId: "nacional", tipo: "Opcional", nome: "Claro SmartHome (1 Câmera)", precoMensal: 29.90, precoAnual: 358.80, beneficios: ["Monitoramento com 1 Câmera HD Wi-Fi (interna)", "Equipamento em comodato"], observacoes: "Fidelidade 12 meses. Multa R$ 500,00 proporcional." },
  { id: "opcional-extensor-mesh", regiaoId: "nacional", tipo: "Opcional", nome: "Extensor Wi-Fi Mesh (Comodato)", precoMensal: 30.00, precoAnual: 360.00, beneficios: ["Kit com 2 extensores para melhorar o sinal Wi-Fi"], observacoes: "Fidelidade 12 meses. Multa R$ 300,00 por extensor." },

  // --- 8. OPCIONAIS (A LA CARTE - STREAMING) ---
  { id: "opcional-amazon-prime-mensal", regiaoId: "nacional", tipo: "Opcional", nome: "Amazon Prime (Mensal)", precoMensal: 19.90, precoAnual: null, beneficios: ["Amazon Prime Video", "Amazon Music", "Prime Gaming", "Prime Reading", "Frete Grátis Amazon"], observacoes: "" },
  { id: "opcional-apple-tv-plus-mensal", regiaoId: "nacional", tipo: "Opcional", nome: "Apple TV+ (Mensal)", precoMensal: 21.90, precoAnual: null, beneficios: ["Catálogo Apple TV+", "5 acessos", "4K HDR", "Sem anúncios"], observacoes: "" },
  { id: "opcional-crunchyroll-fan-mensal", regiaoId: "nacional", tipo: "Opcional", nome: "Crunchyroll Fan (Mensal)", precoMensal: 14.99, precoAnual: null, beneficios: ["Catálogo de animes Crunchyroll"], observacoes: "" },
  { id: "opcional-disney-plus-padrao-mensal", regiaoId: "nacional", tipo: "Opcional", nome: "Disney+ Padrão (Mensal)", precoMensal: 46.90, precoAnual: null, beneficios: ["Catálogo Disney+ Padrão com anúncios"], observacoes: "" },
  { id: "opcional-disney-plus-premium-mensal", regiaoId: "nacional", tipo: "Opcional", nome: "Disney+ Premium (Mensal)", precoMensal: 66.90, precoAnual: null, beneficios: ["Catálogo Disney+ Premium sem anúncios"], observacoes: "" },
  { id: "opcional-disney-plus-premium-anual", regiaoId: "nacional", tipo: "Opcional", nome: "Disney+ Premium (Anual)", precoMensal: 46.91, precoAnual: 562.90, beneficios: ["Catálogo Disney+ Premium sem anúncios", "Pagamento anual em 12x"], observacoes: "Valor total R$ 562,90" },
  { id: "opcional-max-hbo-anuncios-mensal", regiaoId: "nacional", tipo: "Opcional", nome: "Max (HBO) com Anúncios (Mensal)", precoMensal: 29.90, precoAnual: null, beneficios: ["Catálogo HBO Max com anúncios"], observacoes: "" },
  { id: "opcional-max-hbo-anuncios-anual", regiaoId: "nacional", tipo: "Opcional", nome: "Max (HBO) com Anúncios (Anual)", precoMensal: 18.90, precoAnual: 226.80, beneficios: ["Catálogo HBO Max com anúncios", "Pagamento anual em 12x"], observacoes: "Valor total R$ 226,80" },
  { id: "opcional-max-hbo-sem-anuncios-mensal", regiaoId: "nacional", tipo: "Opcional", nome: "Max (HBO) Sem Anúncios (Mensal)", precoMensal: 39.90, precoAnual: null, beneficios: ["Catálogo HBO Max sem anúncios"], observacoes: "" },
  { id: "opcional-max-hbo-sem-anuncios-anual", regiaoId: "nacional", tipo: "Opcional", nome: "Max (HBO) Sem Anúncios (Anual)", precoMensal: 29.90, precoAnual: 358.80, beneficios: ["Catálogo HBO Max sem anúncios", "Pagamento anual em 12x"], observacoes: "Valor total R$ 358,80" },
  { id: "opcional-paramount-plus-mensal", regiaoId: "nacional", tipo: "Opcional", nome: "Paramount+ (Mensal)", precoMensal: 27.90, precoAnual: null, beneficios: ["Catálogo Paramount+"], observacoes: "" },
  { id: "opcional-paramount-plus-anual", regiaoId: "nacional", tipo: "Opcional", nome: "Paramount+ (Anual)", precoMensal: 20.83, precoAnual: 249.90, beneficios: ["Catálogo Paramount+", "Pagamento anual em 12x"], observacoes: "Valor total R$ 249,90" },
  { id: "opcional-premiere-futebol-mensal", regiaoId: "nacional", tipo: "Opcional", nome: "Premiere Futebol (Mensal)", precoMensal: 59.90, precoAnual: null, beneficios: ["Acesso aos canais Premiere"], observacoes: "" },
  { id: "opcional-premiere-futebol-anual", regiaoId: "nacional", tipo: "Opcional", nome: "Premiere Futebol (Anual)", precoMensal: 29.90, precoAnual: 358.80, beneficios: ["Acesso aos canais Premiere", "Pagamento anual em 12x"], observacoes: "Valor total R$ 358,80" },
  { id: "opcional-telecine-universal-mensal", regiaoId: "nacional", tipo: "Opcional", nome: "Combo Telecine e Universal+ (Mensal)", precoMensal: 34.90, precoAnual: null, beneficios: ["Catálogo Telecine", "Catálogo Universal+"], observacoes: "" },
  { id: "opcional-telecine-universal-anual", regiaoId: "nacional", tipo: "Opcional", nome: "Combo Telecine e Universal+ (Anual)", precoMensal: 24.90, precoAnual: 298.80, beneficios: ["Catálogo Telecine", "Catálogo Universal+", "Pagamento anual em 12x"], observacoes: "Valor total R$ 298,80" },
  { id: "opcional-telecine-mensal", regiaoId: "nacional", tipo: "Opcional", nome: "Telecine (Mensal)", precoMensal: 29.90, precoAnual: null, beneficios: ["Catálogo Telecine"], observacoes: "" },
  { id: "opcional-telecine-anual", regiaoId: "nacional", tipo: "Opcional", nome: "Telecine (Anual)", precoMensal: 19.90, precoAnual: 238.80, beneficios: ["Catálogo Telecine", "Pagamento anual em 12x"], observacoes: "Valor total R$ 238,80" },
  { id: "opcional-netflix-anuncios-avulso", regiaoId: "nacional", tipo: "Opcional", nome: "Netflix com Anúncios (Avulso)", precoMensal: 20.90, precoAnual: null, beneficios: ["Acesso ao Netflix com anúncios"], observacoes: "" },
  { id: "opcional-netflix-padrao-avulso", regiaoId: "nacional", tipo: "Opcional", nome: "Netflix Padrão (Avulso)", precoMensal: 44.90, precoAnual: null, beneficios: ["Acesso ao Netflix Padrão", "2 telas simultâneas", "Sem anúncios"], observacoes: "" },
  { id: "opcional-netflix-premium-avulso", regiaoId: "nacional", tipo: "Opcional", nome: "Netflix Premium (Avulso)", precoMensal: 59.90, precoAnual: null, beneficios: ["Acesso ao Netflix Premium", "4 telas simultâneas", "Qualidade 4K HDR", "Sem anúncios"], observacoes: "" },
  { id: "opcional-belas-artes", regiaoId: "nacional", tipo: "Opcional", nome: "Belas Artes", precoMensal: 12.90, precoAnual: null, beneficios: ["Catálogo Belas Artes"], observacoes: "" },
  { id: "opcional-brasiliana", regiaoId: "nacional", tipo: "Opcional", nome: "Brasiliana", precoMensal: 9.90, precoAnual: null, beneficios: ["Catálogo Brasiliana"], observacoes: "" },
  { id: "opcional-darkflix", regiaoId: "nacional", tipo: "Opcional", nome: "Darkflix", precoMensal: 9.90, precoAnual: null, beneficios: ["Catálogo Darkflix (Foco em terror)"], observacoes: "" },
  { id: "opcional-edye", regiaoId: "nacional", tipo: "Opcional", nome: "Edye", precoMensal: 10.90, precoAnual: null, beneficios: ["Catálogo Edye (Infantil)"], observacoes: "" },
  { id: "opcional-eduk", regiaoId: "nacional", tipo: "Opcional", nome: "Eduk", precoMensal: 14.90, precoAnual: null, beneficios: ["Catálogo Eduk (Cursos)"], observacoes: "" },
  { id: "opcional-fi-tv", regiaoId: "nacional", tipo: "Opcional", nome: "Fi TV", precoMensal: 29.00, precoAnual: null, beneficios: ["Catálogo Fi TV"], observacoes: "" },
  { id: "opcional-porta-curtas", regiaoId: "nacional", tipo: "Opcional", nome: "Porta Curtas", precoMensal: 6.90, precoAnual: null, beneficios: ["Catálogo Porta Curtas"], observacoes: "" },
  { id: "opcional-reaw-play", regiaoId: "nacional", tipo: "Opcional", nome: "Reaw Play", precoMensal: 19.90, precoAnual: null, beneficios: ["Catálogo Reaw Play"], observacoes: "" },
  { id: "opcional-universal-plus", regiaoId: "nacional", tipo: "Opcional", nome: "Universal Plus", precoMensal: 29.90, precoAnual: null, beneficios: ["Catálogo Universal+"], observacoes: "" },
  { id: "opcional-box-brazil-play", regiaoId: "nacional", tipo: "Opcional", nome: "Box Brazil Play", precoMensal: 14.90, precoAnual: null, beneficios: ["Catálogo Box Brazil Play"], observacoes: "" },
  { id: "opcional-cine-brasil", regiaoId: "nacional", tipo: "Opcional", nome: "Cine Brasil", precoMensal: 6.90, precoAnual: null, beneficios: ["Catálogo Cine Brasil"], observacoes: "" },
  { id: "opcional-cindie", regiaoId: "nacional", tipo: "Opcional", nome: "Cindie", precoMensal: 12.90, precoAnual: null, beneficios: ["Catálogo Cindie"], observacoes: "" },
  { id: "opcional-looke", regiaoId: "nacional", tipo: "Opcional", nome: "Looke", precoMensal: 16.90, precoAnual: null, beneficios: ["Catálogo Looke"], observacoes: "" },
  { id: "opcional-looke-kids", regiaoId: "nacional", tipo: "Opcional", nome: "Looke Kids", precoMensal: 12.90, precoAnual: null, beneficios: ["Catálogo Looke Kids"], observacoes: "" },
  { id: "opcional-lumine", regiaoId: "nacional", tipo: "Opcional", nome: "Lumine", precoMensal: 32.90, precoAnual: null, beneficios: ["Catálogo Lumine (Conteúdo Católico)"], observacoes: "" },
  { id: "opcional-medialand-play", regiaoId: "nacional", tipo: "Opcional", nome: "Medialand Play", precoMensal: 7.90, precoAnual: null, beneficios: ["Catálogo Medialand Play"], observacoes: "" },
  { id: "opcional-mundus-play", regiaoId: "nacional", tipo: "Opcional", nome: "Mundus Play", precoMensal: 18.90, precoAnual: null, beneficios: ["Catálogo Mundus Play"], observacoes: "" },
  { id: "opcional-sportynet-plus", regiaoId: "nacional", tipo: "Opcional", nome: "Sportynet+", precoMensal: 29.90, precoAnual: null, beneficios: ["Copa Nordeste", "Brasileirão Série C"], observacoes: "" },
  { id: "opcional-combate-hd-avulso", regiaoId: "nacional", tipo: "Opcional", nome: "Combate HD (Avulso)", precoMensal: 34.90, precoAnual: null, beneficios: ["Acesso ao canal Combate"], observacoes: "" },
  { id: "opcional-ufc-fight-pass", regiaoId: "nacional", tipo: "Opcional", nome: "UFC Fight Pass", precoMensal: 29.90, precoAnual: null, beneficios: ["Acesso ao UFC Fight Pass"], observacoes: "" },
  { id: "opcional-dog-tv", regiaoId: "nacional", tipo: "Opcional", nome: "Canal Dog TV", precoMensal: 19.90, precoAnual: null, beneficios: ["Canal com programação para cães"], observacoes: "" },
  { id: "opcional-claro-musica-ilimitado-avulso", regiaoId: "nacional", tipo: "Opcional", nome: "Claro Música Ilimitado (Avulso)", precoMensal: 12.90, precoAnual: null, beneficios: ["Acesso ao Claro Música"], observacoes: "" },
  { id: "opcional-curta-on", regiaoId: "nacional", tipo: "Opcional", nome: "Curta On", precoMensal: 14.90, precoAnual: null, beneficios: ["Catálogo Curta On"], observacoes: "" },
  { id: "opcional-mezzo-live-hd", regiaoId: "nacional", tipo: "Opcional", nome: "Mezzo Live HD", precoMensal: 16.00, precoAnual: null, beneficios: ["Canal de música clássica e jazz"], observacoes: "" },
  { id: "opcional-sic-internacional", regiaoId: "nacional", tipo: "Opcional", nome: "SIC Internacional", precoMensal: 6.90, precoAnual: null, beneficios: ["Canal de variedades de Portugal"], observacoes: "" },
  { id: "opcional-stingray-classica", regiaoId: "nacional", tipo: "Opcional", nome: "Stingray Classica", precoMensal: 14.90, precoAnual: null, beneficios: ["Catálogo Stingray Classica"], observacoes: "" },
  { id: "opcional-stingray-karaoke", regiaoId: "nacional", tipo: "Opcional", nome: "Stingray Karaoke", precoMensal: 9.90, precoAnual: null, beneficios: ["Catálogo Stingray Karaoke"], observacoes: "" },
  { id: "opcional-adrenalina-pura", regiaoId: "nacional", tipo: "Opcional", nome: "Adrenalina Pura", precoMensal: 14.90, precoAnual: null, beneficios: ["Catálogo Adrenalina Pura (Filmes de Ação)"], observacoes: "" },
  { id: "opcional-claro-shows", regiaoId: "nacional", tipo: "Opcional", nome: "Claro Shows", precoMensal: 14.90, precoAnual: null, beneficios: ["Catálogo Claro Shows"], observacoes: "" },
  { id: "opcional-only-tv", regiaoId: "nacional", tipo: "Opcional", nome: "Only TV", precoMensal: 29.90, precoAnual: null, beneficios: ["Conteúdo Árabe"], observacoes: "" },

  // --- 9. OPCIONAIS (ADULTOS) ---
  { id: "opcional-adulto-brasileirinhas", regiaoId: "nacional", tipo: "Opcional", nome: "Brasileirinhas", precoMensal: 24.90, precoAnual: null, beneficios: ["Canal Adulto"], observacoes: "" },
  { id: "opcional-adulto-for-man", regiaoId: "nacional", tipo: "Opcional", nome: "For Man", precoMensal: 19.90, precoAnual: null, beneficios: ["Canal Adulto"], observacoes: "" },
  { id: "opcional-adulto-playboy-hd", regiaoId: "nacional", tipo: "Opcional", nome: "Playboy HD", precoMensal: 19.90, precoAnual: null, beneficios: ["Canal Adulto"], observacoes: "" },
  { id: "opcional-adulto-ppv", regiaoId: "nacional", tipo: "Opcional", nome: "PPV Adultos (por Evento)", precoMensal: 13.90, precoAnual: null, beneficios: ["Canal Adulto (Pay-per-view)"], observacoes: "" },
  { id: "opcional-adulto-sexy-play", regiaoId: "nacional", tipo: "Opcional", nome: "Sexy Play", precoMensal: 24.90, precoAnual: null, beneficios: ["Canal Adulto"], observacoes: "" },
  { id: "opcional-adulto-sex-prive", regiaoId: "nacional", tipo: "Opcional", nome: "Sex Prive", precoMensal: 24.90, precoAnual: null, beneficios: ["Canal Adulto"], observacoes: "" },
  { id: "opcional-adulto-sextreme-digital", regiaoId: "nacional", tipo: "Opcional", nome: "Sextreme Digital", precoMensal: 19.90, precoAnual: null, beneficios: ["Canal Adulto"], observacoes: "" },
  { id: "opcional-adulto-sexy-hot-digital", regiaoId: "nacional", tipo: "Opcional", nome: "Sexy Hot Digital", precoMensal: 19.90, precoAnual: null, beneficios: ["Canal Adulto"], observacoes: "" },
  { id: "opcional-adulto-venus-digital", regiaoId: "nacional", tipo: "Opcional", nome: "Venus Digital", precoMensal: 19.90, precoAnual: null, beneficios: ["Canal Adulto"], observacoes: "" },
  { id: "opcional-adulto-combo-5", regiaoId: "nacional", tipo: "Opcional", nome: "Combo Adulto (5 Canais)", precoMensal: 43.90, precoAnual: null, beneficios: ["Sexy Hot", "Playboy", "Venus", "Sextreme", "For Man HD"], observacoes: "Promoção R$ 21,95 por 2 meses." },
  { id: "opcional-adulto-combo-4", regiaoId: "nacional", tipo: "Opcional", nome: "Combo Adulto (4 Canais)", precoMensal: 39.90, precoAnual: null, beneficios: ["Sexy Hot", "Playboy", "Venus", "Sextreme HD"], observacoes: "Promoção R$ 19,95 por 2 meses." },
];


// =============================================================================
// 4. O SCRIPT DE UPLOAD (NÃO MEXA AQUI)
// =============================================================================

/**
 * Função principal para semear o banco de dados.
 */
async function seedDatabase() {
  console.log('Iniciando o script de semeadura (V5.0 - 100% COMPLETA)...');

  try {
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
    console.log(`✅ ${regioesParaCadastrar.length} Regiões cadastradas com sucesso!`);

    // --- UPLOAD DOS PRODUTOS ---
    console.log(`Iniciando upload de ${produtosParaCadastrar.length} produtos...`);
    // O Firestore limita as operações de batch a 500. Se tivermos mais, quebramos em múltiplos batches.
    const CHUNK_SIZE = 499;
    const productChunks = [];
    for (let i = 0; i < produtosParaCadastrar.length; i += CHUNK_SIZE) {
        productChunks.push(produtosParaCadastrar.slice(i, i + CHUNK_SIZE));
    }

    for (let i = 0; i < productChunks.length; i++) {
        console.log(`Processando lote de produtos ${i + 1} de ${productChunks.length}...`);
        const batch = writeBatch(db);
        const chunk = productChunks[i];
        
        chunk.forEach((produto) => {
            // Usando um ID fixo para o documento, o set irá sobrescrever se já existir.
            const produtoRef = doc(db, 'produtos', produto.id); 
            // Criamos uma cópia do objeto produto para não modificar o original
            const produtoData: any = {...produto};
            // Removemos o ID do objeto de dados, pois ele já está no nome do documento
            delete produtoData.id; 
            
            batch.set(produtoRef, {
                ...produtoData,
                precoAnual: produto.precoAnual || null, // Garante que o campo exista
            });
        });
        
        await batch.commit();
        console.log(`✅ Lote ${i + 1} cadastrado com sucesso!`);
    }
    
    console.log(`✅ TOTAL de ${produtosParaCadastrar.length} Produtos cadastrados com sucesso!`);
    console.log('🚀 Semeadura do banco de dados concluída!');

  } catch (error) {
    console.error('❌ Erro durante a semeadura do banco de dados:', error);
  }
}

// Roda a função
seedDatabase();

    