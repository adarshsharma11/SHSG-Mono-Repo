import { Button } from '@shsg/ui';
import type { homeServices } from './services';
import { ToolIcon } from './tool-icon';

interface ServiceResultsProps {
  services: readonly (typeof homeServices)[number][];
  onSelect: (service: string) => void;
  onReset: () => void;
}

export function ServiceResults({ services, onSelect, onReset }: ServiceResultsProps) {
  return (
    <>
      <p role="status" className="text-xs text-(--site-muted)">
        {services.length} {services.length === 1 ? 'service' : 'services'} to explore
      </p>
      <div className="grid gap-x-10 sm:grid-cols-2 xl:grid-cols-4">
        {services.map((service) => (
          <a key={service.id} href="#plan-project" aria-label={`Plan ${service.title}`} onClick={() => onSelect(service.title)} className="group/service flex min-h-40 items-start gap-4 border-b border-(--site-border) py-7 transition-colors hover:border-(--site-primary) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--shsg-ring)">
            <span className="mt-1 flex size-12 shrink-0 items-center justify-center rounded-full bg-[#eeeae2] text-(--site-primary) transition-transform group-hover/service:-rotate-6 motion-reduce:transform-none">
              <ToolIcon name={service.tool} className="size-7 motion-safe:group-hover/service:animate-bounce" />
            </span>
            <span>
              <span className="block text-sm leading-6 font-semibold text-(--site-primary)">{service.title}</span>
              <span className="mt-2 block text-xs leading-6 text-(--site-muted)">{service.description}</span>
            </span>
          </a>
        ))}
      </div>
      {services.length === 0 && (
        <div className="py-12">
          <p className="mb-4 text-(--site-muted)">No matching services. Try a shorter search or another category.</p>
          <Button variant="outline" onClick={onReset}>
            Show all services
          </Button>
        </div>
      )}
    </>
  );
}
