@echo off
REM ============================================
REM Criar atalho na área de trabalho
REM ============================================

setlocal enabledelayedexpansion

echo.
echo ============================================
echo Criando atalho na Area de Trabalho...
echo ============================================
echo.

REM Obter o caminho do projeto
set "PROJECT_DIR=%CD%"
set "DESKTOP=%USERPROFILE%\Desktop"
set "VBS_FILE=%PROJECT_DIR%\START_AXIS_FINANCE.vbs"
set "SHORTCUT=%DESKTOP%\🚀 Axis Finance.lnk"

REM Verificar se o arquivo VBS existe
if not exist "%VBS_FILE%" (
    echo ERRO: START_AXIS_FINANCE.vbs nao encontrado!
    echo Certifique-se de executar este script na pasta do projeto
    pause
    exit /b 1
)

REM Criar atalho usando PowerShell
powershell -Command ^
    "$WshShell = New-Object -ComObject WScript.Shell; " ^
    "$Shortcut = $WshShell.CreateShortcut('%SHORTCUT%'); " ^
    "$Shortcut.TargetPath = '%VBS_FILE%'; " ^
    "$Shortcut.WorkingDirectory = '%PROJECT_DIR%'; " ^
    "$Shortcut.Description = 'Axis Finance - Inicia tudo com um clique'; " ^
    "$Shortcut.IconLocation = '%VBS_FILE%'; " ^
    "$Shortcut.Save()"

if errorlevel 1 (
    echo ERRO ao criar atalho!
    pause
    exit /b 1
)

echo.
echo ============================================
echo ✓ Atalho criado com sucesso!
echo ============================================
echo.
echo Local: %SHORTCUT%
echo.
echo Agora voce pode:
echo 1. Ir para a Area de Trabalho
echo 2. Clicar duplo no atalho "🚀 Axis Finance"
echo 3. Aguardar ~30 segundos
echo 4. Tudo iniciara automaticamente!
echo.
pause
