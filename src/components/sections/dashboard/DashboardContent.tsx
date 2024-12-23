// src/components/sections/dashboard/DashboardContent.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import OptimizeForm from '@/components/sections/optimize/OptimizeForm';
import OptimizeResults from '@/components/sections/optimize/OptimizeResults';
import OptimizePreview from '@/components/sections/optimize/OptimizePreview';
import OptimizationHistory from '@/components/sections/dashboard/OptimizationHistory';
import AccountSettings from '@/components/sections/dashboard/AccountSettings';
import PaymentModal from '@/components/sections/optimize/PaymentModal';
import { OptimizeResponse } from '@/lib/api/content/types';
import { useAuth } from '@/lib/auth/auth-context';
import { saveOptimizationState, clearOptimizationState } from '@/lib/utils/state-preservation';
import Button from '@/components/common/Button';

export default function DashboardContent() {
  const { isLoggedIn } = useAuth();
  const [results, setResults] = useState<OptimizeResponse | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'optimize' | 'settings'>('optimize');

  const handleSubmit = async (data: {
    content: string;
    wordCount: number;
    price: number;
  }) => {
    setIsLoading(true);
    try {
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
      setShowForm(false);
      saveOptimizationState(result, 'preview', false);
    } catch (error) {
      console.error('Optimization failed:', error);
      // Handle error display to user here
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchaseAttempt = () => {
    setShowPayment(true);
  };

  const handlePurchaseComplete = async () => {
    setIsPaid(true);
    setShowPayment(false);
    if (results) {
      saveOptimizationState(results, 'completed', true);
      // Trigger history refresh
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setResults(null);
    setIsPaid(false);
    setShowPayment(false);
    setShowForm(true);
    clearOptimizationState();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-foreground/10 -mb-4">
        <Button
          variant={activeTab === 'optimize' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('optimize')}
          className="!w-auto"
        >
          Optimize Content
        </Button>
        <Button
          variant={activeTab === 'settings' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('settings')}
          className="!w-auto"
        >
          Account Settings
        </Button>
      </div>

      {activeTab === 'optimize' ? (
        <>
          {/* Optimization Form or Results Section */}
          <div className="bg-background/50 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-medium">
                {showForm ? 'Optimize New Content' : 'Optimization Results'}
              </h2>
            </div>

            {showForm ? (
              <OptimizeForm onSubmit={handleSubmit} isLoading={isLoading} />
            ) : (
              results && (
                isPaid ? (
                  <OptimizeResults results={results} onReset={handleReset} />
                ) : (
                  <>
                    <OptimizePreview 
                      results={results} 
                      onPurchase={handlePurchaseAttempt}
                      isGuest={false}
                    />
                    {showPayment && (
                      <PaymentModal
                        results={results}
                        onClose={() => setShowPayment(false)}
                        onPaymentComplete={handlePurchaseComplete}
                        isGuest={false}
                      />
                    )}
                  </>
                )
              )
            )}
          </div>

          {/* History Section */}
          {isLoggedIn && (
            <div className="bg-background/50 rounded-lg p-6">
              <h2 className="text-xl font-medium mb-6">Recent Optimizations</h2>
              <OptimizationHistory key={refreshKey} />
            </div>
          )}
        </>
      ) : (
        <AccountSettings />
      )}
    </div>
  );
}