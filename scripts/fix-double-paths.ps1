# Fix double ltb-blog paths to single ltb-blog
param(
    [Parameter(Mandatory=$true)]
    [string]$DocsPath
)

Write-Host "Fixing double ltb-blog paths in: $DocsPath" -ForegroundColor Green

# Get all markdown files
$mdFiles = Get-ChildItem -Path $DocsPath -Recurse -Filter "*.md" | Where-Object { 
    $_.FullName -notlike "*\.vuepress\*" -and 
    $_.FullName -notlike "*\dist\*" -and
    $_.FullName -notlike "*\node_modules\*"
}

$fixedCount = 0

foreach ($file in $mdFiles) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Yellow
    
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Fix double paths like /ltb-blog/ltb-blog/ → /ltb-blog/
    $content = $content -replace '/ltb-blog/ltb-blog/', '/ltb-blog/'
    
    if ($content -ne $originalContent) {
        # Write with UTF8 BOM to preserve Japanese characters
        $utf8BOM = New-Object System.Text.UTF8Encoding $true
        [System.IO.File]::WriteAllText($file.FullName, $content, $utf8BOM)
        $fixedCount++
        Write-Host "  → Fixed double paths" -ForegroundColor Green
    } else {
        Write-Host "  → No changes needed" -ForegroundColor Gray
    }
}

Write-Host "`nFixed $fixedCount files" -ForegroundColor Cyan
Write-Host "All paths now use single /ltb-blog/" -ForegroundColor Green