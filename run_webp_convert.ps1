$cwebp = Join-Path $PSScriptRoot "libwebp\libwebp-1.3.2-windows-x64\bin\cwebp.exe"

if (-not (Test-Path $cwebp)) {
    Write-Host "cwebp not found at: $cwebp" -ForegroundColor Red
    exit 1
}

$images = Get-ChildItem -Path $PSScriptRoot -Include @("*.jpg", "*.jpeg", "*.png") -Exclude @("*.webp")
$converted = 0
$failed = 0

foreach ($img in $images) {
    $out = Join-Path $PSScriptRoot ($img.BaseName + ".webp")
    
    if (Test-Path $out) {
        Write-Host "Skipping $($img.Name) - already converted" -ForegroundColor Gray
        continue
    }
    
    try {
        & $cwebp -q 85 -mt $img.FullName -o $out 2>$null
        
        if (Test-Path $out) {
            $origSize = $img.Length
            $newSize = (Get-Item $out).Length
            $saved = $origSize - $newSize
            $percent = [math]::Round(($saved / $origSize) * 100, 1)
            Write-Host "Converted: $($img.Name)" -ForegroundColor Green -NoNewline
            Write-Host " (saved $percent%)" -ForegroundColor Cyan
            $converted++
        } else {
            Write-Host "Failed: $($img.Name)" -ForegroundColor Red
            $failed++
        }
    } catch {
        Write-Host "Error converting $($img.Name): $_" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "Done! Converted: $converted, Failed: $failed" -ForegroundColor Yellow
