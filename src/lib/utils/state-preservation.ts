// src/lib/utils/state-preservation.ts
import { OptimizeResponse } from '@/lib/api/content/types';

interface StoredOptimization {
 results: OptimizeResponse;
 status: 'preview' | 'completed';
 timestamp: number;
 isPaid: boolean;
 paymentPending: boolean;  // Added flag
}

// 30-minute expiration for temporary stored results
const STORAGE_EXPIRATION = 30 * 60 * 1000;

export function saveOptimizationState(
  results: OptimizeResponse,
  status: 'preview' | 'completed',
  isPaid: boolean = false,
  paymentPending: boolean = false
) {
  const state: StoredOptimization = {
    results,
    status,
    isPaid,
    paymentPending,
    timestamp: Date.now()
  };
  
  console.log('[Storage] Saving state:', state);
  localStorage.setItem('pendingOptimization', JSON.stringify(state));
}

export function getOptimizationState(): StoredOptimization | null {
  const stored = localStorage.getItem('pendingOptimization');
  console.log('[Storage] Retrieved raw state:', stored);
  
  if (!stored) return null;

  const state = JSON.parse(stored) as StoredOptimization;
  console.log('[Storage] Parsed state:', state);
  
  if (Date.now() - state.timestamp > STORAGE_EXPIRATION) {
    console.log('[Storage] State expired');
    localStorage.removeItem('pendingOptimization');
    return null;
  }

  return state;
}

export function clearOptimizationState() {
 localStorage.removeItem('pendingOptimization');
}

// Save the path to return to after auth
export function setReturnPath(path: string) {
 localStorage.setItem('authReturnPath', path);
}

export function getReturnPath(): string | null {
 return localStorage.getItem('authReturnPath');
}

export function clearReturnPath() {
 localStorage.removeItem('authReturnPath');
}