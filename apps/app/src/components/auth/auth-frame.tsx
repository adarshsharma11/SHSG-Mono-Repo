import { AuthBrand } from './auth-brand';
import { AuthAside } from './auth-aside';

export function AuthFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh flex-1 bg-[#242825] p-0 font-sans text-[#f4f7f4] [color-scheme:dark] [--shsg-danger:#fda4af] [--shsg-field-muted:#303932] [--shsg-field:#242825] [--shsg-ghost:#f4f7f4] [--shsg-muted:#aeb8b1] [--shsg-primary-active:#076d45] [--shsg-primary-foreground:#ffffff] [--shsg-primary-hover:#09945d] [--shsg-primary:#087f50] [--shsg-ring:#62dba1] [--shsg-secondary-border:#59635c] lg:grid-cols-2 lg:gap-5 lg:p-6">
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
