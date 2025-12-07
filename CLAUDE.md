# D-Tracker Web

A mobile-first activity tracking application built with TanStack Start and Convex.

## Tech Stack

- **Framework**: TanStack Start (React + Vite)
- **Router**: TanStack Router with file-based routing
- **Backend**: Convex (serverless functions, database, file storage)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Language**: TypeScript

## Project Structure

```
src/
  routes/          # TanStack Router file-based routes
  components/      # React components
    ui/            # shadcn/ui components
    views/         # Page view components
  hooks/           # Custom React hooks
  lib/             # Utility functions and services
convex/            # Convex backend
  services/        # Business logic services
  lib/             # Backend utilities
```

## Commands

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Lint src/ and convex/ directories
```


