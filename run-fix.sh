#!/bin/bash
# Script para executar toda a sequência de correção

echo "🔄 Iniciando sequência de correção de produtos..."
echo ""

echo "1️⃣  Limpando produtos antigos..."
node --loader tsx './clean-products.ts'
if [ $? -ne 0 ]; then
  echo "❌ Erro ao limpar produtos"
  exit 1
fi

echo ""
echo "2️⃣  Populando banco com dados corrigidos..."
node --loader tsx './src/seed.ts'
if [ $? -ne 0 ]; then
  echo "❌ Erro ao popular banco"
  exit 1
fi

echo ""
echo "3️⃣  Corrigindo tipo de Pontos Adicionais..."
node --loader tsx './fix-tipo-pontos-adicionais.ts'
if [ $? -ne 0 ]; then
  echo "❌ Erro ao corrigir tipo"
  exit 1
fi

echo ""
echo "✅ Todos os dados foram corrigidos com sucesso!"
echo ""
echo "Próximos passos:"
echo "  git add ."
echo "  git commit -m 'fix: corrigir tipo de Pontos Adicionais para aparecer na categoria correta'"
echo "  git push"
