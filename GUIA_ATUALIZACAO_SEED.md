# 🔄 Guia de Atualização do Seed.ts para V10.1

## ✅ O que já está funcionando (NÃO PERDER):

1. **Função `extrairDependentesGratis`** (linhas ~24-30)
   - Extrai número de dependentes grátis dos benefícios
   - Procura padrões como "3 dependentes grátis"

2. **Produto "Dependente Móvel"** (linha ~256)
   - Tipo: "Dependente Móvel"
   - Preço: R$ 50,00/mês
   - Integrado ao sistema de desconto

3. **Lógica no batch.set()** (linhas ~680-700)
   ```typescript
   if (produto.tipo === 'Movel') {
       produtoData.dependentesGratis = extrairDependentesGratis(produto.beneficios);
   }
   ```

---

## 📋 Passos para Atualização Manual (MAIS SEGURO):

### Passo 1: Backup já criado ✅
```bash
# Já existe: src/seed.ts.backup
```

### Passo 2: Abrir os dois arquivos lado a lado

1. **Arquivo atual:** `src/seed.ts` (V11.0)
2. **Arquivo novo fornecido:** Seu seed V10.1

### Passo 3: Comparar e Atualizar Seções

#### 3.1 - Seção de Móveis (linhas ~162-256)
**O QUE MUDAR:**
- Atualizar benefícios dos planos móveis conforme V10.1
- MANTER a linha do produto "Dependente Móvel"

**EXEMPLO DE ATUALIZAÇÃO:**

**ANTES (V11.0):**
```typescript
{
  regiaoId: "nacional", tipo: "Movel", nome: "Claro Pós 300GB (Multi)", precoMensal: 319.90,
  beneficios: [
    "Franquia Total: 610 GB", 
    "Detalhe da Franquia: 300 GB (uso livre) + 300 GB (Redes Sociais)", 
    "Bônus: 10 GB (bônus promocional por 12 meses)",
    "Passaporte: Passaporte Mundo (uso do plano em 80 países)", 
    "Dependentes: 3 dependentes grátis",
    ...
  ],
  observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital. Fidelidade 12 meses."
}
```

**DEPOIS (V10.1):**
```typescript
{
  regiaoId: "nacional", tipo: "Movel", nome: "Claro Pós 300GB (Multi)", precoMensal: 319.90,
  beneficios: [
    "Franquia Total: 650 GB (300 GB Uso Livre + 300 GB Redes + 50 GB Bônus Multi Friday)", 
    "Passaporte: Passaporte Mundo (uso do plano em 80 países)", 
    "Dependentes: 3 dependentes inclusos",  // ⚠️ MUDOU DE "grátis" PARA "inclusos"
    "SVAs Inclusos: Skeelo Premium, Truecaller, Claro Banca Premium, StbFit, Starbeme Zen App", 
    "Benefício Multi: 4 meses de ChatGPT Plus", 
    "Ligações Ilimitadas: Fixo e Celular de qualquer operadora do Brasil (usando 21)"
  ],
  observacoes: "Desconto de R$ 10,00 no DCC+Fatura Digital. Fidelidade 12 meses. Procedimento: PDS 300GB C/AP PAD / POS 300GB S/AP PAD"
}
```

⚠️ **ATENÇÃO CRÍTICA:** Os benefícios mudaram de "dependentes grátis" para "dependentes inclusos"!

### Passo 4: Atualizar a função `extrairDependentesGratis`

**LOCALIZAÇÃO:** Linhas ~24-30

**SUBSTITUIR POR:**
```typescript
function extrairDependentesGratis(beneficios: string[]): number {
  // Procura por "X dependentes inclusos"
  const matchInclusos = beneficios.join(' ').match(/Dependentes:\s*(\d+)\s+dependentes?\s+inclusos?/i);
  if (matchInclusos) return parseInt(matchInclusos[1]);
  
  // Procura por "X dependentes grátis" (compatibilidade)
  const matchGratis = beneficios.join(' ').match(/(\d+)\s+dependentes?\s+gr[aá]tis/i);
  if (matchGratis) return parseInt(matchGratis[1]);
  
  return 0;
}
```

**POR QUÊ:** A V10.1 usa "dependentes inclusos" em vez de "dependentes grátis"!

---

## 🚀 Opção Alternativa: Substituição Automática

Se preferir que EU faça automaticamente:

1. Vou criar um `seed.ts` completamente novo baseado na V10.1
2. Vou garantir que tem:
   - ✅ Função `extrairDependentesGratis` (atualizada para "inclusos")
   - ✅ Produto "Dependente Móvel" (R$ 50,00)
   - ✅ Lógica `dependentesGratis` no batch.set()
3. Vou substituir o arquivo atual

**COMANDO PARA EXECUTAR:**
```bash
# Você me autoriza a fazer isso?
```

---

## 🎯 Checklist Final (Após Atualização):

- [ ] Função `extrairDependentesGratis` reconhece "inclusos" E "grátis"
- [ ] Produto "Dependente Móvel" existe no array
- [ ] Batch.set() adiciona `dependentesGratis` para tipo === 'Movel'
- [ ] Arquivo compila sem erros TypeScript
- [ ] Executar `npm run db:seed` com sucesso

---

## ⚡ Próximo Passo Recomendado:

**Me diga:**
1. "Fazer automaticamente" - Eu crio o arquivo completo novo
2. "Fazer manualmente" - Você segue este guia

**O que você prefere?**
