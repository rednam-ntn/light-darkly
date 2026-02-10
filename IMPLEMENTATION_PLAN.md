# Implementation Plan
# Light Darkly - LaunchDarkly Feature Flag Viewer

## Phase 1: Project Setup

### 1.1 Initialize Project
- [x] Create Vite + React + TypeScript project using `npm create vite@latest`
- [x] Configure `tsconfig.json` with strict type checking
- [x] Setup path aliases (`@/` for src directory)
- [x] Create `.gitignore` (include `.env`, `.env.local`, `node_modules`, `dist`)

### 1.2 Install Dependencies
- [x] Install TanStack Query: `@tanstack/react-query` and devtools
- [x] Install React Router: `react-router-dom`
- [x] Install Tailwind CSS and configure with PostCSS
- [x] Install Headless UI: `@headlessui/react` for components
- [x] Install icons: `lucide-react`
- [x] Install date formatting: `date-fns`

### 1.3 Configure Build Tools
- [x] Setup ESLint with TypeScript rules
- [x] Configure Prettier for code formatting
- [x] Add pre-commit hooks with Husky (optional)
- [x] Update `vite.config.ts` with proxy settings (if needed)

### 1.4 Project Structure
- [x] Create folder structure:
  ```
  src/
  ├── components/      # Reusable UI components
  ├── features/        # Feature-specific modules
  │   ├── projects/
  │   ├── flags/
  │   └── settings/
  ├── hooks/           # Custom React hooks
  ├── services/        # API client
  ├── types/           # TypeScript types
  ├── utils/           # Helper functions
  └── App.tsx
  ```

### 1.5 Docker Setup
- [x] Create `Dockerfile` for production build (Nginx)
- [x] Create `Dockerfile.dev` for development (Vite dev server)
- [x] Create `docker-compose.yml` with:
  - Development service (hot reload on port 5173)
  - Production service (Nginx on port 80)
- [x] Create `.dockerignore` (exclude `node_modules`, `.git`, `.env.local`)
- [x] Test Docker containers: `docker-compose up`

---

## Phase 2: Core Infrastructure

### 2.1 TypeScript Types
- [x] Create `src/types/launchdarkly.ts` with API response types:
  - `Project`, `Environment`, `FeatureFlag`
  - `Variation`, `Target`, `TargetingRule`, `Clause`
  - `Rollout`, `WeightedVariation`, `Fallthrough`, `Prerequisite`
- [x] Create `src/types/api.ts` for API client types
- [x] Create `src/types/app.ts` for app-specific state types

### 2.2 API Client
- [x] Create `src/services/launchdarkly-client.ts`:
  - Base URL: `https://app.launchdarkly.com/api/v2`
  - Function: `getProjects(token: string)`
  - Function: `getFlags(token: string, projectKey: string, env?: string)`
  - Function: `getFlag(token: string, projectKey: string, flagKey: string)`
  - Function: `getEnvironments(token: string, projectKey: string)`
  - Error handling with typed exceptions
- [x] Add request/response interceptors for logging (dev mode)
- [x] Implement retry logic for transient errors

### 2.3 TanStack Query Setup
- [x] Create `src/services/query-client.ts` with QueryClient config
- [x] Configure default query options (staleTime, cacheTime, retry)
- [x] Wrap `App.tsx` with `QueryClientProvider`
- [x] Add React Query DevTools (dev mode only)

### 2.4 Routing
- [x] Create `src/routes.tsx` with React Router configuration:
  - `/` → Redirect to `/projects` (if token valid) or show error page (if token missing/invalid)
  - `/projects` → Project selection
  - `/projects/:projectKey` → Flag list (all-env overview, 5 per page)
  - `/projects/:projectKey/flags/:flagKey` → Flag details (with env selector)
- [x] Create route guard to check API token from env var
- [x] Implement URL state synchronization (page number, search query)

### 2.5 Layout Components
- [x] Create `src/components/layout/AppLayout.tsx`:
  - Header with app title, project selector, connection status
  - NO environment selector in header (env selection is on flag detail page only)
  - Main content area
  - Responsive layout
- [x] Create `src/components/layout/Header.tsx`

---

## Phase 3: Feature Implementation

### 3.1 API Key Management (Environment Variable Only)
- [x] Create `src/hooks/useApiToken.ts`:
  - Read `VITE_LD_API_TOKEN` from `import.meta.env`
  - Return token value and `isConfigured` boolean
  - NO localStorage, NO UI input
- [x] Create `src/features/error/MissingTokenPage.tsx`:
  - Full-page error when `VITE_LD_API_TOKEN` is missing
  - Show `.env` setup instructions with code snippet
  - Link to LaunchDarkly token creation docs
- [x] Create `src/features/error/InvalidTokenPage.tsx`:
  - Full-page error when token validation fails (401)
  - Show troubleshooting steps
