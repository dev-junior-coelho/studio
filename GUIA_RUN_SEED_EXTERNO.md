# 🔧 Como Executar o Seed em Terminal Externo

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm 9+
- Ter feito `git clone` ou `git pull` para pegar as mudanças (commit 474a25f)

---

## 🖥️ No Linux/Mac (Terminal)

```bash
cd "/home/juniorcoelho/Área de trabalho/studio"

# Opção 1: Usar o script (recomendado)
bash run-seed.sh

# Opção 2: Manual
npx tsx clean-products.ts
npm run db:seed
```

---

## 🪟 No Windows (PowerShell)

```powershell
cd "C:\Users\YourUser\Área de trabalho\studio"

# Opção 1: Usar o script (recomendado)
PowerShell -ExecutionPolicy Bypass -File run-seed.ps1

# Opção 2: Manual
npx tsx clean-products.ts
npm run db:seed
```

---

## ⚙️ O Que Acontece

### 1️⃣ `npx tsx clean-products.ts`
- Conecta ao Firestore
- Deleta a coleção `produtos` inteira
- Remove ~272 produtos antigos

**Esperado:**
```
✅ Produtos antigos removidos com sucesso!
✅ Total deletado: 272 documentos
```

---

### 2️⃣ `npm run db:seed`
- Conecta ao Firestore
- Cria 15 regiões
- Insere 275 produtos (incluindo 3 Dependente Móvel)

**Esperado:**
```
✅ 15 Regiões cadastradas com sucesso!
✅ TOTAL de 275 Produtos cadastrados com sucesso!
🚀 Semeadura do banco de dados concluída!
```

---

## 📊 Verificação Após o Seed

### 1. Firebase Console
```
https://console.firebase.google.com/project/studio-878079588-1d0ae/firestore
```

**O que verificar:**
- ✅ Coleção `produtos` tem 275 documentos
- ✅ Buscar por "Dependente Móvel" aparece 3 produtos
- ✅ Preços: R$ 50,00 cada

### 2. Na Aplicação (UI)
```
http://localhost:3000/app/builder
```

**O que você vai ver:**
- ✅ Botão "Dependente Móvel" aparece entre "Móvel" e "Banda Larga"
- ✅ Ao clicar, mostra 3 opções (15GB, 30GB, 50GB)
- ✅ Pode adicionar múltiplos dependentes

---

## 🚨 Se Algum Erro Ocorrer

### Erro: "comando npx não encontrado"
- Node.js não está instalado
- Solução: Instale em https://nodejs.org/

### Erro: "PERMISSION_DENIED" no Firestore
- Variáveis de ambiente não configuradas
- Solução: Verifique arquivo `.env.local` com credenciais Firebase

### Erro: "clean-products.ts not found"
- Você não está na pasta correta
- Solução: Garanta que está em `/home/juniorcoelho/Área de trabalho/studio`

---

## 📝 Passos Após o Seed

1. ✅ Verificar Firestore (275 produtos)
2. ✅ Recarregar a aplicação no navegador
3. ✅ Testar botão "Dependente Móvel" no builder
4. ✅ Adicionar um dependente e verificar preço

---

## 🎯 Resultado Final

Depois disso você terá:

```
Categorias disponíveis no Builder:
├── Móvel (6 planos)
├── Dependente Móvel (3 planos) ← NOVO!
├── Banda Larga (~120)
├── TV Cabeada (13)
├── TV Box (9)
├── Claro TV APP (4)
├── Fixo (4)
├── Ponto Adicional (11)
└── Opcional (~110)

TOTAL: 275 produtos
```

---

**Pronto? Execute agora e me avise quando terminar! 🚀**
