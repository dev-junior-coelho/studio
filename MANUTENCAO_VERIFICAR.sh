#!/bin/bash

# 📋 CHECKLIST DE IMPLEMENTAÇÃO - SISTEMA DE MANUTENÇÃO
# ═══════════════════════════════════════════════════════════════════════════

echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                        ║"
echo "║  ✅ CHECKLIST DE IMPLEMENTAÇÃO - SISTEMA DE MANUTENÇÃO               ║"
echo "║                                                                        ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📁 VERIFICANDO ARQUIVOS CRIADOS...${NC}"
echo "─────────────────────────────────────────────────────────────────"

# Checklist de arquivos
files=(
    "src/lib/maintenance.ts"
    "src/components/maintenance-modal.tsx"
    "MANUTENCAO_RAPIDO.md"
    "MANUTENCAO_POPUP_GUIA.md"
    "MANUTENCAO_INSTRUCOES_FINAIS.md"
    "MANUTENCAO_RESUMO.txt"
    "MANUTENCAO_PREVIEW_VISUAL.md"
    "MANUTENCAO_COMECE_AQUI.txt"
)

all_files_exist=true

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file"
    else
        echo -e "${RED}❌${NC} $file"
        all_files_exist=false
    fi
done

echo ""
echo -e "${BLUE}📝 VERIFICANDO MODIFICAÇÕES NOS ARQUIVOS...${NC}"
echo "─────────────────────────────────────────────────────────────────"

# Verificar se o arquivo de layout foi modificado
if grep -q "MaintenanceModal" "src/app/layout.tsx"; then
    echo -e "${GREEN}✅${NC} src/app/layout.tsx - Contém MaintenanceModal"
else
    echo -e "${RED}❌${NC} src/app/layout.tsx - Não contém MaintenanceModal"
fi

# Verificar se o arquivo auth-context foi modificado
if grep -q "isMaintenanceMode" "src/contexts/auth-context.tsx"; then
    echo -e "${GREEN}✅${NC} src/contexts/auth-context.tsx - Contém verificação de manutenção"
else
    echo -e "${RED}❌${NC} src/contexts/auth-context.tsx - Sem verificação de manutenção"
fi

echo ""
echo -e "${BLUE}⚙️  VERIFICANDO CONFIGURAÇÃO...${NC}"
echo "─────────────────────────────────────────────────────────────────"

# Verificar o estado da configuração
if grep -q "enabled: true" "src/lib/maintenance.ts"; then
    echo -e "${YELLOW}⚠️  Status: MANUTENÇÃO ATIVA${NC}"
    echo "    Para desativar: mude 'enabled: true' para 'enabled: false'"
elif grep -q "enabled: false" "src/lib/maintenance.ts"; then
    echo -e "${GREEN}✅ Status: Manutenção desativada${NC}"
    echo "    Para ativar: mude 'enabled: false' para 'enabled: true'"
fi

echo ""
echo -e "${BLUE}📊 RESUMO FINAL${NC}"
echo "─────────────────────────────────────────────────────────────────"

if [ "$all_files_exist" = true ]; then
    echo -e "${GREEN}✅ Todos os arquivos foram criados com sucesso!${NC}"
else
    echo -e "${RED}❌ Alguns arquivos estão faltando!${NC}"
fi

echo ""
echo "📖 Arquivos de documentação disponíveis:"
echo "   • MANUTENCAO_COMECE_AQUI.txt ⭐ (comece por aqui)"
echo "   • MANUTENCAO_RAPIDO.md (guia rápido)"
echo "   • MANUTENCAO_INSTRUCOES_FINAIS.md (passo a passo)"
echo "   • MANUTENCAO_POPUP_GUIA.md (documentação completa)"
echo "   • MANUTENCAO_PREVIEW_VISUAL.md (visuais do popup)"
echo "   • MANUTENCAO_RESUMO.txt (resumo executivo)"

echo ""
echo "🚀 PRÓXIMOS PASSOS:"
echo "─────────────────────────────────────────────────────────────────"
echo ""
echo "1️⃣  Abra o arquivo: src/lib/maintenance.ts"
echo ""
echo "2️⃣  Procure pela linha: enabled: false"
echo ""
echo "3️⃣  Mude para: enabled: true"
echo ""
echo "4️⃣  Salve: Ctrl+S"
echo ""
echo "5️⃣  Recarregue a página ou faça deploy"
echo ""
echo "✅ Sistema em manutenção!"
echo ""
echo "─────────────────────────────────────────────────────────────────"
echo ""
echo "❓ Dúvidas? Consulte MANUTENCAO_COMECE_AQUI.txt"
echo ""
