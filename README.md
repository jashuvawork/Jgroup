# Jgroup

A small full-stack **team roster** app used to exercise the Cloud Agent development environment end to end.

- **`server/`** — Express + TypeScript REST API (in-memory store)
- **`web/`** — React + Vite + TypeScript single-page UI

## Prerequisites

- Node.js `>= 20` (repo is developed on Node 22)
- npm (workspaces)

## Getting started

```bash
npm install     # install all workspace dependencies
npm run dev     # start API (:3001) and web dev server (:5173) together
```

Then open http://localhost:5173. The web dev server proxies `/api/*` requests to the API on port `3001`.

## Scripts (run from the repo root)

| Command | Description |
| --- | --- |
| `npm run dev` | Run the API and web dev servers concurrently |
| `npm run build` | Type-check and build both packages |
| `npm run typecheck` | Type-check both packages |
| `npm run lint` | Lint the whole repo with ESLint |
| `npm start` | Run the built API server (`server/dist`) |

## API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Service health check |
| `GET` | `/api/members` | List roster members |
| `POST` | `/api/members` | Add a member (`{ "name": string, "role": string }`) |
| `DELETE` | `/api/members/:id` | Remove a member |

## Cloud Agent environment

`.cursor/environment.json` installs dependencies with `npm install` and launches the
API and web dev servers as named terminals, exposing ports `5173` (web) and `3001` (api).
