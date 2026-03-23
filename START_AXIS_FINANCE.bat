@echo off
REM ============================================
REM Axis Finance - Start Script (Windows)
REM Inicia tudo com um clique
REM ============================================

setlocal enabledelayedexpansion

REM Cores (para melhor visual)
set "color=0A"
cls

echo.
echo ============================================
echo   AXIS FINANCE - Iniciando...
echo ============================================
echo.

REM Verificar se estamos no diretório correto
if not exist "apps\api\package.json" (
    echo ERRO: Execute este arquivo a partir da pasta raiz do projeto
    echo Coloque em: C:\Users\intel\Documents\jan\axis_financ\
    pause
    exit /b 1
)

REM ============================================
REM 1. Verificar PostgreSQL
REM ============================================
echo [1/5] Verificando PostgreSQL...
tasklist | find /i "postgres" > nul
if errorlevel 1 (
    echo AVISO: PostgreSQL não está rodando
    echo Iniciando WSL PostgreSQL...
    wsl sudo service postgresql start 2>nul
    timeout /t 3 /nobreak
)

REM ============================================
REM 2. Verificar Redis
REM ============================================
echo [2/5] Verificando Redis...
tasklist | find /i "redis" > nul
if errorlevel 1 (
    echo AVISO: Redis não está rodando
    echo Iniciando WSL Redis...
    wsl sudo service redis-server start 2>nul
    timeout /t 2 /nobreak
)

REM ============================================
REM 3. Verificar/Criar Database
REM ============================================
echo [3/5] Verificando database...
wsl psql -U mepoupe -d mepoupe_dev -c "\q" 2>nul
if errorlevel 1 (
    echo Criando database mepoupe_dev...
    wsl psql -U postgres -c "CREATE USER mepoupe WITH PASSWORD 'mepoupe_dev_pass';" 2>nul
    wsl psql -U postgres -c "CREATE DATABASE mepoupe_dev OWNER mepoupe;" 2>nul
    timeout /t 2 /nobreak
)

REM ============================================
REM 4. Rodar Migrations Prisma
REM ============================================
echo [4/5] Executando migrations Prisma...
cd apps\api
call npx prisma migrate deploy --skip-generate 2>nul
cd ..\..

REM ============================================
REM 5. Iniciar Serviços
REM ============================================
echo [5/5] Iniciando serviços...
echo.
echo Abrindo 2 janelas de terminal...
echo.

REM Iniciar Backend em uma nova janela
echo Iniciando Backend (NestJS) na porta 3001...
start "AXIS FINANCE - API Backend" cmd /k "cd apps\api && npm run start:dev"
timeout /t 3 /nobreak

REM Iniciar Frontend em outra janela
echo Iniciando Frontend (Next.js) na porta 3000...
start "AXIS FINANCE - Web Frontend" cmd /k "cd apps\web && npm run dev"
timeout /t 5 /nobreak

REM ============================================
REM Abrir navegador
REM ============================================
echo.
echo ============================================
echo   ✓ Serviços iniciados!
echo ============================================
echo.
echo Abrindo navegador em http://localhost:3000
echo.
timeout /t 2 /nobreak

start http://localhost:3000

echo.
echo API está em:      http://localhost:3001
echo Frontend está em: http://localhost:3000
echo Docs API:         http://localhost:3001/api/docs
echo.
echo Para parar os serviços, feche as janelas de terminal
echo.
pause
