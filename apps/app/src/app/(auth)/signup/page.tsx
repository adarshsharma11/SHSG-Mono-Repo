import type { Metadata } from 'next';
import { AuthFrame } from '@/components/auth/auth-frame';
import { GuestAccess } from '@/components/auth/guest-access';
import { AuthScreen } from '@/components/auth/auth-screen';
export const metadata: Metadata = {
  title: 'Create account | Southern Home Services Group',
};
export default function SignupPage() {
  return (
    <GuestAccess>
      <AuthFrame>
        <AuthScreen key="signup" mode="signup" />
      </AuthFrame>
    </GuestAccess>
  );
}
