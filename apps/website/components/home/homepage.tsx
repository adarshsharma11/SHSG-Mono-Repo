import { CareHero, TransformationHero, WorkshopHero } from './home-heroes';
import { HomeViews, type HomeView } from './home-views';
import { HomeServices } from './home-services';
import { ProjectStories } from './project-stories';
import { ProcessSection } from './sections/process-section';
import { FamilySection } from './sections/family-section';
import { FaqSection } from './sections/faq-section';

export function Homepage({ view = 'care' }: { view?: HomeView }) {
  return (
    <main data-home-page className="bg-white text-(--site-ink)">
      {view === 'care' ? <CareHero /> : view === 'workshop' ? <WorkshopHero /> : <TransformationHero />}
      <HomeViews current={view} />
      {view === 'transformations' && (
        <div id="inspiration">
          <ProjectStories />
        </div>
      )}
      <HomeServices>
        <ProcessSection />
        {view === 'care' && <ProjectStories />}
        <FamilySection />
      </HomeServices>
      <FaqSection />
      <div className="border-t border-(--site-border)">
        <HomeViews current={view} />
      </div>
    </main>
  );
}
