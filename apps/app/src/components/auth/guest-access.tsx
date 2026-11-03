'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { AuthPending } from './auth-pending';

/** Guard the full auth frame inside a page, preserving the layout's route slot. */
export function GuestAccess({ children }: { children: React.ReactNode }) {
  const { status, isAuthenticated } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (status === 'ready' && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [status, isAuthenticated, router]);
  if (status === 'loading' || isAuthenticated) {
    return <AuthPending />;
  }
  return children;
}
