// Script para corrigir o tipo de "Fone" para "Fixo" 
// nos produtos de Fone/Fixo

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

async function fixTipoFoneParaFixo() {
  try {
    console.log('Procurando produtos com tipo "Fone"...');
    
    // Query para encontrar produtos que têm tipo "Fone"
    const q = query(
      collection(db, 'produtos'),
      where('tipo', '==', 'Fone')
    );
    
    const snapshot = await getDocs(q);
    
    let updatedCount = 0;
    const updates: Promise<void>[] = [];
    
    snapshot.forEach((docSnapshot) => {
      const product = docSnapshot.data();
      
      console.log(`Atualizando: ${product.nome}`);
      
      const updatePromise = updateDoc(doc(db, 'produtos', docSnapshot.id), {
        tipo: 'Fixo'
      });
      
      updates.push(updatePromise);
      updatedCount++;
    });
    
    if (updates.length > 0) {
      await Promise.all(updates);
      console.log(`✅ ${updatedCount} produtos foram atualizados para tipo "Fixo"`);
    } else {
      console.log('⚠️  Nenhum produto encontrado para atualizar');
    }
    
  } catch (error) {
    console.error('❌ Erro ao atualizar produtos:', error);
  }
  
  process.exit(0);
}

fixTipoFoneParaFixo();
