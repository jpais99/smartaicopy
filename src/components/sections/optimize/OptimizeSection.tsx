// src/components/sections/optimize/OptimizeSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import OptimizeForm from '@/components/sections/optimize/OptimizeForm';
import OptimizeResults from '@/components/sections/optimize/OptimizeResults';
import OptimizePreview from '@/components/sections/optimize/OptimizePreview';
import AuthChoiceModal from '@/components/sections/auth/AuthChoiceModal';
import PaymentModal from '@/components/sections/optimize/PaymentModal';
import { OptimizeResponse } from '@/lib/api/content/types';
import { 
  getOptimizationState, 
  saveOptimizationState, 
  clearOptimizationState 
} from '@/lib/utils/state-preservation';

export default function OptimizeSection() {
  const { isLoggedIn } = useAuth();
  const [results, setResults] = useState<OptimizeResponse | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [showAuthChoice, setShowAuthChoice] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const hasRestore = searchParams.get('restore') === 'true';
    const hasShowPayment = searchParams.get('showPayment') === 'true';
    const fromAuth = searchParams.get('fromAuth') === 'true';
    
    console.log('OptimizeSection - URL params:', {
      hasRestore,
      hasShowPayment,
      fromAuth,
      fullURL: window.location.href
    });

    // Immediately handle auth redirect cases
    if (fromAuth && hasRestore && hasShowPayment) {
      const saved = getOptimizationState();
      console.log('OptimizeSection - Auth redirect with saved state:', saved);
      
      if (saved) {
        setResults(saved.results);
        setIsPaid(saved.isPaid);
        setShowPayment(true); // Immediately show payment modal
      }
      return;
    }

    // Handle normal restore cases
    if (hasRestore) {
      const saved = getOptimizationState();
      console.log('OptimizeSection - Retrieved saved state:', saved);
      
      if (saved) {
        console.log('OptimizeSection - Restoring optimization state');
        setResults(saved.results);
        setIsPaid(saved.isPaid);
      } else {
        console.log('OptimizeSection - No saved state found');
      }
    }
  }, [searchParams]);

  const handleSubmit = async (data: {
    content: string;
    wordCount: number;
    price: number;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to optimize content');
      }

      const result = await response.json();
      setResults(result);
      saveOptimizationState(result, 'preview', false);
    } catch (error) {
      console.error('Optimization failed:', error);
      setError('Failed to optimize content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchaseAttempt = () => {
    if (!isLoggedIn && !isGuest) {
      setShowAuthChoice(true);
    } else {
      setShowPayment(true);
    }
  };

  const handlePurchaseComplete = () => {
    setIsPaid(true);
    setShowPayment(false);
    if (results) {
      saveOptimizationState(results, 'completed', true);
    }
  };

  const handleProceedAsGuest = () => {
    setIsGuest(true);
    setShowAuthChoice(false);
    setShowPayment(true);
  };

  const handleReset = () => {
    setResults(null);
    setIsPaid(false);
    setIsGuest(false);
    setShowPayment(false);
    setError(null);
    clearOptimizationState();
  };

  if (error) {
    return (
      <div className="w-full p-4 text-red-600 bg-red-50 rounded-lg" role="alert">
        {error}
        <button 
          onClick={handleReset}
          className="ml-4 underline hover:no-underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {results ? (
        isPaid ? (
          <OptimizeResults results={results} onReset={handleReset} />
        ) : (
          <>
            <OptimizePreview 
              results={results} 
              onPurchase={handlePurchaseAttempt}
              isGuest={isGuest}
            />
            {showAuthChoice && (
              <AuthChoiceModal
                onClose={() => setShowAuthChoice(false)}
                onProceedAsGuest={handleProceedAsGuest}
                results={results}
              />
            )}
            {showPayment && (
              <PaymentModal
                results={results}
                onClose={() => setShowPayment(false)}
                onPaymentComplete={handlePurchaseComplete}
                isGuest={isGuest}
              />
            )}
          </>
        )
      ) : (
        <OptimizeForm onSubmit={handleSubmit} isLoading={isLoading} />
      )}
    </div>
  );
}