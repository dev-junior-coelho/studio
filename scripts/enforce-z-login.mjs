import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.join(__dirname, '..', 'service-account.json');

async function enforceZLogin() {
    try {
        console.log('--- Carregando Credenciais ---');
        console.log('Arquivo:', serviceAccountPath);

        initializeApp({
            credential: cert(serviceAccountPath),
            projectId: 'studio-claro'
        });

        const auth = getAuth();
        const db = getFirestore();

        console.log('--- Iniciando Auditoria de Sessões ---');

        const usersSnapshot = await db.collection('usuarios').get();
        let totalProcessed = 0;
        let totalLoggedOut = 0;

        for (const doc of usersSnapshot.docs) {
            const userData = doc.data();
            const uid = doc.id;

            // Regra: Somente Agentes precisam obrigatoriamente do Z-Login (z000000)
            // Se for agente e não tiver o campo zLogin preenchido...
            if (userData.role === 'agente' && (!userData.zLogin || userData.zLogin.trim() === '')) {
                console.log(`[LOGOUT] Revogando sessão do agente: ${userData.nome || 'Sem Nome'} (UID: ${uid})`);

                try {
                    // Revoga todos os refresh tokens do usuário (força logout em todos os dispositivos)
                    await auth.revokeRefreshTokens(uid);

                    // Opcional: Desabilitar o usuário se quiser impedir novo login anônimo
                    // await auth.updateUser(uid, { disabled: true });

                    totalLoggedOut++;
                } catch (authErr) {
                    console.error(`Erro ao revogar sessão do UID ${uid}:`, authErr);
                }
            }
            totalProcessed++;
        }

        console.log('--- Auditoria Concluída ---');
        console.log(`Total de perfis analisados: ${totalProcessed}`);
        console.log(`Agentes deslogados (sem Z-Login): ${totalLoggedOut}`);

    } catch (error) {
        console.error('Erro ao executar o script:', error);
    }
}

enforceZLogin();