- [x] Implement API token validation on app startup by fetching `/api/v2/projects`
- [x] Display connection status indicator in header (green dot = connected)

### 3.2 Project Selection
- [x] Create `src/features/projects/ProjectList.tsx`:
  - Fetch projects using TanStack Query
  - Display project cards (name, key, tag count)
  - Loading skeleton
  - Error state with retry button
  - Empty state (no projects)
- [x] Create `src/features/projects/ProjectSelector.tsx` (dropdown in header):
  - Combobox with search
  - Show current project
  - Switch project action
- [x] Create `src/hooks/useProjects.ts` query hook
- [x] Handle project selection → navigate to first environment

### 3.3 Feature Flag List (All-Environment Overview)
- [x] Create `src/features/flags/FlagList.tsx`:
  - Fetch flags using TanStack Query (with all env data)
  - Fixed pagination: 5 flags per page (NOT user-configurable)
  - Display flag cards with:
    - Name, key, and description
    - Type badge (Boolean/Multivariate)
    - **Environment status grid**: On/Off indicator for EACH environment
    - Rule count per environment
  - Click flag → navigate to detail view
- [x] Create `src/features/flags/FlagCard.tsx` component:
  - Show all-environment overview in a compact grid
  - Environment name + colored status dot (green=On, red=Off)
  - Rule count badge per environment
- [x] Create `src/features/flags/Pagination.tsx`:
  - Previous/Next buttons
  - Current page / total pages display
  - Fixed 5 items per page (no page size selector)
- [x] Create `src/hooks/useFlags.ts` query hook
- [x] Create `src/hooks/useEnvironments.ts` query hook (for env names/colors)
- [x] Add loading skeletons (5 cards)
- [x] Add empty state (no flags found)

### 3.5 Search & Filter
- [x] Create `src/features/flags/SearchBar.tsx`:
  - Search input with debounce (300ms)
  - Search by flag name or key (case-insensitive)
  - Clear button (X icon)
  - Reset pagination to page 1 on search
- [x] Create `src/features/flags/FilterDropdown.tsx`:
  - Filter by status (All/On in any env/Off in all envs)
  - Filter by type (All/Boolean/Multivariate)
  - Filter by tags (if available)
- [x] Implement client-side filtering logic
- [x] Show filter/search result count and total flags

### 3.6 Feature Flag Details (with Environment Selector)
- [x] Create `src/features/flags/FlagDetail.tsx`:
  - Fetch single flag with full details (all environments included)
  - **Environment selector dropdown** at top:
    - List all environments for the project
    - Default to first environment (e.g., Production)
    - Switching env updates all sections below (client-side, no API refetch)
    - Persist selected env in URL query param `?env=production`
  - Display header section:
    - Flag name, key, description
    - Type badge, status for selected environment
    - Creation date
  - Back button to flag list
- [x] Create `src/features/flags/EnvironmentSelector.tsx`:
  - Dropdown component for selecting environment on detail page
  - Show environment name with colored indicator
  - Highlight currently selected environment
- [x] Create `src/features/flags/sections/VariationsSection.tsx`:
  - List all variations with value, name, description
  - Syntax highlighting for JSON values
- [x] Create `src/features/flags/sections/TargetingRulesSection.tsx`:
  - Display each targeting rule for SELECTED environment:
    - Rule description
    - Conditions (clauses) with attribute, operator, values
    - Rollout strategy (fixed variation or percentage)
  - Collapsible rule cards
- [x] Create `src/features/flags/sections/IndividualTargetsSection.tsx`:
  - Display individual targets for SELECTED environment grouped by variation
  - Show user/context keys
- [x] Create `src/features/flags/sections/DefaultRuleSection.tsx`:
  - Display fallthrough configuration for SELECTED environment
  - Show default variation or rollout
- [x] Create `src/features/flags/sections/PrerequisitesSection.tsx`:
  - Display prerequisite flags
  - Show required variation for each prerequisite
- [x] Create `src/hooks/useFlagDetail.ts` query hook

### 3.7 Shared Components
- [x] Create `src/components/ui/Badge.tsx` (type, status badges)
- [x] Create `src/components/ui/Card.tsx` (flag cards, rule cards)
- [x] Create `src/components/ui/Button.tsx` (primary, secondary, ghost variants)
- [x] Create `src/components/ui/Input.tsx` (search input)
- [x] Create `src/components/ui/Dropdown.tsx` (project selector, env selector on detail page)
- [x] Create `src/components/ui/Spinner.tsx` (loading indicator)
- [x] Create `src/components/ui/EmptyState.tsx` (no data)
- [x] Create `src/components/ui/ErrorBoundary.tsx` (catch errors)

---

## Phase 4: UI/UX Polish

