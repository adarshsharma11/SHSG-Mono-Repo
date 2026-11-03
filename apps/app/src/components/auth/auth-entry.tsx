'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { AuthPending } from './auth-pending';

/** Resolve the root destination without visiting an intermediate auth page. */
export function AuthEntry() {
  const { status, isAuthenticated } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (status === 'ready') router.replace(isAuthenticated ? '/dashboard' : '/login');
  }, [status, isAuthenticated, router]);
  return <AuthPending />;
}
