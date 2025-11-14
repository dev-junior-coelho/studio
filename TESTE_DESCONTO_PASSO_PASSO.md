# 🧪 Instruções para Testar o Desconto de Dependentes

## 📋 Pré-requisitos

- ✅ Código já foi commitado e enviado para GitHub
- ✅ Vercel vai fazer rebuild automático
- ✅ Você precisa fazer seed do novo `dependentesGratis` no Firestore

---

## 🚀 Passo 1: Limpar e Fazer Seed

Execute em um terminal externo:

```bash
cd "/home/juniorcoelho/Área de trabalho/studio"
bash do-everything.sh
```

**Esperado:**
```
✅ 15 Regiões cadastradas com sucesso!
✅ TOTAL de 273 Produtos cadastrados com sucesso!
🚀 Semeadura do banco de dados concluída!
```

---

## 🖥️ Passo 2: Verificar no Firestore

1. Acesse: https://console.firebase.google.com/
2. Projeto: `studio-878079588-1d0ae`
3. Firestore Database → Coleção `produtos`
4. Procure por "Claro Pós 300GB (Multi)"
5. Verifique se tem campo `dependentesGratis: 3`

✅ Exemplo:

```
ID: doc_abc123
nome: "Claro Pós 300GB (Multi)"
tipo: "Movel"
precoMensal: 319.90
dependentesGratis: 3  ← NOVO
beneficios: [...]
```

---

## 🎯 Passo 3: Testar a UI

1. **Abra o app:**
   ```
   http://localhost:3000/app/builder
   ```

2. **Selecione uma cidade** (ex: São Paulo)

3. **Clique em "Móvel"** para filtrar apenas produtos móvel

4. **Adicione "Claro Pós 300GB (Multi)"**
   - Clique no botão "Adicionar à Oferta"

5. **Clique em "Dependente Móvel"** para filtrar categoria

6. **Configure 5 dependentes:**
   - Veja o input com botões − e +
   - Configure para 5 dependentes
   - Clique "Adicionar 5 à Oferta"

---

## ✅ Passo 4: Verificar o Desconto

Você deve ver uma caixa azul com informações:

```
✅ Desconto de Dependentes
   Claro Pós 300GB (Multi)

   3 dependente(s) GRÁTIS + 2 pago(s)
   Economia: -R$ 150,00

   ✅ Dependente 1: GRÁTIS (incluído no plano)
   ✅ Dependente 2: GRÁTIS (incluído no plano)
   ✅ Dependente 3: GRÁTIS (incluído no plano)
   ⚠️ Dependente 4: R$ 50,00
   ⚠️ Dependente 5: R$ 50,00

   Total da Oferta: R$ 419,90
```

---

## 🧪 Teste Variações

### Teste 1: Pós 100GB (1 Grátis)

```
Plano: Claro Pós 100GB (Multi)
Dependentes: 3

Esperado:
✅ Dependente 1: GRÁTIS
⚠️ Dependente 2: R$ 50,00
⚠️ Dependente 3: R$ 50,00

Total: R$ 169,90 + R$ 100,00 = R$ 269,90
```

### Teste 2: Pós 50GB (Nenhum Grátis)

```
Plano: Claro Pós 50GB (Multi)
Dependentes: 2

Esperado:
⚠️ Dependente 1: R$ 50,00
⚠️ Dependente 2: R$ 50,00

Total: R$ 119,90 + R$ 100,00 = R$ 219,90
(Sem economia)
```

### Teste 3: Sem Plano Móvel

```
Banda Larga: BL 750 Mega (Combo)
Dependentes: 2

Esperado:
⚠️ Dependente 1: R$ 50,00
⚠️ Dependente 2: R$ 50,00

(Nenhuma economia, não há móvel com benefício)
```

---

## 🔍 Checklist de Verificação

Marque quando cada teste passar:

- [ ] Seed executou com sucesso (273 produtos)
- [ ] Campo `dependentesGratis` aparece no Firestore
- [ ] Componente `DependentesDescontoInfo` aparece (caixa azul)
- [ ] Desconto de 3 dependentes é mostrado corretamente
- [ ] Economia de R$ 150,00 é calculada
- [ ] Teste com Pós 100GB (1 grátis) funciona
- [ ] Teste com Pós 50GB (nenhum grátis) funciona
- [ ] Teste sem móvel (nenhum desconto) funciona

---

## 📊 Console Logs para Debug

Se algo não funcionar, abra o console do navegador (F12) e procure por:

```javascript
// Deve aparecer quando carregar produtos:
productsData: "X produtos"

// Deve aparecer quando adicionar dependentes:
Produto Adicionado!
"Dependente Móvel foi adicionado à oferta."

// Verify context values:
useOffer() → {
  totalMensal: 419.90,
  dependentesInfo: [...]
}
```

---

## 🆘 Troubleshooting

### ❌ Problema: Componente não aparece

**Causa:** Você não adicionou o componente à página

**Solução:**
```tsx
// Em pages que exibem oferta, adicione:
import { DependentesDescontoInfo } from '@/components/dependentes-desconto-info';

export default function MinhaOferta() {
  return (
    <>
      {/* ... outros conteúdos ... */}
      <DependentesDescontoInfo />
    </>
  );
}
```

### ❌ Problema: Desconto não é aplicado

**Causa 1:** Campo `dependentesGratis` não foi populado no Firestore

**Solução:**
```bash
# Faça seed novamente
npx tsx clean-products.ts
npm run db:seed
```

**Causa 2:** Você não tem um plano Móvel selecionado

**Solução:**
- Certifique-se de adicionar um plano Móvel antes dos dependentes

### ❌ Problema: Valor errado de desconto

**Causa:** Função não está extraindo corretamente

**Debug:**
```javascript
// No console, teste:
import { extrairDependentesGratis } from '@/lib/discount-utils';

const beneficios = ["3 dependentes grátis", "..."];
console.log(extrairDependentesGratis(beneficios)); // Deve retornar 3
```

---

## 🎯 Resultado Esperado Final

Após todos os testes, você terá um sistema que:

✅ Detecta automaticamente plano móvel
✅ Extrai número de dependentes grátis dos benefícios
✅ Aplica desconto quando dependentes são adicionados
✅ Mostra interface clara com economia
✅ Calcula total correto

---

**Pronto para testar? Comece com o Passo 1!** 🚀
