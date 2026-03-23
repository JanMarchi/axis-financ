@echo off
REM ============================================
REM Axis Finance - Instalador Completo
REM Executa o script PowerShell
REM ============================================

REM Verificar se está rodando como administrador
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Este script precisa rodar como ADMINISTRADOR!
    echo.
    echo Clique com botao DIREITO neste arquivo e selecione:
    echo "Executar como administrador"
    echo.
    pause
    exit /b 1
)

REM Executar PowerShell script
powershell -ExecutionPolicy Bypass -NoExit -File "%~dp0INSTALAR_TUDO.ps1"
