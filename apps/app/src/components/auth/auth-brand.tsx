import Link from 'next/link';

export function AuthBrand() {
  return (
    <Link href="/" aria-label="Southern Home Services Group app home" className="inline-flex items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#62dba1]">
      <svg viewBox="0 0 40 42" fill="none" aria-hidden="true" className="h-10 w-9 shrink-0 text-[#36c78b]">
        <path d="M3 21 20 5l17 16M9 18v19h22V18M16 37V25h8v12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M25 7V3h6v10" stroke="currentColor" strokeWidth="1.7" />
      </svg>
      <span>
        <span className="block text-[23px] leading-tight font-semibold tracking-[-0.05em] text-[#f4f7f4]">Southern Home</span>
        <span className="mt-1 block text-[8px] font-medium tracking-[0.24em] text-[#b5c2b9] uppercase">Services Group</span>
      </span>
    </Link>
  );
}
