# @shsg/ui

Shared React components for Southern Home Services Group. The package is consumed from the monorepo as source, so both Next.js apps compile it directly.

## Logo

The shared brand mark and wordmark are available from `@shsg/ui` or `@shsg/ui/logo`.

```tsx
import Link from 'next/link';
import { Logo } from '@shsg/ui/logo';

<Logo url="/" />
<Logo as={Link} url="/dashboard" />
<Logo as={Link} url="/" variant="light" />
<Logo as={Link} url="/dashboard" compact aria-label="SHSG dashboard" />
```

`url` is the destination of the logo link. `as` optionally supplies a router Link component so Next.js navigation stays client-side; the default is a native anchor. `variant="light"` supports dark surfaces. `compact` renders only the mark while keeping the brand's accessible name. Standard anchor props and className are forwarded. Omit src to use the SVG fallback. Supply src, imageWidth, and imageHeight to use a brand image; these dimensions reserve its aspect ratio. imageAs optionally accepts a framework image component, such as Next Image, without adding a Next.js dependency to the shared package. The image is decorative inside the named link, so screen readers announce the brand once.

```tsx
import Image from 'next/image';

<Logo as={Link} url="/" src="/images/brand/logo.webp" imageAs={Image} imageWidth={486} imageHeight={374} />;
```

The supplied magnolia image is served from each app's own `public/images/brand/logo.webp`. `url` controls navigation; `src` controls the image. Light variants change the wordmark color, without recoloring the supplied artwork.

## Dropdown Menu and Tooltip

Website routes: `/dropdown-menu` and `/tooltip`. Import from `@shsg/ui` or the matching `@shsg/ui/dropdown-menu` and `@shsg/ui/tooltip` subpaths. Both components are client components and reuse the existing Button and theme tokens; no dependency was added.

```tsx
<DropdownMenu
  label="Visit actions"
  items={[
    { id: "details", label: "View details", onSelect: () => setDetailsOpen(true) },
    { id: "history", label: "Visit history", href: "/history" },
    { id: "receipt", label: "Download receipt", disabled: true },
    { id: "divider", type: "separator" },
    { id: "archive", label: "Archive visit", danger: true, onSelect: archiveVisit },
  ]}
/>

<Tooltip content="Adjust service notification preferences." side="top">
  <Button aria-label="Notification settings" size="icon">…</Button>
</Tooltip>
```

DropdownMenu requires a unique item `id`, text action labels, and a `label` for its trigger and menu. Its optional `trigger` replaces the visible trigger content while preserving the accessible label. `align` is `start` or `end` (default); `disabled` prevents opening. Menu actions can be callbacks or native links. Arrow Down/Up on the trigger opens at the first/last enabled action. Within the menu, arrows wrap, Home/End jump, and character keys perform prefix typeahead. Enter/Space activate native button items; Enter activates links. Escape closes and restores trigger focus. Tab closes and continues the normal page tab sequence. Selection restores focus before calling the callback; outside pointer/focus events close without stealing focus. Menus do not trap focus.

Tooltip requires one child element that forwards `aria-describedby` to its actual focusable DOM element. It preserves any existing description IDs and associates its own `role="tooltip"` only while open. `content` is text, not interactive UI. Preferred `side` is `top` (default), `bottom`, `left`, or `right`. Hover delay defaults to 300 ms; focus opens immediately. A short leave delay lets the pointer move onto the tooltip, and Escape dismisses it. Keep icon-button accessible labels and essential instructions independent of the tooltip. Disabled controls cannot receive keyboard focus; provide their explanation on a separate focusable control or as visible text.

Popups use fixed positioning, a shared measurement hook, viewport clamping, preferred-side flipping, and resize/scroll tracking. They portal to the body or their nearest open native dialog so they remain usable within Modal. Entry motion respects reduced motion. The components do not implement nested submenus, menu checkboxes/radios, or interactive tooltip contents.

## Accordion

Website route: `/accordion`. Import from `@shsg/ui` or `@shsg/ui/accordion` in a Client Component.

```tsx
<Accordion
  multiple
  defaultValue={['included']}
  items={[
    {
      value: 'included',
      title: 'What is included?',
      content: <p>Service details.</p>,
    },
    {
      value: 'prepare',
      title: 'How should I prepare?',
      content: <p>Preparation instructions.</p>,
    },
  ]}
/>
```

