Dim WshShell, strCurDir, aitumInputFile, templateFile
Set WshShell = CreateObject("WScript.Shell")

REM On Error Resume Next
Function ShowShortName(filespec)
   Dim fso, f, s
   Set fso = CreateObject("Scripting.FileSystemObject")
   Set f = fso.GetFolder(filespec & "\")
   s = f.ShortPath
   ShowShortName = s
End Function

strCurDir=ShowShortName(Left(WScript.ScriptFullName,InStrRev(WScript.ScriptFullName,"\"))) & "\"

WshShell.CurrentDirectory = strCurDir

aitumInputFile = "sub.ini"

Sub includeFile(fSpec)
    With CreateObject("Scripting.FileSystemObject")
       executeGlobal .openTextFile(fSpec).readAll()
    End With
End Sub

includeFile(strCurDir & "readini.vbi")

subContext = ReadIni( strCurDir & "..\temp\" & aitumInputFile, "context", "value" )
subContext = Left(Right(subContext, Len(subContext) - 1), Len(subContext) - 2)

If (subContext = "anonsubgift") Then
    templateFile = "anon_gift_sub_format.txt"
ElseIf (subContext = "subgift") Then
    templateFile = "gift_sub_format.txt"
Else
    templateFile = "nongift_sub_format.txt"
End If

WshShell.Run "print_sub.exe ..\temp\" & aitumInputFile & " ..\templates\" & templateFile, 0
Set WshShell = Nothing
