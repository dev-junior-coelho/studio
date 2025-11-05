# 🔧 Instruções para Corrigir Categoria "Pontos Adicionais"

## ⚠️ Problema
Os produtos de "Pontos Adicionais" estão salvos com tipo "Opcional" no Firestore, mas a interface procura por tipo "Ponto Adicional", então não aparecem.

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

### Passo 3: Corrigir tipo dos Pontos Adicionais
```bash
npx tsx fix-tipo-pontos-adicionais.ts
```

### Passo 4: Commit e Deploy
```bash
git add .
git commit -m "fix: corrigir tipo de Pontos Adicionais para aparecer na categoria correta"
git push
```

## 📋 Resumo das Mudanças

### Arquivo: `src/seed.ts`
- Alterado todos os 10 produtos "Ponto Adicional" de tipo "Opcional" para tipo "Ponto Adicional"
- Linhas 534-543 atualizadas

### Arquivo: `fix-tipo-pontos-adicionais.ts` (novo)
- Script que corrige qualquer produto no Firestore com tipo "Opcional" e nome começando com "Ponto Adicional"
- Atualiza para tipo "Ponto Adicional"

## 🎯 Resultado Esperado
Após executar estes comandos, quando você entrar no Montador de Portfólio e:
1. Selecionar uma cidade
2. Clicar no botão "Ponto Adicional"
3. Verá aparecer estes 10 produtos:
   - Ponto Adicional - Soundbox Cabo (R$ 99,90)
   - Ponto Adicional - Soundbox Streaming (R$ 99,90)
   - Ponto Adicional - Box Cabo (R$ 69,90)
   - Ponto Adicional - Box Streaming (R$ 69,90)
   - Ponto Adicional - Soundbox (Upgrade R$ 69,90)
   - Ponto Adicional - Box Cabo (Upgrade R$ 39,90)
   - Ponto Adicional - Box Streaming (Upgrade R$ 39,90)
   - Ponto Adicional - HD (Upgrade TOP HD R$ 25,00)
   - Ponto Adicional - HD (Upgrade INICIAL R$ 10,00)
   - Ponto Adicional - HD (Upgrade INICIAL TELECINE R$ 25,00)

## ⏱️ Tempo de Execução
- Step 1: ~5 segundos
- Step 2: ~15 segundos
- Step 3: ~5 segundos
- Step 4: ~5 segundos
- **Total: ~30 segundos**

## 🚀 Deploy
O Vercel fará deploy automático após o git push!
