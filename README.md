# SIGE Frontend

Frontend for SIGE (Sistema de Gestión Estudiantil) built with [Next.js](https://nextjs.org/) 16, React 19, and Tailwind CSS v4.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS v4
- **Language:** TypeScript 5
- **Runtime:** Bun

## Prerequisites

- [Bun](https://bun.sh/) >= 1.0
- [Node.js](https://nodejs.org/) >= 20.19.0

## Project setup

```bash
# 1. Clone and install dependencies
git clone <repo-url>
cd sige-frontend
bun install

# 2. Create your .env from the sample
cp .env.sample .env

# 3. Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment variables

Copy `.env.sample` to `.env` and adjust as needed:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3000` |

Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## Available scripts

```bash
bun run dev       # Start development server
bun run build     # Create production build
bun run start     # Start production server
bun run lint      # Run ESLint
```

## Project structure

```
app/
├── layout.tsx    # Root layout (fonts, global styles)
├── page.tsx      # Home page
└── globals.css   # Global styles + Tailwind
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Tailwind CSS v4](https://tailwindcss.com/)
