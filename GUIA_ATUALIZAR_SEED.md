# 🎯 Guia: Como Atualizar seed.ts com V10.1

## ✅ Arquitetura Nova (Refatorada):

```
src/
├── seed-utils.ts        ← Funções auxiliares (NÃO MEXER)
│   ├── firebaseConfig
│   ├── db (inicializado)
│   └── extrairDependentesGratis()
│
└── seed.ts              ← Apenas DADOS (COLAR V10.1 AQUI)
    ├── regioesParaCadastrar
    ├── produtosParaCadastrar
    └── seedDatabase()
```

---

## 📋 Passo a Passo para Atualizar:

### 1️⃣ Abrir o seed.ts

Arquivo: `/home/juniorcoelho/Área de trabalho/studio/src/seed.ts`

### 2️⃣ Localizar a seção de PRODUTOS

Procure por:
```typescript
// =============================================================================
// 2. DADOS DOS PRODUTOS (V11.0 - COM DEPENDENTE MÓVEL)
// =============================================================================
```

**LINHA APROXIMADA:** ~108

### 3️⃣ Selecionar TODO o array `produtosParaCadastrar`

**INÍCIO:** Linha que tem `const produtosParaCadastrar = [`

**FIM:** Linha que tem `];` antes de `// ========= 3. SCRIPT`

**EXEMPLO:**
```typescript
const produtosParaCadastrar = [
  // --- 1. PRODUTOS MÓVEIS (PÓS - MULTI) ---
  {
    regiaoId: "nacional", tipo: "Movel", nome: "Claro Pós 300GB (Multi)", precoMensal: 319.90,
    ...
  },
  // ... TODOS os produtos ...
];  ← PARAR AQUI
```

### 4️⃣ DELETAR o array completo

Apague desde `const produtosParaCadastrar = [` até o `];`

### 5️⃣ COLAR o array da V10.1

Do arquivo que você forneceu, copie a parte:

```typescript
const produtosParaCadastrar = [
  // --- 1. PRODUTOS MÓVEIS (PÓS - MULTI) (PDF 2, p.51) - ATUALIZADO ---
  {
    regiaoId: "nacional", tipo: "Movel", nome: "Claro Pós 300GB (Multi)", precoMensal: 319.90, precoAnual: null,
    beneficios: [
      "Franquia Total: 650 GB (300 GB Uso Livre + 300 GB Redes + 50 GB Bônus Multi Friday)", 
      "Passaporte: Passaporte Mundo (uso do plano em 80 países)", 
      "Dependentes: 3 dependentes inclusos",  ← IMPORTANTE: Manter "inclusos"
      ...
    ],
    observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital. Fidelidade 12 meses. Procedimento: PDS 300GB C/AP PAD / POS 300GB S/AP PAD"
  },
  // ... TODOS os outros produtos da V10.1 ...
  
  // --- IMPORTANTE: ADICIONAR ESTE PRODUTO ---
  {
    regiaoId: "nacional",
    tipo: "Dependente Móvel",
    nome: "Dependente Móvel",
    precoMensal: 50.00,
    precoAnual: null,
    beneficios: ["Linha adicional vinculada ao plano móvel principal", "Compartilha franquia do titular"],
    observacoes: "Preço de R$ 50,00/mês. Pode ter desconto automático conforme benefícios do plano móvel principal."
  },
];
```

### 6️⃣ ⚠️ CRÍTICO: Adicionar Produto "Dependente Móvel"

**SE a V10.1 não tiver o produto "Dependente Móvel", ADICIONE manualmente:**

Cole este produto ANTES do `];` final:

```typescript
  // --- DEPENDENTE MÓVEL (ADICIONAR MANUALMENTE) ---
  {
    regiaoId: "nacional",
    tipo: "Dependente Móvel",
    nome: "Dependente Móvel",
    precoMensal: 50.00,
    precoAnual: null,
    beneficios: ["Linha adicional vinculada ao plano móvel principal", "Compartilha franquia do titular"],
    observacoes: "Preço de R$ 50,00/mês. Pode ter desconto automático conforme benefícios do plano móvel principal."
  },
];
```

---

## ✅ Checklist Após Colar:

### Verificar Formato dos Benefícios Móveis:

Os planos móveis DEVEM ter o formato:
```typescript
"Dependentes: 3 dependentes inclusos"
```

**NÃO:**
- ❌ `"3 dependentes grátis"` (antigo)
- ❌ `"Dependentes: 3"` (incompleto)

A função `extrairDependentesGratis()` no `seed-utils.ts` já reconhece AMBOS, mas prefira usar "inclusos".

### Salvar e Verificar Erros TypeScript:

```bash
# No terminal do VS Code:
# Deve mostrar: "0 erros"
```

Se houver erros:
- Verifique vírgulas finais
- Confirme que não deletou o `];` final
- Confirme que não deletou nenhuma seção importante

---

## 🚀 Testar Após Atualização:

```bash
# 1. Limpar produtos antigos
npx tsx clean-products.ts

# 2. Executar seed
npm run db:seed

# 3. Verificar output esperado:
# ✅ 15 Regiões cadastradas
# ✅ TOTAL de XXX Produtos cadastrados
```

---

## 🎯 Vantagens da Nova Arquitetura:

✅ **Futuras Atualizações Simples:**
- Apenas copiar/colar novos produtos
- Não precisa mexer em funções
- Não precisa mexer em config Firebase

✅ **Separação de Responsabilidades:**
- `seed-utils.ts`: Lógica reutilizável
- `seed.ts`: Apenas dados (fácil de atualizar)

✅ **Menos Erros:**
- Não arrisca deletar funções críticas
- Config Firebase sempre protegida

---

## 📝 Estrutura do seed.ts Após Atualização:

```typescript
// CABEÇALHO (NÃO MEXER)
import { collection, writeBatch, doc } from 'firebase/firestore';
import { db, extrairDependentesGratis } from './seed-utils';

// =============================================================================
// 1. DADOS DAS REGIÕES (NÃO MEXER - a menos que novas regiões)
// =============================================================================
const regioesParaCadastrar = [ ... ];

// =============================================================================
// 2. DADOS DOS PRODUTOS (COLAR V10.1 AQUI) 👈 VOCÊ COLA AQUI
// =============================================================================
const produtosParaCadastrar = [
  // COLAR TODOS OS PRODUTOS DA V10.1
  // GARANTIR QUE TEM "Dependente Móvel"
];

// =============================================================================
// 3. SCRIPT DE UPLOAD (NÃO MEXER)
// =============================================================================
async function seedDatabase() { ... }
seedDatabase();
```

---

## 🆘 Problemas Comuns:

### Erro: "Cannot find module './seed-utils'"
**Solução:** Certifique-se que o arquivo `seed-utils.ts` existe em `src/`

### Erro: "extrairDependentesGratis is not a function"
**Solução:** Verifique o import: `import { db, extrairDependentesGratis } from './seed-utils';`

### Erro: Vírgula extra
**Solução:** Remova vírgulas após o último item do array

### Desconto não funciona
**Solução:** Verifique se os benefícios móveis têm o formato:
```typescript
"Dependentes: X dependentes inclusos"
```

---

## ✅ Pronto!

Agora você pode atualizar o `seed.ts` sempre que quiser, apenas colando o novo array de produtos!

**Arquivos para NÃO mexer:**
- ✅ `seed-utils.ts` (funções protegidas)

**Arquivos para atualizar:**
- 📝 `seed.ts` → Seção de produtos (colar V10.1)