Item values must be unique and stable. The component defaults to a single expandable section; `multiple` allows several. For controlled usage, pass a string array `value` and `onValueChange`; for uncontrolled usage use `defaultValue`. Single mode displays the first supplied value. `headingLevel` accepts 2, 3 (default), or 4. Disabled headings cannot be activated and are skipped by Arrow Up/Down and Home/End navigation. Native buttons supply Enter/Space behavior. Heading IDs, `aria-expanded`, and `aria-controls` connect triggers and labelled regions.

Panels animate their grid height and chevron rotation. Closed panels become inert and `aria-hidden` immediately, while completing their visual collapse. They remain mounted so input drafts survive closing; effects inside collapsed content continue running. Reduced motion removes these transitions. Keep titles free of nested interactive controls and choose heading levels to match the surrounding document.

## Table and Pagination

Website route: `/table`. It includes sortable/filterable demo bookings, row action menus, a no-results recovery, compact customer/invoice rows, and pagination boundary states. Import from `@shsg/ui`, `@shsg/ui/table`, or `@shsg/ui/pagination`.

```tsx
<Table scrollLabel="Booking records">
  <TableCaption>Upcoming bookings</TableCaption>
  <TableHeader><TableRow><TableHead>Visit</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
  <TableBody><TableRow><TableCell>SHSG-1042</TableCell><TableCell>Scheduled</TableCell></TableRow></TableBody>
</Table>
<Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
```

Table and its slots are native, server-compatible elements with typed attributes and React 19 refs. Available slots: TableCaption, TableHeader, TableBody, TableFooter, TableRow, TableHead, and TableCell. TableHead defaults to `scope="col"`; use `scope="row"` for row headers. Sorting is owned by the consumer: use a real header button and update its header's `aria-sort`. Row clicks are not added automatically; provide explicit links or menu actions. The wrapper is a named, keyboard-focusable scrolling region for narrow screens. `density` is `comfortable` (default) or `compact`; `className` styles the table and `containerClassName` styles its wrapper.

Pagination is a controlled Client Component with 1-based `page`, `totalPages`, `onPageChange`, optional `disabled`, and native nav attributes/ref. It marks the active page with `aria-current="page"`, disables boundary controls, and limits large ranges with ellipses. Zero/nonfinite total pages render no page buttons and disabled navigation. Invalid page values are normalized for display; the parent retains ownership of its actual state. Use `aria-label` to distinguish multiple pagination instances. Filtering, sorting, fetching, and resetting the page remain consumer responsibilities.

## Empty State

Website route: `/empty-state`. Import from `@shsg/ui` or `@shsg/ui/empty-state`. EmptyState is server compatible and supports `title`, optional `description`, decorative `icon` (false hides it), `actions`, rich children, `compact`, and `headingLevel` 2, 3 (default), or 4. Native div props and refs are forwarded. It is static content by default; announce recovery outcomes separately with Alert or a status region.

```tsx
<EmptyState title="No bookings match" description="Try a different service or clear the search." actions={<Button onClick={clearSearch}>Clear search</Button>} />
```

Use an action that helps the person move forward. Inside a table, put EmptyState within a TableCell spanning all columns. Use a Client Component for callbacks, or a real link for navigation.

Tabs now also animate their tab-bar indicator, independently of panel animation. The underline slides horizontally or vertically; pill/enclosed indicators slide and resize. ResizeObserver updates dimensions when labels or container sizes change, with window-resize fallback. Enabled tabs use a pointer cursor; disabled tabs retain the not-allowed cursor. Reduced motion disables indicator movement. The initial server-rendered selected tab retains a static highlight until measurements are available.

## Spinner and Skeleton

The website's `/loading-states` route demonstrates page placeholders, list loading, and simulated submission feedback. Import from `@shsg/ui`, `@shsg/ui/spinner`, or `@shsg/ui/skeleton`.

```tsx
import { Spinner, Skeleton, Button } from "@shsg/ui";

<Spinner label="Loading services" size="md" />
<Skeleton shape="rect" animation="shimmer" className="h-40" />
<Skeleton shape="circle" />
<Skeleton className="w-2/3" />
<Button loading loadingText="Saving…" loadingIndicator={<Spinner decorative size="sm" tone="inherit" />}>
  Save
</Button>
```

