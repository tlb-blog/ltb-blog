$ErrorActionPreference = 'Stop'
$root = Join-Path $PSScriptRoot '..' | Resolve-Path
$dist = Join-Path $root 'docs\.vuepress\dist'
Write-Output "Patching HTML files under: $dist"
$files = Get-ChildItem -Path $dist -Recurse -Filter '*.html' -File
foreach ($f in $files) {
    $path = $f.FullName
    $text = Get-Content -Raw -LiteralPath $path -Encoding UTF8
    
    # Basic asset paths
    $new = $text -replace 'src="/avatar.svg"','src="/ltb-blog/avatar.svg"'
    $new = $new -replace 'src="/logo-big.png"','src="/ltb-blog/logo-big.png"'
    $new = $new -replace 'src="/logo.png"','src="/ltb-blog/logo.png"'
    $new = $new -replace 'href="/rss.xml"','href="/ltb-blog/rss.xml"'
    $new = $new -replace 'href="/tag/"','href="/ltb-blog/tag/"'
    
    # Image directory paths - src attributes
    $new = $new -replace 'src="/nba_images/','src="/ltb-blog/nba_images/'
    $new = $new -replace 'src="/article_images/','src="/ltb-blog/article_images/'
    $new = $new -replace 'src="/ai/','src="/ltb-blog/ai/'
    $new = $new -replace 'src="/health/','src="/ltb-blog/health/'
    
    # Content attribute paths (for meta tags)
    $new = $new -replace 'content="/ai/','content="/ltb-blog/ai/'
    $new = $new -replace 'content="/health/','content="/ltb-blog/health/'
    $new = $new -replace 'content="/nba_images/','content="/ltb-blog/nba_images/'
    $new = $new -replace 'content="/article_images/','content="/ltb-blog/article_images/'
    
    # CSS background-image paths in style attributes
    $new = $new -replace 'background-image:url\("/ai/','background-image:url("/ltb-blog/ai/'
    $new = $new -replace 'background-image:url\("/health/','background-image:url("/ltb-blog/health/'
    $new = $new -replace 'background-image:url\("/article_images/','background-image:url("/ltb-blog/article_images/'
    $new = $new -replace 'background-image:url\("/nba_images/','background-image:url("/ltb-blog/nba_images/'
    
    # Additional patterns for thumbnails and images in JSON-LD and meta data
    $new = $new -replace '"url":"/ai/','"url":"/ltb-blog/ai/'
    $new = $new -replace '"url":"/health/','"url":"/ltb-blog/health/'
    $new = $new -replace '"url":"/article_images/','"url":"/ltb-blog/article_images/'
    $new = $new -replace '"url":"/nba_images/','"url":"/ltb-blog/nba_images/'
    
    # Property and href attributes
    $new = $new -replace 'property="og:image" content="/','property="og:image" content="/ltb-blog/'
    $new = $new -replace 'name="twitter:image" content="/','name="twitter:image" content="/ltb-blog/'
    $new = $new -replace 'href="/nba_images/','href="/ltb-blog/nba_images/'
    $new = $new -replace 'href="/article_images/','href="/ltb-blog/article_images/'
    $new = $new -replace 'href="/ai/','href="/ltb-blog/ai/'
    $new = $new -replace 'href="/health/','href="/ltb-blog/health/'
    
    # Fix duplicate base paths
    $new = $new -replace '/ltb-blog/ltb-blog','/ltb-blog'
    
    if ($new -ne $text) {
        Set-Content -LiteralPath $path -Value $new -Encoding UTF8
        Write-Output "Patched: $path"
    }
}
Write-Output "Done."