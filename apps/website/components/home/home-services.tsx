'use client';

import { useState, type ReactNode } from 'react';
import { ServiceExplorer } from './service-explorer';
import { PlannerSection } from './sections/planner-section';

export function HomeServices({ children }: { children: ReactNode }) {
  const [service, setService] = useState('');
  return (
    <>
      <ServiceExplorer onSelect={setService} />
      {children}
      <PlannerSection service={service} />
    </>
  );
}
