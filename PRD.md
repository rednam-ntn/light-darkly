# Product Requirements Document
# Light Darkly - LaunchDarkly Feature Flag Viewer

## 1. Product Overview

**Light Darkly** is a web-based dashboard for viewing and exploring LaunchDarkly feature flags in read-only mode. It provides a clean, intuitive interface to visualize all feature flags, their configurations, targeting rules, and variations across multiple projects and environments.

### Problem Statement
LaunchDarkly's web interface requires full account access and can be overwhelming for stakeholders who only need to view flag configurations. Light Darkly provides a focused, read-only viewer using LaunchDarkly's API.

### Solution
A lightweight React web application that connects to LaunchDarkly's REST API using a read-only access token, allowing users to browse projects, environments, and feature flags with detailed rule visualization.

---

## 2. Goals & Objectives

### Primary Goals
- Provide read-only access to LaunchDarkly feature flag data
- Display flag configurations in an easy-to-understand format
- Support multiple projects and environments
- Ensure API key security through environment variables

### Success Metrics
- Fast load times (<2s for flag list)
- Clear visualization of complex targeting rules
- Secure API key handling (never exposed in client)
- Responsive design works on desktop and tablet

### Key Differentiators
- Focused, read-only interface (no accidental modifications)
- Clean, modern UI with progressive disclosure
- No account management needed (just API key)
- Lightweight and fast (client-side only, no backend database)

---

## 3. Target Users

### User Persona 1: Product Manager
- **Needs:** View current flag states, understand rollout configurations
- **Pain Points:** LaunchDarkly UI has too many options, risk of accidental changes
- **Use Case:** Check which features are enabled in production environment

### User Persona 2: QA Engineer
- **Needs:** Verify flag configurations match test plans, inspect targeting rules
- **Pain Points:** Need read-only access without full admin permissions
- **Use Case:** Validate flag setup before release testing

### User Persona 3: Developer (Non-Admin)
- **Needs:** Quick reference for flag keys, variations, and current state
- **Pain Points:** Context-switching to LaunchDarkly dashboard interrupts flow
- **Use Case:** Verify flag configuration while debugging

---

## 4. Features & Requirements

### Core Features (MVP)

#### F1: API Key Configuration (Environment Variable + Browser Storage) — DONE
- [x] Load API token from `.env` file via `VITE_LD_API_TOKEN` as default
- [x] **Allow user to input/change API key via modal in header**
  - "API Key" button in header (top-right, next to connection status)
  - Modal with password input for API key
  - **API key stored ONLY in browser localStorage, NEVER sent to app server**
  - Modal displays privacy warning: "Your API key is stored only in your browser's local storage. It is never sent to or stored on our servers."
  - Browser-stored key takes precedence over `.env` key
  - User can clear browser key to revert to `.env` key
- [x] If neither `.env` nor browser key exists, show MissingTokenPage with "Enter API Key" button + privacy notice
- [x] Validate token on app startup by making test API call
- [x] Display connection status in header (connected/error/missing token)
- **Status:** Implemented. Token priority: localStorage > `.env`. Privacy warning on both MissingTokenPage and ApiKeyModal.

#### F2: Project Selection — DONE
- [x] Fetch and display all accessible projects (Load more pattern, 20 per page)
- [x] Show project name and key
- [x] Allow user to select a project
- **Status:** Implemented with "Load more" pagination (limit=20, offset-based).

#### F3: Environment Navigation (REMOVED from Main Dashboard) — DONE
- [x] Environments are NOT selectable on the main dashboard
- [x] All environments shown as expandable sections on Flag Detail page (see F5)
- [x] Main dashboard shows flag overview across ALL environments simultaneously
- **Status:** No environment selector on dashboard. All-env overview per flag.

#### F4: Feature Flag List (All-Environment Overview) — DONE
- [x] Display flags for selected project with overview across ALL environments
- [x] Fixed pagination: 5 flags per page (NOT configurable)
- [x] Each flag card shows: name, key, type badge, env status grid, rule count
- [x] Search flags by name or key (debounced 300ms)
- [x] Filter by status, type, tags
- [x] Pagination controls: Previous/Next with page display
- **Status:** Implemented. "Load more" pattern for flags with 5 per page.

