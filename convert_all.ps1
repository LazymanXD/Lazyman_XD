$cwebp = Join-Path $PSScriptRoot "libwebp\libwebp-1.3.2-windows-x64\bin\cwebp.exe"
$images = Get-ChildItem -Path $PSScriptRoot -File | Where-Object { $_.Extension -match "^\.(jpg|jpeg|png)$" }

Write-Host "Found $($images.Count) images to convert" -ForegroundColor Yellow

foreach ($img in $images) {
    $out = [System.IO.Path]::ChangeExtension($img.FullName, ".webp")
    $relName = $img.Name
    
    Write-Host "Converting: $relName" -NoNewline
    
    Start-Process -FilePath $cwebp -ArgumentList "-q", "85", "-mt", $img.FullName, "-o", $out -Wait -WindowStyle Hidden
    
    if ((Test-Path $out) -and (Get-Item $out).Length -gt 100) {
        $orig = [math]::Round($img.Length / 1KB, 1)
        $new = [math]::Round((Get-Item $out).Length / 1KB, 1)
        $saved = [math]::Round((($img.Length - (Get-Item $out).Length) / $img.Length) * 100, 1)
        Write-Host " -> OK (${orig}KB -> ${new}KB, -${saved}%)" -ForegroundColor Green
    } else {
        Write-Host " -> FAILED" -ForegroundColor Red
    }
}

Write-Host "`nDone!" -ForegroundColor Yellow
