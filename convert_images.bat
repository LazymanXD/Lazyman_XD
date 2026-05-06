@echo off
setlocal enabledelayedexpansion

set "CWEBP=libwebp\libwebp-1.3.2-windows-x64\bin\cwebp.exe"

if not exist "%CWEBP%" (
    echo cwebp not found
    exit /b 1
)

set CONVERTED=0
set FAILED=0

for %%f in (*.jpg *.jpeg *.png) do (
    set "OUT=%%~nf.webp"
    if not exist "!OUT!" (
        "%CWEBP%" -q 85 -mt "%%f" -o "!OUT!"
        if exist "!OUT!" (
            echo Converted: %%f -> !OUT!
            set /a CONVERTED+=1
        ) else (
            echo Failed: %%f
            set /a FAILED+=1
        )
    ) else (
        echo Skipping: %%f - already converted
    )
)

echo.
echo Done! Converted: %CONVERTED%, Failed: %FAILED%
