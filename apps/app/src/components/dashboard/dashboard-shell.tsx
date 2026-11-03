'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, DropdownMenu, Modal } from '@shsg/ui';
import { useAuth } from '../../hooks/useAuth';
import { DashboardIcon, type DashboardIconName } from './dashboard-icons';

const navigation: { label: string; href: string; icon: DashboardIconName }[] = [
  { label: 'Overview', href: '/dashboard#overview', icon: 'overview' },
  { label: 'Estimate', href: '/dashboard#estimate', icon: 'estimate' },
  { label: 'Materials', href: '/dashboard#materials', icon: 'materials' },
  { label: 'Customer', href: '/dashboard#customer', icon: 'customer' },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, status, signOut, expiresAt } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  function logout() {
    signOut();
    router.replace('/login');
  }
  // The page owns its auth guard. Always preserve the route slot for Next validation.
  if (status === 'loading' || !isAuthenticated) return children;
  return (
    <div data-workspace className={`min-h-svh bg-[#f5f7f6] font-sans text-[#1b2821] [color-scheme:light] [--shsg-field-muted:#f2f6f3] [--shsg-field:#fff] [--shsg-ghost:#1b2821] [--shsg-muted:#627067] [--shsg-outline-border:#dce5df] [--shsg-outline:#325b43] [--shsg-primary-foreground:#fff] [--shsg-primary-hover:#066d44] [--shsg-primary:#087f50] [--shsg-ring:#168053] [--shsg-secondary-border:#dce5df] ${collapsed ? 'lg:pl-[88px]' : 'lg:pl-[244px]'}`}>
      <a href="#dashboard-content" className="sr-only z-50 rounded bg-white p-3 focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
        Skip to dashboard
      </a>
      <aside className={`fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-[#e1e7e3] bg-white py-6 lg:flex ${collapsed ? 'w-[88px] px-3' : 'w-[244px] px-4'}`} aria-label="Workspace sidebar">
        <Link href="/dashboard" aria-label="SHSG dashboard" className="flex items-center gap-2 px-3 text-xl font-semibold tracking-tight">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#087f50] text-sm text-white">SH</span>
          {!collapsed && 'Southern Home'}
        </Link>
        <button type="button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!collapsed} className="absolute top-[78px] -right-3.5 flex size-7 cursor-pointer items-center justify-center rounded-full border border-[#dce5df] bg-white text-xs shadow-sm">
          {collapsed ? '›' : '‹'}
        </button>
        {!collapsed && (
          <div className="mx-2 mt-8 rounded-xl bg-[#f3f6f4] px-4 py-3">
            <p className="text-sm font-medium">SHSG workspace</p>
            <p className="mt-1 text-xs text-[#6a776e]">Demo organization</p>
          </div>
        )}
        <nav aria-label="Workspace navigation" className="mt-7 space-y-1">
          {navigation.map(({ label, href, icon }) => (
            <Link key={label} href={href} title={collapsed ? label : undefined} aria-label={label} className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-[#536158] transition-colors hover:bg-[#edf6f0] hover:text-[#087f50] focus-visible:outline-2 focus-visible:outline-[#168053]">
              <DashboardIcon name={icon} />
              {!collapsed && label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 border-t border-[#e1e7e3] pt-5">
          <button type="button" onClick={() => setSettingsOpen(true)} aria-label="Account settings" className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-sm text-[#536158] hover:bg-[#edf6f0]">
            <DashboardIcon name="settings" />
            {!collapsed && 'Settings'}
          </button>
        </div>
        <div className="mt-auto pt-8">
          <DropdownMenu
            label="Account menu"
            align="start"
            className="w-full min-w-0 justify-start overflow-hidden"
            trigger={
              <>
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#e3f2e9] text-xs font-semibold text-[#087f50]">{user?.name.slice(0, 1).toUpperCase()}</span>
                {!collapsed && <span className="truncate text-left text-xs">{user?.email}</span>}
              </>
            }
            items={[
              {
                id: 'settings',
                label: 'Account settings',
                onSelect: () => setSettingsOpen(true),
              },
              { id: 'separator', type: 'separator' },
              {
                id: 'logout',
                label: 'Log out',
                danger: true,
                onSelect: logout,
              },
            ]}
          />
        </div>
      </aside>
      <header className="sticky top-0 z-20 flex min-h-[72px] items-center justify-between gap-4 border-b border-[#e1e7e3] bg-white/95 px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" aria-label="Open navigation" className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <DashboardIcon name="menu" />
          </Button>
          <span className="text-sm font-medium">Workspace</span>
          <span className="hidden text-sm text-[#9ba69f] sm:inline">/</span>
          <span className="hidden text-sm text-[#647369] sm:inline">Project overview</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-[#dfd6ad] bg-[#faf6e6] px-3 py-1 text-[10px] font-medium text-[#78642a]">Demo data</span>
          <Button variant="ghost" size="icon" aria-label="Account settings" onClick={() => setSettingsOpen(true)}>
            <DashboardIcon name="settings" />
          </Button>
        </div>
      </header>
      <main id="dashboard-content" className="mx-auto max-w-[1700px] p-5 sm:p-8">
        {children}
      </main>
      <Modal open={mobileOpen} onOpenChange={setMobileOpen} title="SHSG workspace" animation="slide-left" size="sm">
        <nav aria-label="Mobile workspace navigation" className="grid gap-2">
          {navigation.map(({ label, href }) => (
            <Link key={label} href={href} onClick={() => setMobileOpen(false)} className="hover:bg-shsg-field-muted rounded-lg p-3 text-sm">
              {label}
            </Link>
          ))}
          <Button
            variant="ghost"
            onClick={() => {
              setMobileOpen(false);
              setSettingsOpen(true);
            }}
          >
            Account settings
          </Button>
          <Button variant="danger" onClick={logout}>
            Log out
          </Button>
        </nav>
      </Modal>
      <Modal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        title="Account settings"
        description="This is a local demo account, not a production identity."
        className="bg-white! text-[#1b2821]!"
        footer={
          <Button variant="danger" onClick={logout}>
            Log out
          </Button>
        }
      >
        <dl className="grid gap-5 text-sm">
          <div>
            <dt className="text-shsg-muted">Email address</dt>
            <dd className="mt-1 break-all">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-shsg-muted">Session expires</dt>
            <dd className="mt-1">{expiresAt ? new Date(expiresAt).toLocaleString() : '—'}</dd>
          </div>
          <div>
            <dt className="text-shsg-muted">Workspace</dt>
            <dd className="mt-1">SHSG demo · tab-scoped session</dd>
          </div>
        </dl>
      </Modal>
    </div>
  );
}
