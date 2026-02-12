# Bug Report

## Status
INVESTIGATING

## Bug Title
Flags page limited to 20 flags (API default) and search only filters within those 20

## Bug Description
Two related issues on the project flags page (e.g. `/projects/om-edh`):

1. **Pagination shows only 20 flags**: The API defaults to `limit=20`. The code fetches one page and paginates client-side, so projects with hundreds of flags only show 20.
2. **Search only filters client-side within those 20**: The search bar does a `name.includes()` / `key.includes()` against the 20 already-fetched flags, missing the rest.

## Steps to Reproduce
1. Navigate to `/projects/om-edh`
2. Observe only 20 flags are listed (4 pages × 5)
3. Search for a flag name that exists beyond the first 20 — no results

## Actual Result
- Only 20 flags shown with client-side pagination
- Search only matches within those 20

## Expected Result
- Show only the first **5 flags**, no pagination, no page controls
- Search uses the LaunchDarkly API `filter=query:<term>` (case-insensitive partial match on key/name), paginated with 5 results per page and a "Load more" button (no total pages displayed)

## Context
- **API Docs**: `GET /api/v2/flags/:projectKey` supports `limit`, `offset`, and `filter=query:<term>` (case-insensitive substring match on key/name)
- **Current code**: `getFlags()` calls `/flags/${projectKey}?summary=true` with no limit/filter params

---

## Root Cause Analysis

**Problem 1 — Only 20 flags fetched:**
```
src/services/launchdarkly-client.ts:64
  → GET /flags/{projectKey}?summary=true    ← no limit param, API defaults to 20
```

**Problem 2 — Client-side-only search:**
```
src/features/flags/FlagList.tsx:22-31
  → filtered = flags.filter(f => f.name.includes(q) || f.key.includes(q))
  → Only filters within the 20 flags already in memory
```

**Data flow (current):**
```
API (default 20) → useFlags → FlagList (client filter + paginate) → 5 per page
```

**Data flow (desired):**
```
API (limit=5, offset=0) → useFlags → FlagList (display results + "Load more")
API (limit=5, offset=0, filter=query:term) → useFlags → FlagList (search results + "Load more")
```

## Proposed Fixes

### Files to change:
1. **`src/services/launchdarkly-client.ts`** — Update `getFlags()` to accept `limit` and `filter` params
2. **`src/hooks/useFlags.ts`** — Accept search query, pass to API, use `filter=query:<term>` when searching
3. **`src/features/flags/FlagList.tsx`** — Remove client-side filtering and pagination; show only API results; keep search bar wired to API query
4. **`src/features/flags/SearchBar.tsx`** — Add loading indicator prop for when API search is in flight

### Approach:
- Default fetch: `GET /flags/{projectKey}?summary=true&limit=5`
- When user types search: `GET /flags/{projectKey}?summary=true&filter=query:<term>&limit=5`
- Both default and search use offset-based pagination with `limit=5`
- Replace `<Pagination>` (prev/next page numbers) with a simple "Load more" button
- "Load more" increments offset by 5 and appends results; hidden when API returns < 5 items (no more results)
- No total pages displayed (reduces API overhead)
- Remove client-side `useMemo` filter logic
- Use debounced search → triggers new API call via react-query, resets offset to 0

## Verification Plan
- Manual: navigate to `/projects/om-edh`, verify only 5 flags shown with "Load more" button
- Click "Load more" — 5 more flags appended
- When no more flags, "Load more" button disappears
- Search for a flag known to be beyond position 20 — should appear in results
- Click "Load more" on search results — appends next 5 matches
- Clear search — resets to first 5 flags
- Run `npx vitest run`

## Fix Applied
- **Files Changed**:
  - `src/services/launchdarkly-client.ts` — `getFlags()` now accepts `limit`, `offset`, `query` params; builds URL with `filter=query:<term>`
  - `src/hooks/useFlags.ts` — Accepts `query` and `offset` options; passes to API; explicit `FeatureFlag[]` return type
  - `src/features/flags/FlagList.tsx` — Removed client-side filtering and `<Pagination>`; accumulation logic moved to `useEffect` to properly handle "Load more" appending; search resets offset to 0
  - `src/features/flags/SearchBar.tsx` — Added `isSearching` prop for loading indicator
- **Bug Fix (Load More not updating)**: Moved accumulation from render-time IIFE to `useEffect` — the IIFE was calling `setState` during render and consuming the offset comparison before fresh data arrived, preventing append
- **Test Results**: 50/50 tests passed, 0 regressions
- **Verification**: Awaiting manual confirmation from user
