// Script para LIMPAR e RECRIAR todos os produtos de TV
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch, doc, query, where } from 'firebase/firestore';

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
