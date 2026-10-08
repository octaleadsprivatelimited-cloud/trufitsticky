# Tru Fit

Responsive React/Vite frontend for coach discovery, individual and couple coaching plans, coach sales landing pages, and enquiries.

## Local development

```sh
npm ci
npm run dev
```

Copy `.env.example` to `.env.local` and configure the backend for local development. Vite provides a read-only public catalogue preview when the local backend is unavailable.

## Production

The Vercel project uses `npm run build` and serves `dist`. Public frontend configuration is in `.env.production`; it contains public analytics and verification identifiers only. Never put private credentials in VITE variables. The `/backend/admin_functions/*` rewrite forwards API calls to the existing Betrufit backend. `SEO_API_URL` supplies the absolute catalogue URL for build-time SEO generation.

Coach landing pages:
- `/start/jaswant-medidi`
- `/start/srikar-peddapally`

Published testimonials supply member stories and real star ratings; empty reviews do not generate fictional endorsements. Coach hover videos use the existing shared sample until individual videos are supplied.

## Checks

```sh
npm run build
npm run test:analytics
```

Analytics uses optional consent for GA4 and Microsoft Clarity and remains off on localhost by default. Payment and health-questionnaire pages exclude recording. Backend payment integrations and their provider dashboard settings remain managed by the existing backend.
