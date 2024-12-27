// src/components/sections/optimize/PaymentModal.tsx

'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { OptimizeResponse } from '@/lib/api/content/types';
import { useAuth } from '@/lib/auth/auth-context';
import { saveOptimizationState } from '@/lib/utils/state-preservation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PaymentForm({ 
  onError, 
  price,
  results 
}: { 
  onError: (message: string) => void;
  price: number;
  results: OptimizeResponse;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      onError('Payment system not ready. Please try again.');
      return;
    }

    setIsProcessing(true);

    try {
      saveOptimizationState(results, 'preview', false);

      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/optimize?from=payment&restore=true`,
        }
      });

      if (confirmError) {
        throw confirmError;
      }

    } catch (err) {
      onError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="max-h-[50vh] overflow-y-auto">
        <PaymentElement />
      </div>
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        isLoading={isProcessing}
        className="w-full focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        {isProcessing ? 'Processing...' : `Pay $${price}`}
      </Button>
    </form>
  );
}

interface PaymentModalProps {
  results: OptimizeResponse;
  onClose: () => void;
  onPaymentComplete: () => void;
  isGuest?: boolean;
}

export default function PaymentModal({ 
  results, 
  onClose, 
  onPaymentComplete,
  isGuest = false
}: PaymentModalProps) {
  const { isLoggedIn } = useAuth();
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const previewText = results.optimizedContent
    .split(/[.!?]/)
    .filter(sentence => sentence.trim())[0]
    .trim() + '...';

  const price = results.wordCount <= 1500 ? 10 : 15;

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const response = await fetch('/api/payment/intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: price * 100,
            isGuest
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to initialize payment');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize payment');
      }
    };

    initializePayment();
  }, [price, isGuest]);

  if (!clientSecret) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card variant="primary" className="w-full max-w-md">
          <div className="p-4 text-center">
            <p className="text-secondary">Initializing payment system...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card variant="primary" className="w-full max-w-md">
        <div className="space-y-6 p-4">
          <div className="text-center">
            <h3 className="text-lg font-medium">Complete Your Purchase</h3>
            <p className="mt-2 text-secondary">
              {results.wordCount.toLocaleString()} words optimization
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-background/50 rounded-lg text-sm">
              <h4 className="font-medium mb-2">Preview of optimized content:</h4>
              <p className="text-secondary italic">{previewText}</p>
            </div>

            <div className="border-t border-b border-foreground/10 py-4">
              <div className="flex justify-between items-center">
                <span>Amount:</span>
                <span className="text-lg font-medium">${price}</span>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-center" role="alert">
                {error}
              </div>
            )}

            <Elements 
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: { theme: 'stripe' }
              }}
            >
              <PaymentForm
                onError={setError}
                price={price}
                results={results}
              />
            </Elements>

            <Button 
              onClick={onClose} 
              variant="secondary" 
              className="w-full focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Cancel
            </Button>

            <p className="text-xs text-center text-secondary">
              Secure payment processing powered by Stripe
              {process.env.NODE_ENV === 'development' && ' • Test mode'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}