# Fix incorrect a-blog paths to ltb-blog
param(
    [Parameter(Mandatory=$true)]
    [string]$DocsPath
)

Write-Host "Fixing a-blog to ltb-blog in: $DocsPath" -ForegroundColor Green

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
    
    # Replace /a-blog/ with /ltb-blog/
    $content = $content -replace '/a-blog/', '/ltb-blog/'
    
    # Fix double paths like /ltb-blog/a-blog/ → /ltb-blog/
    $content = $content -replace '/ltb-blog/a-blog/', '/ltb-blog/'
    
    if ($content -ne $originalContent) {
        # Write with UTF8 BOM to preserve Japanese characters
        $utf8BOM = New-Object System.Text.UTF8Encoding $true
        [System.IO.File]::WriteAllText($file.FullName, $content, $utf8BOM)
        $fixedCount++
        Write-Host "  → Fixed paths" -ForegroundColor Green
    } else {
        Write-Host "  → No changes needed" -ForegroundColor Gray
    }
}

Write-Host "`nFixed $fixedCount files" -ForegroundColor Cyan
Write-Host "All paths now use /ltb-blog/" -ForegroundColor Green