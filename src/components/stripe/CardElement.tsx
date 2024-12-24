// src/components/stripe/CardElement.tsx

'use client';

import { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { getStripePromise } from '@/lib/stripe/config';  // Updated import
import Button from '@/components/common/Button';

interface CardElementProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

// Inner component that uses Stripe hooks
function StripeCardForm({ clientSecret, onSuccess, onError }: CardElementProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/optimize`,
        },
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (error) {
      onError('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        isLoading={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  );
}

// Wrapper component that provides Stripe context
export default function CardElement({ clientSecret, onSuccess, onError }: CardElementProps) {
  const [mounted, setMounted] = useState(false);
  const stripePromise = getStripePromise();  // Moved inside component

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripeCardForm
        clientSecret={clientSecret}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}