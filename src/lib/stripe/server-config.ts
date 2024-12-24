// src/lib/stripe/server-config.ts

import Stripe from 'stripe';
import { envConfig } from '../config/env';

// Server-side only Stripe instance
export const stripe = new Stripe(envConfig.stripe.secretKey, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});