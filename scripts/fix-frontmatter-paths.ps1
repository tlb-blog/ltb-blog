# Fix frontmatter image paths by adding base path for VuePress SSR
param(
    [Parameter(Mandatory=$true)]
    [string]$DocsPath
)

$basePath = "/ltb-blog"
Write-Host "Fixing frontmatter image paths in: $DocsPath" -ForegroundColor Green

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
    
    # Fix frontmatter image paths that start with / but don't have base path
    # Pattern: image: "/ai/something.png" → image: "/ltb-blog/ai/something.png"
    $content = $content -replace '(image:\s*["`''])/(?!ltb-blog/)([^"`'']+)(["`''])', "`$1$basePath/`$2`$3"
    
    # Fix image paths without quotes: image: /ai/file.png → image: /ltb-blog/ai/file.png
    $content = $content -replace '(image:\s*)/(?!ltb-blog/)([^\s\r\n]+)', "`$1$basePath/`$2"
    
    # Fix thumbnail paths
    $content = $content -replace '(thumbnail:\s*["`''])/(?!ltb-blog/)([^"`'']+)(["`''])', "`$1$basePath/`$2`$3"
    $content = $content -replace '(thumbnail:\s*)/(?!ltb-blog/)([^\s\r\n]+)', "`$1$basePath/`$2"
    
    # Fix other image references in frontmatter
    $content = $content -replace '(cover_image:\s*["`''])/(?!ltb-blog/)([^"`'']+)(["`''])', "`$1$basePath/`$2`$3"
    $content = $content -replace '(featured_image:\s*["`''])/(?!ltb-blog/)([^"`'']+)(["`''])', "`$1$basePath/`$2`$3"
    
    if ($content -ne $originalContent) {
        # Write with UTF8 BOM to preserve Japanese characters
        $utf8BOM = New-Object System.Text.UTF8Encoding $true
        [System.IO.File]::WriteAllText($file.FullName, $content, $utf8BOM)
        $fixedCount++
        Write-Host "  → Fixed image paths" -ForegroundColor Green
    } else {
        Write-Host "  → No changes needed" -ForegroundColor Gray
    }
}

Write-Host "`nFixed $fixedCount files" -ForegroundColor Cyan
Write-Host "Frontmatter paths now include base path: $basePath" -ForegroundColor Green