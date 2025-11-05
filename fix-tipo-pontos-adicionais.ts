// Script para corrigir o tipo de "Opcional" para "Ponto Adicional" 
// nos produtos que começam com "Ponto Adicional"

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

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

async function fixTipoPontosAdicionais() {
  try {
    console.log('Procurando produtos com tipo "Opcional" e nome começando com "Ponto Adicional"...');
    
    // Query para encontrar produtos que têm tipo "Opcional" mas nome começando com "Ponto Adicional"
    const q = query(
      collection(db, 'produtos'),
      where('tipo', '==', 'Opcional')
    );
    
    const snapshot = await getDocs(q);
    
    let updatedCount = 0;
    const updates: Promise<void>[] = [];
    
    snapshot.forEach((docSnapshot) => {
      const product = docSnapshot.data();
      
      // Se o nome começa com "Ponto Adicional", atualizar o tipo
      if (product.nome && product.nome.startsWith('Ponto Adicional')) {
        console.log(`Atualizando: ${product.nome}`);
        
        const updatePromise = updateDoc(doc(db, 'produtos', docSnapshot.id), {
          tipo: 'Ponto Adicional'
        });
        
        updates.push(updatePromise);
        updatedCount++;
      }
    });
    
    if (updates.length > 0) {
      await Promise.all(updates);
      console.log(`✅ ${updatedCount} produtos foram atualizados para tipo "Ponto Adicional"`);
    } else {
      console.log('⚠️  Nenhum produto encontrado para atualizar');
    }
    
  } catch (error) {
    console.error('❌ Erro ao atualizar produtos:', error);
  }
  
  process.exit(0);
}

fixTipoPontosAdicionais();
