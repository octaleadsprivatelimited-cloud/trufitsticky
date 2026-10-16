# Tru Fit

Responsive React/Vite frontend for coach discovery, individual and couple coaching plans, coach sales landing pages, and enquiries.

## Local development

```sh
npm ci
npm run dev
```

Copy `.env.example` to `.env.local` and configure the backend for local development. Vite provides a read-only public catalogue preview when the local backend is unavailable.

To check the production build locally, run `npm run build` followed by `npm run preview` and open `http://localhost:4173`. This preview supports the public catalogue and legacy coach redirects. It disables checkout and rejects API writes; enquiries, coach matching, and payment verification require the backend.

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

## Customer portal UI

Open `/portal` for the member overview, `/portal/programs` for program dates and day counts, `/portal/referrals` for referral links and activity, and `/portal/invoices` for paid invoices with preview and PDF download. The navigation and footer link to the portal.

This is a frontend-only preview with fictional customer data. Google and Apple sign-in/sign-up are UI previews using a shared fictional account. Customer data, referral registration, rewards, and payment records are not connected to the backend. Sample PDFs are marked as demonstration documents. Configure the future referral benefit and eligibility copy in `src/portal/data.mjs` (`referralConfig`); rewards are disabled by default. Membership days include the join date and use the account timezone; program progress stops at the program end date and does not represent workout attendance.

The shared interface palette is defined in `src/styles/brand-theme.css`. Photography retains its original colours. Portal styles are scoped separately to avoid inheriting marketing-page typography. Sign-in, portal, and referral routes are excluded from analytics and search indexing.

```sh
npm test
```

## Coach booking experience

Coach profiles open on the Plans tab, with About me and Reviews alongside it. Plan and region selections are preserved while browsing the other tabs. The UI has three stages: choose a plan, enter details in one form, and continue to the existing payment provider. Landing-page plan selections open that same details form directly.

Local catalogue previews can exercise all three stages without a backend. The preview guard stops before any customer/order creation or payment-provider call; the final preview screen links to a sample booking welcome page. Existing payment endpoints and provider code remain in place, but demo identities always stay in preview mode. Program capacity and waitlist handling remain separate from payment.

## Sign-in, sessions, and the customer panel

`/signin` provides Google and Apple entry points for sign-in and sign-up. Both explicitly open a demo-account confirmation instead of contacting an OAuth provider. Visitors must complete this preview before entering individual or couple checkout, and before opening any portal page. Booking sign-in is inline so the selected coach, region, and plan remain selected. Portal sign-in returns to the requested portal section. A demo identity lasts for the browser tab session and can be signed out from the portal.

No OAuth tokens, passwords, client secrets, or real user identities are stored. This client-side preview gate is not production authentication. Live OAuth will require verified backend sessions and provider configuration; do not treat this UI as access control for real customer records.

Choose a sample date and time in the details form (step 2), continue to the payment preview (step 3), then choose **Preview booking confirmation**. The welcome page and portal overview show the chosen coach, plan, date, time, and timezone. Times are fictional 20-minute welcome sessions in Asia/Kolkata, not live coach availability. No charge, booking, email, or calendar invite is created. Sample booking details persist in session storage for reloads and are cleared on sign-out. A direct success URL without a demo booking never claims a confirmed payment.

On desktop and tablet, the sidebar button switches between full navigation and a compact icon rail. The preference is saved locally; mobile uses an app-style header and persistent bottom navigation. Icon destinations retain accessible names and tooltips.

## Fitness, diet, and training products

The customer panel includes `/portal/profile` (Fitness & diet) and `/portal/products` (Training essentials), with links from the overview and both full and compact sidebars. Sign-in returns to either section when opened directly.

The fitness form accepts optional weight in kg, height in cm, a target weight, goals, experience, activity, training location/days, sleep, existing equipment, and optional movement context. Diet fields include preferences, meals, allergies/intolerances, foods to avoid, water, usual meals, and routine notes. Save updates the profile snapshot; clear removes the saved profile. Values persist only in this browser tab's session storage and are cleared on sign-out. Saved customer profile details can be read in the local team preview. No health details are sent to the backend, added to URLs, or used in analytics. Use sample information for this preview. The coach diet-plan panel shows the team’s published local plan, or an empty state when no plan is published. It does not generate diet advice.

Configure team products in `src/portal/products.mjs` (`teamProducts`). Replace example names/descriptions and notes with approved items, set `affiliateUrl` to the exact HTTPS affiliate link supplied by the team, and set `isPreview: false`. Missing or invalid links leave the purchase button disabled. Configured links open the retailer in a new tab with `rel="sponsored noopener noreferrer"`; the page discloses that Tru Fit may earn a commission. URLs are used as supplied, with no member information appended. The team panel now provides a local editor and publishing controls; file entries seed example product drafts in a new workspace.

