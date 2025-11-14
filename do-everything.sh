#!/bin/bash

# Script completo: Limpar + Seed + Verificação
# Este script:
# 1. Deleta todos os produtos antigos
# 2. Faz seed com os 273 novos produtos (incluindo Dependente Móvel)
# 3. Mostra estatísticas finais

set -e

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  🚀 PROCESSO COMPLETO: LIMPAR + SEED + VERIFICAR"
echo "════════════════════════════════════════════════════════════"
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale em: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"
echo ""

# Ir para pasta do projeto
cd "$(dirname "$0")"
PROJECT_PATH="$(pwd)"
echo "📁 Projeto: $PROJECT_PATH"
echo ""

# ═══════════════════════════════════════════════════════════════
echo "FASE 1: LIMPANDO PRODUTOS ANTIGOS"
echo "───────────────────────────────────────────────────────────"
echo ""

if npx tsx clean-products.ts; then
    echo ""
    echo "✅ Limpeza concluída!"
else
    echo "❌ Erro na limpeza!"
    exit 1
fi

echo ""
echo "⏳ Aguardando 2 segundos antes do seed..."
sleep 2

# ═══════════════════════════════════════════════════════════════
echo ""
echo "FASE 2: FAZENDO SEED COM NOVOS PRODUTOS"
echo "───────────────────────────────────────────────────────────"
echo ""

if npm run db:seed; then
    echo ""
    echo "✅ Seed concluído!"
else
    echo "❌ Erro no seed!"
    exit 1
fi

# ═══════════════════════════════════════════════════════════════
echo ""
echo "════════════════════════════════════════════════════════════"
echo "  ✅ SUCESSO! TUDO PRONTO!"
echo "════════════════════════════════════════════════════════════"
echo ""

echo "📊 PRÓXIMAS AÇÕES:"
echo "   1️⃣  Acesse o builder: http://localhost:3000/app/builder"
echo "   2️⃣  Procure por 'Dependente Móvel'"
echo "   3️⃣  Configure a quantidade (1-5 dependentes)"
echo "   4️⃣  Cada um custa R$ 50,00/mês"
echo ""

echo "🔍 VERIFICAÇÕES NO FIRESTORE:"
echo "   Console: https://console.firebase.google.com/"
echo "   Projeto: studio-878079588-1d0ae"
echo "   Coleção: produtos"
echo "   Total esperado: 273 documentos"
echo "   Dependente Móvel: 1 produto"
echo ""

echo "════════════════════════════════════════════════════════════"
echo ""
