# 🔧 Instruções para Corrigir Categoria "Fixo"

## ⚠️ Problema
Os produtos de Fixo estão salvos com tipo "Fone" no seed.ts e Firestore, mas a interface procura por tipo "Fixo", então não aparecem.

## ✅ Solução
Execute os comandos abaixo em um terminal externo (fora do VS Code):

### Passo 1: Limpar produtos antigos
```bash
cd ~/Área\ de\ trabalho/studio
npx tsx clean-products.ts
```

### Passo 2: Popular com dados corrigidos
```bash
npx tsx src/seed.ts
```

### Passo 3: Corrigir tipo dos produtos Fixo
```bash
npx tsx fix-tipo-fone-para-fixo.ts
```

### Passo 4: Commit e Deploy
```bash
git add .
git commit -m "fix: corrigir tipo de Fone para Fixo - 4 produtos de Fone/Fixo adicionados"
git push
```

## 📋 Resumo das Mudanças

### Arquivo: `src/seed.ts`
- Alterado todos os 4 produtos "FIXO ILIMITADO" de tipo "Fone" para tipo "Fixo"
- Linhas 505-530 atualizadas

### Arquivo: `fix-tipo-fone-para-fixo.ts` (novo)
- Script que corrige qualquer produto no Firestore com tipo "Fone"
- Atualiza para tipo "Fixo"

## 🎯 Resultado Esperado
Após executar estes comandos, quando você entrar no Montador de Portfólio e:
1. Selecionar uma cidade
2. Clicar no botão "Fixo"
3. Verá aparecer estes 4 produtos:
   - FIXO ILIMITADO MUNDO FIBRA COM VAS (R$ 35,00)
   - FIXO ILIMITADO MUNDO FIBRA SEM VAS (R$ 65,00)
   - FIXO ILIMITADO BRASIL FIBRA MULTI (R$ 5,00)
   - FIXO ILIMITADO BRASIL FIBRA COM VAS (R$ 35,00)

## ⏱️ Tempo de Execução
- Step 1: ~5 segundos
- Step 2: ~15 segundos
- Step 3: ~5 segundos
- Step 4: ~5 segundos
- **Total: ~30 segundos**

## 🚀 Deploy
O Vercel fará deploy automático após o git push!