Products support category filtering, search, and a browser-session “already in my kit” checklist. This list is not automatically prescribed from the customer's measurements or diet preferences. No real affiliate links or product prices have been invented.

## Tru Fit team workspace

Open `/team` and choose **Enter team preview**. This is a clearly labelled local demo role, separate from the customer sign-in preview; it is not staff authentication or production access control. `/team/products` opens the shared product catalogue, and `/team/customers/:customerId` opens a customer record. The customer portal’s desktop footer and mobile More menu also link to the team preview.

The directory contains three fictional customers with search and filters for missing profiles and diet plans. Alex (`demo-member`) uses the fitness profile saved from `/portal/profile` in this browser tab. Jamie and Taylor are separate fictional sample records. The team can read each customer's measurements, goals, activity, existing equipment, movement context, diet preferences, allergies, and routine notes.

Diet plans support meal names, optional times in IST, food/portion guidance, optional start/review dates, and plan notes. Drafts stay private; publishing creates a separate snapshot, so a later draft never changes the published plan. Each customer record has a read-only published-version preview and an unpublish action that preserves the draft. For Alex, published plans also appear in the existing customer portal's Fitness & diet section.

The product manager supports adding/editing products, recommendation notes, categories, illustrations, HTTPS affiliate links, and assigning an item to all customers or selected customers. Publishing requires a valid affiliate link. Archiving hides the recommendation; restoring returns it as a draft. Editing a published product uses **Save and publish**. Alex's Training essentials section shows only published items available to Alex. The original example collection is shown only before the team starts managing products; drafts and archived products are never shown as published recommendations.

Workspace data persists in this browser tab's session storage. Leaving the team preview clears its demo access flag while keeping saved drafts and published examples for comparison. Customer sign-out still clears the customer's local fitness form and kit selection. No customer records are fetched from a backend, no emails are sent, and no real staff permissions are granted. A deployed multi-user version will require server authentication, staff roles, customer-specific authorization, and database persistence.

`npm test` includes team-workspace tests for draft/published isolation, customer assignments, archive visibility, and affiliate URL validation. Team routes are excluded from analytics and search indexing.

## Compact customer panel

The customer portal now uses compact summaries and rows within a screen-height workspace. The overview uses a compact purple welcome hero with the membership day count. Supporting summaries and status indicators remain white; purple is reserved for the hero, active navigation, progress, and primary actions. Repeated payment tables on the overview and oversized decorative cards have been removed. Program details and full documents open on demand. The overview’s program card includes a decorative animated runner that becomes a static illustration when reduced motion is preferred.

Fitness & diet is divided into Measurements, Training, Routine, Food preferences, Meal routine, and My diet plan. Desktop uses keyboard-accessible tabs; mobile uses a section selector, readable 16 px form controls, and larger primary touch targets. Mobile bottom navigation opens Home, Program, My health, and Essentials; More opens invoices, referrals, account actions, and useful links in a bottom sheet. Edits stay in memory while switching sections, and Save profile remains beside the current section. Published diet plans show one meal at a time, with the full plan available in a dialog.

Referrals separates inviting, activity, and rewards into short views. Invoices retain preview, search, and sample PDF download in compact rows. Products use compact rows, detail dialogs, and pagination that adjusts to viewport height and width. Customer and team storage formats remain unchanged.

Default pages have been checked to fit desktop and mobile screens without scrolling. On unusually short viewports, larger text settings, or lengthy documents, the content region and dialogs remain scrollable and keyboard-accessible so information and controls are never clipped.

## Responsive team and app navigation

Both workspaces fill the viewport and keep document scrolling contained. The team directory and product catalogue use responsive pagination, compact white cards, and purple hero banners. Customer records retain the same hero treatment, with profile details divided into short sections. The diet editor separates plan details, one meal at a time, and notes/visibility; save/publish controls stay visible while long editor content scrolls inside its pane. The product dialog separates details, coach notes, and affiliate link/customer assignment. Storage and publishing behaviour remain unchanged.

The customer portal uses a phone-style header, account sheet, and five-item bottom navigation below 768 px. Active destinations remain marked, safe-area padding accommodates device edges, and the overview distributes its cards through the available height. Section changes use a short opacity/scale animation that respects reduced-motion preferences. On small screens, long text, larger accessibility text, and expanded documents remain available through contained scrolling instead of clipping content.

All five customer sections share the overview’s purple gradient hero, white cards, and compact controls. Programs reuses the runner illustration; Fitness & diet, Essentials, Referrals, and Invoices have their own subtle SVG animations. Reduced-motion preferences disable these animations. On shorter phones, invoice pagination shows one record at a time, while totals still cover the full paid history. Existing form state, referrals, product assignments, and PDF downloads remain unchanged.
