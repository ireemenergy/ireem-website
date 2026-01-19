# Script to convert Sanity JSON export to CSV
$jsonPath = "projects-export.json"
$csvPath = "projects-database.csv"

# Read and parse JSON
$content = Get-Content $jsonPath -Raw
$json = $content | ConvertFrom-Json
$projects = $json.result

# Create CSV content
$csvLines = @()
$csvLines += "No,ID,Title (ID),Title (EN),Slug,Short Description (ID),Short Description (EN),Donor (ID),Donor (EN),Status,Year Start,Year End,Programs,Activity Types"

$counter = 1
foreach ($p in $projects) {
    $titleId = if ($p.title.id) { $p.title.id -replace '"', '""' -replace ',', ' ' } else { "" }
    $titleEn = if ($p.title.en) { $p.title.en -replace '"', '""' -replace ',', ' ' } else { "" }
    $descId = if ($p.shortDescription.id) { $p.shortDescription.id -replace '"', '""' -replace ',', ' ' } else { "" }
    $descEn = if ($p.shortDescription.en) { $p.shortDescription.en -replace '"', '""' -replace ',', ' ' } else { "" }
    $donorId = if ($p.donor.id) { $p.donor.id -replace '"', '""' -replace ',', ' ' } else { "" }
    $donorEn = if ($p.donor.en) { $p.donor.en -replace '"', '""' -replace ',', ' ' } else { "" }
    $programs = if ($p.programs) { ($p.programs -join "; ") } else { "" }
    $activities = if ($p.activityTypes) { ($p.activityTypes -join "; ") } else { "" }
    $yearStart = if ($p.yearStart) { $p.yearStart } else { "" }
    $yearEnd = if ($p.yearEnd) { $p.yearEnd } else { "" }
    
    $line = "$counter,""$($p._id)"",""$titleId"",""$titleEn"",""$($p.slug)"",""$descId"",""$descEn"",""$donorId"",""$donorEn"",$($p.status),$yearStart,$yearEnd,""$programs"",""$activities"""
    $csvLines += $line
    $counter++
}

$csvLines | Out-File -FilePath $csvPath -Encoding UTF8
Write-Host "Exported $($projects.Count) projects to $csvPath"
