# Bug Report

## Status
RESOLVED

## Bug Title
App fails to start — `@vercel/speed-insights` missing from node_modules

## Bug Description
Running `npm run dev` starts Vite but immediately throws an import resolution error for `@vercel/speed-insights/react`. The page fails to load in the browser.

## Steps to Reproduce
1. Run `npm run dev`
2. Open `http://localhost:5173/`
3. Vite throws: `Failed to resolve import "@vercel/speed-insights/react" from "src/main.tsx"`

## Actual Result
Vite internal server error — page does not render.

## Expected Result
App starts and renders normally.

## Context
- **Error Message**: `Failed to resolve import "@vercel/speed-insights/react"` at `src/main.tsx:7:30`
- **Environment**: Node v22.22.0, npm 11.11.0, Vite 6.4.1

---

## Root Cause Analysis
`@vercel/speed-insights@^1.3.1` is declared in `package.json` but **not present in `node_modules`**. The dependency tree is out of sync — likely caused by a partial install or a corrupted lock file.

```
package.json  →  "@vercel/speed-insights": "^1.3.1"  ✅ declared
node_modules  →  @vercel/speed-insights               ❌ missing
main.tsx:7    →  import { SpeedInsights } from "..."   💥 fails
```

## Proposed Fix
**Run `npm install`** to sync `node_modules` with `package.json`. No code changes needed.

## Verification Plan
1. Run `npm install`
2. Run `npm run dev` — app should start without errors
3. Run `npm run build` — should succeed with 0 errors

## Fix Applied
- **Action**: `npm install` — added 1 missing package (`@vercel/speed-insights`)
- **Build**: `tsc -b && vite build` — 0 errors, built in 1.06s
- **Status**: RESOLVED
