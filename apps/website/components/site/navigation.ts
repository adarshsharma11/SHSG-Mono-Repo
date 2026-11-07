import { divisions } from '../../content/divisions';
import type { NavigationIconName } from './navigation-icon';

export const navigation = [
  {
    label: 'Our services',
    href: '/#services',
    children: [
      { label: 'Repairs & maintenance', href: '/#services', icon: 'tools' },
      { label: 'Home improvements', href: '/#services', icon: 'home' },
      {
        label: 'Renovation & construction',
        href: '/#our-family',
        icon: 'building',
      },
    ],
  },
  {
    label: 'Our family',
    href: '/#our-family',
    children: divisions.map(({ id, name, href }) => ({
      label: name,
      href,
      icon: (id === 'handyman' ? 'tools' : 'building') as NavigationIconName,
    })),
  },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'FAQs', href: '/#questions' },
  { label: 'Journal', href: '/blog' },
] as const;

export const footerGroups = [
  {
    title: 'Explore',
    links: [
      { label: 'Our services', href: '/#services' },
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'Plan your project', href: '/#plan-project' },
    ],
  },
  {
    title: 'Our family',
    links: divisions.map(({ name, href }) => ({ label: name, href })),
  },
  {
    title: 'Good to know',
    links: [
      { label: 'Common questions', href: '/#questions' },
      { label: 'Service-area guidance', href: '/#questions' },
      { label: 'Terms of use', href: '/terms-of-use' },
      { label: 'Home journal', href: '/blog' },
    ],
  },
] as const;
