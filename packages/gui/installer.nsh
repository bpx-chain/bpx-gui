!include "nsDialogs.nsh"

; Add our customizations to the finish page
!macro customFinishPage
XPStyle on

Var DetectDlg
Var FinishDlg
Var BpxSquirrelInstallLocation
Var BpxSquirrelInstallVersion
Var BpxSquirrelUninstaller
Var CheckboxUninstall
Var CheckboxLaunchOnExit
Var CheckboxAddToPath
Var LaunchOnExit
Var AddToPath
Var UninstallBpxSquirrelInstall
Var BackButton
Var NextButton

Page custom detectOldBpxVersion detectOldBpxVersionPageLeave
Page custom finish finishLeave

; Add a page offering to uninstall an older build installed into the bpx-beacon-client dir
Function detectOldBpxVersion
  ; Check the registry for old bpx-beacon-client installer keys
  ReadRegStr $BpxSquirrelInstallLocation HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\bpx-beacon-client" "InstallLocation"
  ReadRegStr $BpxSquirrelInstallVersion HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\bpx-beacon-client" "DisplayVersion"
  ReadRegStr $BpxSquirrelUninstaller HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\bpx-beacon-client" "QuietUninstallString"

  StrCpy $UninstallBpxSquirrelInstall ${BST_UNCHECKED} ; Initialize to unchecked so that a silent install skips uninstalling

  ; If registry keys aren't found, skip (Abort) this page and move forward
  ${If} BpxSquirrelInstallVersion == error
  ${OrIf} BpxSquirrelInstallLocation == error
  ${OrIf} $BpxSquirrelUninstaller == error
  ${OrIf} $BpxSquirrelInstallVersion == ""
  ${OrIf} $BpxSquirrelInstallLocation == ""
  ${OrIf} $BpxSquirrelUninstaller == ""
  ${OrIf} ${Silent}
    Abort
  ${EndIf}

  ; Check the uninstall checkbox by default
  StrCpy $UninstallBpxSquirrelInstall ${BST_CHECKED}

  ; Magic create dialog incantation
  nsDialogs::Create 1018
  Pop $DetectDlg

  ${If} $DetectDlg == error
    Abort
  ${EndIf}

  !insertmacro MUI_HEADER_TEXT "Uninstall Old Version" "Would you like to uninstall the old version of BPX Beacon Client?"

  ${NSD_CreateLabel} 0 35 100% 12u "Found BPX Beacon Client $BpxSquirrelInstallVersion installed in an old location:"
  ${NSD_CreateLabel} 12 57 100% 12u "$BpxSquirrelInstallLocation"

  ${NSD_CreateCheckBox} 12 81 100% 12u "Uninstall BPX Beacon Client $BpxSquirrelInstallVersion"
  Pop $CheckboxUninstall
  ${NSD_SetState} $CheckboxUninstall $UninstallBpxSquirrelInstall
  ${NSD_OnClick} $CheckboxUninstall SetUninstall

  nsDialogs::Show

FunctionEnd

Function SetUninstall
  ; Set UninstallBpxSquirrelInstall accordingly
  ${NSD_GetState} $CheckboxUninstall $UninstallBpxSquirrelInstall
FunctionEnd

Function detectOldBpxVersionPageLeave
  ${If} $UninstallBpxSquirrelInstall == 1
    ; This could be improved... Experiments with adding an indeterminate progress bar (PBM_SETMARQUEE)
    ; were unsatisfactory.
    ExecWait $BpxSquirrelUninstaller ; Blocks until complete (doesn't take long though)
  ${EndIf}
FunctionEnd

Function finish

  ; Magic create dialog incantation
  nsDialogs::Create 1018
  Pop $FinishDlg

  ${If} $FinishDlg == error
    Abort
  ${EndIf}

  ${NSD_CreateCheckbox} 0 40% 100% 10% "Launch Beacon Client"
  Pop $CheckboxLaunchOnExit
  ${NSD_SetState} $CheckboxLaunchOnExit ${BST_CHECKED}
  ${NSD_OnClick} $CheckboxLaunchOnExit SetLaunchOnExit
  StrCpy $LaunchOnExit 1
  
  ${NSD_CreateLabel} 0 65% 100% 10% "Advanced Options:"
  ${NSD_CreateCheckbox} 5% 75% 100% 10% "Add BPX Command Line executable to PATH"
  Pop $CheckboxAddToPath
  ${NSD_SetState} $CheckboxAddToPath ${BST_CHECKED}
  ${NSD_OnClick} $CheckboxAddToPath SetAddToPath

  GetDlgItem $NextButton $HWNDPARENT 1 ; 1 = Next button
  GetDlgItem $BackButton $HWNDPARENT 3 ; 3 = Back button

  ${NSD_CreateLabel} 0 35 100% 12u "BPX has been installed successfully!"
  EnableWindow $BackButton 0 ; Disable the Back button
  SendMessage $NextButton ${WM_SETTEXT} 0 "STR:Finish" ; Button title is "Close" by default. Update it here.

  nsDialogs::Show

FunctionEnd

Function SetLaunchOnExit
  ; Set LaunchOnExit accordingly
  ${NSD_GetState} $CheckboxLaunchOnExit $LaunchOnExit
FunctionEnd

Function SetAddToPath
  ; Set AddToPath accordingly
  ${NSD_GetState} $CheckboxAddTopath $AddToPath
FunctionEnd

; Copied from electron-builder NSIS templates
Function StartApp
  ${if} ${isUpdated}
    StrCpy $1 "--updated"
  ${else}
    StrCpy $1 ""
  ${endif}
  ${StdUtils.ExecShellAsUser} $0 "$launchLink" "open" "$1"
FunctionEnd

Function UpdatePath
  ; Parameters: $0 - "all" for all users, "CurrentUser" for the current user
  Exch $0
  Push $1
  Push $2
  Push $3

  Var /GLOBAL CurrentPath
  Var /GLOBAL UpdatedPath
  Var /GLOBAL PathAlreadyIncluded
  Var /GLOBAL CLIPath

  ; Determine the registry key and root key based on the scope
  ${If} $0 == "all"
    ReadRegStr $CurrentPath HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path"
  ${Else}
    ReadRegStr $CurrentPath HKCU "Environment" "Path"
  ${EndIf}
  
  ;${If} ${Errors}
  ;  Abort
  ;${EndIf}

  StrCpy $CLIPath "$INSTDIR\resources\app.asar.unpacked\daemon"

  ; Check if the directory is already in PATH
  ${StrContains} $PathAlreadyIncluded $CLIPath $CurrentPath
  ${If} $PathAlreadyIncluded == ""
    StrCpy $UpdatedPath "$CurrentPath;$CLIPath"
    ${If} $0 == "all"
      WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path" $UpdatedPath
      System::Call "kernel32::SetEnvironmentVariable(t'Path',t'$UpdatedPath')"
    ${Else}
      WriteRegExpandStr HKCU "Environment" "Path" $UpdatedPath
    ${EndIf}

    SendMessage ${HWND_BROADCAST} ${WM_SETTINGCHANGE} 0 "STR:Environment" /TIMEOUT=3000
  ${EndIf}

  Pop $3
  Pop $2
  Pop $1
  Pop $0
FunctionEnd

Function finishLeave
  ; Update PATH
  ${If} $AddToPath == 1
    Push $installMode 
    Call UpdatePath
  ${EndIf}

  ; Launch the app at exit
  ${If} $LaunchOnExit == 1
    Call StartApp
  ${EndIf}
FunctionEnd

; Section
; SectionEnd
!macroend