#### F5: Feature Flag Details (All Environments - Expandable Sections) — DONE
- [x] Click on flag from list to view full details
- [x] **Display ALL environments as expandable/collapsible sections**
  - Each environment rendered as a separate collapsible section
  - Section header: environment name, color left-border, ON/OFF badge
  - Collapsed: summary only. Expanded: full targeting details
  - All sections collapsed by default
- [x] Environments sorted: local-dev, dev, test, stage, production (custom order)
- [x] Display header: name, key, description, type, created date
- [x] Variations shown once at top (shared across envs)
- [x] Each env section shows: targeting rules, individual targets, default rule, prerequisites
- **Status:** Implemented. No dropdown selector. Env order configurable.

#### F6: Responsive Design — DONE
- [x] Desktop layout (1280px+): sidebar navigation + main content
- [x] Tablet layout (768px-1279px): collapsible sidebar
- [x] Mobile layout (< 768px): stacked layout with bottom nav
- **Status:** Implemented. Responsive on all breakpoints.

#### F7: Basic Auth Protection (Optional, env-var driven) — DONE
- [x] Check `BASIC_AUTH_USERNAME` and `BASIC_AUTH_PASSWORD` env vars on app start
- [x] If both are set → enable HTTP Basic Auth for ALL pages
- [x] If either is missing/empty → no auth required (app works as before)
- [x] Credentials are server-side only (NOT exposed in client bundle)
- [x] Works across all deployment targets:
  - **Dev (Vite):** Server middleware plugin checks Basic Auth headers
  - **Docker Prod (Nginx):** Entrypoint script generates htpasswd at container startup
  - **Vercel:** Serverless function (`api/auth.ts`) checks auth before serving index.html
- **Status:** Implemented. Fully optional — zero config change if not needed.

### Nice-to-have Features (Post-MVP)

#### F8: Flag History (Future)
- [ ] Show flag change audit log
- [ ] Display who changed what and when

#### F9: Export Configurations (Future)
- [ ] Export flag configurations as JSON
- [ ] Copy flag settings to clipboard

#### F10: Multi-Account Support (Future)
- [ ] Store multiple API keys
- [ ] Switch between LaunchDarkly accounts

#### F11: Dark Mode (Future)
- [ ] Toggle dark/light theme
- [ ] Persist theme preference

---

## 5. User Flows

### Main User Flow: View Feature Flag Details

```
[App Start] → [Check localStorage for API Key]
                     ↓
              [Found?] → [Yes] → [Use localStorage key]
                     ↓ No
              [Check .env VITE_LD_API_TOKEN]
                     ↓
              [Found?] → [Yes] → [Use .env key]
                     ↓ No
              [Show MissingTokenPage with "Enter API Key" button]
                     ↓
              [Validate Token via API]
               ↓              ↓
          [Success]       [Error/Invalid]
               ↓              ↓
      [Load Projects]  [Show Error + "Change API Key" button]
               ↓
      [Select Project]
               ↓
      [Browse Flag List]
      (5 flags/page, all-env overview)
               ↓
      [Click Flag] → [Flag Detail Page]
               ↓
      [View ALL environments as expandable sections]
      [Expand any env → see targeting rules, targets, defaults]
               ↓
      [Back to list or Change API Key via header button]
```

### App Startup Flow

```
[App Loads] → [Check localStorage for API Key]
                      ↓
              [localStorage key exists?]
               ↓            ↓
          [Yes]          [No] → [Check .env VITE_LD_API_TOKEN]
               ↓                    ↓            ↓
     [Use localStorage]        [Yes]          [No]
               ↓                    ↓            ↓
     [Validate API]          [Use .env]  [Show Missing Token Page]
                                  ↓       (with "Enter Key" button)
                           [Validate API]
          ↓       ↓       (with .env setup instructions)
    [Valid]   [Invalid]
          ↓       ↓
  [Load App] [Show "Invalid Token" Error Page]
```