Spinner is an inline native span with a decorative SVG, `role="status"`, a customizable accessible `label` (default `Loading`), and hidden label text. Sizes are `sm`, `md` (default), `lg`, and `xl`. Tones are `primary` (default), `muted`, and `inherit`. Use `decorative` when another element already communicates loading, such as a busy button. Its span ref and native attributes are forwarded.

Skeleton is a decorative div with `aria-hidden="true"`; it does not announce each placeholder. Shapes are `text` (default), `rect`, and `circle`. Animations are `pulse` (default), `shimmer`, and `none`. Customize dimensions through `className` or `style`. The div ref is forwarded; skeletons do not accept children. Mark the actual content region `aria-busy` while loading and provide one meaningful loading message, preferably outside that busy region. Match placeholder dimensions to the final content to limit layout shifts. System reduced-motion preferences stop spinner, pulse, and shimmer animations.

## Card and Section

The website's `/card` route demonstrates surfaces, service summaries, nested sections, and a working notification-settings example. All components are server compatible; interactive children need their usual client boundary.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Section, Button } from '@shsg/ui';

<Section id="upcoming-visits" title="Upcoming visits" description="Review your next service.">
  <Card>
    <CardHeader>
      <CardTitle as="h3">Home cleaning</CardTitle>
      <CardDescription>Visit SHSG-1042</CardDescription>
    </CardHeader>
    <CardContent>Arrival window: 9:00–11:00 AM</CardContent>
    <CardFooter>
      <Button>View visit</Button>
    </CardFooter>
  </Card>
</Section>;
```

Card variants are `outline` (default), `elevated`, `soft`, and `plain`; padding is `sm`, `md` (default), or `lg`. Slots are optional and can be rearranged. CardTitle accepts `as="h2" | "h3" | "h4"` (default `h3`) to fit the document hierarchy. Card and its slots forward native attributes and React 19 refs. Card is a noninteractive div: put real links or buttons inside it rather than relying on a clickable container. Subpath imports are available at `@shsg/ui/card` and `@shsg/ui/section`.

Section renders a native section, heading, optional paragraph `description`, optional `actions`, and children. `headingLevel` defaults to 2 and accepts 2, 3, or 4. `divided` defaults to true; use false for a section without the top border. An explicit `id` connects the heading through `aria-labelledby`. Without an ID, a string title supplies `aria-label`; for rich titles, provide an explicit accessible name or `aria-labelledby`. No automatic landmark role is added to Card.

## Tabs

The website's `/tabs` route includes controlled and uncontrolled examples, three control styles, disabled tabs, vertical orientation, manual activation, and a draft input that survives tab switches. Import from `@shsg/ui` or `@shsg/ui/tabs` in a Client Component.

```tsx
'use client';
import { Tabs } from '@shsg/ui';

<Tabs
  label="Account settings"
  defaultValue="profile"
  variant="underline"
  animation="slide-up"
  items={[
    {
      value: 'profile',
      label: 'Profile',
      content: <p>Your profile details.</p>,
    },
    {
      value: 'visits',
      label: 'Visits',
      content: <p>Your scheduled visits.</p>,
    },
    {
      value: 'billing',
      label: 'Billing',
      content: <p>Your receipts.</p>,
      disabled: true,
    },
  ]}
/>;
```

Each item's `value` must be unique and stable; labels should contain text or an accessible name, without nested interactive controls. The required `label` names the tablist. Variants are `underline` (default), `pills`, and `enclosed`. Panel entrance animations are `fade` (default), `slide-up`, `slide-left`, `scale`, `blur`, and `none`, lasting 240 ms. Reduced motion disables panel and control transitions. Inactive panels are hidden immediately so only one panel is exposed to assistive technology; no outgoing interactive panel is left visible during animation.

Use `defaultValue` for uncontrolled tabs, or `value` with `onValueChange` for controlled tabs. Do not switch modes during the instance's lifetime. The first enabled tab is used when no valid selection exists; if the selected item disappears or becomes disabled, the rendered selection falls back to the first enabled tab without emitting a user-change callback. Empty and all-disabled lists have no active panel.

`orientation` is `horizontal` (default) or `vertical`. Arrow keys move focus and skip disabled tabs, wrapping at the ends. Home/End move focus to the first/last enabled tab. `activationMode="automatic"` (default) selects on arrow movement; `manual` moves focus without selection until Enter/Space or a click. Tab leaves the list for the active panel. Use manual activation when panel content is expensive to load. Stable generated IDs connect each tab and panel across multiple instances.

`keepMounted` defaults to true to preserve form drafts and local component state. Set false to unmount inactive content; its state will reset when revisited. A hidden mounted panel's effects continue running, so pause expensive background work yourself or opt out of mounting. The native root div's ref and attributes are forwarded.

The existing Vitest suite covers loading accessibility, submission blocking/completion, card actions, section names and headings, tab associations, roving focus, manual activation, controlled selection, state preservation, and unavailable tabs. CSS motion still requires visual verification in a real browser.

## Badge and Alert

Import from `@shsg/ui`, `@shsg/ui/badge`, or `@shsg/ui/alert`. Website examples are at `/badge` and `/alert`, linked from Home and Modals.

```tsx
import { Badge, Alert } from "@shsg/ui";

