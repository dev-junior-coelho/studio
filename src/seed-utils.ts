// seed-utils.ts
// Funções auxiliares para o seed.ts

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// =============================================================================
// CREDENCIAIS DO FIREBASE
// =============================================================================
export const firebaseConfig = {
  apiKey: "AIzaSyD_IW8CfZMseq-LsWkQoZnzEobByPywbss",
  authDomain: "studio-878079588-1d0ae.firebaseapp.com",
  projectId: "studio-878079588-1d0ae",
  storageBucket: "studio-878079588-1d0ae.appspot.com",
  messagingSenderId: "486175528141",
  appId: "1:486175528141:web:4e4d4d291cd8e099c28584"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// =============================================================================
// FUNÇÃO: Extrair Dependentes Grátis dos Benefícios
// =============================================================================
/**
 * Extrai o número de dependentes inclusos/grátis dos benefícios de um plano móvel.
 * Reconhece os formatos:
 * - "Dependentes: 3 dependentes inclusos" (V10.1)
 * - "3 dependentes grátis" (V11.0 - compatibilidade)
 * 
 * @param beneficios Array de strings com os benefícios do produto
 * @returns Número de dependentes grátis (0 se não encontrado)
 */
export function extrairDependentesGratis(beneficios: string[]): number {
  // Procura por "Dependentes: X dependentes inclusos" (formato V10.1)
  const matchInclusos = beneficios.join(' ').match(/Dependentes:\s*(\d+)\s+dependentes?\s+inclusos?/i);
  if (matchInclusos) return parseInt(matchInclusos[1]);
  
  // Procura por "X dependentes grátis" (formato antigo - compatibilidade)
  const matchGratis = beneficios.join(' ').match(/(\d+)\s+dependentes?\s+gr[aá]tis/i);
  if (matchGratis) return parseInt(matchGratis[1]);
  
  return 0;
}