---

## 6. Wireframes

### Screen 1: Error Page (Missing/Invalid API Token)
```
┌─────────────────────────────────────────────────┐
│                                                 │
│          Light Darkly                           │
│     LaunchDarkly Feature Flag Viewer            │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │                                           │ │
│  │  ⚠ API Token Not Configured              │ │
│  │                                           │ │
│  │  To use Light Darkly, add your            │ │
│  │  LaunchDarkly read-only API token         │ │
│  │  to the .env file:                        │ │
│  │                                           │ │
│  │  ┌─────────────────────────────────────┐  │ │
│  │  │ VITE_LD_API_TOKEN=api-xxx-xxxxxx   │  │ │
│  │  └─────────────────────────────────────┘  │ │
│  │                                           │ │
│  │  Then restart the application.            │ │
│  │                                           │ │
│  │  Get token from LaunchDarkly:             │ │
│  │  Account Settings > Authorization >       │ │
│  │  Create Token (Reader role)               │ │
│  │                                           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Screen 2: Main Dashboard (All-Environment Flag Overview)
```
┌───────────────────────────────────────────────────────────────────┐
│ Light Darkly                   [Project ▼]      ● Connected      │
├───────────────────────────────────────────────────────────────────┤
│  🔍 Search flags...                              [Filter ▼]      │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │ new-checkout-flow                              Boolean     │   │
│  │ "Enable new checkout flow"                                │   │
│  │                                                            │   │
│  │   Prod: ● On    Stage: ● On    Dev: ○ Off                │   │
│  │   Rules: 2       Rules: 1       Rules: 0                  │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │ dark-mode                                      Boolean     │   │
│  │ "Toggle dark mode theme"                                  │   │
│  │                                                            │   │
│  │   Prod: ● On    Stage: ● On    Dev: ● On                 │   │
│  │   Rules: 0       Rules: 0       Rules: 0                  │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │ recommendation-algo                        Multivariate    │   │
│  │ "ML recommendation algorithm version"                     │   │
│  │                                                            │   │
│  │   Prod: ● On    Stage: ○ Off   Dev: ● On                 │   │
│  │   Rules: 4       Rules: 0       Rules: 2                  │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ... (2 more flags on this page)                                  │
│                                                                   │
│                    [← Prev]  Page 1 of 10  [Next →]              │
│                    (5 flags per page - fixed)                     │
└───────────────────────────────────────────────────────────────────┘
```

### Screen 3: Feature Flag Detail View (All Environments - Expandable)
```
┌───────────────────────────────────────────────────────────────────┐
│ ⚡ Light Darkly              ● Connected  [🔑 Change API Key]    │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ← Back to Flags                                                  │
│                                                                   │
│  new-checkout-flow                            [Boolean Flag]      │
│  Key: new-checkout-flow                        Created: ...       │
│  "Enable new checkout flow with one-click purchase"               │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Variations                                                  │ │
│  │ • True:  "Enable new flow"                                  │ │
│  │ • False: "Use legacy checkout"                              │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─ 🟢 Production ──────────────────────── ● ON ─── [▼ collapse]┐│
│  │                                                               ││
│  │  Targeting Rules                                              ││
│  │  Rule 1: Beta Users                                           ││
│  │    IF user.segment = "beta-testers" → True (100%)             ││
│  │  Rule 2: Gradual Rollout                                      ││
│  │    IF user.country = "US" → True (25%), False (75%)           ││
│  │                                                               ││
│  │  Individual Targets                                           ││
│  │  True: user-123, user-456 | False: user-789                   ││
│  │                                                               ││
│  │  Default Rule: Serve False                                    ││
│  │  Prerequisites: "auth-v2" = True                              ││
│  └───────────────────────────────────────────────────────────────┘│
│                                                                   │
│  ┌─ 🔵 Staging ─────────────────────────── ● ON ─── [▶ expand] ┐│
│  └───────────────────────────────────────────────────────────────┘│
│                                                                   │
│  ┌─ 🟡 Development ─────────────────────── ○ OFF ── [▶ expand] ┐│
│  └───────────────────────────────────────────────────────────────┘│
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### API Key Modal
```
┌───────────────────────────────────────────────┐
│  🔑 Change API Key                      [✕]   │
├───────────────────────────────────────────────┤
│                                               │
│  Enter your LaunchDarkly API key:             │
│  ┌─────────────────────────────────────────┐  │
│  │ api-xxxx-xxxx-xxxx                      │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │ 🔒 Privacy Notice                      │  │
│  │ Your API key is stored ONLY in your     │  │
│  │ browser's local storage. It is never    │  │
│  │ sent to or stored on our servers.       │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│        [Clear Key]            [Save Key]      │
│                                               │
└───────────────────────────────────────────────┘
```

