// data/seedRegioes.ts (cidades e regras extraidas dos PDFs, p.18-30 e p.65-68)

export interface Regiao {
    id: string;
    nome: string;
    descricao?: string;
    cidades: string[];
}

export const regioes: Regiao[] = [
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
    cidades: ["Apucarana-PR", "Biguacu-SC", "Cambe-PR", "Guaramirim-SC", "Jaragua Do Sul-SC", "Rolandia-PR", "Sao Francisco Do Sul-SC", "Aluminio-SP", "Americo Brasiliense-SP", "Aruja-SP", "Cabreuva-SP", "Caieiras-SP", "Cajamar-SP", "Campo Limpo Paulista-SP", "Caraguatatuba-SP", "Cordeiropolis-SP", "Itaguai-RJ", "Itanhaem-SP", "Itaquaquecetuba-SP", "Itatiba-SP", "Itupeva-SP", "Jaguariuna-SP", "Jarinu-SP", "Lagoa Santa-MG", "Mairinque-SP", "Mirassol-SP", "Mongagua-SP", "Morungaba-SP", "Perube-SP", "Piracaia-SP", "Ribeirao Pires-SP", "Santa Gertrudes-SP", "Santa Isabel-SP", "Santa Luzia-MG", "Sao Roque-SP", "Sao Sebastiao-SP", "Ubatuba-SP", "Varzea Paulista-SP", "Vespasiano-MG", "Macapa-AP", "Santana-AP", "Aquiraz-CE", "Camacari-BA", "Eusebio-CE", "Mata De Sao Joao-BA"]
  },
  // Região Nacional para produtos que não dependem de geografia (Móvel, Opcionais, App, Upgrade)
  {
    id: "nacional",
    nome: "Nacional (Móvel/Opcional)",
    cidades: [] // Usado para produtos nacionais
  }
];

export default regioes;
