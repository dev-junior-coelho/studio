// Script para LIMPAR e RECRIAR todos os produtos de TV
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch, doc, query, where } from 'firebase/firestore';

// ✅ Usar credenciais corretas do projeto studio-claro
const firebaseConfig = {
  projectId: "studio-claro",
  appId: "1:541789671472:web:4a3d7bfb1b429fb9151df5",
  apiKey: "AIzaSyB2WyTED3BCmJPtYE_cqmc1Cof_2DWf8xk",
  authDomain: "studio-claro.firebaseapp.com",
  storageBucket: "studio-claro.firebasestorage.app",
  messagingSenderId: "541789671472"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanAllProducts() {
  console.log('🧹 Limpando TODOS os produtos...');
  
  const productsSnapshot = await getDocs(collection(db, 'produtos'));
  console.log(`📦 Total de produtos a deletar: ${productsSnapshot.size}`);
  
  const BATCH_SIZE = 499;
  const batches = [];
  let currentBatch = writeBatch(db);
  let count = 0;
  
  productsSnapshot.docs.forEach((document) => {
    currentBatch.delete(document.ref);
    count++;
    
    if (count === BATCH_SIZE) {
      batches.push(currentBatch);
      currentBatch = writeBatch(db);
      count = 0;
    }
  });
  
  if (count > 0) {
    batches.push(currentBatch);
  }
  
  console.log(`🔥 Executando ${batches.length} batch(es) de deleção...`);
  for (let i = 0; i < batches.length; i++) {
    await batches[i].commit();
    console.log(`✅ Batch ${i + 1}/${batches.length} deletado`);
  }
  
  console.log('✅ Todos os produtos foram deletados!\n');
}

cleanAllProducts()
  .then(() => {
    console.log('✅ Limpeza concluída! Agora rode: npx tsx src/seed.ts');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro:', error);
    process.exit(1);
  });