<Badge variant="success" dot>Completed</Badge>
<Badge variant="warning" appearance="outline" size="sm">Needs review</Badge>
<Badge aria-label="12 open requests">12</Badge>

<Alert variant="success" title="Payment received">
  Your receipt is ready to view.
</Alert>
<Alert variant="danger" title="Payment failed">
  Check your payment details and try again.
</Alert>
```

Both components share semantic variants `neutral`, `primary`, `info`, `success`, `warning`, and `danger`, with `soft`, `solid`, and `outline` appearances. Colors come from the existing `--shsg-*` tokens and follow the system dark theme or a `.dark` ancestor. No new dependencies or duplicate theme configuration are needed.

Badge renders a static `<span>` with native attributes and a React 19 span ref. Defaults: `variant="neutral"`, `appearance="soft"`, `size="md"`, `shape="pill"`. Sizes are `sm`, `md`, and `lg`; shapes are `pill` and `rounded`. Optional `dot` and `icon` are decorative. Keep visible text that conveys status, and give numeric counts context through nearby text or `aria-label`. Badges do not announce changes by default and are not buttons or links. Long labels wrap within their container.

Alert renders a `<div>` with native attributes and a React 19 div ref. Defaults: `variant="info"` and `appearance="soft"`. It supports optional `title`, rich `children`, `actions`, and a built-in decorative status icon; pass `icon={false}` to hide it or a React node to replace it. The title renders in a paragraph, so keep its content valid there. Use the children slot for lists and other block content.

Alerts use `role="status"` for polite feedback; `danger` defaults to `role="alert"` for assertive feedback. Override `role` when urgency differs from appearance. Live-region behavior depends on when content changes: keep the region mounted and update its text after an action when an announcement is needed. Static server-rendered messages may not be announced on initial load. Avoid relying on color or icons alone to communicate meaning.

### Dismissible alerts

Static Badge and Alert instances work in Server Components. For actions or dismissal, render them from a Client Component. Providing `onDismiss` shows a native button; the parent owns visibility, and `dismissLabel` defaults to `Dismiss alert`. Dismissal does not automatically hide the alert or move focus; the consumer decides the destination after removing it. The website example moves focus to the Restore button after dismissal.

```tsx
'use client';

import { useState } from 'react';
import { Alert, Button } from '@shsg/ui';

export function VisitNotice() {
  const [visible, setVisible] = useState(true);
  return visible ? (
    <Alert
      variant="warning"
      title="Review your visit"
      onDismiss={() => setVisible(false)}
      dismissLabel="Dismiss visit reminder"
      actions={
        <Button size="sm" onClick={() => setVisible(false)}>
          Mark reviewed
        </Button>
      }
    >
      Confirm your property access instructions before the visit.
    </Alert>
  ) : (
    <p>Reminder dismissed.</p>
  );
}
```

Use `pnpm --filter @shsg/ui test` to run the shared component tests and interactive website alert examples. Coverage includes visible labels, decorative icons, refs, native props, announcement roles, keyboard dismissal, controlled removal, actions, status updates, and dismissal focus recovery in the showcase.

## Typography

Import `Typography` from `@shsg/ui` or `@shsg/ui/typography`. See `/typography` in the website for the complete type scale and replayable motion examples.

```tsx
import { Typography } from "@shsg/ui/typography";

