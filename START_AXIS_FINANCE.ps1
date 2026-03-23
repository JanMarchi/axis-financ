# ============================================
# Axis Finance - PowerShell Startup Script
# Executa tudo automaticamente
# ============================================

# Cores para output
$Host.UI.RawUI.ForegroundColor = "Green"

Write-Host @"
╔════════════════════════════════════════╗
║   AXIS FINANCE - Iniciando...          ║
╚════════════════════════════════════════╝
"@

$Host.UI.RawUI.ForegroundColor = "White"

# Obter o diretório onde o script está
$ScriptDir = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition
Set-Location $ScriptDir

# Verificar se estamos no diretório correto
if (-not (Test-Path "apps/api/package.json")) {
    Write-Host "❌ ERRO: Não encontrei apps/api/package.json" -ForegroundColor Red
    Write-Host "Execute este script a partir da pasta raiz do projeto" -ForegroundColor Red
    Read-Host "Pressione ENTER para sair"
    exit 1
}

Write-Host "✓ Diretório correto detectado`n" -ForegroundColor Green

# ============================================
# 1. Verificar PostgreSQL
# ============================================
Write-Host "[1/6] Verificando PostgreSQL..." -ForegroundColor Cyan
$psqlRunning = Get-Process postgres -ErrorAction SilentlyContinue
if (-not $psqlRunning) {
    Write-Host "⚠ PostgreSQL não está rodando" -ForegroundColor Yellow
    Write-Host "Iniciando via WSL..." -ForegroundColor Yellow
    wsl sudo service postgresql start 2>$null | Out-Null
    Start-Sleep -Seconds 3
}
Write-Host "✓ PostgreSQL OK`n" -ForegroundColor Green

# ============================================
# 2. Verificar Redis
# ============================================
Write-Host "[2/6] Verificando Redis..." -ForegroundColor Cyan
$redisRunning = Get-Process redis-server -ErrorAction SilentlyContinue
if (-not $redisRunning) {
    Write-Host "⚠ Redis não está rodando" -ForegroundColor Yellow
    Write-Host "Iniciando via WSL..." -ForegroundColor Yellow
    wsl sudo service redis-server start 2>$null | Out-Null
    Start-Sleep -Seconds 2
}
Write-Host "✓ Redis OK`n" -ForegroundColor Green

# ============================================
# 3. Criar database se não existir
# ============================================
Write-Host "[3/6] Verificando database..." -ForegroundColor Cyan
$dbExists = wsl psql -U mepoupe -d mepoupe_dev -c "\q" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Criando database mepoupe_dev..." -ForegroundColor Yellow
    wsl psql -U postgres -c "CREATE USER IF NOT EXISTS mepoupe WITH PASSWORD 'mepoupe_dev_pass';" 2>$null | Out-Null
    wsl psql -U postgres -c "CREATE DATABASE IF NOT EXISTS mepoupe_dev OWNER mepoupe;" 2>$null | Out-Null
    Start-Sleep -Seconds 2
}
Write-Host "✓ Database OK`n" -ForegroundColor Green

# ============================================
# 4. Rodar Migrations Prisma
# ============================================
Write-Host "[4/6] Executando Prisma migrations..." -ForegroundColor Cyan
Push-Location "apps/api"
npx prisma migrate deploy --skip-generate 2>$null | Out-Null
Pop-Location
Write-Host "✓ Migrations OK`n" -ForegroundColor Green

# ============================================
# 5. Iniciar Backend
# ============================================
Write-Host "[5/6] Iniciando Backend (NestJS port 3001)..." -ForegroundColor Cyan
$backendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ScriptDir/apps/api'; npm run start:dev" -PassThru -WindowStyle Normal
Write-Host "✓ Backend iniciado (PID: $($backendProcess.Id))`n" -ForegroundColor Green
Start-Sleep -Seconds 3

# ============================================
# 6. Iniciar Frontend
# ============================================
Write-Host "[6/6] Iniciando Frontend (Next.js port 3000)..." -ForegroundColor Cyan
$frontendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ScriptDir/apps/web'; npm run dev" -PassThru -WindowStyle Normal
Write-Host "✓ Frontend iniciado (PID: $($frontendProcess.Id))`n" -ForegroundColor Green
Start-Sleep -Seconds 5

# ============================================
# Abrir navegador
# ============================================
Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✓ SERVIÇOS INICIADOS COM SUCESSO!    ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "📱 Abrindo navegador..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"

Write-Host @"
🎯 Endpoints:
   Frontend:   http://localhost:3000
   API:        http://localhost:3001
   API Docs:   http://localhost:3001/api/docs
   Health:     http://localhost:3001/health

📝 Logs:
   Todos os logs estão nas janelas de terminal abertas

🛑 Para parar:
   Feche as janelas de terminal de Backend e Frontend

⚠️  IMPORTANTE:
   - Mantenha essas janelas de terminal abertas
   - Para parar tudo, feche as janelas de terminal
   - Não feche este script ainda

"@ -ForegroundColor White

# Aguardar processos
Write-Host "Monitorando serviços... (pressione Ctrl+C para parar)`n" -ForegroundColor Yellow

while ($true) {
    $backendAlive = Get-Process -Id $backendProcess.Id -ErrorAction SilentlyContinue
    $frontendAlive = Get-Process -Id $frontendProcess.Id -ErrorAction SilentlyContinue

    if (-not $backendAlive -or -not $frontendAlive) {
        Write-Host "`n⚠️  Um dos serviços foi encerrado" -ForegroundColor Yellow
        break
    }

    Start-Sleep -Seconds 5
}

Write-Host "Script finalizado`n" -ForegroundColor Yellow
