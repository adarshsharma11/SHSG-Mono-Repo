import { AuthBrand } from './auth-brand';
import { AuthAside } from './auth-aside';

export function AuthFrame({ children }: { children: React.ReactNode }) {
  return (
    <div data-auth-frame className="bg-app-primary text-app-on-brand grid min-h-svh flex-1 p-0 font-sans [color-scheme:dark] lg:grid-cols-2 lg:gap-5 lg:p-6">
      <main id="auth-content" className="flex min-w-0 flex-col items-center justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-12">
        <div className="w-full max-w-[400px]">
          <AuthBrand />
          <div className="mt-12 sm:mt-16">{children}</div>
        </div>
      </main>
      <AuthAside />
    </div>
  );
}