<Typography variant="h1">Service visits</Typography>
<Typography as="h2" variant="h4">Your next visit</Typography>
<Typography tone="muted">We'll take care of the details.</Typography>
<Typography as="span" variant="small" weight="semibold">Confirmed</Typography>
<Typography animation="slide-up">Welcome home.</Typography>
```

Variants: `display`, `h1`–`h6`, `lead`, `body` (default), `small`, `caption`, `overline`, `code`, and `quote`. Heading variants use the matching HTML heading by default; `code` and `quote` use their native elements, and the remaining variants use paragraphs. Use `as` to set semantics independently of appearance. Element-specific attributes and React 19 refs are typed to the selected element.

Tones: `default`, `muted`, `primary`, `success`, `danger`, and `inherit`. Optional `weight`, `align`, and `truncate` handle emphasis and layout. Truncation needs a constrained parent width; provide the full text elsewhere when essential. Motion is opt-in: `none` (default), `fade`, `slide-up`, or `blur-in`. It runs on mount and can be replayed by changing the React key. Native `style` supports animation duration and delay overrides. Reduced-motion preferences disable these effects. Typography works in Server Components without adding a client boundary.

## Modal

Import `Modal` from `@shsg/ui` or `@shsg/ui/modal`. See `/modal` in the website for the playground, all eight animation options, sizes, forms, nested dialogs, and scrolling content.

```tsx
'use client';

import { useState } from 'react';
import { Button, Modal, Typography } from '@shsg/ui';

export function VisitDetails() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>View visit</Button>
      <Modal open={open} onOpenChange={setOpen} title="Your service visit" description="Review the details before you continue." animation="slide-up" footer={<Button onClick={() => setOpen(false)}>Done</Button>}>
        <Typography>Your professional will arrive at the scheduled time.</Typography>
      </Modal>
    </>
  );
}
```

The controlled `open` prop synchronizes a native `<dialog>` through `showModal()` and `close()`. The browser supplies the top layer, focus containment, outside-content inertness, and focus restoration to the opener. `title` is required and becomes the accessible name; optional `description` and external `aria-describedby` IDs are associated automatically. Keep title and description content valid inside their heading and paragraph elements.

`initialFocusRef` optionally focuses an element inside the dialog. Escape, the close button, and clicking the backdrop request `onOpenChange(false)`; `closeOnEscape` and `closeOnBackdrop` default to true. The close button can be customized with `closeLabel`, or hidden with `showCloseButton={false}` when an equivalent exit action is provided. Background scroll locking is shared between stacked dialogs and restores the prior body overflow style when the final dialog closes. Native `method="dialog"` forms also synchronize through `onOpenChange`.

Sizes: `sm`, `md` (default), `lg`, `xl`, `full`. Animation: `fade`, `scale` (default), `slide-up`, `slide-down`, `slide-left`, `slide-right`, `blur`, `none`. Entrance speed: `fast` (160 ms), `normal` (280 ms), `slow` (450 ms). Closing uses a shorter ease-in fade with smaller movement: 120 ms, 220 ms, or 350 ms respectively. The panel scrolls within the viewport while its header and optional footer remain visible. `className` styles the panel; `overlayClassName` styles the full-screen dialog container. Override `--shsg-modal-backdrop` to retheme the dimmed background.

Keep the Modal mounted and change `open` so exit transitions can complete. The dialog stays in the native top layer while `data-state="closing"` runs its opacity, transform, and filter transitions. Its content becomes inert during exit. Native `close()`, focus restoration, and scroll unlocking happen after the fade completes, with a duration-based fallback if transition events are missing. Reopening cancels a pending close. Entry uses CSS `@starting-style`; closing does not depend on discrete `display` or `overlay` transitions. Reduced-motion preferences and `animation="none"` close immediately. Direct native `close()` calls and native dialog forms still synchronize state but bypass the controlled exit animation. No animation or dialog dependency was added.

The existing Vitest suite covers modal state synchronization, accessible text, initial focus, close requests and restrictions, scroll locking, and typography semantics/refs. jsdom does not implement top-layer focus trapping, inertness, or rendered CSS animations; verify those in a real browser when changing dialog behavior.

## Inputs

The website's `/input` route shows all native input types, component states, and a complete React Hook Form example. Import from `@shsg/ui` or `@shsg/ui/input`:

```tsx
import { Input, Textarea, Select, Checkbox, Radio, Switch, FileInput, InputField } from '@shsg/ui/input';
```

All controls forward their native element ref and accept native attributes. `label`, `description`, `error`, and `success` provide associated field text. IDs are generated when omitted. Provide a visible label or an accessible name such as `aria-label`. External `aria-describedby` IDs are preserved. Errors take precedence over success and set `aria-invalid`.

Text controls use `size="sm" | "md" | "lg"` (default `md`) and `variant="outline" | "filled" | "underline"` (default `outline`). Checkboxes, radios, and switches use native checked state and support the three sizes. For native multi-select, use `<Select multiple>`; `visibleOptions` sets the native list height. Pass options as children. `FileInput` supports `multiple` and `accept`, and intentionally omits value/defaultValue since file values cannot be assigned by an application.

Use `defaultValue`/`defaultChecked` for uncontrolled fields, or `value`/`checked` with `onChange` for controlled fields. Keep that choice stable for the field's lifetime. File inputs remain uncontrolled. Hidden inputs render only the native element. Read-only applies to native text controls; native select and checkable controls use `disabled` when interaction must be blocked.

### React Hook Form

Use these controls in a Client Component. Install `react-hook-form` in the consuming application when calling its hooks. No resolver or validation library is required.

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { Button, Input, InputField } from '@shsg/ui';

type Values = { name: string; email: string };

export function ContactForm() {
  const form = useForm<Values>({ mode: 'onBlur' });
  return (
    <form noValidate onSubmit={form.handleSubmit((values) => console.log(values))}>
      <InputField form={form} name="name" label="Name" required rules={{ required: 'Name is required' }} />
      <Input
        label="Email"
        type="email"
        required
        error={form.formState.errors.email?.message}
        {...form.register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Enter a valid email',
          },
        })}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

`InputField` infers field names and validation values from the typed form, including nested paths. Use direct registration for Select, Textarea, and selection controls; none require Controller. Pass native constraints for browser semantics and matching React Hook Form rules for custom error messages. With `noValidate`, React Hook Form owns validation feedback.

The showcase validates on blur and revalidates submitted errors on change. It includes password confirmation, email/phone patterns, numeric bounds, HTTP(S) URL checks, date limits, and per-file MIME and 2 MB limits. Its preview uses an allowlist that excludes passwords and file contents. This is a local demo with no persistence or backend submission; production endpoints must independently validate incoming values and files.

Shared tokens remain in `src/styles.css`, using Tailwind v4's existing `@theme inline` model. Field surfaces add `--shsg-field`, `--shsg-field-muted`, and `--shsg-muted`; apps can override them. Existing strict TypeScript and ESLint configurations are reused without adding a duplicate config package.

Run `pnpm --filter @shsg/ui test` for component tests and the website form integration tests (kept in the UI test suite to reuse its existing Vitest/Testing Library setup).

## Workspace usage

From the repository root:

```bash
pnpm --filter @shsg/website add @shsg/ui@workspace:*
pnpm --filter @shsg/app add @shsg/ui@workspace:*
```

Both apps already depend on `@shsg/ui`. Import the stylesheet once in each app's global CSS so tokens and Tailwind classes resolve:

```css
@import 'tailwindcss';
@import '@shsg/ui/styles.css';

