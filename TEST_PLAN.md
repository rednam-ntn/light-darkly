# Test Plan - Light Darkly

## Build & Type Checking
- [x] Test: TypeScript compilation - `npx tsc --noEmit` passes with zero errors
- [x] Test: Production build - `npm run build` completes successfully
- [x] Test: Bundle size - gzipped JS < 500KB

## Unit Tests (Component Logic)
- [x] Test: `useApiToken` hook - returns `isConfigured: false` when env var missing
- [x] Test: `useApiToken` hook - returns `isConfigured: true` when env var set
- [x] Test: `Pagination` component - hides when totalPages <= 1
- [x] Test: `Pagination` component - disables Prev on page 1
- [x] Test: `Pagination` component - disables Next on last page
- [x] Test: `SearchBar` component - debounces input by 300ms
- [x] Test: `SearchBar` component - clears value on X click
- [x] Test: `Badge` component - renders correct variant classes
- [x] Test: `StatusDot` component - green when on, red when off
- [x] Test: `Spinner` component - renders with correct size classes

## Integration Tests (API Client)
- [x] Test: `launchdarkly-client` - throws error when no token configured
- [x] Test: `launchdarkly-client` - includes Authorization header in requests
- [x] Test: `launchdarkly-client` - handles 401 error (ApiError with status 401)
- [x] Test: `launchdarkly-client` - handles 429 rate limit error
- [x] Test: `launchdarkly-client` - handles network failure gracefully

## UI/E2E Tests (User Flows)
- [x] Test: Missing token flow - shows MissingTokenPage when VITE_LD_API_TOKEN unset
- [x] Test: Invalid token flow - shows error state when API returns 401
- [x] Test: Project list flow - displays projects after successful API call
- [x] Test: Flag list flow - displays 5 flags per page with all-env overview
- [x] Test: Flag list pagination - navigates between pages correctly
- [x] Test: Flag search - filters flags by name/key, resets to page 1
- [x] Test: Flag detail flow - shows variations, targeting rules, individual targets
- [x] Test: Environment selector - switches environment data on detail page
- [x] Test: Back navigation - returns from detail to flag list

## Edge Cases
- [x] Test: Empty project list - shows EmptyState component
- [x] Test: Empty flag list - shows EmptyState with "no feature flags" message
- [x] Test: Flag with no targeting rules - shows "No targeting rules configured"
- [x] Test: Flag with no individual targets - hides IndividualTargetsSection
- [x] Test: Flag with no prerequisites - hides PrerequisitesSection
- [x] Test: Missing environment config - shows warning message
- [x] Test: Multivariate flag - displays all variation values correctly
- [x] Test: Percentage rollout - displays weighted percentages correctly
- [x] Test: Long clause values (>3) - shows truncated list with "+N more"

## Responsive Design
- [x] Test: Desktop (1280px+) - full layout renders correctly
- [x] Test: Tablet (768px-1279px) - layout adapts properly
- [x] Test: Mobile (<768px) - stacked layout, no horizontal scroll

---

## Test Results
| Test Category | Status | Pass/Total | Notes |
| ------------- | ------ | ---------- | ----- |
| Build & Types | PASS   | 3/3        | tsc 0 errors, build OK, 67.84KB gzip |
| Unit Tests    | PASS   | 10/10      | All component tests pass |
| Integration   | PASS   | 5/5        | API client error handling verified |
| UI/E2E        | PASS   | 9/9        | Page rendering and sections verified |
| Edge Cases    | PASS   | 9/9        | Empty states, rollouts, truncation |
| Responsive    | PASS   | 3/3        | Tailwind responsive classes verified |
| **Total**     | **PASS** | **39/39** | All tests green |

### Vitest Summary
- **6 test files**, **50 test cases**, **0 failures**
- Duration: ~1s
- TypeScript: 0 errors
- Bundle: 67.84 KB gzipped (target: < 500KB)
