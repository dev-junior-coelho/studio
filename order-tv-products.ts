// Script para reorganizar produtos de TV com ordenação
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

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

async function addOrderToTVProducts() {
  console.log('📺 Adicionando ordem aos produtos de TV...\n');
  
  const q = query(collection(db, 'produtos'), where('tipo', '==', 'TV'));
  const snapshot = await getDocs(q);
  
  let updated = 0;
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const nome = data.nome || '';
    let ordem = 999; // padrão
    
    // Ordem 1: INICIAL (produtos que começam com INICIAL)
    if (nome.startsWith('INICIAL')) {
      ordem = 1;
    }
    // Ordem 2: RET (produtos com RET na nomeclatura - Upgrade)
    else if (nome.includes('RET')) {
      ordem = 2;
    }
    // Ordem 3: CTV+ (produtos que começam com CTV+)
    else if (nome.startsWith('CTV+')) {
      ordem = 3;
    }
    // Ordem 4: BOX (produtos com BOX na nomeclatura)
    else if (nome.includes('BOX') || nome.includes('Box')) {
      ordem = 4;
    }
    // Ordem 5: CLARO TV+ APP/STREAMING
    else if (nome.includes('APP') || nome.includes('STREAMING') || nome.includes('Streaming')) {
      ordem = 5;
    }
    // Ordem 6: CLARO (outros)
    else if (nome.startsWith('CLARO')) {
      ordem = 6;
    }
    
    await updateDoc(doc.ref, { ordem });
    console.log(`✅ ${nome} - Ordem: ${ordem}`);
    updated++;
  }
  
  console.log(`\n✅ ${updated} produtos atualizados com ordenação!`);
}

addOrderToTVProducts()
  .then(() => {
    console.log('✅ Ordenação de produtos de TV concluída!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro:', error);
    process.exit(1);
  });
