export interface EstimateItem {
  id: string;
  category: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
  type: 'Labor' | 'Material';
}
export const estimateItems: EstimateItem[] = [
  {
    id: 'demo-1',
    category: 'Preparation',
    name: 'Protect surfaces & remove existing fixtures',
    quantity: 6,
    unit: 'hr',
    cost: 65,
    type: 'Labor',
  },
  {
    id: 'demo-2',
    category: 'Plumbing',
    name: 'Toilet installation',
    quantity: 3,
    unit: 'hr',
    cost: 85,
    type: 'Labor',
  },
  {
    id: 'demo-3',
    category: 'Plumbing',
    name: 'Mid-grade elongated toilet',
    quantity: 1,
    unit: 'ea',
    cost: 399,
    type: 'Material',
  },
  {
    id: 'demo-4',
    category: 'Finishes',
    name: 'Glossy ceramic wall tile',
    quantity: 84,
    unit: 'sq ft',
    cost: 4.88,
    type: 'Material',
  },
  {
    id: 'demo-5',
    category: 'Finishes',
    name: 'Tile installation',
    quantity: 16,
    unit: 'hr',
    cost: 65,
    type: 'Labor',
  },
  {
    id: 'demo-6',
    category: 'Finishes',
    name: 'Grout & setting materials',
    quantity: 1,
    unit: 'lot',
    cost: 95,
    type: 'Material',
  },
];
export const currency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
