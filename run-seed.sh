#!/bin/bash

# Script para limpar e fazer seed do Firestore
# Use: bash run-seed.sh

set -e

echo "🚀 Iniciando processo de seeding..."
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale em: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"
echo "✅ npm encontrado: $(npm --version)"
echo ""

# Ir para a pasta do projeto
cd "$(dirname "$0")"
echo "📁 Pasta do projeto: $(pwd)"
echo ""

# Limpar produtos antigos
echo "🧹 Limpando produtos antigos..."
npx tsx clean-products.ts

echo ""
echo "💾 Fazendo seed com novos produtos (incluindo Dependente Móvel)..."
npm run db:seed

echo ""
echo "✅ ✅ ✅ Seeding concluído com sucesso! ✅ ✅ ✅"
echo ""
echo "📊 Próximas verificações:"
echo "   1. Acesse: https://console.firebase.google.com/project/studio-878079588-1d0ae/firestore"
echo "   2. Procure pela coleção 'produtos'"
echo "   3. Devem haver ~275 produtos (incluindo 3 Dependente Móvel)"
echo ""
