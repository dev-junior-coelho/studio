// seed.ts (VERSÃO 11.0 - ATUALIZAÇÃO 09.12.2025 - TABELA CLARO V2.1)
// Removida a Promo Multi Friday. Franquia total dos planos Pós e Controle foi reduzida.
// ATUALIZADO PARA USAR FIREBASE ADMIN SDK (SERVER-SIDE)

import admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// 1. CREDENCIAIS DO PROJETO (SERVICE ACCOUNT)
// =============================================================================
try {
  // Caminho para o arquivo service-account.json na raiz
  // OBS: Em modo ESM ou algumas configs de TS, __dirname pode não existir.
  // Usaremos process.cwd() que aponta para onde o comando está sendo rodado (raiz do projeto).
  const serviceAccountPath = path.join(process.cwd(), 'service-account.json');

  if (!fs.existsSync(serviceAccountPath)) {
    console.error("ERRO: Arquivo 'service-account.json' não encontrado na raiz do projeto!");
    console.error("Por favor, gere uma nova chave privada no Firebase Console > Configurações do Projeto > Contas de Serviço.");
    console.error("Renomeie o arquivo baixado para 'service-account.json' e coloque em: " + serviceAccountPath);
    process.exit(1);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  // Inicializa o Firebase Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error("Erro ao inicializar Firebase Admin:", error);
  process.exit(1);
}

const db = admin.firestore();

// =============================================================================
// 2. DADOS DAS REGIÕES
// =============================================================================
const regioesParaCadastrar = [
  // Regiões de BL "Padrão" (p.18) e TV "Cabo" (p.65)
  {
    id: "padrao",
    nome: "Padrão (Cabo/Fibra)",
    cidades: ["Almirante Tamandare-PR", "Araucaria-PR", "Campo Largo-PR", "Colombo-PR", "Pinhais-SP", "Itapevi-SP", "Jandira-SP", "Tiete-SP", "Vargem Grande Paulista-SP", "Canoas-RS", "Caxias Do Sul-RS", "Esteio-RS", "Farroupilha-RS", "Florianopolis-SC", "Joinville-SC", "Londrina-PR", "Porto Alegre-RS", "Sao Jose Dos Pinhais-PR", "Sao Jose-SC", "Sapucaia Do Sul-RS", "Americana-SP", "Araras-SP", "Atibaia-SP", "Barueri-SP", "Belo Horizonte-MG", "Braganca Paulista-SP", "Campinas-SP", "Contagem-MG", "Cotia-SP", "Cubatao-SP", "Diadema-SP", "Elias Fausto-SP", "Guarulhos-SP", "Itu-SP", "Jundiai-SP", "Mogi Mirim-SP", "Monte Mor-SP", "Osasco-SP", "Piracicaba-SP", "Poa-SP", "Porto Feliz-SP", "Rafard-SP", "Rio Claro-SP", "Rio De Janeiro-RJ", "Sabara-MG", "Salto-SP", "Santa Barbara DOeste-SP", "Santana De Parnaiba-SP", "Santo Andre-SP", "Sao Bernardo Do Campo-SP", "Sao Caetano Do Sul-SP", "Sao Goncalo-RJ", "Sao Paulo-SP", "Sertaozinho-SP", "Suzano-SP", "Taboao Da Serra-SP", "Brasilia-DF", "Manaus-AM", "Lauro De Freitas-BA", "Salvador-BA"]
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
    cidades: ["Fortaleza-CE", "Teresina-PI", "Lagoa Santa-MG", "Santa Luzia-MG", "Vespasiano-MG", "Macapa-AP"]
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
  // Regiões de BL "Redes Neutras MED 02" (p.29)
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
    cidades: ["Apucarana-PR", "Biguacu-SC", "Cambe-PR", "Guaramirim-SC", "Jaragua Do Sul-SC", "Rolandia-PR", "Sao Francisco Do Sul-SC", "Aluminio-SP", "Americo Brasiliense-SP", "Aruja-SP", "Cabreuva-SP", "Caieiras-SP", "Cajamar-SP", "Campo Limpo Paulista-SP", "Caraguatatuba-SP", "Cordeiropolis-SP", "Itaguai-RJ", "Itaquaquecetuba-SP", "Itatiba-SP", "Itupeva-SP", "Jaguariuna-SP", "Jarinu-SP", "Lagoa Santa-MG", "Mairinque-SP", "Mirassol-SP", "Mongagua-SP", "Morungaba-SP", "Perube-SP", "Piracaia-SP", "Ribeirao Pires-SP", "Santa Gertrudes-SP", "Santa Isabel-SP", "Santa Luzia-MG", "Sao Roque-SP", "Sao Sebastiao-SP", "Ubatuba-SP", "Varzea Paulista-SP", "Vespasiano-MG", "Macapa-AP", "Santana-AP", "Aquiraz-CE", "Camacari-BA", "Eusebio-CE", "Mata De Sao Joao-BA"]
  },
  // Região Nacional para produtos que não dependem de geografia (Móvel, Opcionais, App, Upgrade)
  {
    id: "nacional",
    nome: "Nacional (Móvel/Opcional)",
    cidades: []
  }
];

// =============================================================================
// 3. DADOS DOS PRODUTOS (V11.0 - ATUALIZAÇÃO 09.12.2025)
// =============================================================================

// Benefícios Padrão de BL (Apenas SVAs base, pois a franquia está na descrição):
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
  // --- 1. PRODUTOS MÓVEIS (PÓS - MULTI) - ATUALIZADO (REMOVIDO BÔNUS MULTI FRIDAY) ---
  {
    regiaoId: "nacional", tipo: "Movel", nome: "Claro Pós 300GB (Multi)", dependentesGratis: 3, precoMensal: 319.90, precoAnual: null,
    beneficios: [
      "Franquia Total: 600 GB (300 GB Uso Livre + 300 GB Redes). BÔNUS MULTI FRIDAY REMOVIDO.",
      "Passaporte: MUNDO (Uso do plano em 80 países, incluso sem custo na modalidade Multi)",
      "Dependentes Inclusos (Grátis): 3. (Limite máximo de 4 dependentes pagos)",
      "SVAs Inclusos: Skeelo Premium, Truecaller, Claro Banca Premium, StbFit, Starbeme Zen App",
      "Benefício Extra: 4 meses de ChatGPT Plus (na modalidade Multi)",
      "Uso da Internet: Suspensa ao término da franquia, com opção de compra de pacote adicional",
      "Ligações Ilimitadas: Fixo e Celular de qualquer operadora do Brasil (usando 21)"
    ],
    observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital. Fidelidade 12 meses. Procedimento: PDS 300GB C/AP PAD / POS 300GB S/AP PAD"
  },
  {
    regiaoId: "nacional", tipo: "Movel", nome: "Claro Pós 150GB (Multi)", dependentesGratis: 2, precoMensal: 219.90, precoAnual: null,
    beneficios: [
      "Franquia Total: 300 GB (150 GB Uso Livre + 150 GB Redes). BÔNUS MULTI FRIDAY REMOVIDO.",
      "Passaporte: MUNDO (Uso do plano em 80 países, incluso sem custo na modalidade Multi)",
      "Dependentes Inclusos (Grátis): 2. (Limite máximo de 4 dependentes pagos)",
      "SVAs Inclusos: Skeelo Premium, Truecaller, Claro Banca Premium, StbFit, Starbeme Zen App",
      "Benefício Extra: 4 meses de ChatGPT Plus (na modalidade Multi)",
      "Uso da Internet: Suspensa ao término da franquia, com opção de compra de pacote adicional",
      "Ligações Ilimitadas: Fixo e Celular de qualquer operadora do Brasil (usando 21)"
    ],
    observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital. Fidelidade 12 meses. Procedimento: POS 150GB C/AP PAD / POS 150GB S/AP PAD"
  },
  {
    regiaoId: "nacional", tipo: "Movel", nome: "Claro Pós 100GB (Multi)", dependentesGratis: 1, precoMensal: 169.90, precoAnual: null,
    beneficios: [
      "Franquia Total: 200 GB (100 GB Uso Livre + 100 GB Redes). BÔNUS MULTI FRIDAY REMOVIDO.",
      "Passaporte: MUNDO (Uso do plano em 80 países, incluso sem custo na modalidade Multi)",
      "Dependentes Inclusos (Grátis): 1. (Limite máximo de 4 dependentes pagos)",
      "SVAs Inclusos: Skeelo Premium, Truecaller, Claro Banca Premium",
      "Benefício Extra: 4 meses de ChatGPT Plus (na modalidade Multi)",
      "Uso da Internet: Suspensa ao término da franquia, com opção de compra de pacote adicional",
      "Ligações Ilimitadas: Fixo e Celular de qualquer operadora do Brasil (usando 21)"
    ],
    observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital. Fidelidade 12 meses. Procedimento: POS 100GB C/AP PAD / POS 100GB S/AP PAD"
  },
  {
    regiaoId: "nacional", tipo: "Movel", nome: "Claro Pós 60GB Gaming (Multi)", precoMensal: 149.90, precoAnual: null,
    beneficios: [
      "Franquia Total: 120 GB (60 GB Uso Livre + 60 GB Redes). BÔNUS MULTI FRIDAY REMOVIDO.",
      "Passaporte: MUNDO (Uso do plano em 80 países, incluso sem custo na modalidade Multi)",
      "Streaming de Jogos: Geforce NOW incluso",
      "Dependentes Inclusos (Grátis): 0. (Limite máximo de 4 dependentes pagos)",
      "SVAs Inclusos: Skeelo Premium, Truecaller, Claro Banca Premium",
      "Benefício Extra: 4 meses de ChatGPT Plus (na modalidade Multi)",
      "Uso da Internet: Suspensa ao término da franquia, com opção de compra de pacote adicional",
      "Ligações Ilimitadas: Fixo e Celular de qualquer operadora do Brasil (usando 21)"
    ],
    observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital. Fidelidade 12 meses. Procedimento: POS 60GB GAMING C/AP PAD / POS 60GB GAMING S/AP PAD"
  },
  {
    regiaoId: "nacional", tipo: "Movel", nome: "Claro Pós 50GB (Multi)", precoMensal: 119.90, precoAnual: null,
    beneficios: [
      "Franquia Total: 100 GB (50 GB Uso Livre + 50 GB Redes). BÔNUS MULTI FRIDAY REMOVIDO.",
      "Passaporte: MUNDO (Uso do plano em 80 países, incluso sem custo na modalidade Multi)",
      "Dependentes Inclusos (Grátis): 0. (Limite máximo de 4 dependentes pagos)",
      "SVAs Inclusos: Skeelo Padrão, Truecaller, Claro Banca Premium",
      "Benefício Extra: 4 meses de ChatGPT Plus (na modalidade Multi)",
      "Uso da Internet: Suspensa ao término da franquia, com opção de compra de pacote adicional",
      "Ligações Ilimitadas: Fixo e Celular de qualquer operadora do Brasil (usando 21)"
    ],
    observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital. Fidelidade 12 meses. Procedimento: POS 50GB C/AP PAD / POS 50GB S/AP PAD"
  },
  {
    regiaoId: "nacional", tipo: "Movel", nome: "Claro Pós 25GB (Multi)", precoMensal: 59.90, precoAnual: null,
    beneficios: [
      "Franquia Total: 50 GB (25 GB Uso Livre + 25 GB Redes). BÔNUS MULTI FRIDAY REMOVIDO.",
      "Passaporte: MUNDO (Uso do plano em 80 países, incluso sem custo na modalidade Multi)",
      "Dependentes Inclusos (Grátis): 0. (LIMITE MÁXIMO: 1 dependente pago)",
      "Benefício Extra: 4 meses de ChatGPT Plus (na modalidade Multi)",
      "Uso da Internet: Suspensa ao término da franquia, com opção de compra de pacote adicional",
      "Ligações Ilimitadas: Fixo e Celular de qualquer operadora do Brasil (usando 21)"
    ],
    observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital. Fidelidade 12 meses. Procedimento: POS 25GB C/AP PAD / POS 25GB S/AP PAD"
  },

  // --- 2. PRODUTOS MÓVEIS (CONTROLE - MULTI) - ATUALIZADO (REMOVIDO BÔNUS MULTI FRIDAY) ---
  {
    regiaoId: "nacional", tipo: "Movel", nome: "Claro Controle 25GB Gamer (Multi)", precoMensal: 99.90, precoAnual: null,
    beneficios: [
      "Franquia Total: 30 GB (25 GB Uso Livre + 5 GB Redes). BÔNUS MULTI FRIDAY REMOVIDO.",
      "Passaporte: NÃO INCLUSO.",
      "Streaming de Jogos: Geforce NOW incluso",
      "SVAs Inclusos: Skeelo Padrão, Claro Banca Padrão",
      "Benefício Extra: 4 meses de ChatGPT Plus (na modalidade Multi)",
      "Uso da Internet: Bloqueada após o consumo integral da franquia, até contratação de pacote adicional",
      "Ligações Ilimitadas: Fixo e Celular de qualquer operadora do Brasil (usando 21)"
    ],
    observacoes: "Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses. Procedimento: CONTROLE GEFORCE MULTI 25GB+5GB C/APA / S/APA"
  },
  {
    regiaoId: "nacional", tipo: "Movel", nome: "Claro Controle 25GB (Multi)", precoMensal: 69.90, precoAnual: null,
    beneficios: [
      "Franquia Total: 30 GB (25 GB Uso Livre + 5 GB Redes). BÔNUS MULTI FRIDAY REMOVIDO.",
      "Passaporte: NÃO INCLUSO.",
      "SVAs Inclusos: Skeelo Padrão, Claro Banca Padrão",
      "Benefício Extra: 4 meses de ChatGPT Plus (na modalidade Multi)",
      "Uso da Internet: Bloqueada após o consumo integral da franquia, até contratação de pacote adicional",
      "Ligações Ilimitadas: Fixo e Celular de qualquer operadora do Brasil (usando 21)"
    ],
    observacoes: "Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses. Procedimento: CONTROLE MULTI 25GB+5GB REDES C/APA / S/APA"
  },
  {
    regiaoId: "nacional", tipo: "Movel", nome: "Claro Controle 20GB (Multi)", precoMensal: 44.90, precoAnual: null,
    beneficios: [
      "Franquia Total: 25 GB (20 GB Uso Livre + 5 GB Redes). BÔNUS MULTI FRIDAY REMOVIDO.",
      "Passaporte: NÃO INCLUSO.",
      "SVAs Inclusos: Skeelo Light, Claro Banca Padrão",
      "Benefício Extra: 4 meses de ChatGPT Plus (na modalidade Multi)",
      "Uso da Internet: Bloqueada após o consumo integral da franquia, até contratação de pacote adicional",
      "Ligações Ilimitadas: Fixo e Celular de qualquer operadora do Brasil (usando 21)"
    ],
    observacoes: "Desconto de R$ 5,00 no DCC+Fatura Digital. Fidelidade 12 meses. Procedimento: CONTROLE MULTI 20GB+5GB REDES C/APA / S/APA"
  },

  // --- 3. PRODUTOS BANDA LARGA (GRANULAR POR REGIÃO E COMBO) ---

  // Região: padrao (p.18)
  { regiaoId: "padrao", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 299.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL1 GIGA GPLAY UP50 FID / BL 1 GIGA GPLAY PON FID" },
  { regiaoId: "padrao", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fone: R$ 149,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 750M GPLAY C/CEL OU TV FID / BL 750M GPLAY C/CEL OU TV PON FID" },
  { regiaoId: "padrao", tipo: "Banda Larga", nome: "BL 750 Mega (Single/Fone)", precoMensal: 149.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 750M SINGLE OU C/FONE GPLAY FID / BL 750M SINGLE OU C/FONE GPLAY PON FID" },
  { regiaoId: "padrao", tipo: "Banda Larga", nome: "BL 600 Mega (Combo)", precoMensal: 99.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fone: R$ 119,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL MULTI 600M GPLAY FID / FIBRA MULTI 600M GPLAY FID" },
  { regiaoId: "padrao", tipo: "Banda Larga", nome: "BL 600 Mega (Single/Fone)", precoMensal: 119.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 500MEGA GPLAY FID / FIBRA 600MEGA GPLAY FID" },
  { regiaoId: "padrao", tipo: "Banda Larga", nome: "BL 350 Mega (Combo)", precoMensal: 79.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fone: R$ 99,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 350M GPLAY C/CEL OU TV FID / BL 350M GPLAY C/CEL OU TV PON FID" },
  { regiaoId: "padrao", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fone)", precoMensal: 99.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 350M SINGLE OU C/FONE GPLAY FID / BL 350M SINGLE OU C/FONE GPLAY PON FID" },

  // Região: especial (p.19)
  { regiaoId: "especial", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 199.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL1 GIGA GPLAY UP50 FID / BL 1 GIGA GPLAY PON FID" },
  { regiaoId: "especial", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fone: R$ 149,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 750M GPLAY C/CEL OU TV FID / BL 750M GPLAY C/CEL OU TV PON FID" },
  { regiaoId: "especial", tipo: "Banda Larga", nome: "BL 750 Mega (Single/Fone)", precoMensal: 149.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 750M SINGLE OU C/FONE GPLAY FID / BL 750M SINGLE OU C/FONE GPLAY PON FID" },
  { regiaoId: "especial", tipo: "Banda Larga", nome: "BL 600 Mega (Combo)", precoMensal: 99.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fone: R$ 119,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL MULTI 600M GPLAY FID / FIBRA MULTI 600M GPLAY FID" },
  { regiaoId: "especial", tipo: "Banda Larga", nome: "BL 600 Mega (Single/Fone)", precoMensal: 119.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 600MEGA GPLAY FID / FIBRA 600MEGA GPLAY FID" },
  { regiaoId: "especial", tipo: "Banda Larga", nome: "BL 350 Mega (Combo)", precoMensal: 79.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 350M GPLAY C/CEL OU TV FID / BL 350M GPLAY C/CEL OU TV PON FID" },
  { regiaoId: "especial", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fone)", precoMensal: 99.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 350M SINGLE OU C/FONE GPLAY FID / BL 350M SINGLE OU C/FONE GPLAY PON FID" },

  // Região: especial-promo-6m (p.20)
  { regiaoId: "especial-promo-6m", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 199.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL1 GIGA GPLAY UP50 FID / BL 1 GIGA GPLAY PON FID" },
  { regiaoId: "especial-promo-6m", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fone: R$ 149,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 750M GPLAY C/CEL OU TV FID / BL 750M GPLAY C/CEL OU TV PON FID" },
  { regiaoId: "especial-promo-6m", tipo: "Banda Larga", nome: "BL 750 Mega (Single/Fone)", precoMensal: 149.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 750M SINGLE OU C/FONE GPLAY FID / BL 750M SINGLE OU C/FONE GPLAY PON FID" },
  { regiaoId: "especial-promo-6m", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Combo R$ 49,90/6M)", precoMensal: 49.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM MÓVEL por 6 meses, após R$ 79,90. Preço Single/Fone: R$ 119,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL MULTI 600M GPLAY MD FID / FIBRA MULTI 600M GPLAY MD FID (PROMO AQS MULTI 600M MD DESC 30 6M)" },
  { regiaoId: "especial-promo-6m", tipo: "Banda Larga", nome: "BL 600 Mega (Single/Fone)", precoMensal: 119.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 600MEGA GPLAY FID / FIBRA 600MEGA GPLAY FID" },
  { regiaoId: "especial-promo-6m", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fone)", precoMensal: 89.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 350M GPLAY SINGLE OU C/FONE FID / BL 350M GPLAY SINGLE OU C/FONE PON FID" },

  // Região: especial-promo-3m (p.21)
  { regiaoId: "especial-promo-3m", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 199.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL1 GIGA GPLAY UP50 FID / BL 1 GIGA GPLAY PON FID" },
  { regiaoId: "especial-promo-3m", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fone: R$ 149,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 750M GPLAY C/CEL OU TV FID / BL 750M GPLAY C/CEL OU TV PON FID" },
  { regiaoId: "especial-promo-3m", tipo: "Banda Larga", nome: "BL 750 Mega (Single/Fone)", precoMensal: 149.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 750M SINGLE OU C/FONE GPLAY FID / BL 750M SINGLE OU C/FONE GPLAY PON FID" },
  { regiaoId: "especial-promo-3m", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Combo R$ 59,90/3M)", precoMensal: 59.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM MÓVEL por 3 meses, após R$ 99,90. Preço Single/Fone: R$ 119,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL MULTI 600M GPLAY FID / FIBRA MULTI 600M GPLAY FID (PROMO AQS 600M MULTI DESC 40,00-3M)" },
  { regiaoId: "especial-promo-3m", tipo: "Banda Larga", nome: "BL 600 Mega (Single/Fone)", precoMensal: 119.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 600MEGA GPLAY FID / FIBRA 600MEGA GPLAY FID" },
  { regiaoId: "especial-promo-3m", tipo: "Banda Larga", nome: "BL 350 Mega (Combo)", precoMensal: 79.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fone: R$ 99,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 350M GPLAY C/CEL OU TV FID / BL 350M GPLAY C/CEL OU TV PON FID" },
  { regiaoId: "especial-promo-3m", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fone)", precoMensal: 99.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 350M SINGLE OU C/FONE GPLAY FID / BL 350M SINGLE OU C/FONE GPLAY PON FID" },

  // Região: especial-plus (p.22)
  { regiaoId: "especial-plus", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 199.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL1 GIGA GPLAY UP50 FID / BL 1 GIGA GPLAY PON FID" },
  { regiaoId: "especial-plus", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fone: R$ 129,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 750M GPLAY C/CEL OU TV FID / BL 750M GPLAY C/CEL OU TV PON FID" },
  { regiaoId: "especial-plus", tipo: "Banda Larga", nome: "BL 750 Mega (Single/Fone)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 750M SINGLE OU C/FONE GPLAY FID / BL 750M SINGLE OU C/FONE GPLAY PON FID" },
  { regiaoId: "especial-plus", tipo: "Banda Larga", nome: "BL 600 Mega (Combo)", precoMensal: 99.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL MULTI 600M GPLAY FID / FIBRA MULTI 600M GPLAY FID" },
  { regiaoId: "especial-plus", tipo: "Banda Larga", nome: "BL 600 Mega (Single/Fone)", precoMensal: 99.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 600MEGA GPLAY MD FID / FIBRA 600MEGA GPLAY MD FID" },
  { regiaoId: "especial-plus", tipo: "Banda Larga", nome: "BL 350 Mega (Combo)", precoMensal: 79.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fone: R$ 89,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 350M GPLAY C/CEL OU TV FID / BL 350M GPLAY C/CEL OU TV PON FID" },
  { regiaoId: "especial-plus", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fone)", precoMensal: 89.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 350M GPLAY SINGLE OU C/FONE FID / BL 350M GPLAY SINGLE OU C/FONE PON FID" },

  // Região: especial-plus-promo-6m (p.23)
  { regiaoId: "especial-plus-promo-6m", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 199.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL1 GIGA GPLAY UP50 FID / BL 1 GIGA GPLAY PON FID" },
  { regiaoId: "especial-plus-promo-6m", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fone: R$ 129,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 750M GPLAY C/CEL OU TV FID / BL 750M GPLAY C/CEL OU TV PON FID" },
  { regiaoId: "especial-plus-promo-6m", tipo: "Banda Larga", nome: "BL 750 Mega (Single/Fone)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 750M SINGLE OU C/FONE GPLAY FID / BL 750M SINGLE OU C/FONE GPLAY PON FID" },
  { regiaoId: "especial-plus-promo-6m", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Combo R$ 49,90/6M)", precoMensal: 49.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM MÓVEL por 6 meses, após R$ 79,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL MULTI 600M GPLAY MD FID / FIBRA MULTI 600M GPLAY MD FID (PROMO AQS MULTI 600M MD DESC 30 6M)" },
  { regiaoId: "especial-plus-promo-6m", tipo: "Banda Larga", nome: "BL 600 Mega (Single/Fone)", precoMensal: 99.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 600MEGA GPLAY MD FID / BL 600MEGA GPLAY MD FID" },
  { regiaoId: "especial-plus-promo-6m", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fone)", precoMensal: 89.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 350M GPLAY SINGLE OU C/FONE FID / BL 350M GPLAY SINGLE OU C/FONE PON FID" },

  // Região: especial-plus-promo-3-6m (p.24)
  { regiaoId: "especial-plus-promo-3-6m", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 199.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL1 GIGA GPLAY UP50 FID / BL 1 GIGA GPLAY PON FID" },
  { regiaoId: "especial-plus-promo-3-6m", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 750M GPLAY C/CEL OU TV FID / BL 750M GPLAY C/CEL OU TV PON FID" },
  { regiaoId: "especial-plus-promo-3-6m", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Combo R$ 49,90/6M)", precoMensal: 49.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM MÓVEL por 6 meses, após R$ 79,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL MULTI 600M GPLAY MD FID / FIBRA MULTI 600M GPLAY MD FID (PROMO AQS MULTI 600M MD DESC 30 6M)" },
  { regiaoId: "especial-plus-promo-3-6m", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Single R$ 59,90/3M)", precoMensal: 59.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single/Fone por 3 meses, após R$ 99,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 600MEGA GPLAY MD FID / FIBRA 600MEGA GPLAY MD FID (PROMO AQS 600M SINGLE DESC 40,00-3M)" },
  { regiaoId: "especial-plus-promo-3-6m", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fone)", precoMensal: 89.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 350M GPLAY SINGLE OU C/FONE FID / BL 350M GPLAY SINGLE OU C/FONE PON FID" },

  // Região: especial-plus-promo-3m (p.25)
  { regiaoId: "especial-plus-promo-3m", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 199.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL1 GIGA GPLAY UP50 FID / BL 1 GIGA GPLAY PON FID" },
  { regiaoId: "especial-plus-promo-3m", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 750M GPLAY C/CEL OU TV FID / BL 750M GPLAY C/CEL OU TV PON FID" },
  { regiaoId: "especial-plus-promo-3m", tipo: "Banda Larga", nome: "BL 750 Mega (Single/Fone)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 750M SINGLE OU C/FONE GPLAY FID / BL 750M SINGLE OU C/FONE GPLAY PON FID" },
  { regiaoId: "especial-plus-promo-3m", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Combo R$ 59,90/3M)", precoMensal: 59.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM MÓVEL por 3 meses, após R$ 99,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL MULTI 600M GPLAY FID / FIBRA MULTI 600M GPLAY FID (PROMO AQS 600M MULTI DESC 40,00-3M)" },
  { regiaoId: "especial-plus-promo-3m", tipo: "Banda Larga", nome: "BL 600 Mega (Single/Fone)", precoMensal: 99.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 600MEGA GPLAY MD FID / FIBRA MULTI TURB 600M GPLAY FID" },
  { regiaoId: "especial-plus-promo-3m", tipo: "Banda Larga", nome: "BL 350 Mega (Combo)", precoMensal: 79.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 350M GPLAY C/CEL OU TV FID / BL 350M GPLAY C/CEL OU TV PON FID" },
  { regiaoId: "especial-plus-promo-3m", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fone)", precoMensal: 89.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 350M GPLAY SINGLE OU C/FONE FID / BL 350M GPLAY SINGLE OU C/FONE PON FID" },

  // Região: especial-plus-promo-3m-b (p.26)
  { regiaoId: "especial-plus-promo-3m-b", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 199.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL1 GIGA GPLAY UP50 FID / BL 1 GIGA GPLAY PON FID" },
  { regiaoId: "especial-plus-promo-3m-b", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 750M GPLAY C/CEL OU TV FID / BL 750M GPLAY C/CEL OU TV PON FID" },
  { regiaoId: "especial-plus-promo-3m-b", tipo: "Banda Larga", nome: "BL 750 Mega (Single/Fone)", precoMensal: 129.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 750M SINGLE OU C/FONE GPLAY FID / BL 750M SINGLE OU C/FONE GPLAY PON FID" },
  { regiaoId: "especial-plus-promo-3m-b", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Combo R$ 59,90/3M)", precoMensal: 59.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM MÓVEL por 3 meses, após R$ 99,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL MULTI 600M GPLAY FID / FIBRA MULTI 600M GPLAY FID (PROMO AQS 600M MULTI DESC 40,00-3M)" },
  { regiaoId: "especial-plus-promo-3m-b", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Single R$ 59,90/3M)", precoMensal: 59.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single/Fone por 3 meses, após R$ 119,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 600MEGA GPLAY MD FID / FIBRA 600MEGA GPLAY MD FID (PROMO AQS 600M SINGLE DESC 40,00-3M)" },
  { regiaoId: "especial-plus-promo-3m-b", tipo: "Banda Larga", nome: "BL 350 Mega (Combo)", precoMensal: 79.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 350M GPLAY C/CEL OU TV FID / BL 350M GPLAY C/CEL OU TV PON FID" },
  { regiaoId: "especial-plus-promo-3m-b", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fone)", precoMensal: 89.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 350M GPLAY SINGLE OU C/FONE FID / BL 350M GPLAY SINGLE OU C/FONE PON FID" },

  // Região: med-01 (p.27)
  { regiaoId: "med-01", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 204.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL1 GIGA GPLAY UP50 FID / BL 1 GIGA GPLAY PON FID" },
  { regiaoId: "med-01", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 134.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fone: R$ 134,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 750M GPLAY C/CEL OU TV FID / BL 750M GPLAY C/CEL OU TV PON FID" },
  { regiaoId: "med-01", tipo: "Banda Larga", nome: "BL 750 Mega (Single/Fone)", precoMensal: 134.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 750M SINGLE OU C/FONE GPLAY FID / BL 750M SINGLE OU C/FONE GPLAY PON FID" },
  { regiaoId: "med-01", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Combo R$ 64,90/6M)", precoMensal: 64.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM MÓVEL por 6 meses, após R$ 84,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL MULTI 600M GPLAY MD FID / FIBRA MULTI 600M GPLAY MD FID (PROMO AQS MULTI 500M MD A DESC 20 6M)" },
  { regiaoId: "med-01", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Single R$ 74,90/6M)", precoMensal: 74.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single/Fone por 6 meses, após R$ 104,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 600MEGA GPLAY MD FID / FIBRA 600MEGA GPLAY MD FID (PROMO AQS 1P 600M MD A DESC 30 6M)" },
  { regiaoId: "med-01", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fone)", precoMensal: 94.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 350M GPLAY SINGLE OU C/FONE FID / BL 350M GPLAY SINGLE OU C/FONE PON FID" },

  // Região: med-02 (p.28)
  { regiaoId: "med-02", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 204.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL1 GIGA GPLAY UP50 FID / BL 1 GIGA GPLAY PON FID" },
  { regiaoId: "med-02", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 134.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fone: R$ 134,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 750M GPLAY C/CEL OU TV FID / BL 750M GPLAY C/CEL OU TV PON FID" },
  { regiaoId: "med-02", tipo: "Banda Larga", nome: "BL 750 Mega (Single/Fone)", precoMensal: 134.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 750M SINGLE OU C/FONE GPLAY FID / BL 750M SINGLE OU C/FONE GPLAY PON FID" },
  { regiaoId: "med-02", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Combo R$ 54,90/6M)", precoMensal: 54.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM MÓVEL por 6 meses, após R$ 84,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL MULTI 600M GPLAY MD FID / FIBRA MULTI 600M GPLAY MD FID (PROMO AQS MULTI 600M MD DESC 30 6M)" },
  { regiaoId: "med-02", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Single R$ 64,90/6M)", precoMensal: 64.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single/Fone por 6 meses, após R$ 104,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 600MEGA GPLAY MD FID / FIBRA 600MEGA GPLAY MD FID (PROMO AQS 1P 600M MD DESC 40 6M)" },
  { regiaoId: "med-02", tipo: "Banda Larga", nome: "BL 350 Mega (Combo)", precoMensal: 74.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BANDA LARGA MULTI 350MEGA GPLAY MD FID / FIBRA MULTI 350MEGA GPLAY MD PON FID" },
  { regiaoId: "med-02", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fone)", precoMensal: 84.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 350M GPLAY IP OU C/FONE FID / BL 350M GPLAY IP OU C/FONE PON FID" },

  // Região: med-redes-neutras-02 (p.29)
  { regiaoId: "med-redes-neutras-02", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Combo R$ 54,90/6M)", precoMensal: 54.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM MÓVEL por 6 meses, após R$ 84,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: FIBRA MULTI 600M GPLAY MD FID (PROMO AQS MULTI 600M MD DESC 30 6M)" },
  { regiaoId: "med-redes-neutras-02", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Single R$ 64,90/6M)", precoMensal: 64.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single/Fone por 6 meses, após R$ 104,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: FIBRA 600MEGA GPLAY MD FID (PROMO AQS 1P 600M MD DESC 40 6M)" },
  { regiaoId: "med-redes-neutras-02", tipo: "Banda Larga", nome: "BL 350 Mega (Combo)", precoMensal: 74.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: FIBRA MULTI 350MEGA GPLAY MD PON FID" },
  { regiaoId: "med-redes-neutras-02", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fone)", precoMensal: 84.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 350M GPLAY IP OU C/FONE PON FID" },

  // Região: med-03 (p.30)
  { regiaoId: "med-03", tipo: "Banda Larga", nome: "BL 1 Giga (Combo)", precoMensal: 204.90, precoAnual: null, beneficios: beneficios1GBL, observacoes: "Preço COM TV OU MÓVEL. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL1 GIGA GPLAY UP50 FID / BL 1 GIGA GPLAY PON FID" },
  { regiaoId: "med-03", tipo: "Banda Larga", nome: "BL 750 Mega (Combo)", precoMensal: 134.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM TV OU MÓVEL. Preço Single/Fone: R$ 134,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 750M GPLAY C/CEL OU TV FID / BL 750M GPLAY C/CEL OU TV PON FID" },
  { regiaoId: "med-03", tipo: "Banda Larga", nome: "BL 750 Mega (Single/Fone)", precoMensal: 134.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 750M SINGLE OU C/FONE GPLAY FID / BL 750M SINGLE OU C/FONE GPLAY PON FID" },
  { regiaoId: "med-03", tipo: "Banda Larga", nome: "BL 600 Mega (Combo)", precoMensal: 54.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço COM MÓVEL. Preço Single/Fone: R$ 64,90 (6M) -> R$ 104,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL MULTI 600M GPLAY ESP FID / FIBRA MULTI 600M GPLAY ESP FID" },
  { regiaoId: "med-03", tipo: "Banda Larga", nome: "BL 600 Mega (Promo Single R$ 64,90/6M)", precoMensal: 64.90, precoAnual: null, beneficios: beneficios500MBL, observacoes: "Preço Single/Fone por 6 meses, após R$ 104,90. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 600MEGA GPLAY MD FID / FIBRA 600MEGA GPLAY MD FID (PROMO AQS 1P 600M MD DESC 40 6M)" },
  { regiaoId: "med-03", tipo: "Banda Larga", nome: "BL 350 Mega (Single/Fone)", precoMensal: 84.90, precoAnual: null, beneficios: beneficiosBaseBL, observacoes: "Preço Single ou COM FONE/APP. Desconto R$ 5,00 DCC. Fidelidade 12m. Procedimento: BL 350M GPLAY IP OU C/FONE FID / BL 350M GPLAY IP OU C/FONE PON FID" },

  // --- 4. PRODUTOS DE TV (AQUISIÇÃO - p.65-68) ---

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
  ...['fibra-pura'].flatMap(regiao => [
    {
      regiaoId: regiao, tipo: "TV", nome: "CTV+ FIBRA 4K SOUND MULTI", precoMensal: 154.90, precoAnual: null,
      beneficios: [...beneficiosTVComboCompleto, "Equipamento: Soundbox (Áudio Dolby Atmos)", "Benefício Multi: ChatGPT Plus (se Multi)"],
      observacoes: "Pacote Soundbox Fibra. Preço COM BL E MÓVEL (p.66). Desconto de R$ 5,00 no DCC+Fatura Digital."
    },
    {
      regiaoId: regiao, tipo: "TV", nome: "CTV+ FIBRA 4K SOUND", precoMensal: 164.90, precoAnual: null,
      beneficios: [...beneficiosTVComboCompleto, "Equipamento: Soundbox (Áudio Dolby Atmos)"],
      observacoes: "Pacote Soundbox Fibra. Preço COM BL OU MÓVEL ou SINGLE COM FONE (p.66). Desconto de R$ 5,00 no DCC+Fatura Digital."
    },
    {
      regiaoId: regiao, tipo: "TV", nome: "CTV+ FIBRA 4K MULTI", precoMensal: 124.90, precoAnual: null,
      beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box Fibra (Qualidade 4K)", "Benefício Multi: ChatGPT Plus (se Multi)"],
      observacoes: "Pacote Box Fibra. Preço COM BL E MÓVEL (p.66). Desconto de R$ 5,00 no DCC+Fatura Digital."
    },
    {
      regiaoId: regiao, tipo: "TV", nome: "CTV+ FIBRA 4K", precoMensal: 134.90, precoAnual: null,
      beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box Fibra (Qualidade 4K)"],
      observacoes: "Pacote Box Fibra. Preço SINGLE COM FONE (p.66). Desconto de R$ 5,00 no DCC+Fatura Digital."
    }
  ]),

  // TV MED (p.67) - Regiões 'med-*'
  ...['med-01', 'med-02', 'med-03', 'especial-promo-6m', 'especial-promo-3m', 'especial-plus', 'especial-plus-promo-6m', 'especial-plus-promo-3-6m', 'especial-plus-promo-3m'].flatMap(regiao => [
    {
      regiaoId: regiao, tipo: "TV", nome: "CTV+ TOP HD 4K SOUND (MED)", precoMensal: 154.90, precoAnual: null,
      beneficios: [...beneficiosTVComboCompleto, "Equipamento: Soundbox (Áudio Dolby Atmos)", "Oferta MED: Preços reduzidos"],
      observacoes: "Pacote Soundbox MED (Cabo/Fibra). Preço COM BL OU MÓVEL ou SINGLE COM FONE (p.67). Desconto de R$ 5,00 no DCC+Fatura Digital."
    },
    {
      regiaoId: regiao, tipo: "TV", nome: "CTV+ TOP HD 4K (MED)", precoMensal: 124.90, precoAnual: null,
      beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box (Qualidade 4K)", "Oferta MED: Preços reduzidos"],
      observacoes: "Pacote Box MED (Cabo/Fibra). Preço COM BL OU MÓVEL ou SINGLE COM FONE (p.67). Desconto de R$ 5,00 no DCC+Fatura Digital."
    }
  ]),
  // Adiciona a região 'especial-plus-promo-3m-b' que também usa preços MED para TV (p.67 - exceto se for Cabo em p.65, mas assumindo MED para simplificar oferta agressiva)
  {
    regiaoId: 'especial-plus-promo-3m-b', tipo: "TV", nome: "CTV+ TOP HD 4K SOUND (MED)", precoMensal: 154.90, precoAnual: null,
    beneficios: [...beneficiosTVComboCompleto, "Equipamento: Soundbox (Áudio Dolby Atmos)", "Oferta MED: Preços reduzidos"],
    observacoes: "Pacote Soundbox MED. Preço COM BL OU MÓVEL ou SINGLE COM FONE (p.67). Desconto de R$ 5,00 no DCC+Fatura Digital."
  },
  {
    regiaoId: 'especial-plus-promo-3m-b', tipo: "TV", nome: "CTV+ TOP HD 4K (MED)", precoMensal: 124.90, precoAnual: null,
    beneficios: [...beneficiosTVComboCompleto, "Equipamento: Box (Qualidade 4K)", "Oferta MED: Preços reduzidos"],
    observacoes: "Pacote Box MED. Preço COM BL OU MÓVEL ou SINGLE COM FONE (p.67). Desconto de R$ 5,00 no DCC+Fatura Digital."
  },

  // --- 5. APP (TV) ---
  {
    regiaoId: "nacional", tipo: "TV", nome: "App Claro tv+ (Globo)", precoMensal: 69.90, precoAnual: null,
    beneficios: [
      "Aplicativo para SmarTV, Tablet e Celular",
      "Mais de 100 canais ao vivo (inclui Globo local)",
      "Replay TV de até 7 dias",
      "Qualidade HD/4K",
      "2 Telas simultâneas"
    ],
    observacoes: "Sem equipamento físico. Fidelidade 12m. Desconto R$ 10,00 no Combo Multi (p.69)"
  },
  {
    regiaoId: "nacional", tipo: "TV", nome: "App Claro tv+ (Sem Globo)", precoMensal: 69.90, precoAnual: null,
    beneficios: [
      "Aplicativo para SmarTV, Tablet e Celular",
      "Mais de 100 canais ao vivo (NÃO inclui Globo)",
      "Replay TV de até 7 dias",
      "Qualidade HD/4K",
      "2 Telas simultâneas"
    ],
    observacoes: "Sem equipamento físico. Fidelidade 12m. Desconto R$ 10,00 no Combo Multi (p.69)"
  },

  // --- 6. OPCIONAIS E UPGRADES (p.72-73 e 75-76) ---
  // Pontos Adicionais
  { regiaoId: "nacional", tipo: "Opcional", nome: "Ponto Ultra (Cabeado)", precoMensal: 150.00, precoAnual: null, beneficios: ["Cabo de rede passado pela tubulação interna", "Garante máxima velocidade no cômodo"], observacoes: "(p.72) Valor único de instalação (em 12x R$ 12,50 ou à vista)" },
  { regiaoId: "nacional", tipo: "Opcional", nome: "Ponto Adicional 4K", precoMensal: 34.90, precoAnual: null, beneficios: ["Ponto extra de TV 4K"], observacoes: "(p.76) Mensalidade" },
  { regiaoId: "nacional", tipo: "Opcional", nome: "Ponto Adicional Gravação", precoMensal: 24.90, precoAnual: null, beneficios: ["Ponto extra com Gravação"], observacoes: "(p.76) Mensalidade" }, // Assumindo valor padrão, tabela pode variar.

  // SVAs Avulsos (exemplos)
  { regiaoId: "nacional", tipo: "Opcional", nome: "Netflix Padrão (Avulso)", precoMensal: 39.90, precoAnual: null, beneficios: ["2 telas Full HD"], observacoes: "SVA Avulso" },
  { regiaoId: "nacional", tipo: "Opcional", nome: "Globoplay (Avulso)", precoMensal: 24.90, precoAnual: null, beneficios: ["Conteúdo Globo"], observacoes: "SVA Avulso" }

];

// =============================================================================
// 4. FUNÇÃO DE SEED (LIMPEZA E INSERÇÃO)
// =============================================================================
const seedDatabase = async () => {
  console.log("Iniciando seed do banco de dados...");
  try {
    const batch = db.batch();

    // 1. Limpar coleções existentes (CUIDADO: Isso apaga tudo de produtos e regioes!)
    // Para uma limpeza real, precisaríamos buscar os docs e deletar. 
    // Como 'batch' tem limite de 500 ops, faremos um set overwrite nos IDs fixos ou deletar se necessário.
    // Por simplificação neste seed, vamos apenas sobrescrever os IDs que estamos criando.
    // Se quiser deletar tudo antes, seria necessário um 'getDocs' e loops de delete.
    // Vamos assumir "Upsert" (sobrescrever se existir).

    console.log("Preparando Regiões...");
    for (const regiao of regioesParaCadastrar) {
      const docRef = db.collection("regioes").doc(regiao.id);
      batch.set(docRef, regiao);
    }

    console.log("Preparando Produtos...");
    // Para produtos, vamos gerar IDs automáticos ou baseados em um slug para evitar duplicação em re-runs se mudar o nome.
    // Vamos usar coleção 'produtos'.
    // Dica: Se quiser limpar produtos antigos que não existem mais, o ideal seria deletar a coleção antes.
    // Aqui, vamos adicionar os novos. IDs serão gerados pelo Firestore ou determinísticos.
    // Usaremos determinístico (slug) para facilitar updates.

    // ATENÇÃO: Firestore Admin Batch tem limite de 500 operações.
    // Vamos dividir em chunks se necessário, mas por enquanto vamos commitar em loop se crescer muito.
    // Como temos ~50 produtos, um batch só resolve.

    for (const produto of produtosParaCadastrar) {
      const slug = `${produto.regiaoId}-${produto.tipo}-${produto.nome}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const docRef = db.collection("produtos").doc(slug);
      batch.set(docRef, {
        ...produto,
        atualizadoEm: new Date().toISOString()
      });
    }

    console.log("Commitando alterações no Firestore...");
    await batch.commit();
    console.log("Seed concluído com sucesso!");

  } catch (error) {
    console.error("Erro ao rodar seed:", error);
  }
};

// Executar o seed
seedDatabase();
