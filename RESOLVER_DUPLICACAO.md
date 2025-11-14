# 🔧 Resolver Duplicação de Produtos

## Problema Identificado

Você está vendo **cada plano 3 vezes** (valores antigos + novos) porque:
- O Firestore ainda tem os produtos **V11.0** (antigos)
- O seed.ts agora tem produtos **V10.1** (novos)
- Quando você roda o seed, ele **adiciona** os novos sem remover os antigos

## ✅ Solução (2 comandos)

### 1. Limpar TODOS os produtos antigos do Firestore

```bash
npx tsx clean-products.ts
```

**Saída esperada:**
```
🧹 Limpando TODOS os produtos...
📦 Total de produtos a deletar: XXX
🔥 Executando X batch(es) de deleção...
✅ Batch 1/X deletado
✅ Todos os produtos foram deletados!
```

### 2. Recriar os produtos com dados V10.1

```bash
npm run db:seed
```

**Saída esperada:**
```
✅ 15 Regiões cadastradas
✅ TOTAL de XXX Produtos cadastrados
```

## 🎯 Verificação Final

Após rodar os 2 comandos:

1. Abra a aplicação: `npm run dev`
2. Vá para a página de produtos
3. Verifique que **cada plano aparece apenas 1 vez**
4. Verifique os valores corretos:
   - **Claro Pós 50GB**: R$ 99,90 (não R$ 119,90)
   - **Claro Pós 300GB**: 650 GB total (não 610 GB)
   - **Claro Controle 25GB**: 60 GB total (não 35 GB)

## 📊 Por que isso aconteceu?

O script `seed.ts` **adiciona** produtos ao Firestore, mas **não remove** os existentes.

Por isso, quando você tem:
- 9 produtos V11.0 no Firestore (antigos)
- 9 produtos V10.1 no seed.ts (novos)
- Total = **18 produtos** (duplicados)

E se você rodar o seed 3 vezes sem limpar:
- 9 produtos originais
- 9 produtos do 1º seed
- 9 produtos do 2º seed
- Total = **27 produtos** (triplicados) 😱

## 🔄 Workflow Correto

**Sempre que atualizar o seed.ts:**

```bash
# 1. Limpar dados antigos
npx tsx clean-products.ts

# 2. Inserir dados novos
npm run db:seed
```

---

**Execute os comandos agora e o problema será resolvido!** 🚀