/* apps/website/app/globals.css */
@source '../../../packages/ui/src';

/* apps/app/src/app/globals.css */
@source '../../../../packages/ui/src';
```

`@shsg/ui/styles.css` defines `--shsg-*` color tokens and registers them with Tailwind. Override any token in app CSS to retheme. Dark mode follows `prefers-color-scheme` and a `.dark` ancestor.

There is no `packages/design-tokens` package yet. These variables are the stand-in and can move there later.

## Import

```tsx
import { Button } from '@shsg/ui';
```

The button is also available from its subpath:

```tsx
import { Button } from '@shsg/ui/button';
```

## Props

`ButtonProps` extends the native button props, including `onClick`, `onFocus`, `onBlur`, `onMouseEnter`, `onMouseLeave`, `onKeyDown`, `type`, `name`, `value`, `form`, `formAction`, `autoFocus`, `className`, `style`, and `aria-*`.

`type` defaults to `"button"` so a button inside a form does not submit by accident. Pass `type="submit"` or `type="reset"` when that is the action.

| Prop               | Default          | Values                                                                                     |
| ------------------ | ---------------- | ------------------------------------------------------------------------------------------ |
| `variant`          | `primary`        | `primary`, `secondary`, `outline`, `ghost`, `link`, `danger`, `success`, `warning`, `soft` |
| `size`             | `md`             | `xs`, `sm`, `md`, `lg`, `xl`, `icon-sm`, `icon`, `icon-lg`                                 |
| `shape`            | `rounded`        | `rounded`, `pill`, `square`                                                                |
| `leftIcon`         | —                | React node                                                                                 |
| `rightIcon`        | —                | React node                                                                                 |
| `loading`          | `false`          | Disables the control and sets `aria-busy`                                                  |
| `loadingText`      | —                | Visible label while loading                                                                |
| `loadingPosition`  | `start`          | `start`, `replace`                                                                         |
| `loadingIndicator` | built-in spinner | React node                                                                                 |
| `fullWidth`        | `false`          | Stretches to the container                                                                 |
| `iconOnly`         | `false`          | Uses the matching icon size                                                                |
| `disabled`         | `false`          | Native disabled state                                                                      |
| `className`        | —                | Appended after component classes                                                           |

The rendered button also exposes `data-variant`, `data-size`, `data-shape`, `data-loading`, and `data-icon-only` for styling hooks.

Hover and active treatments use the `enabled:` variant, so a disabled or loading button does not play them. Motion is disabled under `prefers-reduced-motion`.

Status colors are paired with a heavier border. Do not rely on color alone: keep the visible label explicit (`Delete account`, `Payment received`, `Review warning`).

## Examples

```tsx
<Button>Default action</Button>

