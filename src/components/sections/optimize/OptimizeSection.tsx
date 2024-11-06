'use client';

import { useState } from 'react';
import OptimizeForm from '@/components/sections/optimize/OptimizeForm';
import OptimizeResults from '@/components/sections/optimize/OptimizeResults';
import OptimizePreview from '@/components/sections/optimize/OptimizePreview';
import { OptimizeResponse } from '@/lib/api/content/types';

export default function OptimizeSection() {
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
    <div className="max-w-3xl mx-auto">
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
  );
}