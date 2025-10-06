$ErrorActionPreference = 'Stop'
$root = Join-Path $PSScriptRoot '..' | Resolve-Path
$dist = Join-Path $root 'docs\.vuepress\dist'
Write-Output "Patching HTML files under: $dist"
$files = Get-ChildItem -Path $dist -Recurse -Filter '*.html' -File
foreach ($f in $files) {
    $path = $f.FullName
    $text = Get-Content -Raw -LiteralPath $path -Encoding UTF8
    $new = $text -replace 'src="/avatar.svg"','src="/ltb-blog/avatar.svg"'
    $new = $new -replace 'src="/logo-big.png"','src="/ltb-blog/logo-big.png"'
    $new = $new -replace 'src="/logo.png"','src="/ltb-blog/logo.png"'
    $new = $new -replace 'href="/rss.xml"','href="/ltb-blog/rss.xml"'
    $new = $new -replace 'href="/tag/"','href="/ltb-blog/tag/"'
    $new = $new -replace '/ltb-blog/ltb-blog','/ltb-blog'
    $new = $new -replace 'src="/nba_images/','src="/ltb-blog/nba_images/'
    $new = $new -replace 'src="/article_images/','src="/ltb-blog/article_images/'
    $new = $new -replace 'src="/ai/','src="/ltb-blog/ai/'
    $new = $new -replace 'src="/health/','src="/ltb-blog/health/'
    $new = $new -replace 'content="/ai/','content="/ltb-blog/ai/'
    $new = $new -replace 'content="/health/','content="/ltb-blog/health/'
    $new = $new -replace 'content="/nba_images/','content="/ltb-blog/nba_images/'
    $new = $new -replace 'content="/article_images/','content="/ltb-blog/article_images/'
    if ($new -ne $text) {
        Set-Content -LiteralPath $path -Value $new -Encoding UTF8
        Write-Output "Patched: $path"
    }
}
Write-Output "Done."