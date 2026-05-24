$basePath = 'c:\- IREEM\WEBSITE\IREEM Website'
$files = Get-ChildItem -Path $basePath -Filter '*.html' -Recurse

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $original = $content

    # Nav dropdown items
    $content = $content -replace 'data-i18n="nav\.energy">Energi</a>', 'data-i18n="nav.energy">Sistem Energi Berkelanjutan</a>'
    $content = $content -replace 'data-i18n="nav\.environment">Lingkungan</a>', 'data-i18n="nav.environment">Manajemen Lingkungan &amp; Aksi Iklim</a>'
    $content = $content -replace 'data-i18n="nav\.naturalResources">Sumber Daya Alam</a>', 'data-i18n="nav.naturalResources">Tata Kelola Sumber Daya Alam</a>'

    # Footer items  
    $content = $content -replace 'data-i18n="footer\.energyClimate">Energi', 'data-i18n="footer.energyClimate">Sistem Energi Berkelanjutan'
    $content = $content -replace 'data-i18n="footer\.environment">Lingkungan</a>', 'data-i18n="footer.environment">Manajemen Lingkungan &amp; Aksi Iklim</a>'
    $content = $content -replace 'data-i18n="footer\.naturalResources">Sumber\s*\r?\n?\s*Daya Alam</a>', 'data-i18n="footer.naturalResources">Tata Kelola Sumber Daya Alam</a>'
    $content = $content -replace 'data-i18n="footer\.naturalResources">Sumber Daya\s*\r?\n?\s*Alam</a>', 'data-i18n="footer.naturalResources">Tata Kelola Sumber Daya Alam</a>'
    $content = $content -replace 'data-i18n="footer\.naturalResources">Sumber Daya Alam</a>', 'data-i18n="footer.naturalResources">Tata Kelola Sumber Daya Alam</a>'

    # Program Nav (subnav on program pages)
    $content = $content -replace 'data-i18n="programNav\.energy">Energi</a>', 'data-i18n="programNav.energy">Sistem Energi Berkelanjutan</a>'
    $content = $content -replace 'data-i18n="programNav\.environment">Lingkungan</a>', 'data-i18n="programNav.environment">Manajemen Lingkungan &amp; Aksi Iklim</a>'
    $content = $content -replace 'data-i18n="programNav\.resources">Sumber Daya Alam</a>', 'data-i18n="programNav.resources">Tata Kelola Sumber Daya Alam</a>'

    # Related program titles
    $content = $content -replace 'data-i18n="related\.energy\.title">Energi</h4>', 'data-i18n="related.energy.title">Sistem Energi Berkelanjutan</h4>'
    $content = $content -replace 'data-i18n="related\.resources\.title">Sumber Daya Alam</h4>', 'data-i18n="related.resources.title">Tata Kelola Sumber Daya Alam</h4>'
    $content = $content -replace 'data-i18n="related\.environment\.title">Lingkungan</h4>', 'data-i18n="related.environment.title">Manajemen Lingkungan &amp; Aksi Iklim</h4>'

    # Program index page cards
    $content = $content -replace 'data-i18n="pillars\.energy\.title">Energi</h3>', 'data-i18n="pillars.energy.title">Sistem Energi Berkelanjutan</h3>'
    $content = $content -replace 'data-i18n="pillars\.energy\.title">Energi</h4>', 'data-i18n="pillars.energy.title">Sistem Energi Berkelanjutan</h4>'
    $content = $content -replace 'data-i18n="pillars\.environment\.title">Manajemen Lingkungan</h3>', 'data-i18n="pillars.environment.title">Manajemen Lingkungan &amp; Aksi Iklim</h3>'
    $content = $content -replace 'data-i18n="pillars\.environment\.title">Manajemen Lingkungan</h4>', 'data-i18n="pillars.environment.title">Manajemen Lingkungan &amp; Aksi Iklim</h4>'
    $content = $content -replace 'data-i18n="pillars\.resources\.title">Sumber Daya Alam</h3>', 'data-i18n="pillars.resources.title">Tata Kelola Sumber Daya Alam</h3>'
    $content = $content -replace 'data-i18n="pillars\.resources\.title">Sumber Daya Alam</h4>', 'data-i18n="pillars.resources.title">Tata Kelola Sumber Daya Alam</h4>'

    # GESI page - gender analysis items
    $content = $content -replace 'data-i18n="services\.gender\.item1">Energi</li>', 'data-i18n="services.gender.item1">Sistem Energi Berkelanjutan</li>'
    $content = $content -replace 'data-i18n="services\.gender\.item2">Lingkungan</li>', 'data-i18n="services.gender.item2">Manajemen Lingkungan &amp; Aksi Iklim</li>'
    $content = $content -replace 'data-i18n="services\.gender\.item3">Sumber daya alam</li>', 'data-i18n="services.gender.item3">Tata Kelola Sumber Daya Alam</li>'

    # Lingkungan hero
    $content = $content -replace 'data-i18n="hero\.title">Manajemen Lingkungan</h1>', 'data-i18n="hero.title">Manajemen Lingkungan &amp; Aksi Iklim</h1>'
    
    # Sumber Daya hero
    $content = $content -replace 'data-i18n="hero\.title">Sumber Daya Alam</h1>', 'data-i18n="hero.title">Tata Kelola Sumber Daya Alam</h1>'

    # Lingkungan page title
    $content = $content -replace '<title>Manajemen Lingkungan - Program IREEM</title>', '<title>Environmental Management &amp; Climate Action - Program IREEM</title>'
    $content = $content -replace '<title>Lingkungan - Program IREEM</title>', '<title>Environmental Management &amp; Climate Action - Program IREEM</title>'
    
    # Sumber Daya page title
    $content = $content -replace '<title>Sumber Daya Alam - Program IREEM</title>', '<title>Natural Resource Governance - Program IREEM</title>'

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content)
        Write-Host "Updated: $($file.FullName)"
    }
}
Write-Host 'Done!'
