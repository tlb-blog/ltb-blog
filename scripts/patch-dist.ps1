# PowerShell script to patch path issues in VuePress build output
param(
    [string]$distPath = ""
)

$ErrorActionPreference = 'Stop'
$root = Join-Path $PSScriptRoot '..' | Resolve-Path

if ($distPath -eq "") {
    $dist = Join-Path $root 'docs\.vuepress\dist'
} else {
    $dist = Join-Path $root $distPath | Resolve-Path
}

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
    
    # Category and post page links
    $new = $new -replace 'href="/post/"','href="/ltb-blog/post/"'
    $new = $new -replace 'href="/post/ai/"','href="/ltb-blog/post/ai/"'
    $new = $new -replace 'href="/post/health/"','href="/ltb-blog/post/health/"'
    $new = $new -replace 'href="/post/nba/"','href="/ltb-blog/post/nba/"'
    
    # Navigation links in enhanceApp.js generated content
    $new = $new -replace 'href="/"','href="/ltb-blog/"'
    
    # Image directory paths - src attributes
    $new = $new -replace 'src="/nba_images/','src="/ltb-blog/nba_images/'
    $new = $new -replace 'src="/article_images/','src="/ltb-blog/article_images/'
    $new = $new -replace 'src="/ai/','src="/ltb-blog/ai/'
    $new = $new -replace 'src="/health/','src="/ltb-blog/health/'
    
    # Vue component v-img src attributes (for thumbnails)
    $new = $new -replace ':src="&quot;/ai/','src="/ltb-blog/ai/'
    $new = $new -replace ':src="&quot;/health/','src="/ltb-blog/health/'
    $new = $new -replace ':src="&quot;/article_images/','src="/ltb-blog/article_images/'
    $new = $new -replace ':src="&quot;/nba_images/','src="/ltb-blog/nba_images/'
    
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

# JavaScriptファイルのパッチ処理を追加
Write-Output "Patching JavaScript files under: $dist"
$jsFiles = Get-ChildItem -Path $dist -Recurse -Filter '*.js' -File
foreach ($f in $jsFiles) {
    $path = $f.FullName
    $text = Get-Content -Raw -LiteralPath $path -Encoding UTF8
    
    # JavaScriptファイル内のJSONデータの画像パスを修正
    $new = $text -replace 'image:"/ai/','image:"/ltb-blog/ai/'
    $new = $new -replace 'image:"/health/','image:"/ltb-blog/health/'
    $new = $new -replace 'image:"/article_images/','image:"/ltb-blog/article_images/'
    $new = $new -replace 'image:"/nba_images/','image:"/ltb-blog/nba_images/'
    
    # 各種JSON形式でのパス修正
    $new = $new -replace '"image":"/ai/','"image":"/ltb-blog/ai/'
    $new = $new -replace '"image":"/health/','"image":"/ltb-blog/health/'
    $new = $new -replace '"image":"/article_images/','"image":"/ltb-blog/article_images/'
    $new = $new -replace '"image":"/nba_images/','"image":"/ltb-blog/nba_images/'
    
    # シングルクォート版のJSON
    $new = $new -replace "'image':'/ai/","'image':'/ltb-blog/ai/"
    $new = $new -replace "'image':'/health/","'image':'/ltb-blog/health/"
    $new = $new -replace "'image':'/article_images/","'image':'/ltb-blog/article_images/"
    $new = $new -replace "'image':'/nba_images/","'image':'/ltb-blog/nba_images/"
    
    # og:image や twitter:image のcontent属性（JavaScript内）
    $new = $new -replace 'content:"/ai/','content:"/ltb-blog/ai/'
    $new = $new -replace 'content:"/health/','content:"/ltb-blog/health/'
    $new = $new -replace 'content:"/article_images/','content:"/ltb-blog/article_images/'
    $new = $new -replace 'content:"/nba_images/','content:"/ltb-blog/nba_images/'
    
    # プロパティキーに引用符がある場合
    $new = $new -replace '"content":"/ai/','"content":"/ltb-blog/ai/'
    $new = $new -replace '"content":"/health/','"content":"/ltb-blog/health/'
    $new = $new -replace '"content":"/article_images/','"content":"/ltb-blog/article_images/'
    $new = $new -replace '"content":"/nba_images/','"content":"/ltb-blog/nba_images/'
    
    # 重複パス修正
    $new = $new -replace '/ltb-blog/ltb-blog','/ltb-blog'
    
    if ($new -ne $text) {
        Set-Content -LiteralPath $path -Value $new -Encoding UTF8
        Write-Output "Patched JS: $path"
    }
}

Write-Output "Done."