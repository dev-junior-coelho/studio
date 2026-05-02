## 🎯 SISTEMA DE MANUTENÇÃO - INSTRUÇÕES FINAIS

### 📍 Localização Exata do Arquivo para Ativar/Desativar

```
projeto/
└── src/
    └── lib/
        └── maintenance.ts  ← 📍 ARQUIVO PRINCIPAL
```

---

### 🔴 ESTADO ATUAL

**Status do Sistema:** AGUARDANDO ATIVAÇÃO

```typescript
// src/lib/maintenance.ts
enabled: true  // ✅ MANUTENÇÃO ATIVADA NO CÓDIGO
```

Você pode fazer deploy com segurança que o sistema estará em manutenção quando `enabled: true`.

---

### 🟢 ATIVAR MANUTENÇÃO (Passo a Passo)

#### Passo 1️⃣: Abrir o Arquivo
```
Caminho: src/lib/maintenance.ts
Atalho: Ctrl+P (VSCode) → digitar "maintenance.ts"
```

#### Passo 2️⃣: Procurar pela Configuração
```typescript
export const MAINTENANCE_CONFIG = {
  enabled: false,  // ← AQUI
  message: "ESTAMOS EM MANUTENÇÃO PARA ATUALIZAÇÃO DO NOVO PORTFÓLIO",
  subtitle: "O sistema voltará em breve. Obrigado pela paciência!",
};
```

#### Passo 3️⃣: Alterar Valor
```typescript
export const MAINTENANCE_CONFIG = {
  enabled: true,  // ✅ MUDADO PARA true
  message: "ESTAMOS EM MANUTENÇÃO PARA ATUALIZAÇÃO DO NOVO PORTFÓLIO",
  subtitle: "O sistema voltará em breve. Obrigado pela paciência!",
};
```

#### Passo 4️⃣: Salvar
```
Atalho: Ctrl+S (Windows/Linux) ou Cmd+S (Mac)
```

#### Passo 5️⃣: Fazer Deploy
```bash
# Se for produção, fazer deploy normalmente
# O Next.js detectará a mudança automaticamente
```

---

### 🟡 DESATIVAR MANUTENÇÃO (Passo a Passo)

#### Passo 1️⃣ a 2️⃣: Mesmo processo acima

#### Passo 3️⃣: Alterar Valor
```typescript
export const MAINTENANCE_CONFIG = {
  enabled: false,  // ✅ MUDADO PARA false
  message: "ESTAMOS EM MANUTENÇÃO PARA ATUALIZAÇÃO DO NOVO PORTFÓLIO",
  subtitle: "O sistema voltará em breve. Obrigado pela paciência!",
};
```

#### Passo 4️⃣ a 5️⃣: Salvar e fazer deploy

---

### 🎨 PERSONALIZAR MENSAGEM

Se quiser mudar a mensagem de manutenção:

```typescript
export const MAINTENANCE_CONFIG = {
  enabled: true,
  message: "SUA MENSAGEM AQUI",  // ← MUDE AQUI
  subtitle: "SEU SUBTÍTULO AQUI",  // ← OU AQUI
};
```

Exemplos:
```typescript
// Exemplo 1: Manutenção curta
message: "Sistema em Manutenção"
subtitle: "Voltamos em breve!"

// Exemplo 2: Manutenção com horário
message: "Manutenção Programada"
subtitle: "Previsão de retorno: 15:30"

// Exemplo 3: Customizado
message: "ATUALIZAÇÃO EM PROGRESSO"
subtitle: "Nova versão sendo preparada. Desculpe!"
```

---

### 🔍 VERIFICAR STATUS

Para verificar se a manutenção está ativa:

1. Abra `src/lib/maintenance.ts`
2. Procure por `enabled:`
3. Se for `true` → Manutenção ATIVA ✅
4. Se for `false` → Manutenção INATIVA ⭕

---

### 🧪 TESTAR LOCALMENTE

Antes de fazer deploy em produção:

```bash
# 1. Parar o servidor (Ctrl+C)
# 2. Ativar manutenção em src/lib/maintenance.ts (enabled: true)
# 3. Iniciar o servidor
npm run dev

# 4. Abrir http://localhost:3000
# 5. Você verá o popup de manutenção
```

---

### ❌ O QUE NÃO FAZER

❌ Não edite nenhum outro arquivo
❌ Não modifique o HTML do modal
❌ Não tente contornar o bloqueio de login
❌ Não limpe ou delete os arquivos criados

✅ Apenas mude o valor de `enabled` no arquivo `maintenance.ts`

---

### ✅ O QUE ESPERAR

Quando `enabled: true`:

✅ Popup aparece para todos os usuários  
✅ Popup não pode ser fechado  
✅ Mensagem é clara e informativa  
✅ Login é bloqueado com mensagem de erro  
✅ Cache de autenticação é limpo  
✅ Funciona em desktop, tablet e celular  
✅ Funciona em modo claro e escuro  

---

### 🚨 TROUBLESHOOTING

**P: Mudei para `enabled: true` mas o popup não aparece**  
R: Limpe o cache do navegador (Ctrl+Shift+Del) e recarregue (Ctrl+F5)

**P: O login ainda funciona mesmo com manutenção ativa**  
R: Faça hard refresh (Ctrl+Shift+R) e verifique se salvou o arquivo

**P: A mensagem não mudou**  
R: Salve o arquivo (Ctrl+S) e recarregue a página (F5)

**P: Preciso de ajuda para fazer deploy**  
R: Cada plataforma tem seu processo, mas basicamente:
   1. Edite src/lib/maintenance.ts
   2. Mude `enabled: true`
   3. Faça commit e push
   4. Deploy normalmente na sua plataforma

---

### 📞 RESUMO FINAL

| O quê | Onde |
|-------|------|
| Ativar/Desativar | `src/lib/maintenance.ts` - mudar `enabled` |
| Customizar Mensagem | `src/lib/maintenance.ts` - editar `message` e `subtitle` |
| Customizar Design | `src/components/maintenance-modal.tsx` |
| Documentação | `MANUTENCAO_POPUP_GUIA.md` |
| Guia Rápido | `MANUTENCAO_RAPIDO.md` |

---

### ✨ PRONTO!

Você tem tudo o que precisa. Basta editar um arquivo e o sistema estará em manutenção!

**Dúvidas? Consulte os arquivos de documentação inclusos.**
