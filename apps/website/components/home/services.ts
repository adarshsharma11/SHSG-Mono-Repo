export const serviceGroups = [
  { id: 'all', label: 'All services' },
  { id: 'repair', label: 'Repairs & finishes' },
  { id: 'systems', label: 'Home systems' },
  { id: 'outdoor', label: 'Outdoor & property' },
  { id: 'specialist', label: 'Design & specialist' },
] as const;

export type ServiceGroup = (typeof serviceGroups)[number]['id'];
export type ToolName = 'roller' | 'wrench' | 'bolt' | 'screen' | 'gutter' | 'hammer' | 'floor' | 'water' | 'frame' | 'coating' | 'shovel' | 'wall' | 'drawing' | 'welding' | 'fence' | 'chair';

export const homeServices: ReadonlyArray<{ id: string; title: string; description: string; group: Exclude<ServiceGroup, 'all'>; tool: ToolName }> = [
  { id: 'drywall', title: 'Drywall Repair & Installation', description: 'A clean finish, from the patch to the whole wall.', group: 'repair', tool: 'roller' },
  { id: 'plumbing', title: 'Plumbing', description: 'Talk through the leaks, fixtures, and fixes on your list.', group: 'systems', tool: 'wrench' },
  { id: 'electrical', title: 'Electrical', description: 'Bring your lighting and electrical project into focus.', group: 'systems', tool: 'bolt' },
  { id: 'tv', title: 'TV Mounting & Wiring', description: 'A better viewing angle. A little less cable clutter.', group: 'systems', tool: 'screen' },
  { id: 'gutters', title: 'Gutter Cleaning', description: 'Give rainwater a clearer route away from your home.', group: 'outdoor', tool: 'gutter' },
  { id: 'carpentry', title: 'Carpentry', description: 'Useful details, thoughtfully shaped and fitted.', group: 'repair', tool: 'hammer' },
  { id: 'flooring', title: 'Flooring', description: 'A fresh foundation for the rooms you live in.', group: 'repair', tool: 'floor' },
  { id: 'washing', title: 'Power Washing & Sealing', description: 'Refresh outdoor surfaces and discuss their next finish.', group: 'outdoor', tool: 'water' },
  { id: 'art', title: 'Art & Wall Installations', description: 'Put the things you love in just the right place.', group: 'systems', tool: 'frame' },
  { id: 'epoxy', title: 'Epoxy Floors & Coatings', description: 'Explore a practical finish for a hardworking space.', group: 'specialist', tool: 'coating' },
  { id: 'drainage', title: 'Drainage & Excavation', description: 'Start with the ground, the water, and a considered plan.', group: 'outdoor', tool: 'shovel' },
  { id: 'walls', title: 'Architectural Wall Design', description: 'Add depth, texture, and a little character.', group: 'specialist', tool: 'wall' },
  { id: 'drawings', title: 'Remodel Drawings & Renderings', description: 'See the possibilities before deciding on the details.', group: 'specialist', tool: 'drawing' },
  { id: 'welding', title: 'Mobile Welding', description: 'Discuss the metalwork your project calls for.', group: 'specialist', tool: 'welding' },
  { id: 'fencing', title: 'Fencing Repair & Installation', description: 'Define your space, repair a section, or start fresh.', group: 'outdoor', tool: 'fence' },
  { id: 'furniture', title: 'Furniture Repair & Restoration', description: 'Make room for another chapter with a piece you love.', group: 'repair', tool: 'chair' },
];
