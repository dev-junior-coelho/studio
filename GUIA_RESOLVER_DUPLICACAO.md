# ✅ Guia Completo: Resolver Duplicação de Produtos

## 🔴 Problema
Você está vendo cada plano **3 vezes** (valores antigos + novos duplicados) no Firestore.

## ✅ Solução Definitiva (2 Passos)

### Passo 1: Limpar Dados Antigos do Firestore

Abra um terminal na pasta do projeto e execute:

```bash
npx tsx clean-products.ts
```

**O que vai acontecer:**
- ✅ Deletará TODOS os produtos antigos do Firestore
- ✅ Mostrará mensagens de progresso
- ✅ Levará alguns segundos (ou minutos se tiver muitos produtos)

**Saída esperada:**
```
🧹 Limpando TODOS os produtos...
📦 Total de produtos a deletar: 273
🔥 Executando 1 batch(es) de deleção...
✅ Batch 1/1 deletado
✅ Todos os produtos foram deletados!
```

### Passo 2: Recriar Produtos com Dados V10.1

Após a limpeza, execute:

```bash
npm run db:seed
```

**Saída esperada:**
```
✅ 15 Regiões cadastradas
✅ TOTAL de 273 Produtos cadastrados
```

---

## 🎯 Verificação Final

### 1. Verifique no Console do Firebase

- Acesse: [Firebase Console](https://console.firebase.google.com/)
- Projeto: `studio-878079588-1d0ae`
- Coleção: `produtos`
- **Esperado**: 273 produtos (não 819)

### 2. Teste na Aplicação

```bash
npm run dev
```

Então verifique:
- ✅ Cada plano móvel aparece **apenas 1 vez**
- ✅ Claro Pós 50GB: **R$ 99,90** (não R$ 119,90)
- ✅ Claro Pós 300GB: **650 GB** (não 610 GB)
- ✅ Claro Controle 25GB: **60 GB** (não 35 GB)

### 3. Teste de Desconto

- Selecione: **Claro Pós 300GB (Multi)**
- Adicione: **5x Dependente Móvel**
- Verifique: 
  - 3 ✅ GRÁTIS
  - 2 ⚠️ PAGO (R$ 50 cada)
  - **Total**: R$ 419,90

---

## 📊 Por que isso Aconteceu?

```
Cenário A (Sem limpeza):
❌ 9 produtos V11.0 no Firestore (antigos)
❌ + 9 produtos V10.1 do seed (novos)
❌ = 18 produtos (duplicados)

Se rodar 3 vezes sem limpar:
❌ 9 + 9 + 9 + 9 = 36 produtos (triplicados)

Cenário B (Com limpeza - CORRETO):
✅ Deletar todos (0 produtos)
✅ + 9 produtos V10.1 do seed
✅ = 9 produtos (correto!)
```

---

## 🔧 Workflow Padrão (IMPORTANTE)

**Sempre que atualizar o seed.ts:**

```bash
# 1️⃣ Limpar dados antigos
npx tsx clean-products.ts

# 2️⃣ Inserir dados novos
npm run db:seed

# 3️⃣ Iniciar aplicação
npm run dev
```

---

## ❓ Dúvidas

**P: Quanto tempo leva?**
R: Normalmente 30 segundos a 2 minutos (depende da quantidade de dados)

**P: Vou perder dados de clientes?**
R: NÃO, este script **só deleta a coleção `produtos`**, não toca em dados de clientes

**P: E se der erro?**
R: Tente novamente. Se persistir, verifique se:
- [ ] Você está no terminal correto (com Node.js instalado)
- [ ] Está na pasta `/home/juniorcoelho/Área de trabalho/studio`
- [ ] Tem arquivo `clean-products.ts` nessa pasta

---

## ✨ Resumo das Mudanças V10.1

| Produto | Antiga | V10.1 | Mudança |
|---------|--------|-------|---------|
| Pós 300GB | 610 GB | **650 GB** | +40 GB |
| Pós 150GB | 310 GB | **350 GB** | +40 GB |
| Pós 100GB | 210 GB | **250 GB** | +40 GB |
| Pós 60GB Gaming | 130 GB | **170 GB** | +40 GB |
| **Pós 50GB** | R$ 119,90 | **R$ 99,90** | 💰 -R$ 20 |
| Pós 25GB | 60 GB | **75 GB** | +15 GB |
| Controle 25GB Gamer | 35 GB | **60 GB** | +25 GB |
| Controle 25GB | 35 GB | **60 GB** | +25 GB |
| Controle 20GB | 30 GB | **50 GB** | +20 GB |

---

**Execute os 2 comandos agora e o problema será 100% resolvido! 🚀**
