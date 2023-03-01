Dim WshShell, strCurDir, aitumInputFile, templateFile

Set WshShell = CreateObject("WScript.Shell")
aitumInputFile = "Bit_Printer_Data.ini"
templateFile = "bits_format.txt"

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
WshShell.Run "print_sub.exe ..\temp\" & aitumInputFile & " ..\templates\" & templateFile, 0
Set WshShell = Nothing

