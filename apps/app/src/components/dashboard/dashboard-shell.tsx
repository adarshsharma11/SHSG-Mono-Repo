'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, DropdownMenu, Modal } from '@shsg/ui';
import { Logo } from '@shsg/ui/logo';
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
  if (status === 'loading' || !isAuthenticated) {
    return children;
  }
  return (
    <div data-workspace className={`bg-app-canvas text-app-ink min-h-svh font-sans [color-scheme:light] ${collapsed ? 'lg:pl-[88px]' : 'lg:pl-[244px]'}`}>
      <a href="#dashboard-content" className="sr-only z-50 rounded bg-white p-3 focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
        Skip to dashboard
      </a>
      <aside className={`border-app-border fixed inset-y-0 left-0 z-30 hidden flex-col border-r bg-white py-6 lg:flex ${collapsed ? 'w-[88px] px-3' : 'w-[244px] px-4'}`} aria-label="Workspace sidebar">
        <Logo as={Link} src="/images/brand/logo.webp" imageAs={Image} imageWidth={486} imageHeight={374} url="/dashboard" compact={collapsed} aria-label="SHSG dashboard" className="px-2 [&_.shsg-logo__wordmark_strong]:text-lg" />
        <button type="button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!collapsed} className="border-app-border absolute top-[78px] -right-3.5 flex size-7 cursor-pointer items-center justify-center rounded-full border bg-white text-xs shadow-sm">
          {collapsed ? '›' : '‹'}
        </button>
        {!collapsed && (
          <div className="bg-app-surface mx-2 mt-8 rounded-xl px-4 py-3">
            <p className="text-sm font-medium">SHSG workspace</p>
            <p className="text-app-muted mt-1 text-xs">Demo organization</p>
          </div>
        )}
        <nav aria-label="Workspace navigation" className="mt-7 space-y-1">
          {navigation.map(({ label, href, icon }) => (
            <Link key={label} href={href} title={collapsed ? label : undefined} aria-label={label} className="text-app-muted hover:bg-app-selection hover:text-app-primary focus-visible:outline-app-ring flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors focus-visible:outline-2">
              <DashboardIcon name={icon} />
              {!collapsed && label}
            </Link>
          ))}
        </nav>
        <div className="border-app-border mt-6 border-t pt-5">
          <button type="button" onClick={() => setSettingsOpen(true)} aria-label="Account settings" className="text-app-muted hover:bg-app-selection flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-sm">
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
                <span className="bg-app-selection text-app-primary flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold">{user?.name.slice(0, 1).toUpperCase()}</span>
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
      <header className="border-app-border sticky top-0 z-20 flex min-h-[72px] items-center justify-between gap-4 border-b bg-white/95 px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" aria-label="Open navigation" className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <DashboardIcon name="menu" />
          </Button>
          <span className="text-sm font-medium">Workspace</span>
          <span className="text-app-muted hidden text-sm sm:inline">/</span>
          <span className="text-app-muted hidden text-sm sm:inline">Project overview</span>
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
        description="Signed in with your SHSG account."
        className="text-app-ink! bg-white!"
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
            <dd className="mt-1">SHSG operations · tab-scoped session</dd>
          </div>
        </dl>
      </Modal>
    </div>
  );
}
