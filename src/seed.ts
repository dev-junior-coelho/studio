// seed.ts - Script Principal de Seed (V11.0 - Modular)
// ATUALIZADO PARA USAR FIREBASE ADMIN SDK (SERVER-SIDE)

import admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Importa os dados de cada módulo
import { regioes } from './data/seedRegioes.js';
import { produtosTV } from './data/seedTV.js';
import { produtosBandaLarga } from './data/seedBandaLarga.js';
import { produtosMovel } from './data/seedMovel.js';
import { produtosOpcionais } from './data/seedOpcionais.js';

// =============================================================================
// 1. INICIALIZAÇÃO DO FIREBASE ADMIN SDK
// =============================================================================
try {
  const serviceAccountPath = path.join(process.cwd(), 'service-account.json');

  if (!fs.existsSync(serviceAccountPath)) {
    console.error("❌ ERRO: Arquivo 'service-account.json' não encontrado na raiz do projeto!");
    console.error("   Por favor, baixe a chave de conta de serviço do Firebase Console.");
    process.exit(1);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error("❌ Erro ao inicializar Firebase Admin:", error);
  process.exit(1);
}

const db = admin.firestore();

// =============================================================================
// 2. COMBINAR TODOS OS PRODUTOS
// =============================================================================
const todosProdutos = [
  ...produtosTV,
  ...produtosBandaLarga,
  ...produtosMovel,
  ...produtosOpcionais
];

// =============================================================================
// 3. FUNÇÃO PARA LIMPAR COLEÇÃO
// =============================================================================
async function clearCollection(collectionName: string) {
  console.log(`🗑️  Limpando coleção ${collectionName}...`);
  const snapshot = await db.collection(collectionName).get();

  if (snapshot.empty) {
    console.log(`   ✓ Coleção ${collectionName} já está vazia.`);
    return;
  }

  const batchSize = 400;
  let deleted = 0;

  while (deleted < snapshot.docs.length) {
    const batch = db.batch();
    const chunk = snapshot.docs.slice(deleted, deleted + batchSize);

    chunk.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    deleted += chunk.length;
    console.log(`   → Deletados ${deleted}/${snapshot.docs.length} documentos`);
  }

  console.log(`   ✓ Coleção ${collectionName} limpa!`);
}

// =============================================================================
// 4. FUNÇÃO DE SEED (LIMPEZA E INSERÇÃO)
// =============================================================================
const seedDatabase = async () => {
  console.log("");
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║           STUDIO CLARO - SEED DATABASE (V11.0)               ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log("");

  try {
    // 1. LIMPAR COLEÇÕES EXISTENTES
    console.log("📂 Fase 1: Limpando coleções existentes...");
    console.log("─".repeat(60));
    await clearCollection("produtos");
    await clearCollection("regioes");
    console.log("");

    // 2. INSERIR REGIÕES
    console.log("📍 Fase 2: Inserindo regiões...");
    console.log("─".repeat(60));
    const regioesBatch = db.batch();
    for (const regiao of regioes) {
      const docRef = db.collection("regioes").doc(regiao.id);
      regioesBatch.set(docRef, regiao);
    }
    await regioesBatch.commit();
    console.log(`   ✓ ${regioes.length} regiões inseridas!`);
    console.log("");

    // 3. INSERIR PRODUTOS (em lotes de 400 para evitar limite)
    console.log("📦 Fase 3: Inserindo produtos...");
    console.log("─".repeat(60));
    console.log(`   → TV: ${produtosTV.length} produtos`);
    console.log(`   → Banda Larga: ${produtosBandaLarga.length} produtos`);
    console.log(`   → Móvel: ${produtosMovel.length} produtos`);
    console.log(`   → Opcionais: ${produtosOpcionais.length} produtos`);
    console.log(`   → Total: ${todosProdutos.length} produtos`);
    console.log("");

    const batchSize = 400;
    let inserted = 0;

    while (inserted < todosProdutos.length) {
      const batch = db.batch();
      const chunk = todosProdutos.slice(inserted, inserted + batchSize);

      for (const produto of chunk) {
        const slug = `${produto.regiaoId}-${produto.tipo}-${produto.nome}`
          .toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

        const docRef = db.collection("produtos").doc(slug);
        batch.set(docRef, {
          ...produto,
          atualizadoEm: new Date().toISOString()
        });
      }

      await batch.commit();
      inserted += chunk.length;
      console.log(`   → Inseridos ${inserted}/${todosProdutos.length} produtos`);
    }

    console.log("");
    console.log("╔══════════════════════════════════════════════════════════════╗");
    console.log("║                    ✅ SEED CONCLUÍDO!                        ║");
    console.log("╠══════════════════════════════════════════════════════════════╣");
    console.log(`║  📍 Regiões: ${regioes.length.toString().padEnd(47)}║`);
    console.log(`║  📦 Produtos: ${todosProdutos.length.toString().padEnd(46)}║`);
    console.log("╚══════════════════════════════════════════════════════════════╝");
    console.log("");

  } catch (error) {
    console.error("❌ Erro ao rodar seed:", error);
  } finally {
    process.exit(0);
  }
};

// Executar o seed
seedDatabase();
