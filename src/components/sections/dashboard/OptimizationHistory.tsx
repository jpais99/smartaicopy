// src/components/sections/dashboard/OptimizationHistory.tsx

'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useAuth } from '@/lib/auth/auth-context';
import { OptimizationResult } from '@/lib/api/content/types';
import OptimizationDetails from './OptimizationDetails';

interface OptimizationHistoryProps {
  onHistoryLoad?: () => void;
}

export default function OptimizationHistory({ onHistoryLoad }: OptimizationHistoryProps) {
  const { isLoggedIn } = useAuth();
  const [history, setHistory] = useState<OptimizationResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptimization, setSelectedOptimization] = useState<OptimizationResult | null>(null);

  const fetchHistory = async () => {
    try {
      console.log('Fetching history for page:', currentPage);
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/optimize/history?page=${currentPage}&limit=5`);
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error('Failed to fetch optimization history');
      }
      const data = await response.json();
      console.log('Received data:', data);
      setHistory(data.results);
      setTotalPages(data.pagination.pages);
      if (onHistoryLoad) {
        onHistoryLoad();
      }
    } catch (err) {
      console.error('History fetch error:', err);
      setError('Failed to load optimization history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('User not logged in, skipping fetch');
      return;
    }

    fetchHistory();
  }, [isLoggedIn, currentPage]);

  // Add refresh method
  const refreshHistory = () => {
    if (isLoggedIn) {
      fetchHistory();
    }
  };

  if (!isLoggedIn) return null;

  if (loading && history.length === 0) {
    return (
      <div 
        className="w-full flex justify-center p-8" 
        role="status" 
        aria-label="Loading optimization history"
      >
        <div className="flex items-center space-x-2 text-secondary">
          <svg 
            className="animate-spin h-5 w-5" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading history...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="w-full p-4 text-red-600 bg-red-50 rounded-lg" 
        role="alert"
      >
        <p className="font-medium">Error loading history</p>
        <p className="text-sm mt-1">{error}</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setCurrentPage(1)}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-secondary text-center">
          No optimization history yet. Try optimizing some content!
        </p>
      </Card>
    );
  }

  if (selectedOptimization) {
    return (
      <OptimizationDetails
        optimization={selectedOptimization}
        onClose={() => setSelectedOptimization(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {history.map((result) => (
          <Card key={result._id} className="p-4 hover:bg-background/80 transition-colors">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-start">
                <div className="text-sm text-secondary">
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
                <p className="text-secondary line-clamp-2">
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
                  onClick={() => setSelectedOptimization(result)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
            className="!w-auto"
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-secondary">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
            className="!w-auto"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}