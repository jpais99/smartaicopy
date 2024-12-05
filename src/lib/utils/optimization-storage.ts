// src/lib/utils/optimization-storage.ts

import { OptimizeResponse } from '@/lib/api/content/types';

interface StoredOptimization {
  results: OptimizeResponse;
  timestamp: number;
  status: 'preview' | 'processing' | 'completed' | 'failed';
}

export function savePendingOptimization(results: OptimizeResponse, status: StoredOptimization['status'] = 'preview') {
  localStorage.setItem('pending_optimization', JSON.stringify({
    results,
    timestamp: Date.now(),
    status
  }));
}

export function getPendingOptimization(): StoredOptimization | null {
  const stored = localStorage.getItem('pending_optimization');
  if (!stored) return null;

  const data: StoredOptimization = JSON.parse(stored);
  
  // Only restore if less than 30 minutes old
  if (Date.now() - data.timestamp < 30 * 60 * 1000) {
    return data;
  }

  localStorage.removeItem('pending_optimization');
  return null;
}

export function clearPendingOptimization() {
  localStorage.removeItem('pending_optimization');
}

export function hasPendingOptimization(): boolean {
  return getPendingOptimization() !== null;
}