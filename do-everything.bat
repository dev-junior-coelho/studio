@echo off
REM Script completo: Limpar + Seed + Verificação (Windows)

setlocal enabledelayedexpansion

cls
echo.
echo ════════════════════════════════════════════════════════════
echo   🚀 PROCESSO COMPLETO: LIMPAR + SEED + VERIFICAR
echo ════════════════════════════════════════════════════════════
echo.

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js não encontrado. Instale em: https://nodejs.org/
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✅ Node.js: %NODE_VERSION%
echo ✅ npm: %NPM_VERSION%
echo.

REM Ir para pasta do projeto
cd /d "%~dp0"
echo 📁 Projeto: %cd%
echo.

REM ═══════════════════════════════════════════════════════════════
echo FASE 1: LIMPANDO PRODUTOS ANTIGOS
echo ───────────────────────────────────────────────────────────
echo.

call npx tsx clean-products.ts
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erro na limpeza!
    exit /b 1
)

echo.
echo ✅ Limpeza concluída!
echo.
echo ⏳ Aguardando 2 segundos antes do seed...
timeout /t 2 /nobreak

REM ═══════════════════════════════════════════════════════════════
echo.
echo FASE 2: FAZENDO SEED COM NOVOS PRODUTOS
echo ───────────────────────────────────────────────────────────
echo.

call npm run db:seed
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erro no seed!
    exit /b 1
)

REM ═══════════════════════════════════════════════════════════════
echo.
echo ════════════════════════════════════════════════════════════
echo   ✅ SUCESSO! TUDO PRONTO!
echo ════════════════════════════════════════════════════════════
echo.

echo 📊 PRÓXIMAS AÇÕES:
echo    1️⃣  Acesse o builder: http://localhost:3000/app/builder
echo    2️⃣  Procure por 'Dependente Móvel'
echo    3️⃣  Configure a quantidade (1-5 dependentes)
echo    4️⃣  Cada um custa R$ 50,00/mês
echo.

echo 🔍 VERIFICAÇÕES NO FIRESTORE:
echo    Console: https://console.firebase.google.com/
echo    Projeto: studio-878079588-1d0ae
echo    Coleção: produtos
echo    Total esperado: 273 documentos
echo    Dependente Móvel: 1 produto
echo.

echo ════════════════════════════════════════════════════════════
echo.

pause
