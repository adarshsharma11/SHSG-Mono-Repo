export function AppLink({ href, className = '' }: { href: string; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      Login
      <span className="sr-only"> (opens the SHSG app in a new tab)</span>
    </a>
  );
}
