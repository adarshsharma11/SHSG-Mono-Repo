export type DashboardIconName = 'overview' | 'estimate' | 'materials' | 'customer' | 'settings' | 'logout' | 'menu';
const paths: Record<DashboardIconName, string> = {
  overview: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  estimate: 'M6 3h12v18H6z M9 7h6 M9 11h6 M9 15h3',
  materials: 'M3 7l9-4 9 4-9 4-9-4z M3 7v10l9 4 9-4V7 M12 11v10',
  customer: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M4 21v-3a8 8 0 0 1 16 0v3',
  settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M12 2v3 M12 19v3 M2 12h3 M19 12h3 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2',
  logout: 'M9 4H4v16h5 M10 12h11 M17 8l4 4-4 4',
  menu: 'M4 6h16 M4 12h16 M4 18h16',
};
export function DashboardIcon({ name }: { name: DashboardIconName }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5 shrink-0">
      <path d={paths[name]} />
    </svg>
  );
}
