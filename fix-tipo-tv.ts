// Script para corrigir os tipos de TV no Firestore
// TV -> TV Cabeada, TV Box, ou Claro TV APP

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
