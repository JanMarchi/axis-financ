' ============================================
' Axis Finance - Startup VBScript
' Inicia o PowerShell script sem mostrar prompt
' ============================================

Set objShell = CreateObject("WScript.Shell")

' Obter o diretório do script
strScriptPath = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)

' Comando para executar o PowerShell script
strCommand = "powershell -ExecutionPolicy Bypass -NoExit -File """ & strScriptPath & "\START_AXIS_FINANCE.ps1"""

' Executar
objShell.Run strCommand, 1, False

' Mensagem de início
MsgBox "AXIS FINANCE está iniciando!" & vbCrLf & vbCrLf & _
        "✓ PostgreSQL será verificado" & vbCrLf & _
        "✓ Redis será verificado" & vbCrLf & _
        "✓ Database será criado" & vbCrLf & _
        "✓ Migrations serão executadas" & vbCrLf & _
        "✓ Backend iniciará na porta 3001" & vbCrLf & _
        "✓ Frontend iniciará na porta 3000" & vbCrLf & _
        "✓ Navegador abrirá automaticamente" & vbCrLf & vbCrLf & _
        "Aguarde cerca de 30 segundos...", 0, "AXIS FINANCE - Iniciando"
