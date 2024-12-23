// src/lib/stripe/config.ts

import { loadStripe } from '@stripe/stripe-js';
import { StripeConfig } from './types';

// Client-side configuration
export const getStripeConfig = (): StripeConfig => {
  return {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    testMode: process.env.NODE_ENV !== 'production'
  };
};

// Initialize client-side Stripe instance
export const getStripePromise = () => {
  const config = getStripeConfig();
  return loadStripe(config.publishableKey);
};

// Helper to determine if we should use demo payment flow
export const useDemoPayment = (isTestAccount: boolean = false): boolean => {
  return process.env.NODE_ENV === 'development' || 
         process.env.NEXT_PUBLIC_PAYMENT_TEST_MODE === 'true' ||
         isTestAccount;
};