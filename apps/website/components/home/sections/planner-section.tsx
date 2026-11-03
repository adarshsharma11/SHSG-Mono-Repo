import { Typography } from '@shsg/ui';
import { ProjectPlanner } from '../project-planner';

export function PlannerSection() {
  return (
    <section className="home-planner" id="plan-project" aria-labelledby="planner-heading">
      <div className="home-container home-planner-layout">
        <div>
          <p className="home-eyebrow">It starts with a conversation</p>
          <Typography as="h2" variant="h2" tone="inherit" id="planner-heading" className="home-heading">
            What would make
            <br />
            home feel <span>better?</span>
          </Typography>
          <p>You don’t need all the answers. A few details can turn an idea into a useful first conversation.</p>
          <ul className="home-planner-notes">
            <li>Choose your kind of project</li>
            <li>Save a brief on your device</li>
            <li>Take it to the right team</li>
          </ul>
        </div>
        <ProjectPlanner />
      </div>
    </section>
  );
}
