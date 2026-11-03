export type NavigationIconName = 'tools' | 'home' | 'building';

export function NavigationIcon({ name }: { name: NavigationIconName }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="site-navigation-icon">
      {name === 'home' && (
        <>
          <path d="m3 11 9-8 9 8" />
          <path d="M5 10v11h14V10M9 21v-7h6v7" />
        </>
      )}
      {name === 'building' && (
        <>
          <path d="M4 21V4h10v17M14 10h6v11M3 21h18M8 8h2M8 12h2M8 16h2" />
        </>
      )}
      {name === 'tools' && (
        <>
          <path d="m14 6 4-4a6 6 0 0 1-7 8L4 17a2.1 2.1 0 0 0 3 3l7-7a6 6 0 0 0 8-7l-4 4-4-4Z" />
          <path d="m3 3 5 5M2 2l3 1-2 2-1-3ZM14 17l4 4 3-3-4-4" />
        </>
      )}
    </svg>
  );
}
