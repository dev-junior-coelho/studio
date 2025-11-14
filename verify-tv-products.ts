// Script de Verificação: Validar Produtos de TV no seed.ts
// Objetivo: Verificar integridade dos dados de TV

import { readFileSync } from 'fs';

// Função para extrair dados do arquivo seed.ts
function extractProductsFromSeed() {
  const seedContent = readFileSync('src/seed.ts', 'utf-8');
  
  // Regex para encontrar produtos TV
  const tvProductRegex = /tipo:\s*"TV\s+\w+"/g;
  const tvProducts = seedContent.match(tvProductRegex) || [];
  
  // Contar produtos por tipo
  const typeCount: { [key: string]: number } = {};
  tvProducts.forEach(match => {
    const type = match.replace('tipo: "', '').replace('"', '');
    typeCount[type] = (typeCount[type] || 0) + 1;
  });
  
  return typeCount;
}

// Função para verificar campos obrigatórios
function validateRequiredFields() {
  const seedContent = readFileSync('src/seed.ts', 'utf-8');
  
  // Procurar por padrões de campos obrigatórios em produtos
  const fieldChecks = {
    regiaoId: /regiaoId:\s*"[\w-]+"/g,
    tipo: /tipo:\s*"[^"]+"/g,
    nome: /nome:\s*"[^"]+"/g,
    precoMensal: /precoMensal:\s*\d+\.?\d*/g,
    beneficios: /beneficios:\s*\[/g,
    observacoes: /observacoes:\s*"[^"]+"/g,
    ordem: /ordem:\s*\d+/g
  };
  
  const results: { [key: string]: number } = {};
  Object.entries(fieldChecks).forEach(([field, regex]) => {
    const matches = seedContent.match(regex) || [];
    results[field] = matches.length;
  });
  
  return results;
}

// Função para verificar regiões de TV
function validateTVRegions() {
  const seedContent = readFileSync('src/seed.ts', 'utf-8');
  
  // Procurar por padrões de regiões usadas em produtos TV
  const regionPattern = /regiaoId:\s*"([^"]+)"[\s\S]*?tipo:\s*"TV/g;
  const regions = new Set<string>();
  
  let match;
  const tvRegex = /tipo:\s*"TV/g;
  const tvMatches = seedContent.match(tvRegex) || [];
  
  // Extrair regiões únicas
  const fullPattern = /regiaoId:\s*"([^"]+)"[\s\S]{0,200}tipo:\s*"TV/g;
  while ((match = fullPattern.exec(seedContent)) !== null) {
    regions.add(match[1]);
  }
  
  return Array.from(regions);
}

// Função para validar campo "ordem"
function validateOrdenField() {
  const seedContent = readFileSync('src/seed.ts', 'utf-8');
  
  // Procurar por produtos TV sem campo ordem
  const tvBlocksRegex = /{\s*regiaoId:[^}]*tipo:\s*"TV[^"]*"[^}]*}/g;
  const tvBlocks = seedContent.match(tvBlocksRegex) || [];
  
  let withOrder = 0;
  let withoutOrder = 0;
  
  tvBlocks.forEach(block => {
    if (/ordem:\s*\d+/.test(block)) {
      withOrder++;
    } else {
      withoutOrder++;
    }
  });
  
  return { withOrder, withoutOrder, total: tvBlocks.length };
}

// Função para listar categorias de TV
function extractTVCategories() {
  const seedContent = readFileSync('src/seed.ts', 'utf-8');
  const categories = new Set<string>();
  
  const pattern = /tipo:\s*"(TV\s+[^"]+)"/g;
  let match;
  while ((match = pattern.exec(seedContent)) !== null) {
    categories.add(match[1]);
  }
  
  return Array.from(categories);
}

// Executar verificações
console.log('='.repeat(80));
console.log('🔍 VERIFICAÇÃO DE PRODUTOS TV - SEED.TS V11.0');
console.log('='.repeat(80));

console.log('\n1️⃣ Contagem de Produtos por Tipo:');
console.log('-'.repeat(40));
const typeCount = extractProductsFromSeed();
Object.entries(typeCount).forEach(([type, count]) => {
  console.log(`   ${type}: ${count} produtos`);
});
const totalTV = Object.values(typeCount).reduce((a, b) => a + b, 0);
console.log(`   ✅ TOTAL: ${totalTV} produtos de TV`);

console.log('\n2️⃣ Validação de Campos Obrigatórios:');
console.log('-'.repeat(40));
const fieldValidation = validateRequiredFields();
const expectedProductCount = 273; // Aproximadamente
Object.entries(fieldValidation).forEach(([field, count]) => {
  const status = count > 200 ? '✅' : '⚠️';
  console.log(`   ${status} ${field}: ${count} ocorrências`);
});

console.log('\n3️⃣ Regiões com Produtos TV:');
console.log('-'.repeat(40));
const tvRegions = validateTVRegions();
tvRegions.forEach(region => {
  console.log(`   ✅ ${region}`);
});
console.log(`   Total de regiões com TV: ${tvRegions.length}`);

console.log('\n4️⃣ Validação do Campo "ordem":');
console.log('-'.repeat(40));
const ordenCheck = validateOrdenField();
console.log(`   Com campo ordem: ${ordenCheck.withOrder}`);
console.log(`   Sem campo ordem: ${ordenCheck.withoutOrder}`);
console.log(`   Total de blocos TV: ${ordenCheck.total}`);
if (ordenCheck.withoutOrder === 0) {
  console.log('   ✅ TODOS os produtos TV têm campo ordem!');
} else {
  console.log(`   ⚠️  ${ordenCheck.withoutOrder} produtos TV sem campo ordem!`);
}

console.log('\n5️⃣ Categorias de TV Encontradas:');
console.log('-'.repeat(40));
const categories = extractTVCategories();
categories.forEach((cat, idx) => {
  console.log(`   ${idx + 1}. ${cat}`);
});

console.log('\n' + '='.repeat(80));
console.log('✅ Verificação concluída!');
console.log('='.repeat(80));
