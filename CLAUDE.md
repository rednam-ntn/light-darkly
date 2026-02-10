# Claude Code Project Configuration

## Vibe Builder Project Reference

### ⛔ CONTEXT OVERFLOW RECOVERY
**When context gets full or you feel lost in a long session:**
1. Re-read the vibe-builder skill: `.claude/skills/vibe-builder/SKILL.md`
2. Re-read `IMPLEMENTATION_PLAN.md` to check current progress
3. Re-read `TEST_PLAN.md` (if exists) to check test status
4. Follow the workflow strictly - especially the checkpoints below!

### ⚠️ WORKFLOW CHECKPOINTS (MANDATORY - DO NOT SKIP!)
| After Phase | Action |
| --- | --- |
| Phase 3 (Coding) complete | → Create TEST_PLAN.md → **⛔ STOP for Human review** |
| Phase 4 (Test Plan) approved | → Execute tests autonomously |
| Phase 5 (Testing) complete | → Report results → Enter Phase 6 loop |

**CRITICAL:** After finishing ALL coding tasks, you MUST:
1. Create TEST_PLAN.md
2. **⛔ STOP and wait for Human approval**
3. DO NOT run any tests until Human reviews TEST_PLAN.md!

### Project Summary (from PRD.md)
- **App Type**: Web App - LaunchDarkly Feature Flag Viewer (read-only)
- **Tech Stack**: TypeScript + React 18 + Vite + TanStack Query + Tailwind CSS + React Router v7
- **Core Features**:
  1. API key loaded from `.env` (VITE_LD_API_TOKEN) - NO UI input
  2. Project selection dropdown
  3. Flag list with ALL-environment overview, fixed 5 flags/page pagination
  4. Flag detail page with environment selector dropdown
  5. Targeting rules, variations, individual targets, prerequisites display
- **Docker**: Dev (Vite on :5173), Prod (Nginx on :80)
- **No backend/database** - direct API calls to LaunchDarkly

### Current Phase
- **Status**: Phase 2 approved, ready for coding
- **Next**: Phase 3 (Autonomous Coding)

### Primary Documentation
- `PRD.md` - Full product requirements (lazy-read sections when needed)
- `IMPLEMENTATION_PLAN.md` - Task tracking with checkboxes
- `TEST_PLAN.md` - Test cases and results (created in Phase 4)

### Coding Guidelines
- Follow `IMPLEMENTATION_PLAN.md` for tasks
- Use typed language as specified in PRD.md
- Mark completed tasks with `[x]`
- Keep code minimal and focused
