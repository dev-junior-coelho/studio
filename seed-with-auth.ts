// seed-with-auth.ts - Seed com autenticação admin
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, writeBatch, doc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB2WyTED3BCmJPtYE_cqmc1Cof_2DWf8xk",
  authDomain: "studio-claro.firebaseapp.com",
  projectId: "studio-claro",
  storageBucket: "studio-claro.firebasestorage.app",
  messagingSenderId: "541789671472",
  appId: "1:541789671472:web:4a3d7bfb1b429fb9151df5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const ADMIN_EMAIL = "admin@studio-claro.com";
const ADMIN_PASSWORD = "Admin123456!";

async function authenticateOrCreateAdmin() {
  try {
    console.log("🔐 Tentando autenticar como admin...");
    const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log("✅ Admin autenticado:", userCredential.user.email);
    return userCredential.user;
  } catch (error: any) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      console.log("👤 Criando usuário admin...");
      const userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      console.log("✅ Admin criado:", userCredential.user.email);
      return userCredential.user;
    }
    throw error;
  }
}

async function runSeed() {
  try {
    // Autentica primeiro
    await authenticateOrCreateAdmin();
    
    console.log("\n📦 Importando e executando seed original...\n");
    
    // Agora importa e executa o seed original
    await import('./src/seed');
    
  } catch (error) {
    console.error("❌ Erro:", error);
    process.exit(1);
  }
}

runSeed();
