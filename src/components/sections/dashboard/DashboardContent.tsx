// src/components/sections/dashboard/DashboardContent.tsx
'use client';

import { useState } from 'react';
import OptimizeForm from '@/components/sections/optimize/OptimizeForm';
import OptimizeResults from '@/components/sections/optimize/OptimizeResults';
import OptimizePreview from '@/components/sections/optimize/OptimizePreview';
import { OptimizeResponse } from '@/lib/api/content/types';

export default function DashboardContent() {
  const [results, setResults] = useState<OptimizeResponse | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  const handleSubmit = async (data: {
    content: string;
    wordCount: number;
    price: number;
  }) => {
    const response = await fetch('/api/optimize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to optimize content');
    }

    setResults(result);
  };

  const handlePurchase = () => {
    // Temporary: Auto-unlock results
    // This will be replaced with Stripe integration
    setIsPaid(true);
  };

  const handleReset = () => {
    setResults(null);
    setIsPaid(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Optimization Form or Results Section */}
      <div className="bg-background/50 rounded-lg p-6">
        <h2 className="text-xl font-medium mb-6">Optimize New Content</h2>
        {results ? (
          isPaid ? (
            <OptimizeResults results={results} onReset={handleReset} />
          ) : (
            <OptimizePreview results={results} onPurchase={handlePurchase} />
          )
        ) : (
          <OptimizeForm onSubmit={handleSubmit} />
        )}
      </div>

      {/* History Section - Placeholder for now */}
      <div className="bg-background/50 rounded-lg p-6">
        <h2 className="text-xl font-medium mb-6">Recent Optimizations</h2>
        <p className="text-secondary">Your optimization history will appear here.</p>
      </div>
    </div>
  );
}