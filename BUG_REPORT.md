# Bug Report

## Status
INVESTIGATING

## Bug Title
Project `om-edh` missing from project list due to LaunchDarkly API default pagination limit of 20

## Bug Description
The main projects page at `/projects` does not show all projects. The project `om-edh` is missing from the list, but is accessible directly via `/projects/om-edh`. This indicates the project exists and the API token has access, but the projects page doesn't fetch it.

## Steps to Reproduce
1. Open http://localhost:5173/projects
2. Look for project `om-edh` in the list
3. It's not there
4. Navigate directly to http://localhost:5173/projects/om-edh
5. The project loads fine (flags are visible)

## Actual Result
Only the first 20 projects are shown. `om-edh` is beyond page 1 and is missing.

## Expected Result
All accessible projects should be displayed on the projects page, including `om-edh`.

## Context
- **Error Message**: None (no error, just incomplete data)
- **Environment**: localhost:5173, LaunchDarkly REST API v2
- **API Docs**: [List projects](https://launchdarkly.com/docs/api/projects/get-projects) — defaults to `limit=20`

---

## Root Cause Analysis

The issue is in [launchdarkly-client.ts:37-38](src/services/launchdarkly-client.ts#L37-L38):

```
GET /api/v2/projects?expand=environments
```

The LaunchDarkly API paginates by default with `limit=20`. Our code fetches only the first page and never follows `_links.next` for subsequent pages. If the account has >20 projects, any project beyond the first 20 is invisible.

```
API returns:  { items: [proj1..proj20], totalCount: 25, _links: { next: ... } }
Code reads:   data.items  →  only 20 projects shown
Result:       om-edh (project #21+) is missing
```

## Proposed Fixes

**Fix (Recommended): Fetch all pages by looping until no `next` link**

In `getProjects()`, loop through all pages using `offset` and `limit` parameters until all projects are collected.

- File: `src/services/launchdarkly-client.ts`
- Approach: Add `getAllProjects()` that fetches with `limit=20&offset=0`, then increments offset until `items` returned < limit or offset >= totalCount
- Low risk, handles any number of projects

## Verification Plan
- Manual: Open `/projects` and confirm `om-edh` is now visible
- Automated: Add test that verifies pagination logic fetches multiple pages
- Edge case: Verify single-page accounts still work (totalCount <= 20)
