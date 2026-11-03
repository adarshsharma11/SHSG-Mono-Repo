import type { Metadata } from 'next';
import { AuthFrame } from '@/components/auth/auth-frame';
import { GuestAccess } from '@/components/auth/guest-access';
import { AuthScreen } from '@/components/auth/auth-screen';
export const metadata: Metadata = {
  title: 'Sign in | Southern Home Services Group',
};

export default function LoginPage() {
  return (
    <GuestAccess>
      <AuthFrame>
        <AuthScreen key="login" mode="login" />
      </AuthFrame>
    </GuestAccess>
  );
}
