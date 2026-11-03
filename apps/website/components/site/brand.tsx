import Link from 'next/link';

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`site-brand ${light ? 'site-brand-light' : ''}`} aria-label="Southern Home Services Group home">
      <svg viewBox="0 0 40 42" fill="none" aria-hidden="true">
        <path d="M3 21 20 5l17 16M9 18v19h22V18M16 37V25h8v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M25 7V3h6v10" stroke="currentColor" strokeWidth="1.6" />
      </svg>
      <span>
        <strong>Southern Home</strong>
        <span>Services Group</span>
      </span>
    </Link>
  );
}
