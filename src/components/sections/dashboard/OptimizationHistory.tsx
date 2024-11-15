// src/components/sections/dashboard/OptimizationHistory.tsx
'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useAuth } from '@/lib/auth/auth-context';
import { OptimizationResult, OptimizationHistoryResponse } from '@/lib/api/content/types';

export default function OptimizationHistory() {
  const { isLoggedIn } = useAuth();
  const [history, setHistory] = useState<OptimizationResult[]>([]);
  const [pagination, setPagination] = useState<OptimizationHistoryResponse['pagination'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    async function fetchHistory() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/optimize/history');
        if (!response.ok) {
          throw new Error('Failed to fetch optimization history');
        }
        const data: OptimizationHistoryResponse = await response.json();
        setHistory(data.results);
        setPagination(data.pagination);
      } catch (err) {
        setError('Failed to load optimization history');
        console.error('History fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  if (loading) {
    return (
      <div className="w-full flex justify-center p-8" role="status">
        <div className="animate-pulse text-gray-500">
          <span className="sr-only">Loading optimization history...</span>
          Loading history...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4">
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-600" role="alert">
            {error}
          </p>
        </Card>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="w-full p-4">
        <Card className="p-6">
          <p className="text-gray-500 text-center">
            No optimization history yet. Try optimizing some content!
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {history.map((result) => (
        <Card key={result._id} className="p-4 hover:bg-gray-50 transition-colors">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-start">
              <div className="text-sm text-gray-500">
                {new Date(result.metadata.timestamp).toLocaleDateString()} at{' '}
                {new Date(result.metadata.timestamp).toLocaleTimeString()}
              </div>
              <div className="text-sm font-medium">
                {result.metadata.wordCount.toLocaleString()} words • ${result.metadata.price}
              </div>
            </div>
            <div className="prose max-w-none">
              <h3 className="text-lg font-medium mb-2">
                {result.metadata.titles?.[0] || 'Optimized Content'}
              </h3>
              <p className="text-gray-600 line-clamp-3">
                {result.optimizedContent}
              </p>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="flex gap-2">
                {result.metadata.keywords?.slice(0, 3).map((keyword, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {/* Add detail view later */}}
                className="!w-auto"
                aria-label={`View details for optimization from ${new Date(result.metadata.timestamp).toLocaleDateString()}`}
              >
                View Details →
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}