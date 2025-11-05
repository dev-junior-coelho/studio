// Script para verificar produtos de TV no Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

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

async function checkTVProducts() {
  console.log('🔍 Verificando produtos de TV no Firestore...\n');
  
  const q = query(collection(db, 'produtos'), where('tipo', '==', 'TV'));
  const snapshot = await getDocs(q);
  
  console.log(`📺 Total de produtos de TV: ${snapshot.size}\n`);
  
  if (snapshot.size > 0) {
    console.log('Primeiros 10 produtos de TV:');
    snapshot.docs.slice(0, 10).forEach((doc, index) => {
      const data = doc.data();
      console.log(`${index + 1}. ${data.nome} - R$ ${data.precoMensal} - Região: ${data.regiaoId}`);
    });
  } else {
    console.log('❌ Nenhum produto de TV encontrado!');
  }
}

checkTVProducts().catch(console.error);
