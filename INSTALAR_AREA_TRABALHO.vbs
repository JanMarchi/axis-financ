' ============================================
' Criar atalho do instalador na Área de Trabalho
' ============================================

Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Obter o diretório do script
strScriptPath = objFSO.GetParentFolderName(WScript.ScriptFullName)
strDesktop = objShell.SpecialFolders("Desktop")

' Caminhos
strBatFile = strScriptPath & "\INSTALAR_TUDO.bat"
strShortcut = strDesktop & "\⚙️ INSTALAR Axis Finance.lnk"

' Verificar se o arquivo existe
If Not objFSO.FileExists(strBatFile) Then
    MsgBox "ERRO: INSTALAR_TUDO.bat não encontrado!", 16, "Erro"
    WScript.Quit 1
End If

' Criar atalho
Set objShortcut = objShell.CreateShortcut(strShortcut)
objShortcut.TargetPath = strBatFile
objShortcut.WorkingDirectory = strScriptPath
objShortcut.Description = "Instala PostgreSQL, Redis e WSL"
objShortcut.WindowStyle = 1
objShortcut.Save

' Mensagem de sucesso
MsgBox "✓ Atalho criado na Área de Trabalho!" & vbCrLf & vbCrLf & _
        "Nome: ⚙️ INSTALAR Axis Finance" & vbCrLf & vbCrLf & _
        "Clique duplo nele para instalar tudo automaticamente.", 64, "Sucesso!"
