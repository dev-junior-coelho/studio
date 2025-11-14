# 🚀 Instruções de Seeding V11.0

## Status
- ✅ `src/seed.ts` atualizado para V11.0
- ✅ Campo `ordem` adicionado a todos os produtos de TV
- ✅ TV categorias mantidas separadas: TV Cabeada, TV Box, Claro TV APP
- ⏳ Pronto para execução dos scripts

## 📋 Passos para Atualizar o Banco de Dados

Execute estes comandos em sequência no seu terminal (terminal integrado do VS Code com Node.js disponível):

### 1. Limpar todos os produtos existentes
```bash
npx tsx clean-products.ts
```
**Esperado:** Deletará os 272 produtos atualmente no banco

### 2. Fazer seed com os dados atualizados (V11.0)
```bash
npm run db:seed
# ou
npx tsx src/seed.ts
```
**Esperado:** Criará 272 novos produtos com:
- Tipo de TV separado em 3 categorias (TV Cabeada, TV Box, Claro TV APP)
- Campo `ordem` para cada produto (para ordenação no UI)
- Preços atualizados conforme V11.0
- Todos os benefícios e observações corretos

### 3. Validar tipos de TV (se necessário)
```bash
npx tsx fix-tipo-tv.ts
```
**Esperado:** Retornará "Nenhum produto encontrado para atualizar" (pois seed.ts já tem tipos corretos)

## 📊 Resumo das Mudanças V11.0

### Produtos de TV por Categoria:
- **TV Cabeada**: 13 produtos (CTV+, INICIAL HD RET, TOP HD RET, SOUNDBOX RENT)
- **TV Box**: 9 produtos (CLARO STREAMING, CLARO TV BOX)
- **Claro TV APP**: 4 produtos (CLARO TV+ APP, CLARO TV+ STREAMINGS)

### Campo `ordem` Adicionado:
- 10-11: INICIAL HD
- 20: CTV+ TOP HD RET
- 30-35: CTV+ (Soundbox, Box, Rent)
- 40-44: Streaming (Soundbox, Box, Rent, TOP)
- 50-53: APP (Anual, Mensal, Streamings)

### Produtos Nacionais (Móvel, Fixo, Opcional, Ponto Adicional)
Sem alterações na estrutura, mantendo compatibilidade com versão anterior.

## ✅ Após Executar os Scripts

1. Confirme no Firestore que os 272 produtos foram criados
2. Faça commit das mudanças:
   ```bash
   git add src/seed.ts
   git commit -m "chore: atualizar seed.ts para V11.0 - produtos com ordem e TV categorizado"
   git push origin main
   ```
3. Vercel fará build e deployment automático
4. Verifique no UI se os 3 botões de TV aparecem corretamente

## 🔍 Troubleshooting

- **"comando não encontrado"**: Certifique-se de que está usando terminal integrado do VS Code com Node.js
- **Erro de autenticação Firebase**: Verifique se as credenciais estão corretas em `firebaseConfig`
- **Batch muito grande**: Script divide automaticamente em chunks de 499

## 📝 Próximas Ações

- [ ] Executar scripts de seeding
- [ ] Validar dados no Firestore
- [ ] Fazer commit e push
- [ ] Verificar deployment no Vercel
- [ ] Testar UI com produtos de TV categorizado
