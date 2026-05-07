$cwebp = Join-Path $PSScriptRoot "libwebp\libwebp-1.3.2-windows-x64\bin\cwebp.exe"
$images = Get-ChildItem -Path $PSScriptRoot -File | Where-Object { $_.Extension -match "^\.(jpg|jpeg|png)$" }

Write-Host "Found $($images.Count) images to convert" -ForegroundColor Yellow

foreach ($img in $images) {
    $out = [System.IO.Path]::ChangeExtension($img.FullName, ".webp")
    $relName = $img.Name
    
    Write-Host "Converting: $relName" -NoNewline
    
    # Use proper quoting for paths with spaces
    $arguments = @("-q", "85", "-mt", $img.FullName, "-o", $out)
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $cwebp
    $psi.Arguments = $arguments -join " "
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    
    $proc = [System.Diagnostics.Process]::Start($psi)
    $proc.WaitForExit()
    
    if ((Test-Path $out) -and (Get-Item $out).Length -gt 100) {
        $orig = [math]::Round($img.Length / 1KB, 1)
        $new = [math]::Round((Get-Item $out).Length / 1KB, 1)
        $saved = [math]::Round((($img.Length - (Get-Item $out).Length) / $img.Length) * 100, 1)
        Write-Host " -> OK (${orig}KB -> ${new}KB, -${saved}%)" -ForegroundColor Green
    } else {
        if (Test-Path $out) { Remove-Item $out -Force }
        Write-Host " -> FAILED (code: $($proc.ExitCode))" -ForegroundColor Red
    }
}

Write-Host "`nDone!" -ForegroundColor Yellow
