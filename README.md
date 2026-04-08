# Job Application Tracker

live site: https://jmeegan2.github.io/job-application-tracker/

A React app for tracking job applications through the hiring pipeline, with automatic GitHub Gist backup.

## Features

- **7-column table**: Date, Company, Title, Link, Est Comp, Stage, Notes
- **Stage dropdown**: Applied, Interviewing, Rejected, Offer (color-coded rows)
- **Search & filter**: Search across all fields, filter by stage with pill buttons
- **Sortable columns**: Click column headers to sort by Date, Company, Title, Est Comp, or Stage
- **GitHub Gist sync**: Auto-backs up to a private gist every 5 minutes; loads from gist on startup
- **Setup flow**: Guided onboarding — enter token, auto-detects existing backups or creates a new one
- **Unsaved changes warning**: Browser prompts before leaving if data hasn't been backed up
- **Multi-line notes**: Auto-expanding textarea for notes
- **Inline delete confirmation**: Delete button with Yes/No confirm
- **Light theme**: Clean, modern design

## Tech Stack

- React 19 + TypeScript
- Vite
- No additional dependencies

## Getting Started

```bash
npm install
npm run dev
```

## Setup

On first launch you'll see a setup screen:

1. Create a GitHub Personal Access Token with the `gist` scope (there's a direct link in the UI)
2. Paste it in and hit Continue
3. If an existing backup gist is found, pick it from the list — otherwise create a new one
4. You're in. Token is stored in localStorage, never committed or bundled.

After setup:
- Data syncs from the gist on every page load
- Changes back up automatically every 5 minutes
- Click "Sync Now" in the footer to trigger a manual backup
- Click "Reset Backup" to clear settings and start over

## Project Structure

```
src/
  components/
    ApplicationRow.tsx    # Table row with inline editing
    ApplicationTable.tsx  # Sortable, filterable table
    BackupPanel.tsx       # Sync/reset controls + toast notifications
    SetupFlow.tsx         # Guided onboarding flow
    StatsBar.tsx          # Stage filter pills with counts
  hooks/
    useApplications.ts    # CRUD operations, gist sync on load
  types/
    index.ts              # TypeScript types, stage colors
  utils/
    backup.ts             # Gist API, backup timer, change detection
    storage.ts            # localStorage read/write
  App.tsx                 # Root component
  App.css                 # Styles
  main.tsx                # Entry point
```

## Deployment

Works on GitHub Pages — all secrets stay in the browser's localStorage, nothing baked into the bundle.