### 4.1 Styling & Theming
- [x] Configure Tailwind CSS theme in `tailwind.config.js`:
  - Custom colors (primary, success, warning, error)
  - Font families (Inter for UI, JetBrains Mono for code)
  - Spacing scale
- [x] Create `src/styles/global.css` with base styles
- [x] Implement consistent spacing and typography
- [x] Add hover/active states to interactive elements
- [x] Style scrollbars (webkit-scrollbar)

### 4.2 Responsive Design
- [x] Test and fix layout on mobile (< 768px):
  - Hide sidebar by default, show hamburger menu
  - Stack elements vertically
  - Adjust font sizes
- [x] Test and fix layout on tablet (768px-1279px):
  - Collapsible sidebar with overlay
  - Adjust card grid (2 columns)
- [x] Test on desktop (1280px+):
  - Fixed sidebar
  - Spacious layout (3-4 column grid for flags)
- [x] Add responsive navigation (mobile menu)

### 4.3 Loading & Error States
- [x] Create skeleton loaders for:
  - Project list
  - Environment list
  - Flag list (cards)
  - Flag detail sections
- [x] Create error components:
  - `src/components/error/ErrorAlert.tsx` (inline errors)
  - `src/components/error/ErrorPage.tsx` (full page errors)
- [x] Implement error boundaries for each route
- [x] Add retry buttons to all error states

### 4.4 Accessibility
- [x] Add ARIA labels to all interactive elements
- [x] Ensure keyboard navigation works:
  - Tab through interactive elements
  - Enter to activate buttons/links
  - Escape to close dropdowns/modals
- [x] Test color contrast with WCAG AA checker
- [x] Add focus indicators (outline ring)
- [x] Add screen reader announcements for dynamic content

### 4.5 Animations & Micro-interactions
- [x] Add transition animations (Tailwind transition utilities)
- [x] Animate route transitions (fade in/out)
- [x] Add loading spinners for async actions
- [x] Animate dropdown/modal open/close
- [x] Add success/error toast notifications

---

## Phase 5: Integration & Testing

### 5.1 Environment Variables
- [x] Create `.env.example` with:
  ```
  VITE_LD_API_URL=https://app.launchdarkly.com/api/v2
  VITE_LD_API_TOKEN=your-token-here
  ```
- [x] Create `.env.local` (git-ignored) for local development
- [x] Document environment variables in README

### 5.2 Error Handling
- [x] Handle API errors gracefully:
  - 401: Invalid token → Show InvalidTokenPage (restart required)
  - 403: Insufficient permissions → Display message
  - 404: Resource not found → Show not found page
  - 429: Rate limit → Display retry message
  - 500: Server error → Show error with retry
- [x] Implement global error handler
- [x] Log errors to console (dev mode)

### 5.3 Performance Optimization
- [x] Implement code splitting with React.lazy:
  - Lazy load flag detail page
- [x] Optimize images (use SVG for icons)
- [x] Debounce search input
- [x] Analyze bundle size with `vite-bundle-visualizer`
- [x] Remove unused dependencies

### 5.4 Documentation
- [x] Create README.md with:
  - Project description
  - Prerequisites (Node.js, Docker)
  - Installation instructions
  - Environment variables setup
  - Running locally (npm/docker)
  - Building for production
  - LaunchDarkly API token setup guide
  - Screenshots
- [x] Add inline code comments for complex logic
- [x] Create `CONTRIBUTING.md` (optional)

### 5.5 Production Build
- [x] Test production build: `npm run build`
- [x] Test production Docker image
- [x] Verify environment variables work in production
- [x] Test on different browsers (Chrome, Firefox, Safari)
- [x] Verify responsive design on real devices

---

## ⚠️ WORKFLOW CHECKPOINT REMINDER

**When ALL tasks above are marked [x]:**
1. ✅ Report "Phase 3 Complete - All implementation tasks done"
2. 📝 Create TEST_PLAN.md with comprehensive test cases
3. ⛔ **STOP and wait for Human to review TEST_PLAN.md**
4. Only proceed to run tests AFTER Human approves

**Context Overflow?** Re-read:
1. `.claude/skills/vibe-builder/SKILL.md` (workflow)
2. `IMPLEMENTATION_PLAN.md` (current progress)
3. `PRD.md` (requirements)
4. `CLAUDE.md` (checkpoints reminder)

---

## Progress Log

| Date       | Phase         | Status      | Notes                |
| ---------- | ------------- | ----------- | -------------------- |
| 2026-02-10 | Phase 1       | Not Started | Initial plan created |
| -          | Phase 2       | Not Started | -                    |
| -          | Phase 3       | Not Started | -                    |
| -          | Phase 4       | Not Started | -                    |
| -          | Phase 5       | Not Started | -                    |

---

## Task Summary

- **Total Tasks:** 89
- **Completed:** 0
- **Remaining:** 89

**Estimated Complexity:** Medium (3-5 days for experienced developer)
