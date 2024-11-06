// src/app/dashboard/page.tsx
import { Metadata } from 'next';
import DashboardContent from '@/components/sections/dashboard/DashboardContent';

export const metadata: Metadata = {
  title: 'Your Dashboard - SmartAICopy',
  description: 'Optimize new content and manage your optimization history.',
};

export default function DashboardPage() {
  return (
    <section
      aria-labelledby="dashboard-heading"
      className="container-padding section-padding"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            id="dashboard-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground"
          >
            Your Dashboard
          </h1>
          <p className="mt-4 text-lg text-secondary max-w-2xl mx-auto">
            Optimize new content or access your previous optimizations.
          </p>
        </div>

        <DashboardContent />
      </div>
    </section>
  );
}