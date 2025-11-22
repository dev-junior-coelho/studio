// Script para corrigir o tipo de "Opcional" para "Ponto Adicional" 
// nos produtos que começam com "Ponto Adicional"

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

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
