# IREEM Website - Data Files Guide

This folder contains JSON data files that power dynamic content on the IREEM website. These files can be edited by anyone without technical knowledge.

## How to Edit

1. Open the JSON file you want to edit in any text editor (Notepad, VS Code, etc.)
2. Find the content you want to change
3. Make your edits (keep the format exactly as shown)
4. Save the file
5. Refresh the website to see changes

## File Overview

| File | Purpose | Update Frequency |
|------|---------|-----------------|
| `impact-metrics.json` | Impact numbers on Home and Impact pages | Yearly |
| `projects.json` | Project listings and gallery | Quarterly |
| `publications.json` | Publication library downloads | Monthly |
| `news.json` | News and updates listing | Weekly/Monthly |
| `partners.json` | Partner logo display | Yearly |

---

## impact-metrics.json

Contains the impact statistics displayed on the homepage and Impact page.

**Format:**
```json
{
  "metrics": [
    {
      "value": "200+",
      "label": "Certified energy professionals trained"
    }
  ]
}
```

**Tips:**
- `value` can include symbols like "+", "USD", "M" for millions
- Keep `label` short and clear (under 50 characters)

---

## projects.json

Contains all project information displayed in the project gallery.

**Format:**
```json
{
  "projects": [
    {
      "id": "unique-project-id",
      "title": "Project Title Here",
      "description": "Brief description of the project and outcomes.",
      "donor": "Donor Name",
      "year": "2023-2024",
      "tags": ["Tag1", "Tag2"],
      "image": "/images/projects/project-name.jpg",
      "pillar": "energy-transition"
    }
  ]
}
```

**Pillar values:**
- `energy-transition`
- `natural-resources`
- `environmental-management`

---

## publications.json

Contains all publications in the download library.

**Format:**
```json
{
  "publications": [
    {
      "id": "unique-pub-id",
      "title": "Publication Title",
      "description": "Brief description",
      "type": "Guidebook",
      "year": "2023",
      "pillar": "Energy Transition",
      "downloadUrl": "/files/publication.pdf"
    }
  ]
}
```

**Type values:**
- Guidebook
- Policy Brief
- Technical Report
- Training Manual
- Research Report

---

## news.json

Contains news items for the News & Updates page.

**Format:**
```json
{
  "news": [
    {
      "id": "news-2023-12-title",
      "title": "News Headline Here",
      "excerpt": "Brief summary of the news item (1-2 sentences).",
      "date": "December 2023",
      "category": "Training",
      "url": "/news/article-name.html"
    }
  ]
}
```

**Categories:**
- Training
- Project Update
- Partnership
- Publication
- Event

---

## partners.json

Contains partner organization logos.

**Format:**
```json
{
  "partners": [
    {
      "name": "Partner Organization Name",
      "logo": "/images/partners/partner-logo.png",
      "type": "donor",
      "url": "https://partner-website.org"
    }
  ]
}
```

**Type values:**
- `donor` - Funding partners
- `government` - Government agencies
- `academic` - Universities and research institutions
- `private` - Private sector partners

---

## Important Notes

1. **Keep the JSON structure intact** - Don't delete commas, brackets, or quotes
2. **Test after editing** - Open the website and check the section you edited
3. **Backup before major changes** - Copy the file before making large edits
4. **Image paths** - Use forward slashes (/) not backslashes (\)

## Need Help?

If you encounter errors after editing, check:
- Every string has opening AND closing quotes: `"text"`
- Every object has opening AND closing braces: `{ }`
- Items in arrays are separated by commas, but no comma after the last item
- Use an online JSON validator: https://jsonlint.com/
