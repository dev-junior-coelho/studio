
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    projectId: "studio-claro",
    appId: "1:541789671472:web:4a3d7bfb1b429fb9151df5",
    apiKey: "AIzaSyB2WyTED3BCmJPtYE_cqmc1Cof_2DWf8xk",
    authDomain: "studio-claro.firebaseapp.com",
    storageBucket: "studio-claro.firebasestorage.app",
    messagingSenderId: "541789671472"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const args = process.argv.slice(2);

if (args.length < 2) {
    console.error("Uso: node scripts/create_master.mjs <Z-Login> <PIN>");
    process.exit(1);
}

const zLogin = args[0];
const pin = args[1];
const AUTH_DOMAIN = "@interno.studioclaro.app";

const email = `z${zLogin}${AUTH_DOMAIN}`;
const password = `SCApp-${pin}`; // Mesma lógica do app

console.log(`Criando Supervisor Master...`);
console.log(`Login: Z${zLogin}`);
console.log(`Email: ${email}`);

async function createMaster() {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("Usuário de autenticação criado com sucesso (UID: " + user.uid + ")");

        await setDoc(doc(db, "usuarios", user.uid), {
            uid: user.uid,
            email: email,
            role: 'supervisor',
            isMaster: true,
            createdAt: new Date().toISOString()
        });

        console.log("✅ Supervisor Master configurado com sucesso no Firestore!");
        process.exit(0);
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            console.log("⚠️ Usuário já existe. Tentando login para promover a Supervisor...");

            try {
                // Tenta logar com a senha fornecida
                const { signInWithEmailAndPassword } = await import("firebase/auth");
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                console.log("Login realizado com sucesso! Atualizando perfil no Firestore...");

                await setDoc(doc(db, "usuarios", user.uid), {
                    uid: user.uid,
                    email: email,
                    role: 'supervisor',
                    isMaster: true,
                    updatedAt: new Date().toISOString()
                }, { merge: true });

                console.log("✅ Usuário (z" + zLogin + ") promovido a Supervisor Master com sucesso!");
                process.exit(0);
            } catch (loginError) {
                console.error("❌ Erro ao logar para promover: Senha incorreta ou erro de rede.", loginError.message);
                process.exit(1);
            }
        } else {
            console.error("❌ Erro ao criar supervisor:", error.code, error.message);
            process.exit(1);
        }
    }
}

createMaster();
