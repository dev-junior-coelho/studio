# 🔧 Instruções para Separar Categorias de TV

## ✨ O que foi mudado

A categoria "TV" foi dividida em **3 subcategorias**:
1. **TV Cabeada** - 13 produtos (CTV+, produtos com aluguel de equipamento)
2. **TV Box** - 9 produtos (CLARO STREAMING, CLARO TV BOX)
3. **Claro TV APP** - 4 produtos (CLARO TV+ APP, CLARO TV+ STREAMINGS)

## 📝 Arquivos Modificados

### 1. `src/lib/types.ts`
- Atualizou `ProductType` para incluir: "TV Cabeada" | "TV Box" | "Claro TV APP"
- Removeu tipo simples "TV"

### 2. `src/app/(app)/builder/page.tsx`
- Atualizou `productTypes` array
- Atualizou `typeDisplayNames` mapeamento

### 3. `src/seed.ts`
- 13 produtos de TV foram alterados para "TV Cabeada"
- 9 produtos foram alterados para "TV Box"
- 4 produtos foram alterados para "Claro TV APP"

### 4. `src/contexts/offer-context.tsx`
- Atualizou lógica de validação para reconhecer qualquer tipo de TV
- Continua permitindo apenas 1 tipo de TV por oferta (mas pode ser de qualquer categoria)

### 5. `fix-tipo-tv.ts` (novo)
- Script que corrige tipos no Firestore

## 🚀 Próximos Passos (em Terminal Externo)

```bash
cd ~/Área\ de\ trabalho/studio

# Passo 1: Limpar produtos antigos
npx tsx clean-products.ts

# Passo 2: Popular com dados corrigidos
npx tsx src/seed.ts

# Passo 3: Corrigir tipo de TV no Firestore
npx tsx fix-tipo-tv.ts

# Passo 4: Commit e Deploy
git add .
git commit -m "feat: separar categoria TV em TV Cabeada, TV Box e Claro TV APP"
git push
```

## 📊 Resultado Esperado

Após executar os comandos, no Montador de Portfólio quando selecionar uma cidade, verá 3 botões separados:

### **TV Cabeada** (13 produtos)
- INICIAL HD RET ANUNCIO FID
- INICIAL HD RET ANUNCIO TELECINE FID
- CTV+ TOP HD RET ANUNCIO FID
- CTV+ TOP HD 4K SOUND MULTI
- CTV+ TOP HD 4K SOUND
- CTV+ TOP HD 4K MULTI
- CTV+ TOP HD 4K
- CTV+TOP HD 4K RENT ANUNCIO FID
- CLARO TV+ SOUNDBOX RENT ANUNCIO FID
- (mais 4 variações regionais)

### **TV Box** (9 produtos)
- CLARO STREAMING HD TOP SOUND MULTI
- CLARO STREAMING HD TOP MULTI
- CLARO STREAMING HD TOP
- CLARO STREAMING HD TOP RENT ANUNCIO FID
- CLARO TV BOX ANUNCIO (Não Cabeada) MULTI
- CLARO TV BOX ANUNCIO (Não Cabeada) SINGLE
- (mais 3 variações regionais)

### **Claro TV APP** (4 produtos)
- CLARO TV+ APP ANUAL
- CLARO TV+ APP MENSAL
- CLARO TV+ STREAMINGS ANUAL
- CLARO TV+ STREAMINGS MENSAL

## ⏱️ Tempo de Execução
- Step 1: ~5 segundos
- Step 2: ~15 segundos
- Step 3: ~5 segundos
- Step 4: ~5 segundos
- **Total: ~30 segundos**

## 🚀 Deploy
O Vercel fará deploy automático após o git push!
