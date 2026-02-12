# Light Darkly

[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel&logoColor=white)](https://light-darkly.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A lightweight, read-only web dashboard for viewing LaunchDarkly feature flags, targeting rules, and variations across all projects and environments.

## Features

- **API Key via Browser** — Enter your LaunchDarkly API key directly in the browser. Stored only in localStorage, never sent to any server.
- **Project Browser** — Browse all accessible projects with "Load more" pagination.
- **All-Environment Overview** — See flag status (ON/OFF) across every environment at a glance.
- **Flag Detail with Expandable Sections** — Expand any environment to view targeting rules, individual targets, default rules, and prerequisites.
- **Search & Filter** — Find flags by name/key, filter by status, type, or tags.
- **Optional Basic Auth** — Protect the app with HTTP Basic Auth via environment variables.
- **Responsive Design** — Works on desktop, tablet, and mobile.

## Quick Start

### Option 1: Run locally

```bash
git clone https://github.com/rednam-ntn/light-darkly.git
cd light-darkly
npm install
npm run dev
```

Open http://localhost:5173 and enter your LaunchDarkly API key via the UI.

### Option 2: Docker

```bash
# Development (hot reload)
docker compose --profile dev up

# Production (Nginx)
docker compose --profile prod up --build
```

### Option 3: Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Frednam-ntn%2Flight-darkly)

## Configuration

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_LD_API_TOKEN` | No | Default LaunchDarkly API token (fallback if no browser key set) |
| `BASIC_AUTH_USERNAME` | No | Enable Basic Auth — username |
| `BASIC_AUTH_PASSWORD` | No | Enable Basic Auth — password |

- **API Key priority:** Browser localStorage > `.env` file
- **Basic Auth:** Enabled only when both `BASIC_AUTH_USERNAME` and `BASIC_AUTH_PASSWORD` are set. Works on Vite dev server, Docker/Nginx, and Vercel (serverless function).

### Getting a LaunchDarkly API Token

1. Go to LaunchDarkly > **Account Settings** > **Authorization**
2. Create a new access token with **Reader** role
3. Enter the token in the app UI, or set `VITE_LD_API_TOKEN` in `.env`

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript 5.7 |
| Framework | React 18 + Vite 6 |
| State | TanStack Query v5 |
| Styling | Tailwind CSS 3.4 |
| Routing | React Router v7 |
| Icons | Lucide React |
| Deployment | Vercel / Docker (Nginx) |

## Project Structure

```
src/
├── components/         # Reusable UI components (Button, Card, Modal, etc.)
│   ├── layout/         # Header, AppLayout
│   └── ui/             # Badge, Collapsible, Dropdown, etc.
├── features/           # Feature modules
│   ├── flags/          # Flag list, detail, sections, search, filter
│   ├── projects/       # Project list, selector
│   └── error/          # Missing/Invalid token pages
├── hooks/              # Custom hooks (useApiToken, useFlags, useProjects)
├── services/           # API client, api-key-store
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## Security

- API key stored **only in browser localStorage** — never sent to any app server
- No `dangerouslySetInnerHTML` or XSS vectors
- Basic Auth credentials are server-side only (not in client bundle)
- Dockerfile does not bake any secrets into the image

## License

[MIT](LICENSE)