---

## 7. Data Models

### Entity Relationship Diagram

```
┌────────────────┐
│   Account      │
│ (External LD)  │
└────────┬───────┘
         │ 1
         │
         │ N
┌────────┴───────┐
│    Project     │
├────────────────┤
│ key            │
│ name           │
└────────┬───────┘
         │ 1
         │
         │ N
┌────────┴───────────┐
│   Environment      │
├────────────────────┤
│ key                │
│ name               │
│ color              │
└────────┬───────────┘
         │ 1
         │
         │ N
┌────────┴────────────┐
│   FeatureFlag       │
├─────────────────────┤
│ key                 │
│ name                │
│ kind (bool/multi)   │
│ description         │
│ on (boolean)        │
│ variations[]        │
│ targeting           │
│   - targets[]       │
│   - rules[]         │
│   - fallthrough     │
└─────────────────────┘
```

### Schema Details

#### Project
```typescript
interface Project {
  key: string;           // "my-project"
  name: string;          // "My Project"
  environments: Environment[];
  tags: string[];
}
```

#### Environment
```typescript
interface Environment {
  key: string;           // "production"
  name: string;          // "Production"
  color: string;         // "417505" (hex)
  confirmChanges: boolean;
}
```

#### FeatureFlag
```typescript
interface FeatureFlag {
  key: string;                    // "new-checkout-flow"
  name: string;                   // "New Checkout Flow"
  description: string;
  kind: "boolean" | "multivariate";
  creationDate: number;           // Unix timestamp
  archived: boolean;
  on: boolean;                    // Flag enabled?
  variations: Variation[];
  environments: {
    [envKey: string]: FlagEnvironmentConfig;
  };
}

interface Variation {
  _id: string;
  value: any;                     // true/false for boolean, any JSON for multivariate
  name?: string;
  description?: string;
}

interface FlagEnvironmentConfig {
  on: boolean;
  targets: Target[];
  rules: TargetingRule[];
  fallthrough: Fallthrough;
  offVariation: number;           // Index into variations array
  prerequisites: Prerequisite[];
}

interface Target {
  values: string[];               // ["user-123", "user-456"]
  variation: number;              // Index into variations array
}

interface TargetingRule {
  _id: string;
  description?: string;
  clauses: Clause[];
  variation?: number;             // Fixed variation
  rollout?: Rollout;              // Percentage rollout
}

interface Clause {
  attribute: string;              // "email", "country", "customAttr"
  op: string;                     // "in", "matches", "greaterThan", etc.
  values: any[];
  negate: boolean;
}

interface Rollout {
  variations: WeightedVariation[];
  bucketBy: string;               // "key" or custom attribute
}

interface WeightedVariation {
  variation: number;              // Index into variations array
  weight: number;                 // 0-100000 (percentage * 1000)
}

interface Fallthrough {
  variation?: number;
  rollout?: Rollout;
}

interface Prerequisite {
  key: string;                    // Key of prerequisite flag
  variation: number;              // Required variation
}
```

---

## 8. Technical Architecture

### System Diagram