<Button variant="secondary">Secondary</Button>

<Button variant="outline" size="lg">
  Learn more
</Button>

<Button variant="danger" disabled>
  Delete account
</Button>

<Button fullWidth>Continue</Button>

<Button shape="pill" className="custom-class">
  Schedule visit
</Button>
```

### Icons

Icons are plain React nodes. The package does not depend on an icon library. `leftIcon` and `rightIcon` are marked decorative, so the accessible name comes from the label, `aria-label`, or `aria-labelledby`.

```tsx
<Button leftIcon={<SearchIcon aria-hidden="true" />}>Search services</Button>

<Button rightIcon={<ArrowRightIcon aria-hidden="true" />}>Get started</Button>

<Button variant="outline" size="icon" aria-label="Open settings">
  <SettingsIcon aria-hidden="true" />
</Button>
```

If an icon-only button already receives an icon as `children`, `leftIcon` and `rightIcon` are not rendered again. Icon-only buttons need `aria-label` or `aria-labelledby`. `title` is not an accessible name. In development, a button with no accessible name logs a console warning.

`iconOnly` selects a square size from the requested size: `xs`/`sm` become `icon-sm`, `md` becomes `icon`, and `lg`/`xl` become `icon-lg`.

### Loading and disabled

```tsx
<Button loading loadingText="Saving changes...">
  Save changes
</Button>

<Button loading loadingPosition="replace">
  Submitting
</Button>

<Button loading loadingIndicator={<CustomSpinner />}>
  Save
</Button>

<Button variant="danger" disabled>
  Delete account
</Button>
```

`loading` sets `disabled` and `aria-busy="true"`, which blocks a second click and a second form submit. `loadingText` replaces the accessible name. `loadingPosition="replace"` without `loadingText` keeps the original name and shows only the spinner, without collapsing the button width.

### Form submission

Click handlers passed from a Server Component are not supported. Render the button from a Client Component when you pass `onClick` or other event handlers.

```tsx
'use client';

export function SaveForm() {
  return (
    <form action="/projects">
      <Button type="submit" name="action" value="save">
        Save
      </Button>
    </form>
  );
}
```

## Accessibility

- The element is a native `<button>`.
- Keyboard activation is the browser default (Enter and Space).
- `:focus-visible` draws a 2px offset ring using `--shsg-ring`.
- `disabled` and `loading` use the native disabled state.
- Loading sets `aria-busy="true"`.
- Icon-only buttons require `aria-label` or `aria-labelledby`.
- `prefers-reduced-motion` removes the press transition and the spinner animation.

## Ref

React 19 passes `ref` as a normal prop. The ref points at the underlying `<button>`.

```tsx
const ref = useRef<HTMLButtonElement>(null);

<Button ref={ref}>Save</Button>;
```

## Article card

`ArticleCard` from `@shsg/ui` provides a dark editorial article container with optional featured layout. Supply `media` (for example Next Image), a linked `title` (for example Next Link), `category`, `excerpt`, ISO `date`, `dateLabel`, and `readingTime`. `headingLevel` defaults to `h2`; use `h3` when nested below another heading. The title link extends across the card, so keep media and other content non-interactive. The shared package has no Next.js dependency.
