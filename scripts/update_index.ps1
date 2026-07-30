$content = Get-Content 'index.html' -Raw

# Replace style block with link
$pattern1 = '(?s)<style>.*?</style>'
$replacement1 = '<link rel="stylesheet" href="styles.css">'
$content = [regex]::Replace($content, $pattern1, $replacement1)

# Replace script block with src (the last script block before </body></html>)
$pattern2 = '(?s)<script>.*?</script>\s*</body>\s*</html>'
$replacement2 = "<script src=`"script.js`"></script>`n</body>`n</html>"
$content = [regex]::Replace($content, $pattern2, $replacement2)

$content | Out-File 'index.html' -Encoding utf8
Write-Host 'Updated index.html'
