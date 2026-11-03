import type { Metadata } from 'next';
import { WorkspaceAccess } from '@/components/auth/workspace-access';
import { EstimateWorkspace } from '@/components/dashboard/estimate-workspace';
export const metadata: Metadata = {
  title: 'Dashboard | SHSG',
  robots: { index: false, follow: false },
};
export default function DashboardPage() {
  return (
    <WorkspaceAccess>
      <EstimateWorkspace />
    </WorkspaceAccess>
  );
}
