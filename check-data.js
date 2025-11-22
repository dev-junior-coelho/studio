// Script para verificar dados no Firestore
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs } = require('firebase/firestore');

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
