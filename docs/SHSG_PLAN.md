# SHSG website and platform plan

Source: _SHSG Revised Technical Partner Proposal_, October 2026, supplied by the project owner. The proposal is a planning reference; its milestones require separate scope approval. This document does not authorize integrations, spending, publishing, or migration of existing websites.

## Direction

Build one useful entry point for the Southern Home family while keeping Southern Home Handyman and Boxwood distinct. The homepage helps people identify their project, understand which brand to approach, and prepare the first conversation. Preserve the existing domains, inquiry paths, and useful content during the transition.

Visual direction: the supplied Handoff/YourGPT screenshots inform spacious sans-serif typography, deep green surfaces, mint emphasis, rounded photography, and clear service blocks. Content remains specific to SHSG’s homeowner experience. Page sequence: centered hero with a home photograph, service choices, two division introductions, three practical steps, local project planner, FAQs, and a grouped footer.

Interaction direction: staggered hero entrance; a sticky header and progressive image depth; restrained link, image, and shared accordion/modal transitions. Respect reduced motion. Keep meaningful content visible without animation support.

## Implemented foundation

- Responsive SHSG homepage at `/`, with the group and its two divisions introduced separately.
- Common root-layout header/footer, data-driven navigation, and individual homepage section components.
- Configurable new-tab Login links into the operations app. The app now has `/login` and `/signup` frontend pages sharing a Tailwind auth layout, with React Hook Form Controller and Yup validation. A tab-scoped mock AuthProvider/useAuth now supports signup, login, expiry, and logout, with a guarded sample estimate dashboard. Backend authentication, sessions, registration, and role enforcement remain unimplemented; Phase 1 is not complete.
- Existing division websites linked directly, without rewriting or redirecting them.
- A local project brief planner that suggests a division and downloads a text brief. It does not submit leads, upload files, quote a price, or book an appointment.
- Shared Button, Typography, Select, Textarea, Modal, and Accordion components.
- Server-rendered page content; client JavaScript limited to navigation disclosures, the mobile menu, planner, and interactive shared controls.
- Local optimized images with responsive sizes, hero preload, secondary lazy loading, descriptive alternatives, and source records.
- Page title/description, one main heading, skip link, labeled controls, keyboard menu behavior, native validation, and reduced-motion styles.
- Shared component examples collected at `/components`, with the API explorer linked in development.
- Website interaction tests in CI, alongside existing API/client/UI checks.

## Launch decisions before production

Confirm brand spelling and artwork, approved service categories, service areas, contact details, actual business process, and image rights/approved project photographs. Current photos are illustrative interiors, not evidence of SHSG-completed projects. Confirm final domain before adding canonical URLs, social URLs, or business structured data. Obtain approved privacy and consent copy before collecting personal data.

Review the page at 360/390px, tablet, and desktop widths. Check touch navigation, keyboard focus, screen-reader headings and forms, text contrast, 200% zoom, dark OS preference, and reduced motion. Verify images, Core Web Vitals, and the production build in an unrestricted environment. Run an automated accessibility audit and inspect the browser console before launch. Live browser visual checks were unavailable in the implementation session; these remain a release check.

Do not publish invented reviews, project counts, pricing, service guarantees, or appointment availability. Add future service divisions only when operationally ready.

## Phased delivery

| Phase | Focus                          | Demonstrable acceptance                                                                                                                                      |
| ----- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0     | Discovery and technical design | Owner approves MVP, data/permission model, workflow states, wireframes, integration assumptions, and existing website/SEO inventory.                         |
| 1     | Foundation and Request Service | Customer/property/lead/media/activity records; mobile request with multiple photos; authenticated owner dashboard; unauthorized users cannot browse records. |
| 2     | AI intake and classification   | Structured summaries, categories, missing information, confidence, and human escalation; uncertain cases do not auto-dispatch work.                          |
| 3     | Assisted estimates             | Versioned line items and assumptions; owner edits, approves, and sends; approved data sources are recorded.                                                  |
| 4     | Customer acceptance            | Versioned scope/terms and acceptance evidence; required acknowledgements block scheduling until recorded.                                                    |
| 5     | Providers and availability     | Qualifications, territory, value limits, documents, and fresh availability; missing capacity remains unverified.                                             |
| 6     | Two-sided scheduling           | Customer windows match eligible provider capacity; conflicts are surfaced and unstaffed appointments cannot confirm.                                         |
| 7     | Qualified marketplace          | Only eligible jobs are visible; transactional claims prevent duplicate assignment; overrides are auditable.                                                  |
| 8     | Field operations and changes   | Permitted GPS/time events, photos, materials, receipts, and change requests; approved customer pricing cannot change without authorization.                  |
| 9     | Manager quality control        | Pending/review/correction states; required evidence and manager approval gate closure.                                                                       |
| 10    | Payment and closeout           | Approved payment integration, verification/evidence, acknowledgement, and controlled overdue/exception states.                                               |
| 11    | Job costing and learning       | Quoted/actual costs, margin, payout approval, and reviewable recommendations without rewriting history.                                                      |
| 12    | Integrations and scale         | Approved vendor connections, webhook reconciliation, reporting, backup/restore, rollback, load checks, and operational handoff.                              |

## Next implementation milestone: real request intake

1. Confirm the request fields, service coverage rules, consent, allowed photo formats/limits, and spam controls with the owner.
2. Add PostgreSQL customer, property, lead, lead-source, media, and activity models with reviewed Alembic revisions. Apply committed revisions during deployment; do not generate or execute migrations through the public website.
3. Add FastAPI schemas, business services, repositories, and a request endpoint. Validate and rate-limit on the server; add safe upload storage with ownership and access checks.
4. Add separate `Leads` resources to the app and website clients as each needs them. The website submits requests through explicit Next route handlers; operational reads require authenticated roles.
5. Replace the local-only planner with a genuine request flow. Show success only after durable storage, and provide recoverable errors without losing input. Introduce photo uploads and clear privacy/consent copy.
6. Build an owner lead list/detail view in the operations app, including media, source, timeline, and authorized status changes.
7. Test real submission, multiple photos, retries, invalid input, unauthorized access, and recovery. Demonstrate that a customer request appears in the owner dashboard before declaring Phase 1 complete.

## Website and SEO transition

Inventory existing URLs, page titles/descriptions, forms, analytics, search performance, and hosting access before moving content. Preserve useful URLs where possible; use reviewed page-to-page 301 mappings where needed. Keep division pages substantial and distinct. Maintain existing brand inquiry routes until replacements are proven. Do not redirect entire domains to this homepage.

## Operating boundaries

FastAPI/PostgreSQL enforce roles and workflow decisions. AI can summarize, suggest, or flag uncertainty; authorized people approve consequential estimates, assignment exceptions, QC, and payments. Keep an audit history for workflow transitions. Validate third-party access in discovery and keep credentials server-side. SHSG retains control over repositories, infrastructure, database, and vendor accounts.