```
                    ┌─────────────────────────────────────────────┐
                    │              Deployment Targets              │
                    ├─────────────────────────────────────────────┤
                    │                                             │
                    │  ┌─── Dev (Vite) ───────────────────────┐  │
                    │  │  Vite Plugin: basicAuthPlugin()       │  │
                    │  │  Checks BASIC_AUTH_USERNAME/PASSWORD   │  │
                    │  │  from process.env                     │  │
                    │  └───────────────────────────────────────┘  │
                    │                                             │
                    │  ┌─── Docker Prod (Nginx) ──────────────┐  │
                    │  │  docker-entrypoint.sh                 │  │
                    │  │  → generates .htpasswd from env vars  │  │
                    │  │  → nginx auth_basic directive          │  │
                    │  └───────────────────────────────────────┘  │
                    │                                             │
                    │  ┌─── Vercel ────────────────────────────┐  │
                    │  │  Serverless Function: api/auth.ts     │  │
                    │  │  Checks Basic Auth header             │  │
                    │  │  → Pass: serves index.html            │  │
                    │  │  → Fail: 401 Unauthorized             │  │
                    │  └───────────────────────────────────────┘  │
                    └──────────────────┬──────────────────────────┘
                                       │
                                       ▼
┌──────────────────┐          ┌─────────────────┐
│    Browser       │  HTTPS   │   Static SPA    │
│                  │◄────────►│   (React App)   │
│  Basic Auth      │          │   dist/         │
│  prompt (if on)  │          └────────┬────────┘
└──────────────────┘                   │
                                       │ HTTPS API Calls
                                       │ (Authorization: Bearer <token>)
                                       │ Token from localStorage or .env
                                       ▼
                           ┌─────────────────────────┐
                           │  LaunchDarkly API       │
                           │  app.launchdarkly.com   │
                           │                         │
                           │  GET /api/v2/projects   │
                           │  GET /api/v2/flags/:key │
                           └─────────────────────────┘
```

### Docker Infrastructure

**No database or backend services needed** - this is a pure frontend SPA that calls LaunchDarkly API directly from the browser.

| Service  | Image        | Purpose                              | Port |
| -------- | ------------ | ------------------------------------ | ---- |
| dev      | node:20      | Vite dev server + Basic Auth plugin  | 5173 |
| prod     | nginx:alpine | Static build + optional Basic Auth   | 80   |
| vercel   | —            | Serverless function + static hosting | 443  |

### Tech Stack

**Language:** TypeScript
- **Justification:** Type safety prevents API response handling errors, better IDE support, catches bugs at compile time

**Framework:** React 18 + Vite
- **Justification:** Vite offers fastest dev experience, React has best ecosystem for dashboard UIs, widespread knowledge

**State Management:** TanStack Query (React Query) v5
- **Justification:** Purpose-built for API state, automatic caching/refetching, optimistic updates, reduces boilerplate

**Styling:** Tailwind CSS v4
- **Justification:** Rapid development, consistent design system, no CSS file overhead, great mobile-first utilities

**HTTP Client:** Fetch API (native) with TanStack Query
- **Justification:** No additional dependencies, modern browsers support, works seamlessly with React Query

**Routing:** React Router v7
- **Justification:** Standard for React SPAs, supports nested routes, URL state management

**Docker:** Docker + Docker Compose
- **Justification:** Easy local development, consistent environments, simple deployment

---

## 9. API Design

This app consumes LaunchDarkly's REST API. No custom backend API.

### LaunchDarkly API Endpoints Used

| Endpoint                                          | Method | Description                     | Response                  |
| ------------------------------------------------- | ------ | ------------------------------- | ------------------------- |
| `/api/v2/projects`                                | GET    | List all projects               | Project[]                 |
| `/api/v2/flags/{projectKey}`                      | GET    | List flags for project          | FeatureFlag[]             |
| `/api/v2/flags/{projectKey}/{flagKey}`            | GET    | Get specific flag details       | FeatureFlag               |
| `/api/v2/projects/{projectKey}/environments`      | GET    | List environments for project   | Environment[]             |

### Authentication
All requests include header:
```
Authorization: Bearer {api_access_token}
```

