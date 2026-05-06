# Update image references to use WebP
$ErrorActionPreference = "Stop"

$files = @("index.html", "styles.css", "script.js")
$replacements = @(
    @{ From = '.jpg";'; To = '.webp";' },
    @{ From = '.jpg" '; To = '.webp" ' },
    @{ From = ".jpg'"; To = ".webp'" },
    @{ From = '.jpeg";'; To = '.webp";' },
    @{ From = '.jpeg" '; To = '.webp" ' },
    @{ From = ".jpeg'"; To = ".webp'" },
    @{ From = '.png";'; To = '.webp";' },
    @{ From = '.png" '; To = '.webp" ' },
    @{ From = ".png'"; To = ".webp'" }
)

foreach ($file in $files) {
    if (-not (Test-Path $file)) {
        Write-Host "Skipping $file - not found" -ForegroundColor Yellow
        continue
    }
    
    $content = Get-Content $file -Raw
    $originalContent = $content
    
    foreach ($rep in $replacements) {
        $content = $content.Replace($rep.From, $rep.To)
    }
    
    if ($content -ne $originalContent) {
        Set-Content $file $content -NoNewline -Encoding UTF8
        Write-Host "Updated $file" -ForegroundColor Green
    } else {
        Write-Host "No changes needed in $file" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "References updated! Test your website to make sure images load." -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANT: Keep original .jpg/.png files as fallback until you verify everything works!" -ForegroundColor Red
