# 👀 PREVIEW VISUAL DO POPUP DE MANUTENÇÃO

## Quando `enabled: true`

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│          🚨 ESTAMOS EM MANUTENÇÃO PARA          │
│     ATUALIZAÇÃO DO NOVO PORTFÓLIO                      │
│                                                         │
│          O sistema voltará em breve.                    │
│          Obrigado pela paciência!                       │
│                                                         │
│  ● Não feche esta janela                              │
│                                                         │
│  Sistema em atualização                               │
│  Voltaremos em breve com melhorias                     │
│                                                         │
└─────────────────────────────────────────────────────────┘

⚠️ NÃO PODE FECHAR COM ESC
⚠️ NÃO PODE FECHAR CLICANDO FORA
⚠️ NÃO PODE FECHAR COM BOTÃO X (se tiver)
```

## Quando `enabled: false`

```
Popup DESAPARECE
↓
Aplicação funciona NORMALMENTE
↓
Login HABILITADO
↓
Usuários conseguem acessar o sistema
```

---

## Características do Modal

### Visual
- **Cor de Alerta**: Amarelo/Laranja
- **Icon**: Ícone de alerta (AlertCircle)
- **Responsivo**: Funciona em desktop, tablet e celular
- **Tema**: Suporta modo claro e escuro

### Comportamento
- ✅ Bloqueador (modal não pode ser fechado)
- ✅ Centralizado na tela
- ✅ Overlay escuro de fundo
- ✅ Mensagem clara e legível
- ✅ Indicador visual de status ("● Não feche esta janela")

### Funcionalidade
- ✅ Limpa localStorage automaticamente
- ✅ Limpa sessionStorage automaticamente
- ✅ Bloqueia todas as tentativas de login
- ✅ Funciona em tempo real

---

## Exemplo de Customização

### Mensagem Padrão (incluída)
```
ESTAMOS EM MANUTENÇÃO PARA ATUALIZAÇÃO DO NOVO PORTFÓLIO
O sistema voltará em breve. Obrigado pela paciência!
```

### Mensagem Customizada (você pode mudar)
```
SISTEMA EM MANUTENÇÃO
Voltamos em 2 horas!
```

### Outra Opção
```
ATUALIZAÇÃO PROGRAMADA
Previsão: 15:30 de hoje
```

---

## Fluxo do Usuário Durante Manutenção

```
1. Usuário acessa o app
   ↓
2. Popup aparece na tela
   ↓
3. Popup não pode ser fechado
   ↓
4. Usuário tenta fazer login
   ↓
5. Erro: "Sistema em manutenção"
   ↓
6. Usuário aguarda retorno
```

---

## Fluxo Após Desativar Manutenção

```
1. Você muda enabled: true → false
   ↓
2. Popup desaparece
   ↓
3. Usuários recarregam a página
   ↓
4. Sistema funciona normalmente
   ↓
5. Login está disponível novamente
```

---

## Cores Utilizadas

### Modo Claro
- Fundo: Amarelo suave (from-yellow-50 to-orange-50)
- Texto: Amarelo escuro (yellow-700)
- Border: Amarelo médio (yellow-400)

### Modo Escuro
- Fundo: Amarelo muito escuro (from-yellow-950 to-orange-950)
- Texto: Amarelo claro (yellow-400)
- Border: Amarelo médio (yellow-400)

---

## O Modal em Diferentes Dispositivos

### Desktop (1920x1080)
```
┌─────────────────────────────────────────────────────────────┐
│                       POPUP CENTRALIZADO                    │
│                      (max-width: 448px)                      │
└─────────────────────────────────────────────────────────────┘
```

### Tablet (768x1024)
```
┌──────────────────────────────┐
│   POPUP AJUSTADO PARA       │
│   TELA MENOR (com padding)  │
└──────────────────────────────┘
```

### Mobile (375x812)
```
┌────────────────┐
│ POPUP ADAPTADO │
│ PARA CELULAR   │
│ (com padding)  │
└────────────────┘
```

---

## Verificação: Como Saber se Está Funcionando

### Teste Local

1. Edite `src/lib/maintenance.ts`
2. Mude `enabled: false` → `enabled: true`
3. Salve com Ctrl+S
4. Recarregue a página (F5 ou Ctrl+R)
5. O popup deve aparecer! ✅

### Teste de Bloqueio

1. Com o popup aparecendo, tente:
   - Fechar com ESC → Não funciona ✅
   - Clicar fora do popup → Não funciona ✅
   - Fazer login → Erro de manutenção ✅

### Teste de Desativação

1. Mude `enabled: true` → `enabled: false`
2. Salve com Ctrl+S
3. Recarregue a página (F5)
4. O popup desaparece ✅
5. Login funciona novamente ✅

---

## Mensagens de Erro Durante Manutenção

### Na página de login
```
❌ MANUTENÇÃO: O sistema está em manutenção no momento. 
   Por favor, tente novamente mais tarde.
```

### Ao tentar fazer login
```
❌ Erro: MANUTENÇÃO...
```

---

## Código Responsável pelo Modal

### Arquivo Principal
```typescript
// src/components/maintenance-modal.tsx

export function MaintenanceModal() {
  // 🎨 Renderiza o modal
  // 🔒 Bloqueia fechamento
  // 🗑️ Limpa cache de auth
}
```

### Arquivo de Configuração
```typescript
// src/lib/maintenance.ts

export const MAINTENANCE_CONFIG = {
  enabled: true,  // ← MUDE AQUI
  message: "...",
  subtitle: "...",
};
```

---

## Status Resumido

| Aspecto | Status |
|---------|--------|
| Visual | ✅ Responsivo e atrativo |
| Funcionalidade | ✅ Bloqueia login completamente |
| Customização | ✅ Fácil de personalizar |
| Ativação | ✅ Uma linha de código |
| Documentação | ✅ Completa e clara |

**TUDO PRONTO PARA USAR! 🚀**
