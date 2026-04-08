# Job Application Tracker

## Overview
A React + TypeScript app (Vite) for tracking job applications. Data persists in localStorage with optional GitHub Gist backup every 5 minutes.

## Commands
- `npm run dev` — start dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview production build

## Architecture
- **Components**: `src/components/` — ApplicationRow, ApplicationTable, BackupPanel
- **Hooks**: `src/hooks/useApplications.ts` — CRUD operations for applications
- **Utils**: `src/utils/storage.ts` (localStorage), `src/utils/backup.ts` (gist backup)
- **Types**: `src/types/index.ts` — JobApplication interface, Stage type

## Conventions
- Minimal dependencies (React + Vite only)
- All state flows through `useApplications` hook
- Stage options: Applied, Interviewing, Rejected, Offer
- Dark theme with CSS custom properties in App.css
