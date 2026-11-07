# SHSG website

The customer-facing Next.js app runs on **http://localhost:9001**.

From the monorepo root:

```bash
pnpm install --frozen-lockfile
pnpm dev:website
```

The homepage is available without a running backend. For API explorer requests, start FastAPI/PostgreSQL using the [root setup](../../README.md).

## Website architecture

The root `app/layout.tsx` mounts a common SiteShell, so website pages share one header and footer. Pages supply their own main content; the shell does not introduce a nested main landmark.

```text
components/
├── site/
│   ├── site-shell.tsx       # Common header/content/footer composition
│   ├── site-header.tsx      # Desktop dropdowns and mobile navigation
│   ├── site-footer.tsx      # Shared footer groups
│   ├── app-link.tsx         # Accessible new-tab Login link
│   ├── brand.tsx
│   ├── navigation.ts        # Header/footer link data
│   └── site.css             # Website shell styles and tokens
└── home/
    ├── sections/           # Shared family, process, planner, and FAQ sections
    ├── homepage.tsx        # Composition for three distinct homepage designs
    ├── home-heroes.tsx     # Photo, animated workshop, and editorial heroes
    ├── home-views.tsx      # Links between the three designs
    ├── services.ts         # Sixteen services and four browsing groups
    ├── service-explorer.tsx # Search, category filters, service selection
    ├── toolbench.tsx       # Animated SVG tools with a pause control
    ├── project-stories.tsx # Selectable, honestly labelled inspiration
    ├── home-content.ts     # Project choices and FAQs
    └── project-planner.tsx # Local brief preparation and download
content/divisions.ts        # Brand information reused across the website
```

The recommended photography-led homepage is `/`. Two linked alternatives are available at `/home/workshop` (animated tools) and `/home/transformations` (editorial project inspiration). Each page links to the other designs near the hero and at the end. The alternatives are marked `noindex` while being compared.

All homepage styling uses Tailwind utilities. Static page sections render on the server; filters, project selection, story switching, and the tool pause control use small client components. Motion respects reduced-motion preferences, and the animated workshop has a pause button. Site styles apply to common navigation/footer; the standalone component examples remain at `/components`, with `/api` available in development.

The structure follows the reference public website’s separation of header/footer and content components, adapted to App Router layouts with minimal client boundaries. Navigation uses regular links and disclosure buttons, rather than ARIA application menus. Links back to homepage sections use `/#section` so they also work from other routes.

The design takes direction from the supplied Handoff/YourGPT screenshots: spacious sans-serif typography, navy surfaces, pale-blue emphasis, rounded photography and controls, clear service blocks, and grouped footer links. SHSG content remains focused on homeowners and its two divisions; no third-party AI features, statistics, or certifications are claimed.

The homepages use shared UI components from `@shsg/ui`. A selected service carries into the planner without discarding a typed description. The planner does not submit a lead or book a visit. It downloads a brief locally and links to the relevant existing division website. Photography is illustrative inspiration, not a completed-project portfolio. Neither AI, pricing, scheduling, nor payment is connected to these pages.

See the [SHSG implementation plan](../../docs/SHSG_PLAN.md) for the proposal-based roadmap, launch checks, and next real intake milestone.

## Login destination

Login links in the common header and footer open the operations app in a new tab with `target="_blank"` and `rel="noopener noreferrer"`. They also announce the new-tab behavior to assistive technology. This links to the app; it does not implement authentication.

Set the destination in `apps/website/.env.local`:

```dotenv
SHSG_APP_URL=http://localhost:9002
```

The default is the local app root. A deployed environment should set its actual application URL, including a login path if that route exists. Only HTTP(S) URLs without credentials, query strings, or fragments are accepted. The root server layout reads this intentionally public destination and passes it to the header/footer; API settings stay server-only. Restart development after changing environment settings and rebuild production when changing a statically rendered destination.

## Verification

```bash
pnpm --filter @shsg/website test
pnpm --filter @shsg/website typecheck
pnpm --filter @shsg/website lint
pnpm --filter @shsg/website build
pnpm format:check
```

Interaction tests cover common shell landmarks, new-tab app links, URL configuration, cross-page anchors, desktop dropdown focus/dismissal, the mobile menu, required project details, division routing, and local download without a network submission. CI runs them with the shared UI and API-client tests.

Manual checks: use 360/390px, tablet, and desktop viewports; open/close desktop dropdowns and the mobile menu by touch, Tab, and Escape; verify Login opens the app in a new tab; follow service links; prepare repair and renovation briefs; download the brief; open/close FAQs and the dialog; test keyboard-only navigation, 200% zoom, dark OS preference, and reduced motion. The page must remain readable if scroll animations are unsupported.

## Images and performance

Local illustrative photographs are stored under `public/images`; source details are in [IMAGES.md](public/images/IMAGES.md). They are not presented as SHSG portfolio work. Replace them with approved brand/project photography before release if required.

The hero uses `next/image` preload with responsive sizing. The secondary image loads lazily. Text remains server-rendered, with client code limited to interactions. Existing Geist is reused for headings and body text; no animation library or additional font download was added.

## Environment and API clients

Copy `.env.example` to `.env.local` for server-side overrides. Browser code calls same-origin `/api` routes. Website-owned resources live under `api/resources` and receive an injected Axios instance. See the [API-client README](../../packages/api-client/README.md).

## Header behavior and page review

The header uses icon-led dropdown rows with a compact 38px desktop Login control (40px on mobile). Action buttons have text labels without arrow adornments; Login still opens the configured app in a new tab and announces that behavior.

Desktop chevrons rotate around their center; mobile menu lines transition into a close icon. Both dropdowns and the mobile panel transition in and out. Panels stay mounted while closing, with inert, aria-hidden, and removed tab stops making them non-interactive immediately. Escape restores trigger focus; outside clicks, link selection, and viewport breakpoint changes close menus. Reduced motion removes animation. The mobile panel overlays content rather than shifting the page.

The page review also corrected heading contrast on light backgrounds, matched image sizes to actual content widths, removed the sticky-header blur layer, reserved image dimensions, and added minimum-width safeguards for long grid content. The homepage and header remain CSS-driven without an added animation library.

Before release, visually review 320/390px, tablet, and desktop widths, dropdown opening/closing, mobile scrolling, keyboard focus, and reduced motion. Automated interaction checks do not replace visual testing; a connected browser was unavailable during this implementation.

## Website theme and shared logo

The brand color is **#1B2951**. `components/site/theme.css` owns the website palette, including primary hover/active colors, pale-blue accents, neutral surfaces, and the shared UI tokens. Header, hero, planner, buttons, links, and navigation icons use these tokens. Changing this palette does not change the operations app's control theme.

The website Brand wrapper uses `Logo` from `@shsg/ui/logo`. Its url prop controls the destination; dark headers use the light variant. The same shared logo is used by the app's auth pages and dashboard sidebar. See the [shared logo API](../../packages/ui/README.md#logo).

The supplied magnolia artwork lives at `public/images/brand/logo.webp` in each frontend. Logo uses the framework image component, preserves its 486×374 aspect ratio, and requests a small responsive image size suitable for the header/sidebar.
