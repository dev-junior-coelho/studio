# INSTRUÇÕES PARA EXECUTAR O SEED

## Opção 1: Via Console Firebase (MAIS SIMPLES)

1. Acesse o Console Firebase: https://console.firebase.google.com/project/studio-878079588-1d0ae/firestore/rules

2. Substitua TEMPORARIAMENTE as regras por:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Clique em "Publicar"

4. Execute o seed:
```bash
npx tsx src/seed.ts
```

5. IMPORTANTE: Volte ao Console e restaure as regras originais do arquivo firestore.rules

---

## Opção 2: Via CLI Firebase (AUTOMÁTICA)

Se você tem o Firebase CLI configurado, execute:

```bash
# 1. Deploy das regras temporárias
firebase deploy --only firestore:rules --project studio-878079588-1d0ae

# EDITE firestore.rules temporariamente para permitir write:
# Mude as linhas:
#   allow create, update, delete: if false;
# Para:
#   allow create, update, delete: if true;

# 2. Deploy
firebase deploy --only firestore:rules --project studio-878079588-1d0ae

# 3. Execute o seed
npx tsx src/seed.ts

# 4. Restaure as regras originais e faça deploy novamente
firebase deploy --only firestore:rules --project studio-878079588-1d0ae
```

---

## Opção 3: Usar Admin SDK (SEGURO, mas requer service account)

Requer baixar a chave de service account do Firebase Console.
