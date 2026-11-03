export { divisions } from '../../content/divisions';

export const projectTypes = [
  { value: 'repair', label: 'Repairs & maintenance', division: 'handyman' },
  {
    value: 'improvement',
    label: 'Small home improvements',
    division: 'handyman',
  },
  {
    value: 'renovation',
    label: 'Renovation & remodeling',
    division: 'boxwood',
  },
  {
    value: 'construction',
    label: 'Construction projects',
    division: 'boxwood',
  },
] as const;

export const questions = [
  {
    value: 'start',
    title: 'I’m not sure what my project needs. Where do I start?',
    content: 'Start with what you’d like to fix or change. A short description of the space, the issue, and your ideal outcome is enough to begin a conversation. Our project planner below helps you put those thoughts together.',
  },
  {
    value: 'brands',
    title: 'How do Southern Home Handyman and Boxwood fit together?',
    content: 'They are distinct service brands in the Southern Home Services Group family. Southern Home Handyman is the starting point for repairs and smaller improvements; Boxwood is the starting point for renovation and construction conversations. Both brands keep their own websites.',
  },
  {
    value: 'coverage',
    title: 'Can you help with a project in my area?',
    content: 'Please confirm service-area coverage directly with the relevant brand before making plans. Availability depends on the project, location, and team capacity; this website does not confirm coverage or appointments.',
  },
  {
    value: 'brief',
    title: 'Does creating a project brief book a visit?',
    content: 'No. The planner creates a brief on your device for you to save and share. It does not send your information, provide an estimate, or reserve an appointment. Continue to the relevant brand’s website to contact their team.',
  },
];