### Error Handling
- **401 Unauthorized:** Invalid or expired API token → Show re-authentication prompt
- **403 Forbidden:** Token lacks required permissions → Display permission error
- **404 Not Found:** Resource doesn't exist → Show friendly "not found" message
- **429 Rate Limited:** Too many requests → Implement exponential backoff, show notice
- **500 Server Error:** LaunchDarkly API issue → Display error, offer retry

---

## 10. UI/UX Guidelines

### Color Scheme
- **Primary:** Blue (#3b82f6) - LaunchDarkly brand color
- **Success:** Green (#10b981) - Flag enabled, successful operations
- **Warning:** Amber (#f59e0b) - Partial rollouts, cautions
- **Error:** Red (#ef4444) - Flag disabled, errors
- **Neutral:** Gray scale (#f9fafb to #1f2937) - Backgrounds, borders, text

### Typography
- **Font Family:** Inter (sans-serif) - clean, readable, modern
- **Headings:** 24px (H1), 20px (H2), 16px (H3) - bold weight
- **Body:** 14px - regular weight, 1.5 line height
- **Code:** JetBrains Mono (monospace) - for flag keys, JSON values

### Component Library
Use Headless UI + Tailwind CSS for:
- Dropdowns (project/environment selectors)
- Modals (API key setup)
- Disclosure panels (collapsible rule sections)
- Combobox (searchable flag list)

### Responsive Breakpoints
- **Mobile:** 0-767px (single column, stacked layout)
- **Tablet:** 768px-1279px (collapsible sidebar)
- **Desktop:** 1280px+ (fixed sidebar, spacious layout)

### Interactive Elements
- **Hover states:** Subtle background color change (#f3f4f6)
- **Active states:** Darker background (#e5e7eb)
- **Loading states:** Skeleton screens, spinner for long operations
- **Empty states:** Friendly illustrations with helpful messages

### Accessibility
- Keyboard navigation support (Tab, Enter, Escape)
- ARIA labels for screen readers
- Sufficient color contrast (WCAG AA minimum)
- Focus indicators visible on all interactive elements

---

## 11. Research Sources

### LaunchDarkly API & Feature Flags
- [LaunchDarkly API Overview](https://launchdarkly.com/docs/api)
- [Using the REST API](https://launchdarkly.com/docs/guides/api/rest-api)
- [API Access Tokens](https://launchdarkly.com/docs/home/account/api)
- [List Feature Flags Endpoint](https://launchdarkly.com/docs/api/feature-flags/get-feature-flags)
- [Targeting Rules Documentation](https://launchdarkly.com/docs/home/flags/target-rules)
- [Feature Flag Variations](https://launchdarkly.com/docs/home/flags/variations)
- [Percentage Rollouts](https://launchdarkly.com/docs/home/releases/percentage-rollouts)

### Dashboard UI/UX Best Practices
- [Dashboard UX Design Best Practices - Lazarev](https://www.lazarev.agency/articles/dashboard-ux-design)
- [Dashboard Design UX Patterns - Pencil & Paper](https://www.pencilandpaper.io/articles/ux-pattern-analysis-data-dashboards)
- [Effective Dashboard Design Principles 2025 - UXPin](https://www.uxpin.com/studio/blog/dashboard-design-principles/)
- [Dashboard UX Design Tips - Digiteum](https://www.digiteum.com/dashboard-ux-design-tips-best-practices/)

### API Security Best Practices
- [API Key Safety Best Practices - OpenAI](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety)
- [API Key Security - Legit Security](https://www.legitsecurity.com/aspm-knowledge-base/api-key-security-best-practices)
- [How to Store API Keys Securely - Strapi](https://strapi.io/blog/how-to-store-API-keys-securely)
- [API Security with Environment Variables - Hoop.dev](https://hoop.dev/blog/api-security-best-practices-protecting-secrets-with-environment-variables/)

### React/TypeScript Architecture
- [React Best Practices 2026 - Technostacks](https://technostacks.com/blog/react-best-practices/)
- [React Architecture Patterns 2025 - GeeksforGeeks](https://www.geeksforgeeks.org/reactjs/react-architecture-pattern-and-best-practices/)
- [Tao of React - Alex Kondov](https://alexkondov.com/tao-of-react/)
- [React.js 2026 Performance - Expert App Devs](https://medium.com/@expertappdevs/react-js-2026-performance-secure-architecture-84f78ad650ab)

### Docker + Vite + React
- [Containerizing Vite React TypeScript with Docker Compose](https://codeplater.hashnode.dev/step-by-step-guide-containerizing-your-vite-react-typescript-projects-with-docker-compose)
- [Production-Ready React TypeScript Vite Setup 2026](https://oneuptime.com/blog/post/2026-01-08-react-typescript-vite-production-setup/view)
- [Use Containers for React.js Development - Docker Docs](https://docs.docker.com/guides/reactjs/develop/)
- [Dockerizing Vite React - Innokrea](https://www.innokrea.com/dockerizing-the-frontend-do-it-right-with-react-js-vite/)

### Competitive Analysis (Open Source Alternatives)
- [7 Best Open Source LaunchDarkly Alternatives](https://openalternative.co/alternatives/launchdarkly)
- [LaunchDarkly Alternatives - ConfigCat](https://configcat.com/alternativefeatureflagservice/)
- [LaunchDarkly Alternatives - Flagsmith](https://www.flagsmith.com/blog/launchdarkly-alternatives)

---

## 12. Security Considerations

### API Token Storage (Current Implementation)
- **Browser localStorage:** Primary storage — user enters key via modal, stored only in browser
- **`.env` file:** Fallback — `VITE_LD_API_TOKEN` for development convenience
- **Priority:** localStorage > `.env`
- **Privacy:** API key is NEVER sent to or stored on any app server
- **Dockerfile:** No `ARG`/`ENV` for API token — removed to prevent baking into bundle

### Basic Auth Protection (Current Implementation)
- **Optional:** Enabled only when `BASIC_AUTH_USERNAME` and `BASIC_AUTH_PASSWORD` env vars are set
- **Server-side only:** Credentials never exposed in client JavaScript bundle
- **Supported targets:** Vite dev server, Docker/Nginx, Vercel Serverless Functions

### Best Practices Applied
- `.env.local` and `.env` in `.gitignore`
- Read-only LaunchDarkly tokens recommended
- No `dangerouslySetInnerHTML` or XSS vectors in codebase
- No hardcoded secrets in source code
- HTTPS enforced on Vercel; recommended for Docker/Nginx prod

---

## 13. Performance Considerations

### Optimization Strategies
- Fixed pagination of 5 flags per page to limit API load on LaunchDarkly
- Lazy load flag details (only fetch when user clicks)
- Cache API responses with TanStack Query (stale-while-revalidate)
- Debounce search input (300ms) to reduce API calls
- Optimize bundle size with code splitting (React.lazy)

### Target Metrics
- Initial load: < 2 seconds
- Flag list render: < 500ms
- Search responsiveness: < 100ms (with debounce)
- Bundle size: < 500KB gzipped

---

## Appendix: LaunchDarkly API Response Examples

### Example: Project List Response
```json
{
  "items": [
    {
      "key": "my-project",
      "name": "My Project",
      "tags": ["production"],
      "environments": [
        {
          "key": "production",
          "name": "Production",
          "color": "417505"
        }
      ]
    }
  ]
}
```

### Example: Feature Flag Response
```json
{
  "key": "new-checkout",
  "name": "New Checkout Flow",
  "description": "Enable new checkout",
  "kind": "boolean",
  "creationDate": 1609459200000,
  "archived": false,
  "on": true,
  "variations": [
    { "_id": "var1", "value": false },
    { "_id": "var2", "value": true }
  ],
  "environments": {
    "production": {
      "on": true,
      "targets": [
        { "values": ["user-123"], "variation": 1 }
      ],
      "rules": [
        {
          "_id": "rule1",
          "description": "Beta users",
          "clauses": [
            {
              "attribute": "segment",
              "op": "in",
              "values": ["beta"],
              "negate": false
            }
          ],
          "variation": 1
        }
      ],
      "fallthrough": { "variation": 0 },
      "offVariation": 0
    }
  }
}
```
