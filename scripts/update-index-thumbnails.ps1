# Script to update articles-index.json thumbnails to use local paths

$indexPath = "c:\- IREEM\WEBSITE\IREEM Website\berita\data\articles-index.json"
$imagesDir = "c:\- IREEM\WEBSITE\IREEM Website\images\berita"

# Read the index file
$indexContent = Get-Content -Path $indexPath -Raw
$index = $indexContent | ConvertFrom-Json

foreach ($article in $index.articles) {
    $slug = $article.slug
    $articleDir = Join-Path $imagesDir $slug
    
    # Check if article folder exists and has a banner
    if (Test-Path $articleDir) {
        $bannerFiles = Get-ChildItem -Path $articleDir -Filter "banner.*" -File
        if ($bannerFiles.Count -gt 0) {
            $bannerFile = $bannerFiles[0].Name
            $newPath = "../images/berita/$slug/$bannerFile"
            
            if ($article.thumbnail -ne $newPath) {
                Write-Host "Updating thumbnail for: $slug" -ForegroundColor Yellow
                Write-Host "  From: $($article.thumbnail)" -ForegroundColor Gray
                Write-Host "  To: $newPath" -ForegroundColor Green
                $article.thumbnail = $newPath
            }
        }
    }
}

# Save updated index
$index | ConvertTo-Json -Depth 10 | Set-Content -Path $indexPath -Encoding UTF8
Write-Host "`nIndex file updated successfully!" -ForegroundColor Cyan
