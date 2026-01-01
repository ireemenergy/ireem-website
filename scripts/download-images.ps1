# Script to download all images from IREEM articles
# This will download images from v2.ireem.id to local storage

$baseDir = "c:\- IREEM\WEBSITE\IREEM Website\images\berita"
$dataDir = "c:\- IREEM\WEBSITE\IREEM Website\berita\data"

# Create base directory if not exists
New-Item -ItemType Directory -Force -Path $baseDir | Out-Null

# Get all JSON files except articles-index.json
$jsonFiles = Get-ChildItem -Path $dataDir -Filter "*.json" | Where-Object { $_.Name -ne "articles-index.json" }

foreach ($jsonFile in $jsonFiles) {
    Write-Host "`n=== Processing: $($jsonFile.Name) ===" -ForegroundColor Cyan
    
    # Read JSON content
    $json = Get-Content -Path $jsonFile.FullName -Raw | ConvertFrom-Json
    
    # Create article folder
    $articleSlug = $json.slug
    $articleDir = Join-Path $baseDir $articleSlug
    New-Item -ItemType Directory -Force -Path $articleDir | Out-Null
    
    $imageCount = 0
    $downloadedImages = @{}
    
    # Download banner image
    if ($json.banner -and $json.banner.image) {
        $bannerUrl = $json.banner.image
        if ($bannerUrl -match "v2\.ireem\.id" -or $bannerUrl -match "ireem\.id") {
            $fileName = "banner" + [System.IO.Path]::GetExtension([uri]::UnescapeDataString($bannerUrl.Split('/')[-1]))
            $localPath = Join-Path $articleDir $fileName
            
            try {
                Write-Host "  Downloading banner: $fileName" -ForegroundColor Yellow
                Invoke-WebRequest -Uri $bannerUrl -OutFile $localPath -UseBasicParsing
                $downloadedImages[$bannerUrl] = "../images/berita/$articleSlug/$fileName"
                $imageCount++
            } catch {
                Write-Host "  ERROR downloading banner: $_" -ForegroundColor Red
            }
        }
    }
    
    # Find all image URLs in content
    $content = $json.content
    $regex = 'https?://[^"''<>\s]+(?:storage/posts|uploads)[^"''<>\s]*\.(?:jpg|jpeg|png|gif|webp|JPG|JPEG|PNG)'
    $matches = [regex]::Matches($content, $regex)
    
    $inlineIndex = 1
    foreach ($match in $matches) {
        $imageUrl = $match.Value
        if (-not $downloadedImages.ContainsKey($imageUrl)) {
            $originalName = [uri]::UnescapeDataString($imageUrl.Split('/')[-1])
            $extension = [System.IO.Path]::GetExtension($originalName)
            $fileName = "inline-$inlineIndex$extension"
            $localPath = Join-Path $articleDir $fileName
            
            try {
                Write-Host "  Downloading inline-$inlineIndex`: $originalName" -ForegroundColor Yellow
                Invoke-WebRequest -Uri $imageUrl -OutFile $localPath -UseBasicParsing
                $downloadedImages[$imageUrl] = "../images/berita/$articleSlug/$fileName"
                $imageCount++
                $inlineIndex++
            } catch {
                Write-Host "  ERROR downloading $originalName`: $_" -ForegroundColor Red
            }
        }
    }
    
    Write-Host "  Downloaded $imageCount images for $articleSlug" -ForegroundColor Green
    
    # Update JSON with local paths
    if ($downloadedImages.Count -gt 0) {
        $jsonContent = Get-Content -Path $jsonFile.FullName -Raw
        
        foreach ($url in $downloadedImages.Keys) {
            $localUrl = $downloadedImages[$url]
            $jsonContent = $jsonContent -replace [regex]::Escape($url), $localUrl
        }
        
        Set-Content -Path $jsonFile.FullName -Value $jsonContent -Encoding UTF8
        Write-Host "  Updated JSON with local paths" -ForegroundColor Green
    }
}

Write-Host "`n=== DOWNLOAD COMPLETE ===" -ForegroundColor Cyan
Write-Host "All images have been downloaded to: $baseDir" -ForegroundColor Green
