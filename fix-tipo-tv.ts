// Script para corrigir os tipos de TV no Firestore
// TV -> TV Cabeada, TV Box, ou Claro TV APP

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

async function fixTipoTV() {
  try {
    console.log('Procurando produtos com tipo "TV"...');
    
    // Query para encontrar produtos que têm tipo "TV"
    const q = query(
      collection(db, 'produtos'),
      where('tipo', '==', 'TV')
    );
    
    const snapshot = await getDocs(q);
    
    let updatedCabeada = 0;
    let updatedBox = 0;
    let updatedApp = 0;
    const updates: Promise<void>[] = [];
    
    snapshot.forEach((docSnapshot) => {
      const product = docSnapshot.data();
      let newTipo: string | null = null;
      
      // Categorizar por nome
      if (
        product.nome.includes('INICIAL HD RET') ||
        product.nome.includes('CTV+') ||
        product.nome.includes('SOUNDBOX RENT')
      ) {
        newTipo = 'TV Cabeada';
        updatedCabeada++;
      } else if (
        product.nome.includes('CLARO STREAMING') ||
        product.nome.includes('CLARO TV BOX')
      ) {
        newTipo = 'TV Box';
        updatedBox++;
      } else if (
        product.nome.includes('CLARO TV+ APP') ||
        product.nome.includes('CLARO TV+ STREAMINGS')
      ) {
        newTipo = 'Claro TV APP';
        updatedApp++;
      }
      
      if (newTipo) {
        console.log(`Atualizando ${product.nome} para ${newTipo}`);
        
        const updatePromise = updateDoc(doc(db, 'produtos', docSnapshot.id), {
          tipo: newTipo
        });
        
        updates.push(updatePromise);
      }
    });
    
    if (updates.length > 0) {
      await Promise.all(updates);
      console.log(`✅ Produtos atualizados:`);
      console.log(`   - ${updatedCabeada} para TV Cabeada`);
      console.log(`   - ${updatedBox} para TV Box`);
      console.log(`   - ${updatedApp} para Claro TV APP`);
    } else {
      console.log('⚠️  Nenhum produto encontrado para atualizar');
    }
    
  } catch (error) {
    console.error('❌ Erro ao atualizar produtos:', error);
  }
  
  process.exit(0);
}

fixTipoTV();
