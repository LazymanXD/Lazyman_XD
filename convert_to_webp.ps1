@ -1,70 +0,0 @@
# Image to WebP Conversion Script
# Requires: cwebp (libwebp) or ImageMagick installed

$ErrorActionPreference = "Continue"

# Check for cwebp
$cwebp = Get-Command cwebp -ErrorAction SilentlyContinue
$magick = Get-Command magick -ErrorAction SilentlyContinue

if (-not $cwebp -and -not $magick) {
    Write-Host "ERROR: No image conversion tool found!" -ForegroundColor Red
    Write-Host "Please install one of the following:" -ForegroundColor Yellow
    Write-Host "  1. libwebp (cwebp command) - https://developers.google.com/speed/webp/download" -ForegroundColor Cyan
    Write-Host "  2. ImageMagick (magick command) - https://imagemagick.org" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or use an online converter like:" -ForegroundColor Yellow
    Write-Host "  - https://squoosh.app (drag and drop, very easy)" -ForegroundColor Cyan
    Write-Host "  - https://convertio.co/webp-converter/" -ForegroundColor Cyan
    exit 1
}

# Get all image files
$images = Get-ChildItem -Path . -Include @("*.jpg", "*.jpeg", "*.png") -Exclude @("*.webp")
$converted = 0
$failed = 0

foreach ($img in $images) {
    $webpName = [System.IO.Path]::ChangeExtension($img.Name, ".webp")
    
    # Skip if WebP already exists
    if (Test-Path $webpName) {
        Write-Host "Skipping $($img.Name) - $webpName already exists" -ForegroundColor Gray
        continue
    }
    
    try {
        if ($cwebp) {
            # Use cwebp (libwebp) -q 85 for good quality
            & cwebp -q 85 -mt $img.Name -o $webpName 2>$null
        } elseif ($magick) {
            # Use ImageMagick
            & magick $img.Name -quality 85 $webpName 2>$null
        }
        
        if (Test-Path $webpName) {
            $originalSize = $img.Length
            $webpSize = (Get-Item $webpName).Length
            $saved = $originalSize - $webpSize
            $percent = [math]::Round(($saved / $originalSize) * 100, 1)
            
            Write-Host "Converted: $($img.Name) -> $webpName" -ForegroundColor Green -NoNewline
            Write-Host " (Saved $([math]::Round($saved/1KB, 1)) KB, $percent%)" -ForegroundColor Cyan
            $converted++
        } else {
            Write-Host "Failed to convert: $($img.Name)" -ForegroundColor Red
            $failed++
        }
    } catch {
        Write-Host "Error converting $($img.Name): $_" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "Conversion complete: $converted converted, $failed failed" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Green
Write-Host "1. Run 'update_references.ps1' to update HTML/CSS/JS to use .webp files" -ForegroundColor Cyan
Write-Host "2. Test your website in browser" -ForegroundColor Cyan
Write-Host "3. Delete original .jpg/.png files only if everything works" -ForegroundColor Cyan