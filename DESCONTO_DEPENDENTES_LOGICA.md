# 🎯 Sistema de Desconto Automático de Dependentes Móvel

## 📋 Visão Geral

Implementei uma lógica inteligente que **aplica desconto automático em dependentes móvel** de acordo com os benefícios do plano móvel principal:

### 🔍 Como Funciona

```
1. Usuário adiciona "Claro Pós 300GB (Multi)" → 3 dependentes grátis
2. Usuário adiciona 5 dependentes móvel
3. Sistema calcula:
   - Dependente 1: GRÁTIS (1º gratuito)
   - Dependente 2: GRÁTIS (2º gratuito)
   - Dependente 3: GRÁTIS (3º gratuito)
   - Dependente 4: R$ 50,00 (pago)
   - Dependente 5: R$ 50,00 (pago)

4. Total: R$ 100,00 (ao invés de R$ 250,00)
```

---

## 🛠️ Componentes Técnicos

### 1. **`src/lib/discount-utils.ts`** - Funções de Cálculo

```typescript
// Extrai número de dependentes grátis dos benefícios
extrairDependentesGratis(beneficios: string[]): number

// Calcula preço de cada dependente com desconto
calcularDescontoDependentes(
  movelPrincipal: Produto,
  dependentesAdicionados: Produto[]
): Array<{
  index: number;
  dependente: Produto;
  precoAplicado: number;  // 0 se grátis, precoMensal se pago
  isGratis: boolean;
  descricao: string;
}>

// Calcula total da oferta com descontos aplicados
calcularTotalComDescontos(produtos: Produto[]): number
```

### 2. **`src/lib/types.ts`** - Tipos Atualizados

```typescript
interface Produto {
  // ... campos anteriores ...
  dependentesGratis?: number;  // Número de dependentes inclusos no plano
  precoAplicado?: number;      // Preço final com descontos
}
```

### 3. **`src/contexts/offer-context.tsx`** - Context Atualizado

```typescript
interface OfferContextType {
  // ... métodos anteriores ...
  
  // Novos campos com informações de desconto
  totalMensal: number;
  dependentesInfo: Array<{
    index: number;
    dependente: Produto;
    precoAplicado: number;
    isGratis: boolean;
    descricao: string;
  }>;
}
```

### 4. **`src/components/dependentes-desconto-info.tsx`** - UI de Exibição

Componente que mostra:
- ✅ Quantos dependentes são grátis
- ✅ Preço de cada dependente
- 💰 Economia total
- 📊 Total da oferta com desconto

### 5. **`src/seed.ts`** - Dados Automáticos

O seed agora extrai automaticamente `dependentesGratis` dos benefícios:

```typescript
// Planos móvel de exemplo:
"Claro Pós 300GB (Multi)" → 3 dependentes grátis
"Claro Pós 150GB (Multi)" → 2 dependentes grátis
"Claro Pós 100GB (Multi)" → 1 dependente grátis
"Claro Pós 60GB Gaming"   → 0 dependentes (não tem no benefício)
```

---

## 📊 Exemplos de Uso

### Exemplo 1: Plano com 3 Dependentes Grátis

```
Plano: Claro Pós 300GB (Multi) - R$ 319,90
Benefícios: "3 dependentes grátis"

Dependentes Adicionados: 5

Cálculo:
├── Dep 1: R$ 0,00 ✅ (grátis)
├── Dep 2: R$ 0,00 ✅ (grátis)
├── Dep 3: R$ 0,00 ✅ (grátis)
├── Dep 4: R$ 50,00 ⏺ (pago)
└── Dep 5: R$ 50,00 ⏺ (pago)

Total Dependentes: R$ 100,00
Total Oferta: R$ 419,90
Economia: R$ 150,00
```

### Exemplo 2: Plano com 1 Dependente Grátis

```
Plano: Claro Pós 100GB (Multi) - R$ 169,90
Benefícios: "1 dependente grátis"

Dependentes Adicionados: 3

Cálculo:
├── Dep 1: R$ 0,00 ✅ (grátis)
├── Dep 2: R$ 50,00 ⏺ (pago)
└── Dep 3: R$ 50,00 ⏺ (pago)

Total Dependentes: R$ 100,00
Total Oferta: R$ 269,90
Economia: R$ 50,00
```

### Exemplo 3: Plano Sem Dependentes Grátis

```
Plano: Claro Pós 50GB (Multi) - R$ 119,90
Benefícios: Nenhum menciona dependentes grátis

Dependentes Adicionados: 2

Cálculo:
├── Dep 1: R$ 50,00 ⏺ (pago)
└── Dep 2: R$ 50,00 ⏺ (pago)

Total Dependentes: R$ 100,00
Total Oferta: R$ 219,90
Economia: R$ 0,00
```

---

## 🔄 Fluxo de Execução

```
1. Usuário seleciona cidade
2. Usuário adiciona plano móvel principal
   → Sistema extrai "dependentesGratis" do benefício
   → Armazena em: product.dependentesGratis

3. Usuário adiciona dependentes (com input de quantidade)
   → Cada um cria um produto "Dependente Móvel"
   → ID único: "${product.id}-${Date.now()}-${Math.random()}"

4. Context recalcula automaticamente:
   → movelPrincipal = find(tipo === 'Movel')
   → dependentesAdicionados = filter(tipo === 'Dependente Móvel')
   → dependentesInfo = calcularDescontoDependentes(...)
   → totalMensal = calcularTotalComDescontos(...)

5. UI exibe:
   - Cada dependente com preço (grátis ou R$ 50,00)
   - Economia total
   - Total da oferta com desconto
```

---

## 💾 Banco de Dados

### Produtos Móvel com `dependentesGratis`

```
Firestore - produtos (Móvel):
├── Claro Pós 300GB (Multi)
│   └── dependentesGratis: 3
├── Claro Pós 150GB (Multi)
│   └── dependentesGratis: 2
├── Claro Pós 100GB (Multi)
│   └── dependentesGratis: 1
├── Claro Pós 60GB Gaming
│   └── dependentesGratis: 0
├── Claro Pós 50GB (Multi)
│   └── dependentesGratis: 0
├── Claro Pós 25GB (Multi)
│   └── dependentesGratis: 0
├── Claro Controle 25GB Gamer (Multi)
│   └── dependentesGratis: 0 (não especificado)
├── Claro Controle 25GB (Multi)
│   └── dependentesGratis: 0 (não especificado)
└── Claro Controle 20GB (Multi)
    └── dependentesGratis: 0 (não especificado)
```

---

## 🚀 Próximas Ações

1. **Fazer seed novamente:**
   ```bash
   npx tsx clean-products.ts
   npm run db:seed
   ```
   → Agora os produtos móvel terão `dependentesGratis` no Firestore

2. **Adicionar componente ao builder:**
   - Incluir `<DependentesDescontoInfo />` na page de resultado
   - Exibir quando houver plano móvel + dependentes

3. **Testar a lógica:**
   - Adicionar Claro Pós 300GB (3 grátis)
   - Adicionar 5 dependentes
   - Verificar se apenas 2 são cobrados

---

## 📝 Commits

| Hash | Mensagem |
|------|----------|
| `fb9cc25` | feat(discount): adicionar lógica de desconto automático de dependentes baseado no plano móvel |

---

## ✨ Benefícios

✅ Desconto automático (sem cálculo manual)
✅ Baseado nos benefícios reais do plano
✅ Interface intuitiva mostrando economia
✅ Total sempre correto
✅ Suporta qualquer número de dependentes grátis
✅ Escalável para novos planos

---

**Pronto para testar! Execute o seed e teste a UI.** 🎯
