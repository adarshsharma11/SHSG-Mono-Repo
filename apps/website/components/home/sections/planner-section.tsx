import { Typography } from '@shsg/ui';
import { ProjectPlanner } from '../project-planner';

export function PlannerSection({ service = '' }: { service?: string }) {
  return (
    <section className="bg-[#1b2951] text-white" id="plan-project" aria-labelledby="planner-heading">
      <div className="mx-auto grid max-w-[1320px] items-start gap-12 px-5 py-20 sm:px-10 lg:grid-cols-2 lg:gap-24 lg:px-12 lg:py-28">
        <div>
          <p className="mb-5 text-[11px] font-semibold tracking-[0.18em] text-[#d9c7ac] uppercase">It starts with a conversation</p>
          <Typography as="h2" variant="h2" tone="inherit" id="planner-heading">
            What would make
            <br />
            home feel <span className="text-[#d9c7ac]">better?</span>
          </Typography>
          <p className="mt-6 max-w-md text-base leading-8 text-white/75">You don’t need all the answers. A few details can turn an idea into a useful first conversation.</p>
          <ul className="mt-8 space-y-4 border-t border-white/20 pt-6 text-sm text-white/75">
            <li>Choose your kind of project</li>
            <li>Save a brief on your device</li>
            <li>Take it to the right team</li>
          </ul>
        </div>
        <div className="rounded-sm bg-white p-6 text-(--site-ink) sm:p-8">
          <ProjectPlanner service={service} />
        </div>
      </div>
    </section>
  );
}
