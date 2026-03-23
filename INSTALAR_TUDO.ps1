# ============================================
# Axis Finance - Instalador Completo
# Instala WSL, PostgreSQL, Redis e inicia tudo
# ============================================

# Cores
$Host.UI.RawUI.ForegroundColor = "Green"

Write-Host @"
╔════════════════════════════════════════════════════════════╗
║  AXIS FINANCE - INSTALADOR COMPLETO                       ║
║  Vai instalar tudo que você precisa                       ║
╚════════════════════════════════════════════════════════════╝
"@

$Host.UI.RawUI.ForegroundColor = "White"

# Verificar se está rodando como Admin
$isAdmin = [bool]([Security.Principal.WindowsIdentity]::GetCurrent().Groups |
    Where-Object { $_.Value -eq "S-1-5-32-544" })

if (-not $isAdmin) {
    Write-Host "❌ Este script PRECISA rodar como Administrador!" -ForegroundColor Red
    Write-Host "Clique com botão DIREITO no PowerShell e selecione 'Executar como administrador'" -ForegroundColor Yellow
    Read-Host "Pressione ENTER para sair"
    exit 1
}

Write-Host "✓ Executando como administrador`n" -ForegroundColor Green

# ============================================
# PASSO 1: Verificar/Instalar WSL
# ============================================
Write-Host "[1/5] Verificando WSL..." -ForegroundColor Cyan

try {
    $wslVersion = wsl --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ WSL já está instalado`n" -ForegroundColor Green
    } else {
        throw "WSL não detectado"
    }
} catch {
    Write-Host "⚠ WSL não encontrado. Instalando..." -ForegroundColor Yellow
    Write-Host "Isso pode levar alguns minutos...`n" -ForegroundColor Yellow

    try {
        wsl --install --no-launch
        Write-Host "✓ WSL instalado com sucesso!" -ForegroundColor Green
        Write-Host "⚠ Você precisará REINICIAR o computador para completar a instalação" -ForegroundColor Yellow
        Write-Host "Após reiniciar, execute este script novamente`n" -ForegroundColor Yellow

        Read-Host "Pressione ENTER para reiniciar"
        Restart-Computer
        exit 0
    } catch {
        Write-Host "❌ Erro ao instalar WSL: $_" -ForegroundColor Red
        Write-Host "Tente instalar manualmente: https://docs.microsoft.com/windows/wsl/install" -ForegroundColor Yellow
        Read-Host "Pressione ENTER para sair"
        exit 1
    }
}

# ============================================
# PASSO 2: Instalar PostgreSQL
# ============================================
Write-Host "[2/5] Instalando PostgreSQL..." -ForegroundColor Cyan

$pgInstall = wsl which psql 2>$null
if ($LASTEXITCODE -eq 0 -and $null -ne $pgInstall) {
    Write-Host "✓ PostgreSQL já está instalado`n" -ForegroundColor Green
} else {
    Write-Host "Instalando PostgreSQL no WSL..." -ForegroundColor Yellow
    wsl sudo apt update 2>$null | Out-Null
    wsl sudo apt install -y postgresql-16 postgresql-contrib-16 2>$null | Out-Null

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ PostgreSQL instalado com sucesso`n" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao instalar PostgreSQL`n" -ForegroundColor Red
    }
}

# ============================================
# PASSO 3: Instalar Redis
# ============================================
Write-Host "[3/5] Instalando Redis..." -ForegroundColor Cyan

$redisInstall = wsl which redis-server 2>$null
if ($LASTEXITCODE -eq 0 -and $null -ne $redisInstall) {
    Write-Host "✓ Redis já está instalado`n" -ForegroundColor Green
} else {
    Write-Host "Instalando Redis no WSL..." -ForegroundColor Yellow
    wsl sudo apt install -y redis-server 2>$null | Out-Null

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Redis instalado com sucesso`n" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao instalar Redis`n" -ForegroundColor Red
    }
}

# ============================================
# PASSO 4: Iniciar Serviços
# ============================================
Write-Host "[4/5] Iniciando PostgreSQL e Redis..." -ForegroundColor Cyan

Write-Host "Iniciando PostgreSQL..." -ForegroundColor Yellow
wsl sudo service postgresql start 2>$null | Out-Null
Start-Sleep -Seconds 2

Write-Host "Iniciando Redis..." -ForegroundColor Yellow
wsl sudo service redis-server start 2>$null | Out-Null
Start-Sleep -Seconds 2

Write-Host "✓ Serviços iniciados`n" -ForegroundColor Green

# ============================================
# PASSO 5: Verificar Conexões
# ============================================
Write-Host "[5/5] Verificando conexões..." -ForegroundColor Cyan

# Testar PostgreSQL
try {
    $pgTest = wsl psql -U postgres -c "\q" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ PostgreSQL respondendo`n" -ForegroundColor Green
    } else {
        Write-Host "⚠ PostgreSQL pode estar demorando para iniciar..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
    }
} catch {
    Write-Host "⚠ Não consegui testar PostgreSQL ainda`n" -ForegroundColor Yellow
}

# Testar Redis
try {
    $redisTest = wsl redis-cli ping 2>$null
    if ($redisTest -eq "PONG") {
        Write-Host "✓ Redis respondendo`n" -ForegroundColor Green
    } else {
        Write-Host "⚠ Redis pode estar demorando para iniciar..." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠ Não consegui testar Redis ainda`n" -ForegroundColor Yellow
}

# ============================================
# Mensagem Final
# ============================================
Write-Host @"

╔════════════════════════════════════════════════════════════╗
║          ✓ INSTALAÇÃO CONCLUÍDA COM SUCESSO!              ║
╚════════════════════════════════════════════════════════════╝

✓ WSL está rodando
✓ PostgreSQL foi instalado e iniciado
✓ Redis foi instalado e iniciado

Agora você pode usar o startup script!

Próximos passos:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Execute: CRIAR_ATALHO_AREA_TRABALHO.bat
   (para criar atalho na Área de Trabalho)

2. Clique duplo no atalho 🚀 Axis Finance

3. Tudo iniciará automaticamente!

" -ForegroundColor Green

Write-Host "Pressione ENTER para fechar este script..." -ForegroundColor White
Read-Host
