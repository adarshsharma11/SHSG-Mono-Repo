'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

/** Put this inside each workspace page so its layout never drops the page slot. */
export function WorkspaceAccess({ children }: { children: React.ReactNode }) {
  const { status, isAuthenticated } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (status === 'ready' && !isAuthenticated) router.replace('/login');
  }, [status, isAuthenticated, router]);

  if (status === 'loading' || !isAuthenticated) {
    return (
      <div role="status" className="flex min-h-svh items-center justify-center bg-[#f5f7f6] text-sm text-[#526258]">
        {status === 'loading' ? 'Restoring session…' : 'Returning to sign in…'}
      </div>
    );
  }
  return children;
}
