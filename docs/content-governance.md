# IREEM Website Content Governance Guide

## Overview
This document provides guidelines for maintaining the IREEM website, including content update procedures, file naming conventions, and responsibilities.

## Page Classification

| Type | Update Frequency | Examples |
|------|-----------------|----------|
| **Static** | Annually | About pages, Team, Core Values |
| **Semi-Dynamic** | Quarterly | Projects, Impact metrics, Partners |
| **Dynamic** | Monthly/As needed | News, Publications, Events |

## Content Update Responsibilities

| Content Type | Primary Owner | Reviewer |
|--------------|---------------|----------|
| Core messaging | Executive Director | Communications |
| Projects & Impact | Program Managers | M&E Team |
| Publications | Knowledge Team | Program Manager |
| News & Updates | Communications | Executive Director |

## File Naming Conventions

### HTML Pages
- Use lowercase with hyphens: `energy-transition.html`
- Folder structure mirrors navigation: `/about/`, `/what-we-do/`, etc.

### Images
- Format: `[category]-[description]-[size].jpg`
- Examples: `team-john-smith-400.jpg`, `project-mrv-platform-800.jpg`
- Preferred formats: `.jpg` for photos, `.png` for logos/graphics, `.svg` for icons

### Data Files (JSON)
- Located in `/data/` folder
- Files: `impact-metrics.json`, `projects.json`, `publications.json`, `news.json`, `partners.json`
- See `/data/README.md` for editing instructions

## Adding New Content

### New News Item
1. Open `/data/news.json`
2. Add new entry at the TOP of the array
3. Follow existing format exactly
4. Test locally before deploying

### New Publication
1. Upload PDF to `/assets/publications/`
2. Add entry to `/data/publications.json`
3. Include: title, description, type, year, pillar, download URL

### New Project
1. Add project image to `/images/projects/`
2. Add entry to `/data/projects.json`
3. Include all required fields

### New Page
1. Copy closest existing page as template
2. Update meta tags, title, breadcrumb
3. Update navigation active states
4. Add to sitemap.xml
5. Test all links

## Quality Checklist

Before deploying any content update:
- [ ] All links work correctly
- [ ] Images are optimized and load properly
- [ ] Meta descriptions are 150-160 characters
- [ ] Mobile responsive display verified
- [ ] Spelling and grammar checked
- [ ] JSON files validate (no syntax errors)

## Contact Form (Formspree)

The contact form uses Formspree for processing. To update the form:
1. Create account at formspree.io
2. Create new form and get form ID
3. Replace `YOUR_FORM_ID` in `/partner/contact.html`
4. Configure notification email in Formspree dashboard

## Backup Recommendations

- Weekly: Export `/data/` folder
- Before major changes: Full site backup
- Store backups in separate location
