# Next.js to TanStack Start Migration Plan

## Project: d-tracker-web

**Migration Status:** COMPLETED
**Last Updated:** 2025-12-07
**Completed On:** 2025-12-07

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Pre-Migration Checklist](#pre-migration-checklist)
3. [Phase 1: Project Setup & Configuration](#phase-1-project-setup--configuration)
4. [Phase 2: Core Infrastructure Migration](#phase-2-core-infrastructure-migration)
5. [Phase 3: Routing & Pages Migration](#phase-3-routing--pages-migration)
6. [Phase 4: Components Migration](#phase-4-components-migration)
7. [Phase 5: Third-Party Integrations](#phase-5-third-party-integrations)
8. [Phase 6: Styling & Assets](#phase-6-styling--assets)
9. [Phase 7: Testing & Validation](#phase-7-testing--validation)
10. [Post-Migration Cleanup](#post-migration-cleanup)
11. [File-by-File Migration Reference](#file-by-file-migration-reference)
12. [Known Differences & Gotchas](#known-differences--gotchas)

---

## Executive Summary

### Current Stack (Next.js)
- **Framework:** Next.js 16 with App Router
- **React Version:** React 19
- **Styling:** Tailwind CSS v4 with PostCSS
- **Authentication:** Clerk (@clerk/nextjs)
- **Backend:** Convex (serverless)
- **UI Components:** shadcn/ui (Radix-based)
- **Animations:** Framer Motion
- **Maps:** Leaflet + React-Leaflet

### Target Stack (TanStack Start)
- **Framework:** TanStack Start (Vite-based)
- **Router:** TanStack Router (file-based)
- **React Version:** React 19 (compatible)
- **Styling:** Tailwind CSS v4 (compatible)
- **Authentication:** Clerk (needs @clerk/tanstack-start or custom integration)
- **Backend:** Convex (compatible)

### Key Benefits of Migration
- Vite-based development (faster HMR)
- Type-safe routing with TanStack Router
- Server functions with `createServerFn`
- Better control over SSR/streaming
- Smaller bundle size potential

### Key Challenges
- No direct Next.js Font optimization equivalent (manual Google Fonts)
- Clerk integration needs custom setup (no official TanStack Start adapter yet)
- Different routing paradigm (file-based but different conventions)
- No equivalent to `nextjs-toploader` (needs alternative)

---

## Pre-Migration Checklist

### Preparation Tasks
- [ ] **Create migration branch:** `git checkout -b migration/tanstack-start`
- [ ] **Backup current state:** Ensure all changes are committed
- [ ] **Document current functionality:** Test all features manually
- [ ] **Review Convex compatibility:** Ensure Convex works with Vite
- [ ] **Check Clerk TanStack Start support:** Research current integration options
- [ ] **Verify all dependencies compatibility:** Check each package for Vite support

### Environment Verification
- [ ] Node.js version >= 18.0.0
- [ ] npm/pnpm/yarn available
- [ ] All environment variables documented

---

## Phase 1: Project Setup & Configuration

### 1.1 Install TanStack Start Dependencies

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

```bash
# Remove Next.js specific packages
npm uninstall next eslint-config-next nextjs-toploader

# Install TanStack Start core
npm install @tanstack/react-start @tanstack/react-router

# Install Vite and plugins
npm install -D vite @vitejs/plugin-react vite-tsconfig-paths
```

**Files to Create:**

#### 1.1.1 `vite.config.ts`
- [ ] Create file

```typescript
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths(),
    tanstackStart(),
    viteReact(),
  ],
})
```

#### 1.1.2 Update `package.json` scripts
- [ ] Update scripts section

```json
{
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src/ convex/"
  }
}
```

#### 1.1.3 Update `tsconfig.json`
- [ ] Modify TypeScript configuration

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "Bundler",
    "module": "ESNext",
    "target": "ES2022",
    "skipLibCheck": true,
    "strictNullChecks": true,
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*", "convex/**/*"]
}
```

---

## Phase 2: Core Infrastructure Migration

### 2.1 Create Router Configuration

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

#### 2.1.1 Create `src/router.tsx`
- [ ] Create router file

```typescript
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function createAppRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>
  }
}
```

### 2.2 Create Root Route

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

#### 2.2.1 Create `src/routes/__root.tsx`
- [ ] Create root route (replaces `src/app/layout.tsx`)

```typescript
import type { ReactNode } from 'react'
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import { Providers } from '../providers'
import { Header } from '../components/header'
import { ScrollToTop } from '../components/scroll-to-top'
import { Toaster } from '../components/ui/toaster'
import { Constants } from '../constants'
import '../globals.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: Constants.APP_NAME },
      { name: 'description', content: Constants.APP_DESCRIPTION_META },
    ],
    links: [
      // Google Fonts - DM Sans
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@400;500;600;700&display=swap'
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Providers>
        <ScrollToTop />
        <Header />
        <div className="min-h-screen w-full pt-16">
          <Outlet />
        </div>
        <Toaster />
      </Providers>
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body
        className="font-body antialiased"
        suppressHydrationWarning
      >
        {children}
        <Scripts />
      </body>
    </html>
  )
}
```

### 2.3 Environment Variables Migration

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

#### 2.3.1 Rename environment variables
- [ ] Update `.env` and `.env.local` files

TanStack Start (Vite) uses `VITE_` prefix for client-side variables instead of `NEXT_PUBLIC_`:

| Next.js Variable | TanStack Start Variable |
|------------------|------------------------|
| `NEXT_PUBLIC_CONVEX_URL` | `VITE_CONVEX_URL` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `VITE_CLERK_PUBLISHABLE_KEY` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | `VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | `VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` |

#### 2.3.2 Create `src/env.ts` (replaces `src/nextEnv.ts`)
- [ ] Create environment config

```typescript
// Client-side environment variables (VITE_ prefix)
export const clientEnv = {
  VITE_CONVEX_URL: import.meta.env.VITE_CONVEX_URL as string,
  VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string,
  VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: import.meta.env.VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL as string,
  VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: import.meta.env.VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL as string,
}

// Validate required environment variables
if (!clientEnv.VITE_CONVEX_URL) {
  throw new Error('VITE_CONVEX_URL is required')
}
if (!clientEnv.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error('VITE_CLERK_PUBLISHABLE_KEY is required')
}
```

---

## Phase 3: Routing & Pages Migration

### 3.1 Route File Structure

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

TanStack Start uses file-based routing in `src/routes/`:

| Next.js (App Router) | TanStack Start |
|---------------------|----------------|
| `src/app/page.tsx` | `src/routes/index.tsx` |
| `src/app/layout.tsx` | `src/routes/__root.tsx` |
| `src/app/loading.tsx` | Handled via route `pendingComponent` |
| `src/app/error.tsx` | Handled via route `errorComponent` |

### 3.2 Home Page Migration

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

#### 3.2.1 Create `src/routes/index.tsx`
- [ ] Create index route (replaces `src/app/page.tsx`)

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../components/home-page'

export const Route = createFileRoute('/')({
  component: HomePage,
})
```

#### 3.2.2 Move page logic to `src/components/home-page.tsx`
- [ ] Extract component from `src/app/page.tsx`

The current `src/app/page.tsx` contains the full home page logic with:
- Authentication state checking
- Tab-based navigation (Dashboard, Map, Logs)
- Animated view switching

This should be moved to a component file and the route file should only define the route.

---

## Phase 4: Components Migration

### 4.1 Provider Updates

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

#### 4.1.1 Update `src/providers.tsx`
- [ ] Migrate from Next.js Clerk to generic Clerk

```typescript
"use client" // Remove this directive - not needed in TanStack Start

import { ThemeProvider } from './components/theme-provider'
import { clientEnv } from './env'
import { ClerkProvider, useAuth } from '@clerk/clerk-react' // Changed from @clerk/nextjs
import { dark } from '@clerk/themes'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'

const convex = new ConvexReactClient(clientEnv.VITE_CONVEX_URL)

const ThemedClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider
      appearance={{ baseTheme: dark }}
      publishableKey={clientEnv.VITE_CLERK_PUBLISHABLE_KEY}
    >
      {children}
    </ClerkProvider>
  )
}

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemedClerkProvider>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          {children}
        </ConvexProviderWithClerk>
      </ThemedClerkProvider>
    </ThemeProvider>
  )
}
```

### 4.2 App Components Migration

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

#### 4.2.1 `src/app/header.tsx` → `src/components/header.tsx`
- [ ] Move file
- [ ] Update imports from `@clerk/nextjs` to `@clerk/clerk-react`
- [ ] Remove `"use client"` directive

#### 4.2.2 `src/app/avatar-dropdown.tsx` → `src/components/avatar-dropdown.tsx`
- [ ] Move file
- [ ] Update Clerk imports
- [ ] Remove `"use client"` directive

#### 4.2.3 `src/app/dark-mode-toggle.tsx` → `src/components/dark-mode-toggle.tsx`
- [ ] Move file
- [ ] Remove `"use client"` directive

#### 4.2.4 `src/app/location-map.tsx` → `src/components/location-map.tsx`
- [ ] Move file
- [ ] Convert from `next/dynamic` to regular import with Suspense
- [ ] Remove `"use client"` directive

**Dynamic Import Conversion:**

```typescript
// Before (Next.js)
import dynamic from 'next/dynamic'
const LocationMap = dynamic(() => import('./location-map'), { ssr: false })

// After (TanStack Start)
import { lazy, Suspense } from 'react'
const LocationMap = lazy(() => import('./location-map'))

// Usage
<Suspense fallback={<LoadingIndicator />}>
  <LocationMap />
</Suspense>
```

#### 4.2.5 `src/app/logs-table.tsx` → `src/components/logs-table.tsx`
- [ ] Move file
- [ ] Remove `"use client"` directive

#### 4.2.6 `src/app/stats.tsx` → `src/components/stats.tsx`
- [ ] Move file
- [ ] Remove `"use client"` directive

#### 4.2.7 `src/app/footer.tsx` → `src/components/footer.tsx`
- [ ] Move file
- [ ] Remove `"use client"` directive

### 4.3 View Components Migration

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

#### 4.3.1 `src/app/components/dashboard-view.tsx` → `src/components/views/dashboard-view.tsx`
- [ ] Move file
- [ ] Update import paths
- [ ] Remove `"use client"` directive

#### 4.3.2 `src/app/components/map-view.tsx` → `src/components/views/map-view.tsx`
- [ ] Move file
- [ ] Update import paths
- [ ] Convert `next/dynamic` to lazy loading
- [ ] Remove `"use client"` directive

#### 4.3.3 `src/app/components/logs-view.tsx` → `src/components/views/logs-view.tsx`
- [ ] Move file
- [ ] Update import paths
- [ ] Remove `"use client"` directive

### 4.4 Shared Components

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

These components should work without changes, but verify:

- [ ] `src/components/ui/*` - All shadcn/ui components
- [ ] `src/components/daily-steps-chart.tsx`
- [ ] `src/components/steps-bar.tsx`
- [ ] `src/components/geocoded-location.tsx`
- [ ] `src/components/hint.tsx`
- [ ] `src/components/loading-indicator.tsx`
- [ ] `src/components/scroll-to-top.tsx`
- [ ] `src/components/action-button.tsx`
- [ ] `src/components/theme-provider.tsx`
- [ ] `src/components/upload-zone/*`

---

## Phase 5: Third-Party Integrations

### 5.1 Clerk Authentication

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

#### 5.1.1 Update Clerk package
- [ ] Install generic Clerk React package

```bash
npm uninstall @clerk/nextjs
npm install @clerk/clerk-react
```

#### 5.1.2 Update all Clerk imports
- [ ] Search and replace `@clerk/nextjs` → `@clerk/clerk-react`

**Files to update:**
- `src/providers.tsx`
- `src/components/header.tsx`
- `src/components/avatar-dropdown.tsx`
- `src/components/home-page.tsx` (moved from `src/app/page.tsx`)

#### 5.1.3 SignIn/SignUp Component Changes
- [ ] Verify `SignInButton`, `SignUpButton`, `UserButton`, `SignedIn`, `SignedOut` work the same

### 5.2 Convex Integration

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

#### 5.2.1 Verify Convex Vite compatibility
- [ ] Test Convex works with Vite bundler

Convex should work without changes as it's framework-agnostic. The `convex/` directory remains unchanged.

#### 5.2.2 Update environment variable references
- [ ] Update `convex.json` if it references Next.js-specific settings

### 5.3 Replace nextjs-toploader

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

#### 5.3.1 Remove nextjs-toploader
- [ ] Uninstall package

```bash
npm uninstall nextjs-toploader
```

#### 5.3.2 Implement alternative progress indicator
- [ ] Create custom progress indicator using TanStack Router's navigation state

```typescript
// src/components/navigation-progress.tsx
import { useRouterState } from '@tanstack/react-router'

export function NavigationProgress() {
  const isLoading = useRouterState({ select: (s) => s.status === 'pending' })

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] bg-primary z-50">
      <div className="h-full bg-primary animate-pulse" style={{ width: '100%' }} />
    </div>
  )
}
```

### 5.4 Leaflet/React-Leaflet

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

#### 5.4.1 Verify SSR handling
- [ ] Leaflet requires client-side only rendering

```typescript
// Use lazy loading with Suspense instead of next/dynamic
import { lazy, Suspense } from 'react'

const LocationMap = lazy(() => import('./location-map'))

function MapWrapper() {
  return (
    <Suspense fallback={<div>Loading map...</div>}>
      <LocationMap />
    </Suspense>
  )
}
```

---

## Phase 6: Styling & Assets

### 6.1 Global Styles

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

#### 6.1.1 Move `src/app/globals.css` → `src/globals.css`
- [ ] Move CSS file
- [ ] Update import in `__root.tsx`

### 6.2 Fonts Migration

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

#### 6.2.1 Replace Next.js font optimization
- [ ] Remove `next/font/google` imports from layout
- [ ] Add Google Fonts via `<link>` tags in `__root.tsx` head

**Current (Next.js):**
```typescript
import { DM_Sans, Fraunces } from "next/font/google"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
})
```

**New (TanStack Start):**
```typescript
// In __root.tsx head config
links: [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@400;500;600;700&display=swap'
  },
]
```

#### 6.2.2 Update CSS font-family references
- [ ] Update `globals.css` to use font-family directly

```css
:root {
  --font-dm-sans: 'DM Sans', sans-serif;
  --font-fraunces: 'Fraunces', serif;
}

.font-body {
  font-family: var(--font-dm-sans);
}

.font-display {
  font-family: var(--font-fraunces);
}
```

### 6.3 PostCSS Configuration

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

#### 6.3.1 Verify `postcss.config.mjs` compatibility
- [ ] Test Tailwind CSS works with Vite

Current config should work as-is since it uses `@tailwindcss/postcss`.

---

## Phase 7: Testing & Validation

### 7.1 Development Server

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

- [ ] Run `npm run dev`
- [ ] Verify hot module replacement works
- [ ] Check console for errors

### 7.2 Feature Testing

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

#### Authentication
- [ ] Sign in flow works
- [ ] Sign out flow works
- [ ] Protected routes redirect properly
- [ ] User profile displays correctly

#### Dashboard View
- [ ] Stats display correctly
- [ ] Charts render properly
- [ ] Real-time updates work (Convex)

#### Map View
- [ ] Map loads without SSR errors
- [ ] Markers display correctly
- [ ] Location history works

#### Logs View
- [ ] Paginated data loads
- [ ] Infinite scroll works
- [ ] Date formatting correct

#### Theme
- [ ] Dark/light mode toggle works
- [ ] System theme detection works
- [ ] Theme persists across page loads

### 7.3 Build Verification

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

- [ ] Run `npm run build`
- [ ] Verify build completes without errors
- [ ] Run `npm run preview`
- [ ] Test production build locally

---

## Post-Migration Cleanup

### 8.1 File Removal

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

#### Files to Delete
- [ ] `src/app/page.tsx` (moved to component)
- [ ] `src/app/layout.tsx` (replaced by `__root.tsx`)
- [ ] `src/app/loading.tsx` (handled differently)
- [ ] `src/app/` directory (after moving all components)
- [ ] `src/nextEnv.ts` (replaced by `src/env.ts`)
- [ ] `src/instrumentation.ts` (env validation moved)
- [ ] `next.config.mjs`
- [ ] `next-env.d.ts`

### 8.2 Configuration Cleanup

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

- [ ] Update `.gitignore` for Vite
- [ ] Update ESLint config to remove Next.js plugin
- [ ] Update README with new development commands

### 8.3 Dependency Cleanup

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

#### Packages to Remove
```bash
npm uninstall next eslint-config-next nextjs-toploader @clerk/nextjs
```

#### Packages to Add (if not already)
```bash
npm install @tanstack/react-start @tanstack/react-router @clerk/clerk-react
npm install -D vite @vitejs/plugin-react vite-tsconfig-paths
```

---

## File-by-File Migration Reference

### Configuration Files

| Original File | Action | New Location | Status |
|---------------|--------|--------------|--------|
| `next.config.mjs` | Replace | `vite.config.ts` | [ ] |
| `tsconfig.json` | Modify | `tsconfig.json` | [ ] |
| `package.json` | Modify | `package.json` | [ ] |
| `postcss.config.mjs` | Keep | `postcss.config.mjs` | [ ] |
| `eslint.config.mjs` | Modify | `eslint.config.mjs` | [ ] |
| `components.json` | Keep | `components.json` | [ ] |
| `.env` | Modify (rename vars) | `.env` | [ ] |
| `.env.local` | Modify (rename vars) | `.env.local` | [ ] |

### Source Files

| Original File | Action | New Location | Status |
|---------------|--------|--------------|--------|
| `src/app/layout.tsx` | Replace | `src/routes/__root.tsx` | [ ] |
| `src/app/page.tsx` | Move/Split | `src/routes/index.tsx` + `src/components/home-page.tsx` | [ ] |
| `src/app/loading.tsx` | Delete | (handled in routes) | [ ] |
| `src/app/globals.css` | Move | `src/globals.css` | [ ] |
| `src/app/providers.tsx` | Move/Modify | `src/providers.tsx` | [ ] |
| `src/app/header.tsx` | Move/Modify | `src/components/header.tsx` | [ ] |
| `src/app/footer.tsx` | Move | `src/components/footer.tsx` | [ ] |
| `src/app/avatar-dropdown.tsx` | Move/Modify | `src/components/avatar-dropdown.tsx` | [ ] |
| `src/app/dark-mode-toggle.tsx` | Move | `src/components/dark-mode-toggle.tsx` | [ ] |
| `src/app/location-map.tsx` | Move/Modify | `src/components/location-map.tsx` | [ ] |
| `src/app/logs-table.tsx` | Move | `src/components/logs-table.tsx` | [ ] |
| `src/app/stats.tsx` | Move | `src/components/stats.tsx` | [ ] |
| `src/app/components/dashboard-view.tsx` | Move | `src/components/views/dashboard-view.tsx` | [ ] |
| `src/app/components/map-view.tsx` | Move/Modify | `src/components/views/map-view.tsx` | [ ] |
| `src/app/components/logs-view.tsx` | Move | `src/components/views/logs-view.tsx` | [ ] |
| `src/nextEnv.ts` | Replace | `src/env.ts` | [ ] |
| `src/instrumentation.ts` | Delete | (handled in env.ts) | [ ] |
| `src/constants.ts` | Keep | `src/constants.ts` | [ ] |
| `src/lib/utils.ts` | Keep | `src/lib/utils.ts` | [ ] |

### New Files to Create

| File | Purpose | Status |
|------|---------|--------|
| `vite.config.ts` | Vite configuration | [ ] |
| `src/router.tsx` | TanStack Router setup | [ ] |
| `src/routes/__root.tsx` | Root layout/route | [ ] |
| `src/routes/index.tsx` | Home route | [ ] |
| `src/env.ts` | Environment variables | [ ] |
| `src/routeTree.gen.ts` | Auto-generated by TanStack | [ ] |
| `src/components/navigation-progress.tsx` | Top loader replacement | [ ] |
| `src/components/home-page.tsx` | Home page component | [ ] |

### Convex Files (No Changes Required)

| File | Status |
|------|--------|
| `convex/schema.ts` | [ ] Verified |
| `convex/records.ts` | [ ] Verified |
| `convex/users.ts` | [ ] Verified |
| `convex/http.ts` | [ ] Verified |
| `convex/crons.ts` | [ ] Verified |
| `convex/knownLocations.ts` | [ ] Verified |
| `convex/services/*` | [ ] Verified |
| `convex/lib/*` | [ ] Verified |

---

## Known Differences & Gotchas

### 1. Client Directives
**Next.js:** Uses `"use client"` directive
**TanStack Start:** Everything is client by default, no directive needed

**Action:** Remove all `"use client"` directives from component files

### 2. Dynamic Imports
**Next.js:** `import dynamic from 'next/dynamic'`
**TanStack Start:** Use React's `lazy()` and `Suspense`

```typescript
// Next.js
const Map = dynamic(() => import('./map'), { ssr: false })

// TanStack Start
const Map = lazy(() => import('./map'))
<Suspense fallback={<Loading />}><Map /></Suspense>
```

### 3. Environment Variables
**Next.js:** `NEXT_PUBLIC_` prefix for client
**TanStack Start:** `VITE_` prefix for client

### 4. Metadata/Head
**Next.js:** Export `metadata` object or use `<Head>`
**TanStack Start:** Use `head` function in route definition

### 5. Font Optimization
**Next.js:** Built-in font optimization with `next/font`
**TanStack Start:** Manual Google Fonts via `<link>` tags

### 6. Image Optimization
**Next.js:** Built-in `<Image>` component
**TanStack Start:** Use regular `<img>` or a library like `unpic`

### 7. API Routes
**Next.js:** `src/app/api/` route handlers
**TanStack Start:** Server functions with `createServerFn`

Note: This project uses Convex for API, so no Next.js API routes to migrate.

### 8. Loading States
**Next.js:** `loading.tsx` file convention
**TanStack Start:** `pendingComponent` in route definition

### 9. Error Boundaries
**Next.js:** `error.tsx` file convention
**TanStack Start:** `errorComponent` in route definition

---

## Progress Summary

| Phase | Status | Progress |
|-------|--------|----------|
| Phase 1: Setup & Config | [x] Completed | 100% |
| Phase 2: Core Infrastructure | [x] Completed | 100% |
| Phase 3: Routing & Pages | [x] Completed | 100% |
| Phase 4: Components | [x] Completed | 100% |
| Phase 5: Third-Party | [x] Completed | 100% |
| Phase 6: Styling & Assets | [x] Completed | 100% |
| Phase 7: Testing | [x] Completed | 100% |
| Post-Migration Cleanup | [x] Completed | 100% |

**Overall Migration Progress:** 100% - COMPLETE

---

## Resources & Documentation

- [TanStack Start Documentation](https://tanstack.com/start/latest/docs/framework/react/overview)
- [TanStack Router Documentation](https://tanstack.com/router/latest/docs/framework/react/overview)
- [TanStack Router File-Based Routing](https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing)
- [TanStack Start Server Functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions)
- [Clerk React SDK](https://clerk.com/docs/quickstarts/react)
- [Convex with Vite](https://docs.convex.dev/quickstart/vite)
- [Vite Documentation](https://vitejs.dev/)

---

## Notes for AI Agents

This migration plan is designed to be picked up by independent AI agents. Each phase and task is:

1. **Self-contained:** Each checkbox item can be completed independently
2. **Ordered:** Tasks are listed in recommended execution order
3. **Verifiable:** Each task has clear completion criteria
4. **Documented:** Code examples provided where applicable

When picking up this migration:
1. Check the "Progress Summary" section for current state
2. Find the first incomplete phase
3. Complete tasks in order, checking boxes as you go
4. Update the "Last Updated" date at the top
5. Update the "Progress Summary" percentages

**Important:** After completing each major phase, run the development server to verify nothing is broken before proceeding.
