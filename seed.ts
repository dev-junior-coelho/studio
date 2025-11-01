// CUIDADO: Este script apaga e reescreve as coleções 'produtos' e 'procedimentos'.
// Use com cautela e faça backup se necessário.
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';
import { firebaseConfig } from './src/firebase/config';
import { mockProdutos } from './src/lib/mock-data';
import { mockProcedimentos } from './src/lib/mock-data';

// Inicializa o app Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

async function seedDatabase() {
  console.log('Iniciando o processo de seeding...');

  try {
    // Seed para Produtos
    console.log('Populando a coleção "produtos"...');
    const produtosBatch = writeBatch(db);
    const produtosCollection = collection(db, 'produtos');
    mockProdutos.forEach((produto) => {
      const docRef = doc(produtosCollection, produto.id);
      produtosBatch.set(docRef, produto);
    });
    await produtosBatch.commit();
    console.log(`✅ Coleção "produtos" populada com ${mockProdutos.length} documentos.`);

    // Seed para Procedimentos
    console.log('Populando a coleção "procedimentos"...');
    const procedimentosBatch = writeBatch(db);
    const procedimentosCollection = collection(db, 'procedimentos');
    mockProcedimentos.forEach((procedimento) => {
      const docRef = doc(procedimentosCollection, procedimento.id);
      procedimentosBatch.set(docRef, procedimento);
    });
    await procedimentosBatch.commit();
    console.log(`✅ Coleção "procedimentos" populada com ${mockProcedimentos.length} documentos.`);

    console.log('\n🎉 Seeding concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o processo de seeding:', error);
  }
}

seedDatabase().then(() => {
  // O ideal seria fechar a conexão com o Firebase,
  // mas o SDK v9 do cliente não tem um método explícito para isso.
  // O processo irá terminar automaticamente.
  console.log('Script finalizado.');
  process.exit(0);
}).catch(() => {
  process.exit(1);
});
