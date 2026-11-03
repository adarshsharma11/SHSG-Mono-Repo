export function AuthPending() {
  return (
    <main aria-busy="true" className="bg-app-canvas text-app-muted flex min-h-svh flex-1 items-center justify-center px-6 font-sans text-sm [color-scheme:light]">
      <p role="status">Opening your workspace…</p>
    </main>
  );
}
