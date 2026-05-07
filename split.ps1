$file = 'index.html'
$content = Get-Content $file -Raw

# Extract CSS
$styleStart = $content.IndexOf('<style>') + 7
$styleEnd = $content.IndexOf('</style>')
$css = $content.Substring($styleStart, $styleEnd - $styleStart)
$css | Out-File 'styles.css' -Encoding utf8
Write-Host "Created styles.css"

# Extract JS
$scriptStart = $content.LastIndexOf('<script>') + 8
$scriptEnd = $content.LastIndexOf('</script>')
$js = $content.Substring($scriptStart, $scriptEnd - $scriptStart)
$js | Out-File 'script.js' -Encoding utf8
Write-Host "Created script.js"