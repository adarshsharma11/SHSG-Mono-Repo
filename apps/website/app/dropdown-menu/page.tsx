import type { Metadata } from 'next';
import { ComponentShowcase } from '../_components/component-showcase';
import { MenuExamples } from './menu-examples';
export const metadata: Metadata = {
  title: 'Dropdown menus | SHSG',
  description: 'Compact accessible action menus with keyboard navigation.',
};
export default function DropdownMenuPage() {
  return (
    <ComponentShowcase title="Dropdown menus" description="Keep secondary actions within reach, with keyboard navigation and clear labels.">
      <MenuExamples />
    </ComponentShowcase>
  );
}
