# Light Darkly

A read-only web dashboard for viewing LaunchDarkly feature flags, targeting rules, and variations.

## Prerequisites

- Node.js 20+
- LaunchDarkly API access token (read-only)

## Quick Start

1. Clone the repository
2. Create `.env` file:
   ```
   VITE_LD_API_TOKEN=your-launchdarkly-api-token
   ```
3. Install and run:
   ```bash
   npm install
   npm run dev
   ```
4. Open http://localhost:5173

## Getting a LaunchDarkly API Token

1. Go to LaunchDarkly → Account Settings → Authorization
2. Create a new access token with **Reader** role
3. Copy the token to your `.env` file

## Docker

### Development
```bash
docker compose --profile dev up
```

### Production
```bash
VITE_LD_API_TOKEN=your-token docker compose --profile prod up --build
```

## Tech Stack

- TypeScript + React 18 + Vite
- TanStack Query (React Query) for API state
- Tailwind CSS for styling
- React Router v7 for navigation
