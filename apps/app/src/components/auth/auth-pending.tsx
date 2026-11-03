export function AuthPending() {
  return (
    <main aria-busy="true" className="flex min-h-svh flex-1 items-center justify-center bg-[#f5f7f6] px-6 font-sans text-sm text-[#526258] [color-scheme:light]">
      <p role="status">Opening your workspace…</p>
    </main>
  );
}
