@ -1,26 +0,0 @@
@echo off
setlocal EnableDelayedExpansion

set "CWEBP=%~dp0libwebp\libwebp-1.3.2-windows-x64\bin\cwebp.exe"
set CONVERTED=0
set FAILED=0

for %%f in ("%~dp0*.jpg" "%~dp0*.jpeg" "%~dp0*.png") do (
    set "OUT=%%~dpnf.webp"
    if not exist "!OUT!" (
        "%CWEBP%" -q 85 -mt "%%f" -o "!OUT!"
        if exist "!OUT!" (
            echo OK: %%~nf
            set /a CONVERTED+=1
        ) else (
            echo FAILED: %%~nf
            set /a FAILED+=1
        )
    ) else (
        echo SKIP: %%~nf
    )
)

echo.
echo Converted: %CONVERTED%, Failed: %FAILED%
pause