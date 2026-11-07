'use client';

import { useState } from 'react';
import { Input, Tabs, Typography } from '@shsg/ui';
import { homeServices, serviceGroups, type ServiceGroup } from './services';
import { ServiceResults } from './service-results';

export function ServiceExplorer({ onSelect }: { onSelect: (service: string) => void }) {
  const [group, setGroup] = useState<ServiceGroup>('all');
  const [search, setSearch] = useState('');
  const query = search.trim().toLowerCase();

  return (
    <section id="services" aria-labelledby="services-heading" className="mx-auto max-w-[1320px] px-5 py-20 sm:px-10 lg:px-12 lg:py-28">
      <div className="mb-10 grid items-end gap-6 md:grid-cols-[1fr_320px]">
        <div>
          <p className="mb-4 text-[11px] font-semibold tracking-[0.18em] text-(--site-muted) uppercase">Good help starts here</p>
          <Typography as="h2" variant="h2" id="services-heading" className="max-w-xl text-(--site-primary)">
            What’s on your home’s to-do list?
          </Typography>
          <p className="mt-5 max-w-xl text-base leading-7 text-(--site-muted)">The little fix. The long-overdue upgrade. The idea you can’t stop thinking about. Find a place to start.</p>
        </div>
        <Input type="search" label="Find a service" placeholder="Try plumbing or flooring…" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>
      <Tabs
        label="Filter services"
        value={group}
        variant="underline"
        animation="slide-up"
        keepMounted={false}
        onValueChange={(next) => {
          const selected = serviceGroups.find(({ id }) => id === next);
          if (selected) {
            setGroup(selected.id);
          }
        }}
        items={serviceGroups.map(({ id, label }) => ({
          value: id,
          label,
          content: (
            <ServiceResults
              services={homeServices.filter((service) => (id === 'all' || service.group === id) && `${service.title} ${service.description}`.toLowerCase().includes(query))}
              onSelect={onSelect}
              onReset={() => {
                setSearch('');
                setGroup('all');
              }}
            />
          ),
        }))}
      />
      <p className="mt-6 text-xs leading-6 text-(--site-muted)">Scope, service area, specialist qualifications, and availability are confirmed with the relevant team before any work is agreed.</p>
    </section>
  );
}
