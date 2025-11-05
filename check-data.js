// Script para verificar dados no Firestore
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs } = require('firebase/firestore');

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

async function checkData() {
  try {
    console.log('🔍 Verificando dados no Firestore...\n');
    
    // Verificar produtos
    const produtosSnapshot = await getDocs(collection(db, 'produtos'));
    console.log('📦 Total de produtos:', produtosSnapshot.size);
    
    // Verificar produtos do tipo "Ponto Adicional"
    const pontosQuery = query(collection(db, 'produtos'), where('tipo', '==', 'Ponto Adicional'));
    const pontosSnapshot = await getDocs(pontosQuery);
    console.log('📍 Produtos "Ponto Adicional":', pontosSnapshot.size);
    
    if (pontosSnapshot.size > 0) {
      console.log('\n✅ Pontos Adicionais encontrados:');
      pontosSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`  - ${data.nome} (${data.regiaoId}) - R$ ${data.precoMensal}`);
      });
    }
    
    // Verificar todos os tipos únicos
    const tipos = new Set();
    produtosSnapshot.forEach(doc => {
      tipos.add(doc.data().tipo);
    });
    console.log('\n📋 Tipos de produtos únicos:', Array.from(tipos).sort());
    
    // Verificar regiões
    const regioesSnapshot = await getDocs(collection(db, 'regioes'));
    console.log('\n🌍 Total de regiões:', regioesSnapshot.size);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

checkData();
