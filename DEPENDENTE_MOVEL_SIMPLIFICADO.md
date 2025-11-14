# ✅ Dependente Móvel - Versão Final Simplificada

## 🎯 O Que Mudou

### 1️⃣ **Seed.ts** - Agora apenas 1 produto genérico

**Antes:**
```typescript
// 3 produtos com diferentes franquias
- Dependente Móvel 50GB (50GB, ChatGPT Plus, etc)
- Dependente Móvel 30GB (30GB, ChatGPT Plus, etc)
- Dependente Móvel 15GB (15GB, apps, etc)
```

**Agora:**
```typescript
// 1 produto genérico
{ 
  regiaoId: "nacional", 
  tipo: "Dependente Móvel", 
  nome: "Dependente Móvel", 
  precoMensal: 50.00, 
  precoAnual: null, 
  beneficios: [],  // ← SEM benefícios
  observacoes: "Adicional ao plano móvel principal. Herda a franquia do plano do titular." 
}
```

---

### 2️⃣ **Builder Page** - Input para quantidade

**UI do Produto "Dependente Móvel":**
```
┌─────────────────────────────┐
│  Dependente Móvel           │
│                             │
│  Preço mensal: R$ 50,00     │
│                             │
│  Quantidade de Dependentes: │
│  [−] [1] [+]                │
│  Total: R$ 50,00 (1x R$50)  │
│                             │
│ [Adicionar 1 à Oferta]      │
└─────────────────────────────┘
```

**Funcionalidades:**
- ✅ Input com botões - / + (min 1, máx 5)
- ✅ Mostra total: "Total: R$ 150,00 (3x R$50)"
- ✅ Botão muda dinamicamente: "Adicionar 3 à Oferta"
- ✅ Cada clique adiciona todos os dependentes selecionados

---

## 📊 Resultado na Oferta

Quando o usuário adiciona 3 dependentes:

```
Minha Oferta
├── Claro Pós 300GB - R$ 119,90
├── Dependente Móvel - R$ 50,00 (ID: xxxx)
├── Dependente Móvel - R$ 50,00 (ID: yyyy)
├── Dependente Móvel - R$ 50,00 (ID: zzzz)
└── Total: R$ 269,90
```

Cada dependente tem um ID único (gerado automaticamente).

---

## 🗄️ Banco de Dados

**Firestore - Coleção `produtos`:**
```
ID: doc_xyz
tipo: "Dependente Móvel"
nome: "Dependente Móvel"
precoMensal: 50.00
precoAnual: null
beneficios: []
observacoes: "Adicional ao plano móvel principal..."
regiaoId: "nacional"
```

**Total de Produtos no Banco: 273**
- 272 produtos antigos
- 1 Dependente Móvel

---

## 🔧 Commits

| Hash | Mensagem |
|------|----------|
| `474a25f` | feat(products): adicionar categoria Dependente Móvel com 3 planos a R$ 50,00 |
| `4d82be6` | feat(dependente-movel): simplificar para 1 produto genérico com input de quantidade |

---

## 📝 Próximas Ações

1. **Limpar Firestore:**
   ```bash
   npx tsx clean-products.ts
   ```

2. **Fazer Seed com novo produto:**
   ```bash
   npm run db:seed
   ```

3. **Resultado esperado:**
   ```
   ✅ TOTAL de 273 Produtos cadastrados com sucesso!
   ```

4. **No Builder:**
   - Clique em "Dependente Móvel"
   - Configure quantidade (1-5)
   - Clique "Adicionar X à Oferta"
   - Cada um custará R$ 50,00/mês

---

## 🎯 Vantagens da Simplificação

✅ Uma única opção (sem confusão)
✅ Herda franquia do plano principal (mais simples)
✅ Sem benefícios duplicados na UI
✅ Usuário controla quantidade facilmente
✅ Melhor UX no builder
✅ Menos documentos no Firestore

**Pronto para rodar o seed!** 🚀
