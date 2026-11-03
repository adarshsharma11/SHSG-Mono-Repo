# SHSG operations app

Runs on **http://localhost:9002**. From the monorepo root:

```bash
pnpm install --frozen-lockfile
pnpm dev:app
```

## Account pages

- `/` waits for session restoration, then goes directly to `/dashboard` when signed in or `/login` when signed out.
- `/login`: email and password sign-in form.
- `/signup`: email and password account creation form.
- Both share the auth route group and AuthFrame. GuestAccess gates the entire frame inside each page, so signed-in visitors never paint the login/signup layout. The group layout always renders its page slot for Next validation. The route-group name does not appear in URLs. API/explorer pages remain outside the auth layout.

The layout uses Tailwind utilities, a dark two-panel desktop composition, and a single-column form on smaller screens. The right panel is illustrative brand content, with no copied testimonial or AI claims. The local photograph is reused from the website’s [recorded image source](../website/public/images/IMAGES.md); it is not presented as completed SHSG work.

The shared `AuthForm` uses React Hook Form `Controller` to render `@shsg/ui` Input controls. Yup and `yupResolver` supply validation. There is no manual `useState` for fields, errors, or loading: RHF owns values, field errors, root errors, and isSubmitting.

Validation runs on blur, on submit, and on change after a failed submission. Email is required, trimmed, and format-checked. Login requires an existing password without applying signup length rules. Signup requires a 12–128 character password; no confirmation or other field is added. Passwords are never trimmed. Controls use correct autocomplete values and forward refs so RHF can focus invalid fields.

## Working mock authentication

The root AuthProvider exposes `useAuth` from `src/hooks/useAuth.ts`. It supplies status, isAuthenticated, user, token, expiresAt, signIn(credentials), signUp(credentials), and signOut(). Using the hook outside its provider throws a clear error.

Try the demo account:

```text
Email: demo@shsg.local
Password: DemoHome2026!
```

The Login page has a **Use demo account** control that fills these values through React Hook Form. Sign in to open `/dashboard`, or create a new mock account through `/signup`. Successful signup signs in automatically. Existing signed-in visitors to either auth page return to the dashboard.

Mock accounts and the session live in sessionStorage for this browser tab. Reload restores a valid session. Logout removes the session while retaining tab-scoped mock accounts for another login. Closing the tab removes its demo data. Sessions expire after two hours; expiry is checked on restoration, by timer, and when returning to the page. No automatic anonymous login runs on mount.

Created accounts store a salted PBKDF2 verifier, not the entered password. The seed credentials above are a public fixture. Use sample credentials only. Web Crypto requires localhost or HTTPS. Corrupt/expired sessions are discarded. Passwords are cleared from form fields after submission attempts; credentials and tokens are not sent to any backend service.

**This is a browser demo, not production authentication.** Its random `demo-` token is not a server-validated credential, and client route guards are not authorization. The browser owner can alter demo storage. There is no backend registration, session service, role enforcement, password recovery, or real customer data access. Replace the mock adapter with server-backed authentication and server-side authorization before using operational data.

## Dashboard

`src/app/(workspace)/layout.tsx` shares DashboardShell and always preserves its page slot. Each workspace page wraps its content with WorkspaceAccess, which owns the client auth guard and redirect. This keeps page segments in Next’s instant-navigation validation tree. Signed-out visitors see a loading/redirect state and return to `/login`; dashboard content is not flashed during restoration. New workspace pages must use the same page-level boundary.

- A white sidebar with collapse control, in-page navigation, account menu, settings, and logout.
- Mobile navigation uses the shared focus-managed Modal.
- Account settings displays the demo identity and expiry and offers logout.
- One dashboard at `/dashboard`, with a sample bathroom estimate, direct-cost and price summary, scope, customer placeholder, and item detail panel.
- Search, labor/material filters, selected-item details, bounded quantity edits, recalculated totals, and local text export work. Estimate edits reset on reload.
- Prices are sample allowances, before tax. Illustrative price uses a 20% gross margin (`cost / 0.8`), not a 20% markup. Export is labeled as a demo, not a customer quote.

Layout and controls use Tailwind and shared Button, DropdownMenu, Modal, and Table components. Shared popup color tokens are scoped to the workspace, including popups mounted under body. No additional UI package was added.

## Verification

```bash
pnpm --filter @shsg/app test
pnpm --filter @shsg/app exec next typegen
pnpm --filter @shsg/app typecheck
pnpm --filter @shsg/app lint
pnpm --filter @shsg/app build
pnpm format:check
```

Tests cover form validation, signup/login through useAuth, session restoration, expiry, duplicate accounts, wrong credentials, guard behavior, settings/logout, pending state, error redaction, and estimate interactions. CI includes the app tests.

Manual checks: review 320/390px, tablet, and desktop widths; use Tab and Enter; blur invalid fields; submit empty and valid forms; create a mock account; reload the dashboard; log out and sign back in; follow login/signup links; check password-manager autofill and focus/error announcements; confirm the promotional panel does not crowd the mobile form. A connected browser was unavailable during implementation, so visual checks remain a release requirement.

The developer API explorer remains available at `/api` in development. See the [API-client README](../../packages/api-client/README.md) for environment configuration and the [SHSG plan](../../docs/SHSG_PLAN.md) for the backend roadmap.
