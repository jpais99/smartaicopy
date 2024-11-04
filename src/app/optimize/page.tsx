// src/app/optimize/page.tsx
import { Metadata } from 'next';
import OptimizeForm from '@/components/sections/optimize/OptimizeForm';

export const metadata: Metadata = {
  title: 'Optimize Your Content - SmartAICopy',
  description: 'Instantly improve your content with AI-powered optimization. Get better engagement, clearer messaging, and improved SEO in seconds.',
};

export default function OptimizePage() {
  return (
    <section
      aria-labelledby="optimize-heading"
      className="container-padding section-padding"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            id="optimize-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground"
          >
            Optimize Your Content
          </h1>
          <p className="mt-4 text-lg text-secondary max-w-2xl mx-auto">
            Paste your content below to enhance its clarity, engagement, and SEO performance.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <OptimizeForm />
        </div>
      </div>
    </section>
  );
}