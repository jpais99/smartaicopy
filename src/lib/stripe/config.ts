// src/lib/stripe/config.ts

import { loadStripe } from '@stripe/stripe-js';
import { StripeConfig } from './types';

// Client-side configuration
export const getStripeConfig = (): StripeConfig => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error('Missing Stripe publishable key');
  }
  return {
    publishableKey,
    testMode: true  // Force test mode while using test keys
  };
};

let stripePromise: Promise<any> | null = null;

// Initialize client-side Stripe instance
export const getStripePromise = () => {
  if (!stripePromise) {
    const config = getStripeConfig();
    stripePromise = loadStripe(config.publishableKey);
  }
  return stripePromise;
};