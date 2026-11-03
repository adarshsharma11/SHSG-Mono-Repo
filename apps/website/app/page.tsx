import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/sections/hero-section';
import { ServicesSection } from '@/components/home/sections/services-section';
import { FamilySection } from '@/components/home/sections/family-section';
import { ProcessSection } from '@/components/home/sections/process-section';
import { PlannerSection } from '@/components/home/sections/planner-section';
import { FaqSection } from '@/components/home/sections/faq-section';
import './home.css';

export const metadata: Metadata = {
  title: 'Southern Home Services Group | Your home. Our kind of care.',
  description: 'Find the right starting point for home repairs, improvements, and renovations with Southern Home Handyman and Boxwood, part of the SHSG family.',
};

export default function Home() {
  return (
    <main className="shsg-home">
      <HeroSection />
      <ServicesSection />
      <FamilySection />
      <ProcessSection />
      <PlannerSection />
      <FaqSection />
    </main>
  );
}
