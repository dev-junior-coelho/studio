# 🔧 Sistema de Manutenção - Documentação

## 📋 Resumo

Um sistema completo foi implementado para exibir um popup de manutenção que impede o login dos usuários. O sistema é simples de ativar e desativar.

## 🚀 Como Usar

### ✅ Ativar a Manutenção

Abra o arquivo `src/lib/maintenance.ts` e altere:

```typescript
export const MAINTENANCE_CONFIG = {
  enabled: true,  // ✅ MUDE PARA true PARA ATIVAR
  message: "ESTAMOS EM MANUTENÇÃO PARA ATUALIZAÇÃO DO NOVO PORTFÓLIO",
  subtitle: "O sistema voltará em breve. Obrigado pela paciência!",
};
```

### ❌ Desativar a Manutenção

Abra o arquivo `src/lib/maintenance.ts` e altere:

```typescript
export const MAINTENANCE_CONFIG = {
  enabled: false,  // ✅ MUDE PARA false PARA DESATIVAR
  message: "ESTAMOS EM MANUTENÇÃO PARA ATUALIZAÇÃO DO NOVO PORTFÓLIO",
  subtitle: "O sistema voltará em breve. Obrigado pela paciência!",
};
```

## 🛡️ Funcionalidades

### O que Acontece Quando a Manutenção Está Ativa:

1. **Popup Modal Bloqueador** - Um modal é exibido na tela que não pode ser fechado
2. **Bloqueia Login** - Qualquer tentativa de login retorna um erro de manutenção
3. **Limpa Cache Local** - Remove dados de autenticação para forçar logout
4. **Mensagem Customizável** - Você pode alterar a mensagem e subtítulo conforme necessário

### Características do Modal:

- ✅ Não pode ser fechado com ESC
- ✅ Não pode ser fechado clicando fora
- ✅ Visual atrativo com cores de alerta (amarelo/laranja)
- ✅ Indicador de status "sistema em atualização"
- ✅ Funciona em modo claro e escuro

## 📁 Arquivos Criados/Modificados

### Novos Arquivos:
1. **`src/lib/maintenance.ts`** - Configuração de manutenção
2. **`src/components/maintenance-modal.tsx`** - Componente do modal de manutenção

### Arquivos Modificados:
1. **`src/app/layout.tsx`** - Adiciona o modal ao layout principal
2. **`src/contexts/auth-context.tsx`** - Bloqueia login durante manutenção

## 🎨 Personalização

Você pode editar o arquivo `src/lib/maintenance.ts` para customizar:

```typescript
export const MAINTENANCE_CONFIG = {
  enabled: true,
  message: "CUSTOM MESSAGE HERE", // Sua mensagem
  subtitle: "CUSTOM SUBTITLE HERE", // Seu subtítulo
};
```

## ⚙️ Comportamento Técnico

### Durante a Manutenção:

1. **Página de Login**: Mostra o modal de manutenção
2. **Tentativa de Login**: 
   - Retorna erro: "MANUTENÇÃO: O sistema está em manutenção..."
   - Limpa dados locais (localStorage, sessionStorage)
3. **Usuários Logados**: 
   - Não conseguem continuar navegando
   - São automaticamente desconectados ao recarregar

### Após Desativar a Manutenção:

- Sistema volta ao normal imediatamente
- Usuários podem fazer login novamente
- Nenhuma mudança de código além de `enabled: false`

## 🔍 Verificação Rápida

Para verificar se a manutenção está ativa, procure por:

```typescript
// src/lib/maintenance.ts
enabled: true  // Se for true, manutenção está ATIVA
```

## 📝 Exemplo de Fluxo

### Cenário 1: Ativar Manutenção
```
1. Editar src/lib/maintenance.ts
2. Mudar enabled: false → enabled: true
3. Deploy do app
4. Usuários verão o modal ao acessar
5. Login será bloqueado automaticamente
```

### Cenário 2: Desativar Manutenção
```
1. Editar src/lib/maintenance.ts
2. Mudar enabled: true → enabled: false
3. Deploy do app
4. Usuários podem fazer login novamente
```

## 🛠️ Troubleshooting

### O modal não aparece?
- Verifique se `enabled: true` está configurado
- Limpe o cache do navegador (Ctrl+Shift+Del)
- Recarregue a página (Ctrl+F5)

### O login ainda funciona?
- Verifique se você fez o deploy das alterações
- Confirme se `enabled: true` está salvo
- Reinicie o servidor local com `npm run dev`

### Preciso personalizar as cores?
- Edite o arquivo `src/components/maintenance-modal.tsx`
- Procure pelas classes Tailwind (yellow-400, orange-50, etc)
- Modifique conforme seu tema

## 📞 Suporte

Se tiver dúvidas:
1. Verifique a seção de Troubleshooting
2. Confirme se todas as alterações foram salvas
3. Limpe cache e recarregue a página
