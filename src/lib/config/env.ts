// src/lib/config/env.ts

import { logError } from '../utils/error-logger';

function validateEnvVar(name: string, value?: string): string {
  if (!value) {
    logError(`Missing required environment variable: ${name}`, 'error', {
      variable: name,
      nodeEnv: process.env.NODE_ENV,
    });
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const envConfig = {
  mongodb: {
    uri: validateEnvVar('MONGODB_URI', process.env.MONGODB_URI),
    dbName: 'smartaicopy'
  },
  openai: {
    apiKey: validateEnvVar('OPENAI_API_KEY', process.env.OPENAI_API_KEY),
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
  },
  stripe: {
    publishableKey: validateEnvVar('STRIPE_PUBLISHABLE_KEY', process.env.STRIPE_PUBLISHABLE_KEY),
    secretKey: validateEnvVar('STRIPE_SECRET_KEY', process.env.STRIPE_SECRET_KEY),
    webhookSecret: validateEnvVar('STRIPE_WEBHOOK_SECRET', process.env.STRIPE_WEBHOOK_SECRET)
  },
  nodeEnv: process.env.NODE_ENV
};