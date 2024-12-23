// src/lib/stripe/types.ts

export interface StripeConfig {
    publishableKey: string;
    testMode: boolean;
  }
  
  export interface PaymentIntent {
    id: string;
    clientSecret: string;
    amount: number;
    status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'canceled';
  }
  
  export interface PaymentMethodResponse {
    id: string;
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
  }
  
  export interface StripeError {
    type: 'card_error' | 'validation_error' | 'api_error';
    code?: string;
    message: string;
  }