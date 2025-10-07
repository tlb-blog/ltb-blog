param(
    [Parameter(Mandatory = $true)]
    [string]$DistPath
)

$jsFile = Get-ChildItem -Path "$DistPath\assets\js" -Name "app.*.js" | Select-Object -First 1
if (-not $jsFile) {
    Write-Error "No app.*.js file found in $DistPath\assets\js"
    exit 1
}

$jsPath = Join-Path "$DistPath\assets\js" $jsFile
$jsContent = Get-Content $jsPath -Raw -Encoding UTF8

# Extract individual frontmatter objects that contain both path and image
$frontmatterPattern = 'frontmatter:\{[^}]*title:"([^"]*)"[^}]*\}[^}]*path:"([^"]*)"[^}]*headers:'
$frontmatterMatches = [regex]::Matches($jsContent, $frontmatterPattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)

Write-Host "Found $($frontmatterMatches.Count) frontmatter objects"

# Create a hash table to store path -> image mappings
$imageMappings = @{}

# Define manual mappings based on what we know
$imageMappings["/2025/10/06/article-hidden-fatigue-recovery/"] = "/ltb-blog/article_images/health/hidden_fatigue_thumbnail.png"
$imageMappings["/2025/10/04/article-quality-sleep/"] = "/ltb-blog/article_images/sleep_quality_thumbnail.png"
$imageMappings["/2025/10/04/article-stress-care/"] = "/ltb-blog/article_images/health/stress_care_thumbnail.png"
$imageMappings["/2025/10/04/article-fatigue-recovery/"] = "/ltb-blog/article_images/health/fatigue_recovery_thumbnail.png"
$imageMappings["/2025/10/04/autonomic-nervous-system-articles/"] = "/ltb-blog/article_images/health/autonomic_overview_thumbnail.png"
$imageMappings["/2025/10/06/kids-protein-need/"] = "/ltb-blog/article_images/health/kids-protein.png"
$imageMappings["/2025/10/02/protein-timing-guide/"] = "/ltb-blog/health/protein-timing-guide.png"

# NBA articles
$imageMappings["/2025/10/06/nba-20251006-al-horford-chooses-warriors/"] = "/ltb-blog/nba_images/al-horford-warriors.png"
$imageMappings["/2025/10/06/nba-20251006-bronny-james-debut-growing-pains/"] = "/ltb-blog/nba_images/Bronny-James-Debut-Growing-Pains.png"
$imageMappings["/2025/10/06/nba-20251006-kuminga-complex-future/"] = "/ltb-blog/nba_images/nba_20251006_Kuminga-Complex-Future1.png"
$imageMappings["/2025/10/06/nba-20251006-giannis-returns-to-bucks-after-covid/"] = "/ltb-blog/nba_images/Giannis-Returns-to-Bucks-After-COVID.png"
$imageMappings["/2025/10/06/nba-20251006-jokic-commits-to-nuggets-forever/"] = "/ltb-blog/nba_images/Jokic-Commits-to-Nuggets-Forever.png"

# AI articles
$imageMappings["/2025/10/06/imagefx-vs-ai-imagegen-best/"] = "/ltb-blog/ai/ImageFX-vs-AI-ImageGen-Best.png"
$imageMappings["/2025/10/02/ai-security-ethics/"] = "/ltb-blog/ai/ai-security-ethics.png"
$imageMappings["/2025/10/02/ai-agents-future/"] = "/ltb-blog/ai/ai-agents-future.png"
$imageMappings["/2025/10/02/llm-implementation-guide/"] = "/ltb-blog/ai/llm-implementation-guide.png"
$imageMappings["/2025/10/02/image-generation-ai/"] = "/ltb-blog/ai/image-generation-ai.png"
$imageMappings["/2025/10/02/ai-productivity-tools/"] = "/ltb-blog/ai/ai-productivity-tools.png"
$imageMappings["/2025/10/02/chatbots-guide/"] = "/ltb-blog/ai/chatbots-guide.png"
$imageMappings["/2025/10/02/ai-image-generation-services/"] = "/ltb-blog/ai/ai-image-generation-services.png"
$imageMappings["/2025/10/03/google-imagefx-guide/"] = "/ltb-blog/ai/google-imagefx-guide.png"

Write-Host "Manual mappings created: $($imageMappings.Count)"

# Process HTML files
$htmlFiles = Get-ChildItem -Path $DistPath -Filter "*.html" -Recurse
$patchedCount = 0

foreach ($htmlFile in $htmlFiles) {
    $htmlContent = Get-Content $htmlFile.FullName -Raw -Encoding UTF8
    $originalContent = $htmlContent
    
    # Find post-card links with empty background-image divs
    $postCardPattern = '<a href="([^"]*)"[^>]*class="[^"]*post-card[^"]*".*?<div class="v-image__image[^"]*"[^>]*style="([^"]*)"[^>]*></div>'
    $postCardMatches = [regex]::Matches($htmlContent, $postCardPattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    
    foreach ($cardMatch in $postCardMatches) {
        $cardHref = $cardMatch.Groups[1].Value
        $currentStyle = $cardMatch.Groups[2].Value
        
        # Remove /ltb-blog prefix from href to match our mapping keys
        $cleanPath = $cardHref -replace '^/ltb-blog', ''
        
        if ($imageMappings.ContainsKey($cleanPath)) {
            $imagePath = $imageMappings[$cleanPath]
            
            # Only update if style doesn't already contain background-image:url(
            if (-not $currentStyle.Contains("background-image:url(")) {
                $newStyle = "background-image:url(`"$imagePath`");$currentStyle"
                $htmlContent = $htmlContent.Replace($cardMatch.Value, $cardMatch.Value.Replace($currentStyle, $newStyle))
                Write-Host "Fixed thumbnail for: $cleanPath -> $imagePath"
                $patchedCount++
            }
        }
    }
    
    # Save the updated content
    if ($htmlContent -ne $originalContent) {
        Set-Content -Path $htmlFile.FullName -Value $htmlContent -Encoding UTF8
    }
}

Write-Host "Total thumbnails fixed: $patchedCount"