# Script para limpar e fazer seed do Firestore (Windows)
# Use: PowerShell -ExecutionPolicy Bypass -File run-seed.ps1

Write-Host "🚀 Iniciando processo de seeding..." -ForegroundColor Green
Write-Host ""

# Verificar se Node.js está instalado
$nodeCheck = node --version 2>$null
if (-not $nodeCheck) {
    Write-Host "❌ Node.js não encontrado. Instale em: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js encontrado: $nodeCheck" -ForegroundColor Green
$npmVersion = npm --version
Write-Host "✅ npm encontrado: $npmVersion" -ForegroundColor Green
Write-Host ""

# Ir para a pasta do projeto
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath
Write-Host "📁 Pasta do projeto: $(Get-Location)" -ForegroundColor Green
Write-Host ""

# Limpar produtos antigos
Write-Host "🧹 Limpando produtos antigos..." -ForegroundColor Yellow
npx tsx clean-products.ts

Write-Host ""
Write-Host "💾 Fazendo seed com novos produtos (incluindo Dependente Móvel)..." -ForegroundColor Yellow
npm run db:seed

Write-Host ""
Write-Host "✅ ✅ ✅ Seeding concluído com sucesso! ✅ ✅ ✅" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Próximas verificações:" -ForegroundColor Cyan
Write-Host "   1. Acesse: https://console.firebase.google.com/project/studio-878079588-1d0ae/firestore"
Write-Host "   2. Procure pela coleção 'produtos'"
Write-Host "   3. Devem haver ~275 produtos (incluindo 3 Dependente Móvel)"
Write-Host ""
